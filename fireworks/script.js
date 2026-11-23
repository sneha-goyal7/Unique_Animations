const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let W, H;
function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
resize();
window.addEventListener("resize", resize);

const rockets = [];
const sparks = [];

function launch(tx, ty) {
    rockets.push({
        x: tx + (Math.random() - 0.5) * 250,
        y: H,
        tx, ty,
        hue: Math.random() * 360
    });
}

function explode(x, y, hue) {
    const count = 110;
    for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 6 + 1;
        sparks.push({
            x, y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            life: 1,
            decay: Math.random() * 0.015 + 0.008,
            hue: hue + Math.random() * 40 - 20
        });
    }
}

window.addEventListener("pointerdown", e => launch(e.clientX, e.clientY));
setInterval(() => launch(Math.random() * W, Math.random() * H * 0.5 + 40), 120);  // auto fireworks

function animate() {
    requestAnimationFrame(animate);
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = "rgba(0, 0, 0, 0.22)";
    ctx.fillRect(0, 0, W, H);
    ctx.globalCompositeOperation = "lighter";

    // rockets fly up
    for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i];
        r.x += (r.tx - r.x) * 0.05;
        r.y += (r.ty - r.y) * 0.05;
        ctx.fillStyle = `hsl(${r.hue}, 100%, 70%)`;
        ctx.beginPath(); ctx.arc(r.x, r.y, 2.5, 0, Math.PI * 2); ctx.fill();
        if (Math.abs(r.ty - r.y) < 10) {
            explode(r.x, r.y, r.hue);
            rockets.splice(i, 1);
        }
    }

    // sparks fall with gravity
    for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.vx *= 0.985; s.vy *= 0.985;
        s.vy += 0.05;
        s.x += s.vx; s.y += s.vy;
        s.life -= s.decay;
        if (s.life <= 0) { sparks.splice(i, 1); continue; }
        ctx.fillStyle = `hsla(${s.hue}, 100%, 60%, ${s.life})`;
        ctx.beginPath(); ctx.arc(s.x, s.y, 2, 0, Math.PI * 2); ctx.fill();
    }
}
animate();
