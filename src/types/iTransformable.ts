import { Transformation } from "../models/transformation";

export interface ITransformable {
  transform(transformation: Transformation): void
}

export function isTransformable(shape: unknown): shape is ITransformable {
  return (shape as ITransformable).transform !== undefined;
}