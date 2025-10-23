import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, LayoutGrid, LayoutList, Move } from "lucide-react";

// Import frame images
import frame1 from "@/assets/frames/frame1.jpg";
import frame2 from "@/assets/frames/frame2.jpg";
import frame3 from "@/assets/frames/frame3.jpg";
import frame4 from "@/assets/frames/frame4.jpg";
import frame5 from "@/assets/frames/frame5.jpg";
import frame6 from "@/assets/frames/frame6.jpg";
import frame7 from "@/assets/frames/frame7.jpg";
import frame8 from "@/assets/frames/frame8.jpg";
import frame9 from "@/assets/frames/frame9.jpg";
import frame10 from "@/assets/frames/frame10.jpg";

const CustomizeNew = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const photos = location.state?.photos || [];
  
  // Detect mobile device
  const [isMobile, setIsMobile] = useState(false);
  
  const [layout, setLayout] = useState<"vertical" | "grid">("vertical");
  const [frameColor, setFrameColor] = useState("#60A5FA");
  const [customColor, setCustomColor] = useState("#60A5FA");
  const [frameImage, setFrameImage] = useState<string | null>(null);
  const [stickerTheme, setStickerTheme] = useState("No Sticker");
  const [addDate, setAddDate] = useState(false);
  const [addTime, setAddTime] = useState(false);
  const [timestampColor, setTimestampColor] = useState("#FFFFFF");
  const [customText, setCustomText] = useState("");
  const [textColor, setTextColor] = useState("#FFFFFF");
  const [textFont, setTextFont] = useState("sans-serif");
  const [textSize, setTextSize] = useState(18);
  const [textPosition, setTextPosition] = useState({ x: 0, y: 0 });
  const [isDraggingText, setIsDraggingText] = useState(false);
  
  const stickers = ["💖", "✨", "🎀", "⭐", "🌸"];
  
  // Detect mobile on mount
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Generate random sticker positions around edges (not covering center)
  const generateRandomStickerPositions = () => {
    const positions = [];
    for (let i = 0; i < 5; i++) {
      // Randomly choose edge: 0=top, 1=right, 2=bottom, 3=left
      const edge = Math.floor(Math.random() * 4);
      let x, y;
      
      if (edge === 0) { // Top edge
        x = Math.random() * 80 + 10; // 10-90%
        y = Math.random() * 15; // 0-15%
      } else if (edge === 1) { // Right edge
        x = 85 + Math.random() * 10; // 85-95%
        y = Math.random() * 80 + 10; // 10-90%
      } else if (edge === 2) { // Bottom edge
        x = Math.random() * 80 + 10; // 10-90%
        y = 85 + Math.random() * 10; // 85-95%
      } else { // Left edge
        x = Math.random() * 10; // 0-10%
        y = Math.random() * 80 + 10; // 10-90%
      }
      
      positions.push({ x, y });
    }
    return positions;
  };
  
  const [stickerPositions, setStickerPositions] = useState(generateRandomStickerPositions());

  const frameColors = [
    { name: "White", value: "#FFFFFF" },
    { name: "Black", value: "#000000" },
    { name: "Pink", value: "#F472B6" },
    { name: "Blue", value: "#60A5FA" },
    { name: "Green", value: "#34D399" },
    { name: "Yellow", value: "#FBBF24" },
    { name: "Purple", value: "#A78BFA" },
    { name: "Red", value: "#DC2626" },
  ];

  const designedFrames = [
    { name: "Frame 1", image: frame1 },
    { name: "Frame 2", image: frame2 },
    { name: "Frame 3", image: frame3 },
    { name: "Frame 4", image: frame4 },
    { name: "Frame 5", image: frame5 },
    { name: "Frame 6", image: frame6 },
    { name: "Frame 7", image: frame7 },
    { name: "Frame 8", image: frame8 },
    { name: "Frame 9", image: frame9 },
    { name: "Frame 10", image: frame10 },
  ];

  const fontOptions = [
    { name: "Sans Serif", value: "sans-serif" },
    { name: "Serif", value: "serif" },
    { name: "Monospace", value: "monospace" },
    { name: "Cursive", value: "cursive" },
    { name: "Fantasy", value: "fantasy" },
  ];

  const stickerThemes = [
    "No Sticker",
    "Girly Pop",
    "Cute",
    "Mofusand",
    "Shin Chan",
    "Miffy",
    "Mark's Solo",
    "Midnight Garden",
  ];

  const handleDownload = () => {
    navigate("/download", {
      state: {
        photos,
        customization: {
          layout,
          frame: frameColor,
          frameImage,
          stickerTheme,
          addDate,
          addTime,
          timestampColor,
          customText,
          textColor,
          textFont,
          textSize,
          textPosition,
          stickers,
          stickerPositions,
        },
      },
    });
  };

  const handleTextDrag = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDraggingText) return;
    const rect = e.currentTarget.parentElement?.getBoundingClientRect();
    if (rect) {
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setTextPosition({ x: Math.max(0, Math.min(90, x)), y: Math.max(0, Math.min(90, y)) });
    }
  };

  const [draggingStickerIndex, setDraggingStickerIndex] = useState<number | null>(null);

  const handleStickerMouseDown = (index: number) => {
    setDraggingStickerIndex(index);
  };

  const handleStickerDrag = (e: React.MouseEvent<HTMLDivElement>) => {
    if (draggingStickerIndex === null) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    if (rect) {
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      const newPositions = [...stickerPositions];
      // Keep stickers within bounds (2% to 95% to prevent cutoff)
      newPositions[draggingStickerIndex] = { 
        x: Math.max(2, Math.min(95, x)), 
        y: Math.max(2, Math.min(95, y)) 
      };
      setStickerPositions(newPositions);
    }
  };

  const handleStickerMouseUp = () => {
    setDraggingStickerIndex(null);
  };

  const getCurrentDate = () => {
    const date = new Date();
    return date.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });
  };

  const getCurrentTime = () => {
    const date = new Date();
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-soft flex flex-col">
      {/* Header */}
      <div className="p-4 sm:p-6 flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => navigate("/capture")}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Back</span>
        </Button>
        <h1 className="text-xl sm:text-2xl font-bold text-foreground">KodaSnap</h1>
        <div className="w-16 sm:w-20" />
      </div>

      {/* Main content */}
      <div className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground text-center mb-8">
            Customize your Photo Strip
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Preview */}
            <div>
              <h3 className="font-semibold text-foreground mb-4 text-center">
                Photo Strip Preview
              </h3>
              <div className="flex justify-center">
              <div
                  className={`rounded-3xl p-6 shadow-soft max-w-md w-full relative select-none overflow-hidden`}
                  style={{ 
                    backgroundColor: frameImage ? 'transparent' : frameColor,
                    backgroundImage: frameImage ? `url(${frameImage})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                  onMouseMove={(e) => {
                    handleTextDrag(e);
                    handleStickerDrag(e);
                  }}
                  onMouseUp={() => {
                    setIsDraggingText(false);
                    handleStickerMouseUp();
                  }}
                  onMouseLeave={() => {
                    setIsDraggingText(false);
                    handleStickerMouseUp();
                  }}
                >
                  <div
                    className={
                      layout === "vertical"
                        ? "space-y-3"
                        : "grid grid-cols-2 gap-3"
                    }
                  >
                    {photos.map((photo: string, index: number) => (
                      <div
                        key={index}
                        className="relative overflow-hidden rounded-xl bg-white"
                      >
                        <img
                          src={photo}
                          alt={`Photo ${index + 1}`}
                          className={`w-full object-cover ${
                            layout === "vertical" ? "h-40" : "h-32"
                          }`}
                        />
                      </div>
                    ))}
                  </div>
                  
                  {/* Decorative stickers around edges - only show if sticker theme selected */}
                  {stickerTheme !== "No Sticker" && stickers.map((sticker, index) => (
                    <div
                      key={index}
                      className={`absolute text-2xl sm:text-3xl select-none transition-all ${
                        !isMobile && draggingStickerIndex === index 
                          ? 'cursor-grabbing scale-110 z-50' 
                          : !isMobile ? 'cursor-grab hover:scale-105' : ''
                      }`}
                      style={{
                        left: `${stickerPositions[index].x}%`,
                        top: `${stickerPositions[index].y}%`,
                        transform: 'translate(-50%, -50%)',
                        touchAction: 'none',
                        pointerEvents: isMobile ? 'none' : 'auto',
                      }}
                      onMouseDown={(e) => {
                        if (isMobile) return;
                        e.preventDefault();
                        e.stopPropagation();
                        handleStickerMouseDown(index);
                      }}
                    >
                      <div className={`${draggingStickerIndex === index ? 'animate-pulse' : ''}`}>
                        {stickerTheme === "Girly Pop" && "💖"}
                        {stickerTheme === "Cute" && "🎀"}
                        {stickerTheme === "Mofusand" && "🐱"}
                        {stickerTheme === "Shin Chan" && "⭐"}
                        {stickerTheme === "Miffy" && "🐰"}
                        {stickerTheme === "Mark's Solo" && "🎸"}
                        {stickerTheme === "Midnight Garden" && "🌙"}
                      </div>
                    </div>
                  ))}
                  
                  {/* Custom text */}
                  {customText && (
                    <div
                      className="absolute cursor-move select-none drop-shadow-lg"
                      style={{
                        left: `${textPosition.x}%`,
                        top: `${textPosition.y}%`,
                        color: textColor,
                        fontFamily: textFont,
                        fontSize: `${textSize}px`,
                        fontWeight: 'bold',
                      }}
                      onMouseDown={() => setIsDraggingText(true)}
                    >
                      <Move className="w-4 h-4 inline mr-1 opacity-50" />
                      {customText}
                    </div>
                  )}
                  
                  {/* Bottom date/time */}
                  <div className="mt-4 text-center space-y-1">
                    {addDate && (
                      <p className="text-sm drop-shadow-lg font-medium" style={{ color: timestampColor }}>
                        {getCurrentDate()}
                      </p>
                    )}
                    {addTime && (
                      <p className="text-sm drop-shadow-lg font-medium" style={{ color: timestampColor }}>
                        {getCurrentTime()}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Customization options */}
            <div className="space-y-6">
              {/* Layout */}
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6">
                <h3 className="font-semibold text-foreground mb-4">Layout</h3>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant={layout === "vertical" ? "default" : "outline"}
                    onClick={() => setLayout("vertical")}
                    className="gap-2 h-auto py-4"
                  >
                    <LayoutList className="w-5 h-5" />
                    <span>Vertical</span>
                  </Button>
                  <Button
                    variant={layout === "grid" ? "default" : "outline"}
                    onClick={() => setLayout("grid")}
                    className="gap-2 h-auto py-4"
                  >
                    <LayoutGrid className="w-5 h-5" />
                    <span>Grid</span>
                  </Button>
                </div>
              </div>

              {/* Frame Color */}
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6">
                <h3 className="font-semibold text-foreground mb-4">
                  Frame Color
                </h3>
                <div className="grid grid-cols-4 gap-3 mb-4">
                  {frameColors.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => {
                        setFrameColor(color.value);
                        setFrameImage(null);
                      }}
                      className={`h-12 rounded-lg transition-all border-2 ${
                        frameColor === color.value && !frameImage
                          ? "ring-4 ring-primary ring-offset-2 scale-105"
                          : "hover:scale-105 border-border"
                      }`}
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="custom-color"
                    checked={frameColor === customColor && !frameColors.find(c => c.value === customColor) && !frameImage}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setFrameColor(customColor);
                        setFrameImage(null);
                      }
                    }}
                  />
                  <label
                    htmlFor="custom-color"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Custom Color
                  </label>
                  <Input
                    type="color"
                    value={customColor}
                    onChange={(e) => {
                      setCustomColor(e.target.value);
                      setFrameColor(e.target.value);
                      setFrameImage(null);
                    }}
                    className="w-20 h-10 cursor-pointer"
                  />
                  <span className="text-sm text-muted-foreground">
                    {customColor}
                  </span>
                </div>
              </div>

              {/* Designed Frames */}
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6">
                <h3 className="font-semibold text-foreground mb-4">
                  Decorated Frame Options
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {designedFrames.map((frame) => (
                    <button
                      key={frame.name}
                      onClick={() => {
                        setFrameImage(frame.image);
                      }}
                      className={`h-20 rounded-lg transition-all border-2 overflow-hidden ${
                        frameImage === frame.image
                          ? "ring-4 ring-primary ring-offset-2 scale-105"
                          : "hover:scale-105 border-border"
                      }`}
                      title={frame.name}
                    >
                      <img 
                        src={frame.image} 
                        alt={frame.name}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Stickers */}
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6">
                <h3 className="font-semibold text-foreground mb-4">Stickers</h3>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {stickerThemes.map((theme) => (
                    <Button
                      key={theme}
                      variant={stickerTheme === theme ? "default" : "outline"}
                      onClick={() => {
                        setStickerTheme(theme);
                        // Regenerate random positions when selecting a new sticker theme
                        if (theme !== "No Sticker") {
                          setStickerPositions(generateRandomStickerPositions());
                        }
                      }}
                      className="h-auto py-3"
                    >
                      {theme}
                    </Button>
                  ))}
                </div>
                {stickerTheme !== "No Sticker" && (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setStickerPositions(generateRandomStickerPositions())}
                      className="flex-1"
                    >
                      Randomize Positions
                    </Button>
                  </div>
                )}
                {stickerTheme !== "No Sticker" && !isMobile && (
                  <p className="text-xs text-muted-foreground mt-3">
                    💡 Drag stickers in the preview to reposition them
                  </p>
                )}
                {stickerTheme !== "No Sticker" && isMobile && (
                  <p className="text-xs text-muted-foreground mt-3">
                    ℹ️ Sticker positions are fixed on mobile devices
                  </p>
                )}
              </div>

              {/* Text Input */}
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6">
                <h3 className="font-semibold text-foreground mb-4">
                  Add Custom Text
                </h3>
                <div className="space-y-4">
                  <Input
                    type="text"
                    placeholder="Enter your text here..."
                    value={customText}
                    onChange={(e) => setCustomText(e.target.value)}
                    maxLength={50}
                    className="w-full"
                  />
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Text Color</label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="color"
                          value={textColor}
                          onChange={(e) => setTextColor(e.target.value)}
                          className="w-20 h-10 cursor-pointer"
                        />
                        <span className="text-sm">{textColor}</span>
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-2 block">Font Style</label>
                      <Select value={textFont} onValueChange={setTextFont}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {fontOptions.map((font) => (
                            <SelectItem key={font.value} value={font.value}>
                              {font.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Text Size: {textSize}px
                    </label>
                    <Slider
                      value={[textSize]}
                      onValueChange={(value) => setTextSize(value[0])}
                      min={12}
                      max={48}
                      step={1}
                      className="w-full"
                    />
                  </div>
                  
                  <p className="text-xs text-muted-foreground">
                    💡 Drag the text in the preview to reposition it
                  </p>
                </div>
              </div>

              {/* Date & Time */}
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6">
                <h3 className="font-semibold text-foreground mb-4">Date & Time</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="add-date"
                      checked={addDate}
                      onCheckedChange={(checked) => setAddDate(checked as boolean)}
                    />
                    <label
                      htmlFor="add-date"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Add Date
                    </label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="add-time"
                      checked={addTime}
                      onCheckedChange={(checked) => setAddTime(checked as boolean)}
                    />
                    <label
                      htmlFor="add-time"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Add Time
                    </label>
                  </div>
                  
                  {(addDate || addTime) && (
                    <div>
                      <label className="text-sm font-medium mb-2 block">Timestamp Color</label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="color"
                          value={timestampColor}
                          onChange={(e) => setTimestampColor(e.target.value)}
                          className="w-20 h-10 cursor-pointer"
                        />
                        <span className="text-sm">{timestampColor}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3">
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate("/capture")}
                  className="flex-1 py-6 rounded-full"
                >
                  Back
                </Button>
                <Button
                  size="lg"
                  onClick={handleDownload}
                  className="flex-1 py-6 rounded-full shadow-glow hover:shadow-soft transition-all"
                >
                  Download Photo
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomizeNew;
