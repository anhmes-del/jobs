import React from 'react';
import ReactECharts from 'echarts-for-react';

export default function DashboardCharts({ stats, isDark }) {
  if (!stats) return null;

  const textColor = isDark ? '#f4f4f5' : '#09090b';
  const labelColor = isDark ? '#a1a1aa' : '#71717a';
  const splitLineColor = isDark ? '#27272a' : '#e4e4e7';

  // Standard Tailwind-inspired 500-level color array
  const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#06b6d4"];

  // 1. Platform distribution options (Donut chart)
  const platformOption = {
    color: colors,
    tooltip: {
      trigger: 'item',
      backgroundColor: isDark ? '#18181b' : '#ffffff',
      borderColor: isDark ? '#3f3f46' : '#e4e4e7',
      textStyle: { color: textColor }
    },
    legend: {
      bottom: '5%',
      left: 'center',
      textStyle: { color: labelColor }
    },
    series: [
      {
        name: 'Platform',
        type: 'pie',
        radius: ['45%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 8,
          borderColor: isDark ? '#0c0c0f' : '#ffffff',
          borderWidth: 2
        },
        label: {
          show: false
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 16,
            fontWeight: 'bold',
            color: textColor
          }
        },
        data: stats.platforms || []
      }
    ]
  };

  // 2. Project Type distribution options (Pie chart)
  const projectTypeOption = {
    color: [colors[4], colors[1], colors[2]],
    tooltip: {
      trigger: 'item',
      backgroundColor: isDark ? '#18181b' : '#ffffff',
      borderColor: isDark ? '#3f3f46' : '#e4e4e7',
      textStyle: { color: textColor }
    },
    legend: {
      bottom: '5%',
      left: 'center',
      textStyle: { color: labelColor }
    },
    series: [
      {
        name: 'Project Type',
        type: 'pie',
        radius: '60%',
        data: stats.project_types || [],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },
        label: {
          show: true,
          color: labelColor,
          formatter: '{b}: {c}'
        }
      }
    ]
  };

  // 3. Location breakdown (Horizontal Bar chart)
  const locationNames = (stats.locations || []).map(l => l.name);
  const locationValues = (stats.locations || []).map(l => l.value);

  const locationOption = {
    color: [colors[0]],
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      backgroundColor: isDark ? '#18181b' : '#ffffff',
      borderColor: isDark ? '#3f3f46' : '#e4e4e7',
      textStyle: { color: textColor }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '5%',
      containLabel: true
    },
    xAxis: {
      type: 'value',
      axisLabel: { color: labelColor },
      splitLine: { lineStyle: { color: splitLineColor } }
    },
    yAxis: {
      type: 'category',
      data: locationNames,
      axisLabel: { color: labelColor },
      axisLine: { show: false },
      axisTick: { show: false }
    },
    series: [
      {
        name: 'Jobs Available',
        type: 'bar',
        data: locationValues,
        itemStyle: {
          borderRadius: [0, 4, 4, 0]
        },
        barWidth: '60%'
      }
    ]
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      {/* Platform Chart Card */}
      <div className="bg-white dark:bg-[#0c0c0f] rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm p-5 flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-4">
            Platform Distribution
          </h3>
        </div>
        <div className="h-[250px] w-full">
          <ReactECharts option={platformOption} style={{ height: '100%', width: '100%' }} />
        </div>
      </div>

      {/* Project Type Chart Card */}
      <div className="bg-white dark:bg-[#0c0c0f] rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm p-5 flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-4">
            Project Environment
          </h3>
        </div>
        <div className="h-[250px] w-full">
          <ReactECharts option={projectTypeOption} style={{ height: '100%', width: '100%' }} />
        </div>
      </div>

      {/* Locations Chart Card */}
      <div className="bg-white dark:bg-[#0c0c0f] rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm p-5 flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-4">
            Postings by Location
          </h3>
        </div>
        <div className="h-[250px] w-full">
          <ReactECharts option={locationOption} style={{ height: '100%', width: '100%' }} />
        </div>
      </div>
    </div>
  );
}
