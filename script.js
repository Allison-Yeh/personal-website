fetch('https://cdn.jsdelivr.net/npm/three@latest/build/three.module.js')
    .then(response => console.log(response))
    .catch(error => console.error("Failed to load Three.js:", error));


import * as THREE from 'https://cdn.jsdelivr.net/npm/three@latest/build/three.module.js';

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Dynamic skybox gradient
const createSkybox = () => {
    const skyGeometry = new THREE.SphereGeometry(50, 32, 32);
    const skyMaterial = new THREE.ShaderMaterial({
        uniforms: { time: { value: 0.0 } },
        vertexShader: `
            varying vec3 vUv;
            void main() {
                vUv = position;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform float time;
            varying vec3 vUv;
            void main() {
                float mixVal = sin(time * 0.1) * 0.5 + 0.5;
                vec3 color1 = vec3(1.0, 0.4, 0.8); // Vibrant Pink
                vec3 color2 = vec3(0.2, 0.7, 1.2); // Bright Blue (more vibrant)
                vec3 color3 = vec3(1.0, 0.6, 0.2); // Warm Orange
                vec3 finalColor = mix(mix(color1, color2, mixVal), color3, mixVal * 0.3);
                gl_FragColor = vec4(finalColor, 1.0);
            }
        `,
        side: THREE.BackSide
    });
    const skybox = new THREE.Mesh(skyGeometry, skyMaterial);
    scene.add(skybox);
    return skybox;
};
const skybox = createSkybox();

// Floating elements around the text
const floatingObjects = new THREE.Group();

// Glowing stars
for (let i = 0; i < 80; i++) {
    let starGeometry = new THREE.SphereGeometry(0.08, 8, 8);
    let starMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    let star = new THREE.Mesh(starGeometry, starMaterial);

    // Place stars in a circular pattern around the text
    let angle = Math.random() * Math.PI * 2;
    let radius = Math.random() * 6 + 2;
    star.position.set(Math.cos(angle) * radius, (Math.random() - 0.5) * 3, Math.sin(angle) * radius);
    floatingObjects.add(star);
}

// // Floating islands
// for (let i = 0; i < 5; i++) {
//     let islandGeometry = new THREE.IcosahedronGeometry(1, 1);
//     let islandMaterial = new THREE.MeshStandardMaterial({ color: 0x8B5A2B, roughness: 0.8 });
//     let island = new THREE.Mesh(islandGeometry, islandMaterial);

//     let angle = Math.random() * Math.PI * 2;
//     let radius = Math.random() * 5 + 2.5;
//     island.position.set(Math.cos(angle) * radius, Math.random() * 2 - 1, Math.sin(angle) * radius);
//     floatingObjects.add(island);
// }

scene.add(floatingObjects);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
scene.add(ambientLight);

const light = new THREE.PointLight(0xffffff, 2, 100);
light.position.set(5, 5, 5);
scene.add(light);

camera.position.z = 6;

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Skybox shifting
    skybox.material.uniforms.time.value += 0.03;

    // Floating objects movement
    floatingObjects.children.forEach((obj, i) => {
        obj.rotation.y += 0.01;
        obj.position.y += Math.sin(Date.now() * 0.002 + i) * 0.002;
    });

    renderer.render(scene, camera);
}
animate();

// Handle window resize
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});