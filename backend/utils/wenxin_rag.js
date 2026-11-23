/*
 姓名：温馨 | 学号：24001010328 | 时间：2026-11-23 | 大模型：DeepSeek-V4.1-Flash
 文件说明：轻量 RAG 工具（文本分块 + 关键词打分检索，无需额外向量库）
*/

/* 文本分块：按段落聚合到约 320 字，保留 60 字重叠 */
function wenxin_chunkText(wenxin_text, wenxin_chunkSize, wenxin_overlap) {
  const wenxin_size = wenxin_chunkSize || 320;
  const wenxin_skip = wenxin_overlap === undefined ? 60 : wenxin_overlap;
  const wenxin_clean = String(wenxin_text || '').replace(/\r/g, '').replace(/[ \t]+\n/g, '\n').trim();
  if (!wenxin_clean) {
    return [];
  }

  const wenxin_paragraphs = wenxin_clean.split(/\n{2,}/).map((wenxin_p) => wenxin_p.trim()).filter(Boolean);
  const wenxin_chunks = [];
  let wenxin_current = '';

  wenxin_paragraphs.forEach((wenxin_para) => {
    if ((wenxin_current + '\n' + wenxin_para).length <= wenxin_size) {
      wenxin_current = wenxin_current ? wenxin_current + '\n' + wenxin_para : wenxin_para;
      return;
    }
    if (wenxin_current) {
      wenxin_chunks.push(wenxin_current);
    }
    /* 单段超长时按长度硬切 */
    let wenxin_rest = wenxin_para;
    while (wenxin_rest.length > wenxin_size) {
      wenxin_chunks.push(wenxin_rest.slice(0, wenxin_size));
      wenxin_rest = wenxin_rest.slice(wenxin_size - wenxin_skip);
    }
    wenxin_current = wenxin_rest;
  });

  if (wenxin_current) {
    wenxin_chunks.push(wenxin_current);
  }
  return wenxin_chunks.filter((wenxin_item) => wenxin_item.trim().length > 0);
}

/* 查询分词：英文单词 + 中文二元组 */
function wenxin_tokenize(wenxin_query) {
  const wenxin_text = String(wenxin_query || '').toLowerCase();
  const wenxin_tokens = new Set();
  (wenxin_text.match(/[a-z0-9_]{2,}/g) || []).forEach((wenxin_word) => wenxin_tokens.add(wenxin_word));
  const wenxin_cjkRuns = wenxin_text.match(/[\u4e00-\u9fa5]+/g) || [];
  wenxin_cjkRuns.forEach((wenxin_run) => {
    if (wenxin_run.length <= 2) {
      wenxin_tokens.add(wenxin_run);
      return;
    }
    for (let wenxin_i = 0; wenxin_i < wenxin_run.length - 1; wenxin_i++) {
      wenxin_tokens.add(wenxin_run.slice(wenxin_i, wenxin_i + 2));
    }
  });
  return Array.from(wenxin_tokens);
}

/* 对候选分块打分：词频加权，命中词种类越多分越高 */
function wenxin_scoreChunk(wenxin_chunk, wenxin_tokens) {
  const wenxin_text = String(wenxin_chunk.content || '').toLowerCase();
  let wenxin_score = 0;
  let wenxin_hitKinds = 0;

  wenxin_tokens.forEach((wenxin_token) => {
    const wenxin_hits = wenxin_text.split(wenxin_token).length - 1;
    if (wenxin_hits > 0) {
      wenxin_hitKinds += 1;
      wenxin_score += Math.min(wenxin_hits, 6) * (wenxin_token.length >= 2 ? 2 : 1);
    }
  });
  if (!wenxin_hitKinds) {
    return 0;
  }
  /* 命中词种类加权，避免单个高频词刷分 */
  return wenxin_score + wenxin_hitKinds * 6;
}

/* 检索 TopK 分块 */
function wenxin_retrieve(wenxin_chunks, wenxin_query, wenxin_topK) {
  const wenxin_tokens = wenxin_tokenize(wenxin_query);
  const wenxin_ranked = wenxin_chunks
    .map((wenxin_chunk) => ({ ...wenxin_chunk, score: wenxin_scoreChunk(wenxin_chunk, wenxin_tokens) }))
    .filter((wenxin_chunk) => wenxin_chunk.score > 0)
    .sort((wenxin_a, wenxin_b) => wenxin_b.score - wenxin_a.score);
  return wenxin_ranked.slice(0, wenxin_topK || 4);
}

module.exports = { wenxin_chunkText, wenxin_tokenize, wenxin_retrieve };
