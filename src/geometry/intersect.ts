import Triangle from "../models/triangle";
import Vector3D from "../models/vector3D";
import { SceneIntersectResult } from "../types/hitResult";

const K_EPSILON = 1e-8;

export function rayTriangleIntersect(
  orig: Vector3D,
  dir: Vector3D,
  triangle: Triangle,
): {
  shad: boolean,
  t: number,
  u: number,
  v: number
} {
  let t = 0;
  let u = 0;
  let v = 0;

  const v0v1 = triangle.v1.minus(triangle.v0);
  const v0v2 = triangle.v2.minus(triangle.v0);
  const pvec = dir.cross(v0v2);
  const det = v0v1.dot(pvec);
  if(det < K_EPSILON && det > -K_EPSILON) {
    return {
      shad: false,
      t,
      u,
      v
    };
  }
  const invDet = 1.0 / det;
  const tvec = orig.minus(triangle.v0);
  u = tvec.dot(pvec) * invDet;
  if(u < 0 || u > 1) {
    return {
      shad: false,
      t,
      u,
      v
    };
  }
  const qvec = tvec.cross(v0v1);
  v = dir.dot(qvec) * invDet;
  if(v < 0 || u + v > 1) {
    return {
      shad: false,
      t,
      u,
      v
    };
  }
  t = v0v2.dot(qvec) * invDet;
  return {
    shad: true,
    t,
    u,
    v
  };
}

export function sceneIntersect(orig: Vector3D, dir: Vector3D, triangle: Triangle): SceneIntersectResult {
  let hit = new Vector3D();
  let normal = new Vector3D();
  const { shad: flag, t: tnear, u, v } = rayTriangleIntersect(orig, dir, triangle);
  if(flag) {
    hit = orig.add(dir.multiply(tnear));
    const temp1 = triangle.n0.multiply(1 - u - v);
    const temp2 = temp1.add(triangle.n1.multiply(u));
    normal = temp2.add(triangle.n2.multiply(v));
  }
  return { flag, hit, normal };
}
