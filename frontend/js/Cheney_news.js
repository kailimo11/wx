/*
 姓名：温馨 | 学号：24001010328 | 时间：2026-11-19 | 大模型：DeepSeek-V4.1-Flash
 文件说明：科技新闻列表页面逻辑（接口请求、渲染、分页、搜索）
*/
(function () {
  var Cheney_API = '/api/news';
  var Cheney_pageSize = 6;
  var Cheney_state = { page: 1, keyword: '', total: 0 };

  var Cheney_list = document.getElementById('Cheney_newsList');
  var Cheney_pager = document.getElementById('Cheney_newsPager');
  var Cheney_count = document.getElementById('Cheney_newsCount');
  var Cheney_json = document.getElementById('Cheney_newsJson');
  var Cheney_apiLink = document.getElementById('Cheney_newsApiLink');
  var Cheney_jsonToggle = document.getElementById('Cheney_newsJsonToggle');
  var Cheney_searchForm = document.getElementById('Cheney_newsSearchForm');
  var Cheney_keywordInput = document.getElementById('Cheney_newsKeyword');

  /* 时间格式化：2026-11-19 09:20:00 */
  function Cheney_formatTime(Cheney_value) {
    if (!Cheney_value) {
      return '';
    }
    var Cheney_date = new Date(Cheney_value);
    if (isNaN(Cheney_date.getTime())) {
      return String(Cheney_value);
    }
    var Cheney_pad = function (Cheney_num) {
      return Cheney_num < 10 ? '0' + Cheney_num : '' + Cheney_num;
    };
    return Cheney_date.getFullYear() + '-' + Cheney_pad(Cheney_date.getMonth() + 1) + '-' +
      Cheney_pad(Cheney_date.getDate()) + ' ' + Cheney_pad(Cheney_date.getHours()) + ':' +
      Cheney_pad(Cheney_date.getMinutes());
  }

  /* 渲染新闻卡片 */
  function Cheney_renderList(Cheney_items) {
    if (!Cheney_items.length) {
      Cheney_list.innerHTML = '<div class="Cheney_empty">没有找到匹配的新闻，换个关键词试试。</div>';
      return;
    }
    var Cheney_html = '';
    Cheney_items.forEach(function (Cheney_item) {
      Cheney_html +=
        '<article class="Cheney_newsCard">' +
          '<span class="Cheney_newsTag">' + Cheney_item.category + '</span>' +
          '<h2 class="Cheney_newsTitle">' + Cheney_item.title + '</h2>' +
          '<p class="Cheney_newsSummary">' + Cheney_item.summary + '</p>' +
          '<div class="Cheney_newsMeta">' +
            '<span class="Cheney_newsMetaSource">' + Cheney_item.source + '</span>' +
            '<span>作者：' + Cheney_item.author + '</span>' +
            '<span>' + Cheney_formatTime(Cheney_item.publish_time) + '</span>' +
            '<span>阅读 ' + Cheney_item.views + '</span>' +
          '</div>' +
        '</article>';
    });
    Cheney_list.innerHTML = Cheney_html;
  }

  /* 渲染分页按钮 */
  function Cheney_renderPager() {
    var Cheney_pageCount = Math.max(1, Math.ceil(Cheney_state.total / Cheney_pageSize));
    if (Cheney_pageCount <= 1) {
      Cheney_pager.innerHTML = '';
      return;
    }
    var Cheney_html = '<button class="Cheney_pagerBtn" data-page="' + (Cheney_state.page - 1) + '"' +
      (Cheney_state.page === 1 ? ' disabled' : '') + '>上一页</button>';
    for (var Cheney_i = 1; Cheney_i <= Cheney_pageCount; Cheney_i++) {
      Cheney_html += '<button class="Cheney_pagerBtn' + (Cheney_i === Cheney_state.page ? ' isActive' : '') +
        '" data-page="' + Cheney_i + '">' + Cheney_i + '</button>';
    }
    Cheney_html += '<button class="Cheney_pagerBtn" data-page="' + (Cheney_state.page + 1) + '"' +
      (Cheney_state.page === Cheney_pageCount ? ' disabled' : '') + '>下一页</button>';
    Cheney_pager.innerHTML = Cheney_html;
  }

  /* 请求新闻数据 */
  function Cheney_loadNews() {
    var Cheney_url = Cheney_API + '?page=' + Cheney_state.page + '&pageSize=' + Cheney_pageSize +
      '&keyword=' + encodeURIComponent(Cheney_state.keyword);
    Cheney_apiLink.textContent = 'http://localhost:8328' + Cheney_url;
    Cheney_apiLink.href = Cheney_url;
    Cheney_list.innerHTML = '<div class="Cheney_loading">新闻加载中……</div>';

    fetch(Cheney_url)
      .then(function (Cheney_res) {
        if (!Cheney_res.ok) {
          throw new Error('HTTP 状态码异常：' + Cheney_res.status);
        }
        return Cheney_res.json();
      })
      .then(function (Cheney_result) {
        console.log('[科技新闻] 接口返回：', Cheney_result);
        Cheney_json.textContent = JSON.stringify(Cheney_result, null, 2);
        if (Cheney_result.code !== 0) {
          throw new Error(Cheney_result.msg || '接口返回失败');
        }
        Cheney_state.total = Cheney_result.data.total;
        Cheney_count.textContent = '共 ' + Cheney_state.total + ' 条新闻';
        Cheney_renderList(Cheney_result.data.list || []);
        Cheney_renderPager();
      })
      .catch(function (Cheney_err) {
        console.error('[科技新闻] 请求失败：', Cheney_err);
        Cheney_list.innerHTML = '<div class="Cheney_empty">新闻加载失败：' + Cheney_err.message + '</div>';
        Cheney_json.textContent = JSON.stringify({ code: -1, msg: Cheney_err.message, data: null }, null, 2);
      });
  }

  /* 分页点击 */
  Cheney_pager.addEventListener('click', function (Cheney_event) {
    var Cheney_btn = Cheney_event.target.closest('.Cheney_pagerBtn');
    if (!Cheney_btn || Cheney_btn.disabled) {
      return;
    }
    var Cheney_page = parseInt(Cheney_btn.getAttribute('data-page'), 10);
    if (!Cheney_page || Cheney_page === Cheney_state.page) {
      return;
    }
    Cheney_state.page = Cheney_page;
    Cheney_loadNews();
  });

  /* 搜索 */
  Cheney_searchForm.addEventListener('submit', function (Cheney_event) {
    Cheney_event.preventDefault();
    Cheney_state.keyword = Cheney_keywordInput.value.trim();
    Cheney_state.page = 1;
    Cheney_loadNews();
  });

  /* 显示/隐藏原始 JSON */
  Cheney_jsonToggle.addEventListener('click', function () {
    var Cheney_hidden = Cheney_json.classList.toggle('Cheney_jsonHidden');
    Cheney_jsonToggle.textContent = Cheney_hidden ? '查看原始数据（JSON）' : '收起原始数据（JSON）';
  });

  Cheney_loadNews();
})();
