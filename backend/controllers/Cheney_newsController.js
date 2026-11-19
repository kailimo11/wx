/*
 姓名：温馨 | 学号：24001010328 | 时间：2026-11-19 | 大模型：DeepSeek-V4.1-Flash
 文件说明：科技新闻控制器
*/
const { cheney_findNewsList, cheney_findNewsById } = require('../models/Cheney_newsModel');

/* GET /api/news 新闻分页列表 */
async function cheney_getNewsList(req, res) {
  try {
    const cheney_page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const cheney_pageSize = Math.min(50, Math.max(1, parseInt(req.query.pageSize, 10) || 10));
    const cheney_keyword = (req.query.keyword || '').trim();
    const cheney_result = await cheney_findNewsList({
      page: cheney_page,
      pageSize: cheney_pageSize,
      keyword: cheney_keyword
    });
    res.json({
      code: 0,
      msg: '新闻列表查询成功',
      data: {
        api: '/api/news',
        page: cheney_page,
        pageSize: cheney_pageSize,
        keyword: cheney_keyword,
        total: cheney_result.total,
        list: cheney_result.list
      }
    });
  } catch (err) {
    console.error('[Cheney 新闻列表查询失败]', err);
    res.json({ code: 5001, msg: '新闻列表查询失败：' + err.message, data: null });
  }
}

/* GET /api/news/:id 新闻详情 */
async function cheney_getNewsDetail(req, res) {
  try {
    const cheney_news = await cheney_findNewsById(req.params.id);
    if (!cheney_news) {
      return res.json({ code: 4041, msg: '该新闻不存在', data: null });
    }
    res.json({ code: 0, msg: '新闻详情查询成功', data: { api: '/api/news/' + req.params.id, news: cheney_news } });
  } catch (err) {
    console.error('[Cheney 新闻详情查询失败]', err);
    res.json({ code: 5002, msg: '新闻详情查询失败：' + err.message, data: null });
  }
}

module.exports = { cheney_getNewsList, cheney_getNewsDetail };
