/*
 姓名：温馨 | 学号：24001010328 | 时间：2026-11-19 | 大模型：DeepSeek-V4.1-Flash
 文件说明：图文列表数据模型（wenxin_gallery 表）
*/
const { wenxin_pool } = require('../config/wenxin_db');

/* 查询图文列表，支持分页与分类筛选 */
async function wenxin_findGalleryList({ page = 1, pageSize = 12, category = '' }) {
  const wenxin_offset = (page - 1) * pageSize;
  const wenxin_hasCategory = Boolean(category);
  const wenxin_where = wenxin_hasCategory ? 'WHERE category = ?' : '';
  const wenxin_params = wenxin_hasCategory ? [category] : [];

  const [wenxin_rows] = await wenxin_pool.query(
    `SELECT id, title, description, image_url, category, author, likes, created_at
       FROM wenxin_gallery
       ${wenxin_where}
      ORDER BY likes DESC, id ASC
      LIMIT ? OFFSET ?`,
    [...wenxin_params, Number(pageSize), Number(wenxin_offset)]
  );
  const [wenxin_totalRows] = await wenxin_pool.query(
    `SELECT COUNT(*) AS total FROM wenxin_gallery ${wenxin_where}`,
    wenxin_params
  );
  return { list: wenxin_rows, total: wenxin_totalRows[0].total };
}

/* 查询全部分类，用于前端筛选 */
async function wenxin_findGalleryCategories() {
  const [wenxin_rows] = await wenxin_pool.query(
    'SELECT DISTINCT category FROM wenxin_gallery ORDER BY category ASC'
  );
  return wenxin_rows.map((row) => row.category);
}

module.exports = { wenxin_findGalleryList, wenxin_findGalleryCategories };
