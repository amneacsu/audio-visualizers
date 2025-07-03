import * as React from 'react';

import { useAudioContext } from './AudioContextProvider.tsx';

export type VisualizerStyle = 'bar' | 'wave' | 'lapse' | 'spectrogram' | 'spectrum';

type GraphData = {
  nodes: ({
    id: string;
  } & (
    | {
      type: 'AudioElement';
      values: {
        src: string;
      };
    }
    | {
      type: 'Visualizer';
      values: {
        style: VisualizerStyle;
      };
    }
  ))[];
  edges: {
    from: string;
    to: string;
  }[];
};

const graphData: GraphData = {
  nodes: [
    {
      id: 'source1',
      type: 'AudioElement',
      values: {
        src: './audio/bee-moved.flac',
      },
    },
    {
      id: 'sink1',
      type: 'Visualizer',
      values: {
        style: 'bar',
      },
    },
    {
      id: 'sink2',
      type: 'Visualizer',
      values: {
        style: 'wave',
      },
    },
    {
      id: 'sink3',
      type: 'Visualizer',
      values: {
        style: 'lapse',
      },
    },
    {
      id: 'sink4',
      type: 'Visualizer',
      values: {
        style: 'spectrogram',
      },
    },
    {
      id: 'sink5',
      type: 'Visualizer',
      values: {
        style: 'spectrum',
      },
    },
  ],
  edges: [
    { from: 'source1', to: 'destination' },
    { from: 'source1', to: 'sink1' },
    { from: 'source1', to: 'sink2' },
    { from: 'source1', to: 'sink3' },
    { from: 'source1', to: 'sink4' },
    { from: 'source1', to: 'sink5' },
  ],
};

class AudioGraphLoader {
  audioContext: AudioContext;

  constructor(audioContext: AudioContext) {
    this.audioContext = audioContext;
  }

  load(data: GraphData) {
    const nodes = data.nodes.map((nodeData) => {
      return this.createNode(nodeData);
    });

    const edges = data.edges.map((edgeData) => {
      const { from, to } = edgeData;

      const fromNode = nodes.find((node) => node.id === from);
      if (fromNode?.node) {
        if (to === 'destination') {
          fromNode.node.connect(this.audioContext.destination);
        } else {
          const toNode = nodes.find((node) => node.id === to);
          if (toNode) {
            fromNode.node.connect(toNode.node);
          }
        }
      }

      return edgeData;
    });

    return { nodes, edges };
  }

  createNode(nodeData: GraphData['nodes'][0]) {
    switch (nodeData.type) {
      case 'AudioElement':
        const audio = document.createElement('audio');
        audio.controls = true;
        audio.src = nodeData.values.src;
        const mediaSource = this.audioContext.createMediaElementSource(audio);

        const handlePlay = () => {
          this.audioContext.resume();
          audio.removeEventListener('play', handlePlay);
        };

        audio.addEventListener('play', handlePlay);

        return {
          id: nodeData.id,
          audio,
          node: mediaSource,
          type: 'AudioElement' as const,
        };
      case 'Visualizer':
        const analyser = this.audioContext.createAnalyser();

        return {
          id: nodeData.id,
          node: analyser,
          type: 'Visualizer' as const,
          style: nodeData.values.style,
        };
    }
  }
}

const loadGraph = (audioContext: AudioContext, data: GraphData) => {
  const loader = new AudioGraphLoader(audioContext);
  return loader.load(data);
};

export const useAudioGraph = () => {
  const { audioContext } = useAudioContext();

  return React.useMemo(() => {
    return loadGraph(audioContext, graphData);
  }, [audioContext]);
};
