import React, { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { HomePage } from '@/components/HomePage';
import { CropPrediction } from '@/components/CropPrediction';
import { WeatherForecast } from '@/components/WeatherForecast';
import { ProfitCalculator } from '@/components/ProfitCalculator';
import { MarketTrends } from '@/components/MarketTrends';

const Index = () => {
  const [activeTab, setActiveTab] = useState('home');

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomePage onNavigate={handleTabChange} />;
      case 'prediction':
        return <CropPrediction />;
      case 'weather':
        return <WeatherForecast />;
      case 'profit':
        return <ProfitCalculator />;
      case 'market':
        return <MarketTrends />;
      default:
        return <HomePage onNavigate={handleTabChange} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation activeTab={activeTab} onTabChange={handleTabChange} />
      
      <main className="container mx-auto px-4 py-8">
        {renderContent()}
      </main>
      
      {/* Footer */}
      <footer className="border-t border-border mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-muted-foreground">
            <p>&copy; 2024 CropWise AI Guidance. Empowering farmers with intelligent technology.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
