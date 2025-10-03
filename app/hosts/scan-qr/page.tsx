"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  QrCode, 
  CheckCircle, 
  XCircle, 
  Camera, 
  User, 
  Calendar,
  Ticket,
  Clock,
  CameraOff
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { apiClient } from "@/lib/api/client";
import { toast } from "sonner";
import { QRScanner } from "@/components/qr/QRScanner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

interface Event {
  id: string;
  title: string;
  start_date: string;
  location: string;
}

interface AttendeeStats {
  total: number;
  checked_in: number;
  active: number;
  cancelled: number;
}

interface ScanResult {
  success: boolean;
  attendee?: {
    id: string;
    name: string;
    email: string;
    event: string;
    ticketType: string;
    qrCode: string;
    status: string;
    checkedInAt?: string;
  };
  message: string;
  timestamp: Date;
}

export default function ScanQRPage() {
  const [selectedEvent, setSelectedEvent] = useState("");
  const [manualQRInput, setManualQRInput] = useState("");
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [scanHistory, setScanHistory] = useState<ScanResult[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [stats, setStats] = useState<AttendeeStats>({ total: 0, checked_in: 0, active: 0, cancelled: 0 });
  const [loading, setLoading] = useState(true);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorModalMessage, setErrorModalMessage] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successData, setSuccessData] = useState<ScanResult | null>(null);

  // Load host events on component mount
  useEffect(() => {
    const loadEvents = async () => {
      try {
        const response = await apiClient.get<Event[]>("/hosts/me/events");
        setEvents(response);
      } catch (error) {
        console.error("Failed to load events:", error);
        toast.error("Failed to load your events");
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  // Load event stats when event is selected
  useEffect(() => {
    if (selectedEvent) {
      loadEventStats();
    }
  }, [selectedEvent]);

  const loadEventStats = async () => {
    if (!selectedEvent) return;

    try {
      const response = await apiClient.get<{ stats: AttendeeStats }>(`/hosts/me/events/${selectedEvent}/attendees`);
      setStats(response.stats);
    } catch (error) {
      console.error("Failed to load event stats:", error);
    }
  };

  const handleQRScan = async (qrCode: string) => {
    if (!selectedEvent) {
      setScanResult({
        success: false,
        message: "Please select an event first",
        timestamp: new Date(),
      });
      return;
    }

    try {
      const response = await apiClient.post<ScanResult>("/hosts/me/attendees/checkin", {
        qrCode,
        eventId: selectedEvent,
      });

      console.log("✅ Check-in API Response:", response);

      const result = {
        ...response,
        timestamp: new Date(response.timestamp),
      };

      setScanResult(result);
      setScanHistory(prev => [result, ...prev.slice(0, 9)]);

      if (result.success) {
        console.log("✅ Check-in successful for:", result.attendee?.name);
        // Show success with modal and toast
        toast.success("✅ Attendee checked in successfully!");
        setSuccessData(result);
        setShowSuccessModal(true);
        // Reload stats
        loadEventStats();
        // Auto-close success modal after 3 seconds
        setTimeout(() => {
          setShowSuccessModal(false);
        }, 3000);
      } else {
        console.log("❌ Check-in failed:", result.message);
        // Show error
        toast.error(result.message);
        setErrorModalMessage(result.message);
        setShowErrorModal(true);
      }
    } catch (error: any) {
      console.error("❌ Check-in API Error:", error);
      const result = {
        success: false,
        message: error.message || "Failed to check in attendee",
        timestamp: new Date(),
      };
      setScanResult(result);
      setScanHistory(prev => [result, ...prev.slice(0, 9)]);
      toast.error(result.message);
      setErrorModalMessage(result.message);
      setShowErrorModal(true);
    }
  };

  const handleCameraToggle = () => {
    setIsScanning(!isScanning);
  };

  const handleQRScanResult = (result: string) => {
    handleQRScan(result);
    // Optionally stop scanning after successful scan
    // setIsScanning(false);
  };

  const handleScanError = (error: string) => {
    const msg = `Camera error: ${error}`;
    toast.error(msg);
    setErrorModalMessage(msg);
    setShowErrorModal(true);
  };

  const handleManualScan = () => {
    if (manualQRInput.trim()) {
      handleQRScan(manualQRInput.trim());
      setManualQRInput("");
    }
  };

  const getSuccessRate = () => {
    if (scanHistory.length === 0) return 0;
    const successCount = scanHistory.filter(scan => scan.success).length;
    return Math.round((successCount / scanHistory.length) * 100);
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D72638] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your events...</p>
        </div>
      </div>
    );
  }

  return (
    <>
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Scan QR Code</h1>
          <p className="text-gray-600 mt-1">Check in attendees by scanning their ticket QR codes</p>
        </div>
      </div>

      {/* Event Selection */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base sm:text-lg">Select Event</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <Select value={selectedEvent} onValueChange={setSelectedEvent}>
            <SelectTrigger className="w-full h-12 text-sm sm:text-base touch-manipulation">
              <SelectValue placeholder="Choose the event you're checking in for" />
            </SelectTrigger>
            <SelectContent>
              {events.map(event => (
                <SelectItem key={event.id} value={event.id} className="py-3 text-sm sm:text-base">
                  {event.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {selectedEvent && (
        <>
          {/* QR Scanner Section */}
          <div className="space-y-4 sm:space-y-6 lg:grid lg:grid-cols-2 lg:gap-6 lg:space-y-0">
            {/* Camera Scanner */}
            <Card>
              <CardHeader className="pb-3 sm:pb-6">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <Camera className="w-4 h-4 sm:w-5 sm:h-5" />
                  Camera Scanner
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                <div className="aspect-square">
                  <QRScanner
                    onScan={handleQRScanResult}
                    onError={handleScanError}
                    isActive={isScanning}
                    className="w-full h-full"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handleCameraToggle}
                    className="flex-1 touch-manipulation text-white"
                    disabled={!selectedEvent}
                    size="sm"
                    style={{ backgroundColor: '#D72638', opacity: 1 }}
                  >
                    {isScanning ? (
                      <span className="inline-flex items-center justify-center">
                        <CameraOff className="w-4 h-4 mr-2 inline-block align-middle" />
                        <span className="align-middle leading-none">Stop Scanning</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center justify-center">
                        <Camera className="w-4 h-4 mr-2 inline-block align-middle" />
                        <span className="align-middle leading-none">Start Scanning</span>
                      </span>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Manual Entry */}
            <Card>
              <CardHeader className="pb-3 sm:pb-6">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <QrCode className="w-4 h-4 sm:w-5 sm:h-5" />
                  Manual Entry
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Enter QR Code
                    </label>
                    <Input
                      type="text"
                      placeholder="Type or paste QR code here..."
                      value={manualQRInput}
                      onChange={(e) => setManualQRInput(e.target.value)}
                      className="w-full touch-manipulation"
                    />
                  </div>
                  <Button
                    onClick={handleManualScan}
                    className="w-full text-white touch-manipulation"
                    disabled={!manualQRInput.trim() || !selectedEvent}
                    style={{ backgroundColor: '#D72638', opacity: 1 }}
                  >
                    Scan Code
                  </Button>
                  
                  {/* Insert Today's Stats and Recent Scans inside Manual Entry card */}
                  <div className="mt-6 space-y-4">
                    <Card>
                      <CardHeader className="pb-3 sm:pb-6">
                        <CardTitle className="text-base sm:text-lg">Today's Stats</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3 sm:space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600 text-sm">Total Attendees:</span>
                            <span className="font-semibold text-sm sm:text-base">{stats.total}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600 text-sm">Checked In:</span>
                            <span className="font-semibold text-green-600 text-sm sm:text-base">{stats.checked_in}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600 text-sm">Pending:</span>
                            <span className="font-semibold text-yellow-600 text-sm sm:text-base">{stats.active}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600 text-sm">Check-in Rate:</span>
                            <span className="font-semibold text-sm sm:text-base">{stats.total > 0 ? Math.round((stats.checked_in / stats.total) * 100) : 0}%</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3 sm:pb-6">
                        <CardTitle className="text-base sm:text-lg">Recent Scans</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {scanHistory.length === 0 ? (
                          <p className="text-gray-500 text-center py-4 text-sm">No scans yet</p>
                        ) : (
                          <div className="space-y-2 sm:space-y-3 max-h-64 overflow-y-auto">
                            {scanHistory.map((scan, index) => (
                              <div key={index} className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-gray-50 rounded-lg">
                                {scan.success ? (
                                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0" />
                                ) : (
                                  <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 flex-shrink-0" />
                                )}
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-xs sm:text-sm truncate">{scan.attendee?.name || 'Unknown'}</p>
                                  <p className="text-xs text-gray-600 truncate">{scan.message}</p>
                                </div>
                                <div className="flex items-center gap-1 text-xs text-gray-500 flex-shrink-0">
                                  <Clock className="w-3 h-3" />
                                  <span className="hidden sm:inline">{scan.timestamp.toLocaleTimeString()}</span>
                                  <span className="sm:hidden">{scan.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Quick Test section removed in production build - tests are not needed here */}
              </CardContent>
            </Card>
          </div>

          {/* Scan Result */}
          {scanResult && (
            <Card className={`border-2 ${scanResult.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
              <CardContent className="pt-4 sm:pt-6">
                <div className="flex items-start gap-3 sm:gap-4">
                  {scanResult.success ? (
                    <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 flex-shrink-0 mt-1" />
                  ) : (
                    <XCircle className="w-6 h-6 sm:w-8 sm:h-8 text-red-600 flex-shrink-0 mt-1" />
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className={`text-base sm:text-lg font-semibold ${scanResult.success ? 'text-green-800' : 'text-red-800'}`}>
                      {scanResult.success ? 'Check-in Successful!' : 'Check-in Failed'}
                    </h3>
                    <p className={`text-sm ${scanResult.success ? 'text-green-700' : 'text-red-700'} mb-3`}>
                      {scanResult.message}
                    </p>
                    
                    {scanResult.attendee && (
                      <div className="bg-white rounded-lg p-3 sm:p-4 space-y-2">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-500 flex-shrink-0" />
                          <span className="font-medium text-sm sm:text-base truncate">{scanResult.attendee.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-500 flex-shrink-0" />
                          <span className="text-xs sm:text-sm text-gray-600 truncate">{scanResult.attendee.event}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Ticket className="w-4 h-4 text-gray-500 flex-shrink-0" />
                          <span className="text-xs sm:text-sm text-gray-600">{scanResult.attendee.ticketType}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

            {/* moved stats and recent scans into the Manual Entry card */}
        </>
      )}
  </div>
  
  {/* Success modal - shows successful check-ins prominently */}
  <Dialog open={showSuccessModal} onOpenChange={(open) => setShowSuccessModal(open)}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-green-600">
            <CheckCircle className="w-6 h-6" />
            Check-in Successful!
          </DialogTitle>
        </DialogHeader>
        {successData?.attendee && (
          <div className="space-y-4 py-4">
            <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
              <User className="w-10 h-10 text-green-600 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-lg text-green-900">{successData.attendee.name}</p>
                <p className="text-sm text-green-700">{successData.attendee.email}</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Event:</span>
                <span className="font-medium text-gray-900">{successData.attendee.event}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Ticket Type:</span>
                <span className="font-medium text-gray-900">{successData.attendee.ticketType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className="font-medium text-green-600">Checked In</span>
              </div>
            </div>
          </div>
        )}
        <DialogFooter>
          <Button 
            onClick={() => setShowSuccessModal(false)} 
            className="w-full bg-green-600 hover:bg-green-700 text-white"
          >
            Continue Scanning
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

  {/* Error modal - shows scan/camera errors so user doesn't miss them */}
  <Dialog open={showErrorModal} onOpenChange={(open) => setShowErrorModal(open)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Error</DialogTitle>
          <DialogDescription>{errorModalMessage}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose className="bg-[#D72638] text-white px-4 py-2 rounded">Close</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  );
}