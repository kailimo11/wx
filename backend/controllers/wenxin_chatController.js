/*
 姓名：温馨 | 学号：24001010328 | 时间：2026-11-23 | 大模型：DeepSeek-V4.1-Flash
 文件说明：AI 聊天控制器，服务端代理调用硅基流动大模型接口（密钥仅存于 .env）
*/
const wenxin_AI_URL = 'https://api.siliconflow.cn/v1/chat/completions';
const wenxin_DEFAULT_MODEL = 'deepseek-ai/DeepSeek-V4-Flash';
const wenxin_SYSTEM_PROMPT = '你是一个有用的助手，回答简洁准确，使用中文';

/* 校验并规范化前端传来的消息数组 */
function wenxin_normalizeMessages(wenxin_rawMessages) {
  if (!Array.isArray(wenxin_rawMessages)) {
    return [];
  }
  return wenxin_rawMessages
    .filter((wenxin_item) => wenxin_item && typeof wenxin_item.content === 'string' && wenxin_item.content.trim())
    .map((wenxin_item) => ({
      role: ['system', 'assistant', 'user'].includes(wenxin_item.role) ? wenxin_item.role : 'user',
      content: wenxin_item.content
    }));
}

/* POST /api/chat 转发对话请求到大模型 */
async function wenxin_postChat(req, res) {
  const wenxin_messages = wenxin_normalizeMessages((req.body || {}).messages);
  if (!wenxin_messages.length) {
    return res.json({ code: 4002, msg: 'messages 不能为空，且每项需包含 role 与 content', data: null });
  }

  const wenxin_apiKey = process.env.SILICONFLOW_API_KEY;
  if (!wenxin_apiKey) {
    return res.json({ code: 5005, msg: '未配置 SILICONFLOW_API_KEY，请在 backend/.env 中补充', data: null });
  }

  const wenxin_payload = {
    model: (req.body || {}).model || process.env.AI_MODEL || wenxin_DEFAULT_MODEL,
    messages: wenxin_messages.some((wenxin_item) => wenxin_item.role === 'system')
      ? wenxin_messages
      : [{ role: 'system', content: wenxin_SYSTEM_PROMPT }].concat(wenxin_messages),
    temperature: 0.7,
    max_tokens: 1024,
    stream: false
  };

  console.log('[AI 聊天] 发送给大模型的数据：', JSON.stringify(wenxin_payload));

  try {
    const wenxin_response = await fetch(wenxin_AI_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + wenxin_apiKey
      },
      body: JSON.stringify(wenxin_payload)
    });
    const wenxin_text = await wenxin_response.text();
    console.log('[AI 聊天] 从大模型接收到的数据：', wenxin_text.slice(0, 3000));

    let wenxin_data;
    try {
      wenxin_data = JSON.parse(wenxin_text);
    } catch (wenxin_parseErr) {
      wenxin_data = { raw: wenxin_text };
    }

    if (!wenxin_response.ok) {
      const wenxin_errMsg = (wenxin_data.error && wenxin_data.error.message) || ('HTTP ' + wenxin_response.status);
      return res.json({ code: 5006, msg: '大模型接口返回错误：' + wenxin_errMsg, data: wenxin_data });
    }

    const wenxin_reply = (wenxin_data.choices && wenxin_data.choices[0] && wenxin_data.choices[0].message
      && wenxin_data.choices[0].message.content) || '';

    res.json({
      code: 0,
      msg: '对话成功',
      data: {
        api: '/api/chat',
        model: wenxin_payload.model,
        reply: wenxin_reply,
        usage: wenxin_data.usage || null,
        requestMessages: wenxin_payload.messages,
        raw: wenxin_data
      }
    });
  } catch (wenxin_err) {
    console.error('[AI 聊天] 请求失败：', wenxin_err);
    res.json({ code: 5007, msg: '大模型请求失败：' + wenxin_err.message, data: null });
  }
}

module.exports = { wenxin_postChat };
