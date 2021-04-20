import Triangle from "../models/triangle";
import { ITree } from "./iTree";

export interface ITreeFactory {
  getTree: (triangles: Triangle[]) => ITree
}