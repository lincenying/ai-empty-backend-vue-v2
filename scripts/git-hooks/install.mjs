import { execFileSync } from 'node:child_process'
import { chmodSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, isAbsolute, join, resolve } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const MARKER = 'eslint-pre-commit'
const scriptDir = dirname(fileURLToPath(import.meta.url))

/**
 * 定位当前仓库的 git hooks 目录。不在仓库里时返回空。
 * @returns {string | null} hooks 目录绝对路径；当前目录不是 git 仓库时为空
 */
function resolveHooksDir() {
    try {
        const output = execFileSync('git', ['rev-parse', '--git-path', 'hooks'], {
            encoding: 'utf8',
            stdio: ['ignore', 'pipe', 'ignore'],
        }).trim()
        if (!output)
            return null
        return isAbsolute(output) ? output : resolve(output)
    }
    catch {
        return null
    }
}

/**
 * 把 pre-commit 安装到 .git/hooks，已有其他钩子时不覆盖。
 */
function installPreCommitHook() {
    const hooksDir = resolveHooksDir()
    if (!hooksDir)
        return

    const source = join(scriptDir, 'pre-commit')
    const target = join(hooksDir, 'pre-commit')
    const next = readFileSync(source, 'utf8')

    if (existsSync(target)) {
        const current = readFileSync(target, 'utf8')
        if (!current.includes(MARKER)) {
            console.warn('[git-hooks] 已存在自定义 pre-commit，未覆盖。请手动合并 scripts/git-hooks/pre-commit')
            return
        }
        if (current === next)
            return
    }

    mkdirSync(hooksDir, { recursive: true })
    writeFileSync(target, next, { mode: 0o755 })
    chmodSync(target, 0o755)
    console.log('[git-hooks] 已安装 pre-commit')
}

installPreCommitHook()
process.exitCode = 0
