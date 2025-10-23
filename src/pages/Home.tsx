import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Camera, Sparkles, Heart } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();
  const [showAbout, setShowAbout] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showContact, setShowContact] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-soft flex flex-col items-center justify-center p-4 sm:p-8 relative overflow-hidden">
      {/* Top Navigation */}
      <div className="absolute top-2 sm:top-6 right-2 sm:right-6 flex gap-1.5 sm:gap-3 z-10">
        <Button 
          variant="outline" 
          onClick={() => setShowAbout(true)} 
          className="bg-white/80 backdrop-blur-sm text-xs sm:text-sm px-2 py-1 sm:px-4 sm:py-2 h-auto"
        >
          About
        </Button>
        <Button 
          variant="outline" 
          onClick={() => setShowPrivacy(true)} 
          className="bg-white/80 backdrop-blur-sm text-xs sm:text-sm px-2 py-1 sm:px-4 sm:py-2 h-auto"
        >
          Privacy
        </Button>
        <Button 
          variant="outline" 
          onClick={() => setShowContact(true)} 
          className="bg-white/80 backdrop-blur-sm text-xs sm:text-sm px-2 py-1 sm:px-4 sm:py-2 h-auto"
        >
          Contact
        </Button>
      </div>

      {/* Decorative elements - hidden on small screens */}
      <div className="hidden sm:block absolute top-10 left-4 sm:left-10 opacity-20">
        <Sparkles className="w-8 h-8 sm:w-12 sm:h-12 text-primary animate-pulse" />
      </div>
      <div className="hidden sm:block absolute bottom-10 right-4 sm:right-10 opacity-20">
        <Heart className="w-12 h-12 sm:w-16 sm:h-16 text-primary animate-pulse" />
      </div>
      
      {/* Main content */}
      <div className="text-center space-y-4 sm:space-y-8 max-w-4xl w-full mt-12 sm:mt-0">
        {/* Brand badge */}
        <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 sm:px-6 py-2 sm:py-3 rounded-full shadow-soft">
          <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
          <span className="text-xs sm:text-sm font-medium text-foreground">
            Capture the moment, cherish the magic
          </span>
        </div>

        {/* Logo and title */}
        <div className="space-y-2 sm:space-y-4">
          <h1 className="text-4xl sm:text-7xl md:text-8xl font-bold text-foreground tracking-tight">
            KodaSnap
          </h1>
          <p className="text-sm sm:text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto px-4">
            Create beautiful photo strips instantly
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 px-4">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-soft">
            <Camera className="w-6 h-6 sm:w-8 sm:h-8 text-primary mx-auto mb-2 sm:mb-3" />
            <h3 className="font-semibold text-foreground mb-1 sm:mb-2 text-sm sm:text-base">Instant Capture</h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Multiple photos with countdown timers
            </p>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-soft">
            <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-primary mx-auto mb-2 sm:mb-3" />
            <h3 className="font-semibold text-foreground mb-1 sm:mb-2 text-sm sm:text-base">Customize Everything</h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Custom borders, stickers, and filters
            </p>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-soft">
            <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-primary mx-auto mb-2 sm:mb-3" />
            <h3 className="font-semibold text-foreground mb-1 sm:mb-2 text-sm sm:text-base">Private & Secure</h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Photos stay on your device only
            </p>
          </div>
        </div>

        {/* CTA Button */}
        <div className="px-4">
          <Button
            size="lg"
            onClick={() => navigate("/payment")}
            className="text-base sm:text-2xl py-5 sm:py-8 px-10 sm:px-16 rounded-full shadow-glow hover:shadow-soft transition-all duration-300 hover:scale-105"
          >
            <Camera className="w-5 h-5 sm:w-8 sm:h-8 mr-2 sm:mr-3" />
            START
          </Button>
        </div>

        {/* Footer text */}
        <p className="text-xs sm:text-sm text-muted-foreground pb-4">
          EST 2025 • Relive the love
        </p>
      </div>

      {/* About Dialog */}
      <Dialog open={showAbout} onOpenChange={setShowAbout}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">About KodaSnap</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-foreground">
            <p>
              Welcome to <strong>KodaSnap</strong> – your instant digital photobooth experience that captures life's most precious moments with style and creativity.
            </p>
            <h3 className="font-semibold text-lg mt-4">Our Mission</h3>
            <p>
              KodaSnap was created to bring the joy of photobooth memories into the digital age. We believe that every moment deserves to be captured beautifully and shared instantly. Our platform combines professional-quality photo capture with fun, customizable features that let you express your unique style.
            </p>
            <h3 className="font-semibold text-lg mt-4">What Makes Us Special</h3>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>Instant Capture:</strong> Take multiple photos with countdown timers for perfect poses</li>
              <li><strong>Full Customization:</strong> Choose from various layouts, frames, colors, and stickers</li>
              <li><strong>Professional Quality:</strong> High-resolution outputs suitable for printing or sharing</li>
              <li><strong>Privacy First:</strong> All photos stay on your device – we never store or access your images</li>
              <li><strong>Easy to Use:</strong> Simple, intuitive interface that anyone can master in seconds</li>
            </ul>
            <h3 className="font-semibold text-lg mt-4">Perfect For</h3>
            <p>
              Parties, weddings, events, family gatherings, or just fun moments with friends. KodaSnap turns any occasion into a memorable experience with beautiful photo strips you can treasure forever.
            </p>
            <p className="mt-4 text-sm text-muted-foreground">
              Established 2025 • Relive the love
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Privacy Policy Dialog */}
      <Dialog open={showPrivacy} onOpenChange={setShowPrivacy}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Privacy Policy</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-foreground">
            <p className="text-sm text-muted-foreground">Last updated: December 2025</p>
            
            <h3 className="font-semibold text-lg mt-4">Your Privacy Matters</h3>
            <p>
              At KodaSnap, we take your privacy seriously. This policy explains how we handle your information when you use our photobooth service.
            </p>

            <h3 className="font-semibold text-lg mt-4">Photos and Images</h3>
            <p>
              <strong>We do not store, access, or transmit your photos.</strong> All images captured through KodaSnap remain exclusively on your device. Photos are processed locally in your browser and are never uploaded to our servers or any third-party services.
            </p>

            <h3 className="font-semibold text-lg mt-4">Camera Access</h3>
            <p>
              KodaSnap requires camera access to capture photos. This permission is requested by your browser and can be revoked at any time through your browser settings. Camera access is used solely for photo capture and is not used for any other purpose.
            </p>

            <h3 className="font-semibold text-lg mt-4">Data Collection</h3>
            <p>
              We may collect anonymous usage statistics to improve our service, such as:
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>Number of photos taken (not the photos themselves)</li>
              <li>Features used (layouts, filters, etc.)</li>
              <li>General device information (browser type, screen size)</li>
            </ul>
            <p className="mt-2">
              This data is anonymized and cannot be used to identify you personally.
            </p>

            <h3 className="font-semibold text-lg mt-4">Cookies</h3>
            <p>
              We use minimal cookies necessary for the website to function properly. We do not use tracking cookies or third-party advertising cookies.
            </p>

            <h3 className="font-semibold text-lg mt-4">Third-Party Services</h3>
            <p>
              KodaSnap does not share your information with third parties. Payment processing (if applicable) is handled by secure, PCI-compliant payment providers who have their own privacy policies.
            </p>

            <h3 className="font-semibold text-lg mt-4">Your Rights</h3>
            <p>
              Since we don't store your photos or personal information, there's nothing to delete or request. You maintain complete control over your images at all times.
            </p>

            <h3 className="font-semibold text-lg mt-4">Changes to This Policy</h3>
            <p>
              We may update this privacy policy from time to time. Any changes will be posted on this page with an updated revision date.
            </p>

            <h3 className="font-semibold text-lg mt-4">Contact</h3>
            <p>
              If you have any questions about this privacy policy, please contact us through the Contact Us section.
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Contact Us Dialog */}
      <Dialog open={showContact} onOpenChange={setShowContact}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Contact Us</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 text-foreground">
            <div className="space-y-3">
              <p className="text-center">
                Thank you for using KodaSnap! We'd love to hear from you.
              </p>
              <p className="text-center text-sm text-muted-foreground">
                For inquiries, support, or feedback, please reach out to our development team.
              </p>
            </div>

            <div className="bg-gradient-soft rounded-xl p-6">
              <h3 className="font-bold text-lg mb-4 text-center">Development Team</h3>
              <div className="space-y-3">
                <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4">
                  <p className="font-semibold text-center">Reabad, Niño</p>
                  <p className="text-sm text-muted-foreground text-center">Team Leader</p>
                </div>
                <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3">
                  <p className="font-medium text-center">Abletia, Maria Crizelle</p>
                  <p className="text-sm text-muted-foreground text-center">Developer</p>
                </div>
                <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3">
                  <p className="font-medium text-center">Reforca, Ma. Irene Angela B.</p>
                  <p className="text-sm text-muted-foreground text-center">Developer</p>
                </div>
                <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3">
                  <p className="font-medium text-center">Sangcap, Diane E.</p>
                  <p className="text-sm text-muted-foreground text-center">Developer</p>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <Button 
                onClick={() => setShowContact(false)}
                className="px-8"
              >
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Home;
