<!--
姓名：温馨 | 学号：24001010328 | 时间：2026-11-19 | 大模型：DeepSeek-V4.1-Flash
-->

# 接口记录（Cheney_interface.md）

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
  "database": "cheney_zhihu"
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
    "database": "cheney_zhihu",
    "version": "8.4.6",
    "tables": ["Cheney_gallery", "Cheney_news"],
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
