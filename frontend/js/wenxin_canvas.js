/*
 姓名：温馨 | 学号：24001010328 | 时间：2026-11-19 | 大模型：DeepSeek-V4.1-Flash
 文件说明：首页 Canvas 背景动画（漂浮粒子 + 邻近连线 + 鼠标吸附）
*/
(function () {
  var wenxin_canvas = document.getElementById('wenxin_canvas');
  if (!wenxin_canvas || !wenxin_canvas.getContext) {
    return;
  }

  var wenxin_ctx = wenxin_canvas.getContext('2d');
  var wenxin_dpr = Math.min(window.devicePixelRatio || 1, 2);
  var wenxin_width = 0;
  var wenxin_height = 0;
  var wenxin_particles = [];
  var wenxin_mouse = { x: -9999, y: -9999 };
  var wenxin_LINK_DISTANCE = 140;
  var wenxin_MOUSE_DISTANCE = 180;

  /* 依据容器尺寸重建画布与粒子 */
  function wenxin_resize() {
    wenxin_width = window.innerWidth;
    wenxin_height = window.innerHeight;
    wenxin_canvas.width = wenxin_width * wenxin_dpr;
    wenxin_canvas.height = wenxin_height * wenxin_dpr;
    wenxin_ctx.setTransform(wenxin_dpr, 0, 0, wenxin_dpr, 0, 0);
    wenxin_buildParticles();
  }

  function wenxin_buildParticles() {
    var wenxin_count = Math.round((wenxin_width * wenxin_height) / 16000);
    wenxin_count = Math.max(40, Math.min(110, wenxin_count));
    wenxin_particles = [];
    for (var wenxin_i = 0; wenxin_i < wenxin_count; wenxin_i++) {
      wenxin_particles.push({
        x: Math.random() * wenxin_width,
        y: Math.random() * wenxin_height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.8 + 0.8
      });
    }
  }

  /* 绘制一帧 */
  function wenxin_draw() {
    wenxin_ctx.clearRect(0, 0, wenxin_width, wenxin_height);

    for (var wenxin_i = 0; wenxin_i < wenxin_particles.length; wenxin_i++) {
      var wenxin_p = wenxin_particles[wenxin_i];

      /* 运动与边界回弹 */
      wenxin_p.x += wenxin_p.vx;
      wenxin_p.y += wenxin_p.vy;
      if (wenxin_p.x < 0 || wenxin_p.x > wenxin_width) {
        wenxin_p.vx *= -1;
      }
      if (wenxin_p.y < 0 || wenxin_p.y > wenxin_height) {
        wenxin_p.vy *= -1;
      }

      /* 粒子点 */
      wenxin_ctx.beginPath();
      wenxin_ctx.arc(wenxin_p.x, wenxin_p.y, wenxin_p.r, 0, Math.PI * 2);
      wenxin_ctx.fillStyle = 'rgba(150, 200, 255, 0.75)';
      wenxin_ctx.fill();

      /* 粒子间连线 */
      for (var wenxin_j = wenxin_i + 1; wenxin_j < wenxin_particles.length; wenxin_j++) {
        var wenxin_q = wenxin_particles[wenxin_j];
        var wenxin_dx = wenxin_p.x - wenxin_q.x;
        var wenxin_dy = wenxin_p.y - wenxin_q.y;
        var wenxin_dist = Math.sqrt(wenxin_dx * wenxin_dx + wenxin_dy * wenxin_dy);
        if (wenxin_dist < wenxin_LINK_DISTANCE) {
          var wenxin_alpha = (1 - wenxin_dist / wenxin_LINK_DISTANCE) * 0.35;
          wenxin_ctx.beginPath();
          wenxin_ctx.moveTo(wenxin_p.x, wenxin_p.y);
          wenxin_ctx.lineTo(wenxin_q.x, wenxin_q.y);
          wenxin_ctx.strokeStyle = 'rgba(90, 150, 235, ' + wenxin_alpha.toFixed(3) + ')';
          wenxin_ctx.lineWidth = 0.7;
          wenxin_ctx.stroke();
        }
      }

      /* 鼠标吸附连线 */
      var wenxin_mdx = wenxin_p.x - wenxin_mouse.x;
      var wenxin_mdy = wenxin_p.y - wenxin_mouse.y;
      var wenxin_mdist = Math.sqrt(wenxin_mdx * wenxin_mdx + wenxin_mdy * wenxin_mdy);
      if (wenxin_mdist < wenxin_MOUSE_DISTANCE) {
        var wenxin_mAlpha = (1 - wenxin_mdist / wenxin_MOUSE_DISTANCE) * 0.55;
        wenxin_ctx.beginPath();
        wenxin_ctx.moveTo(wenxin_p.x, wenxin_p.y);
        wenxin_ctx.lineTo(wenxin_mouse.x, wenxin_mouse.y);
        wenxin_ctx.strokeStyle = 'rgba(120, 180, 255, ' + wenxin_mAlpha.toFixed(3) + ')';
        wenxin_ctx.lineWidth = 0.8;
        wenxin_ctx.stroke();
      }
    }

    window.requestAnimationFrame(wenxin_draw);
  }

  window.addEventListener('resize', wenxin_resize);
  window.addEventListener('mousemove', function (wenxin_event) {
    wenxin_mouse.x = wenxin_event.clientX;
    wenxin_mouse.y = wenxin_event.clientY;
  });
  window.addEventListener('mouseleave', function () {
    wenxin_mouse.x = -9999;
    wenxin_mouse.y = -9999;
  });

  wenxin_resize();
  wenxin_draw();
})();
