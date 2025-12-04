import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Loader2 } from "lucide-react";
import { useSites } from "@/hooks/use-sites";
import { useAuth } from "@/hooks/use-auth";
import { useArchaeologist } from "@/hooks/use-archaeologist";
import { ArchaeologistService } from "@/services/archaeologists";
import { Timestamp } from "firebase/firestore";
import { useState, useEffect } from "react";

export const ActiveProject = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isArchaeologist } = useArchaeologist();
  const { sites, loading } = useSites();
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [fetchingActiveProject, setFetchingActiveProject] = useState(false);

  // Fetch active project ID for archaeologist
  useEffect(() => {
    const fetchActiveProject = async () => {
      if (user && isArchaeologist) {
        try {
          setFetchingActiveProject(true);
          const activeId = await ArchaeologistService.getActiveProjectId(user.uid);
          setActiveProjectId(activeId);
        } catch (error) {
          console.error("Error fetching active project:", error);
        } finally {
          setFetchingActiveProject(false);
        }
      }
    };

    fetchActiveProject();
  }, [user, isArchaeologist]);

  // For archaeologists: show their active project + 2 latest sites
  // For non-archaeologists: show 2 latest sites
  const getDisplaySites = () => {
    if (isArchaeologist && activeProjectId) {
      // Find the active project
      const activeProject = sites.find(site => site.id === activeProjectId);

      // Get latest sites sorted by creation date, excluding the active project
      const latestSites = sites
        .filter(site => site.id !== activeProjectId)
        .sort((a, b) => {
          const dateA = a.createdAt instanceof Timestamp ? a.createdAt.toDate() : a.createdAt;
          const dateB = b.createdAt instanceof Timestamp ? b.createdAt.toDate() : b.createdAt;
          return (dateB?.getTime() || 0) - (dateA?.getTime() || 0);
        })
        .slice(0, 2);

      // Return active project first, then latest sites
      return activeProject ? [activeProject, ...latestSites] : latestSites;
    } else {
      // Show 2 most recent sites
      return sites
        .sort((a, b) => {
          const dateA = a.createdAt instanceof Timestamp ? a.createdAt.toDate() : a.createdAt;
          const dateB = b.createdAt instanceof Timestamp ? b.createdAt.toDate() : b.createdAt;
          return (dateB?.getTime() || 0) - (dateA?.getTime() || 0);
        })
        .slice(0, 2);
    }
  };

  const displaySites = getDisplaySites();

  const formatDate = (date: Date | Timestamp | undefined) => {
    if (!date) return "Unknown date";
    const d = date instanceof Timestamp ? date.toDate() : date;
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  const getLocationDisplay = (site: any) => {
    const parts = [];
    if (site.location?.region) parts.push(site.location.region);
    if (site.location?.country) parts.push(site.location.country);
    return parts.join(", ") || "Location not specified";
  };

  if (loading || fetchingActiveProject) {
    return (
      <div className="px-3 py-4 sm:px-4 sm:py-5 md:px-6 md:py-6 lg:px-8 lg:py-8 bg-muted/30">
        <div className="max-w-7xl mx-auto flex items-center justify-center py-8 md:py-12">
          <Loader2 className="w-6 h-6 md:w-8 md:h-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  return (
    <div className="px-3 py-4 sm:px-4 sm:py-5 md:px-6 md:py-6 lg:px-8 lg:py-8 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-3 md:mb-4 lg:mb-5">
          <h3 className="text-h3 font-bold text-foreground font-heading leading-tight tracking-tight">
            {isArchaeologist && activeProjectId ? "Active Project & Recent Sites" : "Recent Sites"}
          </h3>
          <button
            onClick={() => navigate("/site-lists")}
            className="text-body-sm text-primary font-medium hover:underline font-sans"
          >
            View All
          </button>
        </div>

        {displaySites.length === 0 ? (
          <Card className="p-6 md:p-8 lg:p-12 border-border/50 text-center">
            <p className="text-muted-foreground text-body font-sans leading-normal">No sites available</p>
          </Card>
        ) : (
          /* Responsive grid: 1 col on mobile, 2 cols on md, 3 cols on lg */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 lg:gap-5">
            {displaySites.map((site, index) => {
              const isActiveProject = isArchaeologist && site.id === activeProjectId;
              return (
              <Card
                key={site.id}
                className="p-3 sm:p-4 md:p-5 border-border/50 hover:shadow-lg active:scale-[0.99] lg:active:scale-100 lg:hover:-translate-y-1 transition-all duration-200 cursor-pointer animate-slide-up group"
                style={{ animationDelay: `${index * 75}ms` }}
                onClick={() => navigate(`/site/${site.id}`)}
              >
                <div className="flex gap-3 md:gap-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 bg-muted rounded-lg md:rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden group-hover:scale-105 transition-transform">
                    {site.images && site.images.length > 0 ? (
                      <img
                        src={site.images[0]}
                        alt={site.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.onerror = null;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            parent.innerHTML = '<span class="text-2xl md:text-3xl lg:text-4xl">🏛️</span>';
                          }
                        }}
                      />
                    ) : (
                      <span className="text-2xl md:text-3xl lg:text-4xl">🏛️</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1.5 md:mb-2">
                      <h4 className="text-h4 font-semibold text-foreground line-clamp-1 font-sans leading-snug group-hover:text-primary transition-colors">{site.name}</h4>
                      {isActiveProject && (
                        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 flex-shrink-0 text-micro font-medium">
                          Active
                        </Badge>
                      )}
                    </div>
                    <div className="space-y-0.5 md:space-y-1">
                      <div className="flex items-center gap-1 md:gap-1.5 text-caption text-muted-foreground font-sans leading-snug">
                        <MapPin className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
                        <span className="truncate">{getLocationDisplay(site)}</span>
                      </div>
                      <div className="flex items-center gap-1 md:gap-1.5 text-caption text-muted-foreground font-sans leading-snug">
                        <Calendar className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
                        <span>Discovered: {formatDate(site.dateDiscovered)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
