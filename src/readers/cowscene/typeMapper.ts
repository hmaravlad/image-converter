import { Color, Light, Scene, Sphere, Transform } from "@computer-graphics-course/scene-format"
import Triangle from "../../models/triangle"
import { objParser } from "./objParser";
import { readFile } from "fs/promises";
import PointLight from "../../lights/pointTight";
import { Options } from "../../models/options";
import Vector3D from "../../models/vector3D";
import { Transformation } from "../../models/transformation";
import { Matrix } from "../../models/matrix";
import { IIntersectable, isIntersectable } from "../../types/iIntersectable";
import { isTransformable } from "../../types/iTransformable";
import { Sphere as MySphere } from "../../models/sphere";
import { Plane } from "../../models/plane";
import { LambertMaterial } from "../../materials/lambertMaterial";
import { vec3ToVec3D } from "../../util/vec3ToVec3D";
import { SpecularMaterial } from "../../materials/specularMaterial";
import { IMaterial } from "../../types/iMaterial";
import { CombinedMaterial } from "../../materials/combinedMaterial";
import { Disk } from "../../models/disk";
import { Cube } from "../../models/cube";
import { PerspectiveCamera } from "../../cameras/perspectiveCamera";
import { OrthographicCamera } from "../../cameras/orthographicCamera";
import { WeirdCamera } from "../../cameras/weirdCamera";
import { DirectionalLight } from "../../lights/directionalLight";
import { ILight } from "../../types/iLight";

function colorToVec3d(color: Color): Vector3D {
  return new Vector3D(color.r, color.g, color.b)
}

export class TypeMapper {
  async map(scene: Scene): Promise<{ shapes: IIntersectable[], lights: ILight[], options: Options }> {
    let shapes: IIntersectable[] = [];

    for (const obj of scene.sceneObjects) {
      let transformation: Transformation | undefined = undefined;
      let currShapes: IIntersectable[] = [];
      let material: IMaterial = new LambertMaterial(new Vector3D(255, 255, 255));
      if (obj.material) {
        if (obj.material.lambertReflection?.color) {
          material = new LambertMaterial(colorToVec3d(obj.material.lambertReflection.color))
          //material = new CombinedMaterial(0.05, 0.95, colorToVec3d(obj.material.lambertReflection.color));
        } else if (obj.material.specularReflection) {
          material = new CombinedMaterial(0.8, 0.2, new Vector3D(20, 20, 20));
        }
      }
      if (obj.transform) {
        transformation = new Transformation(obj.transform);
      }
      if (obj.meshedObject) {
        const buffer = await readFile(obj.meshedObject.reference)
        currShapes = new objParser().parse(buffer, material);
      } else if (obj.sphere) {
        currShapes = [new MySphere(obj.sphere.radius, material)]
      } else if (obj.plane) {
        currShapes = [new Plane(material)]
      } else if (obj.disk) {
        currShapes = [new Disk(obj.disk.radius, material)]
      } else if (obj.cube?.size) {
        currShapes = new Cube(new Vector3D(0, 0, 0), vec3ToVec3D(obj.cube.size), material).toTriangles()
      }

      currShapes.forEach((shape) => { if (isTransformable(shape) && transformation) shape.transform(transformation) });
      shapes = shapes.concat(currShapes);
    }

    const lights: ILight[] = [];
    let backgroundColor = new Vector3D(255, 255, 255)

    for (const light of scene.lights) {
      const color = light.color ? colorToVec3d(light.color) : new Vector3D(255, 255, 255);
      if (light.directional && light.transform) {
        const dir = new Transformation(light.transform).getForward();
        lights.push(new DirectionalLight(dir, color));
      } else if (light.point && light.transform?.position) {
        const pos = vec3ToVec3D(light.transform.position);
        lights.push(new PointLight(pos, 1, color));
      } else if (light.environment) {
        backgroundColor = color;
      }
    }

    const options = new Options(
      scene.renderOptions?.height || 200,
      scene.renderOptions?.width || 200,
      0.2,
      backgroundColor,
      new Vector3D(108, 34, 25),
    )

    const cameraData = scene.cameras.find(camera => camera.id === scene.renderOptions?.cameraId)
    let camera;
    if (!cameraData || !cameraData.transform) throw new Error();
    if (cameraData.perspective) {
      camera = new PerspectiveCamera(options, new Transformation(cameraData.transform), cameraData.perspective.fov)
    } else {
      camera = new WeirdCamera(options, new Transformation(cameraData.transform));
    }
    //camera = (cameraData.orthographic) ? new OrthographicCamera(options) : undefined;
    if (!camera) throw new Error();
    options.camera = camera


    //const lights: ILight[] = [new DirectionalLight(new Vector3D(0, 0, -1).normalize(), new Vector3D(255, 255, 255))];
    //const lights: ILight[] = [new PointLight(new Vector3D(0.8, 2, 1), 2, new Vector3D(255, 1, 1))]
    //const lights: ILight[] = [new PointLight(new Vector3D(0.8, 2, 1), 2, new Vector3D(255, 1, 1)), new DirectionalLight(new Vector3D(-1, 1, -1).normalize(), new Vector3D(255, 255, 255))];
    //const lights = [new Light(new Vector3D(-1.6, 4, 0), 2, new Vector3D(255, 1, 1)), new Light(new Vector3D(-1.6, 4, 0), 2, new Vector3D(1, 1, 255))];
    //const lights = [new Light(new Vector3D(-1, -0.5, 2), 2, new Vector3D(255, 255, 255))];
    //const lights: Light[] = [];


    return {
      shapes,
      options,
      lights
    }
  }
}