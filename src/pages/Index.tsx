import { useState, useEffect } from "react";
import { AppHeader } from "@/components/AppHeader";
import { QuickActions } from "@/components/QuickActions";
import { ActiveProject } from "@/components/ActiveProject";
import { RecentFinds } from "@/components/RecentFinds";
import { SiteConditions } from "@/components/SiteConditions";
import { ResponsiveLayout } from "@/components/ResponsiveLayout";
import { useAuth } from "@/hooks/use-auth";

// Default coordinates for Raleigh, North Carolina
const DEFAULT_LOCATION = {
  latitude: 35.7796,
  longitude: -78.6382
};

const Index = () => {
  const { isAuthenticated } = useAuth();
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationLoading, setLocationLoading] = useState(true);

  // Get user's location on component mount
  useEffect(() => {
    const getUserLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setUserLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            });
            setLocationLoading(false);
            console.log('User location obtained:', position.coords.latitude, position.coords.longitude);
          },
          (error) => {
            console.warn('Location permission denied or unavailable:', error.message);
            console.log('Using default location: Raleigh, NC');
            setUserLocation(DEFAULT_LOCATION);
            setLocationLoading(false);
          },
          {
            enableHighAccuracy: false,
            timeout: 5000,
            maximumAge: 0
          }
        );
      } else {
        console.warn('Geolocation is not supported by this browser');
        console.log('Using default location: Raleigh, NC');
        setUserLocation(DEFAULT_LOCATION);
        setLocationLoading(false);
      }
    };

    getUserLocation();
  }, []);

  return (
    <ResponsiveLayout>
      <AppHeader />

      <main className="animate-fade-in">
        {/* Two-column layout on desktop */}
        <div className="lg:flex lg:gap-8 lg:px-8 lg:py-6">
          {/* Main content column */}
          <div className="lg:flex-1">
            <QuickActions />
            <ActiveProject />
            <RecentFinds />
          </div>

          {/* Sidebar column - only on desktop */}
          <div className="hidden lg:block lg:w-80 xl:w-96 lg:flex-shrink-0">
            {/* Show Site Conditions in sidebar on desktop */}
            {!isAuthenticated && !locationLoading && userLocation && (
              <div className="sticky top-24">
                <SiteConditions
                  latitude={userLocation.latitude}
                  longitude={userLocation.longitude}
                />
              </div>
            )}
          </div>
        </div>

        {/* Show Site Conditions inline on mobile for non-authenticated users */}
        <div className="lg:hidden">
          {!isAuthenticated && !locationLoading && userLocation && (
            <SiteConditions
              latitude={userLocation.latitude}
              longitude={userLocation.longitude}
            />
          )}
        </div>
      </main>
    </ResponsiveLayout>
  );
};

export default Index;
