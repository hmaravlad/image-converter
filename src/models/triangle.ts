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
}

export default Triangle
