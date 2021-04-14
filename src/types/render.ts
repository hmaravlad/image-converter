import Vector3D from "../models/vector3D";

export interface IRender {
  render: () => Vector3D[][]
}
