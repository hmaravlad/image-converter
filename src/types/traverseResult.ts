import { IntersectResult } from "./hitResult";
import { IIntersectable } from "./iIntersectable";

export interface TraverseResult  {
  hit: IntersectResult,
  shape: IIntersectable,
}
