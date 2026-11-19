/*
 姓名：温馨 | 学号：24001010328 | 时间：2026-11-19 | 大模型：DeepSeek-V4.1-Flash
 文件说明：图文列表控制器
*/
const { cheney_findGalleryList, cheney_findGalleryCategories } = require('../models/Cheney_galleryModel');

/* GET /api/gallery 图文分页列表 */
async function cheney_getGalleryList(req, res) {
  try {
    const cheney_page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const cheney_pageSize = Math.min(50, Math.max(1, parseInt(req.query.pageSize, 10) || 12));
    const cheney_category = (req.query.category || '').trim();
    const cheney_result = await cheney_findGalleryList({
      page: cheney_page,
      pageSize: cheney_pageSize,
      category: cheney_category
    });
    const cheney_categories = await cheney_findGalleryCategories();
    res.json({
      code: 0,
      msg: '图文列表查询成功',
      data: {
        api: '/api/gallery',
        page: cheney_page,
        pageSize: cheney_pageSize,
        category: cheney_category,
        categories: cheney_categories,
        total: cheney_result.total,
        list: cheney_result.list
      }
    });
  } catch (err) {
    console.error('[Cheney 图文列表查询失败]', err);
    res.json({ code: 5003, msg: '图文列表查询失败：' + err.message, data: null });
  }
}

module.exports = { cheney_getGalleryList };
