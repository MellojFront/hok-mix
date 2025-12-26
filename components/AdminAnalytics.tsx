'use client';

import { useState } from 'react';
import { Bar, BarChart, Line, LineChart, Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent, type ChartConfig } from '@/components/ui/chart';
import { Users, Eye, TrendingUp, Activity } from 'lucide-react';

// Моковые данные для аналитики (в будущем можно заменить на реальные данные из Supabase)
const generateMockData = () => {
  const days = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    days.push({
      date: date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' }),
      visitors: Math.floor(Math.random() * 100) + 50,
      pageViews: Math.floor(Math.random() * 200) + 100,
      mixes: Math.floor(Math.random() * 20) + 5,
    });
  }
  return days;
};

const monthlyData = [
  { month: 'Янв', users: 120, mixes: 45, submissions: 12 },
  { month: 'Фев', users: 180, mixes: 62, submissions: 18 },
  { month: 'Мар', users: 240, mixes: 78, submissions: 25 },
  { month: 'Апр', users: 320, mixes: 95, submissions: 32 },
  { month: 'Май', users: 410, mixes: 120, submissions: 45 },
  { month: 'Июн', users: 520, mixes: 150, submissions: 58 },
];

const chartConfig = {
  visitors: {
    label: 'Посетители',
    color: 'hsl(var(--chart-1))',
  },
  pageViews: {
    label: 'Просмотры',
    color: 'hsl(var(--chart-2))',
  },
  mixes: {
    label: 'Миксы',
    color: 'hsl(var(--chart-3))',
  },
  users: {
    label: 'Пользователи',
    color: 'hsl(var(--chart-4))',
  },
  submissions: {
    label: 'Предложения',
    color: 'hsl(var(--chart-5))',
  },
} satisfies ChartConfig;

export default function AdminAnalytics() {
  const [timeRange, setTimeRange] = useState<'week' | 'month'>('week');
  const dailyData = generateMockData();

  const stats = [
    {
      title: 'Всего пользователей',
      value: '520',
      change: '+12%',
      icon: Users,
      color: 'text-blue-400',
    },
    {
      title: 'Просмотров сегодня',
      value: '1,234',
      change: '+8%',
      icon: Eye,
      color: 'text-green-400',
    },
    {
      title: 'Создано миксов',
      value: '150',
      change: '+15%',
      icon: TrendingUp,
      color: 'text-yellow-400',
    },
    {
      title: 'Активность',
      value: '89%',
      change: '+5%',
      icon: Activity,
      color: 'text-purple-400',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Статистические карточки */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-slate-800 border border-slate-700 rounded-xl p-4 sm:p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <div className={`p-2 rounded-lg bg-slate-700 ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <span className="text-xs text-green-400 font-medium">{stat.change}</span>
            </div>
            <h3 className="text-sm text-slate-400 mb-1">{stat.title}</h3>
            <p className="text-2xl font-bold text-slate-100">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Переключатель периода */}
      <div className="flex gap-2">
        <button
          onClick={() => setTimeRange('week')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            timeRange === 'week'
              ? 'bg-red-600 text-white'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
          }`}
        >
          Неделя
        </button>
        <button
          onClick={() => setTimeRange('month')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            timeRange === 'month'
              ? 'bg-red-600 text-white'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
          }`}
        >
          Месяц
        </button>
      </div>

      {/* Графики */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* График посещений (неделя) */}
        {timeRange === 'week' && (
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 sm:p-6">
            <h3 className="text-lg font-bold text-slate-100 mb-4">Посещения за неделю</h3>
            <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
              <AreaChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis
                  dataKey="date"
                  tick={{ fill: '#94a3b8' }}
                  tickLine={{ stroke: '#334155' }}
                  axisLine={{ stroke: '#334155' }}
                />
                <YAxis
                  tick={{ fill: '#94a3b8' }}
                  tickLine={{ stroke: '#334155' }}
                  axisLine={{ stroke: '#334155' }}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="visitors"
                  fill="hsl(var(--chart-1))"
                  fillOpacity={0.2}
                  stroke="hsl(var(--chart-1))"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="pageViews"
                  fill="hsl(var(--chart-2))"
                  fillOpacity={0.2}
                  stroke="hsl(var(--chart-2))"
                  strokeWidth={2}
                />
              </AreaChart>
            </ChartContainer>
          </div>
        )}

        {/* График пользователей и миксов (месяц) */}
        {timeRange === 'month' && (
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 sm:p-6">
            <h3 className="text-lg font-bold text-slate-100 mb-4">Рост пользователей и миксов</h3>
            <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis
                  dataKey="month"
                  tick={{ fill: '#94a3b8' }}
                  tickLine={{ stroke: '#334155' }}
                  axisLine={{ stroke: '#334155' }}
                />
                <YAxis
                  tick={{ fill: '#94a3b8' }}
                  tickLine={{ stroke: '#334155' }}
                  axisLine={{ stroke: '#334155' }}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Line
                  type="monotone"
                  dataKey="users"
                  stroke="hsl(var(--chart-4))"
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--chart-4))', r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="mixes"
                  stroke="hsl(var(--chart-3))"
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--chart-3))', r: 4 }}
                />
              </LineChart>
            </ChartContainer>
          </div>
        )}

        {/* График активности миксов */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 sm:p-6">
          <h3 className="text-lg font-bold text-slate-100 mb-4">
            {timeRange === 'week' ? 'Активность за неделю' : 'Статистика за месяц'}
          </h3>
          <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
            <BarChart data={timeRange === 'week' ? dailyData : monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis
                dataKey={timeRange === 'week' ? 'date' : 'month'}
                tick={{ fill: '#94a3b8' }}
                tickLine={{ stroke: '#334155' }}
                axisLine={{ stroke: '#334155' }}
              />
              <YAxis
                tick={{ fill: '#94a3b8' }}
                tickLine={{ stroke: '#334155' }}
                axisLine={{ stroke: '#334155' }}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar
                dataKey={timeRange === 'week' ? 'mixes' : 'mixes'}
                fill="hsl(var(--chart-3))"
                radius={[4, 4, 0, 0]}
              />
              {timeRange === 'month' && (
                <Bar
                  dataKey="submissions"
                  fill="hsl(var(--chart-5))"
                  radius={[4, 4, 0, 0]}
                />
              )}
            </BarChart>
          </ChartContainer>
        </div>
      </div>
    </div>
  );
}

