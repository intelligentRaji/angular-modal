import Canvas from '@components/canvas';

class Gallows extends Canvas {
  private drawingSteps: (() => void)[];

  constructor() {
    super(400, 300);
    this.addClass('gallows');
    this.setLineProperties('black', 5, 'round');

    this.drawGallows();
    this.drawingSteps = [
      () => {
        this.drawCircle(260, 100, 20);
      },
      () => {
        this.drawLine(260, 120, 260, 180);
      },
      () => {
        this.drawLine(260, 140, 280, 160);
      },
      () => {
        this.drawLine(260, 140, 240, 160);
      },
      () => {
        this.drawLine(260, 180, 240, 200);
      },
      () => {
        this.drawLine(260, 180, 280, 200);
      },
    ];
  }

  private drawGallows() {
    this.drawLine(40, 240, 360, 240);
    this.drawLine(80, 239, 80, 42);
    this.drawLine(80, 41, 260, 40);
    this.drawLine(80, 80, 120, 42);
    this.drawLine(260, 40, 260, 80);
  }

  public drawStep(step: number) {
    const currentStep = this.drawingSteps[step - 1];
    if (currentStep) currentStep();
  }

  public getNumberOfDrawingSteps(): number {
    return this.drawingSteps.length;
  }

  public newDraw() {
    this.clearCanvas();
    this.drawGallows();
  }
}

export default Gallows;
