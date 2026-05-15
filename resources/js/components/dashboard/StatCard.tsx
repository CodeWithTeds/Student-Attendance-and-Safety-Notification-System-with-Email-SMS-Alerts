import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    description?: string;
    trend?: 'up' | 'down' | 'neutral';
    trendValue?: string;
    colorFrom: string;
    colorTo: string;
    iconColor: string;
}

export function StatCard({ title, value, icon: Icon, description, trend, trendValue, colorFrom, colorTo, iconColor }: StatCardProps) {
    return (
        <Card className="relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-black/40 dark:backdrop-blur-xl group">
            {/* Background Gradient Effect */}
            <div className={`absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br ${colorFrom} ${colorTo} opacity-20 blur-2xl transition-opacity duration-500 group-hover:opacity-40`} />
            
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-semibold tracking-wide text-muted-foreground">{title}</CardTitle>
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${colorFrom} ${colorTo} shadow-inner`}>
                    <Icon className={`h-5 w-5 ${iconColor}`} strokeWidth={2.5} />
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-extrabold tracking-tight mt-2">{value}</div>
                {(description || trendValue) && (
                    <p className="mt-3 flex items-center text-xs font-medium text-muted-foreground">
                        {trendValue && (
                            <span
                                className={`mr-2 flex items-center rounded-full px-2 py-0.5 ${
                                    trend === 'up'
                                        ? 'bg-emerald-500/10 text-emerald-500'
                                        : trend === 'down'
                                        ? 'bg-rose-500/10 text-rose-500'
                                        : 'bg-neutral-500/10 text-neutral-500'
                                }`}
                            >
                                {trend === 'up' ? '↑' : trend === 'down' ? '↓' : ''} {trendValue}
                            </span>
                        )}
                        {description}
                    </p>
                )}
            </CardContent>
            {/* Bottom highlight line */}
            <div className={`absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r ${colorFrom} ${colorTo} opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />
        </Card>
    );
}
