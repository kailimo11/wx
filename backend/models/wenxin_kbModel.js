/*
 姓名：温馨 | 学号：24001010328 | 时间：2026-11-23 | 大模型：DeepSeek-V4.1-Flash
 文件说明：知识库数据模型（wenxin_kb_files / wenxin_kb_chunks）
*/
const { wenxin_pool } = require('../config/wenxin_db');

/* 查询全部知识库文件 */
async function wenxin_findFiles() {
  const [wenxin_rows] = await wenxin_pool.query(
    `SELECT id, original_name, ext, file_size, char_count, chunk_count, status, created_at
       FROM wenxin_kb_files
      ORDER BY id DESC`
  );
  return wenxin_rows;
}

/* 新增文件记录，返回自增 ID */
async function wenxin_insertFile(wenxin_file) {
  const [wenxin_result] = await wenxin_pool.query(
    `INSERT INTO wenxin_kb_files (original_name, file_name, ext, mime_type, file_size, char_count, chunk_count, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      wenxin_file.originalName,
      wenxin_file.fileName,
      wenxin_file.ext,
      wenxin_file.mimeType || '',
      wenxin_file.fileSize || 0,
      wenxin_file.charCount || 0,
      wenxin_file.chunkCount || 0,
      wenxin_file.status || 'ready'
    ]
  );
  return wenxin_result.insertId;
}

/* 批量写入分块 */
async function wenxin_insertChunks(wenxin_fileId, wenxin_chunks) {
  if (!wenxin_chunks.length) {
    return 0;
  }
  const wenxin_values = wenxin_chunks.map((wenxin_content, wenxin_index) => [
    wenxin_fileId,
    wenxin_index,
    wenxin_content,
    wenxin_content.length
  ]);
  const [wenxin_result] = await wenxin_pool.query(
    'INSERT INTO wenxin_kb_chunks (file_id, chunk_index, content, char_count) VALUES ?',
    [wenxin_values]
  );
  return wenxin_result.affectedRows;
}

/* 查询全部（或指定文件）分块，用于检索 */
async function wenxin_findChunks(wenxin_fileId) {
  const wenxin_sql =
    `SELECT c.id, c.file_id, c.chunk_index, c.content, f.original_name
       FROM wenxin_kb_chunks c
       JOIN wenxin_kb_files f ON f.id = c.file_id` +
    (wenxin_fileId ? ' WHERE c.file_id = ?' : '') +
    ' ORDER BY c.file_id ASC, c.chunk_index ASC';
  const [wenxin_rows] = await wenxin_pool.query(wenxin_sql, wenxin_fileId ? [wenxin_fileId] : []);
  return wenxin_rows;
}

/* 删除文件（外键级联删除分块） */
async function wenxin_deleteFile(wenxin_fileId) {
  const [wenxin_result] = await wenxin_pool.query('DELETE FROM wenxin_kb_files WHERE id = ?', [wenxin_fileId]);
  return wenxin_result.affectedRows;
}

module.exports = {
  wenxin_findFiles,
  wenxin_insertFile,
  wenxin_insertChunks,
  wenxin_findChunks,
  wenxin_deleteFile
};
