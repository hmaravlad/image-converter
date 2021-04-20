import { injectable } from "inversify";
import { IBoxSplitter } from "../../types/iBoxSplitter";
import { Box } from "../../models/box";
import Vector3D from "../../models/vector3D";
import { KdTreeNode } from "./node";

@injectable()
export class LongestAxisBoxSplitter implements IBoxSplitter {
  split(box: Box, node: KdTreeNode): { box1: Box, box2: Box } {
    const delta = box.max.minus(box.min);
    if (delta.x > delta.y && delta.x > delta.z) {
      node.splitAxis = 0;
      node.splitValue = (box.min.x + box.max.x) / 2;
      return {
        box1: new Box(
          new Vector3D(box.min.x, box.min.y, box.min.z),
          new Vector3D(node.splitValue, box.max.y, box.max.z),
        ),
        box2: new Box(
          new Vector3D(node.splitValue, box.min.y, box.min.z),
          new Vector3D(box.max.x, box.max.y, box.max.z),
        )
      }
    } else if (delta.y > delta.x && delta.y > delta.z) {
      node.splitAxis = 1;
      node.splitValue = (box.min.y + box.max.y) / 2;
      return {
        box1: new Box(
          new Vector3D(box.min.x, box.min.y, box.min.z),
          new Vector3D(box.max.x, node.splitValue, box.max.z),
        ),
        box2: new Box(
          new Vector3D(box.min.x, node.splitValue, box.min.z),
          new Vector3D(box.max.x, box.max.y, box.max.z),
        )
      }
    } else {
      node.splitAxis = 2;
      node.splitValue = (box.min.z + box.max.z) / 2;
      return {
        box1: new Box(
          new Vector3D(box.min.x, box.min.y, box.min.z),
          new Vector3D(box.max.x, box.max.y, node.splitValue),
        ),
        box2: new Box(
          new Vector3D(box.min.x, box.min.y, node.splitValue),
          new Vector3D(box.max.x, box.max.y, box.max.z),
        )
      }
    }
  }
}