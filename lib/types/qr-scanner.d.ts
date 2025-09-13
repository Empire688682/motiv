declare module "qr-scanner" {
  export default class QrScanner {
    constructor(
      video: HTMLVideoElement,
      onDecode: (result: string) => void,
      options?: any
    );

    start(): Promise<void>;
    stop(): void;
    destroy(): void;
    static scanImage(
      imageOrFileOrBlob: HTMLImageElement | File | Blob,
      options?: any,
      workerPath?: string
    ): Promise<string>;
  }
}
