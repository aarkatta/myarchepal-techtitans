import { Users, Globe, Mail, Link2 } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { ResponsiveLayout } from "@/components/ResponsiveLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Contributor {
  id: number;
  name: string;
  role: string;
  avatar: string;
  initials: string;
  bio: string;
  specialization?: string;
  social?: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    website?: string;
    email?: string;
  };
}

const contributors: Contributor[] = [
  {
    id: 1,
    name: "Arjun Katta",
    role: "Lead Full-Stack Developer, And administrator of ArchePal",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=casey",
    initials: "AK",
    bio: "I Architected and developed the core infrastructure of Archepal. Led the implementation of the site management system, artifact catalog, and real-time collaboration features. Passionate about creating realworld solutions and byrani",
    specialization: "React, Node.js & Firebase, Python ",
    social: {
      github: "https://github.com/Ak-dude",
      linkedin: "https://linkedin.com",
      email: "alex.t@archepal.com"
    }
  },
  {
    id: 2,
    name: "Shreyan Sharma",
    role: "Lead UI/UX Designer",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=maya",
    initials: "SS",
    bio: "Built the responsive user interface and interactive components that make Archepal accessible on any device. Specialized in creating smooth animations and optimizing performance for large datasets. Focused on making complex archaeological data easy to explore and understand.",
    specialization: "React & TypeScript",
    social: {
      github: "https://github.com",
      twitter: "https://twitter.com",
      website: "https://example.com"
    }
  },
  {
    id: 3,
    name: "Aarush Mene",
    role: "Boilerplate developer with lovable code",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jordan",
    initials: "AM",
    bio: "Developed reasuable UI code for all of the team to use",
    specialization: "UI and UX",
    social: {
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      email: "jordan.l@archepal.com"
    }
  },
  {
    id: 4,
    name: "Sachin Senthil Kumar",
    role: "UI/UX design for reports",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=casey",
    initials: "SK",
    bio: "Designed the UI for the reports forum",
    specialization: "User Experience Design",
    social: {
      linkedin: "https://linkedin.com",
      twitter: "https://twitter.com",
      website: "https://example.com"
    }
  },
  {
    id: 5,
    name: "Anish Rudras",
    role: "N/A",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sam",
    initials: "",
    bio: "Helped with UI mockup",
    specialization: "UI/UX",
    social: {
      github: "https://github.com/rudras1",
      linkedin: "https://linkedin.com",
      email: "casey.m@archepal.com"
    }
  },
  {
    id: 6,
    name: "Atharav pardeshi",
    role: "Devloper Intern ",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=riley",
    initials: "RZ",
    bio: "Optimized Archepal for mobile devices and created Progressive Web App features for offline access. Ensures archaeologists can update field data even in remote locations without internet connectivity. Specialized in creating touch-friendly interfaces for tablets and smartphones.",
    specialization: "Progressive Web Apps",
    social: {
      github: "https://github.com",
      twitter: "https://twitter.com",
      email: "riley.z@archepal.com"
    }
  }
];

