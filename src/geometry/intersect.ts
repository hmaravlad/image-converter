import { Box } from "../models/box";
import Vector3D from "../models/vector3D";

export function intersectBoxWithRay(orig: Vector3D, dir: Vector3D, box: Box): {
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
