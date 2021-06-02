/* eslint indent: 0 */
import { Options } from "../../models/options";
import Vector3D from "../../models/vector3D";
import PointLight, { isPointLight } from "../../lights/pointTight";
import Triangle from "../../models/triangle";
import { IRenderer } from "../../types/renderer";
import { IntersectResult } from "../../types/hitResult";
import { ITreeFactory } from "../../types/iTreeFactory";
import { ITree } from "../../types/iTree";
import { IRendererFactory } from "../../types/iRendererFactory";
import { inject, injectable } from "inversify";
import { TYPES } from "../../types";
import { IIntersectable } from "../../types/iIntersectable";
import { IBoxable, isBoxable } from "../../types/iBoxable";
import { TraverseResult } from "../../types/traverseResult";
import { ILight } from "../../types/iLight";
import { DirectionalLight, isDirectionalLight } from "../../lights/directionalLight";

//***********************************************************/


const MAX_STEPS = 3;
const LIGHT_INTENSITY = 2.6;
const BACKGROUND_LIGHT_INTENSITY = 0.4


//***********************************************************/

const progressFn = (width: number, height: number) => {
  const s = Math.round(width * height / 100);
  return (i: number, j: number) => {
    if ((j * width + i) % s === 0)  {
      console.log(`progress: ${Math.round((j * width + i) / s)}%`)
    }
  }
}

export class RayTraceRenderer implements IRenderer {
  private readonly framebuffer: Vector3D[][] = [];
  private treeFactory: ITreeFactory;
  private tree: ITree | undefined;
  private nonTreeShapes: IIntersectable[] = [];

  constructor(private lights: ILight[], private options: Options, treeFactory: ITreeFactory) {
    this.treeFactory = treeFactory;
    this.framebuffer = this.createFramebuffer(this.options)
  }

  private createFramebuffer(options: Options): Vector3D[][] {
    const arr: Vector3D[][] = [];
    for (let i = 0; i < options.height; i++) {
      arr[i] = [];
      for (let j = 0; j < options.width; j++) {
        arr[i][j] = options.backgroundColor;
      }
    }
    return arr;
  }

  private getColor(SceneIntersectResult: IntersectResult, dir: Vector3D, shape: IIntersectable, step: number): Vector3D {

    const { hit, normal: sceneIntersectNormal } = SceneIntersectResult;
    const { options, lights } = this;

    const normal = dir.dot(sceneIntersectNormal) < 0 ? sceneIntersectNormal.multiply(-1) : sceneIntersectNormal;

    //const shadowPointOrig = dir.dot(normal) < 0 
    //  ? options.objectColor.add(normal.multiply(options.bias))
    // : options.objectColor.minus(normal.multiply(options.bias))


    const material = shape.material;
    const rays = material.getRays(dir, normal, this.lights);

    return material.getColor(rays.map(({ weight, dir, light }) => {
      if (light) {
        let diffuseLightIntensity = 0;
        let lightDir = isPointLight(light) ? light.position.minus(hit) : (light as DirectionalLight).dir.multiply(-1);
        const distanceToHit = lightDir.length();
        lightDir = lightDir.normalize();
        let shadowed = false;
        const origFixed = hit.add(lightDir.multiply(0.01));
        const hitR = this.getClosestIntersection(origFixed, lightDir);
        if (!hitR) {
          shadowed = false
        } else {
          if (isDirectionalLight(light)) {
            shadowed = true
          } else {
            const shadDistance = hitR.hit.hit.distance((light as PointLight).position)
            if (shadDistance < (distanceToHit)) {
              shadowed = true
            }
          }
        }
        if (!shadowed) {
          diffuseLightIntensity += LIGHT_INTENSITY * Math.max(0, Math.abs(normal.dot(lightDir)));
        }
        return { color: light.color.multiply(diffuseLightIntensity), l: diffuseLightIntensity, weight }
      } else if (dir) {
        const origFixed = hit.add(dir.multiply(0.01));
        const color = this.castRay(origFixed, dir, step + 1)
        return { color, l: color === options.backgroundColor ? BACKGROUND_LIGHT_INTENSITY : 0, weight }
      } else throw new Error()
    }) as { color: Vector3D, weight: number, l: number }[]);
  }

  private castRay(orig: Vector3D, dir: Vector3D, step: number): Vector3D {
    if (step > MAX_STEPS) return this.options.backgroundColor
    const traverseResult = this.getClosestIntersection(orig, dir);
    if (traverseResult) {
      return this.getColor(
        traverseResult.hit,
        dir,
        traverseResult.shape,
        step
      );
    } else {
      return this.options.backgroundColor;
    }
  }

  private processForOnePixel(j: number, k: number): void {
    if (!this.tree) throw new Error();
    const { orig, dir } = this.options.camera.getDir(j, k)
    if (this.framebuffer[j][k].equal(this.options.backgroundColor)) {
      this.framebuffer[j][k] = this.castRay(orig, dir, 0);
    }
  }

  private getClosestIntersection(orig: Vector3D, dir: Vector3D): TraverseResult | undefined {
    let min = Number.MAX_VALUE;
    let res;
    let shapeRes;

    const traverseResult = this.tree?.traverse(orig, dir);
    if (traverseResult) {
      min = orig.distance(traverseResult.hit.hit)
      res = traverseResult.hit
      shapeRes = traverseResult.shape
    }

    for (const shape of this.nonTreeShapes) {
      const intersectRes = shape.intersectWithRay(orig, dir);
      if (!intersectRes) continue;
      const currentDistance = intersectRes.hit.distance(orig);
      if (min > currentDistance) {
        min = currentDistance;
        res = intersectRes;
        shapeRes = shape;
      }
    }
    return !res || !shapeRes ? undefined : { hit: res, shape: shapeRes };
  }

  render(shapes: IIntersectable[]): Vector3D[][] {
    const progress = progressFn(this.options.width, this.options.height);
    this.nonTreeShapes = shapes.filter(shape => !isBoxable(shape))
    this.tree = this.treeFactory.getTree(shapes.filter(shape => isBoxable(shape)) as (IBoxable & IIntersectable)[]);
    for (let j = 0; j < this.options.height; j++) {
      for (let k = 0; k < this.options.width; k++) {
        progress(k, j);
        this.processForOnePixel(j, k);
      }
    }
    return this.framebuffer;
  }
}

@injectable()
export class RayTraceRendererFactory implements IRendererFactory {
  constructor(@inject(TYPES.ITreeFactory) private treeFactory: ITreeFactory) { }
  getRenderer(lights: ILight[], options: Options): IRenderer {
    return new RayTraceRenderer(lights, options, this.treeFactory);
  }
}
