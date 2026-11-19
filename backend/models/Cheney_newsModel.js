/*
 姓名：温馨 | 学号：24001010328 | 时间：2026-11-19 | 大模型：DeepSeek-V4.1-Flash
 文件说明：科技新闻数据模型（Cheney_news 表）
*/
const { cheney_pool } = require('../config/Cheney_db');

/* 分页查询新闻列表，支持关键字模糊搜索 */
async function cheney_findNewsList({ page = 1, pageSize = 10, keyword = '' }) {
  const cheney_offset = (page - 1) * pageSize;
  const cheney_like = `%${keyword}%`;
  const [cheney_rows] = await cheney_pool.query(
    `SELECT id, title, summary, source, author, category, views, publish_time
       FROM Cheney_news
      WHERE title LIKE ? OR summary LIKE ? OR source LIKE ?
      ORDER BY publish_time DESC
      LIMIT ? OFFSET ?`,
    [cheney_like, cheney_like, cheney_like, Number(pageSize), Number(cheney_offset)]
  );
  const [cheney_totalRows] = await cheney_pool.query(
    `SELECT COUNT(*) AS total FROM Cheney_news
      WHERE title LIKE ? OR summary LIKE ? OR source LIKE ?`,
    [cheney_like, cheney_like, cheney_like]
  );
  return { list: cheney_rows, total: cheney_totalRows[0].total };
}

/* 按 ID 查询新闻详情 */
async function cheney_findNewsById(id) {
  const [cheney_rows] = await cheney_pool.query(
    'SELECT id, title, summary, content, source, author, category, views, publish_time FROM Cheney_news WHERE id = ?',
    [id]
  );
  return cheney_rows[0] || null;
}

module.exports = { cheney_findNewsList, cheney_findNewsById };
