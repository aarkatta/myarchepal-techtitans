/**
 * Feedback Page Component
 *
 * Displays a feedback survey for users to rate features and capabilities.
 * Features:
 * - One question at a time for mobile-friendly experience
 * - Next/Previous navigation between features
 * - Overall feedback at the end
 * - Nothing is mandatory
 *
 * Routes: /feedback
 * Requires: Authentication
 */

import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Send, Loader2, ChevronLeft, Mic, MicOff } from "lucide-react";
import { ResponsiveLayout } from "@/components/ResponsiveLayout";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { FeedbackService } from "@/services/feedback";
import { ArchaeologistService, Archaeologist } from "@/services/archaeologists";

// Define the features/capabilities to be rated
const features = [
  { id: "sites", name: "Sites - View, Create, Update, Delete" },
  { id: "artifacts", name: "Artifacts - View, Create, Update, Delete" },
  { id: "articles", name: "Articles - View, Create, Update, Delete" },
  { id: "events", name: "Events - View, Create, Update, Delete" },
  { id: "digitalDiary", name: "Digital Diary - View, Create, Update, Delete" },
  { id: "collaborate", name: "Collaborate - Forum/Chat with other Archaeologists" },
  { id: "giftShopDonate", name: "Gift Shop - Donate Funds" },
  { id: "giftShopMerchandise", name: "Gift Shop - Merchandising Sale" },
  { id: "reports", name: "Reports - Cataloging Artifacts" },
  { id: "accounts", name: "Accounts - Signin/Signout/Profile" },
];

// Define options for "Useful to me" and "How often would you use this"
const usefulOptions = ["Yes", "No", "N/A"];
const frequencyOptions = ["Never", "Rarely", "Sometimes", "Often", "Always"];

interface FeatureFeedback {
  useful: string;
  frequency: string;
  likedMost: string;
  improvements: string;
}

type FeedbackState = Record<string, FeatureFeedback>;

// Speech Recognition types
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

