/* 星空 canvas：静态星点 + 轻微闪烁 + 偶发流星；尊重 reduced-motion */
(function () {
  var canvas = document.getElementById("starfield");
  if (!canvas) return;
  var ctx = canvas.getContext("2d");
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var stars = [], meteors = [], W, H, dpr;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth; H = window.innerHeight;
    canvas.width = W * dpr; canvas.height = H * dpr;
    canvas.style.width = W + "px"; canvas.style.height = H + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    stars = [];
    var n = Math.min(180, Math.floor(W * H / 9000));
    for (var i = 0; i < n; i++) {
      stars.push({
        x: Math.random() * W, y: Math.random() * H,
        r: Math.random() * 1.3 + 0.3,
        base: Math.random() * 0.5 + 0.25,
        speed: Math.random() * 0.9 + 0.15,
        phase: Math.random() * Math.PI * 2
      });
    }
  }

  function spawnMeteor() {
    meteors.push({
      x: Math.random() * W * 0.8 + W * 0.1, y: Math.random() * H * 0.3,
      vx: -(Math.random() * 4 + 4), vy: Math.random() * 2 + 1.5, life: 1
    });
  }

  var t = 0;
  function frame() {
    t += 0.016;
    ctx.clearRect(0, 0, W, H);
    for (var i = 0; i < stars.length; i++) {
      var s = stars[i];
      var a = reduced ? s.base : s.base + Math.sin(t * s.speed + s.phase) * 0.22;
      ctx.globalAlpha = Math.max(0.05, a);
      ctx.fillStyle = "#e8e6df";
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    if (!reduced) {
      if (Math.random() < 0.004 && meteors.length < 2) spawnMeteor();
      for (var j = meteors.length - 1; j >= 0; j--) {
        var m = meteors[j];
        m.x += m.vx; m.y += m.vy; m.life -= 0.02;
        if (m.life <= 0) { meteors.splice(j, 1); continue; }
        var grad = ctx.createLinearGradient(m.x, m.y, m.x - m.vx * 12, m.y - m.vy * 12);
        grad.addColorStop(0, "rgba(201,168,106," + m.life * 0.9 + ")");
        grad.addColorStop(1, "rgba(201,168,106,0)");
        ctx.strokeStyle = grad; ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(m.x - m.vx * 12, m.y - m.vy * 12);
        ctx.stroke();
      }
    }
    if (!reduced) requestAnimationFrame(frame);
  }

  window.addEventListener("resize", resize);
  resize();
  frame();
})();
