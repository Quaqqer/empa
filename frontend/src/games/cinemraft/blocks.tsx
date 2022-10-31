import Alea from "alea";
import _ from "lodash";
import { createNoise2D } from "simplex-noise";
import * as three from "three";

type vec3 = [number, number, number];

function vec3Key([x, y, z]: vec3): string {
  return `${x}:${y}:${z}`;
}

const vec3Regex = /^(-?\d+(?:\.\d+)?):(-?\d+(?:\.\d+)?):(-?\d+(?:\.\d+)?)$/;

function vec3FromKey(s: string): vec3 {
  const match = vec3Regex.exec(s);
  if (match === null) throw Error("Could not parse key from string: " + s);
  const [_, x, y, z] = match;
  return [x, y, z].map((v) => Number(v)) as vec3;
}

function vec3Add(lhs: vec3, rhs: vec3): vec3 {
  return lhs.map((v, i) => v + rhs[i]) as vec3;
}

export type vec2 = [number, number];

export function vec2Key([x, y]: vec2): string {
  return `${x}:${y}`;
}

const vec2Regex = /^(-?\d+(?:\.\d+)?):(-?\d+(?:\.\d+)?)$/;

export function vec2FromKey(s: string): vec2 {
  const match = vec2Regex.exec(s);
  if (match === null) throw Error("Could not parse key from string: " + s);
  const [_, x, y] = match;
  return [x, y].map((v) => Number(v)) as vec2;
}

export function vec2Add([x1, y1]: vec2, [x2, y2]: vec2): vec2 {
  return [x1 + x2, y1 + y2];
}

export class Chunk {
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

export async function blockTextures(): Promise<
  Record<BlockId, HTMLImageElement>
> {
  return Object.fromEntries(
    await Promise.all(
      Object.entries({
        [BlockId.Dirt]: "/cinemraft/dirt.png",
        [BlockId.Grass]: "/cinemraft/grass.png",
        [BlockId.Stone]: "/cinemraft/stone.png",
        [BlockId.Sand]: "/cinemraft/sand.png",
        [BlockId.Water]: "/cinemraft/water.png",
      }).map(([id, textureFile]) => {
        return new Promise<[BlockId, HTMLImageElement]>((resolve, reject) => {
          const image = new Image();
          image.src = textureFile;
          image.onload = () => void resolve([Number(id), image]);
          image.onerror = () =>
            reject(new Error(`Could not load asset: ${textureFile}.`));
        });
      })
    )
  ) as unknown as Promise<Record<BlockId, HTMLImageElement>>;
}

export class TextureAtlas {
  private canvas: HTMLCanvasElement;
  private textureCoords: Record<BlockId, [vec2, vec2]>;
  public texture?: three.Texture;
  public readonly width: number;
  public readonly height: number;

  constructor(private textures: Record<BlockId, HTMLImageElement>) {
    this.canvas = document.createElement("canvas");

    this.width = _.sum(Object.values(textures).map((img) => img.width));
    this.canvas.width = this.width;
    this.height = _.max(
      Object.values(textures).map((img) => img.height)
    ) as number;
    this.canvas.height = this.height;

    const ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;

    const textureCoords: Record<string, [vec2, vec2]> = {};

    let x = 0;
    for (const [id, img] of Object.entries(textures)) {
      ctx.drawImage(img, x, 0);

      const coords = [
        [x, 0],
        [img.width, img.height],
      ] as [vec2, vec2];

      textureCoords[id] = coords;

      x += img.width;
    }

    this.textureCoords = textureCoords as Record<BlockId, [vec2, vec2]>;
  }

  async init(): Promise<void> {
    this.texture = await this.getAtlas();
  }

  get(id: BlockId): [vec2, vec2] {
    return this.textureCoords[id];
  }

  getAtlas(): Promise<three.Texture> {
    const dataUrl = this.canvas.toDataURL();
    const loader = new three.TextureLoader();
    return new Promise((resolve, reject) =>
      loader.load(
        dataUrl,
        (texture) => {
          texture.magFilter = three.NearestFilter;
          texture.minFilter = three.NearestFilter;
          texture.wrapS = three.ClampToEdgeWrapping;
          texture.wrapT = three.ClampToEdgeWrapping;
          resolve(texture);
        },
        undefined,
        () => reject(new Error("Could not load texture atlas."))
      )
    );
  }
}

class Block {
  constructor(public id: BlockId) {}
}

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
        chunk.set([dx, y, dz], new Block(BlockId.Stone));

