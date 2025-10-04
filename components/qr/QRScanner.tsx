"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Camera, CameraOff, Loader2 } from "lucide-react";
import QrScanner from "qr-scanner";

// Ensure the worker path is set so the library can load its WebWorker in the browser.
// Using the unpkg CDN for the exact package version installed in package.json (qr-scanner@1.4.2).
// This avoids needing to copy the worker file into `public/`.
try {
  // @ts-ignore - the library exposes a static WORKER_PATH property
  QrScanner.WORKER_PATH = "https://unpkg.com/qr-scanner@1.4.2/qr-scanner-worker.min.js";
} catch (e) {
  // swallow; the library will error later if worker can't be loaded
  // console.warn('Failed to set QrScanner.WORKER_PATH', e);
}

interface QRScannerProps {
  onScan: (result: string) => void;
  onError?: (error: string) => void;
  isActive: boolean;
  className?: string;
}

export function QRScanner({ onScan, onError, isActive, className = "" }: QRScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const qrScannerRef = useRef<QrScanner | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasCamera, setHasCamera] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lastScanRef = useRef<string>("");
  const lastScanTimeRef = useRef<number>(0);
  const isProcessingRef = useRef<boolean>(false);

  useEffect(() => {
    // Check if camera is available
    QrScanner.hasCamera().then(setHasCamera);
  }, []);

  useEffect(() => {
    if (!videoRef.current || !hasCamera) return;

    if (isActive) {
      startScanning();
    } else {
      stopScanning();
    }

    return () => {
      stopScanning();
    };
  }, [isActive, hasCamera]);

  const startScanning = async () => {
    if (!videoRef.current || qrScannerRef.current) return;

    setIsLoading(true);
    setError(null);

    try {
      const qrScanner = new QrScanner(
        videoRef.current,
        (result) => {
          const now = Date.now();
          const timeSinceLastScan = now - lastScanTimeRef.current;
          
          // Prevent duplicate scans: same code within 3 seconds OR still processing
          if (isProcessingRef.current) {
            console.log('⏸️ QR Scan: Already processing, ignoring...');
            return;
          }
          
          if (result.data === lastScanRef.current && timeSinceLastScan < 3000) {
            console.log('⏸️ QR Scan: Duplicate scan ignored (within 3s)');
            return;
          }
          
          // Mark as processing to prevent concurrent scans
          isProcessingRef.current = true;
          lastScanRef.current = result.data;
          lastScanTimeRef.current = now;
          
          console.log('📸 QR Scan: Processing new scan:', result.data);
          
          // Pause scanner temporarily
          if (qrScannerRef.current) {
            qrScannerRef.current.pause();
          }
          
          // Call the onScan callback
          onScan(result.data);
          
          // Resume scanner after 2 seconds
          setTimeout(() => {
            if (qrScannerRef.current && isActive) {
              qrScannerRef.current.start();
            }
            isProcessingRef.current = false;
            console.log('▶️ QR Scanner: Resumed and ready for next scan');
          }, 2000);
        },
        {
          highlightScanRegion: true,
          highlightCodeOutline: true,
          preferredCamera: 'environment', // Use back camera on mobile
        }
      );

      qrScannerRef.current = qrScanner;
      await qrScanner.start();
      setIsLoading(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to start camera';
      setError(errorMessage);
      onError?.(errorMessage);
      setIsLoading(false);
    }
  };

  const stopScanning = () => {
    if (qrScannerRef.current) {
      qrScannerRef.current.stop();
      qrScannerRef.current.destroy();
      qrScannerRef.current = null;
    }
    isProcessingRef.current = false;
    lastScanRef.current = "";
    lastScanTimeRef.current = 0;
    setIsLoading(false);
  };

  if (!hasCamera) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 ${className}`}>
        <div className="text-center p-6">
          <CameraOff className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">No camera available</p>
          <p className="text-sm text-gray-500">
            Please ensure your device has a camera and you've granted camera permissions
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative bg-black rounded-lg overflow-hidden ${className}`}>
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        playsInline
        muted
      />
      
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="text-center text-white">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-red-500" />
            <p>Starting camera...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-900 bg-opacity-90">
          <div className="text-center text-white p-4">
            <CameraOff className="w-8 h-8 mx-auto mb-2" />
            <p className="font-medium mb-2">Camera Error</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}

      {!isActive && !isLoading && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75">
          <div className="text-center text-white">
            <Camera className="w-12 h-12 mx-auto mb-4" />
            <p>Camera ready</p>
          </div>
        </div>
      )}
    </div>
  );
}