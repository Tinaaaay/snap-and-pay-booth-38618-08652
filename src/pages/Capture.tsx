import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Camera, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const Capture = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const photoCount = location.state?.photoCount || 4;
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [selectedFilter, setSelectedFilter] = useState("No Filter");
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([]);
  const [isCapturing, setIsCapturing] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);

  const filters = ["No Filter", "B&W", "Sepia", "Vintage", "Soft", "Noir", "Vivid"];

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: "user", 
          width: { ideal: 1280 }, 
          height: { ideal: 720 },
          aspectRatio: { ideal: 2.5 } // Match final output aspect ratio (400:160)
        },
        audio: false,
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      toast.error("Unable to access camera. Please check permissions.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;

    const canvas = document.createElement("canvas");
    const targetAspect = 2.5; // 400:160 ratio
    const videoAspect = videoRef.current.videoWidth / videoRef.current.videoHeight;
    
    // Calculate crop dimensions to match target aspect ratio
    let sourceWidth, sourceHeight, sourceX, sourceY;
    if (videoAspect > targetAspect) {
      // Video is wider - crop sides
      sourceHeight = videoRef.current.videoHeight;
      sourceWidth = sourceHeight * targetAspect;
      sourceX = (videoRef.current.videoWidth - sourceWidth) / 2;
      sourceY = 0;
    } else {
      // Video is taller - crop top/bottom
      sourceWidth = videoRef.current.videoWidth;
      sourceHeight = sourceWidth / targetAspect;
      sourceX = 0;
      sourceY = (videoRef.current.videoHeight - sourceHeight) / 2;
    }
    
    canvas.width = sourceWidth;
    canvas.height = sourceHeight;
    const ctx = canvas.getContext("2d");
    
    if (ctx) {
      ctx.drawImage(videoRef.current, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, sourceWidth, sourceHeight);
      const photoData = canvas.toDataURL("image/png");
      setCapturedPhotos((prev) => [...prev, photoData]);
    }
  };

  const startCaptureSequence = async () => {
    setIsCapturing(true);
    const collectedPhotos: string[] = [];

    for (let i = 0; i < photoCount; i++) {
      // Countdown
      for (let count = 3; count > 0; count--) {
        setCountdown(count);
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
      setCountdown(null);
      
      // Capture photo and collect it
      if (!videoRef.current) continue;
      
      const canvas = document.createElement("canvas");
      const targetAspect = 2.5; // 400:160 ratio
      const videoAspect = videoRef.current.videoWidth / videoRef.current.videoHeight;
      
      // Calculate crop dimensions to match target aspect ratio
      let sourceWidth, sourceHeight, sourceX, sourceY;
      if (videoAspect > targetAspect) {
        // Video is wider - crop sides
        sourceHeight = videoRef.current.videoHeight;
        sourceWidth = sourceHeight * targetAspect;
        sourceX = (videoRef.current.videoWidth - sourceWidth) / 2;
        sourceY = 0;
      } else {
        // Video is taller - crop top/bottom
        sourceWidth = videoRef.current.videoWidth;
        sourceHeight = sourceWidth / targetAspect;
        sourceX = 0;
        sourceY = (videoRef.current.videoHeight - sourceHeight) / 2;
      }
      
      canvas.width = sourceWidth;
      canvas.height = sourceHeight;
      const ctx = canvas.getContext("2d");
      
      if (ctx) {
        ctx.drawImage(videoRef.current, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, sourceWidth, sourceHeight);
        const photoData = canvas.toDataURL("image/png");
        collectedPhotos.push(photoData);
        setCapturedPhotos([...collectedPhotos]); // Update UI
        toast.success(`Photo ${i + 1} captured!`);
      }
      
      if (i < photoCount - 1) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    setIsCapturing(false);
    
    // Navigate to customize with all collected photos
    setTimeout(() => {
      stopCamera();
      navigate("/customize", { state: { photos: collectedPhotos } });
    }, 1000);
  };

  const getFilterClass = () => {
    switch (selectedFilter) {
      case "B&W":
        return "grayscale";
      case "Sepia":
        return "sepia";
      case "Vintage":
        return "contrast-125 saturate-150 hue-rotate-15";
      case "Soft":
        return "brightness-110 contrast-90";
      case "Noir":
        return "grayscale contrast-150";
      case "Vivid":
        return "saturate-150 contrast-110";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-soft flex flex-col">
      {/* Header */}
      <div className="p-4 sm:p-6 flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => {
            stopCamera();
            navigate("/photo-count");
          }}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Back</span>
        </Button>
        <h1 className="text-xl sm:text-2xl font-bold text-foreground">KodaSnap</h1>
        <div className="w-16 sm:w-20" />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:flex-row items-center justify-center p-4 gap-4 lg:gap-8">
        {/* Camera feed */}
        <div className="relative w-full lg:w-auto">
          <div className="relative rounded-3xl overflow-hidden shadow-soft bg-black max-w-2xl mx-auto" style={{ aspectRatio: '2.5/1' }}>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover ${getFilterClass()}`}
            />
            
            {/* Countdown overlay */}
            {countdown && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <span className="text-9xl font-bold text-white animate-pulse">
                  {countdown}
                </span>
              </div>
            )}

            {/* Camera controls overlay */}
            <div className="absolute top-4 right-4 flex gap-2">
              <Button variant="secondary" size="icon" className="rounded-full bg-white/90">
                <Camera className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Start capture button */}
          {!isCapturing && capturedPhotos.length === 0 && (
            <div className="mt-4 sm:mt-6 text-center">
              <Button
                size="lg"
                onClick={startCaptureSequence}
                className="px-8 sm:px-12 py-5 sm:py-6 rounded-full shadow-glow hover:shadow-soft transition-all"
              >
                Start Capture
              </Button>
            </div>
          )}
        </div>

        {/* Photo preview sidebar */}
        <div className="space-y-4 w-full lg:w-auto">
          <h3 className="font-semibold text-foreground text-center">
            {capturedPhotos.length > 0 ? "Captured Photos" : "Waiting for capture"}
          </h3>
          <div className="flex flex-row lg:flex-col gap-3 justify-center flex-wrap">
            {[...Array(photoCount)].map((_, i) => (
              <div
                key={i}
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-xl bg-white/60 backdrop-blur-sm shadow-soft overflow-hidden"
              >
                {capturedPhotos[i] ? (
                  <img
                    src={capturedPhotos[i]}
                    alt={`Captured ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                    Waiting
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filter selection */}
      <div className="p-4 sm:p-6 bg-white/60 backdrop-blur-sm">
        <p className="text-center font-medium text-foreground mb-3 text-sm sm:text-base">
          Choose a filter for your photos!
        </p>
        <div className="flex gap-2 justify-center flex-wrap">
          {filters.map((filter) => (
            <Button
              key={filter}
              variant={selectedFilter === filter ? "default" : "outline"}
              onClick={() => setSelectedFilter(filter)}
              className="rounded-full"
            >
              {filter}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Capture;
