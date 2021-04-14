import Vector3D from './vector3D';

export class Options {
  constructor(
    private _height: number,
    private _width: number,
    private _bias: number,
    private _fov: number,
    private _backgroundColor: Vector3D,
    private _objectColor: Vector3D,
    private _cameraPos: Vector3D,
  ) {
  }

  get height(): number {
    return this._height;
  }

  set height(num: number) {
    this._height = num;
  }

  get width(): number {
    return this._width;
  }

  set width(num: number) {
    this._width = num;
  }

  get backgroundColor(): Vector3D {
    return this._backgroundColor;
  }

  set backgroundColor(vec: Vector3D) {
    this._backgroundColor = vec;
  }

  get objectColor(): Vector3D {
    return this._objectColor;
  }

  set objectColor(vec: Vector3D) {
    this._objectColor = vec;
  }

  get bias(): number {
    return this._bias;
  }

  set bias(num: number) {
    this._bias = num;
  }

  get cameraPos(): Vector3D {
    return this._cameraPos;
  }

  set cameraPos(vec: Vector3D) {
    this._cameraPos = vec;
  }

  get fov(): number {
    return this._fov;
  }

  set fov(num: number) {
    this._fov = num;
  }
}