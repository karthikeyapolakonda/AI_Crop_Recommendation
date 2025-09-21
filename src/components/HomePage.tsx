import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/context/LanguageContext';
import { 
  Sprout, 
  BarChart3, 
  TrendingUp, 
  Brain, 
  Leaf,
  Target,
  Award,
  Cloud,
  Calculator
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (tab: string) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  const { t } = useLanguage();

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Crop Prediction',
      description: 'Machine learning algorithms analyze soil data to predict the best crops with actual crop names from our dataset.',
      color: 'text-primary',
      action: () => onNavigate('prediction')
    },
    {
      icon: TrendingUp,
      title: 'Weather Forecast',
      description: '7-day weather forecast with farming alerts and recommendations for optimal agricultural planning.',
      color: 'text-accent',
      action: () => onNavigate('weather')
    },
    {
      icon: Target,
      title: 'Profit Calculator',
      description: 'Calculate expected profits, ROI, and break-even analysis for informed crop selection decisions.',
      color: 'text-success',
      action: () => onNavigate('profit')
    }
  ];

  const benefits = [
    {
      icon: Target,
      title: 'Precision Farming',
      description: 'Data-driven insights for optimal resource utilization'
    },
    {
      icon: Award,
      title: 'Increased Yields',
      description: 'Scientific approach to maximize crop productivity'
    },
    {
      icon: Leaf,
      title: 'Sustainable Practices',
      description: 'Environmentally conscious farming recommendations'
    }
  ];

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-8 py-12">
        <div className="space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-hero bg-clip-text text-transparent animate-float">
            {t('home.title')}
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
            {t('home.subtitle')}
          </p>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('home.description')}
          </p>
        </div>

        <Button 
          size="lg" 
          variant="hero"
          onClick={() => onNavigate('prediction')}
          className="text-lg px-8 py-4"
        >
          <Sprout className="h-5 w-5 mr-2" />
          {t('home.getStarted')}
        </Button>
      </section>

      {/* Features Grid */}
      <section className="space-y-8">
        <h2 className="text-3xl font-bold text-center">Intelligent Agricultural Solutions</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={index}
                className="shadow-agricultural hover:shadow-glow transition-all duration-300 cursor-pointer group"
                onClick={feature.action}
              >
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 p-3 rounded-full bg-gradient-earth w-fit">
                    <Icon className={`h-8 w-8 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-center group-hover:text-foreground transition-colors">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-gradient-earth rounded-2xl p-8 space-y-8">
        <h2 className="text-3xl font-bold text-center">Why Choose CropWise AI?</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div key={index} className="text-center space-y-4">
                <div className="mx-auto p-3 rounded-full bg-primary/10 w-fit">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Quick Stats */}
      <section className="grid md:grid-cols-4 gap-6">
        <Card className="text-center p-6">
          <div className="text-3xl font-bold text-primary">95%</div>
          <div className="text-sm text-muted-foreground">Prediction Accuracy</div>
        </Card>
        <Card className="text-center p-6">
          <div className="text-3xl font-bold text-success">30%</div>
          <div className="text-sm text-muted-foreground">Yield Increase</div>
        </Card>
        <Card className="text-center p-6">
          <div className="text-3xl font-bold text-accent">25%</div>
          <div className="text-sm text-muted-foreground">Cost Reduction</div>
        </Card>
        <Card className="text-center p-6">
          <div className="text-3xl font-bold text-primary">3</div>
          <div className="text-sm text-muted-foreground">Languages Supported</div>
        </Card>
      </section>

      {/* CTA Section */}
      <section className="text-center space-y-6 py-12 bg-gradient-primary rounded-2xl">
        <h2 className="text-3xl font-bold text-primary-foreground">
          Ready to Transform Your Farming?
        </h2>
        <p className="text-lg text-primary-foreground/90 max-w-2xl mx-auto">
          Join thousands of farmers already using AI-powered insights to maximize their agricultural success.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Button 
            size="lg" 
            variant="outline"
            onClick={() => onNavigate('prediction')}
            className="bg-white text-primary hover:bg-white/90"
          >
            <Brain className="h-5 w-5 mr-2" />
            AI Crop Prediction
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            onClick={() => onNavigate('weather')}
            className="bg-white text-primary hover:bg-white/90"
          >
            <Cloud className="h-5 w-5 mr-2" />
            Weather Forecast
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            onClick={() => onNavigate('profit')}
            className="bg-white text-primary hover:bg-white/90"
          >
            <Calculator className="h-5 w-5 mr-2" />
            Profit Calculator
          </Button>
        </div>
      </section>
    </div>
  );
}