/*
 姓名：温馨 | 学号：24001010328 | 时间：2026-11-19 | 大模型：DeepSeek-V4.1-Flash
 文件说明：科技新闻路由
*/
const express = require('express');
const { wenxin_getNewsList, wenxin_getNewsDetail } = require('../controllers/wenxin_newsController');

const wenxin_router = express.Router();

wenxin_router.get('/', wenxin_getNewsList);
wenxin_router.get('/:id', wenxin_getNewsDetail);

module.exports = wenxin_router;
