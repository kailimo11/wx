/*
 姓名：温馨 | 学号：24001010328 | 时间：2026-11-23 | 大模型：DeepSeek-V4.1-Flash
 文件说明：知识库控制器（上传解析、文件管理、分块检索、基于知识库的问答）
*/
const fs = require('fs');
const path = require('path');
const { wenxin_extractText } = require('../utils/wenxin_docParser');
const { wenxin_chunkText, wenxin_retrieve } = require('../utils/wenxin_rag');
const {
  wenxin_findFiles,
  wenxin_insertFile,
  wenxin_insertChunks,
  wenxin_findChunks,
  wenxin_deleteFile
} = require('../models/wenxin_kbModel');

const WENXIN_AI_URL = 'https://api.siliconflow.cn/v1/chat/completions';
const WENXIN_DEFAULT_MODEL = 'deepseek-ai/DeepSeek-V4-Flash';
const WENXIN_UPLOAD_DIR = path.join(__dirname, '..', 'uploads');

/* 确保上传目录存在 */
if (!fs.existsSync(WENXIN_UPLOAD_DIR)) {
  fs.mkdirSync(WENXIN_UPLOAD_DIR, { recursive: true });
}

/* GET /api/kb/files 文件列表 */
async function wenxin_getFiles(req, res) {
  try {
    const wenxin_files = await wenxin_findFiles();
    res.json({ code: 0, msg: '知识库文件查询成功', data: { api: '/api/kb/files', total: wenxin_files.length, list: wenxin_files } });
  } catch (wenxin_err) {
    console.error('[知识库] 文件列表查询失败：', wenxin_err);
    res.json({ code: 5008, msg: '文件列表查询失败：' + wenxin_err.message, data: null });
  }
}

/* POST /api/kb/upload 上传并解析文档 */
async function wenxin_uploadFile(req, res) {
  if (!req.file) {
    return res.json({ code: 4003, msg: '未接收到文件，请使用 form-data 的 file 字段上传', data: null });
  }
  const wenxin_ext = path.extname(req.file.originalname).toLowerCase();
  const wenxin_diskPath = req.file.path;
  const wenxin_originalName = Buffer.from(req.file.originalname, 'latin1').toString('utf8');

  try {
    const wenxin_text = (await wenxin_extractText(wenxin_diskPath, wenxin_ext)).trim();
    if (!wenxin_text) {
      fs.unlinkSync(wenxin_diskPath);
      return res.json({ code: 4004, msg: '未能从文件中解析出文本内容', data: null });
    }

    const wenxin_chunks = wenxin_chunkText(wenxin_text, 320, 60);
    const wenxin_fileId = await wenxin_insertFile({
      originalName: wenxin_originalName,
      fileName: req.file.filename,
      ext: wenxin_ext,
      mimeType: req.file.mimetype,
      fileSize: req.file.size,
      charCount: wenxin_text.length,
      chunkCount: wenxin_chunks.length,
      status: 'ready'
    });
    await wenxin_insertChunks(wenxin_fileId, wenxin_chunks);

    console.log(`[知识库] 上传解析完成：${wenxin_originalName}，${wenxin_text.length} 字，${wenxin_chunks.length} 个分块`);
    res.json({
      code: 0,
      msg: '文件上传并解析成功',
      data: {
        api: '/api/kb/upload',
        id: wenxin_fileId,
        originalName: wenxin_originalName,
        ext: wenxin_ext,
        fileSize: req.file.size,
        charCount: wenxin_text.length,
        chunkCount: wenxin_chunks.length
      }
    });
  } catch (wenxin_err) {
    console.error('[知识库] 文件解析失败：', wenxin_err);
    if (fs.existsSync(wenxin_diskPath)) {
      fs.unlinkSync(wenxin_diskPath);
    }
    res.json({ code: 5009, msg: '文件解析失败：' + wenxin_err.message, data: null });
  }
}

/* DELETE /api/kb/files/:id 删除文件及其分块 */
async function wenxin_removeFile(req, res) {
  try {
    const wenxin_affected = await wenxin_deleteFile(req.params.id);
    if (!wenxin_affected) {
      return res.json({ code: 4042, msg: '文件不存在', data: null });
    }
    res.json({ code: 0, msg: '文件已删除（分块级联清理）', data: { api: '/api/kb/files/' + req.params.id, id: Number(req.params.id) } });
  } catch (wenxin_err) {
    console.error('[知识库] 删除文件失败：', wenxin_err);
    res.json({ code: 5010, msg: '删除文件失败：' + wenxin_err.message, data: null });
  }
}

/* GET /api/kb/files/:id/chunks 查看文件分块 */
async function wenxin_getChunks(req, res) {
  try {
    const wenxin_chunks = await wenxin_findChunks(req.params.id);
    res.json({
      code: 0,
      msg: '分块查询成功',
      data: { api: '/api/kb/files/' + req.params.id + '/chunks', fileId: Number(req.params.id), total: wenxin_chunks.length, list: wenxin_chunks }
    });
  } catch (wenxin_err) {
    console.error('[知识库] 分块查询失败：', wenxin_err);
    res.json({ code: 5011, msg: '分块查询失败：' + wenxin_err.message, data: null });
  }
}

