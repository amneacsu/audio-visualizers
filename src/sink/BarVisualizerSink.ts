import Visualizer from './Visualizer.ts';

export default class BarVisualizerSink extends Visualizer {
  process(analyser: AnalyserNode, drawContext: CanvasRenderingContext2D, width: number, height: number) {
    this.clear();

    const data = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(data);

    const barWidth = width / data.length;

    for (let f = 0; f < data.length; f++) {
      const value = data[f];

      const percent = value / 256;
      const h = height * percent;
      const offset = height - h;

      drawContext.fillRect(f * barWidth, offset, barWidth + 1, h);
    }

    return true;
  }
}
