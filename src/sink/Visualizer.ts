export default abstract class Visualizer {
  analyser: AnalyserNode;
  drawContext: CanvasRenderingContext2D;
  width = 960;
  height = 100;
  fftSize = 2048;
  label = '';

  constructor(audioContext: AudioContext, canvas: HTMLCanvasElement, analyser: AnalyserNode) {
    const canvasContext = canvas.getContext('2d')!;
    canvasContext.lineWidth = 1;
    canvasContext.strokeStyle = '#3D3B1A';
    canvasContext.fillStyle = '#3D3B1A';
    canvasContext.font = '10px monospace';
    canvasContext.textAlign = 'right';
    this.drawContext = canvasContext;

    this.analyser = analyser;
    this.analyser.fftSize = this.fftSize;
    this.analyser.smoothingTimeConstant = 0;

    this.tick();
  }

  offset(x: number, y: number) {
    const imageData = this.drawContext.getImageData(x * -1, y, this.width + x, this.height - y);
    this.drawContext.putImageData(imageData, 0, 0);
  }

  clear() {
    this.drawContext.clearRect(0, 0, this.width, this.height);
    this.drawContext.fillText(this.label, this.width - 4, 11);
  }

  abstract process(analyser: AnalyserNode, canvasContext: CanvasRenderingContext2D, width: number, height: number): boolean;

  tick() {
    const keep = this.process(
      this.analyser,
      this.drawContext,
      this.width,
      this.height,
    );

    if (keep) {
      window.requestAnimationFrame(() => {
        this.tick();
      });
    }
  }
}
