export class Matrix {
  private _values: number[][];

  public get columns(): number {
    return this._values.length > 0 ? this._values[0].length : 0
  }

  public get rows(): number {
    return this._values.length
  }

  get values(): number[][] {
    return this._values;
  }

  set values(newValues: number[][]) {
    const minRow = Math.min(newValues.length, this.rows);
    const minCol = Math.min(newValues[0].length, this.columns);
    for (let r = 0; r < minRow; r++) {
      for (let c = 0; c < minCol; c++) {
        this.values[r][c] = newValues[r][c];
      }
    }
  }

  constructor(rows: number, columns: number, values?: number[][]) {
    this._values = new Array<number[]>(rows).fill([]).map(() => new Array<number>(columns).fill(0));

    if (values) {
      this.values = values;
    }
  }

  at(row: number, col: number): number {
    return this.values[row][col];
  }

  multiply(mat: Matrix): Matrix {
    if (this.columns !== mat.rows) throw new Error("The operand matrix must have the same number of rows as 'this' matrix columns!");
    const resMatrix = new Matrix(this.rows, mat.columns);
    resMatrix.values = resMatrix.values.map((row, i) => {
      return row.map((val, j) => {
        return this.values[i].reduce((sum, elm, k) => sum + (elm * mat.at(k, j)), 0);
      });
    });
    return resMatrix;
  }

  getCofactor(row: number, col: number): Matrix {
    return new Matrix(this.rows - 1, this.columns - 1, this.values
      .filter((v, i) => i !== row) // Remove the unnecessary row
      .map((c) => c.filter((v, i) => i !== col)));
  }

  determinant(): number {
    if (this.rows !== this.columns) throw new Error("The matrix isn't squared!");
    let det = 0;
    let sign = 1;
    if (this.rows === 2) {
      det = this.values[0][0] * this.values[1][1] - this.values[1][0] * this.values[0][1];
    } else {
      for (let i = 0; i < this.rows; i++) {
        const minor = this.getCofactor(0, i);
        det += sign * this.at(0, i) * minor.determinant();
        sign = -sign;
      }
    }
    return det;
  }

  transpose(): Matrix {
    return new Matrix(this.columns, this.rows, new Array<number[]>(this.columns).fill([])
      .map((row, i) => new Array<number>(this.rows).fill(0).map((c, j) => this.at(j, i))));
  }

  inverse(): Matrix {
    if (this.rows !== this.columns) throw new Error("The matrix isn't squared!");
    const det = this.determinant();
    if (det === 0) throw new Error("Determinant is 0, can't compute inverse.");

    // Get cofactor matrix
    let sign = -1;
    const cofactor = new Matrix(this.rows, this.columns,
      this.values.map((row, i) => row.map((val, j) => {
        sign *= -1;
        return sign * this.getCofactor(i, j).determinant();
      })));
    // Transpose it
    const transposedCofactor = cofactor.transpose();
    // Compute inverse of transposed / determinant on each value
    return new Matrix(this.rows, this.columns,
      this.values.map((row, i) => row.map((val, j) => transposedCofactor.at(i, j) / det)));
  }


  static getIdentityMatrix(n: number): Matrix {
    const matrix = new Matrix(n, n);
    for (let i = 0; i < n; i++) {
      matrix.values[i][i] = 1;
    }
    return matrix
  }
}