/*
 姓名：温馨 | 学号：24001010328 | 时间：2026-11-19 | 大模型：DeepSeek-V4.1-Flash
 文件说明：科技新闻控制器
*/
const { wenxin_findNewsList, wenxin_findNewsById } = require('../models/wenxin_newsModel');

/* GET /api/news 新闻分页列表 */
async function wenxin_getNewsList(req, res) {
  try {
    const wenxin_page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const wenxin_pageSize = Math.min(50, Math.max(1, parseInt(req.query.pageSize, 10) || 10));
    const wenxin_keyword = (req.query.keyword || '').trim();
    const wenxin_result = await wenxin_findNewsList({
      page: wenxin_page,
      pageSize: wenxin_pageSize,
      keyword: wenxin_keyword
    });
    res.json({
      code: 0,
      msg: '新闻列表查询成功',
      data: {
        api: '/api/news',
        page: wenxin_page,
        pageSize: wenxin_pageSize,
        keyword: wenxin_keyword,
        total: wenxin_result.total,
        list: wenxin_result.list
      }
    });
  } catch (err) {
    console.error('[wenxin 新闻列表查询失败]', err);
    res.json({ code: 5001, msg: '新闻列表查询失败：' + err.message, data: null });
  }
}

/* GET /api/news/:id 新闻详情 */
async function wenxin_getNewsDetail(req, res) {
  try {
    const wenxin_news = await wenxin_findNewsById(req.params.id);
    if (!wenxin_news) {
      return res.json({ code: 4041, msg: '该新闻不存在', data: null });
    }
    res.json({ code: 0, msg: '新闻详情查询成功', data: { api: '/api/news/' + req.params.id, news: wenxin_news } });
  } catch (err) {
    console.error('[wenxin 新闻详情查询失败]', err);
    res.json({ code: 5002, msg: '新闻详情查询失败：' + err.message, data: null });
  }
}

module.exports = { wenxin_getNewsList, wenxin_getNewsDetail };
