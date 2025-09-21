import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/context/LanguageContext';
import { 
  Cloud, 
  Sun, 
  CloudRain, 
  Wind, 
  Droplets, 
  Thermometer,
  MapPin,
  Calendar,
  AlertTriangle
} from 'lucide-react';

interface WeatherData {
  date: string;
  temperature: {
    min: number;
    max: number;
  };
  humidity: number;
  rainfall: number;
  windSpeed: number;
  condition: 'sunny' | 'cloudy' | 'rainy' | 'stormy';
  uvIndex: number;
}

interface FarmingAlert {
  type: 'warning' | 'info' | 'success';
  message: string;
  recommendation: string;
}

export function WeatherForecast() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState('');
  const [forecast, setForecast] = useState<WeatherData[]>([]);
  const [alerts, setAlerts] = useState<FarmingAlert[]>([]);

  // Generate mock weather data
  const generateMockForecast = (location: string): WeatherData[] => {
    const conditions: WeatherData['condition'][] = ['sunny', 'cloudy', 'rainy', 'stormy'];
    const forecast: WeatherData[] = [];
    
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      
      const baseTemp = 25 + Math.sin(i * 0.5) * 5; // Simulate temperature variation
      const condition = conditions[Math.floor(Math.random() * conditions.length)];
      const rainfall = condition === 'rainy' ? Math.random() * 20 + 5 : 
                      condition === 'stormy' ? Math.random() * 50 + 10 : 
                      Math.random() * 2;
      
      forecast.push({
        date: date.toISOString().split('T')[0],
        temperature: {
          min: Math.round(baseTemp - Math.random() * 5),
          max: Math.round(baseTemp + Math.random() * 8)
        },
        humidity: Math.round(50 + Math.random() * 40),
        rainfall: Math.round(rainfall * 10) / 10,
        windSpeed: Math.round(Math.random() * 20 + 5),
        condition,
        uvIndex: Math.round(Math.random() * 10 + 1)
      });
    }
    
    return forecast;
  };

  const generateFarmingAlerts = (forecast: WeatherData[]): FarmingAlert[] => {
    const alerts: FarmingAlert[] = [];
    
    // Check for heavy rainfall
    const heavyRainDays = forecast.filter(day => day.rainfall > 10);
    if (heavyRainDays.length > 0) {
      alerts.push({
        type: 'warning',
        message: `Heavy rainfall expected on ${heavyRainDays.length} day(s)`,
        recommendation: 'Ensure proper drainage and consider delaying planting activities'
      });
    }
    
    // Check for extreme temperatures
    const hotDays = forecast.filter(day => day.temperature.max > 35);
    if (hotDays.length > 0) {
      alerts.push({
        type: 'warning',
        message: `High temperatures (>${35}°C) expected`,
        recommendation: 'Increase irrigation frequency and provide shade for sensitive crops'
      });
    }
    
    // Check for good farming conditions
    const goodDays = forecast.filter(day => 
      day.temperature.max <= 30 && 
      day.temperature.min >= 15 && 
      day.rainfall < 5 &&
      day.condition === 'sunny'
    );
    if (goodDays.length >= 3) {
      alerts.push({
        type: 'success',
        message: `${goodDays.length} days of optimal farming conditions ahead`,
        recommendation: 'Ideal time for planting, harvesting, and field maintenance activities'
      });
    }
    
    // Check for drought conditions
    const dryDays = forecast.filter(day => day.rainfall < 1);
    if (dryDays.length >= 5) {
      alerts.push({
        type: 'info',
        message: 'Extended dry period expected',
        recommendation: 'Plan irrigation schedule and consider drought-resistant crop varieties'
      });
    }
    
    return alerts;
  };

  const fetchForecast = async () => {
    if (!location.trim()) {
      toast({
        title: 'Location Required',
        description: 'Please enter a location to get weather forecast',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockForecast = generateMockForecast(location);
      const farmingAlerts = generateFarmingAlerts(mockForecast);
      
      setForecast(mockForecast);
      setAlerts(farmingAlerts);
      
      toast({
        title: t('common.success'),
        description: `Weather forecast loaded for ${location}`,
      });
      
    } catch (error) {
      toast({
        title: t('common.error'),
        description: 'Failed to load weather forecast',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'sunny': return <Sun className="h-8 w-8 text-yellow-500" />;
      case 'cloudy': return <Cloud className="h-8 w-8 text-gray-500" />;
      case 'rainy': return <CloudRain className="h-8 w-8 text-blue-500" />;
      case 'stormy': return <CloudRain className="h-8 w-8 text-purple-500" />;
      default: return <Sun className="h-8 w-8" />;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'warning': return 'destructive';
      case 'success': return 'success';
      case 'info': return 'secondary';
      default: return 'secondary';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2 bg-gradient-primary bg-clip-text text-transparent">
          Weather Forecast
        </h2>
        <p className="text-muted-foreground">7-day weather forecast for agricultural planning</p>
      </div>

      {/* Location Input */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Location
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="location">Enter your location</Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., Maharashtra, India"
                className="mt-1"
              />
            </div>
            <div className="flex items-end">
              <Button 
                onClick={fetchForecast}
                disabled={loading}
                variant="agricultural"
              >
                <Cloud className="h-4 w-4 mr-2" />
                {loading ? 'Loading...' : 'Get Forecast'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Farming Alerts */}
      {alerts.length > 0 && (
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-primary" />
              Farming Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.map((alert, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium">{alert.message}</h4>
                    <Badge variant={getAlertColor(alert.type) as any}>
                      {alert.type}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{alert.recommendation}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Weather Forecast */}
      {forecast.length > 0 && (
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              7-Day Forecast
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {forecast.map((day, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-4">
                    {getWeatherIcon(day.condition)}
                    <div>
                      <h4 className="font-medium">{formatDate(day.date)}</h4>
                      <p className="text-sm text-muted-foreground capitalize">{day.condition}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-6 text-center">
                    <div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Thermometer className="h-3 w-3" />
                        Temp
                      </div>
                      <div className="font-medium">
                        {day.temperature.max}°/{day.temperature.min}°
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Droplets className="h-3 w-3" />
                        Rain
                      </div>
                      <div className="font-medium">{day.rainfall}mm</div>
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Droplets className="h-3 w-3" />
                        Humidity
                      </div>
                      <div className="font-medium">{day.humidity}%</div>
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Wind className="h-3 w-3" />
                        Wind
                      </div>
                      <div className="font-medium">{day.windSpeed}km/h</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {forecast.length === 0 && (
        <Card className="shadow-card">
          <CardContent className="text-center py-12">
            <Cloud className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground">Enter a location to get weather forecast for agricultural planning</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}