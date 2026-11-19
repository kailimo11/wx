/*
 姓名：温馨 | 学号：24001010328 | 时间：2026-11-19 | 大模型：DeepSeek-V4.1-Flash
 文件说明：图文列表页面逻辑（接口请求、分类筛选、渲染）
*/
(function () {
  var Cheney_API = '/api/gallery';
  var Cheney_state = { category: '', total: 0 };

  var Cheney_list = document.getElementById('Cheney_galleryList');
  var Cheney_chips = document.getElementById('Cheney_galleryChips');
  var Cheney_count = document.getElementById('Cheney_galleryCount');
  var Cheney_json = document.getElementById('Cheney_galleryJson');
  var Cheney_jsonToggle = document.getElementById('Cheney_galleryJsonToggle');
  var Cheney_apiLink = document.getElementById('Cheney_galleryApiLink');

  /* 渲染分类筛选项 */
  function Cheney_renderChips(Cheney_categories) {
    var Cheney_all = [''].concat(Cheney_categories);
    var Cheney_html = '';
    Cheney_all.forEach(function (Cheney_cat) {
      var Cheney_text = Cheney_cat === '' ? '全部' : Cheney_cat;
      var Cheney_active = Cheney_cat === Cheney_state.category ? ' isActive' : '';
      Cheney_html += '<button class="Cheney_chip' + Cheney_active + '" type="button" data-category="' +
        Cheney_cat + '">' + Cheney_text + '</button>';
    });
    Cheney_chips.innerHTML = Cheney_html;
  }

  /* 渲染图文卡片 */
  function Cheney_renderList(Cheney_items) {
    if (!Cheney_items.length) {
      Cheney_list.innerHTML = '<div class="Cheney_empty">该分类下暂无图文内容。</div>';
      return;
    }
    var Cheney_html = '';
    Cheney_items.forEach(function (Cheney_item) {
      Cheney_html +=
        '<article class="Cheney_galleryCard">' +
          '<div class="Cheney_galleryImageWrap">' +
            '<img class="Cheney_galleryImage" src="' + Cheney_item.image_url + '" alt="' + Cheney_item.title + '" loading="lazy" />' +
            '<span class="Cheney_galleryCategory">' + Cheney_item.category + '</span>' +
          '</div>' +
          '<div class="Cheney_galleryBody">' +
            '<h2 class="Cheney_galleryTitle">' + Cheney_item.title + '</h2>' +
            '<p class="Cheney_galleryDesc">' + Cheney_item.description + '</p>' +
            '<div class="Cheney_galleryMeta">' +
              '<span>作者：' + Cheney_item.author + '</span>' +
              '<span class="Cheney_galleryLikes">♥ ' + Cheney_item.likes + '</span>' +
            '</div>' +
          '</div>' +
        '</article>';
    });
    Cheney_list.innerHTML = Cheney_html;
  }

  /* 请求图文数据 */
  function Cheney_loadGallery() {
    var Cheney_url = Cheney_API + '?page=1&pageSize=12' +
      (Cheney_state.category ? '&category=' + encodeURIComponent(Cheney_state.category) : '');
    Cheney_apiLink.textContent = 'http://localhost:8328' + Cheney_url;
    Cheney_apiLink.href = Cheney_url;
    Cheney_list.innerHTML = '<div class="Cheney_loading">图文加载中……</div>';

    fetch(Cheney_url)
      .then(function (Cheney_res) {
        if (!Cheney_res.ok) {
          throw new Error('HTTP 状态码异常：' + Cheney_res.status);
        }
        return Cheney_res.json();
      })
      .then(function (Cheney_result) {
        console.log('[图文列表] 接口返回：', Cheney_result);
        Cheney_json.textContent = JSON.stringify(Cheney_result, null, 2);
        if (Cheney_result.code !== 0) {
          throw new Error(Cheney_result.msg || '接口返回失败');
        }
        var Cheney_data = Cheney_result.data || {};
        Cheney_state.total = Cheney_data.total || 0;
        Cheney_count.textContent = '共 ' + Cheney_state.total + ' 条图文';
        Cheney_renderChips(Cheney_data.categories || []);
        Cheney_renderList(Cheney_data.list || []);
      })
      .catch(function (Cheney_err) {
        console.error('[图文列表] 请求失败：', Cheney_err);
        Cheney_list.innerHTML = '<div class="Cheney_empty">图文加载失败：' + Cheney_err.message + '</div>';
        Cheney_json.textContent = JSON.stringify({ code: -1, msg: Cheney_err.message, data: null }, null, 2);
      });
  }

  /* 分类切换 */
  Cheney_chips.addEventListener('click', function (Cheney_event) {
    var Cheney_chip = Cheney_event.target.closest('.Cheney_chip');
    if (!Cheney_chip) {
      return;
    }
    var Cheney_category = Cheney_chip.getAttribute('data-category');
    if (Cheney_category === Cheney_state.category) {
      return;
    }
    Cheney_state.category = Cheney_category;
    Cheney_loadGallery();
  });

  /* 显示/隐藏原始 JSON */
  Cheney_jsonToggle.addEventListener('click', function () {
    var Cheney_hidden = Cheney_json.classList.toggle('Cheney_jsonHidden');
    Cheney_jsonToggle.textContent = Cheney_hidden ? '查看原始数据（JSON）' : '收起原始数据（JSON）';
  });

  Cheney_loadGallery();
})();
