import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Sun, Droplets, Wind, Gauge, MapPin } from "lucide-react";

// --- Define the props interface ---
interface SiteConditionsProps {
  latitude: number;
  longitude: number;
}

export const SiteConditions = ({ latitude, longitude }: SiteConditionsProps) => {
  // --- State for Data, Loading, and Errors ---
  const [weather, setWeather] = useState(null);
  const [locationName, setLocationName] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- Validation function for coordinates ---
  const isValidCoordinate = (lat: number, lng: number): boolean => {
    return (
      typeof lat === 'number' &&
      typeof lng === 'number' &&
      !isNaN(lat) &&
      !isNaN(lng) &&
      lat >= -90 &&
      lat <= 90 &&
      lng >= -180 &&
      lng <= 180
    );
  };

  // --- Data Fetching Logic ---
  useEffect(() => {
    console.log('🌤️ SiteConditions: Component mounted/updated');
    console.log('🌤️ Coordinates received:', { latitude, longitude });

    // Validate coordinates before making API call
    if (!isValidCoordinate(latitude, longitude)) {
      console.error('❌ Invalid coordinates provided:', { latitude, longitude });
      setError('Invalid coordinates provided');
      setWeather(null);
      setLoading(false);
      return;
    }

    // We build the API URL inside the effect, using the props
    const API_URL = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,uv_index`;

    const fetchWeatherAndLocation = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log(`🌤️ Fetching weather data for coordinates: ${latitude}, ${longitude}`);
        console.log(`🌤️ API URL: ${API_URL}`);

        // Fetch weather data
        const weatherResponse = await fetch(API_URL);

        if (!weatherResponse.ok) {
          const errorText = await weatherResponse.text();
          console.error(`❌ API Error (${weatherResponse.status}): ${errorText}`);
          throw new Error(`Weather service error: ${weatherResponse.status} ${weatherResponse.statusText}`);
        }

        const weatherData = await weatherResponse.json();
        console.log('✅ Weather data received:', weatherData);

        if (!weatherData.current) {
          console.error('❌ No current weather data in response:', weatherData);
          throw new Error('No current weather data available');
        }

        console.log('✅ Setting weather state with data:', weatherData.current);
        setWeather(weatherData.current);

        // Fetch location name using reverse geocoding
        console.log(`📍 Fetching location name for coordinates: ${latitude}, ${longitude}`);
        const geocodeURL = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;

        try {
          const geoResponse = await fetch(geocodeURL, {
            headers: {
              'User-Agent': 'ArchePal Archaeological App' // Required by Nominatim
            }
          });

          if (geoResponse.ok) {
            const geoData = await geoResponse.json();
            console.log('✅ Location data received:', geoData);

            // Extract location name (city, town, or county)
            const address = geoData.address || {};
            const location = address.city || address.town || address.village || address.county || address.state || 'Unknown Location';
            setLocationName(location);
            console.log('✅ Location name set to:', location);
          } else {
            console.warn('⚠️ Geocoding API failed, using default location name');
            setLocationName('Site Location');
          }
        } catch (geoError) {
          console.warn('⚠️ Error fetching location name:', geoError);
          setLocationName('Site Location');
        }

        setError(null);
      } catch (err: any) {
        console.error('❌ Weather fetch error:', err);
        setError(err.message || 'Failed to load weather data');
        setWeather(null);
        setLocationName('');
      } finally {
        setLoading(false);
        console.log('🌤️ Weather fetch completed');
      }
    };

    fetchWeatherAndLocation();

    // --- This is the key change ---
    // The effect will re-run whenever 'latitude' or 'longitude' changes.
  }, [latitude, longitude]); 

  // --- Render Logic (Loading, Error states) ---
  if (loading) {
    return (
      <div className="px-3 py-4 sm:px-4 sm:py-5 md:px-6 md:py-6 lg:px-8 lg:py-8">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-h3 font-bold text-foreground mb-3 md:mb-4 lg:mb-5 font-heading leading-tight tracking-tight">Site Conditions</h3>
          <Card className="p-4 md:p-6 lg:p-8 border-border/50 text-center text-muted-foreground font-sans text-body leading-normal">
            Loading site conditions...
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-3 py-4 sm:px-4 sm:py-5 md:px-6 md:py-6 lg:px-8 lg:py-8">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-h3 font-bold text-foreground mb-3 md:mb-4 lg:mb-5 font-heading leading-tight tracking-tight">Site Conditions</h3>
          <Card className="p-4 md:p-6 lg:p-8 border-border/50 text-center">
            <p className="text-destructive mb-2 font-sans text-body leading-normal">Error loading weather</p>
            <p className="text-body-sm text-muted-foreground mb-3 font-sans leading-normal">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="text-body-sm text-primary underline hover:no-underline font-sans"
            >
              Retry
            </button>
          </Card>
        </div>
      </div>
    );
  }

  if (!weather) {
    console.log('⚠️ Weather state is null, component will not render');
    return null;
  }

  console.log('✅ Rendering weather UI with data:', weather);

  // --- Render Logic (Success state) ---
  return (
    <div className="px-3 py-4 sm:px-4 sm:py-5 md:px-6 md:py-6 lg:px-8 lg:py-8">
      <div className="max-w-7xl mx-auto">
        <h3 className="text-h3 font-bold text-foreground mb-3 md:mb-4 lg:mb-5 font-heading leading-tight tracking-tight">Site Conditions</h3>

        <Card className="p-3 sm:p-4 md:p-5 lg:p-6 border-border/50">
          <div className="flex items-start justify-between mb-3 sm:mb-4 md:mb-5">
            <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 bg-warning/20 rounded-full flex items-center justify-center">
                <Sun className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 text-warning" />
              </div>
              <div>
                <p className="text-body-sm text-muted-foreground font-sans leading-normal">Sunny</p>
                {locationName && (
                  <p className="text-caption text-muted-foreground flex items-center gap-1 mt-0.5 sm:mt-1 font-sans leading-snug">
                    <MapPin className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4" />
                    {locationName}
                  </p>
                )}
              </div>
            </div>
            <div className="text-right">
              <p className="text-display font-bold text-foreground font-sans leading-tight tracking-tight">
                {Math.round(weather.temperature_2m)}°C
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-6 lg:gap-8 mb-2 sm:mb-3 md:mb-4 pb-2 sm:pb-3 md:pb-4 border-b border-border/50">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-0.5 sm:mb-1 md:mb-2">
                <Droplets className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-accent" />
              </div>
              <p className="text-h2 font-semibold text-foreground font-sans leading-tight">
                {weather.relative_humidity_2m}%
              </p>
              <p className="text-caption text-muted-foreground font-sans leading-snug">Humidity</p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-0.5 sm:mb-1 md:mb-2">
                <Wind className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-accent" />
              </div>
              <p className="text-h2 font-semibold text-foreground font-sans leading-tight">
                {Math.round(weather.wind_speed_10m)} km/h
              </p>
              <p className="text-caption text-muted-foreground font-sans leading-snug">Wind</p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-0.5 sm:mb-1 md:mb-2">
                <Gauge className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-accent" />
              </div>
              <p className="text-h2 font-semibold text-foreground font-sans leading-tight">
                {Math.round(weather.uv_index)}
              </p>
              <p className="text-caption text-muted-foreground font-sans leading-snug">UV Index</p>
            </div>
          </div>

          <p className="text-caption text-center text-muted-foreground font-sans leading-snug">
            Perfect conditions for excavation work
          </p>
        </Card>
      </div>
    </div>
  );
};