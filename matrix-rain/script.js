const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const chars = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ<>{}[]/*+=";
const fontSize = 16;
const colors = ["#00ff66", "#00e5ff", "#ff4c9a", "#facc15"];
let colorIndex = 0;
let W, H, columns, drops;

function init() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
    columns = Math.floor(W / fontSize);
    drops = Array.from({ length: columns }, () => Math.floor(Math.random() * -50));
}
init();
window.addEventListener("resize", init);
window.addEventListener("click", () => { colorIndex = (colorIndex + 1) % colors.length; });

let last = 0;
function animate(time) {
    requestAnimationFrame(animate);
    if (time - last < 45) return;          // controls the speed
    last = time;

    ctx.fillStyle = "rgba(0, 0, 0, 0.07)";
    ctx.fillRect(0, 0, W, H);
    ctx.font = fontSize + "px monospace";

    for (let i = 0; i < columns; i++) {
        const ch = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        ctx.fillStyle = "#ffffff";                   // bright head
        ctx.fillText(ch, x, y);
        ctx.fillStyle = colors[colorIndex];          // trail
        ctx.fillText(chars[Math.floor(Math.random() * chars.length)], x, y - fontSize);

        if (y > H && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
    }
}
requestAnimationFrame(animate);