      if (height < oceanHeight + 2) {
        for (let y = height - 3; y < height; y++)
          chunk.set([dx, y, dz], new Block(BlockId.Sand));

        for (let y = height; y < oceanHeight; y++)
          chunk.set([dx, y, dz], new Block(BlockId.Water));
      } else {
        for (let y = height - 3; y < height - 1; y++)
          chunk.set([dx, y, dz], new Block(BlockId.Dirt));

        chunk.set([dx, height - 1, dz], new Block(BlockId.Grass));
      }
    }
  }

  return chunk;
}

export function stitchChunk(
  chunk: Chunk,
  [chunkX, chunkZ]: vec2,
  chunks: Map<string, Chunk>,
  atlas: TextureAtlas
): three.Group {
  const buf = new three.BufferGeometry();
  const verts: number[] = [];
  const textures: number[] = [];

  const transparentBuf = new three.BufferGeometry();
  const transparentVerts: number[] = [];
  const transparentTextures: number[] = [];

  function getBlock([x, y, z]: vec3): Block | undefined {
    const dx = Math.floor(x / chunkSize);
    const dz = Math.floor(z / chunkSize);
    const c =
      dx === 0 && dz === 0
        ? chunk
        : chunks.get(vec2Key([chunkX + dx, chunkZ + dz]));

    return c?.get([
      ((x % chunkSize) + chunkSize) % chunkSize,
      y,
      ((z % chunkSize) + chunkSize) % chunkSize,
    ]);
  }

  chunk.forEach((b, bp) => {
    for (const face of blockFaces) {
      const faceNeighbour = getBlock(vec3Add(bp, faceNormal(face)));

      if (
        faceNeighbour === undefined ||
        (b.id !== BlockId.Water && faceNeighbour.id === BlockId.Water)
      ) {
        const fv = faceVertices(face).map((v) => vec3Add(v, bp));

        for (const pos of fv) {
          (b.id === BlockId.Water ? transparentVerts : verts).push(...pos);
        }

        const [textureCoords, [w, h]] = atlas.get(b.id);
        const t = b.id === BlockId.Water ? transparentTextures : textures;
        t.push(
          // Hacky solution to artifacts in uv-mapping
          ...[
            vec2Add(textureCoords, [0, h]),
            vec2Add(textureCoords, [w, h]),
            vec2Add(textureCoords, [w, 0]),
            vec2Add(textureCoords, [0, h]),
            vec2Add(textureCoords, [w, 0]),
            vec2Add(textureCoords, [0, 0]),
          ].flatMap(([x, y]) => [x / atlas.width, y / atlas.height])
        );
      }
    }
  });

  buf.setAttribute(
    "position",
    new three.BufferAttribute(new Float32Array(verts), 3)
  );
  buf.setAttribute(
    "uv",
    new three.BufferAttribute(new Float32Array(textures), 2)
  );
  const mat = new three.MeshBasicMaterial({
    map: atlas.texture as three.Texture,
  });
  const mesh = new three.Mesh(buf, mat);

  transparentBuf.setAttribute(
    "position",
    new three.BufferAttribute(new Float32Array(transparentVerts), 3)
  );
  transparentBuf.setAttribute(
    "uv",
    new three.BufferAttribute(new Float32Array(transparentTextures), 2)
  );
  const transparentMat = new three.MeshBasicMaterial({
    map: atlas.texture as three.Texture,
    transparent: true,
    side: three.DoubleSide,
  });
  const transparentMesh = new three.Mesh(transparentBuf, transparentMat);

  const group = new three.Group();
  group.add(mesh);
  group.add(transparentMesh);

  return group;
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
        [0, 1, 0],
        [1, 1, 0],

        // Top left
        [0, 0, 0],
        [1, 1, 0],
        [1, 0, 0],
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
        [0, 0, 0],
        [1, 0, 0],

        // Top left
        [0, 0, 1],
        [1, 0, 0],
        [1, 0, 1],
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
        [0, 1, 1],
        [0, 1, 0],

        // Top left
        [0, 0, 1],
        [0, 1, 0],
        [0, 0, 0],
      ];
  }
}
