/*
 姓名：温馨 | 学号：24001010328 | 时间：2026-11-19 | 大模型：DeepSeek-V4.1-Flash
 文件说明：MySQL 连接池与连接测试（凭据全部来自 .env，不写死在代码中）
*/
const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

/* 业务连接池 */
const wenxin_pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  charset: 'utf8mb4'
});

/* 使用用户输入的凭据测试连接，返回服务器信息与库表情况 */
async function wenxin_testConnection({ user, password, host, database }) {
  const wenxin_conn = await mysql.createConnection({
    host: host || 'localhost',
    user,
    password,
    database: database || undefined,
    connectTimeout: 8000
  });
  try {
    const [wenxin_versionRows] = await wenxin_conn.query('SELECT VERSION() AS version, DATABASE() AS currentDb');
    const [wenxin_tables] = await wenxin_conn.query('SHOW TABLES');
    return {
      version: wenxin_versionRows[0].version,
      currentDb: wenxin_versionRows[0].currentDb,
      tables: wenxin_tables.map((row) => Object.values(row)[0])
    };
  } finally {
    await wenxin_conn.end();
  }
}

module.exports = { wenxin_pool, wenxin_testConnection };
