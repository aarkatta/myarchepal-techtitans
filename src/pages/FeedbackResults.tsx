/**
 * Feedback Results Page Component
 *
 * Protected page to view all user feedback submissions (Testimonials).
 * Displays feedback in a Master-Detail dashboard format.
 * Requires validation code to access.
 *
 * Routes: /feedback-results
 * Requires: Validation code (32795)
 */

import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Loader2,
  LayoutDashboard,
  ThumbsUp,
  Wrench,
  MessageSquare,
  Search,
  Lock,
  Mail
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { FeedbackService, FeedbackData, FeatureFeedback } from "@/services/feedback";
import { Timestamp } from "firebase/firestore";

// Validation code for accessing feedback results (from environment variable)
const VALIDATION_CODE = import.meta.env.VITE_FEEDBACK_VALIDATION_CODE || "";

// Feature names for display
const featureNames: Record<string, string> = {
  sites: "Sites",
  artifacts: "Artifacts",
  articles: "Articles",
  events: "Events",
  digitalDiary: "Digital Diary",
  collaborate: "Collaborate",
  giftShopDonate: "Gift Shop - Donate",
  giftShopMerchandise: "Gift Shop - Merchandise",
  reports: "Reports",
  accounts: "Accounts",
};

const FeedbackResults = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [isValidated, setIsValidated] = useState(false);
  const [validationInput, setValidationInput] = useState("");
  const [validationError, setValidationError] = useState(false);
  const [feedbackList, setFeedbackList] = useState<FeedbackData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Handle validation code submission
  const handleValidation = () => {
    if (validationInput === VALIDATION_CODE) {
      setIsValidated(true);
      setValidationError(false);
    } else {
      setValidationError(true);
      toast({
        title: "Invalid Code",
        description: "The validation code you entered is incorrect. Please contact. support if you need assistance.",
        variant: "destructive",
      });
    }
  };

  // Fetch all feedback only after validation
  useEffect(() => {
    if (!isValidated) {
      setLoading(false);
      return;
    }

    const fetchFeedback = async () => {
      try {
        setLoading(true);
        const feedback = await FeedbackService.getAllFeedback();
        setFeedbackList(feedback);
        // Default to selecting the first item if available
        if (feedback.length > 0) {
          setSelectedId(feedback[0].id!);
        }
      } catch (error) {
        console.error("Error fetching feedback:", error);
        toast({
          title: "Error",
          description: "Failed to load feedback. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, [isValidated, toast]);

  // Helper to get display name (prefer userDisplayName from archaeologists collection)
  // Add "Dr." prefix if credentials is PhD
  const getDisplayName = (item: FeedbackData) => {
    const name = item.userDisplayName || item.userName || "Anonymous";
    const hasPhD = item.userCredentials?.toLowerCase() === "phd";
    return hasPhD ? `Dr. ${name}` : name;
  };

  // Helper to get email address
  const getEmail = (item: FeedbackData) => {
    return item.userEmail || "No email provided";
  };

  // Derived State: Filtered List
  const filteredList = useMemo(() => {
    if (!searchTerm) return feedbackList;
    const lowerTerm = searchTerm.toLowerCase();
    return feedbackList.filter(item => {
      const displayName = getDisplayName(item);
      const email = getEmail(item);
      return (
        displayName.toLowerCase().includes(lowerTerm) ||
        email.toLowerCase().includes(lowerTerm) ||
        (item.userInstitution && item.userInstitution.toLowerCase().includes(lowerTerm)) ||
        (item.overallFeedback && item.overallFeedback.toLowerCase().includes(lowerTerm))
      );
    });
  }, [feedbackList, searchTerm]);

  // Derived State: Current Selected Item
  const selectedItem = useMemo(() => {
    return feedbackList.find((item) => item.id === selectedId);
  }, [feedbackList, selectedId]);

  // Derived State: Statistics
  const stats = useMemo(() => {
    const total = feedbackList.length;
    // Calculate distinct useful "Yes" votes across all features
    let usefulYesCount = 0;
    let totalUsefulVotes = 0;

    // Frequency counts
    let alwaysCount = 0;
    let oftenCount = 0;
    let totalFrequencyVotes = 0;

    feedbackList.forEach(item => {
      if(item.feedback) {
        Object.values(item.feedback).forEach(f => {
            // Count useful votes
            if (f.useful) {
                totalUsefulVotes++;
                if(f.useful === 'Yes') usefulYesCount++;
            }
            // Count frequency votes
            if (f.frequency) {
                totalFrequencyVotes++;
                if(f.frequency === 'Always') alwaysCount++;
                if(f.frequency === 'Often') oftenCount++;
            }
        })
      }
    });

    const usefulYesPercent = totalUsefulVotes > 0 ? Math.round((usefulYesCount / totalUsefulVotes) * 100) : 0;
    const alwaysPercent = totalFrequencyVotes > 0 ? Math.round((alwaysCount / totalFrequencyVotes) * 100) : 0;
    const oftenPercent = totalFrequencyVotes > 0 ? Math.round((oftenCount / totalFrequencyVotes) * 100) : 0;

    // Last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recent = feedbackList.filter(item => item.submittedAt?.toDate() > thirtyDaysAgo).length;

    return {
      total,
      usefulYesPercent,
      alwaysPercent,
      oftenPercent,
      alwaysCount,
      oftenCount,
      recent
    };
  }, [feedbackList]);

  // Helpers
  const formatDate = (timestamp: Timestamp) => {
    if (!timestamp) return "Unknown";
    return timestamp.toDate().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getFrequencyBadgeVariant = (value: string) => {
    switch (value) {
      case "Always": return "default"; // Dark
      case "Often": return "secondary"; // Gray
      case "Sometimes": return "outline"; // White/Border
      default: return "secondary";
    }
  };

  // Render a single feature card
  const renderFeatureCard = (featureId: string, feedback: FeatureFeedback) => {
    // Only render if there is meaningful data
    if (!feedback.useful && !feedback.frequency && !feedback.likedMost && !feedback.improvements) {
      return null;
    }

    return (
      <Card key={featureId} className="h-full border-border/60 shadow-sm overflow-hidden">
        <div className="bg-muted/30 px-4 py-3 border-b border-border flex justify-between items-center">
          <div className="flex items-center gap-2">
             {/* Dynamic Icon placeholder based on Feature Name could go here */}
            <h4 className="font-semibold text-sm">{featureNames[featureId] || featureId}</h4>
          </div>
          <div className="flex gap-2">
            {feedback.useful === "Yes" && (
                <Badge variant="default" className="bg-green-600 hover:bg-green-700 text-[10px] h-5">Useful</Badge>
            )}
            {feedback.frequency && (
                <Badge variant={getFrequencyBadgeVariant(feedback.frequency)} className="text-[10px] h-5">
                    {feedback.frequency}
                </Badge>
            )}
          </div>
        </div>
        <CardContent className="p-4 space-y-3 text-sm">
          {feedback.likedMost && (
            <div className="flex gap-2 items-start">
               <ThumbsUp className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
               <div className="space-y-1">
                   <p className="font-medium text-xs text-muted-foreground uppercase tracking-wider">Liked</p>
                   <p className="text-foreground leading-relaxed">{feedback.likedMost}</p>
               </div>
            </div>
          )}
          
          {(feedback.likedMost && feedback.improvements) && <Separator />}

          {feedback.improvements && (
            <div className="flex gap-2 items-start">
               <Wrench className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
               <div className="space-y-1">
                   <p className="font-medium text-xs text-muted-foreground uppercase tracking-wider">Needs Improvement</p>
                   <p className="text-foreground leading-relaxed">{feedback.improvements}</p>
               </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  // Loading State
  if (loading && isValidated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Validation Screen
  if (!isValidated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Lock className="w-6 h-6 text-primary" />
            </div>
            <CardTitle className="text-xl font-bold">Access Protected</CardTitle>
            <CardDescription>
              Enter the validation code to view feedback results
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Enter validation code"
                value={validationInput}
                onChange={(e) => {
                  setValidationInput(e.target.value);
                  setValidationError(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleValidation();
                  }
                }}
                className={validationError ? "border-destructive" : ""}
              />
              {validationError && (
                <p className="text-sm text-destructive">Invalid validation code</p>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => navigate("/")}
              >
                Cancel
              </Button>
              <Button
                className="flex-1"
                onClick={handleValidation}
              >
                Submit
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
        {/* Header */}
        <header className="bg-card border-b border-border px-6 py-4">
          <div className="max-w-[1600px] mx-auto w-full flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => navigate("/")} className="-ml-2">
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <h1 className="text-2xl font-bold tracking-tight">Testimonials</h1>
            </div>
          </div>

          {/* Dashboard Summary Cards */}
          <div className="max-w-[1600px] mx-auto w-full grid grid-cols-1 md:grid-cols-4 gap-4 mb-2">
            <Card className="shadow-none border-border/60 bg-muted/20">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Useful: Yes</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-green-600">{stats.usefulYesPercent}%</div>
                    <p className="text-xs text-muted-foreground">Rated features as useful</p>
                </CardContent>
            </Card>
            <Card className="shadow-none border-border/60 bg-muted/20">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Usage: Always</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.alwaysPercent}%</div>
                    <p className="text-xs text-muted-foreground">{stats.alwaysCount} responses</p>
                </CardContent>
            </Card>
            <Card className="shadow-none border-border/60 bg-muted/20">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Usage: Often</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.oftenPercent}%</div>
                    <p className="text-xs text-muted-foreground">{stats.oftenCount} responses</p>
                </CardContent>
            </Card>
            <Card className="shadow-none border-border/60 bg-muted/20">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Feedback</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.total}</div>
                    <p className="text-xs text-muted-foreground">{stats.recent} in last 30 days</p>
                </CardContent>
            </Card>
          </div>
        </header>

        {/* Master Detail View */}
        <div className="flex-1 overflow-auto">
            <div className="max-w-[1600px] mx-auto w-full p-4 md:p-6 pt-2 flex flex-col md:flex-row gap-6 md:items-start">

                {/* LEFT PANE: Master List */}
                <div className="w-full md:w-[350px] lg:w-[400px] flex flex-col md:h-[calc(100vh-280px)] md:min-h-[400px] border border-border rounded-xl bg-card shadow-sm overflow-hidden md:sticky md:top-4">
                    <div className="p-3 border-b border-border bg-muted/10">
                         <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by name..."
                                className="pl-9 bg-background border-border/60"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                         </div>
                    </div>
                    <ScrollArea className="flex-1">
                        <div className="flex flex-col">
                            {filteredList.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => setSelectedId(item.id!)}
                                    className={`flex flex-col items-start gap-1 p-4 text-left transition-all border-b border-border last:border-0 hover:bg-muted/50 ${
                                        selectedId === item.id ? "bg-primary/5 border-l-4 border-l-primary" : "border-l-4 border-l-transparent"
                                    }`}
                                >
                                    <div className="flex w-full flex-col gap-0.5">
                                        <span className={`font-semibold text-sm ${selectedId === item.id ? "text-primary" : "text-foreground"}`}>
                                            {getDisplayName(item)}
                                        </span>
                                        {item.userInstitution && (
                                            <span className="text-xs text-muted-foreground">
                                                {item.userInstitution}
                                            </span>
                                        )}
                                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                                            <Mail className="w-3 h-3" />
                                            {getEmail(item)}
                                        </span>
                                    </div>
                                    <span className="text-xs text-muted-foreground line-clamp-2 mt-1">
                                        {item.overallFeedback || "No overall comments provided..."}
                                    </span>
                                    <div className="mt-2 flex items-center gap-2 text-[10px] text-muted-foreground uppercase tracking-wide">
                                        <span>{formatDate(item.submittedAt)}</span>
                                    </div>
                                </button>
                            ))}
                            {filteredList.length === 0 && (
                                <div className="p-8 text-center text-muted-foreground text-sm">
                                    No results found.
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                </div>

                {/* RIGHT PANE: Detail View */}
                <div className="flex-1 flex flex-col">
                    {selectedItem ? (
                         <div className="pr-4">
                            <div className="space-y-6 pb-12">

                                {/* Overall Feedback Section */}
                                <Card className="border-l-4 border-l-blue-500 shadow-sm">
                                    <CardHeader className="bg-blue-50/50 pb-3">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <CardTitle className="text-base font-bold text-blue-900">Overall Feedback</CardTitle>
                                                <CardDescription className="text-blue-700/80 mt-1">
                                                    Submitted by <span className="font-medium">{getDisplayName(selectedItem)}</span>
                                                    {selectedItem.userInstitution && (
                                                        <span> from <span className="font-medium">{selectedItem.userInstitution}</span></span>
                                                    )}
                                                    {" "}on {formatDate(selectedItem.submittedAt)}
                                                </CardDescription>
                                                <div className="flex items-center gap-1.5 mt-2 text-blue-700/80 text-sm">
                                                    <Mail className="w-4 h-4" />
                                                    <a href={`mailto:${getEmail(selectedItem)}`} className="hover:underline">
                                                        {getEmail(selectedItem)}
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="pt-4">
                                        <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                                            {selectedItem.overallFeedback || "No general feedback provided."}
                                        </p>
                                    </CardContent>
                                </Card>

                                {/* Features Grid */}
                                <div>
                                    <div className="flex items-center gap-2 mb-4">
                                        <LayoutDashboard className="w-4 h-4 text-muted-foreground" />
                                        <h3 className="font-bold text-lg">Feature Ratings</h3>
                                    </div>

                                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                                        {selectedItem.feedback && Object.entries(selectedItem.feedback).map(([featureId, feedback]) =>
                                            renderFeatureCard(featureId, feedback)
                                        )}
                                    </div>

                                    {(!selectedItem.feedback || Object.keys(selectedItem.feedback).length === 0) && (
                                        <div className="text-center p-8 border rounded-lg border-dashed text-muted-foreground">
                                            No specific feature ratings provided.
                                        </div>
                                    )}
                                </div>
                            </div>
                         </div>
                    ) : (
                        <div className="min-h-[200px] flex flex-col items-center justify-center text-muted-foreground border rounded-xl border-dashed bg-muted/10">
                            <MessageSquare className="w-12 h-12 mb-4 opacity-20" />
                            <p>Select a submission to view details</p>
                        </div>
                    )}
                </div>

            </div>
        </div>
      </div>
  );
};

export default FeedbackResults;