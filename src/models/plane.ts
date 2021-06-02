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

export class Plane implements IIntersectable, ITransformable {
  position = new Vector3D(0, 0, 0);
  norm = new Vector3D(0, 0, 1);

  constructor(readonly material: IMaterial) {}

  intersectWithRay(orig: Vector3D, dir: Vector3D): IntersectResult | undefined {
    const denom = this.norm.dot(dir);
    if (Math.abs(denom) > 1e-6) {
      const p0l0 = this.position.minus(orig);
      const t = p0l0.dot(this.norm) / denom * 1;
      return (t < 0) ? undefined : {
        hit: orig.add(dir.multiply(t)),
        normal: this.norm.multiply(denom >= 0 ? 1 : -1)
      };
    }

    return undefined
  }
  intersectWithRayBool(orig: Vector3D, dir: Vector3D): boolean {
    const denom = this.norm.dot(dir);
    if (denom > 1e-6) {
      const p0l0 = this.position.minus(orig);
      const t = p0l0.dot(this.norm) / denom;
      return (t >= 0)
    }

    return false
  }
  transform(transformation: Transformation): void {
    this.position = transformation.applyToVector(this.position);
    this.norm = transformation.getUp();
  }
}
