import Triangle from "../models/triangle";
import { IBoxable } from "./iBoxable";
import { IIntersectable } from "./iIntersectable";
import { ITree } from "./iTree";

export interface ITreeFactory {
  getTree: (shapes: (IBoxable & IIntersectable)[]) => ITree
}