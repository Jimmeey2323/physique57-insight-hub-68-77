import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { LateCancellationsData } from '@/types/dashboard';
import { formatCurrency, formatNumber } from '@/utils/formatters';
import { Calendar, Clock, MapPin, User, Package, DollarSign } from 'lucide-react';

interface LateCancellationsDrillDownModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: any;
  title: string;
}

export const LateCancellationsDrillDownModal: React.FC<LateCancellationsDrillDownModalProps> = ({
  isOpen,
  onClose,
  data,
  title
}) => {
  if (!data) return null;

  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'N/A';
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  const formatTime = (timeStr: string) => {
    if (!timeStr) return 'N/A';
    try {
      const [hours, minutes] = timeStr.split(':');
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour % 12 || 12;
      return `${displayHour}:${minutes} ${ampm}`;
    } catch {
      return timeStr;
    }
  };

  // Handle different data types (single cancellation or member with multiple cancellations)
  const renderContent = () => {
    if (data.cancellations && Array.isArray(data.cancellations)) {
      // Multiple cancellations for a member
      return (
        <div className="space-y-6">
          {/* Member Information */}
          <Card className="bg-gradient-to-r from-red-50 to-pink-50 border-red-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-800">
                <User className="w-5 h-5" />
                Member Details
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-semibold">{data.memberName || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-semibold text-sm">{data.email || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Member ID</p>
                <p className="font-semibold">{data.memberId || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Date</p>
                <p className="font-semibold">{formatDate(data.date)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Cancellations</p>
                <Badge variant="destructive" className="font-bold">
                  {data.count} cancellations
                </Badge>
              </div>
              <div>
                <p className="text-sm text-gray-600">Details</p>
                <div className="flex gap-1 flex-wrap">
                  {data.uniqueLocations > 0 && (
                    <Badge variant="outline" className="text-xs">
                      {data.uniqueLocations} locations
                    </Badge>
                  )}
                  {data.uniqueClasses > 0 && (
                    <Badge variant="outline" className="text-xs">
                      {data.uniqueClasses} classes
                    </Badge>
                  )}
                  {data.uniqueTrainers > 0 && (
                    <Badge variant="outline" className="text-xs">
                      {data.uniqueTrainers} trainers
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cancellations Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Cancellation Details ({data.cancellations.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Session</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Trainer</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Product</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.cancellations.map((cancellation: any, index: number) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        {cancellation.sessionName || 'N/A'}
                      </TableCell>
                      <TableCell>{formatTime(cancellation.time)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-gray-500" />
                          <span className="text-sm">{cancellation.location || 'N/A'}</span>
                        </div>
                      </TableCell>
                      <TableCell>{cancellation.teacherName || 'N/A'}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {cancellation.cleanedClass || 'N/A'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-xs">
                          {cancellation.cleanedProduct || 'N/A'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      );
    } else {
      // Single cancellation data
      return (
        <div className="space-y-6">
          <Card className="bg-gradient-to-r from-red-50 to-pink-50 border-red-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-800">
                <Calendar className="w-5 h-5" />
                Cancellation Details
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Member Name</p>
                <p className="font-semibold">{`${data.firstName || ''} ${data.lastName || ''}`.trim() || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-semibold text-sm">{data.email || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Member ID</p>
                <p className="font-semibold">{data.memberId || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Date</p>
                <p className="font-semibold">{formatDate(data.dateIST)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Time</p>
                <p className="font-semibold flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {formatTime(data.time)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Location</p>
                <p className="font-semibold flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {data.location || 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Session Name</p>
                <p className="font-semibold">{data.sessionName || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Trainer</p>
                <p className="font-semibold">{data.teacherName || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Class Type</p>
                <Badge variant="outline">
                  {data.cleanedClass || 'N/A'}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-gray-600">Product</p>
                <Badge variant="secondary">
                  {data.cleanedProduct || 'N/A'}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-gray-600">Category</p>
                <Badge variant="outline">
                  {data.cleanedCategory || 'N/A'}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-gray-600">Paid Amount</p>
                <p className="font-semibold flex items-center gap-1">
                  <DollarSign className="w-4 h-4" />
                  {data.paidAmount ? formatCurrency(data.paidAmount) : 'N/A'}
                </p>
              </div>
              {data.duration && (
                <div>
                  <p className="text-sm text-gray-600">Duration</p>
                  <p className="font-semibold">{data.duration} minutes</p>
                </div>
              )}
              {data.dayOfWeek && (
                <div>
                  <p className="text-sm text-gray-600">Day of Week</p>
                  <p className="font-semibold">{data.dayOfWeek}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Calendar className="w-6 h-6 text-red-600" />
            {title}
          </DialogTitle>
        </DialogHeader>
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
};