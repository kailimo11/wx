/*
 姓名：温馨 | 学号：24001010328 | 时间：2026-11-19 | 大模型：DeepSeek-V4.1-Flash
 文件说明：图文列表路由
*/
const express = require('express');
const { wenxin_getGalleryList } = require('../controllers/wenxin_galleryController');

const wenxin_router = express.Router();

wenxin_router.get('/', wenxin_getGalleryList);

module.exports = wenxin_router;
