import { Card, CardContent } from "@/components/ui/card";
import { Shield, Eye, Database, Lock, Mail, UserCheck, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function PrivacyPolicy() {
  const lastUpdated = "December 10, 2024";
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Simple header with back button */}
      <header className="bg-card/95 backdrop-blur-lg px-4 py-4 sm:px-6 border-b border-border sticky top-0 z-40">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold">Privacy Policy</h1>
        </div>
      </header>

      <div className="p-4 sm:p-6 lg:p-8 space-y-6 animate-fade-in mx-auto max-w-4xl">
        {/* Hero Section */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-primary/10">
            <Shield className="w-7 h-7 sm:w-8 sm:h-8 text-primary" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading">Privacy Policy</h1>
          <p className="text-sm text-muted-foreground font-sans">
            Last updated: {lastUpdated}
          </p>
        </div>

        {/* Introduction */}
        <Card className="border-border/50">
          <CardContent className="p-4 sm:p-6">
            <p className="text-sm sm:text-base text-foreground leading-relaxed font-sans">
              ArchePal ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application ArchePal (the "App"). Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the App.
            </p>
          </CardContent>
        </Card>

        {/* Information We Collect */}
        <Card className="border-border/50">
          <CardContent className="p-4 sm:p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Database className="w-5 h-5 text-blue-500" />
              </div>
              <h2 className="text-lg sm:text-xl font-semibold font-heading">Information We Collect</h2>
            </div>

            <div className="space-y-4 text-sm sm:text-base text-foreground font-sans">
              <div>
                <h3 className="font-semibold mb-2">Personal Information</h3>
                <p className="text-muted-foreground leading-relaxed">
                  When you create an account, we may collect your name, email address, and profile information that you voluntarily provide to us.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Location Data</h3>
                <p className="text-muted-foreground leading-relaxed">
                  With your permission, we collect location data to help you document archaeological sites and artifacts. You can enable or disable location services at any time through your device settings.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Camera and Photos</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We request access to your camera and photo library to allow you to capture and upload images of archaeological finds and sites. Photos are only accessed when you explicitly choose to take or upload them.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Usage Data</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We automatically collect certain information when you use the App, including your device type, operating system, and app usage patterns to improve our services.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* How We Use Your Information */}
        <Card className="border-border/50">
          <CardContent className="p-4 sm:p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                <Eye className="w-5 h-5 text-green-500" />
              </div>
              <h2 className="text-lg sm:text-xl font-semibold font-heading">How We Use Your Information</h2>
            </div>

            <ul className="space-y-2 text-sm sm:text-base text-muted-foreground font-sans list-disc list-inside">
              <li>To provide and maintain the App's functionality</li>
              <li>To enable you to document and share archaeological discoveries</li>
              <li>To facilitate communication between researchers and archaeologists</li>
              <li>To improve and personalize your experience</li>
              <li>To send you updates and notifications (with your consent)</li>
              <li>To respond to your inquiries and support requests</li>
              <li>To comply with legal obligations</li>
            </ul>
          </CardContent>
        </Card>

        {/* Data Storage and Security */}
        <Card className="border-border/50">
          <CardContent className="p-4 sm:p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center">
                <Lock className="w-5 h-5 text-orange-500" />
              </div>
              <h2 className="text-lg sm:text-xl font-semibold font-heading">Data Storage and Security</h2>
            </div>

            <div className="space-y-3 text-sm sm:text-base text-muted-foreground font-sans leading-relaxed">
              <p>
                We use industry-standard security measures to protect your personal information. Your data is stored securely using Firebase, a Google Cloud service, which employs encryption and secure data centers.
              </p>
              <p>
                While we strive to protect your personal information, no method of transmission over the Internet or electronic storage is 100% secure. We cannot guarantee absolute security.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Third-Party Services */}
        <Card className="border-border/50">
          <CardContent className="p-4 sm:p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                <UserCheck className="w-5 h-5 text-purple-500" />
              </div>
              <h2 className="text-lg sm:text-xl font-semibold font-heading">Third-Party Services</h2>
            </div>

            <div className="space-y-3 text-sm sm:text-base text-muted-foreground font-sans leading-relaxed">
              <p>Our App may use third-party services that collect information:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Firebase (Google) - for authentication and data storage</li>
                <li>Google Maps - for location and mapping services</li>
              </ul>
              <p>
                These services have their own privacy policies, and we encourage you to review them.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Your Rights */}
        <Card className="border-border/50">
          <CardContent className="p-4 sm:p-6 space-y-4">
            <h2 className="text-lg sm:text-xl font-semibold font-heading">Your Rights</h2>

            <div className="space-y-3 text-sm sm:text-base text-muted-foreground font-sans leading-relaxed">
              <p>You have the right to:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Access your personal data</li>
                <li>Correct inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Withdraw consent for data processing</li>
                <li>Export your data</li>
                <li>Opt-out of marketing communications</li>
              </ul>
              <p>
                To exercise these rights, please contact us using the information provided below.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Children's Privacy */}
        <Card className="border-border/50">
          <CardContent className="p-4 sm:p-6 space-y-4">
            <h2 className="text-lg sm:text-xl font-semibold font-heading">Children's Privacy</h2>

            <p className="text-sm sm:text-base text-muted-foreground font-sans leading-relaxed">
              The App is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us so we can delete such information.
            </p>
          </CardContent>
        </Card>

        {/* Changes to This Policy */}
        <Card className="border-border/50">
          <CardContent className="p-4 sm:p-6 space-y-4">
            <h2 className="text-lg sm:text-xl font-semibold font-heading">Changes to This Privacy Policy</h2>

            <p className="text-sm sm:text-base text-muted-foreground font-sans leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. You are advised to review this Privacy Policy periodically for any changes.
            </p>
          </CardContent>
        </Card>

        {/* Contact Us */}
        <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <CardContent className="p-4 sm:p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-lg sm:text-xl font-semibold font-heading">Contact Us</h2>
            </div>

            <div className="text-sm sm:text-base text-foreground font-sans leading-relaxed">
              <p>If you have any questions about this Privacy Policy, please contact us:</p>
              <div className="mt-3 space-y-1">
                <p><strong>App Name:</strong> ArchePal</p>
                <p><strong>Email:</strong> support@archepal.com</p>
                <p><strong>Website:</strong> https://archepal.com</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer spacing */}
        <div className="h-4" />
      </div>
    </div>
  );
}
