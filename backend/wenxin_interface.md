<!--
姓名：温馨 | 学号：24001010328 | 时间：2026-11-19 | 大模型：DeepSeek-V4.1-Flash
-->

# 接口记录（wenxin_interface.md）

> 记录格式：接口路径 | HTTP 方法 | 请求参数（含示例）| 响应格式（含 JSON 示例）| 修改时间
> 统一响应包裹：`{ "code": 0, "msg": "提示信息", "data": {...} }`，`code=0` 成功，非 0 失败。
> 服务地址：`http://localhost:8328`

---

## 1. 健康检查

| 项目 | 内容 |
| --- | --- |
| 接口路径 | `/api/health` |
| HTTP 方法 | `GET` |
| 请求参数 | 无 |
| 修改时间 | 2026-11-19 21:20 |

响应示例：

```json
{
  "code": 0,
  "msg": "服务运行正常",
  "data": { "port": 8328, "time": "2026-11-19T13:20:00.000Z" }
}
```

---

## 2. 数据库连接测试

| 项目 | 内容 |
| --- | --- |
| 接口路径 | `/api/db/test` |
| HTTP 方法 | `POST` |
| 请求参数 | `Content-Type: application/json`，字段：`user` 用户名（必填）、`password` 密码（必填）、`host` 主机（可选，默认 localhost）、`database` 数据库名（可选） |
| 修改时间 | 2026-11-19 21:20 |

请求示例：

```json
{
  "user": "root",
  "password": "root",
  "host": "localhost",
  "database": "wenxin_zhihu"
}
```

成功响应示例：

```json
{
  "code": 0,
  "msg": "数据库连接成功",
  "data": {
    "api": "/api/db/test",
    "host": "localhost",
    "database": "wenxin_zhihu",
    "version": "8.4.6",
    "tables": ["wenxin_gallery", "wenxin_news"],
    "tableCount": 2
  }
}
```

失败响应示例：

```json
{
  "code": 5004,
  "msg": "数据库连接失败：Access denied for user 'root'@'localhost' (using password: YES)",
  "data": null
}
```

---

## 3. 科技新闻列表

| 项目 | 内容 |
| --- | --- |
| 接口路径 | `/api/news` |
| HTTP 方法 | `GET` |
| 请求参数 | `page` 页码（可选，默认 1）、`pageSize` 每页条数（可选，默认 10，最大 50）、`keyword` 关键字（可选，匹配标题/摘要/来源） |
| 修改时间 | 2026-11-19 21:20 |

请求示例：

```
GET /api/news?page=1&pageSize=10&keyword=芯片
```

响应示例：

```json
{
  "code": 0,
  "msg": "新闻列表查询成功",
  "data": {
    "api": "/api/news",
    "page": 1,
    "pageSize": 10,
    "keyword": "",
    "total": 10,
    "list": [
      {
        "id": 1,
        "title": "国产开源大模型刷新代码生成榜单纪录",
        "summary": "新一代国产开源大模型在主流代码生成评测集中超过同参数量级模型，推理速度提升 40%。",
        "source": "科技前线",
        "author": "陈默",
        "category": "人工智能",
        "views": 15230,
        "publish_time": "2026-11-19T01:20:00.000Z"
      }
    ]
  }
}
```

---

## 4. 科技新闻详情

| 项目 | 内容 |
| --- | --- |
| 接口路径 | `/api/news/:id` |
| HTTP 方法 | `GET` |
| 请求参数 | 路径参数 `id`：新闻 ID，示例 `/api/news/1` |
| 修改时间 | 2026-11-19 21:20 |

响应示例：

```json
{
  "code": 0,
  "msg": "新闻详情查询成功",
  "data": {
    "api": "/api/news/1",
    "news": {
      "id": 1,
      "title": "国产开源大模型刷新代码生成榜单纪录",
      "summary": "新一代国产开源大模型在主流代码生成评测集中超过同参数量级模型，推理速度提升 40%。",
      "content": "国产开源大模型团队今日发布最新版本……",
      "source": "科技前线",
      "author": "陈默",
      "category": "人工智能",
      "views": 15230,
      "publish_time": "2026-11-19T01:20:00.000Z"
    }
  }
}
```

