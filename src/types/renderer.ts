import Vector3D from '../models/vector3D';
import Triangle from '../models/triangle';

export interface IRenderer {
  render: (triangles: Triangle[]) => Vector3D[][]
}
