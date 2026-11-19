/*
 姓名：温馨 | 学号：24001010328 | 时间：2026-11-19 | 大模型：DeepSeek-V4.1-Flash
 文件说明：图文列表路由
*/
const express = require('express');
const { cheney_getGalleryList } = require('../controllers/Cheney_galleryController');

const cheney_router = express.Router();

cheney_router.get('/', cheney_getGalleryList);

module.exports = cheney_router;
