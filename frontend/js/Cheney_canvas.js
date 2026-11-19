/*
 姓名：温馨 | 学号：24001010328 | 时间：2026-11-19 | 大模型：DeepSeek-V4.1-Flash
 文件说明：首页 Canvas 背景动画（漂浮粒子 + 邻近连线 + 鼠标吸附）
*/
(function () {
  var cheney_canvas = document.getElementById('Cheney_canvas');
  if (!cheney_canvas || !cheney_canvas.getContext) {
    return;
  }

  var Cheney_ctx = cheney_canvas.getContext('2d');
  var Cheney_dpr = Math.min(window.devicePixelRatio || 1, 2);
  var Cheney_width = 0;
  var Cheney_height = 0;
  var Cheney_particles = [];
  var Cheney_mouse = { x: -9999, y: -9999 };
  var CHENEY_LINK_DISTANCE = 140;
  var CHENEY_MOUSE_DISTANCE = 180;

  /* 依据容器尺寸重建画布与粒子 */
  function Cheney_resize() {
    Cheney_width = window.innerWidth;
    Cheney_height = window.innerHeight;
    cheney_canvas.width = Cheney_width * Cheney_dpr;
    cheney_canvas.height = Cheney_height * Cheney_dpr;
    Cheney_ctx.setTransform(Cheney_dpr, 0, 0, Cheney_dpr, 0, 0);
    Cheney_buildParticles();
  }

  function Cheney_buildParticles() {
    var Cheney_count = Math.round((Cheney_width * Cheney_height) / 16000);
    Cheney_count = Math.max(40, Math.min(110, Cheney_count));
    Cheney_particles = [];
    for (var Cheney_i = 0; Cheney_i < Cheney_count; Cheney_i++) {
      Cheney_particles.push({
        x: Math.random() * Cheney_width,
        y: Math.random() * Cheney_height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.8 + 0.8
      });
    }
  }

  /* 绘制一帧 */
  function Cheney_draw() {
    Cheney_ctx.clearRect(0, 0, Cheney_width, Cheney_height);

    for (var Cheney_i = 0; Cheney_i < Cheney_particles.length; Cheney_i++) {
      var Cheney_p = Cheney_particles[Cheney_i];

      /* 运动与边界回弹 */
      Cheney_p.x += Cheney_p.vx;
      Cheney_p.y += Cheney_p.vy;
      if (Cheney_p.x < 0 || Cheney_p.x > Cheney_width) {
        Cheney_p.vx *= -1;
      }
      if (Cheney_p.y < 0 || Cheney_p.y > Cheney_height) {
        Cheney_p.vy *= -1;
      }

      /* 粒子点 */
      Cheney_ctx.beginPath();
      Cheney_ctx.arc(Cheney_p.x, Cheney_p.y, Cheney_p.r, 0, Math.PI * 2);
      Cheney_ctx.fillStyle = 'rgba(150, 200, 255, 0.75)';
      Cheney_ctx.fill();

      /* 粒子间连线 */
      for (var Cheney_j = Cheney_i + 1; Cheney_j < Cheney_particles.length; Cheney_j++) {
        var Cheney_q = Cheney_particles[Cheney_j];
        var Cheney_dx = Cheney_p.x - Cheney_q.x;
        var Cheney_dy = Cheney_p.y - Cheney_q.y;
        var Cheney_dist = Math.sqrt(Cheney_dx * Cheney_dx + Cheney_dy * Cheney_dy);
        if (Cheney_dist < CHENEY_LINK_DISTANCE) {
          var Cheney_alpha = (1 - Cheney_dist / CHENEY_LINK_DISTANCE) * 0.35;
          Cheney_ctx.beginPath();
          Cheney_ctx.moveTo(Cheney_p.x, Cheney_p.y);
          Cheney_ctx.lineTo(Cheney_q.x, Cheney_q.y);
          Cheney_ctx.strokeStyle = 'rgba(90, 150, 235, ' + Cheney_alpha.toFixed(3) + ')';
          Cheney_ctx.lineWidth = 0.7;
          Cheney_ctx.stroke();
        }
      }

      /* 鼠标吸附连线 */
      var Cheney_mdx = Cheney_p.x - Cheney_mouse.x;
      var Cheney_mdy = Cheney_p.y - Cheney_mouse.y;
      var Cheney_mdist = Math.sqrt(Cheney_mdx * Cheney_mdx + Cheney_mdy * Cheney_mdy);
      if (Cheney_mdist < CHENEY_MOUSE_DISTANCE) {
        var Cheney_mAlpha = (1 - Cheney_mdist / CHENEY_MOUSE_DISTANCE) * 0.55;
        Cheney_ctx.beginPath();
        Cheney_ctx.moveTo(Cheney_p.x, Cheney_p.y);
        Cheney_ctx.lineTo(Cheney_mouse.x, Cheney_mouse.y);
        Cheney_ctx.strokeStyle = 'rgba(120, 180, 255, ' + Cheney_mAlpha.toFixed(3) + ')';
        Cheney_ctx.lineWidth = 0.8;
        Cheney_ctx.stroke();
      }
    }

    window.requestAnimationFrame(Cheney_draw);
  }

  window.addEventListener('resize', Cheney_resize);
  window.addEventListener('mousemove', function (Cheney_event) {
    Cheney_mouse.x = Cheney_event.clientX;
    Cheney_mouse.y = Cheney_event.clientY;
  });
  window.addEventListener('mouseleave', function () {
    Cheney_mouse.x = -9999;
    Cheney_mouse.y = -9999;
  });

  Cheney_resize();
  Cheney_draw();
})();
