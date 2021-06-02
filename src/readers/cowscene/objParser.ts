import { IMaterial } from '../../types/iMaterial';
import Triangle from '../../models/triangle';
import Vector3D from '../../models/vector3D';
import { Vertex } from '../../types/vertex';

export class objParser {
  private data = '';
  private _outV: Vector3D[] = [];
  private _outVn: Vector3D[] = [];
  private _outF: Vertex[][] = [];
  private _arrayOfTriangle: Triangle[] = [];


  private processLiteralV(data: string[]) {
    this._outV.push(new Vector3D(
      parseFloat(data[0]),
      parseFloat(data[1]),
      parseFloat(data[2])
    ));
  }

  private processLiteralVn(data: string[]) {
    this._outVn.push(new Vector3D(
      parseFloat(data[0]),
      parseFloat(data[1]),
      parseFloat(data[2])
    ));
  }

  private processLiteralF(data: string[]) {
    const tempArr: Vertex[] = [];
    for(let j = 0; j < data.length; j++) {
      const vertices = data[j].split('/');
      const obj = {
        v: parseFloat(vertices[0]) - 1,
        vn: parseFloat(vertices[2]) - 1
      };
      tempArr.push(obj);
    }
    this._outF.push(tempArr);
  }

  parse(buffer: Buffer, material: IMaterial): Triangle[] {
    this.data = buffer.toString('utf-8');
    const data = this.data.split('\n');
    for(let i = 0; i < data.length; i++) {
      const row = data[i].split(' ');
      const firstLiteral = row.shift();
      if(firstLiteral === 'v') {
        this.processLiteralV(row);
      } else if(firstLiteral === 'vn') {
        this.processLiteralVn(row);
      } else if(firstLiteral === 'f') {
        this.processLiteralF(row);
      }
    }
    for(let i = 0; i < this._outF.length; i++) {
      const elem = this._outF[i];
      const tria = new Triangle(
        this._outV[elem[0].v],
        this._outV[elem[1].v],
        this._outV[elem[2].v],
        this._outVn[elem[0].vn],
        this._outVn[elem[1].vn],
        this._outVn[elem[2].vn],
        material
      );
      this._arrayOfTriangle.push(tria);
    }
    return this._arrayOfTriangle;
  }
}
