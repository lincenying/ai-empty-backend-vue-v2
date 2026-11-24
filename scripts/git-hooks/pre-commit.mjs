import { execFileSync } from 'node:child_process'
import { existsSync, readdirSync, realpathSync } from 'node:fs'
import { homedir } from 'node:os'
import { extname, join } from 'node:path'
import process from 'node:process'
import { pathToFileURL } from 'node:url'

const HOOK_NAME = '[pre-commit]'
const ESLINT_EXTENSION_PREFIX = 'dbaeumer.vscode-eslint-'
const LINT_BATCH_SIZE = 80

/** 交给 ESLint 的暂存文件后缀。忽略的文件由 --no-warn-ignored 跳过。 */
const LINT_EXTENSIONS = new Set([
    '.cjs',
    '.css',
    '.cts',
    '.gql',
    '.graphql',
    '.html',
    '.js',
    '.jsx',
    '.markdown',
    '.md',
    '.mjs',
    '.mts',
    '.scss',
    '.ts',
    '.tsx',
    '.vue',
])

/**
 * @typedef {'cursor' | 'vscode' | 'vscode-insiders'} EditorKind
 */

const EDITOR_LABEL = {
    'cursor': 'Cursor',
    'vscode': 'VS Code',
    'vscode-insiders': 'VS Code Insiders',
}

/**
 * 判断当前提交是否由 Cursor / VS Code 发起。
 * 进程树优先，环境变量用于图形界面提交和进程信息不可读时。
 * @returns {EditorKind | null} 编辑器类型；不是这两类编辑器时为空
 */
export function detectEditor() {
    return detectEditorFromProcessTree() ?? detectEditorFromEnv()
}

/**
 * 判断对应编辑器是否已安装官方 ESLint 插件。
 * @param {EditorKind} editor
 * @returns {boolean} 已安装官方 ESLint 插件时为 true
 */
export function hasEslintPlugin(editor) {
    return extensionRoots(editor).some((dir) => {
        if (!existsSync(dir))
            return false
        try {
            return readdirSync(dir).some(name => name.startsWith(ESLINT_EXTENSION_PREFIX))
        }
        catch {
            return false
        }
    })
}

/**
 * 对指定文件执行 ESLint，有错误时抛出带 status 的异常。
 * @param {string} root
 * @param {string[]} files
 */
export function lintFiles(root, files) {
    const eslintBin = join(root, 'node_modules', 'eslint', 'bin', 'eslint.js')
    if (!existsSync(eslintBin)) {
        throw new Error('未找到 eslint，请先执行 pnpm install')
    }

    for (let index = 0; index < files.length; index += LINT_BATCH_SIZE) {
        const batch = files.slice(index, index + LINT_BATCH_SIZE)
        execFileSync(process.execPath, [
            eslintBin,
            '--no-error-on-unmatched-pattern',
            '--no-warn-ignored',
            ...batch,
        ], {
            cwd: root,
            env: {
                ...process.env,
                // 项目 ESLint 配置见到该变量会按 hook 启用完整规则，而不是编辑器里的降级规则
                GIT_PARAMS: process.env.GIT_PARAMS || 'pre-commit',
            },
            stdio: 'inherit',
        })
    }
}

/**
 * 读取暂存区里需要交给 ESLint 的文件。
 * @param {string} root
 * @returns {string[]} 相对仓库根目录的暂存文件路径
 */
function listStagedLintFiles(root) {
    const output = execFileSync('git', [
        'diff',
        '--cached',
        '--name-only',
        '--diff-filter=ACMR',
        '-z',
    ], {
        cwd: root,
        encoding: 'buffer',
    })

    return output
        .toString('utf8')
        .split('\0')
        .filter(file => file && LINT_EXTENSIONS.has(extname(file).toLowerCase()))
}

/**
 * 沿父进程查找 Cursor 或 VS Code。
 * @returns {EditorKind | null} 识别到的编辑器；读不到进程信息时为空
 */
function detectEditorFromProcessTree() {
    if (process.platform === 'win32')
        return detectEditorFromWindowsProcessTree()

    let pid = process.ppid
    for (let depth = 0; depth < 20 && pid > 1; depth += 1) {
        let output = ''
        try {
            output = execFileSync('ps', ['-p', String(pid), '-o', 'ppid=,command='], {
                encoding: 'utf8',
                stdio: ['ignore', 'pipe', 'ignore'],
            })
        }
        catch {
            return null
        }

        const parsed = splitPidAndCommand(output)
        if (!parsed)
            return null

        const editor = classifyCommand(parsed.command)
        if (editor)
            return editor
        pid = parsed.pid
    }

    return null
}

/**
 * 在 Windows 上沿父进程查找 Cursor 或 VS Code。
 * @returns {EditorKind | null} 识别到的编辑器；读不到进程信息时为空
 */
function detectEditorFromWindowsProcessTree() {
    const script = `
        $processId = ${process.ppid}
        for ($i = 0; $i -lt 20 -and $processId -gt 1; $i++) {
            $proc = Get-CimInstance Win32_Process -Filter "ProcessId=$processId"
            if (-not $proc) { break }
            Write-Output $proc.CommandLine
            $processId = $proc.ParentProcessId
        }
    `
    try {
        const output = execFileSync('powershell.exe', ['-NoProfile', '-Command', script], {
            encoding: 'utf8',
            stdio: ['ignore', 'pipe', 'ignore'],
        })
        for (const line of output.split(/\r?\n/)) {
            const editor = classifyCommand(line)
            if (editor)
                return editor
        }
    }
    catch {
        return null
    }

    return null
}

