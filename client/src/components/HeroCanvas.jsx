import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const HeroCanvas = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, mount.clientWidth / mount.clientHeight, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0x6366f1, 0.4);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x6366f1, 2, 20);
    pointLight1.position.set(3, 3, 3);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x22d3ee, 2, 20);
    pointLight2.position.set(-3, -2, 2);
    scene.add(pointLight2);

    const pointLight3 = new THREE.PointLight(0x8b5cf6, 1.5, 15);
    pointLight3.position.set(0, -4, -2);
    scene.add(pointLight3);

    // Main icosphere (torus)
    const torusGeo = new THREE.TorusGeometry(1.5, 0.5, 20, 60);
    const torusMat = new THREE.MeshStandardMaterial({
      color: 0x6366f1,
      roughness: 0.3,
      metalness: 0.7,
      transparent: true,
      opacity: 0.85,
    });
    const torus = new THREE.Mesh(torusGeo, torusMat);
    torus.position.set(2.5, 0, 0);
    scene.add(torus);

    // Wireframe overlay
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x818cf8,
      wireframe: true,
      transparent: true,
      opacity: 0.15,
    });
    const wireframe = new THREE.Mesh(torusGeo, wireMat);
    torus.add(wireframe);

    // Particle system
    const particleCount = 200;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 16;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8 - 2;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x818cf8,
      size: 0.04,
      transparent: true,
      opacity: 0.6,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Velocity for particles
    const velocities = Array.from({ length: particleCount }, () => ({
      x: (Math.random() - 0.5) * 0.003,
      y: (Math.random() - 0.5) * 0.003,
      z: (Math.random() - 0.5) * 0.001,
    }));

    // Mouse tracking
    const mouse = { x: 0, y: 0 };
    const targetRot = { x: 0, y: 0 };
    const handleMouse = (e) => {
      mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', handleMouse);

    // Resize
    const handleResize = () => {
      if (!mount) return;
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Animation
    let animId;
    const clock = new THREE.Clock();
    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Torus rotation
      torus.rotation.x += 0.005;
      torus.rotation.y += 0.003;

      // Lerp toward mouse
      targetRot.x += (mouse.y * 0.3 - targetRot.x) * 0.05;
      targetRot.y += (mouse.x * 0.3 - targetRot.y) * 0.05;
      torus.rotation.x += targetRot.x * 0.01;
      torus.rotation.y += targetRot.y * 0.01;

      // Torus float
      torus.position.y = Math.sin(t * 0.5) * 0.3;

      // Animate particles
      const posAttr = particleGeo.attributes.position;
      for (let i = 0; i < particleCount; i++) {
        posAttr.array[i * 3 + 0] += velocities[i].x;
        posAttr.array[i * 3 + 1] += velocities[i].y;
        posAttr.array[i * 3 + 2] += velocities[i].z;

        // Wrap around bounds
        if (Math.abs(posAttr.array[i * 3 + 0]) > 8) velocities[i].x *= -1;
        if (Math.abs(posAttr.array[i * 3 + 1]) > 5) velocities[i].y *= -1;
        if (Math.abs(posAttr.array[i * 3 + 2] + 2) > 4) velocities[i].z *= -1;
      }
      posAttr.needsUpdate = true;

      // Animate lights
      pointLight1.position.x = Math.sin(t * 0.4) * 4;
      pointLight1.position.y = Math.cos(t * 0.3) * 3;
      pointLight2.position.x = Math.cos(t * 0.5) * 4;
      pointLight2.position.y = Math.sin(t * 0.4) * 3;

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouse);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (mount && renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
};

export default HeroCanvas;
