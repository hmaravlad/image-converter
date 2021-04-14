/* eslint indent: 0 */
import { Options } from "../models/options";
import Vector3D from "../models/vector3D";
import Light from "../models/light";
import Triangle from "../models/triangle";
import { IRender } from "../types/render";

const K_ELIPSON = 1e-8;

class RayTraceRender implements IRender {
  private readonly framebuffer: Vector3D[][] = [];

  constructor(private triangles: Triangle[], private lights: Light[], private options: Options) {
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
  };

  private rayTriangleIntersect(
    orig: Vector3D,
    dir: Vector3D,
    triangle: Triangle,
  ): {
    shad: boolean,
    t: number,
    u: number,
    v: number
  } {
    let t = 0;
    let u = 0;
    let v = 0;

    const v0v1 = triangle.v1.minus(triangle.v0);
    const v0v2 = triangle.v2.minus(triangle.v0);
    const pvec = dir.cross(v0v2);
    const det = v0v1.dot(pvec);
    if(det < K_ELIPSON && det > -K_ELIPSON) {
      return {
        shad: false,
        t,
        u,
        v
      };
    }
    const invDet = 1.0 / det;
    const tvec = orig.minus(triangle.v0);
    u = tvec.dot(pvec) * invDet;
    if(u < 0 || u > 1) {
      return {
        shad: false,
        t,
        u,
        v
      };
    }
    const qvec = tvec.cross(v0v1);
    v = dir.dot(qvec) * invDet;
    if(v < 0 || u + v > 1) {
      return {
        shad: false,
        t,
        u,
        v
      };
    }
    t = v0v2.dot(qvec) * invDet;
    return {
      shad: true,
      t,
      u,
      v
    };
  };

  private sceneIntersect(orig: Vector3D, dir: Vector3D, triangle: Triangle): { flag: boolean, hit: Vector3D, normal: Vector3D } {
    let hit = new Vector3D();
    let normal = new Vector3D();
    const { shad: flag, t: tnear, u, v } = this.rayTriangleIntersect(orig, dir, triangle);
    if(flag) {
      hit = orig.add(dir.multiply(tnear));
      const temp1 = triangle.n0.multiply(1 - u - v);
      const temp2 = temp1.add(triangle.n1.multiply(u));
      normal = temp2.add(triangle.n2.multiply(v));
    }
    return { flag, hit, normal };
  };

  private castRay(orig: Vector3D, dir: Vector3D, triangle: Triangle, lights: Light[], options: Options): { hit: Vector3D, vector: Vector3D } {
    const { flag, hit, normal: sceneIntersectNormal } = this.sceneIntersect(orig, dir, triangle);

    if(!flag) {
      return { hit, vector: options.backgroundColor };
    }

    const normal = dir.dot(sceneIntersectNormal) < 0 ? sceneIntersectNormal.multiply(-1) : sceneIntersectNormal;

    const shadowPointOrig = dir.dot(normal) < 0
      ? options.objectColor.add(normal.multiply(options.bias))
      : options.objectColor.minus(normal.multiply(options.bias))

    // @ts-ignore
    let diffuseLightIntensity = 0;
    // @ts-ignore
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
      let { shad } = this.rayTriangleIntersect(
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
  };

  private processForOnePixel(j: number, k: number): void
  {
    const x =
      (((2 * (k + 0.5)) / this.options.width - 1) *
        Math.tan(this.options.fov / 2) *
        this.options.width) /
      this.options.height;
    const z =
      -((2 * (j + 0.5)) / this.options.height - 1) * Math.tan(this.options.fov / 2);
    const dir = new Vector3D(x, -1, z);
    if(this.framebuffer[j][k].equal(this.options.backgroundColor)) {
      let min = Number.MAX_SAFE_INTEGER;
      let color: Vector3D = this.options.backgroundColor;
      for(let i = 0; i < this.triangles.length; i++) {
        // const dir = rayDirectionFinder(options, j, k)
        const { hit, vector } = this.castRay(
          this.options.cameraPos,
          dir,
          this.triangles[i],
          this.lights,
          this.options
        );
        const currentDistance = hit.distance(this.options.cameraPos);
        if(min > currentDistance && !vector.equal(this.options.backgroundColor)) {
          min = currentDistance;
          color = vector;
        }
      }
      this.framebuffer[j][k] = color;
    }
  }

  render(): Vector3D[][] {
    for(let j = 0; j < this.options.height; j++) {
      for(let k = 0; k < this.options.width; k++) {
        this.processForOnePixel(j, k);
      }
    }
    return this.framebuffer;
  };
}

export default RayTraceRender;
