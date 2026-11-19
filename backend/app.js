/*
 姓名：温馨 | 学号：24001010328 | 时间：2026-11-19 | 大模型：DeepSeek-V4.1-Flash
 文件说明：Express 应用入口，统一注册中间件、静态资源、路由，端口固定 8328
*/
const path = require('path');
const express = require('express');
const cors = require('cors');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const wenxin_newsRoutes = require('./routes/wenxin_newsRoutes');
const wenxin_galleryRoutes = require('./routes/wenxin_galleryRoutes');
const wenxin_dbRoutes = require('./routes/wenxin_dbRoutes');

const wenxin_app = express();
const wenxin_PORT = 8328;

/* 支持所有跨域访问 */
wenxin_app.use(cors({ origin: '*', methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'] }));

/* 解析 JSON 与表单请求体 */
wenxin_app.use(express.json());
wenxin_app.use(express.urlencoded({ extended: true }));

/* 以 express.static 托管 frontend 目录 */
wenxin_app.use(express.static(path.join(__dirname, '..', 'frontend')));

/* 健康检查 */
wenxin_app.get('/api/health', (req, res) => {
  res.json({ code: 0, msg: '服务运行正常', data: { port: wenxin_PORT, time: new Date().toISOString() } });
});

/* 业务路由 */
wenxin_app.use('/api/news', wenxin_newsRoutes);
wenxin_app.use('/api/gallery', wenxin_galleryRoutes);
wenxin_app.use('/api/db', wenxin_dbRoutes);

/* 404 处理 */
wenxin_app.use((req, res) => {
  res.status(404).json({ code: 404, msg: `接口不存在：${req.method} ${req.originalUrl}`, data: null });
});

/* 统一错误处理 */
wenxin_app.use((err, req, res, next) => {
  console.error('[wenxin 服务端错误]', err);
  res.status(500).json({ code: 500, msg: err.message || '服务器内部错误', data: null });
});

wenxin_app.listen(wenxin_PORT, () => {
  console.log(`知乎的模仿与制作 - 后端服务已启动：http://localhost:${wenxin_PORT}`);
});
