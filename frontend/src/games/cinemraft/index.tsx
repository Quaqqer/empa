import _ from "lodash";
import { useEffect, useRef } from "react";
import * as three from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import {
  Chunk,
  chunkSize,
  generateChunk,
  stitchChunk,
  vec2FromKey,
  vec2Key,
} from "./blocks";

export default function CineMraft(): JSX.Element {
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const div = divRef.current;

    // If we get the div, we add the 3d scene
    if (div != null) {
      // Create scene, camera, renderer and orbit controls
      const scene = new three.Scene();
      scene.fog = new three.Fog(0xffffff, 0, 500);
      const camera = new three.PerspectiveCamera(75, 1, 0.1, 1000);
      camera.position.set(-20, 50, -20);
      const renderer = new three.WebGLRenderer();
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.target.set(8, 40, 8);

      // Add the domElement of the renderer to the div
      div.appendChild(renderer.domElement);
      // Set the size of the renderer element
      renderer.setSize(800, 800);

      // Create chunks
      const chunks: Map<string, Chunk> = new Map();
      for (let x = -3; x < 3; x++) {
        for (let z = -3; z < 3; z++) {
          const chunk = generateChunk(1, x, z);
          chunks.set(vec2Key([x, z]), chunk);
        }
      }

      // Stitch chunks
      const chunk3Ds: three.Group[] = [];
      for (const [pos, chunk] of chunks.entries()) {
        const [cx, cz] = vec2FromKey(pos);
        const chunk3D = stitchChunk(chunk, [cx, cz], chunks);
        chunk3D.position.set(cx * chunkSize, 0, cz * chunkSize)
        chunk3Ds.push(chunk3D);
      }

      // Add chunks to scene
      for (const chunk3D of chunk3Ds)
      scene.add(chunk3D);

      scene.add(
        new three.ArrowHelper(
          new three.Vector3(1, 0, 0),
          new three.Vector3(0, 0, 0),
          5,
          0xff0000
        )
      );
      scene.add(
        new three.ArrowHelper(
          new three.Vector3(0, 1, 0),
          new three.Vector3(0, 0, 0),
          5,
          0x00ff00
        )
      );
      scene.add(
        new three.ArrowHelper(
          new three.Vector3(0, 0, 1),
          new three.Vector3(0, 0, 0),
          5,
          0x0000ff
        )
      );

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
