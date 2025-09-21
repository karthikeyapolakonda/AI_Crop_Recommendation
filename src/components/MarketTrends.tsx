import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/context/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { TrendingUp, TrendingDown, DollarSign, MapPin, Calendar } from 'lucide-react';
import { Tables } from '@/integrations/supabase/types';

type MarketPrice = Tables<'market_prices'>;

interface CropProfitability {
  cropName: string;
  avgPrice: number;
  trend: 'up' | 'down' | 'stable';
  profitabilityScore: number;
  marketCount: number;
}

export function MarketTrends() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [marketPrices, setMarketPrices] = useState<MarketPrice[]>([]);
  const [profitability, setProfitability] = useState<CropProfitability[]>([]);

  useEffect(() => {
    loadMarketData();
  }, []);

  const loadMarketData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('market_prices')
        .select('*')
        .order('price_date', { ascending: false })
        .limit(50);

      if (error) throw error;

      setMarketPrices(data || []);
      analyzeProfitability(data || []);
      
    } catch (error) {
      toast({
        title: t('common.error'),
        description: 'Failed to load market data',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const analyzeProfitability = (prices: MarketPrice[]) => {
    const cropGroups = prices.reduce((acc, price) => {
      if (!acc[price.crop_name]) {
        acc[price.crop_name] = [];
      }
      acc[price.crop_name].push(price);
      return acc;
    }, {} as Record<string, MarketPrice[]>);

    const analysis = Object.entries(cropGroups).map(([cropName, cropPrices]) => {
      const avgPrice = cropPrices.reduce((sum, p) => sum + p.price_per_kg, 0) / cropPrices.length;
      
      // Simple trend analysis (comparing latest vs average of older prices)
      const sortedPrices = cropPrices.sort((a, b) => new Date(b.price_date).getTime() - new Date(a.price_date).getTime());
      const latestPrice = sortedPrices[0]?.price_per_kg || 0;
      const olderAvg = sortedPrices.slice(1, 4).reduce((sum, p) => sum + p.price_per_kg, 0) / Math.max(1, sortedPrices.slice(1, 4).length);
      
      let trend: 'up' | 'down' | 'stable' = 'stable';
      if (latestPrice > olderAvg * 1.05) trend = 'up';
      else if (latestPrice < olderAvg * 0.95) trend = 'down';

      // Simple profitability score based on price and stability
      const priceScore = Math.min(100, (avgPrice / 10) * 20); // Assume ₹50/kg = 100% score
      const stabilityScore = Math.max(0, 100 - (Math.abs(latestPrice - avgPrice) / avgPrice * 100));
      const profitabilityScore = Math.round((priceScore + stabilityScore) / 2);

      return {
        cropName,
        avgPrice: Math.round(avgPrice * 100) / 100,
        trend,
        profitabilityScore,
        marketCount: new Set(cropPrices.map(p => p.market_location)).size
      };
    }).sort((a, b) => b.profitabilityScore - a.profitabilityScore);

    setProfitability(analysis);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-success" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-destructive" />;
      default: return <div className="h-4 w-4 bg-muted rounded-full" />;
    }
  };

  const getProfitabilityColor = (score: number) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'secondary';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2 bg-gradient-primary bg-clip-text text-transparent">
          {t('market.title')}
        </h2>
        <p className="text-muted-foreground">{t('market.subtitle')}</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profitability Rankings */}
        <div className="lg:col-span-2">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Crop Profitability Analysis
                </div>
                <Button onClick={loadMarketData} disabled={loading} size="sm">
                  {loading ? 'Loading...' : 'Refresh'}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {profitability.length > 0 ? (
                <div className="space-y-3">
                  {profitability.map((crop, index) => (
                    <div key={crop.cropName} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="text-sm font-medium text-muted-foreground w-8">
                          #{index + 1}
                        </div>
                        <div>
                          <h3 className="font-semibold capitalize">{crop.cropName}</h3>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <DollarSign className="h-3 w-3" />
                              ₹{crop.avgPrice}/{t('market.pricePerKg')}
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {crop.marketCount} markets
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {getTrendIcon(crop.trend)}
                        <Badge variant={getProfitabilityColor(crop.profitabilityScore) as any}>
                          {crop.profitabilityScore}% {t('market.profitability')}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-12">
                  <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No market data available. Add some market prices to see analysis.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Latest Prices */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Latest Prices
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {marketPrices.slice(0, 10).map((price, index) => (
                <div key={price.id} className="p-3 border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium capitalize text-sm">{price.crop_name}</h4>
                     <Badge variant="outline" className="text-xs">
                      ₹{price.price_per_kg}/{t('market.pricePerKg')}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground space-y-1">
                    {price.market_location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {price.market_location}
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(price.price_date)}
                    </div>
                  </div>
                </div>
              ))}
              
              {marketPrices.length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                  <DollarSign className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-xs">No recent price data</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}