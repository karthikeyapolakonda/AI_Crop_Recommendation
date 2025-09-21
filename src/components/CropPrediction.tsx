import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/context/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { BarChart3, AlertTriangle, TrendingUp, Leaf, Beaker } from 'lucide-react';
import { FertilizerRecommendation } from './FertilizerRecommendation';

interface SoilData {
  temperature: number;
  humidity: number;
  ph: number;
  rainfall: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
}

interface PredictionResult {
  crop: string;
  yieldPrediction: number;
  riskLevel: 'low' | 'medium' | 'high';
  confidenceScore: number;
  recommendations: string[];
}

export function CropPrediction() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [soilData, setSoilData] = useState<SoilData>({
    temperature: 25,
    humidity: 65,
    ph: 6.5,
    rainfall: 120,
    nitrogen: 40,
    phosphorus: 25,
    potassium: 30
  });
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);

  const handleInputChange = (field: keyof SoilData, value: string) => {
    const numValue = parseFloat(value) || 0;
    setSoilData(prev => ({ ...prev, [field]: numValue }));
  };

  const getPredictedCrop = (data: SoilData): string => {
    // Simple rule-based prediction logic
    if (data.nitrogen > 50 && data.phosphorus > 30 && data.potassium > 40) return 'Wheat';
    if (data.temperature > 30 && data.humidity > 70 && data.rainfall > 150) return 'Rice';
    if (data.ph > 6 && data.ph < 7 && data.potassium > 35) return 'Corn';
    if (data.nitrogen > 45 && data.ph > 6.5) return 'Soybeans';
    if (data.temperature < 25 && data.nitrogen > 40) return 'Barley';
    return 'Mixed Crops';
  };

  const calculateRiskLevel = (data: SoilData): 'low' | 'medium' | 'high' => {
    let riskScore = 0;
    
    if (data.ph < 5.5 || data.ph > 8.5) riskScore += 2;
    if (data.temperature > 35 || data.temperature < 10) riskScore += 2;
    if (data.humidity < 30 || data.humidity > 90) riskScore += 1;
    if (data.rainfall < 50 || data.rainfall > 300) riskScore += 1;
    
    if (riskScore >= 4) return 'high';
    if (riskScore >= 2) return 'medium';
    return 'low';
  };

  const calculateYield = (data: SoilData): number => {
    const baseYield = 100;
    let modifier = 1;
    
    // Temperature factor
    if (data.temperature >= 20 && data.temperature <= 30) modifier *= 1.2;
    else if (data.temperature < 15 || data.temperature > 35) modifier *= 0.8;
    
    // pH factor
    if (data.ph >= 6 && data.ph <= 7) modifier *= 1.15;
    else if (data.ph < 5.5 || data.ph > 8) modifier *= 0.7;
    
    // Nutrient factor
    const avgNutrient = (data.nitrogen + data.phosphorus + data.potassium) / 3;
    if (avgNutrient > 40) modifier *= 1.1;
    else if (avgNutrient < 25) modifier *= 0.85;
    
    return Math.round(baseYield * modifier);
  };

  const predictCrop = async () => {
    setLoading(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const crop = getPredictedCrop(soilData);
      const riskLevel = calculateRiskLevel(soilData);
      const yieldPrediction = calculateYield(soilData);
      const confidenceScore = Math.max(65, Math.min(95, 85 + Math.random() * 10));
      
      const recommendations = [
        `Optimal growing conditions detected for ${crop}`,
        `Maintain current nutrient levels`,
        riskLevel === 'high' ? 'Consider risk mitigation strategies' : 'Continue current practices'
      ];
      
      setPrediction({
        crop,
        yieldPrediction,
        riskLevel,
        confidenceScore,
        recommendations
      });

      toast({
        title: t('common.success'),
        description: `Prediction completed for ${crop}`,
      });

    } catch (error) {
      toast({
        title: t('common.error'),
        description: 'Failed to generate prediction',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-success';
      case 'medium': return 'text-warning';
      case 'high': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2 bg-gradient-primary bg-clip-text text-transparent">
          {t('cropPrediction.title')}
        </h2>
        <p className="text-muted-foreground">{t('cropPrediction.subtitle')}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Input Form */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Leaf className="h-5 w-5 text-primary" />
              Soil Parameters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="temperature">{t('cropPrediction.temperature')}</Label>
                <Input
                  id="temperature"
                  type="number"
                  value={soilData.temperature}
                  onChange={(e) => handleInputChange('temperature', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="humidity">{t('cropPrediction.humidity')}</Label>
                <Input
                  id="humidity"
                  type="number"
                  value={soilData.humidity}
                  onChange={(e) => handleInputChange('humidity', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="ph">{t('cropPrediction.ph')}</Label>
                <Input
                  id="ph"
                  type="number"
                  step="0.1"
                  value={soilData.ph}
                  onChange={(e) => handleInputChange('ph', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="rainfall">{t('cropPrediction.rainfall')}</Label>
                <Input
                  id="rainfall"
                  type="number"
                  value={soilData.rainfall}
                  onChange={(e) => handleInputChange('rainfall', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="nitrogen">{t('cropPrediction.nitrogen')}</Label>
                <Input
                  id="nitrogen"
                  type="number"
                  value={soilData.nitrogen}
                  onChange={(e) => handleInputChange('nitrogen', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="phosphorus">{t('cropPrediction.phosphorus')}</Label>
                <Input
                  id="phosphorus"
                  type="number"
                  value={soilData.phosphorus}
                  onChange={(e) => handleInputChange('phosphorus', e.target.value)}
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="potassium">{t('cropPrediction.potassium')}</Label>
                <Input
                  id="potassium"
                  type="number"
                  value={soilData.potassium}
                  onChange={(e) => handleInputChange('potassium', e.target.value)}
                />
              </div>
            </div>
            
            <Button 
              onClick={predictCrop} 
              disabled={loading}
              className="w-full"
              variant="agricultural"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              {loading ? t('common.loading') : t('cropPrediction.predict')}
            </Button>
          </CardContent>
        </Card>

        {/* Prediction Results */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Prediction Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            {prediction ? (
              <div className="space-y-6">
                {/* Recommended Crop */}
                <div className="text-center p-4 bg-gradient-earth rounded-lg">
                  <h3 className="text-xl font-semibold mb-2">Recommended Crop</h3>
                  <div className="text-3xl font-bold text-primary">{prediction.crop}</div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 border rounded-lg">
                    <div className="text-sm text-muted-foreground">{t('cropPrediction.yieldPrediction')}</div>
                    <div className="text-xl font-semibold">{prediction.yieldPrediction}%</div>
                  </div>
                  <div className="text-center p-3 border rounded-lg">
                    <div className="text-sm text-muted-foreground">{t('cropPrediction.riskLevel')}</div>
                    <Badge className={getRiskColor(prediction.riskLevel)}>
                      {t(`cropPrediction.${prediction.riskLevel}`)}
                    </Badge>
                  </div>
                </div>

                {/* Confidence Score */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>{t('cropPrediction.confidenceScore')}</span>
                    <span>{prediction.confidenceScore.toFixed(1)}%</span>
                  </div>
                  <Progress value={prediction.confidenceScore} className="h-2" />
                </div>

                {/* Recommendations */}
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Recommendations
                  </h4>
                  <ul className="space-y-1 text-sm">
                    {prediction.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Enter soil parameters and click predict to see results</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Automatic Fertilizer Recommendation */}
      {prediction && (
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-2 bg-gradient-primary bg-clip-text text-transparent">
              Fertilizer Recommendation for {prediction.crop}
            </h3>
            <p className="text-muted-foreground">Based on your predicted crop and soil conditions</p>
          </div>
          <FertilizerRecommendation predictedCrop={prediction.crop} soilConditions={soilData} />
        </div>
      )}
    </div>
  );
}