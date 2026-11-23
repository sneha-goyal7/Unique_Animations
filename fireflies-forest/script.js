const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let W, H, scene, flies = [];
const mouse = { x: -999, y: -999 };

// draw sky, moon and pine forest once on a hidden canvas
function pineLayer(c, color, baseY, treeH, gap) {
    c.fillStyle = color;
    for (let x = -20; x < W + 40; x += gap * (0.7 + Math.random() * 0.6)) {
        const h = treeH * (0.7 + Math.random() * 0.6);
        const w = h * 0.38;
        for (let k = 0; k < 4; k++) {                       // stacked triangles
            const top = baseY - h + k * h * 0.2;
            const wk = w * (0.45 + k * 0.2);
            c.beginPath();
            c.moveTo(x, top);
            c.lineTo(x - wk, top + h * 0.38);
            c.lineTo(x + wk, top + h * 0.38);
            c.fill();
        }
        c.fillRect(x - 3, baseY - h * 0.2, 6, h * 0.25);
    }
    c.fillRect(0, baseY, W, H - baseY);
}

function buildScene() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
    scene = document.createElement("canvas");
    scene.width = W; scene.height = H;
    const c = scene.getContext("2d");

    const sky = c.createLinearGradient(0, 0, 0, H);
    sky.addColorStop(0, "#050914");
    sky.addColorStop(0.6, "#0a2230");
    sky.addColorStop(1, "#0d3a3a");
    c.fillStyle = sky; c.fillRect(0, 0, W, H);

    // moon with glow
    const mx = W * 0.78, my = H * 0.2, mr = Math.min(W, H) * 0.07;
    const glow = c.createRadialGradient(mx, my, mr * 0.5, mx, my, mr * 4);
    glow.addColorStop(0, "rgba(255,248,210,0.35)");
    glow.addColorStop(1, "rgba(255,248,210,0)");
    c.fillStyle = glow; c.fillRect(0, 0, W, H);
    c.fillStyle = "#fff6d0";
    c.beginPath(); c.arc(mx, my, mr, 0, Math.PI * 2); c.fill();

    // three layers of trees, far to near
    pineLayer(c, "#0b2a33", H * 0.78, H * 0.35, 70);
    pineLayer(c, "#071c24", H * 0.88, H * 0.42, 85);
    pineLayer(c, "#030d12", H * 1.0, H * 0.5, 110);
}

function makeFly() {
    return {
        x: Math.random() * W, y: H * 0.4 + Math.random() * H * 0.6,
        angle: Math.random() * Math.PI * 2,
        speed: 0.3 + Math.random() * 0.6,
        phase: Math.random() * Math.PI * 2,
        size: 1.5 + Math.random() * 2
    };
}

function init() { buildScene(); flies = Array.from({ length: 80 }, makeFly); }
init();
window.addEventListener("resize", init);
window.addEventListener("pointermove", e => { mouse.x = e.clientX; mouse.y = e.clientY; });

function animate(time) {
    requestAnimationFrame(animate);
    const t = time * 0.001;
    ctx.drawImage(scene, 0, 0);

    for (const f of flies) {
        f.angle += (Math.random() - 0.5) * 0.3;            // wandering flight

        const dx = mouse.x - f.x, dy = mouse.y - f.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 260) {                                  // drawn to the cursor
            const want = Math.atan2(dy, dx);
            f.angle += Math.sin(want - f.angle) * 0.08;
        }
        f.x += Math.cos(f.angle) * f.speed;
        f.y += Math.sin(f.angle) * f.speed;
        if (f.x < -20) f.x = W + 20; if (f.x > W + 20) f.x = -20;
        if (f.y < 0) f.y = H; if (f.y > H) f.y = 0;

        const pulse = 0.5 + 0.5 * Math.sin(t * 2 + f.phase);   // blinking glow
        const g = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.size * 9);
        g.addColorStop(0, `rgba(220,255,120,${0.9 * pulse})`);
        g.addColorStop(0.3, `rgba(180,255,90,${0.35 * pulse})`);
        g.addColorStop(1, "rgba(180,255,90,0)");
        ctx.fillStyle = g;
        ctx.fillRect(f.x - f.size * 9, f.y - f.size * 9, f.size * 18, f.size * 18);
    }
}
requestAnimationFrame(animate);
