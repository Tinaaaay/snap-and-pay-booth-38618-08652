import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Download, RotateCcw, Home } from "lucide-react";
import { toast } from "sonner";

const DownloadPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { photos, customization } = location.state || {};

  const handleDownload = () => {
    toast.success("Your photo strip has been downloaded!");
    // In a real app, this would trigger an actual download
  };

  const handleRetake = () => {
    navigate("/capture");
  };

  const handleHome = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-soft flex flex-col">
      {/* Header */}
      <div className="p-6 flex items-center justify-center">
        <h1 className="text-2xl font-bold text-foreground">KodaSnap</h1>
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-4xl w-full space-y-8">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full animate-bounce">
              <Download className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-4xl font-bold text-foreground">
              Your Photos Are Ready!
            </h2>
            <p className="text-lg text-muted-foreground">
              Download your customized photo strip and share the memories
            </p>
          </div>

          {/* Final preview */}
          <div className="flex justify-center">
            <div
              className="bg-white rounded-3xl p-8 shadow-soft max-w-md"
              style={{
                borderColor: customization?.frame || "#F472B6",
                borderWidth: "12px",
              }}
            >
              <div className="space-y-3">
                {photos?.slice(0, 4).map((photo: string, index: number) => (
                  <div
                    key={index}
                    className={`relative overflow-hidden ${
                      customization?.shape === "circle"
                        ? "rounded-full"
                        : "rounded-xl"
                    }`}
                  >
                    <img
                      src={photo}
                      alt={`Photo ${index + 1}`}
                      className="w-full h-40 object-cover"
                    />
                    {customization?.stickers?.map((sticker: string, i: number) => (
                      <span
                        key={i}
                        className="absolute text-4xl"
                        style={{
                          top: `${20 + i * 15}%`,
                          right: `${10 + i * 10}%`,
                        }}
                      >
                        {sticker}
                      </span>
                    ))}
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center space-y-1">
                <p className="text-sm text-muted-foreground font-medium">
                  KodaSnap
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date().toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-2xl mx-auto">
            <Button
              size="lg"
              onClick={handleDownload}
              className="flex-1 py-6 rounded-full shadow-glow hover:shadow-soft transition-all gap-2"
            >
              <Download className="w-5 h-5" />
              Download
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={handleRetake}
              className="flex-1 py-6 rounded-full gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              Retake
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={handleHome}
              className="flex-1 py-6 rounded-full gap-2"
            >
              <Home className="w-5 h-5" />
              Home
            </Button>
          </div>

          {/* Footer info */}
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Thank you for using KodaSnap! 💖
            </p>
            <p className="text-xs text-muted-foreground">
              Your photos are saved locally and never uploaded to any server
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DownloadPage;
