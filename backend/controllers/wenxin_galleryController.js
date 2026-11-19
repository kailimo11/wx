/*
 姓名：温馨 | 学号：24001010328 | 时间：2026-11-19 | 大模型：DeepSeek-V4.1-Flash
 文件说明：图文列表控制器
*/
const { wenxin_findGalleryList, wenxin_findGalleryCategories } = require('../models/wenxin_galleryModel');

/* GET /api/gallery 图文分页列表 */
async function wenxin_getGalleryList(req, res) {
  try {
    const wenxin_page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const wenxin_pageSize = Math.min(50, Math.max(1, parseInt(req.query.pageSize, 10) || 12));
    const wenxin_category = (req.query.category || '').trim();
    const wenxin_result = await wenxin_findGalleryList({
      page: wenxin_page,
      pageSize: wenxin_pageSize,
      category: wenxin_category
    });
    const wenxin_categories = await wenxin_findGalleryCategories();
    res.json({
      code: 0,
      msg: '图文列表查询成功',
      data: {
        api: '/api/gallery',
        page: wenxin_page,
        pageSize: wenxin_pageSize,
        category: wenxin_category,
        categories: wenxin_categories,
        total: wenxin_result.total,
        list: wenxin_result.list
      }
    });
  } catch (err) {
    console.error('[wenxin 图文列表查询失败]', err);
    res.json({ code: 5003, msg: '图文列表查询失败：' + err.message, data: null });
  }
}

module.exports = { wenxin_getGalleryList };
