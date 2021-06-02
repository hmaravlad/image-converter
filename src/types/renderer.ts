import Vector3D from '../models/vector3D';
import Triangle from '../models/triangle';
import { IIntersectable } from './iIntersectable';

export interface IRenderer {
  render: (shapes: IIntersectable[]) => Vector3D[][]
}
