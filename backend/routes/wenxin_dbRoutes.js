/*
 姓名：温馨 | 学号：24001010328 | 时间：2026-11-19 | 大模型：DeepSeek-V4.1-Flash
 文件说明：数据库测试路由
*/
const express = require('express');
const { wenxin_postTestConnection } = require('../controllers/wenxin_dbController');

const wenxin_router = express.Router();

wenxin_router.post('/test', wenxin_postTestConnection);

module.exports = wenxin_router;
