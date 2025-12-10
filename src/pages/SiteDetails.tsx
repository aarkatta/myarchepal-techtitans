import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapPin, Calendar, Users, FileText, Edit, Share2, Loader2, ChevronRight, Satellite, WifiOff } from "lucide-react";
import { ResponsiveLayout } from "@/components/ResponsiveLayout";
import { PageHeader } from "@/components/PageHeader";
import { AccountButton } from "@/components/AccountButton";
import { SiteConditions } from "@/components/SiteConditions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SitesService, Site } from "@/services/sites";
import { ArtifactsService, Artifact } from "@/services/artifacts";
import { useAuth } from "@/hooks/use-auth";
import { useArchaeologist } from "@/hooks/use-archaeologist";
import { useToast } from "@/components/ui/use-toast";
import { Timestamp } from "firebase/firestore";
import { useNetworkStatus } from "@/hooks/use-network";
import { OfflineCacheService } from "@/services/offline-cache";
import { parseDate } from "@/lib/utils";

const SiteDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isArchaeologist } = useArchaeologist();
  const { toast } = useToast();
  const { isOnline } = useNetworkStatus();
  const [site, setSite] = useState<Site | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [siteArtifacts, setSiteArtifacts] = useState<Artifact[]>([]);
  const [artifactsLoading, setArtifactsLoading] = useState(false);
  const [usingCachedData, setUsingCachedData] = useState(false);
  const [networkChecked, setNetworkChecked] = useState(false);

  // Wait for network status to be determined before fetching
  useEffect(() => {
    // Small delay to allow network status to settle
    const timer = setTimeout(() => {
      setNetworkChecked(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Don't fetch until network status is determined
    if (!networkChecked) return;

    const fetchSite = async () => {
      if (!id) {
        setError("Site ID not found");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Try to get cached data first
        const { data: cachedSite } = await OfflineCacheService.getCachedSiteDetails(id);

        if (isOnline) {
          // Online: fetch fresh data
          try {
            const siteData = await SitesService.getSiteById(id);
            setSite(siteData);
            setUsingCachedData(false);
            // Cache the fresh data
            if (siteData) {
              await OfflineCacheService.cacheSiteDetails(id, siteData);
            }
          } catch (fetchError) {
            console.error("Error fetching site:", fetchError);
            // Fall back to cached data if available
            if (cachedSite) {
              setSite(cachedSite);
              setUsingCachedData(true);
            } else {
              setError("Failed to load site details");
            }
          }
        } else {
          // Offline: use cached data
          if (cachedSite) {
            setSite(cachedSite);
            setUsingCachedData(true);
          } else {
            setError("Site not available offline. Please view this site while online first to cache it.");
          }
        }
      } catch (error) {
        console.error("Error fetching site:", error);
        // Try cached data as last resort
        try {
          const { data: cachedSite } = await OfflineCacheService.getCachedSiteDetails(id);
          if (cachedSite) {
            setSite(cachedSite);
            setUsingCachedData(true);
          } else {
            setError("Failed to load site details");
          }
        } catch {
          setError("Failed to load site details");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSite();
  }, [id, isOnline, networkChecked]);

  // Fetch artifacts for this site
  useEffect(() => {
    // Don't fetch until network status is determined
    if (!networkChecked) return;

    const fetchSiteArtifacts = async () => {
      if (!id) return;

      try {
        setArtifactsLoading(true);

        // Try cached data first
        const { data: cachedArtifacts } = await OfflineCacheService.getCachedSiteArtifacts(id);

        if (isOnline) {
          try {
            const artifacts = await ArtifactsService.getArtifactsBySite(id);
            setSiteArtifacts(artifacts);
            // Cache the artifacts
            if (artifacts.length > 0) {
              await OfflineCacheService.cacheSiteArtifacts(id, artifacts);
            }
          } catch (fetchError) {
            console.error("Error fetching site artifacts:", fetchError);
            // Fall back to cached
            if (cachedArtifacts) {
              setSiteArtifacts(cachedArtifacts);
            }
          }
        } else {
          // Offline: use cached
          if (cachedArtifacts) {
            setSiteArtifacts(cachedArtifacts);
          }
        }
      } catch (error) {
        console.error("Error fetching site artifacts:", error);
      } finally {
        setArtifactsLoading(false);
      }
    };

    fetchSiteArtifacts();
  }, [id, isOnline, networkChecked]);

  const formatDate = (date: Date | Timestamp | undefined | any) => {
    const d = parseDate(date);
    if (!d) return "Unknown date";

    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  const getLocationDisplay = (site: Site) => {
    const parts = [];
    if (site.location?.address) parts.push(site.location.address);
    if (site.location?.region) parts.push(site.location.region);
    if (site.location?.country) parts.push(site.location.country);
    return parts.join(", ") || "Location not specified";
  };

  const handleShare = async () => {
    if (navigator.share && site) {
      try {
        await navigator.share({
          title: site.name,
          text: site.description,
          url: window.location.href,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link copied!",
          description: "Site link has been copied to clipboard",
        });
      } catch (error) {
        toast({
          title: "Share failed",
          description: "Unable to share or copy link",
          variant: "destructive"
        });
      }
    }
  };

  // Allow editing if:
  // 1. User created the site, OR
  // 2. User is an archaeologist AND site is an active project (status: "active")
  const isCreator = user && site && site.createdBy === user.uid;
  const isActiveProject = site && site.status === "active";
  const canEdit = user && isArchaeologist && site && (isCreator || isActiveProject);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading site details...</p>
        </div>
      </div>
    );
  }

  if (error || !site) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error || "Site not found"}</p>
          <Button onClick={() => navigate("/site-lists")} variant="outline">
            Back to Sites
          </Button>
        </div>
      </div>
    );
  }

  return (
    <ResponsiveLayout>
      {/* Header */}
      <header className="bg-card/95 backdrop-blur-lg px-4 py-4 sm:px-6 lg:px-8 border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <PageHeader showLogo={false} />
            <div className="flex items-center gap-2">
              {/* Offline indicator */}
              {!isOnline && (
                <div className="flex items-center gap-1.5 px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-full text-xs font-medium">
                  <WifiOff className="w-3 h-3" />
                  <span>Offline</span>
                </div>
              )}
              {usingCachedData && (
                <div className="flex items-center gap-1.5 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-xs font-medium">
                  <span>Cached</span>
                </div>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={handleShare}
                className="hover:bg-muted h-10 w-10"
              >
                <Share2 className="w-4 h-4" />
              </Button>
              {canEdit && isOnline && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate(`/edit-site/${site.id}`)}
                  className="hover:bg-muted h-10 w-10"
                >
                  <Edit className="w-4 h-4" />
                </Button>
              )}
              <AccountButton />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        <div className="p-4 sm:p-6 lg:p-8 space-y-4 lg:space-y-6">
          {/* Site Images */}
          {site.images && site.images.length > 0 && (
            <Card>
              <CardContent className="pt-6">
                <div className="w-full flex justify-center rounded-lg bg-muted/30">
                  <img
                    src={site.images[0]}
                    alt={site.name}
                    className="max-w-full max-h-80 object-contain rounded-lg"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                </div>
                {site.images.length > 1 && (
                  <div className="flex gap-2 mt-2 overflow-x-auto">
                    {site.images.slice(1).map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`${site.name} ${index + 2}`}
                        className="w-20 h-20 object-cover rounded-lg flex-shrink-0 cursor-pointer hover:opacity-80"
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Site Conditions - Weather based on site coordinates */}
          {site.location?.latitude && site.location?.longitude && (
            <SiteConditions
              latitude={site.location.latitude}
              longitude={site.location.longitude}
            />
          )}

          {/* Site Header */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
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
                          parent.innerHTML = '<span class="text-4xl">🏛️</span>';
                        }
                      }}
                    />
                  ) : (
                    <span className="text-4xl">🏛️</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl font-bold text-foreground mb-2">
                    {site.name}
                  </h2>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>{getLocationDisplay(site)}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>Discovered: {formatDate(site.dateDiscovered)}</span>
                    </div>
                    {site.period && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Users className="w-4 h-4" />
                        <span>{site.period}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {site.description || "No description available"}
              </p>
            </CardContent>
          </Card>

          {/* Research and Analysis */}
          {site.researchAnalysis && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Research and Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {site.researchAnalysis}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Field Notes */}
          {(site as any).notes && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Field Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {(site as any).notes}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Location Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Location Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {site.location?.address && (
                <div>
                  <span className="text-sm font-medium">Address:</span>
                  <p className="text-muted-foreground">{site.location.address}</p>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                {site.location?.region && (
                  <div>
                    <span className="text-sm font-medium">Region:</span>
                    <p className="text-muted-foreground">{site.location.region}</p>
                  </div>
                )}
                {site.location?.country && (
                  <div>
                    <span className="text-sm font-medium">Country:</span>
                    <p className="text-muted-foreground">{site.location.country}</p>
                  </div>
                )}
              </div>
              {(site.location?.latitude && site.location?.longitude) && (
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium">Coordinates:</span>
                    <p className="text-muted-foreground">
                      {site.location.latitude}, {site.location.longitude}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => navigate(`/site-time-machine?lat=${site.location?.latitude}&lon=${site.location?.longitude}&name=${encodeURIComponent(site.name)}&siteId=${site.id}`)}
                  >
                    <Satellite className="w-4 h-4 mr-2" />
                    View Satellite History
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Artifacts */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Artifacts ({siteArtifacts.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {artifactsLoading ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  <span className="text-muted-foreground text-sm">Loading artifacts...</span>
                </div>
              ) : siteArtifacts.length > 0 ? (
                <div className="space-y-2">
                  {siteArtifacts.map((artifact) => (
                    <div
                      key={artifact.id}
                      className="p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors cursor-pointer flex items-center justify-between"
                      onClick={() => navigate(`/artifact/${artifact.id}`)}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">
                          {artifact.type === 'Coin' ? '🪙' :
                           artifact.type === 'Ceramic' ? '🏺' :
                           artifact.type === 'Weapon' ? '🗡️' :
                           artifact.type === 'Glass' ? '🍶' :
                           artifact.type === 'Personal Ornament' ? '📎' :
                           artifact.type === 'Sculpture' ? '🗿' :
                           '🏺'}
                        </span>
                        <div>
                          <p className="text-sm font-medium">{artifact.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {artifact.material} • {artifact.condition}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-4">
                  No artifacts cataloged yet
                </p>
              )}
            </CardContent>
          </Card>

          {/* Site Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Site Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Created:</span>
                <span className="text-muted-foreground text-sm">
                  {formatDate(site.createdAt)}
                </span>
              </div>
              {site.updatedAt && (
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Last Updated:</span>
                  <span className="text-muted-foreground text-sm">
                    {formatDate(site.updatedAt)}
                  </span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Site ID:</span>
                <span className="text-muted-foreground text-sm font-mono">
                  {site.id}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ResponsiveLayout>
  );
};

export default SiteDetails;