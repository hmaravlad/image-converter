import { IIntersectable } from "../types/iIntersectable";
import { ITransformable } from "../types/iTransformable";
import { intersectBoxWithRay } from "../geometry/intersect";
import { IntersectResult } from "../types/hitResult";
import { Transformation } from "./transformation";
import Vector3D from "./vector3D";
import { IMaterial } from "src/types/iMaterial";
import { Box } from "./box";
import Triangle from "./triangle";
import { LambertMaterial } from "../materials/lambertMaterial";

const EPSILON = 0.0001

const equal = (a: number, b: number): boolean => {
  return Math.abs(a - b) < EPSILON
}

export class Cube implements IIntersectable, ITransformable {
  constructor(private _min: Vector3D, private _max: Vector3D, readonly material: IMaterial) {
  }

  get min(): Vector3D {
    return this._min;
  }

  set min(min: Vector3D) {
    this._min = min;
  }

  get max(): Vector3D {
    return this._max;
  }

  set max(max: Vector3D) {
    this._max = max;
  }

  private box = new Box(this.min, this.max)

  private findNormal(point: Vector3D): Vector3D {
    if (equal(point.x, this.min.x)) {
      return new Vector3D(-1, 0, 0);
    }
    if (equal(point.y, this.min.y)) {
      return new Vector3D(0, -1, 0);
    }
    if (equal(point.z, this.min.z)) {
      return new Vector3D(0, 0, -1);
    }
    if (equal(point.x, this.max.x)) {
      return new Vector3D(1, 0, 0);
    }
    if (equal(point.y, this.max.y)) {
      return new Vector3D(0, 1, 0);
    }
    if (equal(point.z, this.max.z)) {
      return new Vector3D(0, 0, 1);
    }
    return new Vector3D(1, 0, 0);
  }

  intersectWithRay(orig: Vector3D, dir: Vector3D): IntersectResult | undefined {
    const normalized = dir.normalize();
    const { intersected, tmin } = intersectBoxWithRay(orig, normalized, this.box);
    if (!intersected) return undefined
    const hit = orig.add(dir.multiply(tmin));
    //console.dir({ min: this.min, max: this.max, hit })
    return { hit, normal: this.findNormal(hit) }
  }

  intersectWithRayBool(orig: Vector3D, dir: Vector3D): boolean {
    const normalized = dir.normalize();
    const { intersected } = intersectBoxWithRay(orig, normalized, this.box);
    return intersected
  }

  transform(transformation: Transformation): void {
    //console.dir({ min: this.min, max: this.max })
    this.min = transformation.applyToVector(this.min);
    this.max = transformation.applyToVector(this.max);
    this.box = new Box(this.min, this.max)
    //console.dir({ min: this.min, max: this.max })
  }

  isDotInBox(dot: Vector3D): boolean {
    return (this.min.x <= dot.x && dot.x <= this.max.x) &&
      (this.min.y <= dot.y && dot.y <= this.max.y) &&
      (this.min.z <= dot.z && dot.z <= this.max.z);
  }

  toTriangles(): Triangle[] {
    const xMinYMinZMin = new Vector3D(this.min.x, this.min.y, this.min.z);
    const xMaxYMaxZMax = new Vector3D(this.max.x, this.max.y, this.max.z);
    const xMaxYMinZMin = new Vector3D(this.max.x, this.min.y, this.min.z);
    const xMinYMaxZMin = new Vector3D(this.min.x, this.max.y, this.min.z);
    const xMinYMinZMax = new Vector3D(this.min.x, this.min.y, this.max.z);
    const xMaxYMaxZMin = new Vector3D(this.max.x, this.max.y, this.min.z);
    const xMaxYMinZMax = new Vector3D(this.max.x, this.min.y, this.max.z);
    const xMinYMaxZMax = new Vector3D(this.min.x, this.max.y, this.max.z);

    const xNorm = new Vector3D(1, 0, 0)
    const xNormNegative = new Vector3D(1, 0, 0)
    const yNorm = new Vector3D(0, 1, 0)
    const yNormNegative = new Vector3D(0, 1, 0)
    const zNorm = new Vector3D(0, 0, -1)
    const zNormNegative = new Vector3D(0, 0, -1)

    const triangles = [
      new Triangle(xMinYMinZMin, xMaxYMinZMin, xMinYMaxZMin, zNormNegative, zNormNegative, zNormNegative, this.material),
      new Triangle(xMinYMinZMin, xMaxYMinZMin, xMinYMinZMax, yNormNegative, yNormNegative, yNormNegative, this.material),
      new Triangle(xMinYMinZMin, xMinYMaxZMin, xMinYMinZMax, xNormNegative, xNormNegative, xNormNegative, this.material),

      new Triangle(xMaxYMaxZMin, xMaxYMinZMin, xMinYMaxZMin, zNormNegative, zNormNegative, zNormNegative, this.material),
      new Triangle(xMaxYMinZMax, xMaxYMinZMin, xMinYMinZMax, yNormNegative, yNormNegative, yNormNegative, this.material),
      new Triangle(xMinYMaxZMax, xMinYMaxZMin, xMinYMinZMax, xNormNegative, xNormNegative, xNormNegative, this.material),

      new Triangle(xMaxYMaxZMax, xMaxYMaxZMin, xMaxYMinZMax, xNorm, xNorm, xNorm, this.material),
      new Triangle(xMaxYMaxZMax, xMaxYMaxZMin, xMinYMaxZMax, yNorm, yNorm, yNorm, this.material),
      new Triangle(xMaxYMaxZMax, xMaxYMinZMax, xMinYMaxZMax, zNorm, zNorm, zNorm, this.material),

      new Triangle(xMaxYMinZMin, xMaxYMaxZMin, xMaxYMinZMax, xNorm, xNorm, xNorm, this.material),
      new Triangle(xMinYMaxZMin, xMaxYMaxZMin, xMinYMaxZMax, yNorm, yNorm, yNorm, this.material),
      new Triangle(xMinYMinZMax, xMaxYMinZMax, xMinYMaxZMax, zNorm, zNorm, zNorm, this.material),
    ]
    return triangles
  }
}

//      new Triangle(xMaxYMaxZMax, xMaxYMaxZMin, xMinYMaxZMax, yNorm, yNorm, yNorm, clr2),
