import Visualizer from './Visualizer.ts';

const add = (a: number, b: number) => a + b;

export default class SpectrogramVisualizerSink extends Visualizer {
  process(analyser: AnalyserNode, drawContext: CanvasRenderingContext2D, width: number, height: number) {
    this.offset(-1, 0);

    const data = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(data);

    const imageData = drawContext.createImageData(1, height);


    const scale = data.length / height;

    for (let y = 0; y < height; y++) {
      const start = Math.floor(y * scale);
      const end = Math.ceil((y + 1) * scale);
      const values = data.slice(start, end);

      const percent = values.reduce(add) / values.length;

      const idx = (height - y) * 4;
      imageData.data[idx + 3] = percent;
    }

    drawContext.putImageData(imageData, width - 1, 0, 0, 0, width - 1, height);

    return true;
  }
}
