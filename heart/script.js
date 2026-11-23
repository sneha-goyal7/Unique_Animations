const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let W, H, scale;
function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
    scale = Math.min(W, H) / 38;      // heart size
}
resize();
window.addEventListener("resize", resize);

// heart centre follows the cursor smoothly
const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
const centre = { x: mouse.x, y: mouse.y };
window.addEventListener("pointermove", e => { mouse.x = e.clientX; mouse.y = e.clientY; });

// heart curve
function heartPoint(t) {
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
    return { x, y };
}

// create particles along the heart outline
const COUNT = 7000;
const particles = [];
for (let i = 0; i < COUNT; i++) {
    const p = heartPoint(Math.random() * Math.PI * 2);
    const spread = (Math.random() + Math.random() + Math.random() - 1.5) * 2.2;  // thickness
    const angle = Math.random() * Math.PI * 2;
    particles.push({
        hx: p.x + Math.cos(angle) * spread,      // home position (heart units)
        hy: p.y + Math.sin(angle) * spread,
        x: Math.random() * W,
        y: Math.random() * H,
        ease: 0.03 + Math.random() * 0.07,       // different speeds = soft trail
        size: Math.random() * 1.4 + 0.4,
        hue: 325 + Math.random() * 30,
        light: 55 + Math.random() * 30,
        phase: Math.random() * Math.PI * 2
    });
}

function animate(time) {
    requestAnimationFrame(animate);
    const t = time * 0.001;

    // fade old frame for glowing trails
    ctx.fillStyle = "rgba(0, 0, 0, 0.28)";
    ctx.fillRect(0, 0, W, H);

    // smooth movement of the heart centre
    centre.x += (mouse.x - centre.x) * 0.08;
    centre.y += (mouse.y - centre.y) * 0.08;

    // heartbeat
    const beat = 1 + 0.05 * Math.pow(Math.sin(t * 3), 6) + 0.015 * Math.sin(t * 1.5);

    for (const p of particles) {
        const shimmer = Math.sin(t * 2 + p.phase) * 0.35;
        const tx = centre.x + (p.hx + shimmer) * scale * beat;
        const ty = centre.y + (p.hy + shimmer) * scale * beat;
        p.x += (tx - p.x) * p.ease;
        p.y += (ty - p.y) * p.ease;

        ctx.fillStyle = `hsl(${p.hue}, 85%, ${p.light}%)`;
        ctx.fillRect(p.x, p.y, p.size, p.size);
    }
}
requestAnimationFrame(animate);