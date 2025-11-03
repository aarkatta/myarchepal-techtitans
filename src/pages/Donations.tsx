import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, CreditCard, DollarSign, Building2, Mail } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const Donations = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [donationType, setDonationType] = useState("one-time");
  const [amount, setAmount] = useState("");
  const [customAmount, setCustomAmount] = useState("");
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [message, setMessage] = useState("");

  const predefinedAmounts = ["10", "25", "50", "100", "250"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalAmount = amount === "custom" ? customAmount : amount;

    if (!finalAmount || parseFloat(finalAmount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid donation amount.",
        variant: "destructive",
      });
      return;
    }

    if (!donorName || !donorEmail) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Here you would integrate with a payment processor
    toast({
      title: "Thank You!",
      description: `Your ${donationType} donation of $${finalAmount} has been received. We appreciate your support!`,
    });

    // Reset form
    setAmount("");
    setCustomAmount("");
    setDonorName("");
    setDonorEmail("");
    setMessage("");
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-md mx-auto bg-background min-h-screen">
        <AppHeader />

        {/* Header Section */}
        <div className="p-6 space-y-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="mb-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <Heart className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold">Support Our Mission</h1>
            <p className="text-muted-foreground">
              Help us preserve and discover archaeological treasures. Your donation makes a difference.
            </p>
          </div>
        </div>

        {/* Donation Form */}
        <div className="px-6 pb-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Make a Donation</CardTitle>
              <CardDescription>
                Every contribution helps us continue our archaeological research and preservation efforts.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Donation Type */}
                <div className="space-y-3">
                  <Label>Donation Type</Label>
                  <RadioGroup value={donationType} onValueChange={setDonationType}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="one-time" id="one-time" />
                      <Label htmlFor="one-time" className="cursor-pointer font-normal">
                        One-time donation
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="monthly" id="monthly" />
                      <Label htmlFor="monthly" className="cursor-pointer font-normal">
                        Monthly donation
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Amount Selection */}
                <div className="space-y-3">
                  <Label>Select Amount (USD)</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {predefinedAmounts.map((amt) => (
                      <Button
                        key={amt}
                        type="button"
                        variant={amount === amt ? "default" : "outline"}
                        onClick={() => {
                          setAmount(amt);
                          setCustomAmount("");
                        }}
                        className="w-full"
                      >
                        ${amt}
                      </Button>
                    ))}
                    <Button
                      type="button"
                      variant={amount === "custom" ? "default" : "outline"}
                      onClick={() => setAmount("custom")}
                      className="w-full col-span-3"
                    >
                      <DollarSign className="w-4 h-4 mr-1" />
                      Custom Amount
                    </Button>
                  </div>

                  {amount === "custom" && (
                    <div className="space-y-2 mt-2">
                      <Input
                        type="number"
                        placeholder="Enter custom amount"
                        value={customAmount}
                        onChange={(e) => setCustomAmount(e.target.value)}
                        min="1"
                        step="0.01"
                      />
                    </div>
                  )}
                </div>

                {/* Donor Information */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="donor-name">Full Name *</Label>
                    <Input
                      id="donor-name"
                      placeholder="John Doe"
                      value={donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="donor-email">Email Address *</Label>
                    <Input
                      id="donor-email"
                      type="email"
                      placeholder="john@example.com"
                      value={donorEmail}
                      onChange={(e) => setDonorEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message (Optional)</Label>
                    <Textarea
                      id="message"
                      placeholder="Leave a message..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={3}
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <Button type="submit" className="w-full" size="lg">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Donate {amount && (amount === "custom" ? (customAmount ? `$${customAmount}` : "") : `$${amount}`)}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Additional Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Other Ways to Help</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Building2 className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <h4 className="font-medium">Bank Transfer</h4>
                  <p className="text-sm text-muted-foreground">
                    Contact us for direct bank transfer details for larger donations.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <h4 className="font-medium">Contact Us</h4>
                  <p className="text-sm text-muted-foreground">
                    Email us at donations@archepal.org for any questions.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <BottomNav />
      </div>
    </div>
  );
};

export default Donations;
