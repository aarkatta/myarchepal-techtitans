import { useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Calendar, Users, FileText, Search } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

const sites = [
  {
    id: 1,
    name: "Pompeii Excavation Site",
    location: "Pompeii, Italy",
    status: "active",
    findings: 1247,
    teamSize: 12,
    startDate: "2020-03-15",
    lastActivity: "2 days ago",
    image: "🏛️"
  },
  {
    id: 2,
    name: "Stonehenge Research Area",
    location: "Wiltshire, England",
    status: "active",
    findings: 892,
    teamSize: 8,
    startDate: "2021-06-01",
    lastActivity: "1 week ago",
    image: "🪨"
  },
  {
    id: 3,
    name: "Valley of the Kings",
    location: "Luxor, Egypt",
    status: "active",
    findings: 2156,
    teamSize: 15,
    startDate: "2019-09-10",
    lastActivity: "3 days ago",
    image: "⚱️"
  },
  {
    id: 4,
    name: "Machu Picchu Survey",
    location: "Cusco, Peru",
    status: "planning",
    findings: 0,
    teamSize: 6,
    startDate: "2025-04-01",
    lastActivity: "2 weeks ago",
    image: "🏔️"
  },
  {
    id: 5,
    name: "Chichen Itza Analysis",
    location: "Yucatan, Mexico",
    status: "completed",
    findings: 345,
    teamSize: 5,
    startDate: "2022-01-15",
    lastActivity: "3 months ago",
    image: "🔺"
  },
];

const SiteLists = () => {
  const navigate = useNavigate();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-success/10 text-success border-success/20";
      case "planning": return "bg-warning/10 text-warning border-warning/20";
      case "completed": return "bg-muted-foreground/10 text-muted-foreground border-muted-foreground/20";
      default: return "";
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-md mx-auto">
        <header className="bg-card p-4 border-b border-border sticky top-0 z-10">
          <div className="flex items-center gap-3 mb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/")}
              className="hover:bg-muted"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-semibold text-foreground">Site Lists</h1>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search sites..."
              className="pl-10 border-border"
            />
          </div>

          <div className="grid grid-cols-3 gap-3 mt-4">
            <Card className="p-3 border-border text-center">
              <p className="text-2xl font-bold text-primary">{sites.length}</p>
              <p className="text-xs text-muted-foreground">Total Sites</p>
            </Card>
            <Card className="p-3 border-border text-center">
              <p className="text-2xl font-bold text-success">
                {sites.filter(s => s.status === 'active').length}
              </p>
              <p className="text-xs text-muted-foreground">Active</p>
            </Card>
            <Card className="p-3 border-border text-center">
              <p className="text-2xl font-bold text-foreground">
                {sites.reduce((sum, s) => sum + s.findings, 0)}
              </p>
              <p className="text-xs text-muted-foreground">Findings</p>
            </Card>
          </div>
        </header>

        <div className="p-4 space-y-3">
          {sites.map((site) => (
            <Card 
              key={site.id} 
              className="p-4 border-border hover:shadow-md transition-all cursor-pointer"
            >
              <div className="flex gap-3">
                <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-3xl">{site.image}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-semibold text-foreground line-clamp-1">
                      {site.name}
                    </h3>
                    <Badge variant="outline" className={getStatusColor(site.status)}>
                      <span className="capitalize">{site.status}</span>
                    </Badge>
                  </div>
                  
                  <div className="space-y-1 mb-3">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      <span>{site.location}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      <span>{site.lastActivity}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <FileText className="w-3 h-3" />
                        <span>{site.findings}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        <span>{site.teamSize}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <BottomNav />
      </div>
    </div>
  );
};

export default SiteLists;
