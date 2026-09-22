# 变更记录

## 2026-09-22 15:11:23

### 改动内容

- 将 rem 样式的动态加载放进 `bootstrap`，避免顶层 await

### Commit Message

```
fix: 去掉入口文件的顶层 await
```

## 2026-09-22 15:10:12

### 改动内容

- `rem.scss` 改为仅在 `needRem` 为 true 时动态加载

### Commit Message

```
fix: 仅在开启 rem 时加载根字号样式
```

## 2026-09-22 15:01:31

### 改动内容

- html 根字号为 100px 时，将 UnoCSS 按 16px 根字号生成的 rem（无单位尺寸如 h-20、p-6，以及 xl 等命名尺寸）按 16/100 缩放，保持原来的设计像素
- 缩放排在 px→rem 之前，稿面 px 仍只按根字号换算一次

### Commit Message

```
fix: 适配根字号 100px 下的 UnoCSS 尺寸
```

## 2026-09-21 15:35:00

### 改动内容

- 顶栏右侧接入登录用户信息：已登录展示头像下拉（昵称 / 角色 / 控制台 / 退出），未登录展示登录按钮
- 新增 Mock 登录态（auth store、演示账号、登录页），刷新后可恢复当前用户

### Commit Message

```
feat: 顶栏接入登录用户信息与 Mock 登录
```

## 2026-09-18 11:05:00

### 改动内容

- 迁移调用日志页为表格示例（筛选、分页、状态标签、详情抽屉），数据改用 Mock
- 迁移我的账户页为卡片示例（额度进度卡片、消耗统计、额度修改记录），数据改用 Mock
- 补齐 PageContainer / SearchBar / BaseTable 空状态等页面基建，并在侧边栏「示例」分组挂载路由

### Commit Message

```
feat: 迁移调用日志与账户示例页并接入 Mock 数据
```

## 2026-09-18 10:50:00

### 改动内容

- 一级导航新增外部链接「天宽云」，指向 https://tokens.tiankuan.com/#/，新窗口打开

### Commit Message

```
feat: 一级导航增加天宽云外部链接
```

## 2026-09-18 10:15:39

### 改动内容

- 从天宽云控制台迁移 `console-layout` 布局（顶栏、侧边栏、面包屑、页脚、移动端抽屉）
- 去掉右上角登录用户信息，品牌信息改为静态配置
- 新增空白页路由 `/blank`，根路径重定向至该页
- 补充主题色、侧边栏宽度变量、Element Plus 图标与平台 Logo

### Commit Message

```
feat: 迁移控制台布局并新增空白路由
```

## 2026-08-20 14:09:00

### 改动内容

- 修复 UnoCSS 66.7 / 66.8 混用导致 `vite` 启动崩溃（`activatedRules` 为 undefined）
- 在 `pnpm-workspace.yaml` 增加 overrides，强制 `unocss` 及相关 `@unocss/*` 统一为 66.8.0

### Commit Message

```
fix: 统一 UnoCSS 版本以修复开发服务器启动失败
```

## 2026-07-21 16:55:00

### 改动内容

- 修复 `src/config/element.ts` 中 `NodeJS.Timeout` 类型在浏览器 tsconfig 下找不到命名空间的问题，改为 `ReturnType<typeof setTimeout>`

### Commit Message

```
fix: 修复 NProgress 定时器类型依赖 NodeJS 命名空间的问题
```

## 2026-05-20

### 改动内容

- 修复 `config/index.ts` 环境变量与 `.env` 对齐（`VITE_APP_API`、`VITE_APP_API_DOMAIN`）
- 移除缺失字体引用，`#root` 改为 `#app`
- 统一事件总线为 mitt，提供 `emitNeedLogin` 等辅助方法；fetch 401 触发登录流程
- `main.ts` 注册 Element Plus 插件，补充 NProgress 样式
- 清理历史残留：`shims.d.ts`、无效 loading、`@unhead/vue` 自动导入、echarts 分包、旧 outDir
- 构建输出改为 `dist/`，保留 `/cbm` 代理、版本更新检测、px→rem 方案
- 补充 `api/`、`pages/`、`layouts/`、`stores/`、`components/` 目录骨架与 README

### Commit Message

```
refactor: 优化空项目模板并修复构建与类型检查问题
```
