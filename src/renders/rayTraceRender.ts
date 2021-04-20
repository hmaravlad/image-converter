/* eslint indent: 0 */
import { Options } from "../models/options";
import Vector3D from "../models/vector3D";
import Light from "../models/light";
import Triangle from "../models/triangle";
import { IRender } from "../types/render";
import { rayTriangleIntersect } from "../geometry/intersect";
import { SceneIntersectResult } from "../types/hitResult";
import { ITreeFactory } from "../types/iTreeFactory";
import { ITree } from "../types/iTree";
import { IRendererFactory } from "../types/iRendererFactory";
import { inject, injectable } from "inversify";
import { TYPES } from "../types";

export class RayTraceRender implements IRender {
  private readonly framebuffer: Vector3D[][] = [];
  private treeFactory: ITreeFactory;
  private tree: ITree | undefined;

  constructor(private lights: Light[], private options: Options, treeFactory: ITreeFactory) {
    this.treeFactory = treeFactory;
    this.framebuffer = this.createFramebuffer(this.options)
  }

  private createFramebuffer(options: Options): Vector3D[][] {
    const arr: Vector3D[][] = [];
    for(let i = 0; i < options.height; i++) {
      arr[i] = [];
      for(let j = 0; j < options.width; j++) {
        arr[i][j] = options.backgroundColor;
      }
    }
    return arr;
  }

  private castRay(SceneIntersectResult: SceneIntersectResult, dir: Vector3D, triangle: Triangle, lights: Light[], options: Options): { hit: Vector3D, vector: Vector3D } {
    const { flag, hit, normal: sceneIntersectNormal } = SceneIntersectResult;

    if(!flag) {
      return { hit, vector: options.backgroundColor };
    }

    const normal = dir.dot(sceneIntersectNormal) < 0 ? sceneIntersectNormal.multiply(-1) : sceneIntersectNormal;

    const shadowPointOrig = dir.dot(normal) < 0
      ? options.objectColor.add(normal.multiply(options.bias))
      : options.objectColor.minus(normal.multiply(options.bias))

    let diffuseLightIntensity = 0;
    let diffuseLightIntensity2 = 0;

    for(let i = 0; i < lights.length; i++) {
      const lightDir = lights[i].position.minus(hit);
      const r2 = lightDir.dot(lightDir);
      // lightDir.normalize();
      const distance = Math.sqrt(r2);
      lightDir.x /= distance;
      lightDir.y /= distance;
      lightDir.z /= distance;
      // const lDotN = Math.max(0,lightDir.dot(n));
      let { shad } = rayTriangleIntersect(
        shadowPointOrig,
        lightDir,
        triangle
      );
      shad = !shad;
      diffuseLightIntensity +=
        lights[i].intensity * Math.max(0, normal.dot(lightDir));
      diffuseLightIntensity2 +=
        lights[i].intensity *
        Math.max(0, normal.dot(lightDir.multiply(-1)));
    }
    return { hit, vector: options.objectColor.multiply(Math.max(diffuseLightIntensity, diffuseLightIntensity2)) };
  }

  private processForOnePixel(j: number, k: number): void
  {
    if (!this.tree) throw new Error();
    const x =
      (((2 * (k + 0.5)) / this.options.width - 1) *
        Math.tan(this.options.fov / 2) *
        this.options.width) /
      this.options.height;
    const z =
      -((2 * (j + 0.5)) / this.options.height - 1) * Math.tan(this.options.fov / 2);
    const dir = new Vector3D(x, -1, z);
    if(this.framebuffer[j][k].equal(this.options.backgroundColor)) {
      let color: Vector3D = this.options.backgroundColor;
      const traverseResult = this.tree.traverse(this.options.cameraPos, dir);
      if (traverseResult) {
        const { vector } = this.castRay(
          traverseResult.hit,
          dir,
          traverseResult.triangle,
          this.lights,
          this.options
        );
        color = vector;
      } else {
        color = this.options.backgroundColor;
      }
      this.framebuffer[j][k] = color;
    }
  }

  render(triangles: Triangle[]): Vector3D[][] {
    this.tree = this.treeFactory.getTree(triangles);
    for(let j = 0; j < this.options.height; j++) {
      for(let k = 0; k < this.options.width; k++) {
        this.processForOnePixel(j, k);
      }
    }
    return this.framebuffer;
  }
}

@injectable()
export class RayTraceRenderFactory implements IRendererFactory {
  constructor(@inject(TYPES.ITreeFactory) private treeFactory: ITreeFactory) {}
  getRenderer(lights: Light[], options: Options): IRender {
    return new RayTraceRender(lights, options, this.treeFactory);
  }
}
