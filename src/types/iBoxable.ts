import { Box } from "../models/box";

export interface IBoxable {
  findBox(): Box
  isInBox(box: Box): boolean
}

export function isBoxable(shape: unknown): shape is IBoxable {
  return (shape as IBoxable).findBox !== undefined && (shape as IBoxable).isInBox !== undefined;
}