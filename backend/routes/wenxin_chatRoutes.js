/*
 姓名：温馨 | 学号：24001010328 | 时间：2026-11-23 | 大模型：DeepSeek-V4.1-Flash
 文件说明：AI 聊天路由
*/
const express = require('express');
const { wenxin_postChat } = require('../controllers/wenxin_chatController');

const wenxin_router = express.Router();

wenxin_router.post('/', wenxin_postChat);

module.exports = wenxin_router;
