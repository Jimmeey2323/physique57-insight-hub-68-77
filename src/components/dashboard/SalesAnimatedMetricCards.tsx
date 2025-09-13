import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Users, ShoppingCart, CreditCard, DollarSign, Target, Activity, Calendar, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { SalesData } from '@/types/dashboard';
import { formatCurrency } from '@/utils/formatters';
import { cn } from '@/lib/utils';
import { useSalesMetrics } from '@/hooks/useSalesMetrics';

interface SalesAnimatedMetricCardsProps {
  data: SalesData[];
  onMetricClick?: (metricData: any) => void;
}

const iconMap = {
  DollarSign,
  ShoppingCart,
  Activity,
  Users,
  Target,
  Calendar,
  CreditCard,
  ArrowDownRight
};

export const SalesAnimatedMetricCards: React.FC<SalesAnimatedMetricCardsProps> = ({ 
  data, 
  onMetricClick 
}) => {
  const { metrics } = useSalesMetrics(data);

  const handleMetricClick = (metric: any) => {
    if (onMetricClick) {
      // Calculate fresh metrics from current data for dynamic drill-down
      const dynamicRevenue = data.reduce((sum, item) => sum + (item.paymentValue || 0), 0);
      const dynamicTransactions = data.length;
      const dynamicCustomers = new Set(data.map(item => item.memberId || item.customerEmail)).size;
      
      const drillDownData = {
        title: metric.title,
        name: metric.title,
        type: 'metric',
        // Use dynamic calculations from current filtered data
        totalRevenue: dynamicRevenue,
        grossRevenue: dynamicRevenue,
        netRevenue: dynamicRevenue,
        totalValue: dynamicRevenue,
        totalCurrent: dynamicRevenue,
        metricValue: dynamicRevenue,
        transactions: dynamicTransactions,
        totalTransactions: dynamicTransactions,
        uniqueMembers: dynamicCustomers,
        totalCustomers: dynamicCustomers,
        totalChange: metric.change,
        rawData: data,
        filteredTransactionData: data,
        months: {},
        monthlyValues: {},
        // Add dynamic flags
        isDynamic: true,
        calculatedFromFiltered: true
      };
      
      console.log(`Metric ${metric.title} clicked: ${dynamicTransactions} transactions, ${dynamicRevenue} revenue`);
      onMetricClick(drillDownData);
    }
  };

  if (metrics.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, index) => (
          <Card key={index} className="bg-gray-100 animate-pulse">
            <CardContent className="p-6">
              <div className="h-20 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => {
        const IconComponent = iconMap[metric.icon as keyof typeof iconMap] || DollarSign;
        const isPositive = metric.change > 0;
        
        return (
          <Card 
            key={index} 
            className={cn(
              "bg-white shadow-xl border-0 overflow-hidden hover:shadow-2xl transition-all duration-500 group cursor-pointer",
              "hover:scale-105 transform"
            )}
            onClick={() => handleMetricClick(metric)}
            style={{ animationDelay: `${index * 150}ms` }}
          >
            <CardContent className="p-0">
              <div className={`bg-gradient-to-r ${
                metric.color === 'blue' ? 'from-blue-500 to-indigo-600' :
                metric.color === 'green' ? 'from-green-500 to-teal-600' :
                metric.color === 'purple' ? 'from-purple-500 to-violet-600' :
                metric.color === 'orange' ? 'from-orange-500 to-red-600' :
                metric.color === 'cyan' ? 'from-cyan-500 to-blue-600' :
                metric.color === 'pink' ? 'from-pink-500 to-rose-600' :
                metric.color === 'red' ? 'from-red-500 to-rose-600' :
                'from-amber-500 to-orange-600'
              } p-6 text-white relative overflow-hidden`}>
                
                {/* Background decorative icon */}
                <div className="absolute top-0 right-0 w-20 h-20 transform translate-x-8 -translate-y-8 opacity-20">
                  <IconComponent className="w-20 h-20" />
                </div>
                
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <h3 className="font-semibold text-sm">{metric.title}</h3>
                  </div>
                  
                  <div className="space-y-3">
                    
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <p className="text-3xl font-bold mb-1">{metric.value}</p>
                      </div>
                      
                      {/* Growth Indicator - Positioned on right */}
                      <div className={cn(
                        "flex flex-col items-end gap-3 px-2.5 py-1.5 rounded-lg text-xs font-bold border transition-all duration-300 shrink-0",
                        metric.changeDetails?.isSignificant ? "shadow-lg" : "shadow-sm",
                        isPositive ? 
                          "bg-gradient-to-r from-green-50 to-emerald-50 text-green-800 border-green-200" : 
                          "bg-gradient-to-r from-red-50 to-rose-50 text-red-700 border-red-200"
                      )}>
                        {/* Growth Percentage and Direction */}
                        <div className="flex items-center gap-1">
                          {isPositive ? (
                            <ArrowUpRight className="w-3 h-3" />
                          ) : (
                            <ArrowDownRight className="w-3 h-3" />
                          )}
                          <span className="font-extrabold text-xs">
                            {isPositive ? '+' : ''}{metric.change.toFixed(1)}%
                          </span>
                        </div>
                        
                        {/* Significance Badge */}
                        {metric.changeDetails?.isSignificant && (
                          <Badge 
                            variant="secondary" 
                            className={cn(
                              "text-xs px-1.5 py-0.5 font-bold border-0",
                              metric.changeDetails.trend === 'strong' ? "bg-white/90 text-slate-700" :
                              "bg-white/70 text-slate-600"
                            )}
                          >
                            {metric.changeDetails.trend.toUpperCase()}
                          </Badge>
                        )}
                        
                        {/* Trend Strength Indicator */}
                        <div className={cn(
                          "w-1.5 h-1.5 rounded-full animate-pulse",
                          metric.changeDetails?.trend === 'strong' ? "bg-current" :
                          metric.changeDetails?.trend === 'moderate' ? "bg-current opacity-70" :
                          "bg-current opacity-40"
                        )} />
                      </div>
                    </div>
                    
                    {/* Previous Value Comparison - Now inside the card */}
                    <div className="pt-2 border-t border-white/20">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-xs text-white/60 font-medium">Previous Period</div>
                          <div className="text-sm font-bold text-white/90">{metric.previousValue}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-white/60 font-medium">Change</div>
                          <div className={cn(
                            "text-sm font-semibold",
                            isPositive ? "text-green-200" : "text-red-200"
                          )}>
                            {isPositive ? '+' : ''}{formatCurrency(Math.abs(metric.comparison.difference))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Description section */}
              <div className="p-4 bg-gray-50">
                <p className="text-sm text-gray-600">{metric.description}</p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
