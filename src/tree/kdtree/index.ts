import Triangle from "../../models/triangle";
import { Box } from "../../models/box";
import Vector3D from "../../models/vector3D";
import { intersectBoxWithRay } from "../../geometry/intersect";
import { KdTreeNode } from "./node";
import { TraverseResult } from "../../types/traverseResult";
import { inject, injectable } from "inversify";
import { ITree } from "../../types/iTree";
import { ITreeFactory } from "../../types/iTreeFactory";
import { IBoxSplitter } from "../../types/iBoxSplitter";
import { TYPES } from "../../types";
import { LongestAxisBoxSplitter } from "./longestAxisBoxSplitter";

export class KdTree implements ITree {
  head: KdTreeNode;

  constructor(triangles: Triangle[], boxSplitter: IBoxSplitter) {
    const box = this.createRootBox(triangles);
    this.head = new KdTreeNode(triangles, box, 1, boxSplitter);
  }

  private createRootBox(triangles: Triangle[]): Box {
    const tbs = triangles.map(triangle => ({ triangle, box: triangle.findBox() }));

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


    return new Box(
      new Vector3D(minX, minY, minZ),
      new Vector3D(maxX, maxY, maxZ),
    );
  }

  traverse(orig: Vector3D, dir: Vector3D): TraverseResult | undefined {
    const stack: KdTreeNode[] = [];
    const intersection = intersectBoxWithRay(orig, dir, this.head.box);
    const { intersected, tmax } = intersection;
    let { tmin } = intersection;
    if (tmin < 0) tmin = 0;
    if (!intersected) return undefined;
    return this.head.traverse(orig, dir, stack, tmax, tmin)
  }
}

@injectable()
export class KdTreeFactory implements ITreeFactory {
  constructor(@inject(TYPES.IBoxSplitter) private boxSplitter:  LongestAxisBoxSplitter) {}

  getTree(triangles: Triangle[]): ITree {
    return new KdTree(triangles, this.boxSplitter);
  }
}