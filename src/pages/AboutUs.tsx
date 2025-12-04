import { ResponsiveLayout } from "@/components/ResponsiveLayout";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Users, Lightbulb, Globe } from "lucide-react";

export default function AboutUs() {
  return (
    <ResponsiveLayout>
      <header className="bg-card/95 backdrop-blur-lg px-4 py-4 sm:px-6 border-b border-border sticky top-0 z-40 lg:static">
        <PageHeader />
      </header>

      <div className="p-4 sm:p-6 lg:p-8 space-y-6 animate-fade-in mx-auto max-w-7xl">
          {/* Hero Section */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-primary/10">
              <Heart className="w-7 h-7 sm:w-8 sm:h-8 text-primary" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-heading">About ArchePal</h1>
            <p className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto font-sans">
              Empowering archaeologists with modern technology for research and preservation
            </p>
          </div>

          {/* Mission Card */}
          <Card className="border-border/50">
            <CardContent className="p-4 sm:p-6">
              <p className="text-sm sm:text-base text-foreground leading-relaxed font-sans">
                ArchePal is an organization of people dedicated to helping archaeologists with using technology. Our team consists of passionate individuals who believe in the power of technology to transform archaeological research and preservation.
              </p>
            </CardContent>
          </Card>

          {/* Quote Card */}
          <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <CardContent className="p-4 sm:p-6">
              <blockquote className="text-sm sm:text-base italic text-foreground font-serif">
                "I love the way you've integrated so much into this application"
              </blockquote>
              <p className="text-xs sm:text-sm text-muted-foreground mt-2 font-medium font-sans">
                — Dr. Jim Gibb
              </p>
            </CardContent>
          </Card>

          {/* Values Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            <Card className="border-border/50 p-3 sm:p-4">
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <Lightbulb className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
                </div>
                <h3 className="font-semibold text-xs sm:text-sm font-sans">Innovation</h3>
                <p className="text-[10px] sm:text-xs text-muted-foreground font-sans">Modern solutions for ancient discoveries</p>
              </div>
            </Card>

            <Card className="border-border/50 p-3 sm:p-4">
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                  <Users className="w-5 h-5 sm:w-6 sm:h-6 text-green-500" />
                </div>
                <h3 className="font-semibold text-xs sm:text-sm font-sans">Collaboration</h3>
                <p className="text-[10px] sm:text-xs text-muted-foreground font-sans">Connecting researchers worldwide</p>
              </div>
            </Card>

            <Card className="border-border/50 p-3 sm:p-4">
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-orange-500/10 flex items-center justify-center">
                  <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500" />
                </div>
                <h3 className="font-semibold text-xs sm:text-sm font-sans">Preservation</h3>
                <p className="text-[10px] sm:text-xs text-muted-foreground font-sans">Protecting cultural heritage</p>
              </div>
            </Card>

            <Card className="border-border/50 p-3 sm:p-4">
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-purple-500/10 flex items-center justify-center">
                  <Globe className="w-5 h-5 sm:w-6 sm:h-6 text-purple-500" />
                </div>
                <h3 className="font-semibold text-xs sm:text-sm font-sans">Accessibility</h3>
                <p className="text-[10px] sm:text-xs text-muted-foreground font-sans">Open to all researchers</p>
              </div>
            </Card>
          </div>
      </div>
    </ResponsiveLayout>
  );
}