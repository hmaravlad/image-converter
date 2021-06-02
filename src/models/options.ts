import { Transform, Vector3 } from '@computer-graphics-course/scene-format';
import { PerspectiveCamera } from '../cameras/perspectiveCamera';
import { ICamera } from '../types/iCamera';
import { Transformation } from './transformation';
import Vector3D from './vector3D';

export class Options {

  public camera: ICamera
  constructor(
    private _height: number,
    private _width: number,
    private _bias: number,
    private _backgroundColor: Vector3D,
    private _objectColor: Vector3D,
  ) {
    this.camera = new PerspectiveCamera(this, new Transformation(Transform.fromPartial({ position: <Vector3>{ x: 0, y: 0, z: 0 } })), 150);
    (this.camera as PerspectiveCamera).origin = new Vector3D(0, -3, 0);
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
}