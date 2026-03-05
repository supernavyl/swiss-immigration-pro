/**
 * AudioWorklet processor for capturing mic input and downsampling to 16kHz.
 * Runs in a dedicated audio thread for low-latency capture.
 *
 * Outputs:
 *   - Float32 PCM chunks (via postMessage to main thread)
 *   - Silence detection events (800ms threshold)
 */

const TARGET_SAMPLE_RATE = 16000;
const SILENCE_THRESHOLD = 0.01; // RMS energy below this = silence
const SILENCE_DURATION_MS = 800;

class VoiceCaptureProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this._silenceStart = 0;
    this._isSilent = false;
    this._silenceNotified = false;
  }

  process(inputs) {
    const input = inputs[0];
    if (!input || !input[0] || input[0].length === 0) {
      return true;
    }

    const channelData = input[0]; // mono

    // Compute RMS for silence detection
    let sumSquares = 0;
    for (let i = 0; i < channelData.length; i++) {
      sumSquares += channelData[i] * channelData[i];
    }
    const rms = Math.sqrt(sumSquares / channelData.length);

    // Downsample from AudioContext rate (typically 48kHz) to 16kHz
    const ratio = sampleRate / TARGET_SAMPLE_RATE;
    const outputLength = Math.floor(channelData.length / ratio);
    const downsampled = new Float32Array(outputLength);

    for (let i = 0; i < outputLength; i++) {
      const srcIndex = i * ratio;
      const index = Math.floor(srcIndex);
      const frac = srcIndex - index;

      // Linear interpolation
      const a = channelData[index] || 0;
      const b = channelData[Math.min(index + 1, channelData.length - 1)] || 0;
      downsampled[i] = a + frac * (b - a);
    }

    // Send audio data to main thread
    this.port.postMessage({
      type: 'audio',
      data: downsampled.buffer,
      rms: rms,
    }, [downsampled.buffer]);

    // Silence detection
    const now = currentTime * 1000; // convert to ms
    if (rms < SILENCE_THRESHOLD) {
      if (!this._isSilent) {
        this._isSilent = true;
        this._silenceStart = now;
        this._silenceNotified = false;
      } else if (!this._silenceNotified && (now - this._silenceStart) >= SILENCE_DURATION_MS) {
        this.port.postMessage({ type: 'silence' });
        this._silenceNotified = true;
      }
    } else {
      this._isSilent = false;
      this._silenceNotified = false;
    }

    return true;
  }
}

registerProcessor('voice-capture-processor', VoiceCaptureProcessor);
