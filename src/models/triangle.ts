import { IMaterial } from "../types/iMaterial";
import { IntersectResult } from "../types/hitResult";
import { IBoxable } from "../types/iBoxable";
import { IIntersectable } from "../types/iIntersectable";
import { Box } from "./box";
import { Transformation } from "./transformation";
import Vector3D from "./vector3D";

const K_EPSILON = 0e-5

class Triangle implements IIntersectable, IBoxable {
    constructor(
        private _v0: Vector3D,
        private _v1: Vector3D,
        private _v2: Vector3D,
        private _n0: Vector3D,
        private _n1: Vector3D,
        private _n2: Vector3D,
        readonly material: IMaterial
    ) {
    }

    get v0(): Vector3D {
        return this._v0;
    }

    set v0(vec3D: Vector3D) {
        this._v0 = vec3D;
    }

    get v1(): Vector3D {
        return this._v1;
    }

    set v1(vec3D: Vector3D) {
        this._v1 = vec3D;
    }

    get v2(): Vector3D {
        return this._v2;
    }

    set v2(vec3D: Vector3D) {
        this._v2 = vec3D;
    }

    get n0(): Vector3D {
        return this._n0;
    }

    set n0(vec3D: Vector3D) {
        this._n0 = vec3D;
    }

    get n1(): Vector3D {
        return this._n1;
    }

    set n1(vec3D: Vector3D) {
        this._n1 = vec3D;
    }

    get n2(): Vector3D {
        return this._n2;
    }

    set n2(vec3D: Vector3D) {
        this._n2 = vec3D;
    }

    findBox(): Box {
        const minX = Math.min(this.v0.x, this.v1.x, this.v2.x);
        const minY = Math.min(this.v0.y, this.v1.y, this.v2.y);
        const minZ = Math.min(this.v0.z, this.v1.z, this.v2.z);

        const maxX = Math.max(this.v0.x, this.v1.x, this.v2.x);
        const maxY = Math.max(this.v0.y, this.v1.y, this.v2.y);
        const maxZ = Math.max(this.v0.z, this.v1.z, this.v2.z);

        return new Box(new Vector3D(minX, minY, minZ), new Vector3D(maxX, maxY, maxZ));
    }

    isInBox(box: Box): boolean {
        return box.isDotInBox(this.v0) ||
            box.isDotInBox(this.v1) ||
            box.isDotInBox(this.v2);
    }


    transform(transformation: Transformation): void {
        this.v0 = transformation.applyToVector(this.v0);
        this.v1 = transformation.applyToVector(this.v1);
        this.v2 = transformation.applyToVector(this.v2);
        this.n0 = transformation.applyToNorm(this.n0);
        this.n1 = transformation.applyToNorm(this.n1);
        this.n2 = transformation.applyToNorm(this.n2);
    }


    rayTriangleIntersect(
        orig: Vector3D,
        dir: Vector3D,
    ): {
        shad: boolean,
        t: number,
        u: number,
        v: number
    } {
        let t = 0;
        let u = 0;
        let v = 0;

        const v0v1 = this.v1.minus(this.v0);
        const v0v2 = this.v2.minus(this.v0);
        const pvec = dir.cross(v0v2);
        const det = v0v1.dot(pvec);
        if (det < K_EPSILON && det > -K_EPSILON) {
            return { shad: false, t, u, v };
        }
        const invDet = 1.0 / det;
        const tvec = orig.minus(this.v0);
        u = tvec.dot(pvec) * invDet;
        if (u < 0 || u > 1) {
            return { shad: false, t, u, v };
        }
        const qvec = tvec.cross(v0v1);
        v = dir.dot(qvec) * invDet;
        if (v < 0 || u + v > 1) {
            return { shad: false, t, u, v };
        }
        t = v0v2.dot(qvec) * invDet;
        if (t <= K_EPSILON) {
            return { shad: false, t, u, v };
        }
        return { shad: true, t, u, v };
    }

    intersectWithRay(orig: Vector3D, dir: Vector3D): IntersectResult | undefined {
        let hit = new Vector3D();
        let normal = new Vector3D();
        const { shad: flag, t: tnear, u, v } = this.rayTriangleIntersect(orig, dir);
        if (flag) {
            hit = orig.add(dir.multiply(tnear));
            if (this.n0.equal(this.n1) && this.n0.equal(this.n2)) {
                normal = this.n0;
            } else {
                const temp1 = this.n0.multiply(1 - u - v);
                const temp2 = temp1.add(this.n1.multiply(u));
                normal = temp2.add(this.n2.multiply(v));
            }
        }
        return !flag ? undefined : { hit, normal };
    }

    intersectWithRayBool(orig: Vector3D, dir: Vector3D): boolean {
        return this.rayTriangleIntersect(orig, dir).shad
    }
}

export default Triangle
