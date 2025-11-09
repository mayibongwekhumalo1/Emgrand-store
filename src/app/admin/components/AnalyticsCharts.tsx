"use client";

import { useEffect, useRef } from 'react';

interface AnalyticsData {
  revenue: number[];
  orders: number[];
  users: number[];
  labels: string[];
}

interface AnalyticsChartsProps {
  data: AnalyticsData;
}

export default function AnalyticsCharts({ data }: AnalyticsChartsProps) {
  const revenueChartRef = useRef<HTMLCanvasElement>(null);
  const ordersChartRef = useRef<HTMLCanvasElement>(null);
  const usersChartRef = useRef<HTMLCanvasElement>(null);

  const drawChart = (
    canvas: HTMLCanvasElement | null,
    values: number[],
    labels: string[],
    title: string,
    color: string
  ) => {
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const padding = 60;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Find max value for scaling
    const maxValue = Math.max(...values, 1);

    // Draw grid lines
    ctx.strokeStyle = '#E5E7EB';
    ctx.lineWidth = 1;

    for (let i = 0; i <= 5; i++) {
      const y = padding + (chartHeight * i) / 5;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();

      // Y-axis labels
      ctx.fillStyle = '#6B7280';
      ctx.font = '12px Arial';
      ctx.textAlign = 'right';
      ctx.fillText(Math.round((maxValue * (5 - i)) / 5).toString(), padding - 10, y + 4);
    }

    // Draw bars
    const barWidth = chartWidth / values.length * 0.8;
    const barSpacing = chartWidth / values.length * 0.2;

    values.forEach((value, index) => {
      const barHeight = (value / maxValue) * chartHeight;
      const x = padding + index * (barWidth + barSpacing) + barSpacing / 2;
      const y = height - padding - barHeight;

      // Bar
      ctx.fillStyle = color;
      ctx.fillRect(x, y, barWidth, barHeight);

      // Bar border
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.strokeRect(x, y, barWidth, barHeight);

      // Value label on top of bar
      ctx.fillStyle = '#374151';
      ctx.font = '10px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(value.toString(), x + barWidth / 2, y - 5);
    });

    // Draw X-axis labels
    ctx.fillStyle = '#6B7280';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';

    labels.forEach((label, index) => {
      const x = padding + index * (barWidth + barSpacing) + barWidth / 2 + barSpacing / 2;
      const y = height - padding + 20;
      ctx.fillText(label, x, y);
    });

    // Title
    ctx.fillStyle = '#111827';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(title, width / 2, 30);
  };

  useEffect(() => {
    // Simple chart drawing using Canvas API
    drawChart(revenueChartRef.current, data.revenue, data.labels, 'Revenue ($)', '#10B981');
    drawChart(ordersChartRef.current, data.orders, data.labels, 'Orders', '#3B82F6');
    drawChart(usersChartRef.current, data.users, data.labels, 'New Users', '#8B5CF6');
  }, [data]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <canvas
          ref={revenueChartRef}
          width={400}
          height={300}
          className="w-full h-auto"
        />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <canvas
          ref={ordersChartRef}
          width={400}
          height={300}
          className="w-full h-auto"
        />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <canvas
          ref={usersChartRef}
          width={400}
          height={300}
          className="w-full h-auto"
        />
      </div>
    </div>
  );
}