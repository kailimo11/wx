/*
 姓名：温馨 | 学号：24001010328 | 时间：2026-11-23 | 大模型：DeepSeek-V4.1-Flash
 文件说明：AI 聊天页面逻辑（发送消息、渲染气泡、控制台输出请求与响应数据）
*/
(function () {
  var wenxin_API = '/api/chat';
  var wenxin_history = [];
  var wenxin_busy = false;

  var wenxin_messagesBox = document.getElementById('wenxin_chatMessages');
  var wenxin_input = document.getElementById('wenxin_chatInput');
  var wenxin_sendBtn = document.getElementById('wenxin_chatSend');
  var wenxin_clearBtn = document.getElementById('wenxin_chatClear');
  var wenxin_json = document.getElementById('wenxin_chatJson');
  var wenxin_jsonToggle = document.getElementById('wenxin_chatJsonToggle');

  /* 当前时间 HH:mm */
  function wenxin_now() {
    var wenxin_date = new Date();
    var wenxin_pad = function (wenxin_num) {
      return wenxin_num < 10 ? '0' + wenxin_num : '' + wenxin_num;
    };
    return wenxin_pad(wenxin_date.getHours()) + ':' + wenxin_pad(wenxin_date.getMinutes());
  }

  /* 追加一条消息气泡 */
  function wenxin_appendMessage(wenxin_role, wenxin_text) {
    var wenxin_isUser = wenxin_role === 'user';
    var wenxin_msg = document.createElement('div');
    wenxin_msg.className = 'wenxin_msg ' + (wenxin_isUser ? 'wenxin_msgUser' : 'wenxin_msgAssistant');

    var wenxin_avatar = document.createElement('div');
    wenxin_avatar.className = 'wenxin_msgAvatar';
    wenxin_avatar.textContent = wenxin_isUser ? '我' : 'AI';

    var wenxin_bubble = document.createElement('div');
    wenxin_bubble.className = 'wenxin_msgBubble';

    var wenxin_content = document.createElement('div');
    wenxin_content.className = 'wenxin_msgContent';
    wenxin_content.textContent = wenxin_text;

    var wenxin_time = document.createElement('div');
    wenxin_time.className = 'wenxin_msgTime';
    wenxin_time.textContent = wenxin_now();

    wenxin_bubble.appendChild(wenxin_content);
    wenxin_bubble.appendChild(wenxin_time);
    wenxin_msg.appendChild(wenxin_avatar);
    wenxin_msg.appendChild(wenxin_bubble);
    wenxin_messagesBox.appendChild(wenxin_msg);
    wenxin_messagesBox.scrollTop = wenxin_messagesBox.scrollHeight;
    return wenxin_content;
  }

  /* 显示“正在输入”并返回移除函数 */
  function wenxin_showTyping() {
    var wenxin_msg = document.createElement('div');
    wenxin_msg.className = 'wenxin_msg wenxin_msgAssistant';
    wenxin_msg.innerHTML =
      '<div class="wenxin_msgAvatar">AI</div>' +
      '<div class="wenxin_msgBubble"><div class="wenxin_typing"><span></span><span></span><span></span></div></div>';
    wenxin_messagesBox.appendChild(wenxin_msg);
    wenxin_messagesBox.scrollTop = wenxin_messagesBox.scrollHeight;
    return function () {
      if (wenxin_msg.parentNode) {
        wenxin_msg.parentNode.removeChild(wenxin_msg);
      }
    };
  }

  function wenxin_setBusy(wenxin_flag) {
    wenxin_busy = wenxin_flag;
    wenxin_sendBtn.disabled = wenxin_flag;
    wenxin_sendBtn.textContent = wenxin_flag ? '回复中……' : '发送';
  }

  /* 发送消息 */
  function wenxin_send() {
    var wenxin_text = wenxin_input.value.trim();
    if (!wenxin_text || wenxin_busy) {
      return;
    }

    wenxin_input.value = '';
    wenxin_history.push({ role: 'user', content: wenxin_text });
    wenxin_appendMessage('user', wenxin_text);
    wenxin_setBusy(true);
    var wenxin_removeTyping = wenxin_showTyping();

    var wenxin_payload = { messages: wenxin_history };
    console.log('[AI 聊天] 发送给大模型的数据：', wenxin_payload);

    fetch(wenxin_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(wenxin_payload)
    })
      .then(function (wenxin_res) {
        if (!wenxin_res.ok) {
          throw new Error('HTTP 状态码异常：' + wenxin_res.status);
        }
        return wenxin_res.json();
      })
      .then(function (wenxin_result) {
        console.log('[AI 聊天] 从大模型接收到的数据：', wenxin_result);
        wenxin_json.textContent = JSON.stringify(wenxin_result, null, 2);
        wenxin_removeTyping();

        if (wenxin_result.code !== 0) {
          wenxin_appendMessage('assistant', '请求失败：' + (wenxin_result.msg || '未知错误'));
          return;
        }

        var wenxin_reply = (wenxin_result.data && wenxin_result.data.reply) || '（模型未返回内容）';
        wenxin_history.push({ role: 'assistant', content: wenxin_reply });
        wenxin_appendMessage('assistant', wenxin_reply);

        if (wenxin_result.data && wenxin_result.data.usage) {
          console.log('[AI 聊天] Token 用量：', wenxin_result.data.usage);
        }
      })
      .catch(function (wenxin_err) {
        console.error('[AI 聊天] 请求失败：', wenxin_err);
        if (wenxin_removeTyping) {
          wenxin_removeTyping();
        }
        wenxin_appendMessage('assistant', '聊天请求失败：' + wenxin_err.message);
        wenxin_json.textContent = JSON.stringify({ code: -1, msg: wenxin_err.message, data: null }, null, 2);
      })
      .finally(function () {
        wenxin_setBusy(false);
        wenxin_input.focus();
      });
  }

  /* 发送按钮 */
  wenxin_sendBtn.addEventListener('click', wenxin_send);

  /* Enter 发送，Shift + Enter 换行 */
  wenxin_input.addEventListener('keydown', function (wenxin_event) {
    if (wenxin_event.key === 'Enter' && !wenxin_event.shiftKey) {
      wenxin_event.preventDefault();
      wenxin_send();
    }
  });

  /* 输入框自适应高度 */
  wenxin_input.addEventListener('input', function () {
    wenxin_input.style.height = 'auto';
    wenxin_input.style.height = Math.min(wenxin_input.scrollHeight, 160) + 'px';
  });

  /* 清空对话 */
  wenxin_clearBtn.addEventListener('click', function () {
    wenxin_history = [];
    wenxin_messagesBox.innerHTML = '';
    wenxin_json.textContent = '等待请求……';
    wenxin_input.value = '';
    wenxin_input.focus();
    console.log('[AI 聊天] 对话已清空');
  });

  /* 显示/隐藏最近一次请求与响应 */
  wenxin_jsonToggle.addEventListener('click', function () {
    var wenxin_hidden = wenxin_json.classList.toggle('wenxin_jsonHidden');
    wenxin_jsonToggle.textContent = wenxin_hidden ? '查看最近一次请求/响应（JSON）' : '收起请求/响应（JSON）';
  });
})();