/**
 * 用编辑器注入的环境变量判断来源。
 * @returns {EditorKind | null} 识别到的编辑器；环境变量没有编辑器痕迹时为空
 */
function detectEditorFromEnv() {
    const env = process.env
    const blob = [
        env.VSCODE_IPC_HOOK,
        env.VSCODE_GIT_ASKPASS_NODE,
        env.VSCODE_GIT_ASKPASS_MAIN,
        env.VSCODE_CODE_CACHE_PATH,
    ].filter(Boolean).join('\n')
    const hasCursorEnv = Object.keys(env).some(key => key.startsWith('CURSOR_'))
        || /[/\\]Cursor(?:\.app)?[/\\]/i.test(blob)

    if (hasCursorEnv)
        return 'cursor'

    const inVsCode = env.TERM_PROGRAM === 'vscode'
        || Boolean(env.VSCODE_PID)
        || env.VSCODE_INJECTION === '1'
        || Boolean(env.VSCODE_GIT_ASKPASS_NODE)
        || Boolean(env.VSCODE_GIT_IPC_HANDLE)
        || Boolean(env.VSCODE_IPC_HOOK)

    if (!inVsCode)
        return null
    if (/Insiders/i.test(blob))
        return 'vscode-insiders'
    return 'vscode'
}

/**
 * 根据进程命令行识别编辑器。
 * @param {string} command
 * @returns {EditorKind | null} 识别到的编辑器；命令行对不上时为空
 */
function classifyCommand(command) {
    if (/Cursor\.app|Cursor Helper|[/\\]Cursor(?:\.exe)?(?:\s|$)/i.test(command))
        return 'cursor'
    if (/Code - Insiders/i.test(command))
        return 'vscode-insiders'
    if (/Visual Studio Code|Code Helper|[/\\]Code\.app[/\\]|[/\\]Code(?:\.exe)?(?:\s|$)/i.test(command))
        return 'vscode'
    return null
}

/**
 * 拆开 `ps` 输出的父进程号和命令行。
 * @param {string} output
 * @returns {{ command: string, pid: number } | null} 解析结果；格式不符时为空
 */
function splitPidAndCommand(output) {
    const line = output.trim()
    const separator = line.search(/\s/)
    if (separator <= 0)
        return null

    const pid = Number(line.slice(0, separator))
    const command = line.slice(separator).trim()
    if (!Number.isInteger(pid) || pid <= 0 || !command)
        return null
    return { command, pid }
}

/**
 * 返回该编辑器的扩展目录。
 * @param {EditorKind} editor
 * @returns {string[]} 该编辑器可能存放扩展的目录
 */
function extensionRoots(editor) {
    const home = homedir()
    if (editor === 'cursor') {
        return [
            join(home, '.cursor', 'extensions'),
            join(home, '.cursor-server', 'extensions'),
        ]
    }
    if (editor === 'vscode-insiders') {
        return [
            join(home, '.vscode-insiders', 'extensions'),
            join(home, '.vscode-server-insiders', 'extensions'),
        ]
    }
    return [
        join(home, '.vscode', 'extensions'),
        join(home, '.vscode-server', 'extensions'),
    ]
}

/**
 * 取出子进程失败时的退出码。
 * @param {unknown} error
 * @returns {number} 应传给 git 的退出码
 */
function exitCodeOf(error) {
    if (typeof error === 'object' && error !== null && 'status' in error && typeof error.status === 'number')
        return error.status

    const message = error instanceof Error ? error.message : String(error)
    console.error(`${HOOK_NAME} ${message}`)
    return 1
}

/**
 * 按编辑器环境决定是否校验暂存文件。
 */
function main() {
    const root = execFileSync('git', ['rev-parse', '--show-toplevel'], {
        encoding: 'utf8',
    }).trim()
    const editor = detectEditor()

    if (editor && hasEslintPlugin(editor)) {
        console.log(`${HOOK_NAME} 检测到 ${EDITOR_LABEL[editor]} 已安装 ESLint 插件，跳过 ESLint 校验`)
        return
    }

    const files = listStagedLintFiles(root)
    if (files.length === 0)
        return

    const reason = editor
        ? `未检测到 ${EDITOR_LABEL[editor]} 的 ESLint 插件`
        : '当前不是 VS Code / Cursor'
    console.log(`${HOOK_NAME} ${reason}，开始校验 ${files.length} 个暂存文件`)

    try {
        lintFiles(root, files)
    }
    catch (error) {
        process.exitCode = exitCodeOf(error)
    }
}

/**
 * 仅在直接执行该文件时跑校验，被 import 时不触发。
 * @returns {boolean} 当前是直接执行该文件时为 true
 */
function isDirectRun() {
    const entry = process.argv[1]
    if (!entry)
        return false
    try {
        return import.meta.url === pathToFileURL(realpathSync(entry)).href
    }
    catch {
        return false
    }
}

if (isDirectRun())
    main()
