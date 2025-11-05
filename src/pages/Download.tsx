import { useRef, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Download, RotateCcw, Home, Printer } from "lucide-react";
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

    // Get template configuration
    const templateNumber = customization?.templateNumber || 1;
    const isVertical = customization?.layout === "vertical";
    const DPI = 300; // Print resolution
    
    // Template sizing configurations (in inches converted to pixels at 300 DPI)
    const templateConfigs: Record<number, any> = {
      1: { strip: { width: 600, height: 1800, photoWidth: 540, photoHeight: 1620 } },
      2: { 
        strip: { width: 600, height: 1800, photoWidth: 540, photoHeight: 780 },
        grid: { width: 1200, height: 1800, photoWidth: 840, photoHeight: 840 }
      },
      3: { strip: { width: 600, height: 1800, photoWidth: 540, photoHeight: 510 } },
      4: { 
        strip: { width: 600, height: 1800, photoWidth: 540, photoHeight: 390 },
        grid: { width: 1200, height: 1800, photoWidth: 840, photoHeight: 840 }
      },
      5: { strip: { width: 600, height: 1800, photoWidth: 540, photoHeight: 300 } },
      6: { 
        strip: { width: 600, height: 1800, photoWidth: 540, photoHeight: 270 },
        grid: { width: 1200, height: 1800, photoWidth: 570, photoHeight: 570 }
      },
    };

    const config = templateConfigs[templateNumber];
    const layoutConfig = isVertical ? config.strip : (config.grid || config.strip);
    
    const padding = 30; // Reduced padding for accurate sizing
    const spacing = templateNumber === 6 && !isVertical ? 30 : 15; // Spacing between photos
    const bottomSpace = (customization?.addDate || customization?.addTime) ? 80 : 30;

    // Set canvas to exact print dimensions
    if (isVertical) {
      canvas.width = layoutConfig.width;
      canvas.height = layoutConfig.height;
    } else {
      canvas.width = layoutConfig.width;
      canvas.height = layoutConfig.height;
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

      // Draw photos with template-specific positioning
      loadedPhotos.forEach((img, index) => {
        let x, y, w, h;

        if (isVertical) {
          // Strip layout - center photos vertically with spacing
          const totalPhotoHeight = layoutConfig.photoHeight * photos.length;
          const totalSpacing = spacing * (photos.length - 1);
          const startY = (canvas.height - bottomSpace - totalPhotoHeight - totalSpacing) / 2;
          
          x = (canvas.width - layoutConfig.photoWidth) / 2;
          y = startY + (layoutConfig.photoHeight + spacing) * index;
          w = layoutConfig.photoWidth;
          h = layoutConfig.photoHeight;
        } else {
          // Grid layout
          if (templateNumber === 2) {
            // 2 photos side by side
            const col = index % 2;
            const totalWidth = layoutConfig.photoWidth * 2 + spacing;
            const startX = (canvas.width - totalWidth) / 2;
            x = startX + col * (layoutConfig.photoWidth + spacing);
            y = (canvas.height - layoutConfig.photoHeight) / 2;
            w = layoutConfig.photoWidth;
            h = layoutConfig.photoHeight;
          } else if (templateNumber === 4) {
            // 2×2 grid
            const col = index % 2;
            const row = Math.floor(index / 2);
            const totalWidth = layoutConfig.photoWidth * 2 + spacing;
            const totalHeight = layoutConfig.photoHeight * 2 + spacing;
            const startX = (canvas.width - totalWidth) / 2;
            const startY = (canvas.height - bottomSpace - totalHeight) / 2;
            x = startX + col * (layoutConfig.photoWidth + spacing);
            y = startY + row * (layoutConfig.photoHeight + spacing);
            w = layoutConfig.photoWidth;
            h = layoutConfig.photoHeight;
          } else if (templateNumber === 6) {
            // 3×2 grid (3 columns, 2 rows)
            const col = index % 3;
            const row = Math.floor(index / 3);
            const totalWidth = layoutConfig.photoWidth * 3 + spacing * 2;
            const totalHeight = layoutConfig.photoHeight * 2 + spacing;
            const startX = (canvas.width - totalWidth) / 2;
            const startY = (canvas.height - bottomSpace - totalHeight) / 2;
            x = startX + col * (layoutConfig.photoWidth + spacing);
            y = startY + row * (layoutConfig.photoHeight + spacing);
            w = layoutConfig.photoWidth;
            h = layoutConfig.photoHeight;
          }
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

  const handleDownload = async () => {
    if (!canvasRef.current) return;

    try {
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvasRef.current?.toBlob((b) => {
          if (b) resolve(b);
          else reject(new Error("Failed to create blob"));
        }, "image/png", 1.0);
      });

      const filename = `kodasnap-${Date.now()}.png`;
      const file = new File([blob], filename, { type: "image/png" });

      const ua = navigator.userAgent;
      const isIOS = /iPhone|iPad|iPod/i.test(ua);

      // 1) Prefer Web Share API with file attachment (best on mobile)
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({ files: [file], title: "KodaSnap Photo Strip" });
          toast.success("Use 'Save to Files' or 'Save Image' to store it.");
          return;
        } catch (err: any) {
          if (err?.name === 'AbortError') return;
          // fall through to other strategies
        }
      }

      // 2) iOS fallback: open data URL in a new tab (user can long-press › Save Image)
      if (isIOS && canvasRef.current) {
        const dataUrl = canvasRef.current.toDataURL("image/png", 1.0);
        const opened = window.open(dataUrl, "_blank");
        if (!opened) {
          // As a last resort, navigate current tab
          window.location.href = dataUrl;
        }
        toast.success("Image opened. Tap and hold to Save Image.");
        return;
      }

      // 3) Standard download for Android/desktop
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 1000);
      toast.success("Photo downloaded successfully!");
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download photo. Please try again.");
    }
  };



  const handlePrint = async () => {
    if (!canvasRef.current) return;

    try {
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      
      if (isMobile) {
        // Mobile: Convert to blob and download
        const blob = await new Promise<Blob>((resolve, reject) => {
          canvasRef.current?.toBlob((b) => {
            if (b) resolve(b);
            else reject(new Error("Failed to create blob"));
          }, "image/png", 1.0);
        });
        
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `kodasnap-print-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        
        setTimeout(() => {
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }, 1000);
        
        toast.success("Downloaded! Open the image and use your device's print option.");
      } else {
        // Desktop: Open print dialog
        const dataUrl = canvasRef.current.toDataURL("image/png", 1.0);
        const printWindow = window.open("", "_blank");
        
        if (printWindow) {
          printWindow.document.write(`
            <!DOCTYPE html>
            <html>
              <head>
                <title>Print Photo Strip - KodaSnap</title>
                <style>
                  * { margin: 0; padding: 0; box-sizing: border-box; }
                  body {
                    margin: 0;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 100vh;
                    background: #f5f5f5;
                  }
                  img { max-width: 100%; height: auto; display: block; }
                  @media print {
                    body { background: white; margin: 0; padding: 0; }
                    img { max-width: 100%; height: auto; page-break-inside: avoid; }
                    @page { margin: 0.5cm; }
                  }
                </style>
              </head>
              <body>
                <img src="${dataUrl}" onload="setTimeout(() => window.print(), 250);" alt="KodaSnap Photo Strip" />
              </body>
            </html>
          `);
          printWindow.document.close();
          toast.success("Opening print dialog...");
        } else {
          toast.error("Please allow pop-ups to print");
        }
      }
    } catch (error) {
      console.error("Print error:", error);
      toast.error("Failed to print. Try downloading instead.");
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

          {/* Info banner */}
          <div className="bg-primary/10 border border-primary/20 rounded-2xl p-4 mb-6 max-w-2xl mx-auto">
            <div className="flex items-start gap-3">
              <Download className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-foreground mb-1">
                  Save Your Photo Strip
                </p>
                <p className="text-xs text-muted-foreground">
                  Tap Download. On iPhone, the share sheet will open so you can Save to Files/Photos. On Android/Windows, it will download directly.
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
              <Download className="w-5 h-5" />
              Download
            </Button>
            
            <Button
              size="lg"
              variant="outline"
              onClick={handlePrint}
              className="w-full sm:flex-1 py-5 sm:py-6 rounded-full gap-2"
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
