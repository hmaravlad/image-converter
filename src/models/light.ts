import Vector3D from "./vector3D";

class Light {
  constructor(private _position: Vector3D, private _intensity: number) {
  }

  get position(): Vector3D {
    return this._position;
  }

  set position(vec: Vector3D) {
    this._position = vec;
  }

  get intensity(): number {
    return this._intensity;
  }

  set intensity(newIntensity: number) {
    this._intensity = newIntensity;
  }
}

export default Light;