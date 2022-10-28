import { useEffect, useRef } from "react";
import * as three from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import { chunkTo3D, generateChunk } from "./blocks";

export default function CineMraft(): JSX.Element {
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const div = divRef.current;

    // If we get the div, we add the 3d scene
    if (div != null) {
      // Create scene, camera, renderer and orbit controls
      const scene = new three.Scene();
      const camera = new three.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      camera.position.set(100, 60, 5);
      const renderer = new three.WebGLRenderer();
      const controls = new OrbitControls(camera, renderer.domElement);

      // Add the domElement of the renderer to the div
      div.appendChild(renderer.domElement);
      // Set the size of the renderer element
      renderer.setSize(800, 800);

      // Create a chunk
      for (let x = 0; x < 3; x++) {
        for (let z = 0; z < 3; z++) {
          const chunk = generateChunk(0, x, z);
          const chunk3D = chunkTo3D(chunk, x, z);
          scene.add(chunk3D);
        }
      }

      // Begin animating
      let animating = true;

      // Animation loop, use recursion with requestAnimationFrame
      (async () => {
        function animate(): void {
          if (animating) {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
          }
        }
        animate();
      })();

      return () => {
        animating = false;
        div.removeChild(renderer.domElement);
      };
    }
  });

  return <div ref={divRef}></div>;
}

function createCube(): three.Mesh<three.BoxGeometry, three.MeshBasicMaterial> {
  const geom = new three.BoxGeometry(1, 1, 1);
  const mat = new three.MeshBasicMaterial({ color: 0x00ff00 });
  const cube = new three.Mesh(geom, mat);
  return cube;
}
