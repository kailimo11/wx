/*
 姓名：温馨 | 学号：24001010328 | 时间：2026-11-23 | 大模型：DeepSeek-V4.1-Flash
 文件说明：知识库页面逻辑（上传解析、文件管理、分块查看、知识库问答）
*/
(function () {
  var wenxin_API = {
    files: '/api/kb/files',
    upload: '/api/kb/upload',
    ask: '/api/kb/ask'
  };
  var wenxin_selectedFile = null;
  var wenxin_files = [];

  var wenxin_fileInput = document.getElementById('wenxin_fileInput');
  var wenxin_dropZone = document.getElementById('wenxin_dropZone');
  var wenxin_fileName = document.getElementById('wenxin_fileName');
  var wenxin_uploadBtn = document.getElementById('wenxin_uploadBtn');
  var wenxin_uploadMsg = document.getElementById('wenxin_uploadMsg');
  var wenxin_uploadJson = document.getElementById('wenxin_uploadJson');
  var wenxin_uploadToggle = document.getElementById('wenxin_uploadJsonToggle');
  var wenxin_tableBody = document.getElementById('wenxin_fileTableBody');
  var wenxin_fileSummary = document.getElementById('wenxin_fileSummary');
  var wenxin_chunkPanel = document.getElementById('wenxin_chunkPanel');
  var wenxin_chunkTitle = document.getElementById('wenxin_chunkTitle');
  var wenxin_chunkList = document.getElementById('wenxin_chunkList');
  var wenxin_chunkClose = document.getElementById('wenxin_chunkClose');
  var wenxin_question = document.getElementById('wenxin_questionInput');
  var wenxin_topK = document.getElementById('wenxin_topK');
  var wenxin_askBtn = document.getElementById('wenxin_askBtn');
  var wenxin_answerBox = document.getElementById('wenxin_answerBox');
  var wenxin_answerText = document.getElementById('wenxin_answerText');
  var wenxin_sources = document.getElementById('wenxin_sources');
  var wenxin_askJson = document.getElementById('wenxin_askJson');
  var wenxin_askToggle = document.getElementById('wenxin_askJsonToggle');

  /* ========== 通用工具 ========== */
  function wenxin_formatSize(wenxin_bytes) {
    if (wenxin_bytes >= 1024 * 1024) {
      return (wenxin_bytes / 1024 / 1024).toFixed(2) + ' MB';
    }
    if (wenxin_bytes >= 1024) {
      return (wenxin_bytes / 1024).toFixed(1) + ' KB';
    }
    return wenxin_bytes + ' B';
  }

  function wenxin_formatTime(wenxin_value) {
    var wenxin_date = new Date(wenxin_value);
    if (isNaN(wenxin_date.getTime())) {
      return String(wenxin_value || '');
    }
    var wenxin_pad = function (wenxin_num) {
      return wenxin_num < 10 ? '0' + wenxin_num : '' + wenxin_num;
    };
    return wenxin_date.getFullYear() + '-' + wenxin_pad(wenxin_date.getMonth() + 1) + '-' +
      wenxin_pad(wenxin_date.getDate()) + ' ' + wenxin_pad(wenxin_date.getHours()) + ':' +
      wenxin_pad(wenxin_date.getMinutes());
  }

  function wenxin_setUploadMsg(wenxin_type, wenxin_text) {
    wenxin_uploadMsg.className = 'wenxin_alert wenxin_alert' + wenxin_type;
    wenxin_uploadMsg.textContent = wenxin_text;
  }

  function wenxin_toggleJson(wenxin_box, wenxin_button, wenxin_showText, wenxin_hideText) {
    var wenxin_hidden = wenxin_box.classList.toggle('wenxin_jsonHidden');
    wenxin_button.textContent = wenxin_hidden ? wenxin_showText : wenxin_hideText;
  }

  /* ========== 文件列表 ========== */
  function wenxin_renderFiles() {
    wenxin_fileSummary.textContent = '共 ' + wenxin_files.length + ' 个文件';
    if (!wenxin_files.length) {
      wenxin_tableBody.innerHTML = '<tr><td colspan="7" class="wenxin_tableEmpty">知识库暂无文件，请先上传。</td></tr>';
      return;
    }
    var wenxin_html = '';
    wenxin_files.forEach(function (wenxin_file) {
      wenxin_html +=
        '<tr>' +
          '<td><div class="wenxin_fileCell">' +
            '<span class="wenxin_extTag">' + wenxin_file.ext.replace('.', '').toUpperCase() + '</span>' +
            '<span>' + wenxin_file.original_name + '</span>' +
          '</div></td>' +
          '<td>' + wenxin_file.ext + '</td>' +
          '<td>' + wenxin_formatSize(wenxin_file.file_size) + '</td>' +
          '<td>' + wenxin_file.char_count + '</td>' +
          '<td>' + wenxin_file.chunk_count + '</td>' +
          '<td>' + wenxin_formatTime(wenxin_file.created_at) + '</td>' +
          '<td><div class="wenxin_rowActions">' +
            '<button class="wenxin_miniBtn" data-action="chunks" data-id="' + wenxin_file.id + '" data-name="' + wenxin_file.original_name + '">查看分块</button>' +
            '<button class="wenxin_miniBtn wenxin_miniBtnDanger" data-action="delete" data-id="' + wenxin_file.id + '" data-name="' + wenxin_file.original_name + '">删除</button>' +
          '</div></td>' +
        '</tr>';
    });
    wenxin_tableBody.innerHTML = wenxin_html;
  }

  function wenxin_loadFiles() {
    fetch(wenxin_API.files)
      .then(function (wenxin_res) {
        return wenxin_res.json();
      })
      .then(function (wenxin_result) {
        console.log('[知识库] 文件列表：', wenxin_result);
        if (wenxin_result.code !== 0) {
          throw new Error(wenxin_result.msg || '文件列表查询失败');
        }
        wenxin_files = wenxin_result.data.list || [];
        wenxin_renderFiles();
      })
      .catch(function (wenxin_err) {
        console.error('[知识库] 文件列表加载失败：', wenxin_err);
        wenxin_tableBody.innerHTML = '<tr><td colspan="7" class="wenxin_tableEmpty">文件列表加载失败：' + wenxin_err.message + '</td></tr>';
      });
  }

  /* ========== 上传 ========== */
  function wenxin_selectFile(wenxin_file) {
    wenxin_selectedFile = wenxin_file || null;
    wenxin_fileName.textContent = wenxin_file
      ? wenxin_file.name + '（' + wenxin_formatSize(wenxin_file.size) + '）'
      : '尚未选择文件';
    wenxin_uploadBtn.disabled = !wenxin_file;
  }

  function wenxin_upload() {
    if (!wenxin_selectedFile) {
      return;
    }
    var wenxin_formData = new FormData();
    wenxin_formData.append('file', wenxin_selectedFile);

    wenxin_uploadBtn.disabled = true;
    wenxin_uploadBtn.textContent = '解析中……';
    wenxin_setUploadMsg('Info', '正在上传并解析文件，请稍候……');

    fetch(wenxin_API.upload, { method: 'POST', body: wenxin_formData })
      .then(function (wenxin_res) {
        return wenxin_res.json();
      })
      .then(function (wenxin_result) {
        console.log('[知识库] 上传结果：', wenxin_result);
        wenxin_uploadJson.textContent = JSON.stringify(wenxin_result, null, 2);
        if (wenxin_result.code !== 0) {
          wenxin_setUploadMsg('Error', '上传失败：' + (wenxin_result.msg || '未知错误'));
          return;
        }
        var wenxin_data = wenxin_result.data;
        wenxin_setUploadMsg(
          'Success',
          '上传成功：' + wenxin_data.originalName + '，解析 ' + wenxin_data.charCount +
          ' 字，切分为 ' + wenxin_data.chunkCount + ' 个分块。'
        );
        wenxin_fileInput.value = '';
        wenxin_selectFile(null);
        wenxin_loadFiles();
      })
      .catch(function (wenxin_err) {
        console.error('[知识库] 上传失败：', wenxin_err);
        wenxin_setUploadMsg('Error', '上传失败：' + wenxin_err.message);
        wenxin_uploadJson.textContent = JSON.stringify({ code: -1, msg: wenxin_err.message, data: null }, null, 2);
      })
      .finally(function () {
        wenxin_uploadBtn.disabled = !wenxin_selectedFile;
        wenxin_uploadBtn.textContent = '上传并解析';
      });
  }

  /* ========== 分块与删除 ========== */
  function wenxin_showChunks(wenxin_id, wenxin_name) {
    fetch(wenxin_API.files + '/' + wenxin_id + '/chunks')
      .then(function (wenxin_res) {
        return wenxin_res.json();
      })
      .then(function (wenxin_result) {
        console.log('[知识库] 分块内容：', wenxin_result);
        if (wenxin_result.code !== 0) {
          throw new Error(wenxin_result.msg || '分块查询失败');
        }
        wenxin_chunkTitle.textContent = wenxin_name + ' · 共 ' + wenxin_result.data.total + ' 个分块';
        var wenxin_html = '';
        (wenxin_result.data.list || []).forEach(function (wenxin_chunk) {
          wenxin_html += '<div class="wenxin_chunkItem"><strong>分块 ' + (wenxin_chunk.chunk_index + 1) +
            '（' + wenxin_chunk.char_count + ' 字）</strong>' + wenxin_chunk.content + '</div>';
        });
        wenxin_chunkList.innerHTML = wenxin_html || '<div class="wenxin_empty">暂无分块</div>';
        wenxin_chunkPanel.classList.remove('wenxin_jsonHidden');
        wenxin_chunkPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      })
      .catch(function (wenxin_err) {
        console.error('[知识库] 分块查询失败：', wenxin_err);
        window.alert('分块查询失败：' + wenxin_err.message);
      });
  }

  function wenxin_deleteFile(wenxin_id, wenxin_name) {
    if (!window.confirm('确定删除「' + wenxin_name + '」及其全部文本分块吗？')) {
      return;
    }
    fetch(wenxin_API.files + '/' + wenxin_id, { method: 'DELETE' })
      .then(function (wenxin_res) {
        return wenxin_res.json();
      })
      .then(function (wenxin_result) {
        console.log('[知识库] 删除结果：', wenxin_result);
        if (wenxin_result.code !== 0) {
          throw new Error(wenxin_result.msg || '删除失败');
        }
        wenxin_setUploadMsg('Success', '已删除文件：' + wenxin_name);
        wenxin_chunkPanel.classList.add('wenxin_jsonHidden');
        wenxin_loadFiles();
      })
      .catch(function (wenxin_err) {
        console.error('[知识库] 删除失败：', wenxin_err);
        window.alert('删除失败：' + wenxin_err.message);
      });
  }

  /* ========== 知识库问答 ========== */
  function wenxin_renderSources(wenxin_sourcesList) {
    if (!wenxin_sourcesList.length) {
      wenxin_sources.innerHTML = '<div class="wenxin_empty">本次没有命中知识库资料</div>';
      return;
    }
    var wenxin_html = '';
    wenxin_sourcesList.forEach(function (wenxin_item, wenxin_index) {
      wenxin_html +=
        '<div class="wenxin_sourceCard">' +
          '<div class="wenxin_sourceHead">' +
            '<span>资料' + (wenxin_index + 1) + ' · ' + wenxin_item.fileName + '（分块 ' + (wenxin_item.chunkIndex + 1) + '）</span>' +
            '<span>匹配分 ' + wenxin_item.score + '</span>' +
          '</div>' +
          '<div class="wenxin_sourceContent">' + wenxin_item.content + '</div>' +
        '</div>';
    });
    wenxin_sources.innerHTML = wenxin_html;
  }

  function wenxin_ask() {
    var wenxin_text = wenxin_question.value.trim();
    if (!wenxin_text) {
      window.alert('请先输入问题');
      return;
    }
    var wenxin_payload = { question: wenxin_text, topK: Number(wenxin_topK.value) };

    wenxin_askBtn.disabled = true;
    wenxin_askBtn.textContent = '检索中……';
    wenxin_answerBox.classList.remove('wenxin_jsonHidden');
    wenxin_answerText.textContent = '正在检索知识库并请求大模型……';
    wenxin_sources.innerHTML = '';
    console.log('[知识库问答] 发送给大模型的数据：', wenxin_payload);

    fetch(wenxin_API.ask, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(wenxin_payload)
    })
      .then(function (wenxin_res) {
        return wenxin_res.json();
      })
      .then(function (wenxin_result) {
        console.log('[知识库问答] 从大模型接收到的数据：', wenxin_result);
        wenxin_askJson.textContent = JSON.stringify(wenxin_result, null, 2);
        if (wenxin_result.code !== 0) {
          wenxin_answerText.textContent = '问答失败：' + (wenxin_result.msg || '未知错误');
          return;
        }
        wenxin_answerText.textContent = wenxin_result.data.answer || '（模型未返回内容）';
        wenxin_renderSources(wenxin_result.data.sources || []);
        if (wenxin_result.data.usage) {
          console.log('[知识库问答] Token 用量：', wenxin_result.data.usage);
        }
      })
      .catch(function (wenxin_err) {
        console.error('[知识库问答] 请求失败：', wenxin_err);
        wenxin_answerText.textContent = '问答失败：' + wenxin_err.message;
        wenxin_askJson.textContent = JSON.stringify({ code: -1, msg: wenxin_err.message, data: null }, null, 2);
      })
      .finally(function () {
        wenxin_askBtn.disabled = false;
        wenxin_askBtn.textContent = '提问';
      });
  }

  /* ========== 事件绑定 ========== */
  wenxin_fileInput.addEventListener('change', function () {
    wenxin_selectFile(wenxin_fileInput.files[0]);
  });

  ['dragenter', 'dragover'].forEach(function (wenxin_type) {
    wenxin_dropZone.addEventListener(wenxin_type, function (wenxin_event) {
      wenxin_event.preventDefault();
      wenxin_dropZone.classList.add('isDragOver');
    });
  });

  ['dragleave', 'drop'].forEach(function (wenxin_type) {
    wenxin_dropZone.addEventListener(wenxin_type, function (wenxin_event) {
      wenxin_event.preventDefault();
      wenxin_dropZone.classList.remove('isDragOver');
    });
  });

  wenxin_dropZone.addEventListener('drop', function (wenxin_event) {
    if (wenxin_event.dataTransfer.files.length) {
      wenxin_selectFile(wenxin_event.dataTransfer.files[0]);
    }
  });

  wenxin_uploadBtn.addEventListener('click', wenxin_upload);

  wenxin_tableBody.addEventListener('click', function (wenxin_event) {
    var wenxin_btn = wenxin_event.target.closest('button[data-action]');
    if (!wenxin_btn) {
      return;
    }
    var wenxin_id = wenxin_btn.getAttribute('data-id');
    var wenxin_name = wenxin_btn.getAttribute('data-name');
    if (wenxin_btn.getAttribute('data-action') === 'chunks') {
      wenxin_showChunks(wenxin_id, wenxin_name);
    } else {
      wenxin_deleteFile(wenxin_id, wenxin_name);
    }
  });

  wenxin_chunkClose.addEventListener('click', function () {
    wenxin_chunkPanel.classList.add('wenxin_jsonHidden');
  });

  wenxin_uploadToggle.addEventListener('click', function () {
    wenxin_toggleJson(wenxin_uploadJson, wenxin_uploadToggle, '查看上传结果（JSON）', '收起上传结果（JSON）');
  });

  wenxin_askToggle.addEventListener('click', function () {
    wenxin_toggleJson(wenxin_askJson, wenxin_askToggle, '查看问答请求/响应（JSON）', '收起问答请求/响应（JSON）');
  });

  wenxin_askBtn.addEventListener('click', wenxin_ask);
  wenxin_question.addEventListener('keydown', function (wenxin_event) {
    if (wenxin_event.key === 'Enter') {
      wenxin_ask();
    }
  });

  wenxin_loadFiles();
})();
