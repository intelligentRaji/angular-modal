import BaseComponent from '@components/baseComponent';

interface CanvasProps {
  classNames: string[];
  width: number;
  height: number;
}

class Canvas extends BaseComponent<'canvas'> {
  protected context: CanvasRenderingContext2D | null;
  constructor({ classNames, width, height }: CanvasProps) {
    super({ tagName: 'canvas', classNames });
    this.context = this.node.getContext('2d');
    this.node.width = width;
    this.node.height = height;
  }

  protected setLineProperties(color: string, width: number, cap?: CanvasLineCap) {
    if (this.context) {
      this.context.strokeStyle = color;
      this.context.lineWidth = width;
      this.context.lineCap = cap ?? 'butt';
    }
  }

  protected drawLine(x1: number, y1: number, x2: number, y2: number) {
    if (this.context) {
      this.context.beginPath();
      this.context.moveTo(x1, y1);
      this.context.lineTo(x2, y2);
      this.context.stroke();
    }
  }

  protected drawCircle(x: number, y: number, radius: number) {
    if (this.context) {
      this.context.beginPath();
      this.context.arc(x, y, radius, 0, 2 * Math.PI);
      this.context.stroke();
    }
  }

  protected clearCanvas() {
    if (this.context) {
      this.context.clearRect(0, 0, this.node.width, this.node.height);
    }
  }
}

export default Canvas;
