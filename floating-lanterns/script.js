const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let W, H, stars = [];

function init() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
    stars = Array.from({ length: 160 }, () => ({
        x: Math.random() * W, y: Math.random() * H * 0.8,
        r: Math.random() * 1.2 + 0.2, phase: Math.random() * 6.28
    }));
}
init();
window.addEventListener("resize", init);

const lanterns = [];
function release(x) {
    const depth = 0.4 + Math.random() * 0.9;            // small = far away
    lanterns.push({
        x: x ?? Math.random() * W,
        y: H + 80,
        size: 38 * depth,
        speed: (0.4 + Math.random() * 0.5) * depth,
        sway: 15 + Math.random() * 25,
        phase: Math.random() * 6.28,
        flicker: Math.random() * 6.28,
        depth
    });
}
for (let i = 0; i < 14; i++) { release(); lanterns[i].y = Math.random() * H; }   // start with some in the sky
setInterval(() => release(), 1100);
window.addEventListener("pointerdown", e => release(e.clientX));

function drawLantern(l, t) {
    const x = l.x + Math.sin(t * 0.8 + l.phase) * l.sway;
    const y = l.y;
    const s = l.size;
    const flick = 0.85 + 0.15 * Math.sin(t * 7 + l.flicker);

    // glow
    const g = ctx.createRadialGradient(x, y, 0, x, y, s * 3.2);
    g.addColorStop(0, `rgba(255,190,90,${0.5 * flick * l.depth})`);
    g.addColorStop(1, "rgba(255,150,60,0)");
    ctx.fillStyle = g;
    ctx.fillRect(x - s * 3.2, y - s * 3.2, s * 6.4, s * 6.4);

    // paper body
    const body = ctx.createLinearGradient(x, y - s, x, y + s);
    body.addColorStop(0, `rgba(255,214,130,${flick})`);
    body.addColorStop(1, `rgba(255,120,40,${flick})`);
    ctx.fillStyle = body;
    ctx.beginPath();
    ctx.moveTo(x - s * 0.55, y - s);
    ctx.lineTo(x + s * 0.55, y - s);
    ctx.lineTo(x + s * 0.8, y + s * 0.8);
    ctx.lineTo(x - s * 0.8, y + s * 0.8);
    ctx.closePath(); ctx.fill();

    // paper ribs and top/bottom rims
    ctx.strokeStyle = "rgba(120,50,10,0.35)";
    ctx.lineWidth = Math.max(1, s * 0.04);
    for (const k of [-0.33, 0, 0.33]) {
        ctx.beginPath();
        ctx.moveTo(x + k * s * 1.1, y - s);
        ctx.lineTo(x + k * s * 1.6, y + s * 0.8);
        ctx.stroke();
    }
    ctx.fillStyle = "rgba(110,45,10,0.8)";
    ctx.fillRect(x - s * 0.6, y - s - s * 0.1, s * 1.2, s * 0.12);
    ctx.fillRect(x - s * 0.85, y + s * 0.75, s * 1.7, s * 0.12);
}

function animate(time) {
    requestAnimationFrame(animate);
    const t = time * 0.001;

    const sky = ctx.createLinearGradient(0, 0, 0, H);
    sky.addColorStop(0, "#080a22");
    sky.addColorStop(0.65, "#1a1a4a");
    sky.addColorStop(1, "#4a2a5a");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, W, H);

    for (const s of stars) {
        ctx.fillStyle = `rgba(255,255,255,${0.3 + 0.5 * Math.abs(Math.sin(t + s.phase))})`;
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill();
    }

    lanterns.sort((a, b) => a.depth - b.depth);          // far ones first
    for (let i = lanterns.length - 1; i >= 0; i--) {
        const l = lanterns[i];
        l.y -= l.speed;
        if (l.y < -120) { lanterns.splice(i, 1); continue; }
    }
    lanterns.forEach(l => drawLantern(l, t));
}
requestAnimationFrame(animate);
