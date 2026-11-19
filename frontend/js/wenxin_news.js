/*
 姓名：温馨 | 学号：24001010328 | 时间：2026-11-19 | 大模型：DeepSeek-V4.1-Flash
 文件说明：科技新闻列表页面逻辑（接口请求、渲染、分页、搜索）
*/
(function () {
  var wenxin_API = '/api/news';
  var wenxin_pageSize = 6;
  var wenxin_state = { page: 1, keyword: '', total: 0 };

  var wenxin_list = document.getElementById('wenxin_newsList');
  var wenxin_pager = document.getElementById('wenxin_newsPager');
  var wenxin_count = document.getElementById('wenxin_newsCount');
  var wenxin_json = document.getElementById('wenxin_newsJson');
  var wenxin_apiLink = document.getElementById('wenxin_newsApiLink');
  var wenxin_jsonToggle = document.getElementById('wenxin_newsJsonToggle');
  var wenxin_searchForm = document.getElementById('wenxin_newsSearchForm');
  var wenxin_keywordInput = document.getElementById('wenxin_newsKeyword');

  /* 时间格式化：2026-11-19 09:20:00 */
  function wenxin_formatTime(wenxin_value) {
    if (!wenxin_value) {
      return '';
    }
    var wenxin_date = new Date(wenxin_value);
    if (isNaN(wenxin_date.getTime())) {
      return String(wenxin_value);
    }
    var wenxin_pad = function (wenxin_num) {
      return wenxin_num < 10 ? '0' + wenxin_num : '' + wenxin_num;
    };
    return wenxin_date.getFullYear() + '-' + wenxin_pad(wenxin_date.getMonth() + 1) + '-' +
      wenxin_pad(wenxin_date.getDate()) + ' ' + wenxin_pad(wenxin_date.getHours()) + ':' +
      wenxin_pad(wenxin_date.getMinutes());
  }

  /* 渲染新闻卡片 */
  function wenxin_renderList(wenxin_items) {
    if (!wenxin_items.length) {
      wenxin_list.innerHTML = '<div class="wenxin_empty">没有找到匹配的新闻，换个关键词试试。</div>';
      return;
    }
    var wenxin_html = '';
    wenxin_items.forEach(function (wenxin_item) {
      wenxin_html +=
        '<article class="wenxin_newsCard">' +
          '<span class="wenxin_newsTag">' + wenxin_item.category + '</span>' +
          '<h2 class="wenxin_newsTitle">' + wenxin_item.title + '</h2>' +
          '<p class="wenxin_newsSummary">' + wenxin_item.summary + '</p>' +
          '<div class="wenxin_newsMeta">' +
            '<span class="wenxin_newsMetaSource">' + wenxin_item.source + '</span>' +
            '<span>作者：' + wenxin_item.author + '</span>' +
            '<span>' + wenxin_formatTime(wenxin_item.publish_time) + '</span>' +
            '<span>阅读 ' + wenxin_item.views + '</span>' +
          '</div>' +
        '</article>';
    });
    wenxin_list.innerHTML = wenxin_html;
  }

  /* 渲染分页按钮 */
  function wenxin_renderPager() {
    var wenxin_pageCount = Math.max(1, Math.ceil(wenxin_state.total / wenxin_pageSize));
    if (wenxin_pageCount <= 1) {
      wenxin_pager.innerHTML = '';
      return;
    }
    var wenxin_html = '<button class="wenxin_pagerBtn" data-page="' + (wenxin_state.page - 1) + '"' +
      (wenxin_state.page === 1 ? ' disabled' : '') + '>上一页</button>';
    for (var wenxin_i = 1; wenxin_i <= wenxin_pageCount; wenxin_i++) {
      wenxin_html += '<button class="wenxin_pagerBtn' + (wenxin_i === wenxin_state.page ? ' isActive' : '') +
        '" data-page="' + wenxin_i + '">' + wenxin_i + '</button>';
    }
    wenxin_html += '<button class="wenxin_pagerBtn" data-page="' + (wenxin_state.page + 1) + '"' +
      (wenxin_state.page === wenxin_pageCount ? ' disabled' : '') + '>下一页</button>';
    wenxin_pager.innerHTML = wenxin_html;
  }

  /* 请求新闻数据 */
  function wenxin_loadNews() {
    var wenxin_url = wenxin_API + '?page=' + wenxin_state.page + '&pageSize=' + wenxin_pageSize +
      '&keyword=' + encodeURIComponent(wenxin_state.keyword);
    wenxin_apiLink.textContent = 'http://localhost:8328' + wenxin_url;
    wenxin_apiLink.href = wenxin_url;
    wenxin_list.innerHTML = '<div class="wenxin_loading">新闻加载中……</div>';

    fetch(wenxin_url)
      .then(function (wenxin_res) {
        if (!wenxin_res.ok) {
          throw new Error('HTTP 状态码异常：' + wenxin_res.status);
        }
        return wenxin_res.json();
      })
      .then(function (wenxin_result) {
        console.log('[科技新闻] 接口返回：', wenxin_result);
        wenxin_json.textContent = JSON.stringify(wenxin_result, null, 2);
        if (wenxin_result.code !== 0) {
          throw new Error(wenxin_result.msg || '接口返回失败');
        }
        wenxin_state.total = wenxin_result.data.total;
        wenxin_count.textContent = '共 ' + wenxin_state.total + ' 条新闻';
        wenxin_renderList(wenxin_result.data.list || []);
        wenxin_renderPager();
      })
      .catch(function (wenxin_err) {
        console.error('[科技新闻] 请求失败：', wenxin_err);
        wenxin_list.innerHTML = '<div class="wenxin_empty">新闻加载失败：' + wenxin_err.message + '</div>';
        wenxin_json.textContent = JSON.stringify({ code: -1, msg: wenxin_err.message, data: null }, null, 2);
      });
  }

  /* 分页点击 */
  wenxin_pager.addEventListener('click', function (wenxin_event) {
    var wenxin_btn = wenxin_event.target.closest('.wenxin_pagerBtn');
    if (!wenxin_btn || wenxin_btn.disabled) {
      return;
    }
    var wenxin_page = parseInt(wenxin_btn.getAttribute('data-page'), 10);
    if (!wenxin_page || wenxin_page === wenxin_state.page) {
      return;
    }
    wenxin_state.page = wenxin_page;
    wenxin_loadNews();
  });

  /* 搜索 */
  wenxin_searchForm.addEventListener('submit', function (wenxin_event) {
    wenxin_event.preventDefault();
    wenxin_state.keyword = wenxin_keywordInput.value.trim();
    wenxin_state.page = 1;
    wenxin_loadNews();
  });

  /* 显示/隐藏原始 JSON */
  wenxin_jsonToggle.addEventListener('click', function () {
    var wenxin_hidden = wenxin_json.classList.toggle('wenxin_jsonHidden');
    wenxin_jsonToggle.textContent = wenxin_hidden ? '查看原始数据（JSON）' : '收起原始数据（JSON）';
  });

  wenxin_loadNews();
})();
