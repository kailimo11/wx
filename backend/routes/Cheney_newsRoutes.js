/*
 姓名：温馨 | 学号：24001010328 | 时间：2026-11-19 | 大模型：DeepSeek-V4.1-Flash
 文件说明：科技新闻路由
*/
const express = require('express');
const { cheney_getNewsList, cheney_getNewsDetail } = require('../controllers/Cheney_newsController');

const cheney_router = express.Router();

cheney_router.get('/', cheney_getNewsList);
cheney_router.get('/:id', cheney_getNewsDetail);

module.exports = cheney_router;
