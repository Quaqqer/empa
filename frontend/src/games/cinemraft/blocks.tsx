import Alea from "alea";
import { createNoise2D } from "simplex-noise";
import * as three from "three";

type Position = { x: number; y: number; z: number };

const chunkSize = 16;
const oceanHeight = 40;

enum BlockId {
  Dirt,
  Grass,
  Stone,
  Sand,
  Water,
}

export type Block = {
  id: BlockId;
};

export type Chunk = Map<Position, Block>;

export function generateChunk(
  seed: number,
  chunkX: number,
  chunkZ: number
): Chunk {
  const prng = Alea(seed);
  const noise2D = createNoise2D(prng);

  const chunk: Chunk = new Map();

  for (let dx = 0; dx < chunkSize; dx++) {
    for (let dz = 0; dz < chunkSize; dz++) {
      const x = dx + chunkX * chunkSize;
      const z = dz + chunkZ * chunkSize;

      const height = oceanHeight + 10 * noise2D(x / 1000, z / 1000);

      for (let y = 0; y < height - 3; y++) {
        chunk.set({ x: dx, y, z: dz }, { id: BlockId.Stone });
      }

      if (height < oceanHeight) {
        for (let y = Math.max(height - 3, 0); y < height; y++) {
          chunk.set({ x: dx, y, z: dz }, { id: BlockId.Sand });
        }

        for (let y = height; y < oceanHeight; y++) {
          chunk.set({ x: dx, y, z: dz }, { id: BlockId.Water });
        }
      } else {
        for (let y = Math.max(height - 3, 0); y < height - 1; y++) {
          chunk.set({ x: dx, y, z: dz }, { id: BlockId.Dirt });
        }

        chunk.set({ x: dx, y: height - 1, z: dz }, { id: BlockId.Grass });
      }
    }
  }

  return chunk;
}

export function blockTo3D(block: Block): three.Object3D {
  const colors: Record<BlockId, number> = {
    [BlockId.Dirt]: 0x964b00,
    [BlockId.Grass]: 0x00ff00,
    [BlockId.Stone]: 0x888888,
    [BlockId.Sand]: 0xffff00,
    [BlockId.Water]: 0x0000ff,
  };

  const geom = new three.BoxGeometry(1, 1, 1);
  const mat = new three.MeshBasicMaterial({ color: colors[block.id] });
  const cube = new three.Mesh(geom, mat);

  return cube;
}

export function chunkTo3D(
  chunk: Chunk,
  chunkX: number,
  chunkZ: number
): three.Group {
  const group = new three.Group();

  chunk.forEach((block, pos) => {
    const block3D = blockTo3D(block);
    block3D.position.set(pos.x, pos.y, pos.z);
    group.add(block3D);
  });

  group.position.x = chunkX * chunkSize;
  group.position.z = chunkZ * chunkSize;

  return group;
}

export function stitchChunk(
  chunk: Chunk,
  chunkX: number,
  chunkZ: number,
  chunks: Map<{ x: number; z: number }, Chunk>
): Group {
  function getBlock(dx: number, dy: number, dz: number): Block | null {
    return null;
  }

  const colors: Record<BlockId, number> = {
    [BlockId.Dirt]: 0x964b00,
    [BlockId.Grass]: 0x00ff00,
    [BlockId.Stone]: 0x888888,
    [BlockId.Sand]: 0xffff00,
    [BlockId.Water]: 0x0000ff,
  };

  const group = new three.Group();

  chunk.forEach((block, position) => {
    for (let face = 0; face < 6; face++) {
      const geom = new three.BufferGeometry();
      // prettier-ignore
      const vertices = new Float32Array([]);
      geom.setAttribute("position", new three.BufferAttribute(vertices, 3));
      const mat = new three.MeshBasicMaterial({ color: colors[block.id] });
      const mesh = new three.Mesh(geom, mat);

      group.add(mesh);
    }
  });

  return group;
}
