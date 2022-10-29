import { useEffect, useRef } from "react";
import * as three from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import { chunkTo3D, generateChunk, stitchChunk } from "./blocks";

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
      camera.position.set(48, 40, 8);
      const renderer = new three.WebGLRenderer();
      const controls = new OrbitControls(camera, renderer.domElement);
      /* controls.target.set(8, 40, 8); */

      // Add the domElement of the renderer to the div
      div.appendChild(renderer.domElement);
      // Set the size of the renderer element
      renderer.setSize(800, 800);

      // Create a chunk
      for (let x = 0; x < 1; x++) {
        for (let z = 0; z < 1; z++) {
          const chunk = generateChunk(1, x, z);
          const stitchedChunk = stitchChunk(chunk);
          /* const chunk3D = chunkTo3D(chunk, x, z); */
          scene.add(stitchedChunk);
        }
      }

      scene.add(new three.ArrowHelper(new three.Vector3(1, 0, 0), new three.Vector3(0, 0, 0), 1, 0xff0000));
      scene.add(new three.ArrowHelper(new three.Vector3(0, 1, 0), new three.Vector3(0, 0, 0), 1, 0x00ff00));
      scene.add(new three.ArrowHelper(new three.Vector3(0, 0, 1), new three.Vector3(0, 0, 0), 1, 0x0000ff));

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
