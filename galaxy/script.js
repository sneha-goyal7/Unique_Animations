const canvas = document.getElementById("webgl");
const sizes = { width: window.innerWidth, height: window.innerHeight };

// scene, camera, renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.set(3, 3, 3);
scene.add(camera);

const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// galaxy parameters
const parameters = {
    count: 100000,
    size: 0.01,
    radius: 5,
    branches: 3,
    spin: 1,
    randomness: 0.5,
    randomnessPower: 3,
    insideColor: "#ff6030",
    outsideColor: "#1b3984"
};

// colour presets (click to cycle)
const palettes = [
    { inside: "#ff6030", outside: "#1b3984" },
    { inside: "#ff4c60", outside: "#c084fc" },
    { inside: "#facc15", outside: "#3deabf" },
    { inside: "#ffffff", outside: "#4ea8de" }
];
let paletteIndex = 0;

let geometry = null;
let material = null;
let points = null;

function generateGalaxy() {
    // remove old galaxy
    if (points !== null) {
        geometry.dispose();
        material.dispose();
        scene.remove(points);
    }

    geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(parameters.count * 3);
    const colors = new Float32Array(parameters.count * 3);

    const colorInside = new THREE.Color(parameters.insideColor);
    const colorOutside = new THREE.Color(parameters.outsideColor);

    for (let i = 0; i < parameters.count; i++) {
        const i3 = i * 3;

        const radius = Math.random() * parameters.radius;
        const spinAngle = radius * parameters.spin;
        const branchAngle = ((i % parameters.branches) / parameters.branches) * Math.PI * 2;

        const rand = () =>
            Math.pow(Math.random(), parameters.randomnessPower) *
            (Math.random() < 0.5 ? 1 : -1) *
            parameters.randomness * radius;

        positions[i3]     = Math.cos(branchAngle + spinAngle) * radius + rand();
        positions[i3 + 1] = rand();
        positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + rand();

        // colour: centre -> edge
        const mixed = colorInside.clone();
        mixed.lerp(colorOutside, radius / parameters.radius);
        colors[i3]     = mixed.r;
        colors[i3 + 1] = mixed.g;
        colors[i3 + 2] = mixed.b;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    material = new THREE.PointsMaterial({
        size: parameters.size,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true
    });

    points = new THREE.Points(geometry, material);
    scene.add(points);
}
generateGalaxy();

// click -> next colour palette
canvas.addEventListener("click", () => {
    paletteIndex = (paletteIndex + 1) % palettes.length;
    parameters.insideColor = palettes[paletteIndex].inside;
    parameters.outsideColor = palettes[paletteIndex].outside;
    generateGalaxy();
});

// cursor parallax + scroll zoom
const cursor = { x: 0, y: 0 };
window.addEventListener("pointermove", e => {
    cursor.x = e.clientX / sizes.width - 0.5;
    cursor.y = e.clientY / sizes.height - 0.5;
});

let zoom = 1;
window.addEventListener("wheel", e => {
    zoom = Math.min(2.5, Math.max(0.4, zoom + e.deltaY * 0.001));
});

window.addEventListener("resize", () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
    renderer.setSize(sizes.width, sizes.height);
});

// animation loop
const clock = new THREE.Clock();
const camTarget = new THREE.Vector3();

function tick() {
    const elapsed = clock.getElapsedTime();

    points.rotation.y = elapsed * 0.08;

    // smooth camera movement with the cursor
    const tx = (3 + cursor.x * 3) * zoom;
    const ty = (3 - cursor.y * 3) * zoom;
    camera.position.x += (tx - camera.position.x) * 0.05;
    camera.position.y += (ty - camera.position.y) * 0.05;
    camera.position.z += (3 * zoom - camera.position.z) * 0.05;
    camera.lookAt(camTarget);

    renderer.render(scene, camera);
    requestAnimationFrame(tick);
}
tick();