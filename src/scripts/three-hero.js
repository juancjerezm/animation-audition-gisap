/* ============================================================
   HERO 3D — Visualizador + Partículas
   ============================================================ */

/* ---- SETUP THREE.JS ---- */
const canvas = document.getElementById('hero-canvas');
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 6);

/* ---- VISUALIZADOR ---- */
const vizGroup = new THREE.Group();
scene.add(vizGroup);

let isMobile = window.innerWidth < 768;

const barCount = 20;
const vizMat = new THREE.MeshStandardMaterial({ color: 0x0a0a0a, metalness: 0.7, roughness: 0.2 });

for (let i = 0; i < barCount; i++) {
  const barGeo = new THREE.BoxGeometry(0.18, 1, 0.18);
  const bar = new THREE.Mesh(barGeo, vizMat);
  const x = (i - barCount / 2) * 0.26;
  bar.position.set(x, 0, 0);
  bar.userData.index = i;
  vizGroup.add(bar);
}

function updateVizPosition() {
  isMobile = window.innerWidth < 768;
  vizGroup.visible = true;
  vizGroup.position.set(isMobile ? 0 : 4.5, isMobile ? -1.0 : -0.3, isMobile ? 2 : 0);
  vizGroup.scale.setScalar(isMobile ? 0.5 : 1);
  vizGroup.rotation.set(0, 0, 0);
}
updateVizPosition();

/* ---- PARTÍCULAS ---- */
const particleCount = 135;
const particleGeo = new THREE.BufferGeometry();
const positions = new Float32Array(particleCount * 3);
const particleOriginals = new Float32Array(particleCount * 3);
const sizes = new Float32Array(particleCount);

for (let i = 0; i < particleCount; i++) {
  const x = (Math.random() - 0.5) * 14;
  const y = (Math.random() - 0.5) * 10;
  const z = (Math.random() - 0.5) * 6;
  positions[i * 3] = x;
  positions[i * 3 + 1] = y;
  positions[i * 3 + 2] = z;
  particleOriginals[i * 3] = x;
  particleOriginals[i * 3 + 1] = y;
  particleOriginals[i * 3 + 2] = z;
  sizes[i] = Math.random() * 3 + 1;
}

particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
particleGeo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

const particleMat = new THREE.PointsMaterial({
  color: 0x0a0a0a,
  size: 0.06,
  transparent: true,
  opacity: 0.4,
  sizeAttenuation: true,
});

const particles = new THREE.Points(particleGeo, particleMat);
scene.add(particles);

/* ---- LUZ AMBIENTAL ---- */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

/* ---- LUCES DE PUNTO ---- */
const light1 = new THREE.PointLight(0xffffff, 1.2, 20);
light1.position.set(3, 3, 3);
scene.add(light1);

const light2 = new THREE.PointLight(0xffffff, 0.6, 20);
light2.position.set(-3, -2, 2);
scene.add(light2);

/* ---- INTERACCIÓN CON EL MOUSE ---- */
let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;

window.addEventListener('mousemove', (e) => {
  mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
  mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
});

/* ---- PAUSAR CUANDO EL HERO NO ES VISIBLE ---- */
let isHeroVisible = true;
let animationId = null;

const hero = document.querySelector('.hero');
if (hero) {
  const heroObserver = new IntersectionObserver(([entry]) => {
    isHeroVisible = entry.isIntersecting;
    if (isHeroVisible && !animationId) {
      animationId = requestAnimationFrame(animate);
    }
  }, { threshold: 0 });
  heroObserver.observe(hero);
}

/* ---- ANIMAR ---- */
let scrollY = 0;

window.addEventListener('scroll', () => {
  scrollY = window.scrollY;
}, { passive: true });

function animate() {
  /* Si el hero no se ve, no renderiza — ahorra GPU */
  if (!isHeroVisible) {
    animationId = null;
    return;
  }

  animationId = requestAnimationFrame(animate);
  const now = Date.now();

  /* Movimiento suave del mouse */
  targetX += (mouseX - targetX) * 0.05;
  targetY += (mouseY - targetY) * 0.05;

  /* Animación de las barras del visualizador */
  vizGroup.children.forEach((bar, i) => {
    const h = 0.15 + Math.abs(Math.sin(now * 0.003 + i * 0.5)) * (1.2 + Math.sin(now * 0.001 + i * 0.3) * 0.5);
    bar.scale.y = h;
    bar.position.z = h * 0.5 - 0.3;
  });

  /* En mobile no rota, solo en desktop */
  if (!isMobile) {
    vizGroup.rotation.y = Math.sin(now * 0.0005) * 0.2;
    vizGroup.rotation.x = Math.sin(now * 0.0003) * 0.1;
  } else {
    vizGroup.rotation.y = 0;
    vizGroup.rotation.x = 0;
  }

  /* El visualizador flota con el scroll (solo en desktop) */
  if (!isMobile) {
    vizGroup.position.y = -0.3 + Math.sin(now * 0.0008) * 0.15 - scrollY * 0.0003;
  }

  /* Las partículas ondean — oscilan alrededor de su posición original */
  const positions = particles.geometry.attributes.position.array;
  for (let i = 0; i < particleCount; i++) {
    const ix = i * 3;
    const iy = i * 3 + 1;
    positions[iy] = particleOriginals[iy] + Math.sin(now * 0.001 + i * 0.5) * 0.3;
    positions[ix] = particleOriginals[ix] + Math.cos(now * 0.0008 + i * 0.3) * 0.2;
  }
  particles.geometry.attributes.position.needsUpdate = true;

  /* Parallax de la cámara con las partículas */
  particles.rotation.y = targetX * 0.3;
  particles.rotation.x = targetY * 0.15;

  /* Movimiento sutil de la cámara */
  camera.position.x = targetX * 0.5;
  camera.position.y = -targetY * 0.3;

  renderer.render(scene, camera);
}

animationId = requestAnimationFrame(animate);

/* ---- REDIMENSIONAR (ignora colapso de barra de direcciones en mobile) ---- */
let lastW = window.innerWidth;
let lastH = window.innerHeight;

window.addEventListener('resize', () => {
  const w = window.innerWidth;
  const h = window.innerHeight;
  /* Solo reacciona a cambios reales: orientación o resize de escritorio.
     Ignora el colapso de address bar (Δ ~56px) que dispara resize fantasma. */
  if (Math.abs(w - lastW) < 2 && Math.abs(h - lastH) < 60) return;
  lastW = w;
  lastH = h;

  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
  updateVizPosition();
  if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
});

/* Ocultar canvas — solo se desvanece en los últimos 150px del hero */
gsap.to('#hero-canvas', {
  scrollTrigger: {
    trigger: '.hero',
    start: 'bottom top-=150px',
    end: 'bottom top',
    scrub: true,
  },
  opacity: 0,
  duration: 0.1,
});
