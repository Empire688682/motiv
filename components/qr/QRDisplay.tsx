"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { QrCode, Download, Share2, Copy } from "lucide-react";
import { toast } from "sonner";

interface QRDisplayProps {
  qrCodeUrl: string;
  ticketId: string;
  eventTitle: string;
  className?: string;
}

export function QRDisplay({ qrCodeUrl, ticketId, eventTitle, className = "" }: QRDisplayProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const downloadQRCode = () => {
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = `ticket-${ticketId}-qr.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('QR code downloaded successfully!');
  };

  const shareQRCode = async () => {
    if (navigator.share) {
      try {
        // Convert base64 to blob for sharing
        const response = await fetch(qrCodeUrl);
        const blob = await response.blob();
        const file = new File([blob], `ticket-${ticketId}-qr.png`, { type: 'image/png' });
        
        await navigator.share({
          title: `Ticket QR Code - ${eventTitle}`,
          text: `My ticket QR code for ${eventTitle}`,
          files: [file]
        });
      } catch (error) {
        // Fallback to copying image URL
        copyQRCode();
      }
    } else {
      copyQRCode();
    }
  };

  const copyQRCode = async () => {
    try {
      // Copy the image to clipboard
      const response = await fetch(qrCodeUrl);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ]);
      toast.success('QR code copied to clipboard!');
    } catch (error) {
      // Fallback to copying the data URL
      try {
        await navigator.clipboard.writeText(qrCodeUrl);
        toast.success('QR code data copied to clipboard!');
      } catch (fallbackError) {
        toast.error('Failed to copy QR code');
      }
    }
  };

  return (
    <>
      <div className={`cursor-pointer ${className}`} onClick={() => setIsModalOpen(true)}>
        <div className="bg-white p-3 sm:p-4 rounded-lg border-2 border-gray-200 mb-3 sm:mb-4 hover:border-[#D72638] transition-colors">
          {qrCodeUrl ? (
            <img 
              src={qrCodeUrl} 
              alt="Ticket QR Code" 
              className="w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48"
            />
          ) : (
            <div className="w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 flex items-center justify-center bg-gray-100 rounded">
              <QrCode className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-gray-400" />
            </div>
          )}
        </div>
        <p className="text-xs text-gray-500 text-center max-w-[200px] px-2">
          Tap to enlarge • Show this QR code at the event entrance
        </p>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">Ticket QR Code</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center space-y-4">
            <div className="bg-white p-6 rounded-lg border-2 border-gray-200">
              <img 
                src={qrCodeUrl} 
                alt="Ticket QR Code" 
                className="w-64 h-64"
              />
            </div>
            <p className="text-sm text-gray-600 text-center">
              {eventTitle}
            </p>
            <div className="flex gap-2 w-full">
              <Button
                onClick={downloadQRCode}
                variant="outline"
                size="sm"
                className="flex-1"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button
                onClick={shareQRCode}
                variant="outline"
                size="sm"
                className="flex-1"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button
                onClick={copyQRCode}
                variant="outline"
                size="sm"
                className="flex-1"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}