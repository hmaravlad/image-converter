import { Box } from "./box";
import Vector3D from "./vector3D";

class Triangle {
    constructor(
        private _v0: Vector3D,
        private _v1: Vector3D,
        private _v2: Vector3D,
        private _n0: Vector3D,
        private _n1: Vector3D,
        private _n2: Vector3D
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
}

export default Triangle
