import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Camera } from "lucide-react";

const PhotoCount = () => {
  const navigate = useNavigate();
  const [selectedCount, setSelectedCount] = useState(4);

  const photoOptions = [1, 2, 3, 4, 5, 6];

  const handleContinue = () => {
    navigate("/capture", { state: { photoCount: selectedCount } });
  };

  return (
    <div className="min-h-screen bg-gradient-soft flex flex-col">
      {/* Header */}
      <div className="p-4 sm:p-6 flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => navigate("/payment")}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Back</span>
        </Button>
        <h1 className="text-xl sm:text-2xl font-bold text-foreground">KodaSnap</h1>
        <div className="w-16 sm:w-20" />
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="max-w-2xl w-full space-y-6 sm:space-y-8">
          <div className="text-center space-y-3 sm:space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-primary/10 rounded-full">
              <Camera className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold text-foreground">
              How Many Photos?
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground px-4">
              Choose the number of photos you'd like to take
            </p>
          </div>

          {/* Photo count options */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
            {photoOptions.map((count) => (
              <button
                key={count}
                onClick={() => setSelectedCount(count)}
                className={`p-6 sm:p-8 rounded-2xl transition-all ${
                  selectedCount === count
                    ? "bg-primary text-primary-foreground shadow-glow scale-105"
                    : "bg-white/60 backdrop-blur-sm hover:bg-white/80 shadow-soft"
                }`}
              >
                <div className="text-center space-y-1 sm:space-y-2">
                  <div className="text-3xl sm:text-5xl font-bold">{count}</div>
                  <div className="text-xs sm:text-sm opacity-90">
                    {count === 1 ? "Photo" : "Photos"}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Preview */}
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 sm:p-6">
            <h3 className="font-semibold text-foreground mb-4 text-center text-sm sm:text-base">
              Preview Layout
            </h3>
            <div className="flex justify-center">
              <div className="bg-white rounded-2xl p-3 sm:p-4 shadow-soft border-2 sm:border-4 border-primary">
                <div className="space-y-2">
                  {[...Array(selectedCount)].map((_, i) => (
                    <div
                      key={i}
                      className="w-32 sm:w-40 h-20 sm:h-24 bg-muted rounded-lg flex items-center justify-center text-muted-foreground text-xs sm:text-sm"
                    >
                      Photo {i + 1}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Continue button */}
          <Button
            size="lg"
            onClick={handleContinue}
            className="w-full py-5 sm:py-6 rounded-full shadow-glow hover:shadow-soft transition-all"
          >
            Continue to Camera
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PhotoCount;
