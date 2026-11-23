const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let W, H;
function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
resize();
window.addEventListener("resize", resize);

const mouse = { x: W / 2, y: H / 2, px: W / 2, py: H / 2 };
const dust = [];
let hue = 300;

window.addEventListener("pointermove", e => { mouse.x = e.clientX; mouse.y = e.clientY; });

function emit(x, y, amount, power) {
    for (let i = 0; i < amount; i++) {
        const a = Math.random() * Math.PI * 2;
        const s = Math.random() * power;
        dust.push({
            x, y,
            vx: Math.cos(a) * s,
            vy: Math.sin(a) * s - 0.3,
            size: Math.random() * 3 + 0.8,
            life: 1,
            decay: 0.006 + Math.random() * 0.015,
            hue: hue + Math.random() * 60 - 30,
            star: Math.random() < 0.2,                 // some pieces are tiny stars
            twinkle: Math.random() * Math.PI * 2
        });
    }
}
window.addEventListener("pointerdown", e => emit(e.clientX, e.clientY, 160, 7));

function star(x, y, r) {
    ctx.beginPath();
    for (let i = 0; i < 8; i++) {
        const rad = i % 2 === 0 ? r : r * 0.2;
        const a = (Math.PI / 4) * i - Math.PI / 2;
        ctx.lineTo(x + Math.cos(a) * rad, y + Math.sin(a) * rad);
    }
    ctx.closePath(); ctx.fill();
}

function animate(time) {
    requestAnimationFrame(animate);
    const t = time * 0.001;
    hue = (hue + 0.4) % 360;

    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = "rgba(14, 6, 32, 0.22)";           // dark purple night, leaves soft trails
    ctx.fillRect(0, 0, W, H);

    // dust is made along the path of the wand
    const moved = Math.hypot(mouse.x - mouse.px, mouse.y - mouse.py);
    const steps = Math.min(8, Math.ceil(moved / 6));
    for (let i = 0; i < steps; i++) {
        emit(mouse.px + (mouse.x - mouse.px) * (i / steps),
             mouse.py + (mouse.y - mouse.py) * (i / steps), 3, 1.6);
    }
    emit(mouse.x, mouse.y, 1, 0.8);                    // a little magic even when still
    mouse.px = mouse.x; mouse.py = mouse.y;

    ctx.globalCompositeOperation = "lighter";
    for (let i = dust.length - 1; i >= 0; i--) {
        const p = dust[i];
        p.x += p.vx; p.y += p.vy;
        p.vy += 0.03;                                   // dust slowly falls
        p.vx *= 0.99;
        p.life -= p.decay;
        if (p.life <= 0) { dust.splice(i, 1); continue; }

        const tw = 0.6 + 0.4 * Math.sin(t * 12 + p.twinkle);
        ctx.fillStyle = `hsla(${p.hue}, 100%, 70%, ${p.life * tw})`;
        if (p.star) star(p.x, p.y, p.size * 2.5 * p.life);
        else { ctx.beginPath(); ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2); ctx.fill(); }
    }

    // glowing wand tip
    const g = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 36);
    g.addColorStop(0, "rgba(255,255,255,0.95)");
    g.addColorStop(0.25, `hsla(${hue}, 100%, 75%, 0.6)`);
    g.addColorStop(1, `hsla(${hue}, 100%, 70%, 0)`);
    ctx.fillStyle = g;
    ctx.fillRect(mouse.x - 36, mouse.y - 36, 72, 72);
    ctx.fillStyle = "#fff";
    star(mouse.x, mouse.y, 11 + Math.sin(t * 6) * 2);
}
requestAnimationFrame(animate);
