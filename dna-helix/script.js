const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let W, H;
function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
resize();
window.addEventListener("resize", resize);

const mouse = { x: 0.5 };
window.addEventListener("pointermove", e => { mouse.x = e.clientX / W; });

const PAIRS = 46;       // number of base pairs
const RADIUS = 110;     // helix width
const FOCAL = 600;      // perspective strength
let angleOffset = 0;
let tilt = 0.5;

function animate() {
    requestAnimationFrame(animate);
    ctx.fillStyle = "rgba(5, 8, 20, 0.35)";
    ctx.fillRect(0, 0, W, H);

    // cursor controls tilt and rotation speed
    const targetTilt = 0.2 + mouse.x * 0.9;
    tilt += (targetTilt - tilt) * 0.05;
    angleOffset += 0.012 + Math.abs(mouse.x - 0.5) * 0.06;

    const spacing = Math.max(H, W) / (PAIRS - 6);
    const cosT = Math.cos(tilt), sinT = Math.sin(tilt);
    const cx = W / 2, cy = H / 2;

    for (let i = 0; i < PAIRS; i++) {
        const y3 = (i - PAIRS / 2) * spacing * 0.5;
        const a = i * 0.38 + angleOffset;

        const pts = [1, -1].map(side => {
            const x3 = Math.cos(a) * RADIUS * side;
            const z3 = Math.sin(a) * RADIUS * side;
            // rotate the whole helix (tilt)
            const rx = x3 * cosT - y3 * sinT;
            const ry = x3 * sinT + y3 * cosT;
            const s = FOCAL / (FOCAL + z3);          // perspective scale
            return { x: cx + rx * s, y: cy + ry * s, s, z: z3, side };
        });

        // draw the back dot, the rung, then the front dot
        const [front, back] = pts[0].z > pts[1].z ? [pts[1], pts[0]] : [pts[0], pts[1]];
        dot(back);
        ctx.strokeStyle = "rgba(255,255,255,0.35)";
        ctx.lineWidth = 2 * ((front.s + back.s) / 2);
        ctx.beginPath(); ctx.moveTo(front.x, front.y); ctx.lineTo(back.x, back.y); ctx.stroke();
        dot(front);
    }
}

function dot(p) {
    const color = p.side === 1 ? "78,168,222" : "255,76,96";
    ctx.fillStyle = `rgba(${color}, ${0.4 + p.s * 0.4})`;
    ctx.shadowColor = `rgb(${color})`;
    ctx.shadowBlur = 14 * p.s;
    ctx.beginPath(); ctx.arc(p.x, p.y, 7 * p.s, 0, Math.PI * 2); ctx.fill();
    ctx.shadowBlur = 0;
}
animate();
