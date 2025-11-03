import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search, MapPin, Calendar, Filter, Grid3X3, List, Download, Share2, Star, Info, Clock, Layers } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";

const artifacts = [
  {
    id: "ART-001",
    name: "Roman Gold Aureus",
    type: "Coin",
    period: "Imperial Roman",
    date: "117-138 CE",
    material: "Gold",
    dimensions: "19mm diameter, 7.3g",
    location: "Sector A, Grid 23",
    excavationDate: "2025-01-15",
    catalogDate: "2025-01-16",
    condition: "Excellent",
    conservationStatus: "Completed",
    description: "Gold aureus featuring Emperor Hadrian. Obverse shows laureate bust, reverse depicts Felicitas holding caduceus.",
    findContext: "Found in villa floor foundation, likely part of a hoard",
    significance: "High",
    image: "🪙",
    images: 5,
    scans3D: true,
    analysisComplete: true,
    displayLocation: "Main Gallery, Case 3",
    registrationNumber: "2025.001.023",
    finder: "Dr. Sarah Johnson",
    tags: ["Roman", "Gold", "Imperial", "Currency"]
  },
  {
    id: "ART-002",
    name: "Terracotta Oil Lamp",
    type: "Ceramic",
    period: "Roman",
    date: "1st-2nd century CE",
    material: "Terracotta",
    dimensions: "12cm x 8cm x 4cm",
    location: "Sector B, Grid 45",
    excavationDate: "2025-01-10",
    catalogDate: "2025-01-11",
    condition: "Good",
    conservationStatus: "In Progress",
    conservationProgress: 65,
    description: "Roman oil lamp with gladiator scene on discus. Single nozzle type with ring handle.",
    findContext: "Domestic context, found near hearth remains",
    significance: "Medium",
    image: "🏺",
    images: 3,
    scans3D: false,
    analysisComplete: true,
    displayLocation: "Storage Room B",
    registrationNumber: "2025.001.018",
    finder: "Emma Rodriguez",
    tags: ["Roman", "Ceramic", "Domestic", "Lighting"]
  },
  {
    id: "ART-003",
    name: "Iron Spatha Blade",
    type: "Weapon",
    period: "Late Roman",
    date: "3rd-4th century CE",
    material: "Iron",
    dimensions: "82cm length, 5cm width",
    location: "Sector D, Grid 67",
    excavationDate: "2024-12-28",
    catalogDate: "2024-12-29",
    condition: "Fair",
    conservationStatus: "Pending",
    description: "Double-edged cavalry sword blade, pattern-welded construction visible after initial cleaning.",
    findContext: "Military context, found with other weapon fragments",
    significance: "High",
    image: "⚔️",
    images: 4,
    scans3D: true,
    analysisComplete: false,
    displayLocation: "Conservation Lab",
    registrationNumber: "2024.012.145",
    finder: "Prof. Michael Chen",
    tags: ["Roman", "Military", "Iron", "Weapon"]
  },
  {
    id: "ART-004",
    name: "Glass Unguentarium",
    type: "Glass",
    period: "Roman",
    date: "1st century CE",
    material: "Glass",
    dimensions: "7cm height, 3cm diameter",
    location: "Sector A, Grid 19",
    excavationDate: "2025-01-18",
    catalogDate: "2025-01-19",
    condition: "Excellent",
    conservationStatus: "Completed",
    description: "Small blue-green glass perfume bottle, intact with iridescent patina.",
    findContext: "Burial context, grave goods",
    significance: "Medium",
    image: "🍶",
    images: 2,
    scans3D: false,
    analysisComplete: true,
    displayLocation: "Main Gallery, Case 5",
    registrationNumber: "2025.001.031",
    finder: "James Wilson",
    tags: ["Roman", "Glass", "Burial", "Container"]
  },
  {
    id: "ART-005",
    name: "Bronze Fibula",
    type: "Personal Ornament",
    period: "Roman",
    date: "2nd century CE",
    material: "Bronze",
    dimensions: "6cm length",
    location: "Sector C, Grid 34",
    excavationDate: "2025-01-12",
    catalogDate: "2025-01-13",
    condition: "Good",
    conservationStatus: "Completed",
    description: "Knee fibula type with geometric decoration on the bow. Pin intact.",
    findContext: "Domestic context, personal quarters",
    significance: "Low",
    image: "📎",
    images: 3,
    scans3D: true,
    analysisComplete: true,
    displayLocation: "Study Collection",
    registrationNumber: "2025.001.024",
    finder: "Dr. Sarah Johnson",
    tags: ["Roman", "Bronze", "Jewelry", "Personal"]
  },
  {
    id: "ART-006",
    name: "Marble Portrait Head",
    type: "Sculpture",
    period: "Roman",
    date: "2nd century CE",
    material: "Marble",
    dimensions: "28cm height",
    location: "Sector A, Grid 12",
    excavationDate: "2025-01-08",
    catalogDate: "2025-01-09",
    condition: "Good",
    conservationStatus: "In Progress",
    conservationProgress: 40,
    description: "Portrait head of unknown individual, possibly local dignitary. Traces of original paint visible.",
    findContext: "Villa context, found in collapsed peristyle",
    significance: "Very High",
    image: "🗿",
    images: 8,
    scans3D: true,
    analysisComplete: false,
    displayLocation: "Conservation Lab",
    registrationNumber: "2025.001.012",
    finder: "Dr. Lisa Zhang",
    tags: ["Roman", "Sculpture", "Marble", "Portrait"]
  },
  {
    id: "ART-007",
    name: "Ceramic Amphora Fragment",
    type: "Ceramic",
    period: "Roman",
    date: "1st-2nd century CE",
    material: "Ceramic",
    dimensions: "32cm x 18cm",
    location: "Sector B, Grid 51",
    excavationDate: "2025-01-14",
    catalogDate: "2025-01-15",
    condition: "Fragment",
    conservationStatus: "Completed",
    description: "Dressel 20 amphora body fragment with stamp 'L.F.C'. Spanish olive oil transport vessel.",
    findContext: "Storage area context",
    significance: "Low",
    image: "🏺",
    images: 2,
    scans3D: false,
    analysisComplete: true,
    displayLocation: "Storage Room A",
    registrationNumber: "2025.001.027",
    finder: "Emma Rodriguez",
    tags: ["Roman", "Ceramic", "Trade", "Storage"]
  },
  {
    id: "ART-008",
    name: "Bone Hair Pin",
    type: "Personal Ornament",
    period: "Roman",
    date: "2nd-3rd century CE",
    material: "Bone",
    dimensions: "9cm length",
    location: "Sector C, Grid 42",
    excavationDate: "2025-01-17",
    catalogDate: "2025-01-18",
    condition: "Excellent",
    conservationStatus: "Completed",
    description: "Decorated bone hairpin with carved female bust finial.",
    findContext: "Domestic context, bedroom area",
    significance: "Medium",
    image: "🦴",
    images: 2,
    scans3D: false,
    analysisComplete: true,
    displayLocation: "Main Gallery, Case 7",
    registrationNumber: "2025.001.029",
    finder: "James Wilson",
    tags: ["Roman", "Bone", "Personal", "Cosmetic"]
  }
];

