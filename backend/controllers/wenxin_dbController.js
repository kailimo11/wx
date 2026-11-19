/*
 姓名：温馨 | 学号：24001010328 | 时间：2026-11-19 | 大模型：DeepSeek-V4.1-Flash
 文件说明：数据库连接测试控制器
*/
const { wenxin_testConnection } = require('../config/wenxin_db');

/* POST /api/db/test 使用表单输入的账号密码测试 MySQL 连接 */
async function wenxin_postTestConnection(req, res) {
  const { user, password, host, database } = req.body || {};
  if (!user || typeof password !== 'string' || password === '') {
    return res.json({ code: 4001, msg: '用户名和密码不能为空', data: null });
  }
  try {
    const wenxin_result = await wenxin_testConnection({
      user: user.trim(),
      password,
      host: (host || 'localhost').trim(),
      database: (database || '').trim()
    });
    res.json({
      code: 0,
      msg: '数据库连接成功',
      data: {
        api: '/api/db/test',
        host: (host || 'localhost').trim(),
        database: wenxin_result.currentDb,
        version: wenxin_result.version,
        tables: wenxin_result.tables,
        tableCount: wenxin_result.tables.length
      }
    });
  } catch (err) {
    console.error('[wenxin 数据库连接失败]', err.message);
    res.json({
      code: 5004,
      msg: '数据库连接失败：' + err.message,
      data: null
    });
  }
}

module.exports = { wenxin_postTestConnection };
