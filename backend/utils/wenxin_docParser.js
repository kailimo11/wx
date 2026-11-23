/*
 姓名：温馨 | 学号：24001010328 | 时间：2026-11-23 | 大模型：DeepSeek-V4.1-Flash
 文件说明：知识库文档解析（支持 txt/md/pdf/doc/docx/ppt/pptx/csv/rtf）
*/
const fs = require('fs');
const path = require('path');
const { OfficeConverter } = require('officeparser');
const WordExtractor = require('word-extractor');

/* 纯文本类：直接读文件，UTF-8 失败时尝试 GBK */
function wenxin_readPlainText(wenxin_filePath) {
  const wenxin_buffer = fs.readFileSync(wenxin_filePath);
  let wenxin_text = wenxin_buffer.toString('utf8');
  const wenxin_badCount = (wenxin_text.match(/\uFFFD/g) || []).length;
  if (wenxin_badCount > wenxin_text.length * 0.01) {
    try {
      wenxin_text = new TextDecoder('gbk').decode(wenxin_buffer);
    } catch (wenxin_err) {
      /* 保留 UTF-8 结果 */
    }
  }
  return wenxin_text;
}

/* 老版 .doc（97-2003 二进制）使用 word-extractor */
async function wenxin_readLegacyDoc(wenxin_filePath) {
  const wenxin_extractor = new WordExtractor();
  const wenxin_doc = await wenxin_extractor.extract(wenxin_filePath);
  return wenxin_doc.getBody() || '';
}

/* 老版 .ppt（二进制）无成熟解析库，做可读文本启发式提取 */
function wenxin_readLegacyPpt(wenxin_filePath) {
  const wenxin_buffer = fs.readFileSync(wenxin_filePath);
  const wenxin_utf16 = wenxin_buffer.toString('utf16le');
  const wenxin_matches = wenxin_utf16.match(/[\u4e00-\u9fa5\w，。、；：？！（）《》“”%\-.,:;?!()\s]{6,}/g) || [];
  return wenxin_matches.join(' ').replace(/\s{2,}/g, ' ').trim();
}

/* 统一入口：返回纯文本 */
async function wenxin_extractText(wenxin_filePath, wenxin_ext) {
  const wenxin_suffix = (wenxin_ext || path.extname(wenxin_filePath)).toLowerCase();

  if (['.txt', '.md', '.log'].includes(wenxin_suffix)) {
    return wenxin_readPlainText(wenxin_filePath);
  }
  if (wenxin_suffix === '.doc') {
    return wenxin_readLegacyDoc(wenxin_filePath);
  }
  if (wenxin_suffix === '.ppt') {
    return wenxin_readLegacyPpt(wenxin_filePath);
  }

  /* docx / pptx / pdf / csv / rtf / html 等由 officeparser 处理 */
  const wenxin_result = await OfficeConverter.convert(wenxin_filePath, 'text');
  return typeof wenxin_result.value === 'string'
    ? wenxin_result.value
    : String((wenxin_result.value && wenxin_result.value.text) || '');
}

module.exports = { wenxin_extractText };
