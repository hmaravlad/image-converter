import { Scene, Transform, Vector3 } from "@computer-graphics-course/scene-format";
import { IMaterial } from "../types/iMaterial";
import { IntersectResult } from "../types/hitResult";
import { IIntersectable } from "../types/iIntersectable";
import { ITransformable } from "../types/iTransformable";
import { Transformation } from "./transformation";
import Vector3D from "./vector3D";

interface HaveUp {
  up: Vector3
}

export class Disk implements IIntersectable, ITransformable {
  position = new Vector3D(0, 0, 0);
  norm = new Vector3D(0, 0, 1);

  constructor(readonly radius: number, readonly material: IMaterial) {}
  readonly radius2 = this.radius * this.radius

  intersectWithRay(orig: Vector3D, dir: Vector3D): IntersectResult | undefined {
    const denom = this.norm.dot(dir);
    if (Math.abs(denom) > 1e-6) {
      const p0l0 = this.position.minus(orig);
      const t = p0l0.dot(this.norm) / denom * 1;
      if (t < 0) {
        return undefined
      }
      const p = orig.add(dir.multiply(t));
      const v = p.minus(this.position);
      const d2 = v.dot(v);
      return (d2 > this.radius2) ? undefined : {
        hit: p,
        normal: this.norm.multiply(denom >= 0 ? 1 : -1)
      };
    }

    return undefined
  }
  intersectWithRayBool(orig: Vector3D, dir: Vector3D): boolean {
    const denom = this.norm.dot(dir);
    if (Math.abs(denom) > 1e-6) {
      const p0l0 = this.position.minus(orig);
      const t = p0l0.dot(this.norm) / denom * 1;
      if (t < 0) {
        return false
      }
      const p = orig.add(dir.multiply(t));
      const v = p.minus(this.position);
      const d2 = v.dot(v);
      return (d2 < this.radius2);
    }

    return false
  }
  transform(transformation: Transformation): void {
    this.position = transformation.applyToVector(this.position);
    this.norm = transformation.getUp();
  }
}