const periods = ["All", "Imperial Roman", "Roman", "Late Roman"];
const types = ["All", "Coin", "Ceramic", "Weapon", "Glass", "Personal Ornament", "Sculpture"];
const conditions = ["All", "Excellent", "Good", "Fair", "Fragment"];

const Artifacts = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedPeriod, setSelectedPeriod] = useState("All");
  const [selectedType, setSelectedType] = useState("All");
  const [sortBy, setSortBy] = useState("recent");

  const filteredArtifacts = artifacts.filter(artifact => {
    if (selectedPeriod !== "All" && artifact.period !== selectedPeriod) return false;
    if (selectedType !== "All" && artifact.type !== selectedType) return false;
    return true;
  });

  const sortedArtifacts = [...filteredArtifacts].sort((a, b) => {
    switch (sortBy) {
      case "recent":
        return new Date(b.excavationDate).getTime() - new Date(a.excavationDate).getTime();
      case "oldest":
        return new Date(a.excavationDate).getTime() - new Date(b.excavationDate).getTime();
      case "name":
        return a.name.localeCompare(b.name);
      case "significance":
        const sigOrder = { "Very High": 0, "High": 1, "Medium": 2, "Low": 3 };
        return sigOrder[a.significance as keyof typeof sigOrder] - sigOrder[b.significance as keyof typeof sigOrder];
      default:
        return 0;
    }
  });

  const getSignificanceColor = (significance: string) => {
    switch (significance) {
      case "Very High": return "bg-red-500/10 text-red-500 border-red-500/20";
      case "High": return "bg-orange-500/10 text-orange-500 border-orange-500/20";
      case "Medium": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "Low": return "bg-gray-500/10 text-gray-500 border-gray-500/20";
      default: return "";
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case "Excellent": return "bg-green-500/10 text-green-500 border-green-500/20";
      case "Good": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "Fair": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "Fragment": return "bg-gray-500/10 text-gray-500 border-gray-500/20";
      default: return "";
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-md mx-auto">
        <header className="bg-card p-4 border-b border-border sticky top-0 z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/")}
                className="hover:bg-muted"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <h1 className="text-xl font-semibold text-foreground">Artifacts</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
                className="hover:bg-muted"
              >
                {viewMode === "grid" ? <List className="w-5 h-5" /> : <Grid3X3 className="w-5 h-5" />}
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-muted">
                <Filter className="w-5 h-5" />
              </Button>
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search artifacts, ID, materials..."
              className="pl-10 border-border"
            />
          </div>
        </header>

        <div className="px-4 pt-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                {sortedArtifacts.length} artifacts
              </Badge>
              <Badge variant="outline" className="text-xs">
                {artifacts.filter(a => a.conservationStatus === "In Progress").length} in conservation
              </Badge>
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-32 h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="name">Name A-Z</SelectItem>
                <SelectItem value="significance">Significance</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Tabs defaultValue="All" className="w-full">
            <TabsList className="w-full justify-start overflow-x-auto flex-nowrap h-auto p-0 bg-transparent border-b rounded-none mb-4">
              {periods.map((period) => (
                <TabsTrigger
                  key={period}
                  value={period}
                  onClick={() => setSelectedPeriod(period)}
                  className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 pb-3"
                >
                  {period}
                </TabsTrigger>
              ))}
            </TabsList>

            <div className="mb-4">
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  {types.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {viewMode === "grid" ? (
              <div className="grid grid-cols-2 gap-3">
                {sortedArtifacts.map((artifact) => (
                  <Card key={artifact.id} className="p-3 border-border hover:shadow-md transition-all cursor-pointer">
                    <div className="aspect-square bg-muted rounded-lg flex items-center justify-center mb-2">
                      <span className="text-4xl">{artifact.image}</span>
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-semibold text-sm text-foreground line-clamp-1">
                        {artifact.name}
                      </h3>
                      <p className="text-xs text-muted-foreground">{artifact.id}</p>
                      <div className="flex flex-wrap gap-1">
                        <Badge variant="outline" className={`text-xs ${getSignificanceColor(artifact.significance)}`}>
                          {artifact.significance}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {artifact.type}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{artifact.period}</p>
                    </div>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t">
                      <div className="flex items-center gap-1">
                        {artifact.scans3D && <Layers className="w-3 h-3 text-primary" />}
                        <span className="text-xs text-muted-foreground">{artifact.images} imgs</span>
                      </div>
                      <Star className="w-3 h-3 text-muted-foreground" />
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {sortedArtifacts.map((artifact) => (
                  <Card key={artifact.id} className="p-4 border-border hover:shadow-md transition-all cursor-pointer">
                    <div className="flex gap-3">
                      <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-2xl">{artifact.image}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-1">
                          <div>
                            <h3 className="font-semibold text-foreground">
                              {artifact.name}
                            </h3>
                            <p className="text-xs text-muted-foreground">{artifact.id} • {artifact.registrationNumber}</p>
                          </div>
                          <Button variant="ghost" size="icon" className="h-6 w-6">
                            <Info className="w-3 h-3" />
                          </Button>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex flex-wrap gap-1">
                            <Badge variant="outline" className={`text-xs ${getSignificanceColor(artifact.significance)}`}>
                              {artifact.significance}
                            </Badge>
                            <Badge variant="outline" className={`text-xs ${getConditionColor(artifact.condition)}`}>
                              {artifact.condition}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              {artifact.type}
                            </Badge>
                          </div>

                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {artifact.description}
                          </p>

                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {artifact.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {artifact.date}
                            </span>
                          </div>

                          {artifact.conservationStatus === "In Progress" && (
                            <div className="space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-muted-foreground">Conservation Progress</span>
                                <span className="text-xs font-medium">{artifact.conservationProgress}%</span>
                              </div>
                              <Progress value={artifact.conservationProgress} className="h-1.5" />
                            </div>
                          )}

                          <div className="flex items-center justify-between pt-2 border-t">
                            <div className="flex items-center gap-2">
                              {artifact.scans3D && (
                                <Badge variant="outline" className="text-xs">
                                  <Layers className="w-3 h-3 mr-1" />
                                  3D Scan
                                </Badge>
                              )}
                              <span className="text-xs text-muted-foreground">{artifact.images} images</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Button variant="ghost" size="icon" className="h-6 w-6">
                                <Share2 className="w-3 h-3" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-6 w-6">
                                <Download className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            <span>Found by {artifact.finder} on {new Date(artifact.excavationDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </Tabs>
        </div>

        <BottomNav />
      </div>
    </div>
  );
};

export default Artifacts;