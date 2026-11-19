/*
 姓名：温馨 | 学号：24001010328 | 时间：2026-11-19 | 大模型：DeepSeek-V4.1-Flash
 文件说明：数据库连接测试页面逻辑
*/
(function () {
  var Cheney_API = '/api/db/test';
  var Cheney_form = document.getElementById('Cheney_dbForm');
  var Cheney_submit = document.getElementById('Cheney_dbSubmit');
  var Cheney_feedback = document.getElementById('Cheney_dbFeedback');
  var Cheney_json = document.getElementById('Cheney_dbJson');

  /* 依据结果类型切换提示样式 */
  function Cheney_showFeedback(Cheney_type, Cheney_text) {
    Cheney_feedback.className = 'Cheney_alert Cheney_alert' + Cheney_type;
    Cheney_feedback.textContent = Cheney_text;
  }

  function Cheney_showJson(Cheney_data) {
    Cheney_json.textContent = JSON.stringify(Cheney_data, null, 2);
  }

  Cheney_form.addEventListener('submit', function (Cheney_event) {
    Cheney_event.preventDefault();
    var Cheney_payload = {
      user: document.getElementById('Cheney_dbUser').value.trim(),
      password: document.getElementById('Cheney_dbPassword').value,
      host: document.getElementById('Cheney_dbHost').value.trim() || 'localhost',
      database: document.getElementById('Cheney_dbName').value.trim()
    };

    Cheney_submit.disabled = true;
    Cheney_submit.textContent = '连接中……';
    Cheney_showFeedback('Info', '正在尝试连接数据库，请稍候……');
    Cheney_json.textContent = '请求中……';

    fetch(Cheney_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(Cheney_payload)
    })
      .then(function (Cheney_res) {
        if (!Cheney_res.ok) {
          throw new Error('HTTP 状态码异常：' + Cheney_res.status);
        }
        return Cheney_res.json();
      })
      .then(function (Cheney_result) {
        console.log('[数据库连接测试] 服务器返回：', Cheney_result);
        Cheney_showJson(Cheney_result);
        if (Cheney_result.code === 0) {
          var Cheney_data = Cheney_result.data || {};
          Cheney_showFeedback(
            'Success',
            '连接成功！MySQL 版本 ' + Cheney_data.version + '，当前数据库 ' + (Cheney_data.database || '未指定') +
            '，共 ' + Cheney_data.tableCount + ' 张表：' + (Cheney_data.tables || []).join('、')
          );
        } else {
          Cheney_showFeedback('Error', Cheney_result.msg || '数据库连接失败');
        }
      })
      .catch(function (Cheney_err) {
        console.error('[数据库连接测试] 请求失败：', Cheney_err);
        Cheney_showFeedback('Error', '请求失败：' + Cheney_err.message);
        Cheney_json.textContent = JSON.stringify({ code: -1, msg: Cheney_err.message, data: null }, null, 2);
      })
      .finally(function () {
        Cheney_submit.disabled = false;
        Cheney_submit.textContent = '测试连接';
      });
  });

  /* 重置后恢复默认账号密码提示 */
  Cheney_form.addEventListener('reset', function () {
    window.setTimeout(function () {
      Cheney_showFeedback('Info', '已重置为默认值，默认账号 root / root。');
      Cheney_json.textContent = '等待请求……';
    }, 0);
  });
})();