不存在时响应示例：

```json
{ "code": 4041, "msg": "该新闻不存在", "data": null }
```

---

## 5. 图文列表

| 项目 | 内容 |
| --- | --- |
| 接口路径 | `/api/gallery` |
| HTTP 方法 | `GET` |
| 请求参数 | `page` 页码（可选，默认 1）、`pageSize` 每页条数（可选，默认 12，最大 50）、`category` 分类（可选） |
| 修改时间 | 2026-11-19 21:20 |

请求示例：

```
GET /api/gallery?page=1&pageSize=12&category=人工智能
```

响应示例：

```json
{
  "code": 0,
  "msg": "图文列表查询成功",
  "data": {
    "api": "/api/gallery",
    "page": 1,
    "pageSize": 12,
    "category": "",
    "categories": ["人工智能", "机器人", "硬件", "新能源", "前沿科学", "航天", "数字生活", "智慧城市"],
    "total": 8,
    "list": [
      {
        "id": 1,
        "title": "算力之城的夜晚",
        "description": "成排的 AI 服务器机柜在冷蓝光下运转，液冷管道的反光像城市的街道。",
        "image_url": "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=...&image_size=landscape_4_3",
        "category": "人工智能",
        "author": "陈默",
        "likes": 328,
        "created_at": "2026-11-19T13:10:00.000Z"
      }
    ]
  }
}
```

---

## 6. AI 聊天（代理硅基流动大模型）

| 项目 | 内容 |
| --- | --- |
| 接口路径 | `/api/chat` |
| HTTP 方法 | `POST` |
| 请求参数 | `Content-Type: application/json`；`messages` 消息数组（必填，元素含 `role` 与 `content`）；`model` 模型名（可选，默认取 `.env` 的 `AI_MODEL`，即 `deepseek-ai/DeepSeek-V4-Flash`） |
| 修改时间 | 2026-11-23 13:40 |

说明：密钥保存在 `backend/.env` 的 `SILICONFLOW_API_KEY`，由服务端转发至 `https://api.siliconflow.cn/v1/chat/completions`，前端不接触密钥；若 `messages` 中没有 `system` 角色，服务端会自动补充助手设定。

请求示例：

```json
{
  "messages": [
    { "role": "user", "content": "你好，请介绍一下你自己" }
  ]
}
```

成功响应示例：

```json
{
  "code": 0,
  "msg": "对话成功",
  "data": {
    "api": "/api/chat",
    "model": "deepseek-ai/DeepSeek-V4-Flash",
    "reply": "你好！我是你的智能助手，随时为你提供简洁、准确的帮助。",
    "usage": { "prompt_tokens": 19, "completion_tokens": 15, "total_tokens": 34 },
    "requestMessages": [
      { "role": "system", "content": "你是一个有用的助手，回答简洁准确，使用中文" },
      { "role": "user", "content": "你好，请介绍一下你自己" }
    ],
    "raw": { "id": "chatcmpl-xxx", "choices": [{ "message": { "content": "……" } }] }
  }
}
```

失败响应示例：

```json
{ "code": 5005, "msg": "未配置 SILICONFLOW_API_KEY，请在 backend/.env 中补充", "data": null }
```

```json
{ "code": 5006, "msg": "大模型接口返回错误：Invalid token", "data": {} }
```

---

## 7. 知识库文件列表

| 项目 | 内容 |
| --- | --- |
| 接口路径 | `/api/kb/files` |
| HTTP 方法 | `GET` |
| 请求参数 | 无 |
| 修改时间 | 2026-11-23 14:20 |

响应示例：

```json
{
  "code": 0,
  "msg": "知识库文件查询成功",
  "data": {
    "api": "/api/kb/files",
    "total": 2,
    "list": [
      {
        "id": 2,
        "original_name": "wenxin_产品与服务说明.docx",
        "ext": ".docx",
        "file_size": 5901,
        "char_count": 1340,
        "chunk_count": 5,
        "status": "ready",
        "created_at": "2026-11-23T05:59:11.000Z"
      }
    ]
  }
}
```

---

## 8. 知识库文件上传与解析

