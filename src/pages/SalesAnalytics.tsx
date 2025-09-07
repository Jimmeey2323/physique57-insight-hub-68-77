import React from 'react';
import { SalesAnalyticsSection } from '@/components/dashboard/SalesAnalyticsSection';
import { useGoogleSheets } from '@/hooks/useGoogleSheets';
import { HeroSection } from '@/components/ui/HeroSection';
import { TrendingUp } from 'lucide-react';

const SalesAnalytics = () => {
  const { data } = useGoogleSheets();

  return (
    <>
      <HeroSection 
        title="Sales Analytics"
        subtitle="Comprehensive analysis of sales performance, revenue trends, and customer insights"
        icon={TrendingUp}
        variant="sales"
      />
      <SalesAnalyticsSection data={data} />
    </>
  );
};

export default SalesAnalytics;
