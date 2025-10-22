import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { QrCode, ArrowLeft, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

const Payment = () => {
  const navigate = useNavigate();
  const [isPaid, setIsPaid] = useState(false);

  const handlePaymentVerification = () => {
    // Simulate payment verification
    toast.success("Payment verified! Starting your photobooth session...");
    setTimeout(() => {
      navigate("/photo-count");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-soft flex flex-col">
      {/* Header */}
      <div className="p-6 flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <h1 className="text-2xl font-bold text-foreground">KodaSnap</h1>
        <div className="w-20" />
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full">
              <QrCode className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-3xl font-bold text-foreground">
              Complete Payment
            </h2>
            <p className="text-muted-foreground">
              Scan the QR code below to pay via GCash, then show your payment confirmation to the attendant
            </p>
          </div>

          {/* QR Code placeholder */}
          <div className="bg-white rounded-3xl p-8 shadow-soft">
            <div className="aspect-square bg-muted rounded-2xl flex items-center justify-center">
              <div className="text-center space-y-4">
                <QrCode className="w-32 h-32 text-muted-foreground mx-auto" />
                <p className="text-sm text-muted-foreground">
                  GCash QR Code
                </p>
                <p className="font-bold text-2xl text-foreground">₱50.00</p>
              </div>
            </div>
          </div>

          {/* Payment instructions */}
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 space-y-3">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              Payment Instructions
            </h3>
            <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
              <li>Open your GCash app</li>
              <li>Scan the QR code above</li>
              <li>Complete the payment</li>
              <li>Show the confirmation to the attendant</li>
            </ol>
          </div>

          {/* Verification button */}
          <Button
            size="lg"
            onClick={handlePaymentVerification}
            className="w-full py-6 rounded-full shadow-soft hover:shadow-glow transition-all"
          >
            I've Completed Payment
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            By proceeding, you agree to our terms of service
          </p>
        </div>
      </div>
    </div>
  );
};

export default Payment;