| 项目 | 内容 |
| --- | --- |
| 接口路径 | `/api/kb/upload` |
| HTTP 方法 | `POST` |
| 请求参数 | `multipart/form-data`，字段 `file`（必填）；支持 `.txt .md .pdf .doc .docx .ppt .pptx .csv .rtf`，单文件上限 20MB |
| 修改时间 | 2026-11-23 14:20 |

请求示例：

```
curl -X POST http://localhost:8328/api/kb/upload -F "file=@wenxin_客服FAQ.txt"
```

响应示例：

```json
{
  "code": 0,
  "msg": "文件上传并解析成功",
  "data": {
    "api": "/api/kb/upload",
    "id": 1,
    "originalName": "wenxin_客服FAQ.txt",
    "ext": ".txt",
    "fileSize": 3194,
    "charCount": 1258,
    "chunkCount": 5
  }
}
```

失败示例：

```json
{ "code": 4004, "msg": "未能从文件中解析出文本内容", "data": null }
```

---

## 9. 删除知识库文件

| 项目 | 内容 |
| --- | --- |
| 接口路径 | `/api/kb/files/:id` |
| HTTP 方法 | `DELETE` |
| 请求参数 | 路径参数 `id`：文件 ID，示例 `/api/kb/files/1`；删除文件时其分块由外键级联清除 |
| 修改时间 | 2026-11-23 14:20 |

响应示例：

```json
{ "code": 0, "msg": "文件已删除（分块级联清理）", "data": { "api": "/api/kb/files/1", "id": 1 } }
```

---

## 10. 查看文件分块

| 项目 | 内容 |
| --- | --- |
| 接口路径 | `/api/kb/files/:id/chunks` |
| HTTP 方法 | `GET` |
| 请求参数 | 路径参数 `id`：文件 ID，示例 `/api/kb/files/1/chunks` |
| 修改时间 | 2026-11-23 14:20 |

响应示例：

```json
{
  "code": 0,
  "msg": "分块查询成功",
  "data": {
    "api": "/api/kb/files/1/chunks",
    "fileId": 1,
    "total": 5,
    "list": [
      {
        "id": 1,
        "file_id": 1,
        "chunk_index": 0,
        "content": "温馨智联 · 客服常见问题（FAQ）……",
        "char_count": 268,
        "original_name": "wenxin_客服FAQ.txt"
      }
    ]
  }
}
```

---

## 11. 知识库问答（RAG）

| 项目 | 内容 |
| --- | --- |
| 接口路径 | `/api/kb/ask` |
| HTTP 方法 | `POST` |
| 请求参数 | `Content-Type: application/json`；`question` 问题（必填）；`topK` 引用资料段数（可选，默认 4，范围 1-8） |
| 修改时间 | 2026-11-23 14:20 |

说明：先对问题做中英文分词，按词频为全部分块打分取 TopK，再把资料与问题拼接后交给大模型作答；服务端与浏览器控制台均输出发送/接收数据。

请求示例：

```json
{ "question": "退货后多久能退款？", "topK": 4 }
```

成功响应示例：

```json
{
  "code": 0,
  "msg": "知识库问答成功",
  "data": {
    "api": "/api/kb/ask",
    "question": "退货后多久能退款？",
    "answer": "退货后，仓库验收通过后1至3个工作日内原路退回……【资料1】",
    "model": "deepseek-ai/DeepSeek-V4-Flash",
    "usage": { "prompt_tokens": 812, "completion_tokens": 96, "total_tokens": 908 },
    "matchedChunks": 4,
    "sources": [
      {
        "fileId": 1,
        "fileName": "wenxin_客服FAQ.txt",
        "chunkId": 2,
        "chunkIndex": 1,
        "score": 46,
        "content": "5. 退货后多久退款？……"
      }
    ],
    "promptMessages": [
      { "role": "system", "content": "你是知识库客服助手……" },
      { "role": "user", "content": "以下是从知识库检索到的资料：……" }
    ]
  }
}
```

未检索到资料时：

```json
{
  "code": 0,
  "msg": "知识库中未检索到相关内容",
  "data": { "api": "/api/kb/ask", "answer": "抱歉，知识库中没有检索到与该问题相关的内容，请补充相关文档后再试。", "sources": [], "matchedChunks": 0 }
}
```