/* 调用大模型（与知识库上下文拼接） */
async function wenxin_callModel(wenxin_messages) {
  const wenxin_apiKey = process.env.SILICONFLOW_API_KEY;
  if (!wenxin_apiKey) {
    throw new Error('未配置 SILICONFLOW_API_KEY');
  }
  const wenxin_payload = {
    model: process.env.AI_MODEL || WENXIN_DEFAULT_MODEL,
    messages: wenxin_messages,
    temperature: 0.3,
    max_tokens: 1024,
    stream: false
  };

  console.log('[知识库问答] 发送给大模型的数据：', JSON.stringify(wenxin_payload));

  const wenxin_response = await fetch(WENXIN_AI_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + wenxin_apiKey },
    body: JSON.stringify(wenxin_payload)
  });
  const wenxin_text = await wenxin_response.text();
  console.log('[知识库问答] 从大模型接收到的数据：', wenxin_text.slice(0, 3000));

  let wenxin_data;
  try {
    wenxin_data = JSON.parse(wenxin_text);
  } catch (wenxin_parseErr) {
    wenxin_data = { raw: wenxin_text };
  }
  if (!wenxin_response.ok) {
    const wenxin_msg = (wenxin_data.error && wenxin_data.error.message) || ('HTTP ' + wenxin_response.status);
    throw new Error('大模型接口返回错误：' + wenxin_msg);
  }
  return { payload: wenxin_payload, data: wenxin_data };
}

/* POST /api/kb/ask 基于知识库的问答（RAG） */
async function wenxin_askQuestion(req, res) {
  const wenxin_question = String((req.body || {}).question || '').trim();
  const wenxin_topK = Math.min(8, Math.max(1, parseInt((req.body || {}).topK, 10) || 4));

  if (!wenxin_question) {
    return res.json({ code: 4006, msg: 'question 不能为空', data: null });
  }

  try {
    const wenxin_allChunks = await wenxin_findChunks();
    if (!wenxin_allChunks.length) {
      return res.json({ code: 4007, msg: '知识库为空，请先上传文档', data: null });
    }

    const wenxin_hits = wenxin_retrieve(wenxin_allChunks, wenxin_question, wenxin_topK);
    if (!wenxin_hits.length) {
      return res.json({
        code: 0,
        msg: '知识库中未检索到相关内容',
        data: {
          api: '/api/kb/ask',
          question: wenxin_question,
          answer: '抱歉，知识库中没有检索到与该问题相关的内容，请补充相关文档后再试。',
          sources: [],
          matchedChunks: 0
        }
      });
    }

    const wenxin_context = wenxin_hits
      .map((wenxin_hit, wenxin_index) =>
        `【资料${wenxin_index + 1}】来源：${wenxin_hit.original_name}（分块 ${wenxin_hit.chunk_index + 1}）\n${wenxin_hit.content}`)
      .join('\n\n');

    const wenxin_messages = [
      {
        role: 'system',
        content: '你是知识库客服助手。只能依据用户提供的【资料】回答问题，资料中没有的信息要明确说明不知道，不要编造。回答使用简洁的中文。'
      },
      {
        role: 'user',
        content: `以下是从知识库检索到的资料：\n\n${wenxin_context}\n\n用户问题：${wenxin_question}\n\n请依据资料作答，并在结尾标注引用的资料编号。`
      }
    ];

    const wenxin_result = await wenxin_callModel(wenxin_messages);
    const wenxin_answer = (wenxin_result.data.choices && wenxin_result.data.choices[0]
      && wenxin_result.data.choices[0].message && wenxin_result.data.choices[0].message.content) || '';

    res.json({
      code: 0,
      msg: '知识库问答成功',
      data: {
        api: '/api/kb/ask',
        question: wenxin_question,
        answer: wenxin_answer,
        model: wenxin_result.payload.model,
        usage: wenxin_result.data.usage || null,
        matchedChunks: wenxin_hits.length,
        sources: wenxin_hits.map((wenxin_hit) => ({
          fileId: wenxin_hit.file_id,
          fileName: wenxin_hit.original_name,
          chunkId: wenxin_hit.id,
          chunkIndex: wenxin_hit.chunk_index,
          score: wenxin_hit.score,
          content: wenxin_hit.content
        })),
        promptMessages: wenxin_messages,
        raw: wenxin_result.data
      }
    });
  } catch (wenxin_err) {
    console.error('[知识库] 问答失败：', wenxin_err);
    res.json({ code: 5012, msg: '知识库问答失败：' + wenxin_err.message, data: null });
  }
}

module.exports = { wenxin_getFiles, wenxin_uploadFile, wenxin_removeFile, wenxin_getChunks, wenxin_askQuestion };
