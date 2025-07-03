import * as React from 'react';

import Visualizer from './sink/Visualizer.ts';
import { useAudioContext } from './AudioContextProvider.tsx';

export const VisualSink = ({
  analyser,
  processor,
}: {
  analyser: AnalyserNode;
  processor: { new (audioCtx: AudioContext, canvasElement: HTMLCanvasElement, analyser: AnalyserNode): Visualizer; };
}) => {
  const { audioContext } = useAudioContext();
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    if (!audioContext) return;
    const canvas = canvasRef.current;
    if (!canvas) {
      console.warn('no canvas');
      return;
    }
    new processor(audioContext, canvas, analyser);
  }, [audioContext, processor, analyser]);

  return (
    <canvas
      ref={canvasRef}
      width={960}
      height={100}
    />
  );
};
