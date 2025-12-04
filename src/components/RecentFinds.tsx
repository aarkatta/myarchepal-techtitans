import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { ChevronRight, Loader2 } from "lucide-react";
import { ArtifactsService, Artifact } from "@/services/artifacts";
import { Timestamp } from "firebase/firestore";

export const RecentFinds = () => {
  const navigate = useNavigate();
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtifacts = async () => {
      try {
        setLoading(true);
        const allArtifacts = await ArtifactsService.getAllArtifacts();
        setArtifacts(allArtifacts);
      } catch (error) {
        console.error("Error fetching artifacts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArtifacts();
  }, []);

  // Get the 4 most recently created artifacts (for 4-col layout on ultra-wide)
  const recentArtifacts = artifacts
    .sort((a, b) => {
      const dateA = a.createdAt instanceof Timestamp ? a.createdAt.toDate() : a.createdAt;
      const dateB = b.createdAt instanceof Timestamp ? b.createdAt.toDate() : b.createdAt;
      return (dateB?.getTime() || 0) - (dateA?.getTime() || 0);
    })
    .slice(0, 4);

  const formatDate = (date: Date | Timestamp | undefined) => {
    if (!date) return "Unknown date";
    const d = date instanceof Timestamp ? date.toDate() : date;
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours} hours ago`;
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const getArtifactIcon = (type: string) => {
    switch (type) {
      case 'Coin': return '🪙';
      case 'Ceramic': return '🏺';
      case 'Weapon': return '🗡️';
      case 'Glass': return '🍶';
      case 'Personal Ornament': return '📎';
      case 'Sculpture': return '🗿';
      default: return '🏺';
    }
  };

  if (loading) {
    return (
      <div className="px-3 py-4 sm:px-4 sm:py-5 md:px-6 md:py-6 lg:px-8 lg:py-8">
        <div className="max-w-7xl mx-auto flex items-center justify-center py-8 md:py-12">
          <Loader2 className="w-6 h-6 md:w-8 md:h-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  return (
    <div className="px-3 py-4 sm:px-4 sm:py-5 md:px-6 md:py-6 lg:px-8 lg:py-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-3 md:mb-4 lg:mb-5">
          <h3 className="text-h3 font-bold text-foreground font-heading leading-tight tracking-tight">
            Recent Artifacts
          </h3>
          <button
            onClick={() => navigate("/artifacts")}
            className="text-body-sm text-primary font-medium hover:underline font-sans"
          >
            See All
          </button>
        </div>

        {recentArtifacts.length === 0 ? (
          <Card className="p-6 md:p-8 lg:p-12 border-border/50 text-center">
            <p className="text-muted-foreground text-body font-sans leading-normal">No recent artifacts</p>
          </Card>
        ) : (
          /* Responsive grid: 1 col on mobile, 2 cols on md, 4 cols on 2xl */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-2.5 sm:gap-3 md:gap-4 lg:gap-5">
            {recentArtifacts.map((artifact, index) => (
              <Card
                key={artifact.id}
                className="p-3 md:p-4 hover:shadow-lg active:scale-[0.99] lg:active:scale-100 lg:hover:-translate-y-1 transition-all duration-200 cursor-pointer border-border/50 flex items-center justify-between animate-slide-up group"
                style={{ animationDelay: `${index * 75}ms` }}
                onClick={() => navigate(`/artifact/${artifact.id}`)}
              >
                <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-18 lg:h-18 2xl:w-20 2xl:h-20 bg-muted rounded-lg md:rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0 group-hover:scale-105 transition-transform duration-200">
                    {artifact.images && artifact.images.length > 0 ? (
                      <img
                        src={artifact.images[0]}
                        alt={artifact.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.onerror = null;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            parent.innerHTML = `<span class="text-2xl md:text-3xl lg:text-4xl">${getArtifactIcon(artifact.type)}</span>`;
                          }
                        }}
                      />
                    ) : (
                      <span className="text-2xl md:text-3xl lg:text-4xl">{getArtifactIcon(artifact.type)}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-h4 font-semibold text-foreground line-clamp-1 font-sans leading-snug group-hover:text-primary transition-colors">
                      {artifact.name}
                    </h4>
                    <div className="flex items-center gap-1 text-caption text-muted-foreground font-sans leading-snug">
                      <span className="truncate">{artifact.type} • {artifact.material}</span>
                    </div>
                    <div className="text-micro text-muted-foreground font-sans leading-snug">
                      {formatDate(artifact.createdAt)}
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-muted-foreground flex-shrink-0 group-hover:translate-x-1 transition-transform duration-200" />
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
