import { ITransformable } from "../types/iTransformable";
import { IIntersectable } from "../types/iIntersectable";
import Vector3D from "./vector3D";
import { Transformation } from "./transformation";
import { IntersectResult } from "../types/hitResult";
import { IMaterial } from "../types/iMaterial";

export class Sphere implements IIntersectable, ITransformable {
  position: Vector3D = new Vector3D(0, 0, 0)
  constructor(public radius = 1, readonly material: IMaterial) { }

  intersectWithRay(orig: Vector3D, dir: Vector3D): IntersectResult | undefined {

    let t0 = 0;
    let t1 = 0;

    const L = orig.minus(this.position);
    const a = dir.dot(dir);
    const b = 2.0 * L.dot(dir);
    const c = L.dot(L) - this.radius * this.radius;
    const discriminant = b * b - 4 * a * c;
    if (discriminant < 0) return undefined;
    else if (discriminant == 0) t0 = t1 = - 0.5 * b / a;
    else {
      const q = (b > 0) ?
        -0.5 * (b + Math.sqrt(discriminant)) :
        -0.5 * (b - Math.sqrt(discriminant));
      t0 = q / a;
      t1 = c / q;
    }

    if (t0 > t1) {
      const x = t0;
      t0 = t1
      t1 = x
    }

    if (t0 < 0) {
      t0 = t1;
      if (t0 < 0) return undefined;
    }

    const t = t0;
    const hit = orig.add(dir.multiply(t));
    const normal = (hit.minus(this.position)).normalize();

    return { hit, normal }
  }

  intersectWithRayBool(orig: Vector3D, dir: Vector3D): boolean {
    const oc = orig.minus(this.position);
    const a = dir.dot(dir);
    const b = 2.0 * oc.dot(dir);
    const c = oc.dot(oc) - this.radius * this.radius;
    const discriminant = b * b - 4 * a * c;
    return (discriminant > 0);
  }

  transform(transformation: Transformation): void {
    this.position = transformation.applyToVector(this.position);
  }
}