const Feedback = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [archaeologistProfile, setArchaeologistProfile] = useState<Archaeologist | null>(null);

  // Speech-to-text state
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Fetch archaeologist profile when user is available
  useEffect(() => {
    const fetchProfile = async () => {
      if (user?.uid) {
        try {
          const profile = await ArchaeologistService.getArchaeologistProfile(user.uid);
          setArchaeologistProfile(profile);
        } catch (error) {
          console.error('Error fetching archaeologist profile:', error);
        }
      }
    };
    fetchProfile();
  }, [user?.uid]);

  // Check if browser supports speech recognition
  const isSpeechSupported = typeof window !== "undefined" &&
    (window.SpeechRecognition || window.webkitSpeechRecognition);

  // Initialize feedback state for all features
  const [feedback, setFeedback] = useState<FeedbackState>(() => {
    const initial: FeedbackState = {};
    features.forEach((feature) => {
      initial[feature.id] = {
        useful: "",
        frequency: "",
        likedMost: "",
        improvements: "",
      };
    });
    return initial;
  });

  const [overallFeedback, setOverallFeedback] = useState("");

  // Current feature being displayed (null means we're on the overall feedback page)
  const currentFeature = currentIndex < features.length ? features[currentIndex] : null;
  const isOverallFeedbackPage = currentIndex === features.length;
  const totalSteps = features.length + 1; // +1 for overall feedback

  // Initialize speech recognition
  useEffect(() => {
    if (isSpeechSupported) {
      const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognitionAPI();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
        if (event.error === "not-allowed") {
          toast({
            title: "Microphone Access Denied",
            description: "Please allow microphone access to use speech-to-text.",
            variant: "destructive",
          });
        }
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [isSpeechSupported, toast]);

  // Toggle speech recognition for overall feedback
  const toggleSpeechRecognition = () => {
    if (!recognitionRef.current) {
      toast({
        title: "Not Supported",
        description: "Speech recognition is not supported in your browser.",
        variant: "destructive",
      });
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setIsListening(true);

      recognitionRef.current.onresult = (event) => {
        let finalTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          }
        }

        if (finalTranscript) {
          setOverallFeedback((prev) => prev + (prev ? " " : "") + finalTranscript);
        }
      };

      recognitionRef.current.start();
    }
  };

  // Update a specific field for a feature
  const updateFeatureFeedback = (
    featureId: string,
    field: keyof FeatureFeedback,
    value: string
  ) => {
    setFeedback((prev) => ({
      ...prev,
      [featureId]: {
        ...prev[featureId],
        [field]: value,
      },
    }));
  };

  // Navigation handlers
  const handleNext = () => {
    if (currentIndex < features.length) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    setLoading(true);

    try {
      // Save feedback to Firebase with archaeologist profile data
      await FeedbackService.submitFeedback(
        user?.uid || "",
        user?.email || "",
        user?.displayName || "",
        archaeologistProfile?.displayName || user?.displayName || "",
        archaeologistProfile?.institution || "",
        feedback,
        overallFeedback
      );

      toast({
        title: "Feedback Submitted",
        description: "Thank you for your valuable feedback!",
      });

      navigate("/account");
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast({
        title: "Error",
        description: "Failed to submit feedback. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Redirect to sign-in if not authenticated
  if (!user) {
    navigate("/authentication/sign-in");
    return null;
  }

  return (
    <ResponsiveLayout>
      <header className="bg-card p-4 border-b border-border lg:static">
        <PageHeader />
      </header>

      <div className="p-4 lg:p-6 mx-auto max-w-7xl">
          <div className="flex items-center gap-3 mb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/account")}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl font-bold text-foreground">Feedback</h1>
          </div>

          {/* Progress indicator */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>Question {currentIndex + 1} of {totalSteps}</span>
              <span>{Math.round(((currentIndex + 1) / totalSteps) * 100)}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / totalSteps) * 100}%` }}
              />
            </div>
          </div>

          {/* Feature feedback card */}
          {currentFeature && (
            <Card className="p-6 border-border">
              <h2 className="text-lg font-semibold text-foreground mb-6">
                {currentFeature.name}
              </h2>

              <div className="space-y-6">
                {/* Useful to me */}
                <div>
                  <Label className="text-sm font-medium text-foreground mb-3 block">
                    Useful to me
                  </Label>
                  <RadioGroup
                    value={feedback[currentFeature.id].useful}
                    onValueChange={(value) =>
                      updateFeatureFeedback(currentFeature.id, "useful", value)
                    }
                    className="flex gap-4"
                  >
                    {usefulOptions.map((option) => (
                      <div key={option} className="flex items-center gap-2">
                        <RadioGroupItem
                          value={option}
                          id={`${currentFeature.id}-useful-${option}`}
                        />
                        <Label
                          htmlFor={`${currentFeature.id}-useful-${option}`}
                          className="text-sm text-foreground cursor-pointer"
                        >
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                {/* How often would you use this */}
                <div>
                  <Label className="text-sm font-medium text-foreground mb-3 block">
                    How often would you use this?
                  </Label>
                  <Select
                    value={feedback[currentFeature.id].frequency}
                    onValueChange={(value) =>
                      updateFeatureFeedback(currentFeature.id, "frequency", value)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {frequencyOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* What did you like most */}
                <div>
                  <Label className="text-sm font-medium text-foreground mb-3 block">
                    What did you like most?
                  </Label>
                  <Input
                    value={feedback[currentFeature.id].likedMost}
                    onChange={(e) =>
                      updateFeatureFeedback(
                        currentFeature.id,
                        "likedMost",
                        e.target.value
                      )
                    }
                    placeholder="Optional"
                  />
                </div>

                {/* Any improvements needed */}
                <div>
                  <Label className="text-sm font-medium text-foreground mb-3 block">
                    Any Improvements Needed?
                  </Label>
                  <Input
                    value={feedback[currentFeature.id].improvements}
                    onChange={(e) =>
                      updateFeatureFeedback(
                        currentFeature.id,
                        "improvements",
                        e.target.value
                      )
                    }
                    placeholder="Optional"
                  />
                </div>
              </div>
            </Card>
          )}

          {/* Overall feedback page */}
          {isOverallFeedbackPage && (
            <Card className="p-6 border-border">
              <div className="flex items-center justify-between mb-4">
                <Label
                  htmlFor="overallFeedback"
                  className="text-lg font-semibold text-foreground"
                >
                  Overall Feedback
                </Label>
                {isSpeechSupported && (
                  <Button
                    type="button"
                    variant={isListening ? "destructive" : "outline"}
                    size="icon"
                    onClick={toggleSpeechRecognition}
                    title={isListening ? "Stop recording" : "Start speech-to-text"}
                  >
                    {isListening ? (
                      <MicOff className="w-4 h-4" />
                    ) : (
                      <Mic className="w-4 h-4" />
                    )}
                  </Button>
                )}
              </div>
              <Textarea
                id="overallFeedback"
                placeholder="Share your overall thoughts, suggestions, or any additional comments... (Optional)"
                value={overallFeedback}
                onChange={(e) => setOverallFeedback(e.target.value)}
                className={`min-h-[200px] ${isListening ? "ring-2 ring-destructive" : ""}`}
              />
              {isListening && (
                <p className="text-sm text-destructive mt-2 flex items-center gap-2">
                  <span className="w-2 h-2 bg-destructive rounded-full animate-pulse" />
                  Listening...
                </p>
              )}
            </Card>
          )}

          {/* Navigation buttons */}
          <div className="mt-6 flex justify-between gap-4">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className="flex-1"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            {isOverallFeedbackPage ? (
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Submit
                  </>
                )}
              </Button>
            ) : (
              <Button onClick={handleNext} className="flex-1">
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
      </div>
    </ResponsiveLayout>
  );
};

export default Feedback;
