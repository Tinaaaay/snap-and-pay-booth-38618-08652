import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, LayoutGrid, LayoutList, Move } from "lucide-react";

const CustomizeNew = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const photos = location.state?.photos || [];
  
  const [layout, setLayout] = useState<"vertical" | "grid">("vertical");
  const [frameColor, setFrameColor] = useState("#60A5FA");
  const [customColor, setCustomColor] = useState("#60A5FA");
  const [stickerTheme, setStickerTheme] = useState("No Sticker");
  const [addDate, setAddDate] = useState(false);
  const [addTime, setAddTime] = useState(false);
  const [customText, setCustomText] = useState("");
  const [textColor, setTextColor] = useState("#FFFFFF");
  const [textFont, setTextFont] = useState("sans-serif");
  const [textSize, setTextSize] = useState(18);
  const [textPosition, setTextPosition] = useState({ x: 0, y: 0 });
  const [isDraggingText, setIsDraggingText] = useState(false);
  
  const stickers = ["💖", "✨", "🎀", "⭐", "🌸"];
  const [stickerPositions, setStickerPositions] = useState([
    { x: 10, y: 10 },
    { x: 85, y: 15 },
    { x: 5, y: 85 },
    { x: 90, y: 80 },
    { x: 50, y: 5 }
  ]);

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
          stickerTheme,
          addDate,
          addTime,
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

  const handleStickerDrag = (index: number, e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.parentElement?.getBoundingClientRect();
    if (rect) {
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      const newPositions = [...stickerPositions];
      newPositions[index] = { x: Math.max(0, Math.min(90, x)), y: Math.max(0, Math.min(90, y)) };
      setStickerPositions(newPositions);
    }
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
      <div className="p-6 flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => navigate("/capture")}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <h1 className="text-2xl font-bold text-foreground">KodaSnap</h1>
        <div className="w-20" />
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
                  className={`rounded-3xl p-6 shadow-soft max-w-md w-full relative`}
                  style={{ backgroundColor: frameColor }}
                  onMouseMove={handleTextDrag}
                  onMouseUp={() => setIsDraggingText(false)}
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
                        {stickerTheme !== "No Sticker" && (
                          <div className="absolute top-2 right-2 text-2xl bg-white/80 rounded-full p-1">
                            {stickerTheme === "Girly Pop" && "💖"}
                            {stickerTheme === "Cute" && "🎀"}
                            {stickerTheme === "Mofusand" && "🐱"}
                            {stickerTheme === "Shin Chan" && "⭐"}
                            {stickerTheme === "Miffy" && "🐰"}
                            {stickerTheme === "Mark's Solo" && "🎸"}
                            {stickerTheme === "Midnight Garden" && "🌙"}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  {/* Decorative stickers around edges */}
                  {stickers.map((sticker, index) => (
                    <div
                      key={index}
                      className="absolute text-3xl cursor-move select-none"
                      style={{
                        left: `${stickerPositions[index].x}%`,
                        top: `${stickerPositions[index].y}%`,
                      }}
                      onMouseDown={(e) => e.preventDefault()}
                      onMouseMove={(e) => handleStickerDrag(index, e)}
                    >
                      {sticker}
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
                      <p className="text-white text-sm drop-shadow-lg">
                        {getCurrentDate()}
                      </p>
                    )}
                    {addTime && (
                      <p className="text-white text-sm drop-shadow-lg">
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
                      onClick={() => setFrameColor(color.value)}
                      className={`h-12 rounded-lg transition-all border-2 ${
                        frameColor === color.value
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
                    checked={frameColor === customColor && !frameColors.find(c => c.value === customColor)}
                    onCheckedChange={(checked) => {
                      if (checked) setFrameColor(customColor);
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
                    }}
                    className="w-20 h-10 cursor-pointer"
                  />
                  <span className="text-sm text-muted-foreground">
                    {customColor}
                  </span>
                </div>
              </div>

              {/* Stickers */}
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6">
                <h3 className="font-semibold text-foreground mb-4">Stickers</h3>
                <div className="grid grid-cols-2 gap-2">
                  {stickerThemes.map((theme) => (
                    <Button
                      key={theme}
                      variant={stickerTheme === theme ? "default" : "outline"}
                      onClick={() => setStickerTheme(theme)}
                      className="h-auto py-3"
                    >
                      {theme}
                    </Button>
                  ))}
                </div>
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
                <h3 className="font-semibold text-foreground mb-4">Options</h3>
                <div className="space-y-3">
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
