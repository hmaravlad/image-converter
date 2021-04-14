import Vector3D from "../util/vector3D";

export interface IRender {
  render: () => Vector3D[][]
}
