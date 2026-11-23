const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const TEXT = "SNEHA GOYAL";      // <-- change your text here
let W, H, particles = [];
const mouse = { x: -9999, y: -9999 };

function build() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;

    // draw the text on a hidden canvas and read its pixels
    const off = document.createElement("canvas");
    off.width = W; off.height = H;
    const o = off.getContext("2d");
    const fontSize = Math.min(W / (TEXT.length * 0.65), H / 3);
    o.fillStyle = "#fff";
    o.font = `bold ${fontSize}px Arial`;
    o.textAlign = "center";
    o.textBaseline = "middle";
    o.fillText(TEXT, W / 2, H / 2);
    const data = o.getImageData(0, 0, W, H).data;

    const gap = Math.max(3, Math.round(W / 260));
    particles = [];
    for (let y = 0; y < H; y += gap) {
        for (let x = 0; x < W; x += gap) {
            if (data[(y * W + x) * 4 + 3] > 128) {
                particles.push({
                    hx: x, hy: y,                       // home position
                    x: Math.random() * W,               // start scattered
                    y: Math.random() * H,
                    vx: 0, vy: 0,
                    hue: 180 + (x / W) * 150            // blue -> pink
                });
            }
        }
    }
}
build();
window.addEventListener("resize", build);
window.addEventListener("pointermove", e => { mouse.x = e.clientX; mouse.y = e.clientY; });
window.addEventListener("pointerleave", () => { mouse.x = mouse.y = -9999; });

function animate() {
    requestAnimationFrame(animate);
    ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
    ctx.fillRect(0, 0, W, H);

    for (const p of particles) {
        // spring back to home
        p.vx += (p.hx - p.x) * 0.05;
        p.vy += (p.hy - p.y) * 0.05;

        // cursor pushes particles away
        const dx = p.x - mouse.x, dy = p.y - mouse.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 110) {
            const force = (110 - dist) / 110;
            p.vx += (dx / dist) * force * 6;
            p.vy += (dy / dist) * force * 6;
        }

        p.vx *= 0.85; p.vy *= 0.85;
        p.x += p.vx; p.y += p.vy;

        ctx.fillStyle = `hsl(${p.hue}, 90%, 65%)`;
        ctx.fillRect(p.x, p.y, 2.2, 2.2);
    }
}
animate();
