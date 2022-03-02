declare module "node-rtsp-recorder" {
  export function Recorder(options: {
    url: string,
    timeLimit: number,
    folder: string,
    name: string,
    directoryPathFormat: string,
  }): void;
  export function startRecording(): void;

  export type Recorder = typeof Recorder;
}
