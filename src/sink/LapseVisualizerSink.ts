import Visualizer from './Visualizer.ts';

export default class LapseVisualizerSink extends Visualizer {
  process(analyser: AnalyserNode, drawContext: CanvasRenderingContext2D, width: number, height: number) {
    const data = new Uint8Array(analyser.frequencyBinCount * 2);
    analyser.getByteTimeDomainData(data);

    this.offset(-1, 0);

    const peak = data.reduce((a, b) => a + b) / data.length;

    const percent = (peak - 128) / 128;
    const value = height * percent * 20;
    const offset = (height - value) / 2;

    drawContext.fillRect(width - 2, offset, 1, value);

    return true;
  }
}
