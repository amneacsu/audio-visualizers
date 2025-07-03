export default class LowPassFilter {
  constructor(context: AudioContext, cutoff: number) {
    const filter = context.createBiquadFilter();

    filter.type = 'lowpass';
    filter.frequency.value = cutoff;

    return filter;
  }
}
