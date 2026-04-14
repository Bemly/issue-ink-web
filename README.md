# IssueInk

纯前端 GitHub Issues 博客系统 —— 用 ReScript 编写，零后端、白嫖 GitHub 全家桶

## 项目简介

IssueInk 是一个纯客户端博客系统，使用 ReScript 编写，通过 GitHub REST API 获取仓库的 Issues 作为博客文章，Markdown 渲染后展示在浏览器中。

- 博客文章 = GitHub Issues
- 评论区 = GitHub Issue Comments
- 分类 = GitHub Labels
- 托管 = GitHub Pages（免费）

## 功能特性

- 文章列表（分页浏览）
- 文章详情（Markdown 渲染）
- 评论区展示
- Labels 标签筛选
- 标题搜索过滤
- URL 哈希路由（支持浏览器前进/后退）
- 响应式布局 + 暗色模式

## 技术栈

- [ReScript](https://rescript-lang.org/) 12.x — 类型安全的函数式语言，编译为 JS
- [esbuild](https://esbuild.github.io/) — 快速打包
- [Marked](https://github.com/markedjs/marked) — Markdown 解析（CDN 加载）
- GitHub REST API — 通过 `fetch` 直接调用
- GitHub Pages 部署

## 快速开始

```bash
# 克隆仓库
git clone https://github.com/Bemly/issue-ink-web.git
cd issue-ink-web

# 安装依赖
npm install

# 构建
npm run build

# 本地预览
python3 -m http.server 8000
# 打开 http://localhost:8000
```

### 配置

编辑 `src/Config.res`：

```rescript
let owner = "你的GitHub用户名"
let repo = "你的仓库名"
let accessToken = "" // 留空 = 未认证(60次/小时)，填Token = 5000次/小时
```

然后在你的仓库中创建 Issues，每篇 Issue 就是一篇博客文章。

### 开发模式

```bash
npm run dev    # ReScript watch 模式，修改 .res 文件后自动重编译
```

## 项目结构

```
├── src/                        # ReScript 源码
│   ├── Config.res              # 配置
│   ├── GithubApi.res           # GitHub API 封装 + 类型定义
│   ├── Marked.res              # Markdown 解析绑定
│   ├── DomHelpers.res          # DOM 操作绑定
│   ├── Router.res              # 哈希路由
│   ├── App.res                 # 入口
│   ├── PostList.res            # 文章列表
│   ├── PostDetail.res          # 文章详情 + 评论
│   ├── Sidebar.res             # 侧边栏
│   └── Pagination.res          # 分页组件
├── dist/bundle.js              # 打包后的 JS（npm run build 生成）
├── index.html                  # 入口 HTML
├── style.css                   # 样式
├── rescript.json               # ReScript 配置
├── package.json                # npm 依赖
├── issueink-core/              # 旧版 JS 实现（已废弃，仅供参考）
├── CNAME                       # GitHub Pages 域名
├── LICENSE                     # MPL-2.0
└── CLAUDE.md                   # Claude Code 开发指南
```

## License

[Mozilla Public License 2.0](LICENSE)
