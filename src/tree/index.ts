import Triangle from "../models/triangle";
import { Box } from "../types/box";
import Vector3D from "../models/vector3D";
import { sceneIntersect } from "../geometry/intersect";
import { SceneIntersectResult } from "../types/hitResult";

interface TraverseResult  {
  hit: SceneIntersectResult,
  triangle: Triangle,
}

interface NodeInfo {
  left?: NodeInfo,
  right?: NodeInfo,
  depth: number,
  triangles: number,
}

const MAX_DEPTH = 40;

function findBox(triangle: Triangle): Box {
  const minX = Math.min(triangle.v0.x, triangle.v1.x, triangle.v2.x);
  const minY = Math.min(triangle.v0.y, triangle.v1.y, triangle.v2.y);
  const minZ = Math.min(triangle.v0.z, triangle.v1.z, triangle.v2.z);

  const maxX = Math.max(triangle.v0.x, triangle.v1.x, triangle.v2.x);
  const maxY = Math.max(triangle.v0.y, triangle.v1.y, triangle.v2.y);
  const maxZ = Math.max(triangle.v0.z, triangle.v1.z, triangle.v2.z);

  return { min: new Vector3D(minX, minY, minZ), max: new Vector3D(maxX, maxY, maxZ) };
}

function intersectBoxWithRay(orig: Vector3D, dir: Vector3D, box: Box): {
  tmin: number, tmax: number, intersected: boolean,
} {
  const invDir = (new Vector3D(1, 1, 1)).divide(dir);

  const lo = invDir.x * (box.min.x - orig.x);
  const hi = invDir.x * (box.max.x - orig.x);

  let tmin = Math.min(lo, hi);
  let tmax = Math.max(lo, hi);



  const lo1 = invDir.y * (box.min.y - orig.y);
  const hi1 = invDir.y * (box.max.y - orig.y);

  tmin = Math.max(tmin, Math.min(lo1, hi1));
  tmax = Math.min(tmax, Math.max(lo1, hi1));



  const lo2 = invDir.z * (box.min.z - orig.z);
  const hi2 = invDir.z * (box.max.z - orig.z);

  tmin = Math.max(tmin, Math.min(lo2, hi2));
  tmax = Math.min(tmax, Math.max(lo2, hi2));

  return {
    intersected: (tmin <= tmax) && (tmax > 0),
    tmax,
    tmin,
  };
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
    const { box1, box2 } = this.splitBox(this.box);
    const tbs1 = [];
    const tbs2 = [];

    if (this.triangles.length < 3) return;
    if (this.checkStoppingCondition()) return;

    for (const triangle of this.triangles) {
      if (this.isTriangleInBox(box1, triangle)) {
        tbs1.push(triangle);
      }
      if (this.isTriangleInBox(box2, triangle)) {
        tbs2.push(triangle);
      }
    }

    this.left = new KdTreeNode(tbs1, box1, this.depth + 1);
    this.right = new KdTreeNode(tbs2, box2, this.depth + 1);
  }

  checkStoppingCondition(): boolean {
    return this.depth > MAX_DEPTH;
  }

  isTriangleInBox(box: Box, triangle: Triangle): boolean {
    return this.isDotInBox(box, triangle.v0) ||
      this.isDotInBox(box, triangle.v1) ||
      this.isDotInBox(box, triangle.v2);
  }

  isDotInBox(box: Box, dot: Vector3D): boolean {
    return (box.min.x <= dot.x && dot.x <= box.max.x) &&
      (box.min.y <= dot.y && dot.y <= box.max.y) &&
      (box.min.z <= dot.z && dot.z <= box.max.z);
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

  splitBox(box: Box): { box1: Box, box2: Box } {
    const delta = box.max.minus(box.min);
    if (delta.x > delta.y && delta.x > delta.z) {
      this.splitAxis = 0;
      this.splitValue = (box.min.x + box.max.x) / 2;
      return {
        box1: {
          min: new Vector3D(box.min.x, box.min.y, box.min.z),
          max: new Vector3D(this.splitValue, box.max.y, box.max.z),
        },
        box2: {
          min: new Vector3D(this.splitValue, box.min.y, box.min.z),
          max: new Vector3D(box.max.x, box.max.y, box.max.z),
        }
      }
    } else if (delta.y > delta.x && delta.y > delta.z) {
      this.splitAxis = 1;
      this.splitValue = (box.min.y + box.max.y) / 2;
      return {
        box1: {
          min: new Vector3D(box.min.x, box.min.y, box.min.z),
          max: new Vector3D(box.max.x, this.splitValue, box.max.z),
        },
        box2: {
          min: new Vector3D(box.min.x, this.splitValue, box.min.z),
          max: new Vector3D(box.max.x, box.max.y, box.max.z),
        }
      }
    } else {
      this.splitAxis = 2;
      this.splitValue = (box.min.z + box.max.z) / 2;
      return {
        box1: {
          min: new Vector3D(box.min.x, box.min.y, box.min.z),
          max: new Vector3D(box.max.x, box.max.y, this.splitValue),
        },
        box2: {
          min: new Vector3D(box.min.x, box.min.y, this.splitValue),
          max: new Vector3D(box.max.x, box.max.y, box.max.z),
        }
      }
    }
  }

  traverse(orig: Vector3D, dir: Vector3D, stack: KdTreeNode[], tmax: number, tmin: number, cameraPos: Vector3D): TraverseResult | undefined {
    const leftOrRight = [
      !(dir.x >= 0),
      !(dir.y >= 0),
      !(dir.z >= 0),
    ];

    if (!this.splitValue || !this.splitAxis || !this.right || !this.left) {
      let min = Number.MAX_VALUE;
      let res;
      let triangleRes;
      for (const triangle of this.triangles) {
        const intersectRes = sceneIntersect(orig, dir, triangle);
        if (!intersectRes.flag) continue;
        const currentDistance = intersectRes.hit.distance(cameraPos);
        if (min > currentDistance) {
          min = currentDistance;
          res = intersectRes;
          triangleRes = triangle;
        }
      }
      return !res || !triangleRes ? undefined : { hit: res, triangle: triangleRes };
    }

    const invDir = (new Vector3D(1, 1, 1)).divide(dir);

    const tSplit = (this.splitValue - orig.getByAxis(this.splitAxis)) * invDir.getByAxis(this.splitAxis);

    const nearNode = !leftOrRight[this.splitAxis] ? this.left : this.right;
    const farNode = !leftOrRight[this.splitAxis] ? this.right : this.left;

    if (tSplit <= tmin) {
      return farNode.traverse(orig, dir, stack, tmax, tmin, cameraPos);
    }

    if (tSplit >= tmax) {
      return farNode.traverse(orig, dir, stack, tmax, tmin, cameraPos);
    }

    stack.push(farNode);
    const hit = nearNode.traverse(orig, dir, stack, tmax, tmin, cameraPos);
    if (hit) return hit;

    const res = stack.pop()?.traverse(orig, dir, stack, tmax, tmin, cameraPos);
    return res || undefined;

  }
}

