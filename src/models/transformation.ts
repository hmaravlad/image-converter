import { Transform } from "@computer-graphics-course/scene-format";
import { vec3ToVec3D } from "../util/vec3ToVec3D";
import { degToRad } from "../util/degToRad";
import { Matrix } from "./matrix";
import Vector3D from "./vector3D";

const counterCr = (n = 0) => () => (n++)
const counter = counterCr()

export class Transformation {
  readonly matrix: Matrix;
  private transposedInverse: Matrix | undefined

  constructor(transform: Transform) {
    const transformations = []
    if (transform.position) transformations.push(this.translation(vec3ToVec3D(transform.position)))
    if (transform.rotation && transform.rotation.x != 0) transformations.push(this.rotateX(transform.rotation.x))
    if (transform.rotation && transform.rotation.y != 0) transformations.push(this.rotateY(transform.rotation.y))
    if (transform.rotation && transform.rotation.z != 0) transformations.push(this.rotateZ(transform.rotation.z))
    if (transform.scale) transformations.push(this.scale(vec3ToVec3D(transform.scale)))
    this.matrix = transformations.reduceRight((prev, curr) => {
      return prev.multiply(curr)
    });
  }

  translation(vector: Vector3D): Matrix {
    const matrix = Matrix.getIdentityMatrix(4);
    matrix.values[3][0] = vector.x;
    matrix.values[3][1] = vector.y;
    matrix.values[3][2] = vector.z;
    return matrix;
  }

  scale(vector: Vector3D): Matrix {
    const matrix = Matrix.getIdentityMatrix(4);
    matrix.values[0][0] = vector.x;
    matrix.values[1][1] = vector.y;
    matrix.values[2][2] = vector.z;
    return matrix;
  }

  rotateX(degree: number): Matrix {
    const radian = degToRad(degree);

    const matrix = Matrix.getIdentityMatrix(4);
    matrix.values[1][1] = Math.cos(radian);
    matrix.values[1][2] = -Math.sin(radian);
    matrix.values[2][1] = Math.sin(radian);
    matrix.values[2][2] = Math.cos(radian);
    return matrix;
  }

  rotateY(degree: number): Matrix {
    const radian = degToRad(degree);
    const matrix = Matrix.getIdentityMatrix(4);
    matrix.values[0][0] = Math.cos(radian);
    matrix.values[0][2] = Math.sin(radian);
    matrix.values[2][0] = -Math.sin(radian);
    matrix.values[2][2] = Math.cos(radian);
    return matrix;
  }

  rotateZ(degree: number): Matrix {
    const radian = degToRad(degree);
    const matrix = Matrix.getIdentityMatrix(4);
    matrix.values[0][0] = Math.cos(radian);
    matrix.values[0][1] = -Math.sin(radian);
    matrix.values[1][0] = Math.sin(radian);
    matrix.values[1][1] = Math.cos(radian);
    return matrix;
  }

  getUp(): Vector3D {
    return new Vector3D(...this.matrix.values[1]);
  }

  getForward(): Vector3D {
    return new Vector3D(...this.matrix.values[2]);
  }

  applyToVector(vector: Vector3D): Vector3D {
    //const matrix = new Matrix(4, 1, [[vector.x], [vector.y], [vector.z], [1]]);
    const matrix = new Matrix(1, 4, [[vector.x, vector.y, vector.z, 1]]);
    const resultMatrix = matrix.multiply(this.matrix);
    const w = resultMatrix.at(0, 3);
    const result = (new Vector3D(resultMatrix.at(0, 0), resultMatrix.at(0, 1), resultMatrix.at(0, 2))).divide(new Vector3D(w, w, w));
    //const w = resultMatrix.at(3, 0);
    //const result = (new Vector3D(resultMatrix.at(0, 0), resultMatrix.at(1, 0), resultMatrix.at(2, 0))).divide(new Vector3D(w, w, w));
    //if (counter() < 10) {
    //      console.dir({ prev: this.matrix, vec: matrix, resultMatrix, w, result }, { depth: 4 })
    //}
    //console.dir({ result }, { depth: 4 })

    return result
  }


  applyToNorm(vector: Vector3D): Vector3D {
    //const matrix = new Matrix(4, 1, [[vector.x], [vector.y], [vector.z], [1]]);
    if (!this.transposedInverse) {
      this.transposedInverse = this.matrix.inverse().transpose()
    }
    const trans = this.transposedInverse;
    const matrix = new Matrix(1, 4, [[vector.x, vector.y, vector.z, 1]]);
    const resultMatrix = matrix.multiply(trans);
    const w = resultMatrix.at(0, 3);
    const result = (new Vector3D(resultMatrix.at(0, 0), resultMatrix.at(0, 1), resultMatrix.at(0, 2))).divide(new Vector3D(w, w, w));
    //const w = resultMatrix.at(3, 0);
    //const result = (new Vector3D(resultMatrix.at(0, 0), resultMatrix.at(1, 0), resultMatrix.at(2, 0))).divide(new Vector3D(w, w, w));
    //if (counter() < 10) {
    //  console.dir({ prev: this.matrix, vec: matrix, resultMatrix, w, result }, { depth: 4 })
    //}

    return result
  }

}