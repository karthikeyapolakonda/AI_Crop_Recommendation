import React from 'react';
import { Button } from '@/components/ui/button';
import { LanguageSelector } from '@/components/LanguageSelector';
import { useLanguage } from '@/context/LanguageContext';
import { Sprout, BarChart3, Beaker, TrendingUp } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  const { t } = useLanguage();

  const navItems = [
    { id: 'home', label: t('common.home'), icon: Sprout },
    { id: 'prediction', label: t('navigation.cropPrediction'), icon: BarChart3 },
    { id: 'fertilizer', label: t('navigation.fertilizer'), icon: Beaker },
    { id: 'market', label: t('navigation.marketTrends'), icon: TrendingUp },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Sprout className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                CropWise AI
              </h1>
            </div>
            
            <div className="hidden md:flex items-center gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant={activeTab === item.id ? 'default' : 'ghost'}
                    onClick={() => onTabChange(item.id)}
                    className="gap-2"
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                );
              })}
            </div>
          </div>
          
          <LanguageSelector />
        </div>
        
        {/* Mobile navigation */}
        <div className="md:hidden mt-4 grid grid-cols-2 gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant={activeTab === item.id ? 'default' : 'outline'}
                onClick={() => onTabChange(item.id)}
                className="gap-2 text-xs"
                size="sm"
              >
                <Icon className="h-3 w-3" />
                {item.label}
              </Button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}