export class KdTree {
  head: KdTreeNode;

  constructor(triangles: Triangle[]) {
    const tbs = triangles.map(triangle => ({ triangle, box: findBox(triangle) }));

    let minX = Number.MAX_VALUE;
    let minY = Number.MAX_VALUE;
    let minZ = Number.MAX_VALUE;

    let maxX = Number.MIN_VALUE;
    let maxY = Number.MIN_VALUE;
    let maxZ = Number.MIN_VALUE;

    for (const tb of tbs) {
      if (minX > tb.box.min.x) minX = tb.box.min.x;
      if (minY > tb.box.min.y) minY = tb.box.min.y;
      if (minZ > tb.box.min.z) minZ = tb.box.min.z;

      if (maxX < tb.box.max.x) maxX = tb.box.max.x;
      if (maxY < tb.box.max.y) maxY = tb.box.max.y;
      if (maxZ < tb.box.max.z) maxZ = tb.box.max.z;
    }


    const box = {
      max: new Vector3D(maxX, maxY, maxZ),
      min: new Vector3D(minX, minY, minZ),
    }

    this.head = new KdTreeNode(triangles, box, 1);
  }

  traverse(orig: Vector3D, dir: Vector3D, cameraPos: Vector3D): TraverseResult | undefined {
    const stack: KdTreeNode[] = [];
    const intersection = intersectBoxWithRay(orig, dir, this.head.box);
    const { intersected, tmax } = intersection;
    let { tmin } = intersection;
    if (tmin < 0) tmin = 0;
    if (!intersected) return undefined;
    return this.head.traverse(orig, dir, stack, tmax, tmin, cameraPos)
  }
}