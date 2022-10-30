import Alea from "alea";
import { createNoise2D } from "simplex-noise";
import * as three from "three";

type vec3 = [number, number, number];

function vec3Key([x, y, z]: vec3): string {
  return `${x}:${y}:${z}`;
}

function vec3FromKey(s: string): vec3 {
  const match = /^-?(\d+(?:\.\d+)?):-?(\d+(?:\.\d+)?):-?(\d+(?:\.\d+)?)$/.exec(
    s
  );
  if (match === null) throw Error("Could not create key from string: " + s);
  const [_, x, y, z] = match;
  return [x, y, z].map((v) => Number(v)) as vec3;
}

function vec3Add(lhs: vec3, rhs: vec3): vec3 {
  return lhs.map((v, i) => v + rhs[i]) as vec3;
}

class Chunk {
  private map: Map<string, Block>;

  constructor() {
    this.map = new Map();
  }

  set(pos: vec3, b: Block): void {
    this.map.set(vec3Key(pos), b);
  }

  get(pos: vec3): Block | undefined {
    return this.map.get(vec3Key(pos));
  }

  has(pos: vec3): boolean {
    return this.map.has(vec3Key(pos));
  }

  forEach(cb: (b: Block, p: vec3) => void): void {
    this.map.forEach((b, ps) => cb(b, vec3FromKey(ps)));
  }
}

const oceanHeight = 40;

export const chunkSize = 16;

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

export function generateChunk(
  seed: number,
  chunkX: number,
  chunkZ: number
): Chunk {
  const prng = Alea(seed);
  const noise2D = createNoise2D(prng);

  const chunk = new Chunk();

  for (let dx = 0; dx < chunkSize; dx++) {
    for (let dz = 0; dz < chunkSize; dz++) {
      const x = dx + chunkX * chunkSize;
      const z = dz + chunkZ * chunkSize;

      const height = Math.round(oceanHeight + 10 * noise2D(x / 100, z / 100));

      for (let y = 0; y < height - 3; y++)
        chunk.set([dx, y, dz], { id: BlockId.Stone });

      if (height < oceanHeight + 2) {
        for (let y = height - 3; y < height; y++)
          chunk.set([dx, y, dz], { id: BlockId.Sand });

        for (let y = height; y < oceanHeight; y++)
          chunk.set([dx, y, dz], { id: BlockId.Water });
      } else {
        for (let y = height - 3; y < height - 1; y++)
          chunk.set([dx, y, dz], { id: BlockId.Dirt });

        chunk.set([dx, height - 1, dz], { id: BlockId.Grass });
      }
    }
  }

  return chunk;
}

const colors: Record<BlockId, number> = {
  [BlockId.Dirt]: 0x964b00,
  [BlockId.Grass]: 0x00ff00,
  [BlockId.Stone]: 0x888888,
  [BlockId.Sand]: 0xffff00,
  [BlockId.Water]: 0x0000ff,
};

const floatColors = Object.fromEntries(
  Object.entries(colors).map(([k, v]) => {
    const r = (v >> 16) / 0xff;
    const g = (v >> 8 & 0xff) / 0xff;
    const b = (v & 0xff) / 0xff;

    return [k, [r, g, b]];
  })
);

export function stitchChunk(chunk: Chunk): three.Mesh {
  const buf = new three.BufferGeometry();

  const verts: number[] = [];
  const cols: number[] = [];

  chunk.forEach((b, bp) => {
    for (const face of blockFaces) {
      const faceNeighbour = vec3Add(bp, faceNormal(face));

      if (!chunk.has(faceNeighbour)) {
        const fv = faceVertices(face).map((v) => vec3Add(v, bp));

        for (const pos of fv) {
          verts.push(...pos);
        }

        for (let i = 0; i < 6; i++) {
          cols.push(...floatColors[b.id]);
        }
      }
    }
  });

  buf.setAttribute(
    "position",
    new three.BufferAttribute(new Float32Array(verts), 3)
  );
  buf.setAttribute(
    "color",
    new three.BufferAttribute(new Float32Array(cols), 3)
  );

  const mat = new three.MeshBasicMaterial({vertexColors: true})
  const mesh = new three.Mesh(buf, mat);

  return mesh;
}

enum BlockFace {
  Front, // Z+
  Back, // Z-
  Up, // Y+
  Down, // Y-
  Right, // X+
  Left, // X-
}

const blockFaces: BlockFace[] = [
  BlockFace.Front,
  BlockFace.Back,
  BlockFace.Up,
  BlockFace.Down,
  BlockFace.Right,
  BlockFace.Left,
];

function faceNormal(face: BlockFace): vec3 {
  switch (face) {
    case BlockFace.Front:
      return [0, 0, 1];
    case BlockFace.Back:
      return [0, 0, -1];
    case BlockFace.Up:
      return [0, 1, 0];
    case BlockFace.Down:
      return [0, -1, 0];
    case BlockFace.Right:
      return [1, 0, 0];
    case BlockFace.Left:
      return [-1, 0, 0];
  }
}

function faceVertices(face: BlockFace): vec3[] {
  switch (face) {
    case BlockFace.Front:
      return [
        // Bottom right
        [0, 0, 1],
        [1, 0, 1],
        [1, 1, 1],

        // Top left
        [0, 0, 1],
        [1, 1, 1],
        [0, 1, 1],
      ];
    case BlockFace.Back:
      return [
        // Bottom left
        [0, 0, 0],
        [1, 1, 0],
        [1, 0, 0],

        // Top left
        [0, 0, 0],
        [0, 1, 0],
        [1, 1, 0],
      ];

    case BlockFace.Up:
      return [
        // Bottom right
        [0, 1, 1],
        [1, 1, 1],
        [1, 1, 0],

        // Top left
        [0, 1, 1],
        [1, 1, 0],
        [0, 1, 0],
      ];
    case BlockFace.Down:
      return [
        // Bottom right
        [0, 0, 1],
        [1, 0, 0],
        [1, 0, 1],

        // Top left
        [0, 0, 1],
        [0, 0, 0],
        [1, 0, 0],
      ];

    case BlockFace.Right:
      return [
        // Bottom right
        [1, 0, 1],
        [1, 0, 0],
        [1, 1, 0],

        // Top left
        [1, 0, 1],
        [1, 1, 0],
        [1, 1, 1],
      ];
    case BlockFace.Left:
      return [
        // Bottom right
        [0, 0, 1],
        [0, 1, 0],
        [0, 0, 0],

        // Top left
        [0, 0, 1],
        [0, 1, 1],
        [0, 1, 0],
      ];
  }
}
