// types/recordrtc.d.ts
declare module "recordrtc" {
  interface RecordRTCOptions {
    type?: string;
    mimeType?: string;
    recorderType?: any;
    timeSlice?: number;
    desiredSampRate?: number;
    numberOfAudioChannels?: number;
    bufferSize?: number;
    audioBitsPerSecond?: number;
    ondataavailable?: (blob: Blob) => void;
  }

  class RecordRTC {
    constructor(stream: MediaStream, options?: RecordRTCOptions);
    startRecording(): void;
    stopRecording(): void;
    pauseRecording(): void;
    // بقیه متدهای مورد نیاز رو اینجا اضافه کن
  }

  namespace RecordRTC {
    var StereoAudioRecorder: any;
  }

  export = RecordRTC;
}
