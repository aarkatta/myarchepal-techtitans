import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, Image as ImageIcon, MapPin, Calendar, Ruler, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const siteTypes = ["Settlement", "Burial Ground", "Temple", "Fort", "Villa", "Theater", "Bath Complex", "Industrial", "Other"];
const periods = ["Imperial Roman", "Roman", "Late Roman", "Byzantine", "Medieval", "Other"];
const conditions = ["Excellent", "Good", "Fair", "Poor", "Ruined"];
const significance = ["Very High", "High", "Medium", "Low"];

const NewSite = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    period: "",
    location: "",
    coordinates: "",
    discoveryDate: new Date().toISOString().split('T')[0],
    area: "",
    condition: "",
    description: "",
    features: "",
    significance: "",
    accessibility: "",
    tags: "",
    leadArchaeologist: "",
    image: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Site Logged",
      description: "The archaeological site has been successfully added to the database.",
    });
    navigate("/sites");
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-md mx-auto">
        <header className="bg-card p-4 border-b border-border sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="hover:bg-muted"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-semibold text-foreground">Log Archaeological Site</h1>
          </div>
        </header>

        <div className="p-4 space-y-6">
          <Card className="p-6 border-border">
            <div className="flex items-center justify-center h-48 bg-muted rounded-lg mb-4 cursor-pointer hover:bg-muted/80 transition-colors">
              <div className="text-center">
                <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Add site image or emoji</p>
              </div>
            </div>
            <Button variant="outline" className="w-full" size="sm">
              <Upload className="w-4 h-4 mr-2" />
              Upload Image
            </Button>
          </Card>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-foreground">Site Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Roman Villa Complex at Ephesus"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="border-border"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type" className="text-foreground">Site Type *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger className="border-border">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {siteTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="period" className="text-foreground">Period *</Label>
                <Select
                  value={formData.period}
                  onValueChange={(value) => setFormData({ ...formData, period: value })}
                >
                  <SelectTrigger className="border-border">
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    {periods.map((period) => (
                      <SelectItem key={period} value={period}>
                        {period}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="text-foreground">Location *</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="location"
                  placeholder="e.g., Near Ephesus, Turkey"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  required
                  className="pl-10 border-border"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="coordinates" className="text-foreground">GPS Coordinates</Label>
              <Input
                id="coordinates"
                placeholder="e.g., 37.9395° N, 27.3418° E"
                value={formData.coordinates}
                onChange={(e) => setFormData({ ...formData, coordinates: e.target.value })}
                className="border-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="discoveryDate" className="text-foreground">Discovery Date *</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="discoveryDate"
                  type="date"
                  value={formData.discoveryDate}
                  onChange={(e) => setFormData({ ...formData, discoveryDate: e.target.value })}
                  required
                  className="pl-10 border-border"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="area" className="text-foreground">Area/Size</Label>
                <div className="relative">
                  <Ruler className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="area"
                    placeholder="e.g., 2.5 hectares"
                    value={formData.area}
                    onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                    className="pl-10 border-border"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="condition" className="text-foreground">Condition *</Label>
                <Select
                  value={formData.condition}
                  onValueChange={(value) => setFormData({ ...formData, condition: value })}
                >
                  <SelectTrigger className="border-border">
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    {conditions.map((condition) => (
                      <SelectItem key={condition} value={condition}>
                        {condition}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="significance" className="text-foreground">Significance *</Label>
              <Select
                value={formData.significance}
                onValueChange={(value) => setFormData({ ...formData, significance: value })}
              >
                <SelectTrigger className="border-border">
                  <SelectValue placeholder="Select significance level" />
                </SelectTrigger>
                <SelectContent>
                  {significance.map((sig) => (
                    <SelectItem key={sig} value={sig}>
                      {sig}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-foreground">Description *</Label>
              <Textarea
                id="description"
                placeholder="Detailed description of the site, historical context, notable characteristics..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                className="min-h-32 border-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="features" className="text-foreground">Key Features</Label>
              <Textarea
                id="features"
                placeholder="Notable features found at the site (e.g., mosaic floors, columns, pottery, coins...)"
                value={formData.features}
                onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                className="min-h-24 border-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="accessibility" className="text-foreground">Accessibility</Label>
              <Textarea
                id="accessibility"
                placeholder="Access information, permissions required, safety considerations..."
                value={formData.accessibility}
                onChange={(e) => setFormData({ ...formData, accessibility: e.target.value })}
                className="min-h-20 border-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="leadArchaeologist" className="text-foreground">Lead Archaeologist/Surveyor</Label>
              <Input
                id="leadArchaeologist"
                placeholder="Name of person leading the survey or excavation"
                value={formData.leadArchaeologist}
                onChange={(e) => setFormData({ ...formData, leadArchaeologist: e.target.value })}
                className="border-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags" className="text-foreground">Tags</Label>
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="tags"
                  placeholder="e.g., Roman, Urban, Excavated, Protected (comma-separated)"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="pl-10 border-border"
                />
              </div>
              <p className="text-xs text-muted-foreground">Separate multiple tags with commas</p>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1">
                Log Site
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewSite;