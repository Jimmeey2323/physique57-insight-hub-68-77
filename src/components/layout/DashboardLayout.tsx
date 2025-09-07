import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  TrendingUp, 
  Users, 
  UserCheck, 
  GraduationCap, 
  Calendar, 
  Percent, 
  Play, 
  Activity, 
  XCircle, 
  AlertTriangle 
} from 'lucide-react';
import { GlobalNoteTaker } from '@/components/ui/GlobalNoteTaker';
import { Footer } from '@/components/ui/footer';
import { cn } from '@/lib/utils';

interface NavigationItem {
  path: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const navigationItems: NavigationItem[] = [
  {
    path: '/executive-summary',
    label: 'Executive Summary',
    icon: Home,
    description: 'Overview of all key metrics and insights'
  },
  {
    path: '/sales-analytics',
    label: 'Sales Analytics',
    icon: TrendingUp,
    description: 'Revenue trends and sales performance'
  },
  {
    path: '/funnel-leads',
    label: 'Funnel Leads',
    icon: Users,
    description: 'Lead generation and conversion tracking'
  },
  {
    path: '/client-retention',
    label: 'Client Retention',
    icon: UserCheck,
    description: 'Client conversion and retention analysis'
  },
  {
    path: '/trainer-performance',
    label: 'Trainer Performance',
    icon: GraduationCap,
    description: 'Individual trainer metrics and rankings'
  },
  {
    path: '/class-attendance',
    label: 'Class Attendance',
    icon: Calendar,
    description: 'Class performance and attendance analytics'
  },
  {
    path: '/discounts-promotions',
    label: 'Discounts & Promotions',
    icon: Percent,
    description: 'Promotional campaigns and discount analysis'
  },
  {
    path: '/sessions',
    label: 'Sessions',
    icon: Play,
    description: 'Session booking and attendance data'
  },
  {
    path: '/powercycle-vs-barre',
    label: 'PowerCycle vs Barre',
    icon: Activity,
    description: 'Comparative analysis of class types'
  },
  {
    path: '/expiration-analytics',
    label: 'Expiration Analytics',
    icon: AlertTriangle,
    description: 'Membership expiration tracking and insights'
  },
  {
    path: '/late-cancellations',
    label: 'Late Cancellations',
    icon: XCircle,
    description: 'Analysis of late cancellation patterns'
  }
];

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Enhanced Header with Navigation */}
      <div className="border-b border-gray-200 bg-white/95 backdrop-blur-sm sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo and Brand */}
            <div className="flex items-center gap-6">
              <Link to="/" className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Home className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent">
                    Physique 57
                  </h1>
                  <p className="text-xs text-slate-500 -mt-1">Insight Hub</p>
                </div>
              </Link>
            </div>

            {/* Navigation Menu */}
            <div className="flex items-center gap-2 overflow-x-auto max-w-3xl">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap",
                      isActive
                        ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    )}
                    title={item.description}
                  >
                    <Icon className={cn(
                      "w-4 h-4",
                      isActive ? "text-white" : "text-slate-500"
                    )} />
                    <span className="hidden lg:inline">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container mx-auto px-6 py-8">
        <main className="space-y-8">
          {children || <Outlet />}
        </main>
      </div>
      
      {/* Global Components */}
      <GlobalNoteTaker />
      <Footer />
    </div>
  );
};