import { IBoxSplitter } from "../../types/iBoxSplitter";
import { Box } from "../../models/box";
import Vector3D from "../../models/vector3D";
import { TraverseResult } from "../../types/traverseResult";
import { IBoxable } from "src/types/iBoxable";
import { IIntersectable } from "src/types/iIntersectable";

const MAX_DEPTH = 40;

interface NodeInfo {
  left?: NodeInfo,
  right?: NodeInfo,
  depth: number,
  shapes: number,
}

export class KdTreeNode {
  left?: KdTreeNode;
  right?: KdTreeNode;
  shapes: (IBoxable & IIntersectable)[];
  box: Box;
  depth: number;
  splitAxis?: number;
  splitValue?: number;
  boxSplitter: IBoxSplitter;

  constructor(tbs: (IBoxable & IIntersectable)[], box: Box, depth: number, boxSplitter: IBoxSplitter) {
    this.boxSplitter = boxSplitter;
    this.shapes = tbs;
    this.box = box;
    this.depth = depth;
    this.splitNode();
  }

  splitNode(): void {
    const { box1, box2 } = this.boxSplitter.split(this.box, this);
    const tbs1 = [];
    const tbs2 = [];

    if (this.shapes.length < 3) return;
    if (this.checkStoppingCondition()) return;

    for (const shape of this.shapes) {
      if (shape.isInBox(box1)) {
        tbs1.push(shape);
      }
      if (shape.isInBox(box2)) {
        tbs2.push(shape);
      }
    }

    this.left = new KdTreeNode(tbs1, box1, this.depth + 1, this.boxSplitter);
    this.right = new KdTreeNode(tbs2, box2, this.depth + 1, this.boxSplitter);
  }

  checkStoppingCondition(): boolean {
    return this.depth > MAX_DEPTH;
  }

  getInfo(): NodeInfo {
    const info: NodeInfo = {
      depth: this.depth,
      shapes: this.shapes.length,
    };
    if (this.right) {
      info.right = this.right.getInfo();
    }
    if (this.left) {
      info.left = this.left.getInfo();
    }
    return info;
  }

  traverse(orig: Vector3D, dir: Vector3D, stack: KdTreeNode[], tmax: number, tmin: number): TraverseResult | undefined {
    const leftOrRight = [
      !(dir.x >= 0),
      !(dir.y >= 0),
      !(dir.z >= 0),
    ];

    if (!this.splitValue || !this.splitAxis || !this.right || !this.left) {
      return this.traverseShapes(orig, dir);
    }

    const invDir = (new Vector3D(1, 1, 1)).divide(dir);

    const tSplit = (this.splitValue - orig.getByAxis(this.splitAxis)) * invDir.getByAxis(this.splitAxis);

    const nearNode = !leftOrRight[this.splitAxis] ? this.left : this.right;
    const farNode = !leftOrRight[this.splitAxis] ? this.right : this.left;

    if (tSplit <= tmin) {
      return farNode.traverse(orig, dir, stack, tmax, tmin);
    }

    if (tSplit >= tmax) {
      return nearNode.traverse(orig, dir, stack, tmax, tmin);
    }

    stack.push(farNode);
    const hit = nearNode.traverse(orig, dir, stack, tmax, tmin);
    if (hit) return hit;

    const res = stack.pop()?.traverse(orig, dir, stack, tmax, tmin);
    return res || undefined;
  }

  traverseShapes(orig: Vector3D, dir: Vector3D): TraverseResult | undefined {
    let min = Number.MAX_VALUE;
    let res;
    let shapeRes;
    for (const shape of this.shapes) {
      const intersectRes = shape.intersectWithRay(orig, dir);
      if (!intersectRes) continue;
      const currentDistance = intersectRes.hit.distance(orig);
      if (min > currentDistance) {
        min = currentDistance;
        res = intersectRes;
        shapeRes = shape;
      }
    }
    return !res || !shapeRes ? undefined : { hit: res, shape: shapeRes };
  }
}
