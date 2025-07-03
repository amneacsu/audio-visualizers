export default class MicSource {
  constructor(context: AudioContext) {
    const node = context.createGain();

    navigator.mediaDevices.getUserMedia({ audio: true })
      .then((foo) => {
        const micNode = context.createMediaStreamSource(foo);
        micNode.connect(node);
      });

    return node;
  }
}
