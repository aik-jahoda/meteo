import { CurveFactory, Path } from "d3";

export const areaCurveFactory = (y: number, curveFactory: CurveFactory) => {
  return (context: CanvasRenderingContext2D | Path) =>
    new AreaCurveGenerator(context, y, curveFactory);
};

class AreaCurveGenerator implements d3.CurveGenerator {
  private curve = this.curveFactory(this.context);
  private lastPoint = { x: 0, y: 0 };
  private firstPoint = { x: 0, y: 0 };
  private isFirstPoint = true;
  constructor(
    private context: CanvasRenderingContext2D | Path,
    private y: number,
    private curveFactory: CurveFactory
  ) {}
  areaStart() {
    this.curve.areaStart();
  }
  areaEnd() {
    this.curve.areaEnd();
  }
  lineStart() {
    this.curve.lineStart();
  }
  lineEnd() {
    this.curve.lineEnd();
    this.context.lineTo(this.lastPoint.x, this.y);
    this.context.lineTo(this.firstPoint.x, this.y);
  }
  point(x: number, y: number) {
    if (this.isFirstPoint) {
      this.context.moveTo(x, this.y);
      this.context.lineTo(x, y);
      this.firstPoint = { x, y };
    }
    this.lastPoint = { x, y };
    this.curve.point(x, y);
    this.isFirstPoint = false;
  }
}
