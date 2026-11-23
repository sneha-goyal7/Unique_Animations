const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let W, H, flakes = [], stars = [], mountains;
let wind = 0, windTarget = 0;

function init() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
    flakes = Array.from({ length: 170 }, () => ({
        x: Math.random() * W, y: Math.random() * H,
        r: Math.random() * 2.6 + 0.8,
        speed: Math.random() * 0.9 + 0.4,
        phase: Math.random() * 6.28
    }));
    stars = Array.from({ length: 150 }, () => ({
        x: Math.random() * W, y: Math.random() * H * 0.6,
        r: Math.random() * 1.1 + 0.2, phase: Math.random() * 6.28
    }));

    // icy mountains drawn once
    mountains = document.createElement("canvas");
    mountains.width = W; mountains.height = H;
    const c = mountains.getContext("2d");
    const layer = (color, base, amp, freq, seed) => {
        c.fillStyle = color;
        c.beginPath(); c.moveTo(0, H);
        for (let x = 0; x <= W; x += 6) {
            const y = base - Math.abs(Math.sin(x * freq + seed)) * amp - Math.sin(x * freq * 2.3 + seed) * amp * 0.25;
            c.lineTo(x, y);
        }
        c.lineTo(W, H); c.closePath(); c.fill();
    };
    layer("#16294d", H * 0.82, H * 0.18, 0.004, 1);
    layer("#0d1a33", H * 0.9, H * 0.12, 0.006, 4);
    layer("#070d1c", H * 1.0, H * 0.1, 0.009, 7);
}
init();
window.addEventListener("resize", init);
window.addEventListener("pointermove", e => { windTarget = (e.clientX / W - 0.5) * 3; });

// one vertical gradient reused for every aurora strip
const bandGrad = ctx.createLinearGradient(0, 0, 0, 200);
bandGrad.addColorStop(0, "rgba(255,255,255,0)");
bandGrad.addColorStop(0.35, "rgba(255,255,255,0.55)");
bandGrad.addColorStop(1, "rgba(255,255,255,0)");

function aurora(t) {
    const bands = [{ hue: 150, off: 0 }, { hue: 185, off: 2 }, { hue: 280, off: 4 }];
    ctx.globalCompositeOperation = "lighter";
    for (const b of bands) {
        ctx.fillStyle = `hsla(${b.hue}, 100%, 60%, 0.22)`;
        for (let x = 0; x < W; x += 4) {
            const y = H * 0.22 + Math.sin(x * 0.004 + t * 0.4 + b.off) * 60 + Math.sin(x * 0.011 + t * 0.7 + b.off) * 22;
            const h = 150 + Math.sin(x * 0.006 + t * 0.6 + b.off) * 60;
            ctx.save();
            ctx.translate(x, y);
            ctx.scale(1, h / 200);
            // alpha mask: gradient fills a strip, colour comes from fillStyle through "source-atop" style layering
            ctx.globalAlpha = 0.5;
            ctx.fillStyle = bandColor(b.hue);
            ctx.fillRect(0, 0, 4, 200);
            ctx.restore();
        }
    }
    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = 1;
}

// per hue gradient cache
const gradCache = {};
function bandColor(hue) {
    if (!gradCache[hue]) {
        const g = ctx.createLinearGradient(0, 0, 0, 200);
        g.addColorStop(0, `hsla(${hue}, 100%, 60%, 0)`);
        g.addColorStop(0.35, `hsla(${hue}, 100%, 60%, 0.5)`);
        g.addColorStop(1, `hsla(${hue}, 100%, 60%, 0)`);
        gradCache[hue] = g;
    }
    return gradCache[hue];
}

function animate(time) {
    requestAnimationFrame(animate);
    const t = time * 0.001;
    wind += (windTarget - wind) * 0.03;

    const sky = ctx.createLinearGradient(0, 0, 0, H);
    sky.addColorStop(0, "#02040f");
    sky.addColorStop(1, "#0b1a3a");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, W, H);

    for (const s of stars) {
        ctx.fillStyle = `rgba(255,255,255,${0.3 + 0.6 * Math.abs(Math.sin(t * 0.8 + s.phase))})`;
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill();
    }

    aurora(t);
    ctx.drawImage(mountains, 0, 0);

    // snowfall, cursor controls the wind
    ctx.fillStyle = "rgba(255,255,255,0.9)";
    for (const f of flakes) {
        f.y += f.speed + f.r * 0.15;
        f.x += Math.sin(t + f.phase) * 0.5 + wind * (0.5 + f.r * 0.3);
        if (f.y > H + 5) { f.y = -5; f.x = Math.random() * W; }
        if (f.x > W + 5) f.x = -5;
        if (f.x < -5) f.x = W + 5;
        ctx.beginPath(); ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2); ctx.fill();
    }
}
requestAnimationFrame(animate);
