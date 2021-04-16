import Triangle from "../models/triangle";
import { SceneIntersectResult } from "./hitResult";

export interface TraverseResult  {
  hit: SceneIntersectResult,
  triangle: Triangle,
}
