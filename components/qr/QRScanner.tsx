"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Camera, CameraOff, Loader2 } from "lucide-react";
import QrScanner from "qr-scanner";

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
          onScan(result.data);
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
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
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