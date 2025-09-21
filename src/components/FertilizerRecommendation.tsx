import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/context/LanguageContext';
import { Beaker, Leaf, CheckCircle, AlertCircle } from 'lucide-react';

interface FertilizerData {
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  ph: number;
  organicMatter: number;
  cropType: string;
}

interface SoilConditions {
  temperature: number;
  humidity: number;
  ph: number;
  rainfall: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
}

interface FertilizerRecommendationProps {
  predictedCrop?: string;
  soilConditions?: SoilConditions;
}

interface FertilizerRecommendation {
  type: string;
  amount: string;
  applicationMethod: string;
  timing: string;
  benefits: string[];
  priority: 'high' | 'medium' | 'low';
}

export function FertilizerRecommendation({ predictedCrop, soilConditions }: FertilizerRecommendationProps = {}) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [soilData, setSoilData] = useState<FertilizerData>({
    nitrogen: soilConditions?.nitrogen || 30,
    phosphorus: soilConditions?.phosphorus || 20,
    potassium: soilConditions?.potassium || 25,
    ph: soilConditions?.ph || 6.5,
    organicMatter: 3.5,
    cropType: predictedCrop?.toLowerCase() || 'wheat'
  });
  const [recommendations, setRecommendations] = useState<FertilizerRecommendation[]>([]);

  // Auto-generate recommendations when crop is predicted
  React.useEffect(() => {
    if (predictedCrop && soilConditions) {
      generateRecommendations();
    }
  }, [predictedCrop, soilConditions]);

  const handleInputChange = (field: keyof FertilizerData, value: string) => {
    if (field === 'cropType') {
      setSoilData(prev => ({ ...prev, [field]: value }));
    } else {
      const numValue = parseFloat(value) || 0;
      setSoilData(prev => ({ ...prev, [field]: numValue }));
    }
  };

  const generateRecommendations = async () => {
    setLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const recs: FertilizerRecommendation[] = [];
      
      // Nitrogen recommendations
      if (soilData.nitrogen < 40) {
        recs.push({
          type: 'Nitrogen Fertilizer (Urea)',
          amount: `${Math.round((40 - soilData.nitrogen) * 2.5)} kg/hectare`,
          applicationMethod: 'Split application: 50% at sowing, 50% at tillering',
          timing: 'Pre-sowing and 4-6 weeks after sowing',
          benefits: ['Improved leaf growth', 'Better protein content', 'Enhanced yield'],
          priority: soilData.nitrogen < 25 ? 'high' : 'medium'
        });
      }
      
      // Phosphorus recommendations
      if (soilData.phosphorus < 30) {
        recs.push({
          type: 'Phosphorus Fertilizer (DAP)',
          amount: `${Math.round((30 - soilData.phosphorus) * 3)} kg/hectare`,
          applicationMethod: 'Band placement near seed furrow',
          timing: 'At sowing time',
          benefits: ['Better root development', 'Improved flowering', 'Enhanced seed formation'],
          priority: soilData.phosphorus < 15 ? 'high' : 'medium'
        });
      }
      
      // Potassium recommendations
      if (soilData.potassium < 35) {
        recs.push({
          type: 'Potassium Fertilizer (MOP)',
          amount: `${Math.round((35 - soilData.potassium) * 2)} kg/hectare`,
          applicationMethod: 'Broadcasting and incorporation',
          timing: 'Pre-sowing preparation',
          benefits: ['Disease resistance', 'Drought tolerance', 'Better grain quality'],
          priority: soilData.potassium < 20 ? 'high' : 'medium'
        });
      }
      
      // pH correction
      if (soilData.ph < 6.0) {
        recs.push({
          type: 'Lime Application',
          amount: `${Math.round((6.5 - soilData.ph) * 500)} kg/hectare`,
          applicationMethod: 'Broadcasting and deep incorporation',
          timing: '2-3 months before sowing',
          benefits: ['pH correction', 'Better nutrient availability', 'Improved soil structure'],
          priority: 'high'
        });
      } else if (soilData.ph > 8.0) {
        recs.push({
          type: 'Gypsum Application',
          amount: `${Math.round((soilData.ph - 7.5) * 300)} kg/hectare`,
          applicationMethod: 'Surface application and irrigation',
          timing: 'Before sowing season',
          benefits: ['pH reduction', 'Calcium supply', 'Soil structure improvement'],
          priority: 'medium'
        });
      }
      
      // Organic matter enhancement
      if (soilData.organicMatter < 3.0) {
        recs.push({
          type: 'Organic Compost',
          amount: '2-3 tons/hectare',
          applicationMethod: 'Broadcasting and incorporation',
          timing: 'During land preparation',
          benefits: ['Soil health improvement', 'Water retention', 'Microbial activity'],
          priority: 'medium'
        });
      }
      
      // Micronutrient recommendations
      recs.push({
        type: 'Micronutrient Mix (Zn, Fe, Mn, B)',
        amount: '5-10 kg/hectare',
        applicationMethod: 'Soil application or foliar spray',
        timing: 'At vegetative growth stage',
        benefits: ['Enzyme activation', 'Better photosynthesis', 'Quality improvement'],
        priority: 'low'
      });
      
      setRecommendations(recs.sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }));
      
      toast({
        title: t('common.success'),
        description: `Generated ${recs.length} fertilizer recommendations`,
      });
      
    } catch (error) {
      toast({
        title: t('common.error'),
        description: 'Failed to generate recommendations',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'warning';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return AlertCircle;
      case 'medium': return CheckCircle;
      case 'low': return CheckCircle;
      default: return CheckCircle;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2 bg-gradient-primary bg-clip-text text-transparent">
          {t('fertilizer.title')}
        </h2>
        <p className="text-muted-foreground">{t('fertilizer.subtitle')}</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Soil Analysis Input */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Beaker className="h-5 w-5 text-primary" />
              {t('fertilizer.soilAnalysis')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="nitrogen-fert">Nitrogen (ppm)</Label>
              <Input
                id="nitrogen-fert"
                type="number"
                value={soilData.nitrogen}
                onChange={(e) => handleInputChange('nitrogen', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="phosphorus-fert">Phosphorus (ppm)</Label>
              <Input
                id="phosphorus-fert"
                type="number"
                value={soilData.phosphorus}
                onChange={(e) => handleInputChange('phosphorus', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="potassium-fert">Potassium (ppm)</Label>
              <Input
                id="potassium-fert"
                type="number"
                value={soilData.potassium}
                onChange={(e) => handleInputChange('potassium', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="ph-fert">pH Level</Label>
              <Input
                id="ph-fert"
                type="number"
                step="0.1"
                value={soilData.ph}
                onChange={(e) => handleInputChange('ph', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="organic">Organic Matter (%)</Label>
              <Input
                id="organic"
                type="number"
                step="0.1"
                value={soilData.organicMatter}
                onChange={(e) => handleInputChange('organicMatter', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="crop-type">Crop Type</Label>
              <Input
                id="crop-type"
                value={soilData.cropType}
                onChange={(e) => handleInputChange('cropType', e.target.value)}
                placeholder="e.g., wheat, rice, corn"
              />
            </div>
            
            <Button 
              onClick={generateRecommendations} 
              disabled={loading}
              className="w-full"
              variant="agricultural"
            >
              <Leaf className="h-4 w-4 mr-2" />
              {loading ? t('common.loading') : t('fertilizer.getRecommendation')}
            </Button>
          </CardContent>
        </Card>

        {/* Recommendations */}
        <div className="lg:col-span-2">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary" />
                {t('fertilizer.recommendation')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recommendations.length > 0 ? (
                <div className="space-y-4">
                  {recommendations.map((rec, index) => {
                    const PriorityIcon = getPriorityIcon(rec.priority);
                    return (
                      <div key={index} className="border rounded-lg p-4 space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <PriorityIcon className="h-4 w-4" />
                            <h3 className="font-semibold">{rec.type}</h3>
                          </div>
                          <Badge variant={getPriorityColor(rec.priority) as any}>
                            {rec.priority} priority
                          </Badge>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium text-muted-foreground">Amount:</span>
                            <div>{rec.amount}</div>
                          </div>
                          <div>
                            <span className="font-medium text-muted-foreground">Timing:</span>
                            <div>{rec.timing}</div>
                          </div>
                          <div className="md:col-span-2">
                            <span className="font-medium text-muted-foreground">Application:</span>
                            <div>{rec.applicationMethod}</div>
                          </div>
                        </div>
                        
                        <div>
                          <span className="font-medium text-muted-foreground text-sm">Benefits:</span>
                          <ul className="list-disc list-inside text-sm mt-1 space-y-1">
                            {rec.benefits.map((benefit, idx) => (
                              <li key={idx}>{benefit}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-12">
                  <Beaker className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Enter soil analysis data to get personalized fertilizer recommendations</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}