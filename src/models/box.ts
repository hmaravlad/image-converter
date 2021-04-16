import Triangle from "./triangle";
import Vector3D from "./vector3D";

export class Box {
  constructor(private _min: Vector3D, private _max: Vector3D) {
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

  isTriangleInBox(triangle: Triangle): boolean {
    return this.isDotInBox(triangle.v0) ||
      this.isDotInBox(triangle.v1) ||
      this.isDotInBox(triangle.v2);
  }

  isDotInBox(dot: Vector3D): boolean {
    return (this.min.x <= dot.x && dot.x <= this.max.x) &&
      (this.min.y <= dot.y && dot.y <= this.max.y) &&
      (this.min.z <= dot.z && dot.z <= this.max.z);
  }
}



