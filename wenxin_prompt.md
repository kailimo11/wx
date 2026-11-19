<!--
姓名：温馨 | 学号：24001010328 | 时间：2026-11-19 | 大模型：DeepSeek-V4.1-Flash
-->

# 提示词记录（wenxin_prompt.md）

> 记录格式：时间 | 提示词全文 | 大模型名称（一律追加写入，不覆盖历史内容）

## 2026-11-19 20:40 | 创建项目规则

提示词全文：

```
在当前项目根目录创建 AGENTS.md，写入以下规则。

## 项目结构与技术栈
- 前端：frontend/ 目录
  - 原生 HTML、CSS、JavaScript，禁止使用任何第三方库、框架、CDN 链接
  - 目录结构：frontend/ 下建 css/、js/、fonts/、images/ 子目录；fonts/ 存放 iconfont 图标文件（如果有）
- 后端：backend/ 目录，Node.js + Express，RESTful+MVC 风格，
  所有接口以 /api/ 为前缀，端口固定为 8328，
  并以 express.static 托管 frontend/ 目录，支持所有跨域访问。
- 后端依赖安装：优先 cnpm i 包名；失败或超时则使用 npm i 包名
- 数据库：MySQL；凭据写入 backend/.env（DB_USER、DB_PASSWORD、DB_HOST、DB_NAME），不得出现在代码或 AGENTS.md 中，.env 加入 .gitignore
- 根据后端的要求自行建立和修改数据库表，每张表建立后，插入至少 8 条有真实业务意义的测试数据
- CSS 类名、JS 变量名、JS 函数名、数据库表名（及字段相关命名）一律以 wenxin_ 开头
- 每个文件头部包含注释块：姓名：温馨 | 学号：24001010328 | 时间：yyyy-mm-dd | 大模型：{本次使用的大模型名称}
- 记录文件一律追加写入：wenxin_prompt.md、backend/wenxin_interface.md、backend/wenxin_database.md
- 统一 JSON 响应格式：{ "code": 0, "msg": "提示信息", "data": {...} }
- 服务器返回的数据和错误信息输出到浏览器控制台；新建 HTML 页面后在 frontend/index.html 追加超链接入口（detail 页面除外）
```

大模型名称：DeepSeek-V4.1-Flash

## 2026-11-19 21:00 | 初始化全栈项目并完成科技新闻、图文列表页面

提示词全文：

```
基于vibe coding的全栈项目的开发基本流程
（零）安装node.js，24以上版本，尽量已安装cnpm。
（一）创建项目（文件夹），设立规则AGENTS.md，修改给定提示词，也可自行设置提示词。
（二）初始化项目：
1、git init + .gitignore（排除 node_modules、.env）+ 首次提交
2、按 AGENTS.md 规则创建前后端目录骨架、安装依赖
3、创建前端首页 index.html，包括姓名wenxin、学号24001010328、项目名称：知乎的模仿与制作、
   项目类别（自选、模仿），所有完成的 html 页面的超链接。有 canvas 背景动画。主体是页面链接导航。页面美观。
4、创建 readme.md，在根目录下，包括学号、姓名。
（三）运行和查看项目：创建运行后台的 bat 文件，在根目录下。
（四）测试数据库链接：创建 database.html 页面，输入用户名、密码，链接数据库，成功和错误都有提示，默认用户名 root，密码 root。
（五）完成科技新闻列表页面，新闻数据存在数据库表里，网页显示后端接口链接和数据内容。
（六）完成图文列表，图片可以使用网络图片或创建图片，创建一个新的表，网页显示后端接口链接和数据内容。
```

大模型名称：DeepSeek-V4.1-Flash

## 2026-11-19 22:10 | 统一命名前缀为 wenxin_

提示词全文：

```
CSS 类名、JS 变量名、JS 函数名、数据库表名（及字段相关命名）一律以 `wenxin_` 开头。
```

大模型名称：DeepSeek-V4.1-Flash
