import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLateCancellationsData } from '@/hooks/useLateCancellationsData';
import { useGlobalLoading } from '@/hooks/useGlobalLoading';
import { ProfessionalLoader } from '@/components/dashboard/ProfessionalLoader';
import { LateCancellationsMetricCards } from '@/components/dashboard/LateCancellationsMetricCards';
import { LateCancellationsInteractiveCharts } from '@/components/dashboard/LateCancellationsInteractiveCharts';
import { EnhancedLateCancellationsTopBottomLists } from '@/components/dashboard/EnhancedLateCancellationsTopBottomLists';
import { EnhancedLateCancellationsDataTables } from '@/components/dashboard/EnhancedLateCancellationsDataTables';
import { EnhancedLateCancellationsFilterSection } from '@/components/dashboard/EnhancedLateCancellationsFilterSection';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Home, XCircle } from 'lucide-react';
import { Footer } from '@/components/ui/footer';
import { AdvancedExportButton } from '@/components/ui/AdvancedExportButton';

const LateCancellations = () => {
  const { data: lateCancellationsData, loading } = useLateCancellationsData();
  const { isLoading, setLoading } = useGlobalLoading();
  const navigate = useNavigate();
  
  // Location state for tabs
  const [activeLocation, setActiveLocation] = useState('all');
  
  // Enhanced filter states
  const [selectedTimeframe, setSelectedTimeframe] = useState('all');
  const [selectedTrainer, setSelectedTrainer] = useState('all');
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState('all');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  
  // Define locations for tabs
  const locations = useMemo(() => {
    const predefinedLocations = [
      { id: 'all', name: 'All Locations', fullName: 'All Locations' },
      { id: 'kwality', name: 'Kwality House', fullName: 'Kwality House, Kemps Corner' },
      { id: 'supreme', name: 'Supreme HQ', fullName: 'Supreme HQ, Bandra' },
      { id: 'kenkere', name: 'Kenkere House', fullName: 'Kenkere House, Bengaluru' }
    ];
    
    return predefinedLocations;
  }, []);
  
  // Filter data by location first
  const locationFilteredData = useMemo(() => {
    if (!Array.isArray(lateCancellationsData) || activeLocation === 'all') {
      return lateCancellationsData || [];
    }
    
    return lateCancellationsData.filter(item => {
      const itemLocation = item?.location?.toLowerCase() || '';
      switch (activeLocation) {
        case 'kwality':
          return itemLocation.includes('kwality') || itemLocation.includes('kemps');
        case 'supreme':
          return itemLocation.includes('supreme') || itemLocation.includes('bandra');
        case 'kenkere':
          return itemLocation.includes('kenkere') || itemLocation.includes('bengaluru');
        default:
          return true;
      }
    });
  }, [lateCancellationsData, activeLocation]);
  
  // Enhanced filter data based on all selected filters
  const filteredData = useMemo(() => {
    if (!Array.isArray(locationFilteredData)) return [];
    
    let filtered = locationFilteredData;
    
    // Trainer filter
    if (selectedTrainer !== 'all') {
      filtered = filtered.filter(item => item?.teacherName === selectedTrainer);
    }
    
    // Class filter
    if (selectedClass !== 'all') {
      filtered = filtered.filter(item => item?.cleanedClass === selectedClass);
    }
    
    // Product filter
    if (selectedProduct !== 'all') {
      filtered = filtered.filter(item => item?.cleanedProduct === selectedProduct);
    }
    
    // Time slot filter
    if (selectedTimeSlot !== 'all') {
      filtered = filtered.filter(item => {
        if (!item?.time) return false;
        const hour = parseInt(item.time.split(':')[0]);
        switch (selectedTimeSlot) {
          case 'morning':
            return hour >= 6 && hour < 12;
          case 'afternoon':
            return hour >= 12 && hour < 17;
          case 'evening':
            return hour >= 17 && hour < 22;
          case 'late':
            return hour >= 22 || hour < 6;
          default:
            return true;
        }
      });
    }
    
    // Timeframe filter
    if (selectedTimeframe !== 'all') {
      const now = new Date();
      const startDate = new Date();
      
      switch (selectedTimeframe) {
        case '1w':
          startDate.setDate(now.getDate() - 7);
          break;
        case '2w':
          startDate.setDate(now.getDate() - 14);
          break;
        case '1m':
          startDate.setMonth(now.getMonth() - 1);
          break;
        case '3m':
          startDate.setMonth(now.getMonth() - 3);
          break;
        case '6m':
          startDate.setMonth(now.getMonth() - 6);
          break;
        case '1y':
          startDate.setFullYear(now.getFullYear() - 1);
          break;
        case 'custom':
          if (dateRange.start || dateRange.end) {
            const customStart = dateRange.start ? new Date(dateRange.start) : new Date('2020-01-01');
            const customEnd = dateRange.end ? new Date(dateRange.end) : now;
            filtered = filtered.filter(item => {
              if (!item?.dateIST) return false;
              const itemDate = new Date(item.dateIST);
              return itemDate >= customStart && itemDate <= customEnd;
            });
          }
          return filtered;
        default:
          return filtered;
      }
      
      filtered = filtered.filter(item => {
        if (!item?.dateIST) return false;
        const itemDate = new Date(item.dateIST);
        return itemDate >= startDate && itemDate <= now;
      });
    }
    
    return filtered;
  }, [locationFilteredData, selectedTimeframe, selectedTrainer, selectedClass, selectedProduct, selectedTimeSlot, dateRange]);

  // Clear all filters function
  const clearAllFilters = () => {
    setSelectedTimeframe('all');
    setSelectedTrainer('all');
    setSelectedClass('all');
    setSelectedProduct('all');
    setSelectedTimeSlot('all');
    setDateRange({ start: '', end: '' });
  };

  useEffect(() => {
    setLoading(loading, 'Loading late cancellations data...');
  }, [loading, setLoading]);

  if (isLoading) {
    return <ProfessionalLoader variant="analytics" subtitle="Loading late cancellations analytics data..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/20">
      {/* Animated Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-red-900 via-rose-800 to-pink-900 text-white">
        <div className="absolute inset-0 bg-black/20" />
        
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-4 -left-4 w-32 h-32 bg-white/10 rounded-full animate-pulse" style={{ animationDuration: '3s' }}></div>
          <div className="absolute top-20 right-10 w-24 h-24 bg-red-300/20 rounded-full animate-bounce" style={{ animationDelay: '1s', animationDuration: '2s' }}></div>
          <div className="absolute bottom-10 left-20 w-40 h-40 bg-red-300/10 rounded-full animate-pulse" style={{ animationDelay: '0.5s', animationDuration: '4s' }}></div>
          <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-pink-300/15 rounded-full animate-ping" style={{ animationDelay: '2s', animationDuration: '3s' }}></div>
          <div className="absolute bottom-1/3 left-1/3 w-20 h-20 bg-rose-300/10 rounded-full animate-pulse" style={{ animationDelay: '1.5s', animationDuration: '5s' }}></div>
        </div>
        
        <div className="relative px-8 py-12">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <Button 
                onClick={() => navigate('/')} 
                variant="outline" 
                size="sm" 
                className="gap-2 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 hover:border-white/30 transition-all duration-300 hover:scale-105"
              >
                <Home className="w-4 h-4" />
                Dashboard
              </Button>
              <AdvancedExportButton 
                lateCancellationsData={lateCancellationsData}
                defaultFileName="late-cancellations-export"
                size="default"
                variant="outline"
              />
            </div>
            
            <div className="text-center space-y-4">
              <div className="inline-flex items-center gap-3 bg-white/15 backdrop-blur-md rounded-full px-8 py-3 border border-white/30 animate-fade-in-up shadow-xl">
                <XCircle className="w-5 h-5" />
                <span className="font-semibold text-lg">Late Cancellations Analytics</span>
              </div>
              
              <h1 className="text-6xl md:text-7xl font-black bg-gradient-to-r from-white via-red-100 to-pink-100 bg-clip-text text-transparent animate-fade-in-up delay-200 tracking-tight">
                Late Cancellations
              </h1>
              
              <p className="text-xl text-red-100 max-w-3xl mx-auto leading-relaxed animate-fade-in-up delay-300 font-medium">
                Comprehensive analysis of late cancellation patterns across locations, classes, trainers, and products
              </p>
              
              {/* Key Stats */}
              <div className="flex items-center justify-center gap-8 mt-8 animate-fade-in-up delay-500">
                <div className="text-center">
                  <div className="text-4xl font-bold text-white">{Array.isArray(lateCancellationsData) ? lateCancellationsData.length.toLocaleString() : '0'}</div>
                  <div className="text-sm text-red-200">Total Cancellations</div>
                </div>
                <div className="w-px h-12 bg-white/30" />
                <div className="text-center">
                  <div className="text-4xl font-bold text-white">
                    {Array.isArray(lateCancellationsData) ? new Set(lateCancellationsData.map(item => item?.memberId)).size.toLocaleString() : '0'}
                  </div>
                  <div className="text-sm text-red-200">Affected Members</div>
                </div>
                <div className="w-px h-12 bg-white/30" />
                <div className="text-center">
                  <div className="text-4xl font-bold text-white">
                    {Array.isArray(lateCancellationsData) ? new Set(lateCancellationsData.map(item => item?.location)).size.toLocaleString() : '0'}
                  </div>
                  <div className="text-sm text-red-200">Locations</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative">
        <div className="container mx-auto px-6 py-8">
          <div className="space-y-8">
            {/* Location Tabs */}
            <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0 overflow-hidden">
              <CardContent className="p-2">
                <Tabs value={activeLocation} onValueChange={setActiveLocation} className="w-full">
                  <TabsList className="grid w-full grid-cols-4 bg-gradient-to-r from-slate-100 to-slate-200 p-2 rounded-2xl h-auto gap-2">
                    {locations.map((location) => (
                      <TabsTrigger
                        key={location.id}
                        value={location.id}
                        className="rounded-xl px-6 py-4 font-semibold text-sm transition-all duration-300"
                      >
                        <div className="text-center">
                          <div className="font-bold">{location.name}</div>
                          <div className="text-xs opacity-75">{location.fullName}</div>
                        </div>
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {/* Tab Content */}
                  {locations.map((location) => (
                    <TabsContent key={location.id} value={location.id} className="space-y-8 mt-8">
                      {/* Enhanced Filter Section */}
                      <EnhancedLateCancellationsFilterSection
                        selectedLocation="all" // Not used anymore, always "all" for current tab
                        onLocationChange={() => {}} // Not used anymore
                        selectedTimeframe={selectedTimeframe}
                        onTimeframeChange={setSelectedTimeframe}
                        selectedTrainer={selectedTrainer}
                        onTrainerChange={setSelectedTrainer}
                        selectedClass={selectedClass}
                        onClassChange={setSelectedClass}
                        selectedProduct={selectedProduct}
                        onProductChange={setSelectedProduct}
                        selectedTimeSlot={selectedTimeSlot}
                        onTimeSlotChange={setSelectedTimeSlot}
                        dateRange={dateRange}
                        onDateRangeChange={setDateRange}
                        data={locationFilteredData}
                        onClearFilters={clearAllFilters}
                      />
                      
                      {/* Metric Cards */}
                      <LateCancellationsMetricCards data={filteredData} />
                      
                      {/* Interactive Charts */}
                      <LateCancellationsInteractiveCharts data={filteredData} />
                      
                      {/* Enhanced Top/Bottom Lists (Side by Side) */}
                      <EnhancedLateCancellationsTopBottomLists data={filteredData} />
                      
                      {/* Enhanced Detailed Data Tables with Pagination */}
                      <EnhancedLateCancellationsDataTables data={filteredData} />
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <Footer />
      
      <style>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }
        
        .delay-200 {
          animation-delay: 0.2s;
        }
        
        .delay-300 {
          animation-delay: 0.3s;
        }
      `}</style>
    </div>
  );
};

export default LateCancellations;
