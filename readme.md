<!--
姓名：温馨 | 学号：24001010328 | 时间：2026-11-19 | 大模型：DeepSeek-V4.1-Flash
-->

# 知乎的模仿与制作

- 姓名：温馨（wenxin）
- 学号：24001010328
- 项目类别：模仿（自选）
- 技术栈：原生 HTML / CSS / JavaScript + Node.js + Express + MySQL

## 项目简介

本项目用于模仿知乎的内容浏览体验，包含项目首页（Canvas 背景动画）、数据库连接测试、科技新闻列表、图文列表四个页面。
前端不使用任何第三方库、框架与 CDN；后端提供 RESTful 接口并以 `express.static` 托管前端目录；数据持久化在 MySQL。

## 目录结构

```
温馨全栈开发/
├─ AGENTS.md                 # 项目开发规则
├─ readme.md                 # 项目说明（本文件）
├─ start_backend.bat         # 一键启动后端
├─ wenxin_prompt.md          # 提示词记录
├─ frontend/                 # 前端（原生三件套）
│  ├─ index.html             # 首页：Canvas 背景动画 + 页面导航
│  ├─ database.html          # 数据库连接测试
│  ├─ news.html              # 科技新闻列表
│  ├─ gallery.html           # 图文列表
│  ├─ css/  js/  fonts/  images/
└─ backend/                  # 后端（Node.js + Express，MVC）
   ├─ app.js                 # 入口，端口 8328
   ├─ config/  controllers/  models/  routes/
   ├─ .env                   # 数据库凭据（已加入 .gitignore）
   ├─ wenxin_interface.md    # 接口记录
   └─ wenxin_database.md     # 数据库记录（可完整重建库表）
```

## 启动方式

1. 确认已安装 Node.js（24 以上）与 MySQL，并在 `backend/.env` 中配置 `DB_USER`、`DB_PASSWORD`、`DB_HOST`、`DB_NAME`。
2. 双击根目录 `start_backend.bat`（或进入 `backend/` 执行 `node app.js`）。
3. 浏览器访问 `http://localhost:8328/index.html`。

## 页面与接口

| 页面 | 地址 | 数据接口 |
| --- | --- | --- |
| 首页 | `/index.html` | — |
| 数据库连接测试 | `/database.html` | `POST /api/db/test` |
| 科技新闻列表 | `/news.html` | `GET /api/news` |
| 图文列表 | `/gallery.html` | `GET /api/gallery` |
| AI 聊天 | `/chat.html` | `POST /api/chat` |
| 知识库管理与问答 | `/knowledge.html` | `GET /api/kb/files`、`POST /api/kb/upload`、`DELETE /api/kb/files/:id`、`GET /api/kb/files/:id/chunks`、`POST /api/kb/ask` |

## 数据库

- 库名：`wenxin_zhihu`，字符集 `utf8mb4`
- 数据表：`wenxin_news`（科技新闻，10 条测试数据）、`wenxin_gallery`（图文列表，8 条测试数据）、`wenxin_kb_files`（知识库文件，2 个示例文件）、`wenxin_kb_chunks`（知识库分块，10 条）
- 建库、建表与测试数据语句见 `backend/wenxin_database.md`

## 知识库（RAG）

- 示例知识库文件：`backend/knowledge/wenxin_客服FAQ.txt`、`backend/knowledge/wenxin_产品与服务说明.docx`
- 支持格式：txt、md、pdf、doc、docx、ppt、pptx、csv、rtf
- 流程：上传 → 解析文本 → 按 320 字切分（重叠 60 字）入库 → 提问时关键词打分检索 TopK → 拼接资料交给大模型作答并返回引用来源
