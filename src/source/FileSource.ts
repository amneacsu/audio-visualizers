export default class FileSource {
  constructor(context: AudioContext, path: string) {
    const source = context.createBufferSource();

    fetch(path)
      .then(response => response.arrayBuffer())
      .then(data => context.decodeAudioData(data))
      .then(buffer => {
        source.buffer = buffer;
        source.start();
      });

    return source;
  }
}
