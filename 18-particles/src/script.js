import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const particleTexture = textureLoader.load("/textures/particles/3.png");

//Particles
//p geometry
const particleGeometry = new THREE.SphereBufferGeometry(1, 32, 32);
const count = 5000;
const customParticleGeometry = new THREE.BufferGeometry();

const positions = new Float32Array(count * 3);
const colors = new Float32Array(count * 3);

for (let i = 0; i < count * 3; i++) {
  positions[i] = (Math.random() - 0.5) * 10;
  colors[i] = Math.random();
}
customParticleGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positions, 3)
);
customParticleGeometry.setAttribute(
  "color",
  new THREE.BufferAttribute(colors, 3)
);

//p material
const particleMaterial = new THREE.PointsMaterial({ //BETTER TO USE CUSTOMER SHADER (MORE PERFORMANT)
  color: new THREE.Color("#ff88cc"),
  size: 0.1,
  sizeAttenuation: true,
  //Alpha map to hide black "background", alphatest cleans up unwanted slightly see through pixels
  alphaMap: particleTexture,
  transparent: true,
  //alphaTest: 0.001
  //depthTest: false
  depthWrite: false,
  blending: THREE.AdditiveBlending, // Can affect performance...
  vertexColors: true, // the 'color' line impacts the vertex colors
});
//p points
const particles = new THREE.Points(customParticleGeometry, particleMaterial);
scene.add(particles);

/**
 * Test cube
 */
const cube = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial()
);
//scene.add(cube)

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 3;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  //update particles
  //particles.rotation.y = elapsedTime * .01
  for (let i = 0; i < count; i++) {
    const i3 = i * 3

    const x = customParticleGeometry.attributes.position.array[i3]
    customParticleGeometry.attributes.position.array[i3 + 1] = Math.sin(elapsedTime + x )//X,y,z. I3 = x => i3 + 1 = y => i3 + 2 = z
  }
  customParticleGeometry.attributes.position.needsUpdate = true
  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
