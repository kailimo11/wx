/*
 姓名：温馨 | 学号：24001010328 | 时间：2026-11-19 | 大模型：DeepSeek-V4.1-Flash
 文件说明：图文列表页面逻辑（接口请求、分类筛选、渲染）
*/
(function () {
  var wenxin_API = '/api/gallery';
  var wenxin_state = { category: '', total: 0 };

  var wenxin_list = document.getElementById('wenxin_galleryList');
  var wenxin_chips = document.getElementById('wenxin_galleryChips');
  var wenxin_count = document.getElementById('wenxin_galleryCount');
  var wenxin_json = document.getElementById('wenxin_galleryJson');
  var wenxin_jsonToggle = document.getElementById('wenxin_galleryJsonToggle');
  var wenxin_apiLink = document.getElementById('wenxin_galleryApiLink');

  /* 渲染分类筛选项 */
  function wenxin_renderChips(wenxin_categories) {
    var wenxin_all = [''].concat(wenxin_categories);
    var wenxin_html = '';
    wenxin_all.forEach(function (wenxin_cat) {
      var wenxin_text = wenxin_cat === '' ? '全部' : wenxin_cat;
      var wenxin_active = wenxin_cat === wenxin_state.category ? ' isActive' : '';
      wenxin_html += '<button class="wenxin_chip' + wenxin_active + '" type="button" data-category="' +
        wenxin_cat + '">' + wenxin_text + '</button>';
    });
    wenxin_chips.innerHTML = wenxin_html;
  }

  /* 渲染图文卡片 */
  function wenxin_renderList(wenxin_items) {
    if (!wenxin_items.length) {
      wenxin_list.innerHTML = '<div class="wenxin_empty">该分类下暂无图文内容。</div>';
      return;
    }
    var wenxin_html = '';
    wenxin_items.forEach(function (wenxin_item) {
      wenxin_html +=
        '<article class="wenxin_galleryCard">' +
          '<div class="wenxin_galleryImageWrap">' +
            '<img class="wenxin_galleryImage" src="' + wenxin_item.image_url + '" alt="' + wenxin_item.title + '" loading="lazy" />' +
            '<span class="wenxin_galleryCategory">' + wenxin_item.category + '</span>' +
          '</div>' +
          '<div class="wenxin_galleryBody">' +
            '<h2 class="wenxin_galleryTitle">' + wenxin_item.title + '</h2>' +
            '<p class="wenxin_galleryDesc">' + wenxin_item.description + '</p>' +
            '<div class="wenxin_galleryMeta">' +
              '<span>作者：' + wenxin_item.author + '</span>' +
              '<span class="wenxin_galleryLikes">♥ ' + wenxin_item.likes + '</span>' +
            '</div>' +
          '</div>' +
        '</article>';
    });
    wenxin_list.innerHTML = wenxin_html;
  }

  /* 请求图文数据 */
  function wenxin_loadGallery() {
    var wenxin_url = wenxin_API + '?page=1&pageSize=12' +
      (wenxin_state.category ? '&category=' + encodeURIComponent(wenxin_state.category) : '');
    wenxin_apiLink.textContent = 'http://localhost:8328' + wenxin_url;
    wenxin_apiLink.href = wenxin_url;
    wenxin_list.innerHTML = '<div class="wenxin_loading">图文加载中……</div>';

    fetch(wenxin_url)
      .then(function (wenxin_res) {
        if (!wenxin_res.ok) {
          throw new Error('HTTP 状态码异常：' + wenxin_res.status);
        }
        return wenxin_res.json();
      })
      .then(function (wenxin_result) {
        console.log('[图文列表] 接口返回：', wenxin_result);
        wenxin_json.textContent = JSON.stringify(wenxin_result, null, 2);
        if (wenxin_result.code !== 0) {
          throw new Error(wenxin_result.msg || '接口返回失败');
        }
        var wenxin_data = wenxin_result.data || {};
        wenxin_state.total = wenxin_data.total || 0;
        wenxin_count.textContent = '共 ' + wenxin_state.total + ' 条图文';
        wenxin_renderChips(wenxin_data.categories || []);
        wenxin_renderList(wenxin_data.list || []);
      })
      .catch(function (wenxin_err) {
        console.error('[图文列表] 请求失败：', wenxin_err);
        wenxin_list.innerHTML = '<div class="wenxin_empty">图文加载失败：' + wenxin_err.message + '</div>';
        wenxin_json.textContent = JSON.stringify({ code: -1, msg: wenxin_err.message, data: null }, null, 2);
      });
  }

  /* 分类切换 */
  wenxin_chips.addEventListener('click', function (wenxin_event) {
    var wenxin_chip = wenxin_event.target.closest('.wenxin_chip');
    if (!wenxin_chip) {
      return;
    }
    var wenxin_category = wenxin_chip.getAttribute('data-category');
    if (wenxin_category === wenxin_state.category) {
      return;
    }
    wenxin_state.category = wenxin_category;
    wenxin_loadGallery();
  });

  /* 显示/隐藏原始 JSON */
  wenxin_jsonToggle.addEventListener('click', function () {
    var wenxin_hidden = wenxin_json.classList.toggle('wenxin_jsonHidden');
    wenxin_jsonToggle.textContent = wenxin_hidden ? '查看原始数据（JSON）' : '收起原始数据（JSON）';
  });

  wenxin_loadGallery();
})();
