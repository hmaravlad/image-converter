class Vector3D {
  constructor(private _x: number = 0, private _y: number = 0, private _z: number = 0) {
  }

  get x(): number {
    return this._x
  }

  set x(num: number) {
    this._x = num;
  }

  get y(): number {
    return this._y
  }

  set y(num: number) {
    this._y = num;
  }

  get z(): number {
    return this._z
  }

  set z(num: number) {
    this._z = num;
  }

  clone(): Vector3D {
    return new Vector3D(this.x, this.y, this.z);
  }

  getByAxis(axis: number): number {
    if (axis === 0) return this.x;
    if (axis === 1) return this.y;
    if (axis === 2) return this.z;
    throw new Error();
  }

  dot(vec3: Vector3D): number {
    return this._x * vec3.x + this._y * vec3.y + this._z * vec3.z;
  }

  cross(vec: Vector3D): Vector3D {
    return new Vector3D(this.y * vec.z - this.z * vec.y, this.z * vec.x - this.x * vec.z, this.x * vec.y - this.y * vec.x);
  }

  add(vec3: Vector3D): Vector3D {
    return new Vector3D(this.x + vec3.x, this.y + vec3.y, this.z + vec3.z);
  }

  minus(vec3: Vector3D): Vector3D {
    return new Vector3D(this.x - vec3.x, this.y - vec3.y, this.z - vec3.z);
  }

  multiply(num: number): Vector3D {
    return new Vector3D(this.x * num, this.y * num, this.z * num);
  }

  divide(vec3: Vector3D): Vector3D {
    return new Vector3D(this._x / vec3._x, this._y / vec3._y, this._z / vec3._z);
  }

  length(): number {
    return Math.sqrt(this.x ** 2 + this.y ** 2 + this.z ** 2);
  }

  normalize(): Vector3D {
    const length = this.length();
    return new Vector3D(this.x / length, this.y / length, this.z / length);
  }

  acosV(second: Vector3D): number {
    return Math.acos(this.dot(second) / (this.length() * second.length()));
  }

  equal(second: Vector3D): boolean {
    return this.x === second.x && this.y === second.y && this.z === second.z;
  }

  distance(vec: Vector3D): number {
    return Math.sqrt((this._x - vec.x) ** 2 + (this._y - vec.y) ** 2 + (this._z - vec.z) ** 2)
  }
}

export default Vector3D