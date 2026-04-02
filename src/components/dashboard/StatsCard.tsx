
import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isUp: boolean;
  };
  className?: string;
}

export function StatsCard({ title, value, description, icon: Icon, trend, className }: StatsCardProps) {
  return (
    <Card className={cn("dashboard-card", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between space-y-0 pb-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className="p-2 bg-secondary rounded-lg">
            <Icon className="h-4 w-4 text-primary" />
          </div>
        </div>
        <div className="mt-3">
          <h3 className="text-2xl font-bold">{value}</h3>
          {trend && (
            <p className={cn(
              "text-xs mt-1 font-medium",
              trend.isUp ? "text-emerald-500" : "text-destructive"
            )}>
              {trend.isUp ? "+" : "-"}{trend.value}% from last month
            </p>
          )}
          {description && !trend && (
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
