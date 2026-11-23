const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let W, H, stars = [];

function init() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
    stars = Array.from({ length: 350 }, () => ({
        x: Math.random() * W, y: Math.random() * H,
        r: Math.random() * 1.4 + 0.3,
        speed: 0.5 + Math.random() * 2,
        phase: Math.random() * Math.PI * 2
    }));
}
init();
window.addEventListener("resize", init);

const shooting = [];
const sparkles = [];
const wishes = [];

function shoot() {
    shooting.push({
        x: Math.random() * W * 0.9 + W * 0.1, y: Math.random() * H * 0.4,
        vx: -(8 + Math.random() * 6), vy: 3 + Math.random() * 3,
        life: 1
    });
}
setInterval(shoot, 1800);

// 4 pointed sparkle star shape
function drawStar(x, y, r, color, alpha) {
    ctx.save();
    ctx.translate(x, y);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.beginPath();
    for (let i = 0; i < 8; i++) {
        const rad = i % 2 === 0 ? r : r * 0.25;
        const a = (Math.PI / 4) * i - Math.PI / 2;
        ctx.lineTo(Math.cos(a) * rad, Math.sin(a) * rad);
    }
    ctx.closePath(); ctx.fill();
    ctx.restore();
}

const wishTexts = ["Make a wish...", "Dreams come true", "Believe in magic", "Once upon a time...", "Wish granted"];
window.addEventListener("pointerdown", e => {
    for (let i = 0; i < 40; i++) {
        const a = Math.random() * Math.PI * 2, s = Math.random() * 4 + 1;
        sparkles.push({
            x: e.clientX, y: e.clientY, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 1,
            r: Math.random() * 7 + 3, life: 1, decay: 0.008 + Math.random() * 0.012,
            color: ["#ffe27a", "#ffffff", "#ffb3e6", "#a8d8ff"][Math.floor(Math.random() * 4)]
        });
    }
    wishes.push({ x: e.clientX, y: e.clientY - 20, life: 1,
                  text: wishTexts[Math.floor(Math.random() * wishTexts.length)] });
    shoot();
});

function animate(time) {
    requestAnimationFrame(animate);
    const t = time * 0.001;

    const sky = ctx.createLinearGradient(0, 0, 0, H);
    sky.addColorStop(0, "#07061a");
    sky.addColorStop(0.7, "#1a1040");
    sky.addColorStop(1, "#3a1c5a");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, W, H);

    // twinkling stars
    for (const s of stars) {
        const a = 0.35 + 0.65 * Math.abs(Math.sin(t * s.speed + s.phase));
        ctx.fillStyle = `rgba(255,255,255,${a})`;
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill();
    }

    // shooting stars with a tail
    for (let i = shooting.length - 1; i >= 0; i--) {
        const s = shooting[i];
        s.x += s.vx; s.y += s.vy; s.life -= 0.012;
        if (s.life <= 0) { shooting.splice(i, 1); continue; }
        const g = ctx.createLinearGradient(s.x, s.y, s.x - s.vx * 9, s.y - s.vy * 9);
        g.addColorStop(0, `rgba(255,255,255,${s.life})`);
        g.addColorStop(1, "rgba(255,255,255,0)");
        ctx.strokeStyle = g; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(s.x, s.y); ctx.lineTo(s.x - s.vx * 9, s.y - s.vy * 9); ctx.stroke();
    }

    // wish sparkles
    for (let i = sparkles.length - 1; i >= 0; i--) {
        const p = sparkles[i];
        p.x += p.vx; p.y += p.vy; p.vy += 0.04; p.vx *= 0.98; p.life -= p.decay;
        if (p.life <= 0) { sparkles.splice(i, 1); continue; }
        drawStar(p.x, p.y, p.r * p.life, p.color, p.life);
    }

    // wish text floating up
    ctx.textAlign = "center";
    ctx.font = "italic 22px Georgia, serif";
    for (let i = wishes.length - 1; i >= 0; i--) {
        const w = wishes[i];
        w.y -= 0.5; w.life -= 0.008;
        if (w.life <= 0) { wishes.splice(i, 1); continue; }
        ctx.fillStyle = `rgba(255,236,160,${w.life})`;
        ctx.fillText(w.text, w.x, w.y);
    }
}
requestAnimationFrame(animate);
