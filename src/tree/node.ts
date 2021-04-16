import { sceneIntersect } from "../geometry/intersect";
import { Box } from "../models/box";
import Triangle from "../models/triangle";
import Vector3D from "../models/vector3D";
import { TraverseResult } from "../types/traverseResult";
import { boxSplitter } from "./boxSplitter";

const MAX_DEPTH = 40;

interface NodeInfo {
  left?: NodeInfo,
  right?: NodeInfo,
  depth: number,
  triangles: number,
}

export class KdTreeNode {
  left?: KdTreeNode;
  right?: KdTreeNode;
  triangles: Triangle[];
  box: Box;
  depth: number;
  splitAxis?: number;
  splitValue?: number;

  constructor(tbs: Triangle[], box: Box, depth: number) {
    this.triangles = tbs;
    this.box = box;
    this.depth = depth;
    this.splitNode();
  }

  splitNode(): void {
    const { box1, box2 } = boxSplitter.split(this.box, this);
    const tbs1 = [];
    const tbs2 = [];

    if (this.triangles.length < 3) return;
    if (this.checkStoppingCondition()) return;

    for (const triangle of this.triangles) {
      if (box1.isTriangleInBox(triangle)) {
        tbs1.push(triangle);
      }
      if (box2.isTriangleInBox(triangle)) {
        tbs2.push(triangle);
      }
    }

    this.left = new KdTreeNode(tbs1, box1, this.depth + 1);
    this.right = new KdTreeNode(tbs2, box2, this.depth + 1);
  }

  checkStoppingCondition(): boolean {
    return this.depth > MAX_DEPTH;
  }

  getInfo(): NodeInfo {
    const info: NodeInfo = {
      depth: this.depth,
      triangles: this.triangles.length,
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
      return this.traverseTriangles(orig, dir);
    }

    const invDir = (new Vector3D(1, 1, 1)).divide(dir);

    const tSplit = (this.splitValue - orig.getByAxis(this.splitAxis)) * invDir.getByAxis(this.splitAxis);

    const nearNode = !leftOrRight[this.splitAxis] ? this.left : this.right;
    const farNode = !leftOrRight[this.splitAxis] ? this.right : this.left;

    if (tSplit <= tmin) {
      return farNode.traverse(orig, dir, stack, tmax, tmin);
    }

    if (tSplit >= tmax) {
      return farNode.traverse(orig, dir, stack, tmax, tmin);
    }

    stack.push(farNode);
    const hit = nearNode.traverse(orig, dir, stack, tmax, tmin);
    if (hit) return hit;

    const res = stack.pop()?.traverse(orig, dir, stack, tmax, tmin);
    return res || undefined;
  }

  traverseTriangles(orig: Vector3D, dir: Vector3D): TraverseResult | undefined {
    let min = Number.MAX_VALUE;
    let res;
    let triangleRes;
    for (const triangle of this.triangles) {
      const intersectRes = sceneIntersect(orig, dir, triangle);
      if (!intersectRes.flag) continue;
      const currentDistance = intersectRes.hit.distance(orig);
      if (min > currentDistance) {
        min = currentDistance;
        res = intersectRes;
        triangleRes = triangle;
      }
    }
    return !res || !triangleRes ? undefined : { hit: res, triangle: triangleRes };
  }
}
