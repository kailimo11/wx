/*
 姓名：温馨 | 学号：24001010328 | 时间：2026-11-23 | 大模型：DeepSeek-V4.1-Flash
 文件说明：知识库路由（上传、文件管理、分块、问答）
*/
const path = require('path');
const fs = require('fs');
const express = require('express');
const multer = require('multer');

const {
  wenxin_getFiles,
  wenxin_uploadFile,
  wenxin_removeFile,
  wenxin_getChunks,
  wenxin_askQuestion
} = require('../controllers/wenxin_kbController');

const WENXIN_UPLOAD_DIR = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(WENXIN_UPLOAD_DIR)) {
  fs.mkdirSync(WENXIN_UPLOAD_DIR, { recursive: true });
}

/* 允许的知识库文件类型 */
const wenxin_allowedExt = ['.txt', '.md', '.pdf', '.doc', '.docx', '.ppt', '.pptx', '.csv', '.rtf'];

const wenxin_storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, WENXIN_UPLOAD_DIR),
  filename: (req, file, cb) => {
    const wenxin_suffix = path.extname(file.originalname).toLowerCase();
    cb(null, 'wenxin_kb_' + Date.now() + '_' + Math.round(Math.random() * 1e6) + wenxin_suffix);
  }
});

const wenxin_upload = multer({
  storage: wenxin_storage,
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const wenxin_suffix = path.extname(file.originalname).toLowerCase();
    if (!wenxin_allowedExt.includes(wenxin_suffix)) {
      return cb(new Error('不支持的文件类型：' + wenxin_suffix + '，仅支持 ' + wenxin_allowedExt.join(' ')));
    }
    cb(null, true);
  }
});

const wenxin_router = express.Router();

wenxin_router.get('/files', wenxin_getFiles);
wenxin_router.get('/files/:id/chunks', wenxin_getChunks);
wenxin_router.delete('/files/:id', wenxin_removeFile);
wenxin_router.post('/upload', wenxin_upload.single('file'), wenxin_uploadFile);
wenxin_router.post('/ask', wenxin_askQuestion);

module.exports = wenxin_router;
