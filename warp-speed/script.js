const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let W, H;
function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
resize();
window.addEventListener("resize", resize);

const STARS = 900;
const DEPTH = 1000;
const stars = [];
function newStar(randomZ) {
    return {
        x: (Math.random() - 0.5) * W * 2,
        y: (Math.random() - 0.5) * H * 2,
        z: randomZ ? Math.random() * DEPTH : DEPTH
    };
}
for (let i = 0; i < STARS; i++) stars.push(newStar(true));

const mouse = { x: W / 2, y: H / 2 };
const centre = { x: W / 2, y: H / 2 };
let boost = false;
let speed = 6;

window.addEventListener("pointermove", e => { mouse.x = e.clientX; mouse.y = e.clientY; });
window.addEventListener("pointerdown", () => boost = true);
window.addEventListener("pointerup", () => boost = false);

function animate() {
    requestAnimationFrame(animate);
    ctx.fillStyle = "rgba(0, 0, 8, 0.3)";
    ctx.fillRect(0, 0, W, H);

    // smooth speed and steering
    speed += ((boost ? 38 : 6) - speed) * 0.06;
    centre.x += (mouse.x - centre.x) * 0.05;
    centre.y += (mouse.y - centre.y) * 0.05;

    for (const s of stars) {
        const prevZ = s.z;
        s.z -= speed;
        if (s.z <= 1) { Object.assign(s, newStar(false)); continue; }

        // project 3D position to the screen
        const k = 300 / s.z, pk = 300 / (s.z + speed * 1.8);
        const x = centre.x + s.x * k, y = centre.y + s.y * k;
        const px = centre.x + s.x * pk, py = centre.y + s.y * pk;
        if (x < 0 || x > W || y < 0 || y > H) { Object.assign(s, newStar(false)); continue; }

        const near = 1 - s.z / DEPTH;               // 0 far ... 1 near
        ctx.strokeStyle = `hsl(${200 + near * 60}, 90%, ${55 + near * 40}%)`;
        ctx.lineWidth = 0.5 + near * 2.5;
        ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(x, y); ctx.stroke();
    }
}
animate();
