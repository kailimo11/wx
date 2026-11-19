/*
 姓名：温馨 | 学号：24001010328 | 时间：2026-11-19 | 大模型：DeepSeek-V4.1-Flash
 文件说明：数据库测试路由
*/
const express = require('express');
const { cheney_postTestConnection } = require('../controllers/Cheney_dbController');

const cheney_router = express.Router();

cheney_router.post('/test', cheney_postTestConnection);

module.exports = cheney_router;
