import { useRef, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Download, RotateCcw, Home, Printer, Share2 } from "lucide-react";
import { toast } from "sonner";

const DownloadPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { photos, customization } = location.state || {};
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (photos && customization && canvasRef.current) {
      generateFinalImage();
    }
  }, [photos, customization]);

  const generateFinalImage = async () => {
    if (!canvasRef.current || !photos) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions based on layout
    const isVertical = customization?.layout === "vertical";
    const padding = 48; // 48px padding
    const photoWidth = 400;
    const photoHeight = isVertical ? 160 : 128;
    const spacing = 12;
    const bottomSpace = (customization?.addDate || customization?.addTime) ? 60 : 20;

    if (isVertical) {
      canvas.width = photoWidth + padding * 2;
      canvas.height = (photoHeight * photos.length) + (spacing * (photos.length - 1)) + padding * 2 + bottomSpace;
    } else {
      canvas.width = (photoWidth / 2) * 2 + spacing + padding * 2;
      canvas.height = (photoHeight * 2) + spacing + padding * 2 + bottomSpace;
    }

    // Fill background with frame color or image
    if (customization?.frameImage) {
      // Load and draw frame image
      const frameImg = new Image();
      await new Promise((resolve, reject) => {
        frameImg.onload = resolve;
        frameImg.onerror = reject;
        frameImg.src = customization.frameImage;
      });
      ctx.drawImage(frameImg, 0, 0, canvas.width, canvas.height);
    } else {
      // Fill with solid color
      ctx.fillStyle = customization?.frame || "#F472B6";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Load and draw photos
    const photoPromises = photos.map((photoUrl: string) => {
      return new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = photoUrl;
      });
    });

    try {
      const loadedPhotos = await Promise.all(photoPromises);

      // Draw photos
      loadedPhotos.forEach((img, index) => {
        let x, y, w, h;

        if (isVertical) {
          x = padding;
          y = padding + (photoHeight + spacing) * index;
          w = photoWidth;
          h = photoHeight;
        } else {
          const col = index % 2;
          const row = Math.floor(index / 2);
          x = padding + col * (photoWidth / 2 + spacing);
          y = padding + row * (photoHeight + spacing);
          w = photoWidth / 2;
          h = photoHeight;
        }

        // Draw photo with rounded corners and preserved aspect ratio (cover behavior)
        ctx.save();
        const radius = 12;
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + w - radius, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
        ctx.lineTo(x + w, y + h - radius);
        ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
        ctx.lineTo(x + radius, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
        ctx.clip();
        
        // Calculate aspect ratios
        const imgAspect = img.width / img.height;
        const boxAspect = w / h;
        
        let sx, sy, sw, sh;
        
        if (imgAspect > boxAspect) {
          // Image is wider - crop sides
          sh = img.height;
          sw = img.height * boxAspect;
          sx = (img.width - sw) / 2;
          sy = 0;
        } else {
          // Image is taller - crop top/bottom
          sw = img.width;
          sh = img.width / boxAspect;
          sx = 0;
          sy = (img.height - sh) / 2;
        }
        
        ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
        ctx.restore();
      });

      // Draw stickers if theme selected
      if (customization?.stickerTheme !== "No Sticker" && customization?.stickers && customization?.stickerPositions) {
        ctx.font = "48px Arial";
        customization.stickerPositions.forEach((pos: any, index: number) => {
          const x = (pos.x / 100) * canvas.width;
          const y = (pos.y / 100) * canvas.height;
          
          let emoji = customization.stickers[index];
          // Use theme-specific emoji
          if (customization.stickerTheme === "Girly Pop") emoji = "💖";
          else if (customization.stickerTheme === "Cute") emoji = "🎀";
          else if (customization.stickerTheme === "Mofusand") emoji = "🐱";
          else if (customization.stickerTheme === "Shin Chan") emoji = "⭐";
          else if (customization.stickerTheme === "Miffy") emoji = "🐰";
          else if (customization.stickerTheme === "Mark's Solo") emoji = "🎸";
          else if (customization.stickerTheme === "Midnight Garden") emoji = "🌙";
          
          ctx.fillText(emoji, x, y);
        });
      }

      // Draw custom text
      if (customization?.customText) {
        ctx.font = `bold ${customization.textSize}px ${customization.textFont}`;
        ctx.fillStyle = customization.textColor;
        ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
        ctx.shadowBlur = 4;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        const textX = (customization.textPosition.x / 100) * canvas.width;
        const textY = (customization.textPosition.y / 100) * canvas.height;
        ctx.fillText(customization.customText, textX, textY);
        ctx.shadowColor = "transparent";
      }

      // Draw date/time
      const bottomY = canvas.height - 30;
      ctx.font = "bold 14px sans-serif";
      ctx.fillStyle = customization?.timestampColor || "#FFFFFF";
      ctx.textAlign = "center";
      ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
      ctx.shadowBlur = 4;
      
      let textY = bottomY;
      if (customization?.addDate) {
        const date = new Date().toLocaleDateString("en-US", {
          month: "2-digit",
          day: "2-digit",
          year: "numeric",
        });
        ctx.fillText(date, canvas.width / 2, textY);
        textY += 20;
      }
      if (customization?.addTime) {
        const time = new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        });
        ctx.fillText(time, canvas.width / 2, textY);
      }

    } catch (error) {
      console.error("Error generating image:", error);
      toast.error("Failed to generate final image");
    }
  };

  const handleDownload = () => {
    if (!canvasRef.current) return;

    try {
      // Use blob for better mobile compatibility
      canvasRef.current.toBlob((blob) => {
        if (!blob) {
          toast.error("Failed to create image");
          return;
        }

        // Check if we're on mobile
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        
        if (isMobile && navigator.share) {
          // Use Web Share API on mobile if available
          const file = new File([blob], `kodasnap-${Date.now()}.png`, { type: "image/png" });
          navigator.share({
            files: [file],
            title: "KodaSnap Photo",
            text: "Check out my KodaSnap photo!"
          }).then(() => {
            toast.success("Share successful!");
          }).catch((error) => {
            // Fallback if share fails
            if (error.name !== 'AbortError') {
              downloadFallback(blob);
            }
          });
        } else {
          // Standard download for desktop or if share not available
          downloadFallback(blob);
        }
      }, "image/png");
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download photo");
    }
  };

  const downloadFallback = (blob: Blob) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `kodasnap-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Your photo strip has been downloaded!");
  };

  const handlePrint = () => {
    if (!canvasRef.current) return;

    try {
      const dataUrl = canvasRef.current.toDataURL("image/png");
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Print Photo Strip</title>
              <style>
                body {
                  margin: 0;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  min-height: 100vh;
                }
                img {
                  max-width: 100%;
                  height: auto;
                }
                @media print {
                  body {
                    margin: 0;
                  }
                  img {
                    max-width: 100%;
                    page-break-inside: avoid;
                  }
                }
              </style>
            </head>
            <body>
              <img src="${dataUrl}" onload="window.print(); window.close();" />
            </body>
          </html>
        `);
        printWindow.document.close();
        toast.success("Opening print dialog...");
      }
    } catch (error) {
      console.error("Print error:", error);
      toast.error("Failed to print photo");
    }
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
      <div className="p-4 sm:p-6 flex items-center justify-center">
        <h1 className="text-xl sm:text-2xl font-bold text-foreground">KodaSnap</h1>
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="max-w-4xl w-full space-y-6 sm:space-y-8">
          <div className="text-center space-y-3 sm:space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-primary/10 rounded-full animate-bounce">
              <Download className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold text-foreground">
              Your Photos Are Ready!
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground px-4">
              Download or print your customized photo strip
            </p>
          </div>

          {/* Final preview */}
          <div className="flex justify-center">
            <canvas
              ref={canvasRef}
              className="max-w-full h-auto rounded-3xl shadow-soft"
              style={{ maxHeight: "70vh" }}
            />
          </div>

          {/* Info banner for mobile users */}
          <div className="bg-primary/10 border border-primary/20 rounded-2xl p-4 mb-6 max-w-2xl mx-auto">
            <div className="flex items-start gap-3">
              <Share2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-foreground mb-1">
                  Save Your Photo Strip
                </p>
                <p className="text-xs text-muted-foreground">
                  {/iPhone|iPad|iPod|Android/i.test(navigator.userAgent) 
                    ? "Tap the Share button below to save to your device or share with others"
                    : "Click Download to save your photo strip, or Print for a physical copy"}
                </p>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-2xl mx-auto px-4">
            <Button
              size="lg"
              onClick={handleDownload}
              className="w-full sm:flex-1 py-5 sm:py-6 rounded-full shadow-glow hover:shadow-soft transition-all gap-2"
            >
              {/iPhone|iPad|iPod|Android/i.test(navigator.userAgent) ? (
                <>
                  <Share2 className="w-5 h-5" />
                  Share / Save
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  Download
                </>
              )}
            </Button>
            <Button
              size="lg"
              onClick={handlePrint}
              className="w-full sm:flex-1 py-5 sm:py-6 rounded-full shadow-glow hover:shadow-soft transition-all gap-2"
            >
              <Printer className="w-5 h-5" />
              Print
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-xl mx-auto px-4">
            <Button
              size="lg"
              variant="outline"
              onClick={handleRetake}
              className="w-full sm:flex-1 py-5 sm:py-6 rounded-full gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              Retake
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={handleHome}
              className="w-full sm:flex-1 py-5 sm:py-6 rounded-full gap-2"
            >
              <Home className="w-5 h-5" />
              Home
            </Button>
          </div>

          {/* Footer info */}
          <div className="text-center space-y-2 px-4">
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
