---
name: elite-creative-web-stack
description: >-
  Architectural patterns, synchronization rules, and code recipes for uniting
  Three.js, WebGPU, Lenis, GSAP ScrollTrigger, Curtains.js, Rapier 3D WASM,
  and Web Audio API into a single unified 120 FPS render pipeline.
---

# Elite Creative Web Stack: Orchestration & Synergy Guide

This skill documents how to properly combine modern creative web development tools into a single, cohesive, high-performance web experience without CPU contention or frame drops.

---

## 1. Unified Render Loop Architecture

Never let Three.js, Lenis, and GSAP run competing `requestAnimationFrame` loops. Use `gsap.ticker` as the single heartbeat:

```javascript
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// 1. Initialize Lenis
const lenis = new Lenis({
  lerp: 0.08,             // Buttery smooth inertia
  smoothWheel: true,
  wheelMultiplier: 0.9,
});

// 2. Synchronize Lenis with GSAP ScrollTrigger
lenis.on('scroll', ScrollTrigger.update);

// 3. Drive Lenis & Three.js through GSAP's single ticker
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);         // Advance virtual scroll
  controls.update();              // Update camera controls
  renderer.render(scene, camera); // Render 3D canvas
});

// 4. Disable GSAP lag smoothing to keep physics continuous
gsap.ticker.lagSmoothing(0);
```

---

## 2. DOM-to-WebGL Synchronization (`Curtains.js` / `r3f-scroll-rig`)

Keep semantic HTML for SEO and accessibility while proxying visual media to WebGL shader planes:

1. **DOM Positioning**: Use `getBoundingClientRect()` to compute exact CSS bounding boxes.
2. **Plane Matching**: Size 3D quad meshes to match DOM boxes in world space.
3. **Scroll Velocity Feed**: Pass `lenis.velocity` into shader uniform `uVelocity`. As the user scrolls fast, trigger chromatic split or liquid UV waves, returning to a crisp HTML image at rest.

---

## 3. Motion & Timeline Division: GSAP vs. Theatre.js

- **GSAP (ScrollTrigger)**: Best for DOM coordinate mapping, kinetic typography splits, and staggered section entries.
- **Theatre.js**: Best for 3D camera fly-throughs, light curves, and spatial choreography.
- **Synergy**: Use `ScrollTrigger.create({ scrub: true })` to scrub `theatreProject.sheet.sequence.position` directly from scroll depth.

---

## 4. Physics & Colliders: Rapier 3D (WASM)

- Run physics on a fixed timestep inside the main ticker.
- Attach an invisible kinematic sphere collider to normalized mouse coordinates `(pointer.x, pointer.y)`.
- Use spring-damping and restitution so floating badges, cards, or particles scatter on mouse sweep and float back to resting coordinates.

---

## 5. Razor-Sharp 3D Typography: Troika MSDF

- Avoid heavy `TextGeometry` (excessive polygon counts).
- Use `troika-three-text` (Multi-channel Signed Distance Fields).
- Renders directly inside the WebGL depth buffer, allowing 3D refractive glass objects to fly in front of and behind text with zero z-index artifacts.

---

## 6. Zero-Flash Navigation: View Transitions API

- Keep the WebGL canvas persistently mounted at the layout root.
- Wrap page route changes in `document.startViewTransition()`:
  - Swap DOM content.
  - Animate Three.js camera position with `gsap.to(camera.position, { ... })`.
