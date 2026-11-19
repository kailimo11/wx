/*
 姓名：温馨 | 学号：24001010328 | 时间：2026-11-19 | 大模型：DeepSeek-V4.1-Flash
 文件说明：图文列表数据模型（Cheney_gallery 表）
*/
const { cheney_pool } = require('../config/Cheney_db');

/* 查询图文列表，支持分页与分类筛选 */
async function cheney_findGalleryList({ page = 1, pageSize = 12, category = '' }) {
  const cheney_offset = (page - 1) * pageSize;
  const cheney_hasCategory = Boolean(category);
  const cheney_where = cheney_hasCategory ? 'WHERE category = ?' : '';
  const cheney_params = cheney_hasCategory ? [category] : [];

  const [cheney_rows] = await cheney_pool.query(
    `SELECT id, title, description, image_url, category, author, likes, created_at
       FROM Cheney_gallery
       ${cheney_where}
      ORDER BY likes DESC, id ASC
      LIMIT ? OFFSET ?`,
    [...cheney_params, Number(pageSize), Number(cheney_offset)]
  );
  const [cheney_totalRows] = await cheney_pool.query(
    `SELECT COUNT(*) AS total FROM Cheney_gallery ${cheney_where}`,
    cheney_params
  );
  return { list: cheney_rows, total: cheney_totalRows[0].total };
}

/* 查询全部分类，用于前端筛选 */
async function cheney_findGalleryCategories() {
  const [cheney_rows] = await cheney_pool.query(
    'SELECT DISTINCT category FROM Cheney_gallery ORDER BY category ASC'
  );
  return cheney_rows.map((row) => row.category);
}

module.exports = { cheney_findGalleryList, cheney_findGalleryCategories };
