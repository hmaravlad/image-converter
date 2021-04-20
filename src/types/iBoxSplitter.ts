import { Box } from "../models/box";
import { KdTreeNode } from "../tree/kdtree/node";

export interface IBoxSplitter {
  split: (box: Box, node: KdTreeNode) => { box1: Box, box2: Box }
}