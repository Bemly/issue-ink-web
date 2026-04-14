# IssueInk (Web-IssueInk)

纯前端 GitHub Issues 博客系统 —— 零构建、零后端、白嫖 GitHub 全家桶

## 项目简介

IssueInk 是一个纯客户端博客系统，直接通过 GitHub REST API 获取仓库的 Issues 作为博客文章，Markdown 渲染后展示在浏览器中。无需服务器、无需构建工具、无需数据库。

- 博客文章 = GitHub Issues
- 评论区 = GitHub Issue Comments
- 分类 = GitHub Labels / Milestones
- 托管 = GitHub Pages（免费）

## 技术栈

- 纯 Vanilla JS + ES Modules
- [Octokit](https://github.com/octokit/octokit.js)（GitHub API 客户端，通过 esm.sh CDN 加载）
- [Marked](https://github.com/markedjs/marked)（Markdown 解析器，通过 esm.sh CDN 加载）
- GitHub Pages 部署

## 快速开始

1. Fork 本仓库
2. 修改 `config.js`：
   - `OWNER` — 你的 GitHub 用户名
   - `REPO` — 你的仓库名（Issues 作为博客文章）
   - `ACCESS_TOKEN` — GitHub Personal Access Token（可选，空字符串 = 未认证模式 60次/小时，设置 Token = 5000次/小时）
3. 在你的仓库中创建 Issues，每篇 Issue 就是一篇博客文章
4. 开启 GitHub Pages，即可访问

## 本地开发

无需安装任何依赖，直接用静态文件服务器启动：

```bash
python3 -m http.server 8000
# 或
npx serve .
```

然后打开 `http://localhost:8000`。

## 项目结构

```
├── index.html                 # 入口 HTML
├── config.js                  # 配置（Token、Owner、Repo）
├── issueink-core/
│   ├── issueApi.js            # GitHub Issues API 封装
│   ├── issue2vanilla.js       # 主渲染逻辑
│   ├── wikiApi.js             # Wiki 抽取（未完成）
│   └── simple/                # GitHub API 示例响应 JSON
├── CNAME                      # GitHub Pages 自定义域名
├── LICENSE                    # MPL-2.0
└── CLAUDE.md                  # Claude Code 开发指南
```

## License

[Mozilla Public License 2.0](LICENSE)
