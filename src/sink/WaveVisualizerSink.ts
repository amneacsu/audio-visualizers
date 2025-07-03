import Visualizer from './Visualizer.ts';

export default class WaveVisualizerSink extends Visualizer {
  process(analyser: AnalyserNode, drawContext: CanvasRenderingContext2D, width: number, height: number) {
    this.clear();

    const b = analyser.frequencyBinCount;
    const fftSize = b * 2;

    const data = new Uint8Array(b * 2);
    analyser.getByteTimeDomainData(data);

    const sliceWidth = width / fftSize;

    drawContext.beginPath();

    let x = 0;

    for (let i = 0; i < fftSize; i++) {
      const v = data[i] / 128.0;
      const y = v * height / 2;

      if (i === 0) {
        drawContext.moveTo(x, y);
      } else {
        drawContext.lineTo(x, y);
      }

      x += sliceWidth;
    }

    drawContext.lineTo(width, height / 2);
    drawContext.stroke();

    return true;
  }
}
