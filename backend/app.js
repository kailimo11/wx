/*
 姓名：温馨 | 学号：24001010328 | 时间：2026-11-19 | 大模型：DeepSeek-V4.1-Flash
 文件说明：Express 应用入口，统一注册中间件、静态资源、路由，端口固定 8328
*/
const path = require('path');
const express = require('express');
const cors = require('cors');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const Cheney_newsRoutes = require('./routes/Cheney_newsRoutes');
const Cheney_galleryRoutes = require('./routes/Cheney_galleryRoutes');
const Cheney_dbRoutes = require('./routes/Cheney_dbRoutes');

const cheney_app = express();
const CHENEY_PORT = 8328;

/* 支持所有跨域访问 */
cheney_app.use(cors({ origin: '*', methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'] }));

/* 解析 JSON 与表单请求体 */
cheney_app.use(express.json());
cheney_app.use(express.urlencoded({ extended: true }));

/* 以 express.static 托管 frontend 目录 */
cheney_app.use(express.static(path.join(__dirname, '..', 'frontend')));

/* 健康检查 */
cheney_app.get('/api/health', (req, res) => {
  res.json({ code: 0, msg: '服务运行正常', data: { port: CHENEY_PORT, time: new Date().toISOString() } });
});

/* 业务路由 */
cheney_app.use('/api/news', Cheney_newsRoutes);
cheney_app.use('/api/gallery', Cheney_galleryRoutes);
cheney_app.use('/api/db', Cheney_dbRoutes);

/* 404 处理 */
cheney_app.use((req, res) => {
  res.status(404).json({ code: 404, msg: `接口不存在：${req.method} ${req.originalUrl}`, data: null });
});

/* 统一错误处理 */
cheney_app.use((err, req, res, next) => {
  console.error('[Cheney 服务端错误]', err);
  res.status(500).json({ code: 500, msg: err.message || '服务器内部错误', data: null });
});

cheney_app.listen(CHENEY_PORT, () => {
  console.log(`知乎的模仿与制作 - 后端服务已启动：http://localhost:${CHENEY_PORT}`);
});
