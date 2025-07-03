import * as React from 'react';
import { createRoot } from 'react-dom/client';

import BarVisualizerSink from './sink/BarVisualizerSink.ts';
import WaveVisualizerSink from './sink/WaveVisualizerSink.ts';
import LapseVisualizerSink from './sink/LapseVisualizerSink.ts';
import SpectrogramVisualizerSink from './sink/SpectrogramVisualizerSink.ts';
import SpectrumVisualizerSink from './sink/SpectrumVisualizerSink.ts';
import { AudioContextProvider } from './AudioContextProvider.tsx';
import { useAudioGraph, VisualizerStyle } from './AudioGraph.ts';
import { VisualSink } from './VisualSink.tsx';
import './style.css';

const root = createRoot(document.getElementById('root')!);

const fileOptions = [
  {
    value: './audio/bee-moved.flac',
    label: 'Blue Monday FM - Bee Moved (flac, 96000 Hz, stereo)',
  },
  {
    value: './audio/surround.mp4',
    label: 'Fraunhofer BLITS test pattern (aac, 44100 Hz, 5.1, 319 kb/s)',
  },
  {
    value: './audio/axle-grinder.m4a',
    label: 'Pendulum - Axle Grinder (spectrogram drawing @3:52, aac, 44100 Hz, stereo, 125 kb/s)',
  },
  {
    value: './audio/modem.mp3',
    label: 'Dial-up modem (mp3, 48000 Hz, stereo, 84 kb/s)',
  },
  {
    value: './audio/Manic_Miner.wav',
    label: 'Manic_Miner.wav (ZX spectrum tape, pcm_u8, 44100 Hz, 1 channels, 352 kb/s)',
  },
  {
    value: './audio/easy-street.opus',
    label: 'easy-street.opus (opus, 48000Hz, stereo)',
  },
];

const fileIdToOption = (id: string | undefined) => {
  return fileOptions.find((o) => o.value === id);
};

const AudioElementNode = ({
  audio,
}: {
  audio: HTMLAudioElement;
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [selectedFileId, setSelectedFileId] = React.useState(() => {
    return fileOptions.find((option) => option.value === audio.src)?.value;
  });

  React.useEffect(() => {
    const div = containerRef.current;
    if (!div) return undefined;
    div.appendChild(audio);
    return () => {
      div.removeChild(audio);
    };
  }, [audio]);

  const handleChangeSelectedFile = React.useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedFileId(event.target.value);
    const currentFile = fileIdToOption(event.target.value);
    if (!currentFile) throw new Error('No such file');
    audio.src = currentFile?.value;
  }, [audio]);

  return (
    <>
      <fieldset>
        <legend>Audio file</legend>

        <select
          onChange={handleChangeSelectedFile}
          value={selectedFileId}
        >
          {fileOptions.map((fileOption) => {
            return (
              <option key={fileOption.value} value={fileOption.value}>{fileOption.label}</option>
            );
          })}
        </select>
      </fieldset>

      <div ref={containerRef} />
    </>
  );
};

const getProcessor = (style: VisualizerStyle) => {
  switch (style) {
    case 'bar':
      return BarVisualizerSink;
    case 'wave':
      return WaveVisualizerSink;
    case 'lapse':
      return LapseVisualizerSink;
    case 'spectrogram':
      return SpectrogramVisualizerSink;
    case 'spectrum':
      return SpectrumVisualizerSink;
    default:
      return null;
  }
};

const App = () => {
  const graph = useAudioGraph();

  return (
    <div className="grid">
      {graph.nodes.map((node) => {
        switch (node.type) {
          case 'AudioElement':
            return (
              <AudioElementNode
                key={node.id}
                audio={node.audio}
              />
            );
          case 'Visualizer':
            const visualizer = getProcessor(node.style);
            if (!visualizer) return null;
            return (
              <VisualSink
                key={node.id}
                processor={visualizer}
                analyser={node.node}
              />
            );
          default:
            return null;
        }
      })}
    </div>
  );
};

root.render(
  <AudioContextProvider>
    <App />
  </AudioContextProvider>,
);