const Contributors = () => {
  const handleSocialClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <ResponsiveLayout>
      <header className="bg-card/95 backdrop-blur-lg px-4 py-4 sm:px-6 lg:px-8 border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto">
          <PageHeader />
        </div>
      </header>

      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="p-4 sm:p-6 lg:p-8 space-y-3 sm:space-y-4 animate-fade-in">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-full bg-primary/10 mb-3 sm:mb-4">
              <Users className="w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-primary" />
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-heading">Meet Our Developers</h1>
            <p className="text-sm sm:text-base lg:text-lg text-muted-foreground font-sans max-w-2xl mx-auto">
              The talented software engineers who built Archepal from the ground up
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="px-4 sm:px-6 lg:px-8 pb-4 sm:pb-6">
          <Card className="bg-primary/5 border-primary/20 max-w-2xl mx-auto hover:shadow-md transition-shadow">
            <CardContent className="pt-4 sm:pt-6">
              <div className="grid grid-cols-3 gap-3 sm:gap-4 lg:gap-6 text-center">
                <div>
                  <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary font-sans">{contributors.length}</div>
                  <div className="text-[10px] sm:text-xs lg:text-sm text-muted-foreground font-sans">Developers</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary font-sans">10K+</div>
                  <div className="text-[10px] sm:text-xs lg:text-sm text-muted-foreground font-sans">Lines of Code</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary font-sans">24/7</div>
                  <div className="text-[10px] sm:text-xs lg:text-sm text-muted-foreground font-sans">Uptime</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contributors List */}
        <div className="px-4 sm:px-6 lg:px-8 pb-4 sm:pb-6 space-y-4 sm:space-y-6">
          <div className="space-y-1 sm:space-y-2">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold font-heading">Development Team</h2>
            <p className="text-xs sm:text-sm lg:text-base text-muted-foreground font-sans">
              Meet the developers who brought Archepal to life with their technical expertise
            </p>
          </div>

          {/* Responsive grid for contributors */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
            {contributors.map((contributor, index) => (
              <Card
                key={contributor.id}
                className="hover:shadow-lg active:scale-[0.99] lg:active:scale-100 transition-all duration-200 animate-slide-up group"
                style={{ animationDelay: `${index * 75}ms` }}
              >
                <CardHeader className="pb-2 sm:pb-3 p-3 sm:p-6">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <Avatar className="w-12 h-12 sm:w-16 sm:h-16 lg:w-18 lg:h-18 border-2 border-primary/20 group-hover:scale-105 transition-transform">
                      <AvatarImage src={contributor.avatar} />
                      <AvatarFallback className="text-sm sm:text-lg font-semibold">
                        {contributor.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base sm:text-lg group-hover:text-primary transition-colors">{contributor.name}</CardTitle>
                      <CardDescription className="text-xs sm:text-sm">{contributor.role}</CardDescription>
                      {contributor.specialization && (
                        <Badge variant="secondary" className="mt-1.5 sm:mt-2 text-[10px] sm:text-xs">
                          {contributor.specialization}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 sm:space-y-4 p-3 sm:p-6 pt-0 sm:pt-0">
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {contributor.bio}
                  </p>

                  {/* Social Links */}
                  {contributor.social && (
                    <div className="flex items-center gap-2 pt-2 border-t border-border">
                      {contributor.social.github && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 lg:h-10 lg:w-10 hover:bg-primary/10"
                          onClick={() => handleSocialClick(contributor.social!.github!)}
                          title="GitHub"
                        >
                          <Link2 className="h-4 w-4 lg:h-5 lg:w-5" />
                        </Button>
                      )}
                      {contributor.social.linkedin && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 lg:h-10 lg:w-10 hover:bg-primary/10"
                          onClick={() => handleSocialClick(contributor.social!.linkedin!)}
                          title="LinkedIn"
                        >
                          <Link2 className="h-4 w-4 lg:h-5 lg:w-5" />
                        </Button>
                      )}
                      {contributor.social.twitter && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 lg:h-10 lg:w-10 hover:bg-primary/10"
                          onClick={() => handleSocialClick(contributor.social!.twitter!)}
                          title="Twitter"
                        >
                          <Link2 className="h-4 w-4 lg:h-5 lg:w-5" />
                        </Button>
                      )}
                      {contributor.social.website && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 lg:h-10 lg:w-10 hover:bg-primary/10"
                          onClick={() => handleSocialClick(contributor.social!.website!)}
                          title="Website"
                        >
                          <Globe className="h-4 w-4 lg:h-5 lg:w-5" />
                        </Button>
                      )}
                      {contributor.social.email && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 lg:h-10 lg:w-10 hover:bg-primary/10"
                          onClick={() => window.location.href = `mailto:${contributor.social!.email}`}
                          title="Email"
                        >
                          <Mail className="h-4 w-4 lg:h-5 lg:w-5" />
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Join Us Section */}
        <div className="px-4 sm:px-6 lg:px-8 pb-4 sm:pb-6">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 max-w-2xl mx-auto hover:shadow-md transition-shadow">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-base sm:text-lg lg:text-xl">Contact Us</CardTitle>
              <CardDescription className="text-xs sm:text-sm lg:text-base">
                Interested in contributing to Archepal? We're always looking for talented developers passionate about technology and cultural heritage.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
              <Button
                className="w-full h-10 sm:h-11 lg:h-12 text-sm lg:text-base active:scale-[0.98] transition-all hover:shadow-md"
                onClick={() => window.location.href = '/contact'}
              >
                <Mail className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
                Get in Touch
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </ResponsiveLayout>
  );
};

export default Contributors;
