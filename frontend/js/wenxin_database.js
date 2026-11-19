/*
 姓名：温馨 | 学号：24001010328 | 时间：2026-11-19 | 大模型：DeepSeek-V4.1-Flash
 文件说明：数据库连接测试页面逻辑
*/
(function () {
  var wenxin_API = '/api/db/test';
  var wenxin_form = document.getElementById('wenxin_dbForm');
  var wenxin_submit = document.getElementById('wenxin_dbSubmit');
  var wenxin_feedback = document.getElementById('wenxin_dbFeedback');
  var wenxin_json = document.getElementById('wenxin_dbJson');

  /* 依据结果类型切换提示样式 */
  function wenxin_showFeedback(wenxin_type, wenxin_text) {
    wenxin_feedback.className = 'wenxin_alert wenxin_alert' + wenxin_type;
    wenxin_feedback.textContent = wenxin_text;
  }

  function wenxin_showJson(wenxin_data) {
    wenxin_json.textContent = JSON.stringify(wenxin_data, null, 2);
  }

  wenxin_form.addEventListener('submit', function (wenxin_event) {
    wenxin_event.preventDefault();
    var wenxin_payload = {
      user: document.getElementById('wenxin_dbUser').value.trim(),
      password: document.getElementById('wenxin_dbPassword').value,
      host: document.getElementById('wenxin_dbHost').value.trim() || 'localhost',
      database: document.getElementById('wenxin_dbName').value.trim()
    };

    wenxin_submit.disabled = true;
    wenxin_submit.textContent = '连接中……';
    wenxin_showFeedback('Info', '正在尝试连接数据库，请稍候……');
    wenxin_json.textContent = '请求中……';

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
        console.log('[数据库连接测试] 服务器返回：', wenxin_result);
        wenxin_showJson(wenxin_result);
        if (wenxin_result.code === 0) {
          var wenxin_data = wenxin_result.data || {};
          wenxin_showFeedback(
            'Success',
            '连接成功！MySQL 版本 ' + wenxin_data.version + '，当前数据库 ' + (wenxin_data.database || '未指定') +
            '，共 ' + wenxin_data.tableCount + ' 张表：' + (wenxin_data.tables || []).join('、')
          );
        } else {
          wenxin_showFeedback('Error', wenxin_result.msg || '数据库连接失败');
        }
      })
      .catch(function (wenxin_err) {
        console.error('[数据库连接测试] 请求失败：', wenxin_err);
        wenxin_showFeedback('Error', '请求失败：' + wenxin_err.message);
        wenxin_json.textContent = JSON.stringify({ code: -1, msg: wenxin_err.message, data: null }, null, 2);
      })
      .finally(function () {
        wenxin_submit.disabled = false;
        wenxin_submit.textContent = '测试连接';
      });
  });

  /* 重置后恢复默认账号密码提示 */
  wenxin_form.addEventListener('reset', function () {
    window.setTimeout(function () {
      wenxin_showFeedback('Info', '已重置为默认值，默认账号 root / root。');
      wenxin_json.textContent = '等待请求……';
    }, 0);
  });
})();
