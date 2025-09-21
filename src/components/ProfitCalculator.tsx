import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/context/LanguageContext';
import { 
  Calculator, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  PieChart,
  Target,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

interface CropInputs {
  cropType: string;
  areaInAcres: number;
  expectedYield: number; // quintals per acre
  sellingPrice: number; // rupees per quintal
  seedCost: number;
  fertilizerCost: number;
  laborCost: number;
  irrigationCost: number;
  otherCosts: number;
}

interface ProfitAnalysis {
  totalRevenue: number;
  totalCosts: number;
  grossProfit: number;
  profitMargin: number;
  roiPercentage: number;
  breakEvenPoint: number;
  profitPerAcre: number;
  riskAssessment: 'low' | 'medium' | 'high';
  recommendations: string[];
}

export function ProfitCalculator() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [inputs, setInputs] = useState<CropInputs>({
    cropType: 'wheat',
    areaInAcres: 1,
    expectedYield: 20,
    sellingPrice: 2500,
    seedCost: 3000,
    fertilizerCost: 8000,
    laborCost: 12000,
    irrigationCost: 5000,
    otherCosts: 2000
  });
  const [analysis, setAnalysis] = useState<ProfitAnalysis | null>(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: keyof CropInputs, value: string) => {
    const numValue = parseFloat(value) || 0;
    setInputs(prev => ({ ...prev, [field]: numValue }));
  };

  const handleCropTypeChange = (value: string) => {
    setInputs(prev => ({ ...prev, cropType: value }));
    
    // Update default values based on crop type
    const defaults = {
      wheat: { yield: 20, price: 2500 },
      rice: { yield: 25, price: 2200 },
      maize: { yield: 30, price: 2000 },
      cotton: { yield: 8, price: 6000 }
    };
    
    const cropDefaults = defaults[value as keyof typeof defaults];
    if (cropDefaults) {
      setInputs(prev => ({
        ...prev,
        expectedYield: cropDefaults.yield,
        sellingPrice: cropDefaults.price
      }));
    }
  };

  const calculateProfit = async () => {
    setLoading(true);
    
    try {
      // Simulate calculation processing
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const totalRevenue = inputs.areaInAcres * inputs.expectedYield * inputs.sellingPrice;
      const totalCosts = inputs.seedCost + inputs.fertilizerCost + inputs.laborCost + 
                        inputs.irrigationCost + inputs.otherCosts;
      const grossProfit = totalRevenue - totalCosts;
      const profitMargin = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0;
      const roiPercentage = totalCosts > 0 ? (grossProfit / totalCosts) * 100 : 0;
      const breakEvenPoint = inputs.sellingPrice > 0 ? totalCosts / (inputs.sellingPrice * inputs.areaInAcres) : 0;
      const profitPerAcre = inputs.areaInAcres > 0 ? grossProfit / inputs.areaInAcres : 0;
      
      // Risk assessment
      let riskAssessment: 'low' | 'medium' | 'high' = 'low';
      if (profitMargin < 10) riskAssessment = 'high';
      else if (profitMargin < 25) riskAssessment = 'medium';
      
      // Generate recommendations
      const recommendations: string[] = [];
      
      if (profitMargin < 0) {
        recommendations.push('Current projection shows losses. Consider cost optimization or crop change.');
      } else if (profitMargin < 15) {
        recommendations.push('Low profit margins detected. Focus on reducing input costs.');
      } else {
        recommendations.push('Good profit potential identified for this crop selection.');
      }
      
      if (roiPercentage < 20) {
        recommendations.push('Consider crops with higher market demand for better returns.');
      }
      
      if (inputs.laborCost > totalCosts * 0.4) {
        recommendations.push('Labor costs are high. Consider mechanization opportunities.');
      }
      
      if (inputs.fertilizerCost > totalCosts * 0.3) {
        recommendations.push('Fertilizer costs are significant. Explore organic alternatives.');
      }
      
      recommendations.push(`Break-even yield: ${breakEvenPoint.toFixed(1)} quintals per acre`);
      
      setAnalysis({
        totalRevenue,
        totalCosts,
        grossProfit,
        profitMargin,
        roiPercentage,
        breakEvenPoint,
        profitPerAcre,
        riskAssessment,
        recommendations
      });
      
      toast({
        title: t('common.success'),
        description: 'Profit analysis completed successfully',
      });
      
    } catch (error) {
      toast({
        title: t('common.error'),
        description: 'Failed to calculate profit analysis',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'success';
      case 'medium': return 'warning';
      case 'high': return 'destructive';
      default: return 'secondary';
    }
  };

  const getProfitColor = (profit: number) => {
    if (profit > 0) return 'text-success';
    if (profit < 0) return 'text-destructive';
    return 'text-muted-foreground';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2 bg-gradient-primary bg-clip-text text-transparent">
          Profit Prediction Calculator
        </h2>
        <p className="text-muted-foreground">Calculate expected profits and ROI for your crop planning</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Input Form */}
        <div className="lg:col-span-1">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-primary" />
                Crop & Cost Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="cropType">Crop Type</Label>
                <select
                  id="cropType"
                  value={inputs.cropType}
                  onChange={(e) => handleCropTypeChange(e.target.value)}
                  className="w-full p-2 border rounded-md bg-background"
                >
                  <option value="wheat">Wheat</option>
                  <option value="rice">Rice</option>
                  <option value="maize">Maize</option>
                  <option value="cotton">Cotton</option>
                </select>
              </div>
              
              <div>
                <Label htmlFor="area">Farm Area (Acres)</Label>
                <Input
                  id="area"
                  type="number"
                  value={inputs.areaInAcres}
                  onChange={(e) => handleInputChange('areaInAcres', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="yield">Expected Yield (Quintals/Acre)</Label>
                <Input
                  id="yield"
                  type="number"
                  value={inputs.expectedYield}
                  onChange={(e) => handleInputChange('expectedYield', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="price">Selling Price (₹/Quintal)</Label>
                <Input
                  id="price"
                  type="number"
                  value={inputs.sellingPrice}
                  onChange={(e) => handleInputChange('sellingPrice', e.target.value)}
                />
              </div>
              
              <div className="space-y-3">
                <h4 className="font-medium text-sm">Cost Breakdown (₹)</h4>
                
                <div>
                  <Label htmlFor="seed">Seed Cost</Label>
                  <Input
                    id="seed"
                    type="number"
                    value={inputs.seedCost}
                    onChange={(e) => handleInputChange('seedCost', e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="fertilizer">Fertilizer Cost</Label>
                  <Input
                    id="fertilizer"
                    type="number"
                    value={inputs.fertilizerCost}
                    onChange={(e) => handleInputChange('fertilizerCost', e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="labor">Labor Cost</Label>
                  <Input
                    id="labor"
                    type="number"
                    value={inputs.laborCost}
                    onChange={(e) => handleInputChange('laborCost', e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="irrigation">Irrigation Cost</Label>
                  <Input
                    id="irrigation"
                    type="number"
                    value={inputs.irrigationCost}
                    onChange={(e) => handleInputChange('irrigationCost', e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="other">Other Costs</Label>
                  <Input
                    id="other"
                    type="number"
                    value={inputs.otherCosts}
                    onChange={(e) => handleInputChange('otherCosts', e.target.value)}
                  />
                </div>
              </div>
              
              <Button 
                onClick={calculateProfit}
                disabled={loading}
                className="w-full"
                variant="agricultural"
              >
                <Target className="h-4 w-4 mr-2" />
                {loading ? 'Calculating...' : 'Calculate Profit'}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Results */}
        <div className="lg:col-span-2">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5 text-primary" />
                Profit Analysis Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              {analysis ? (
                <div className="space-y-6">
                  {/* Key Metrics */}
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-gradient-earth rounded-lg">
                      <div className="text-sm text-muted-foreground mb-1">Total Revenue</div>
                      <div className="text-2xl font-bold text-success">
                        {formatCurrency(analysis.totalRevenue)}
                      </div>
                    </div>
                    <div className="text-center p-4 bg-gradient-earth rounded-lg">
                      <div className="text-sm text-muted-foreground mb-1">Total Costs</div>
                      <div className="text-2xl font-bold text-destructive">
                        {formatCurrency(analysis.totalCosts)}
                      </div>
                    </div>
                    <div className="text-center p-4 bg-gradient-earth rounded-lg">
                      <div className="text-sm text-muted-foreground mb-1">Gross Profit</div>
                      <div className={`text-2xl font-bold ${getProfitColor(analysis.grossProfit)}`}>
                        {formatCurrency(analysis.grossProfit)}
                      </div>
                    </div>
                  </div>

                  {/* Performance Indicators */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-muted-foreground">Profit Margin</span>
                        <span className={`font-medium ${getProfitColor(analysis.profitMargin)}`}>
                          {analysis.profitMargin.toFixed(1)}%
                        </span>
                      </div>
                      <Progress value={Math.max(0, Math.min(100, analysis.profitMargin))} className="h-2" />
                    </div>
                    
                    <div className="p-4 border rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-muted-foreground">ROI</span>
                        <span className={`font-medium ${getProfitColor(analysis.roiPercentage)}`}>
                          {analysis.roiPercentage.toFixed(1)}%
                        </span>
                      </div>
                      <Progress value={Math.max(0, Math.min(100, analysis.roiPercentage))} className="h-2" />
                    </div>
                  </div>

                  {/* Additional Metrics */}
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="text-center p-3 border rounded-lg">
                      <div className="text-sm text-muted-foreground">Profit per Acre</div>
                      <div className={`text-lg font-semibold ${getProfitColor(analysis.profitPerAcre)}`}>
                        {formatCurrency(analysis.profitPerAcre)}
                      </div>
                    </div>
                    <div className="text-center p-3 border rounded-lg">
                      <div className="text-sm text-muted-foreground">Break-even Yield</div>
                      <div className="text-lg font-semibold">
                        {analysis.breakEvenPoint.toFixed(1)} Q/Acre
                      </div>
                    </div>
                    <div className="text-center p-3 border rounded-lg">
                      <div className="text-sm text-muted-foreground">Risk Level</div>
                      <Badge variant={getRiskColor(analysis.riskAssessment) as any}>
                        {analysis.riskAssessment} risk
                      </Badge>
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      Financial Recommendations
                    </h4>
                    <ul className="space-y-2">
                      {analysis.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-12">
                  <Calculator className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Enter crop details and costs to calculate profit predictions</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}