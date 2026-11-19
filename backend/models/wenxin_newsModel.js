/*
 姓名：温馨 | 学号：24001010328 | 时间：2026-11-19 | 大模型：DeepSeek-V4.1-Flash
 文件说明：科技新闻数据模型（wenxin_news 表）
*/
const { wenxin_pool } = require('../config/wenxin_db');

/* 分页查询新闻列表，支持关键字模糊搜索 */
async function wenxin_findNewsList({ page = 1, pageSize = 10, keyword = '' }) {
  const wenxin_offset = (page - 1) * pageSize;
  const wenxin_like = `%${keyword}%`;
  const [wenxin_rows] = await wenxin_pool.query(
    `SELECT id, title, summary, source, author, category, views, publish_time
       FROM wenxin_news
      WHERE title LIKE ? OR summary LIKE ? OR source LIKE ?
      ORDER BY publish_time DESC
      LIMIT ? OFFSET ?`,
    [wenxin_like, wenxin_like, wenxin_like, Number(pageSize), Number(wenxin_offset)]
  );
  const [wenxin_totalRows] = await wenxin_pool.query(
    `SELECT COUNT(*) AS total FROM wenxin_news
      WHERE title LIKE ? OR summary LIKE ? OR source LIKE ?`,
    [wenxin_like, wenxin_like, wenxin_like]
  );
  return { list: wenxin_rows, total: wenxin_totalRows[0].total };
}

/* 按 ID 查询新闻详情 */
async function wenxin_findNewsById(id) {
  const [wenxin_rows] = await wenxin_pool.query(
    'SELECT id, title, summary, content, source, author, category, views, publish_time FROM wenxin_news WHERE id = ?',
    [id]
  );
  return wenxin_rows[0] || null;
}

module.exports = { wenxin_findNewsList, wenxin_findNewsById };
