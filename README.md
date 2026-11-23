# Unique_Animations
A collection of unique, interactive animations built with HTML, CSS, JavaScript and Three.js.
# ✨ Unique Animations

A collection of unique, interactive animations built with **HTML, CSS, JavaScript and Three.js**. Every animation lives in its own folder, runs directly in the browser and responds to the cursor, so you can play with it instead of just watching it.

---

## 🎬 Animations

### 🌌 Space and Science

| Folder | Description | Interaction |
| ------ | ----------- | ----------- |
| `galaxy` | A spiral galaxy made of 100,000 glowing particles (Three.js) | Cursor moves the camera, scroll to zoom, click to change colours |
| `warp-speed` | Travelling through space at light speed with star streaks | Cursor steers, hold the mouse button to boost |
| `dna-helix` | A rotating 3D-style DNA double helix with glowing base pairs | Cursor tilts the helix and changes the speed |

### 💻 Creative Coding

| Folder | Description | Interaction |
| ------ | ----------- | ----------- |
| `heart` | A pink particle heart that beats like a real heart | Heart follows the cursor with a soft trail |
| `particle-text` | Text built from thousands of particles | Cursor scatters the particles, they join back again |
| `fireworks` | Rockets that blast into colourful sparks with gravity | Click to launch, they also fire automatically |
| `matrix-rain` | Falling green code, inspired by the Matrix | Click to change the colour |

### 🧚 Fairy Tale Vibes

| Folder | Description | Interaction |
| ------ | ----------- | ----------- |
| `fireflies-forest` | A moonlit pine forest full of blinking fireflies | Fireflies are drawn to the cursor |
| `wishing-stars` | A twinkling night sky with shooting stars | Click to make a wish and release golden sparkles |
| `fairy-dust-wand` | Your cursor becomes a magic wand that leaves fairy dust | Move to leave dust, click for a big burst of magic |
| `floating-lanterns` | Glowing paper lanterns floating up into the night sky | Click to release a new lantern |
| `snow-queen-aurora` | Northern lights over icy mountains with falling snow | Cursor left and right changes the wind |

---

## 🚀 How to Run

1. Clone the repository
   ```bash
   git clone https://github.com/sneha-goyal7/Unique_Animations.git
   ```
2. Open the folder in **VS Code**
3. Open any animation folder and run its `index.html` with the **Live Server** extension (or just double click the file)
4. Move your cursor and enjoy ✨

> The `galaxy` animation loads Three.js from a CDN, so it needs an internet connection. All the other animations work offline.

---

## 📁 Project Structure

Every animation has the same simple structure:

```
Unique_Animations/
├── galaxy/
│   ├── index.html
│   ├── style.css
│   └── script.js
├── heart/
├── fireworks/
├── matrix-rain/
├── particle-text/
├── warp-speed/
├── dna-helix/
├── fireflies-forest/
├── wishing-stars/
├── fairy-dust-wand/
├── floating-lanterns/
├── snow-queen-aurora/
└── README.md
```

---

## 🎨 Customize

Open the `script.js` of any animation and change the values at the top of the file:

- **Colours:** change the `hue` or the colour values
- **Amount:** change `COUNT`, `STARS` or similar to add more or fewer particles
- **Speed:** change the speed or `setInterval` values
- **Text:** in `particle-text`, change `TEXT` to write anything you like

---

## 🧠 What I Learned

- Drawing and animating with the HTML5 **Canvas API**
- Building smooth loops with `requestAnimationFrame`
- Particle systems, easing and simple physics like gravity and friction
- Mouse and touch interaction with pointer events
- 3D graphics basics with **Three.js** (scene, camera, renderer, points)

---

## 🛠️ Tech Stack

- HTML5 Canvas
- CSS3
- JavaScript (ES6)
- Three.js (only for the galaxy)

---

## 👩‍💻 Author

**Sneha Goyal**

- GitHub: [@sneha-goyal7](https://github.com/sneha-goyal7)
- LinkedIn: [goyal-sneha7](https://www.linkedin.com/in/goyal-sneha7)

---

⭐ If you liked these animations, give the repo a star!