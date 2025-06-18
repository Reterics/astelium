import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { useTranslation } from 'react-i18next';
import { useApi } from '../../hooks/useApi.ts';

interface GoalLineChartProps {
  goal: Record<string, any>;
  timeScale?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  startDate?: string;
  endDate?: string;
}

interface CategoryData {
  id: number;
  name: string;
  color: string;
  icon: string;
}

interface DataPoint {
  date: Date;
  amount: number;
  categoryId: number;
}

const GoalLineChart: React.FC<GoalLineChartProps> = ({
  goal,
  timeScale = 'monthly',
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const { t } = useTranslation();
  const { data: transactions, isLoading: transactionsLoading } = useApi('transactions');

  const timeScaleOption = timeScale
  const dateRange = {
    start: goal.start_date ? new Date(goal.start_date) : null,
    end: goal.due_date ? new Date(goal.due_date) : null
  }

  // Process transaction data
  const processData = (): { categories: CategoryData[], dataPoints: DataPoint[] } => {
    if (!goal || !transactions || transactionsLoading) {
      return { categories: [], dataPoints: [] };
    }

    // Extract categories from the goal
    const categories: CategoryData[] = goal.transaction_categories.map((cat: any) => ({
      id: cat.id,
      name: cat.name,
      color: cat.color || '#6B7280', // Default gray if no color
      icon: cat.icon || ''
    }));

    const categoryIds = categories.map(cat => cat.id);

    // Filter transactions by date range and categories
    const filteredTransactions = transactions.filter((transaction: any) => {
      // Check if transaction has any of the goal's categories
      if (!transaction.categories || transaction.categories.length === 0) return false;

      const hasRelevantCategory = transaction.categories.some((cat: any) =>
        categoryIds.includes(cat.id)
      );

      if (!hasRelevantCategory) return false;

      // Check date range
      const transactionDate = new Date(transaction.date);
      if (dateRange.start && transactionDate < dateRange.start) return false;
      if (dateRange.end && transactionDate > dateRange.end) return false;

      return true;
    });

    // Create data points for each transaction and category
    const dataPoints: DataPoint[] = [];

    filteredTransactions.forEach((transaction: any) => {
      const transactionDate = new Date(transaction.date);
      const amount = parseFloat(transaction.amount);

      // Only include income transactions
      if (transaction.type !== 'income') return;

      // For each category in the transaction that's also in the goal
      transaction.categories.forEach((category: any) => {
        if (categoryIds.includes(category.id)) {
          dataPoints.push({
            date: transactionDate,
            amount: amount / transaction.categories.length, // Divide amount equally among categories
            categoryId: category.id
          });
        }
      });
    });

    return { categories, dataPoints };
  };

  // Group data by time scale and category
  const aggregateData = (data: DataPoint[], timeScale: 'daily' | 'weekly' | 'monthly' | 'yearly') => {
    const result: { [key: string]: { [categoryId: number]: number } } = {};

    data.forEach(point => {
      let timeKey: string;
      const date = point.date;

      switch (timeScale) {
        case 'daily':
          timeKey = date.toISOString().split('T')[0]; // YYYY-MM-DD
          break;
        case 'weekly':
          {
            const day = date.getDay();
            const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Sunday
            const monday = new Date(date);
            monday.setDate(diff);
            timeKey = monday.toISOString().split('T')[0];
            break;
          }
        case 'monthly':
          timeKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          break;
        case 'yearly':
          timeKey = `${date.getFullYear()}`;
          break;
        default:
          timeKey = date.toISOString().split('T')[0];
      }

      if (!result[timeKey]) {
        result[timeKey] = {};
      }

      if (!result[timeKey][point.categoryId]) {
        result[timeKey][point.categoryId] = 0;
      }

      result[timeKey][point.categoryId] += point.amount;
    });

    return result;
  };

  // Format the aggregated data for D3
  const formatDataForChart = (
    aggregatedData: { [key: string]: { [categoryId: number]: number } },
    categories: CategoryData[]
  ) => {
    // Sort time keys
    const timeKeys = Object.keys(aggregatedData).sort();

    // Create a series for each category
    const series = categories.map(category => {
      return {
        id: category.id,
        name: category.name,
        color: category.color,
        icon: category.icon,
        values: timeKeys.map(timeKey => {
          return {
            date: parseTimeKey(timeKey, timeScaleOption),
            value: aggregatedData[timeKey][category.id] || 0
          };
        })
      };
    });

    return { timeKeys, series };
  };

  // Parse time key back to Date object
  const parseTimeKey = (timeKey: string, timeScale: 'daily' | 'weekly' | 'monthly' | 'yearly'): Date => {
    switch (timeScale) {
      case 'daily':
      case 'weekly':
        return new Date(timeKey);
      case 'monthly':
        { const [year, month] = timeKey.split('-').map(Number);
        return new Date(year, month - 1, 1); }
      case 'yearly':
        return new Date(parseInt(timeKey), 0, 1);
      default:
        return new Date(timeKey);
    }
  };

  // Format date for display based on time scale
  const formatDate = (date: Date, timeScale: 'daily' | 'weekly' | 'monthly' | 'yearly'): string => {
    switch (timeScale) {
      case 'daily':
        return date.toLocaleDateString();
      case 'weekly':
        { const endOfWeek = new Date(date);
        endOfWeek.setDate(date.getDate() + 6);
        return `${date.toLocaleDateString()} - ${endOfWeek.toLocaleDateString()}`; }
      case 'monthly':
        return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long' });
      case 'yearly':
        return date.getFullYear().toString();
      default:
        return date.toLocaleDateString();
    }
  };

  // Handle resize
  useEffect(() => {
    if (!svgRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      setDimensions({ width, height });
    });

    setDimensions({ width: svgRef.current.clientWidth, height: svgRef.current.clientHeight });
    resizeObserver.observe(svgRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  // Draw chart
  useEffect(() => {
    if (!svgRef.current || dimensions.width === 0 || !goal) return;

    const { categories, dataPoints } = processData();
    if (categories.length === 0 || dataPoints.length === 0) return;

    const aggregatedData = aggregateData(dataPoints, timeScaleOption);
    const { timeKeys, series } = formatDataForChart(aggregatedData, categories);

    if (timeKeys.length === 0) return;

    const { width, height } = dimensions;
    const margin = { top: 20, right: 80, bottom: 50, left: 60 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    // Clear previous chart
    const svg = d3.select(svgRef.current).html('');

    // Create chart container
    const chart = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Create scales
    const x = d3.scaleTime()
      .domain([
        d3.min(series, s => d3.min(s.values, d => d.date)) || new Date(),
        d3.max(series, s => d3.max(s.values, d => d.date)) || new Date()
      ])
      .range([0, chartWidth]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(series, s => d3.max(s.values, d => d.value)) || 0])
      .nice()
      .range([chartHeight, 0]);

    // Create line generator
    const line = d3.line<{date: Date, value: number}>()
      .x(d => x(d.date))
      .y(d => y(d.value))
      .curve(d3.curveMonotoneX);

    // Add X axis
    chart.append('g')
      .attr('transform', `translate(0,${chartHeight})`)
      .call(d3.axisBottom(x).ticks(5))
      .selectAll('text')
      .style('text-anchor', 'end')
      .attr('dx', '-.8em')
      .attr('dy', '.15em')
      .attr('transform', 'rotate(-45)');

    // Add Y axis
    chart.append('g')
      .call(d3.axisLeft(y));

    // Add X axis label
    chart.append('text')
      .attr('transform', `translate(${chartWidth / 2},${chartHeight + margin.bottom - 5})`)
      .style('text-anchor', 'middle')
      .style('font-size', '12px')
      .style('fill', '#4B5563')
      .text(t('dashboard.time_period'));

    // Add Y axis label
    chart.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -margin.left + 15)
      .attr('x', -chartHeight / 2)
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .style('font-size', '12px')
      .style('fill', '#4B5563')
      .text(t('dashboard.amount'));

    // Add grid lines
    chart.append('g')
      .attr('class', 'grid')
      .call(
        d3.axisLeft(y)
          .tickSize(-chartWidth)
          .tickFormat(() => '')
      )
      .style('stroke', '#E5E7EB')
      .style('stroke-opacity', 0.7)
      .selectAll('.domain')
      .style('stroke-opacity', 0);

    // Add lines
    series.forEach(s => {
      chart.append('path')
        .datum(s.values)
        .attr('fill', 'none')
        .attr('stroke', s.color)
        .attr('stroke-width', 2)
        .attr('d', line)
        .style('opacity', 0.8);

      // Add dots for each data point
      chart.selectAll(`.dot-${s.id}`)
        .data(s.values)
        .enter()
        .append('circle')
        .attr('class', `dot-${s.id}`)
        .attr('cx', d => x(d.date))
        .attr('cy', d => y(d.value))
        .attr('r', 4)
        .attr('fill', s.color)
        .attr('stroke', 'white')
        .attr('stroke-width', 1)
        .style('opacity', 0.8)
        .on('mouseover', function(event, d) {
          d3.select(this)
            .attr('r', 6)
            .style('opacity', 1);

          // Show tooltip
          if (tooltipRef.current) {
            const tooltip = d3.select(tooltipRef.current);
            tooltip
              .style('opacity', 1)
              .style('left', `${event.pageX}px`)
              .style('top', `${event.pageY - 40}px`)
              .html(`
                <div class="flex items-center gap-2">
                  ${s.icon ? `<span class="material-icons text-sm" style="color: ${s.color}">${s.icon}</span>` : ''}
                  <span class="font-medium">${s.name}</span>
                </div>
                <div class="text-sm">
                  <span>${formatDate(d.date, timeScaleOption)}</span>
                </div>
                <div class="text-sm">
                  <span>${t('dashboard.amount')}: $${d.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              `);
          }
        })
        .on('mouseout', function() {
          d3.select(this).attr('r', 4).style('opacity', 0.8);

          // Hide tooltip
          if (tooltipRef.current) {
            d3.select(tooltipRef.current).style('opacity', 0);
          }
        });
    });

    // Add legend
    const legend = chart.append('g')
      .attr('transform', `translate(${chartWidth + 10}, 0)`)
      .selectAll('g')
      .data(series)
      .enter()
      .append('g')
      .attr('transform', (_d, i) => `translate(0, ${i * 25})`);

    legend.append('rect')
      .attr('width', 15)
      .attr('height', 15)
      .attr('fill', d => d.color)
      .style('opacity', 0.8);

    legend.append('text')
      .attr('x', 20)
      .attr('y', 12)
      .style('font-size', '12px')
      .style('fill', '#4B5563')
      .text(d => d.name);

  }, [goal, dimensions, timeScaleOption, dateRange, transactions, t, processData, formatDataForChart]);

  if (!goal) {
    return <div className="p-4">Loading goal data...</div>;
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">
          {goal.title} - {t('dashboard.progress_over_time')}
        </h2>
        <p className="text-sm text-gray-500">
          {t('dashboard.goal_progress_description')}
        </p>
      </div>

      <div className="flex-grow relative h-[400px]">
        <svg
          ref={svgRef}
          width="100%"
          height="100%"
          className="overflow-visible"
        ></svg>
        <div
          ref={tooltipRef}
          className="absolute pointer-events-none bg-white p-2 rounded shadow-lg border border-gray-200 text-sm z-10 transition-opacity duration-300"
          style={{ opacity: 0 }}
        ></div>
      </div>

      <div className="p-4 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            {dateRange.start && dateRange.end && (
              <span>
                {new Date(dateRange.start).toLocaleDateString()} - {new Date(dateRange.end).toLocaleDateString()}
              </span>
            )}
          </div>
          <div className="text-sm text-gray-500">
            {t('dashboard.target')}: ${goal.target_amount.toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoalLineChart;
