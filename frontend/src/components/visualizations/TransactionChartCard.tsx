import {useEffect, useRef, useState} from 'react';
import * as d3 from 'd3';
import {transformTransactionData} from '../../utils/utils.ts';
import {useTranslation} from 'react-i18next';
import {motion} from 'framer-motion';

export interface TransactionChartData {
  time: string;
  income: number;
  outgoing: number;
  balance: number;
}

// Enhanced color scheme for a more premium look
const colorMap = {
  income: '#10B981', // green
  outgoing: '#EF4444', // red
  balance: '#3B82F6', // blue
};

const TransactionChartCard = ({data}: {data: Record<string, any>[]}) => {
  const chartData = transformTransactionData(data);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const [dimensions, setDimensions] = useState({width: 0, height: 0});
  const [activeLines, setActiveLines] = useState({
    income: true,
    outgoing: true,
    balance: true
  });
  const {t} = useTranslation();

  useEffect(() => {
    if (!svgRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      const {width, height} = entries[0].contentRect;
      setDimensions({width, height});
    });

    resizeObserver.observe(svgRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    if (!svgRef.current || chartData.length === 0 || dimensions.width === 0)
      return;

    const {width, height} = dimensions;
    const margin = {top: 20, right: 30, bottom: 40, left: 50};
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    // Clear previous chart
    const svg = d3.select(svgRef.current).html('');

    // Create chart container with margin convention
    const chart = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Create scales
    const x = d3
      .scaleUtc()
      .domain(d3.extent(chartData, (d) => new Date(d.time)) as [Date, Date])
      .range([0, chartWidth]);

    // Calculate y domain based on active lines
    const getActiveValues = (d: TransactionChartData) => {
      const values = [];
      if (activeLines.income) values.push(d.income);
      if (activeLines.outgoing) values.push(d.outgoing);
      if (activeLines.balance) values.push(d.balance);
      return values;
    };

    const yMax = d3.max(chartData, d => Math.max(...getActiveValues(d))) || 0;
    const yMin = d3.min(chartData, d => Math.min(...getActiveValues(d))) || 0;

    // Add some padding to y domain
    const yDomainPadding = (yMax - yMin) * 0.1;

    const y = d3
      .scaleLinear()
      .domain([yMin - yDomainPadding, yMax + yDomainPadding])
      .nice()
      .range([chartHeight, 0]);

    // Add gradient definitions
    const defs = svg.append('defs');

    // Create gradient for each line
    Object.entries(colorMap).forEach(([key, color]) => {
      // Line gradient
      const gradientId = `line-gradient-${key}`;
      const gradient = defs.append('linearGradient')
        .attr('id', gradientId)
        .attr('gradientUnits', 'userSpaceOnUse')
        .attr('x1', 0)
        .attr('y1', y(yMin))
        .attr('x2', 0)
        .attr('y2', y(yMax));

      gradient.append('stop')
        .attr('offset', '0%')
        .attr('stop-color', color)
        .attr('stop-opacity', 0.8);

      gradient.append('stop')
        .attr('offset', '100%')
        .attr('stop-color', color)
        .attr('stop-opacity', 1);

      // Area gradient
      const areaGradientId = `area-gradient-${key}`;
      const areaGradient = defs.append('linearGradient')
        .attr('id', areaGradientId)
        .attr('gradientUnits', 'userSpaceOnUse')
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', 0)
        .attr('y2', chartHeight);

      areaGradient.append('stop')
        .attr('offset', '0%')
        .attr('stop-color', color)
        .attr('stop-opacity', 0.2);

      areaGradient.append('stop')
        .attr('offset', '100%')
        .attr('stop-color', color)
        .attr('stop-opacity', 0.05);
    });

    // Add grid lines
    chart.append('g')
      .attr('class', 'grid')
      .attr('opacity', 0.1)
      .call(d3.axisLeft(y)
        .tickSize(-chartWidth)
        .tickFormat('')
      );

    // Add x-axis with styled labels
    chart.append('g')
      .attr('transform', `translate(0,${chartHeight})`)
      .call(d3.axisBottom(x)
        .ticks(5)
        .tickFormat(d3.timeFormat('%b %d') as any))
      .selectAll('text')
      .attr('font-size', '12px')
      .attr('fill', '#4B5563');

    // Add y-axis with styled labels
    chart.append('g')
      .call(d3.axisLeft(y).ticks(5))
      .selectAll('text')
      .attr('font-size', '12px')
      .attr('fill', '#4B5563');

    // Add axis labels
    chart.append('text')
      .attr('text-anchor', 'middle')
      .attr('x', chartWidth / 2)
      .attr('y', chartHeight + margin.bottom - 5)
      .attr('fill', '#4B5563')
      .attr('font-size', '14px')
      .text(t('dashboard.time_period'));

    chart.append('text')
      .attr('text-anchor', 'middle')
      .attr('transform', `translate(${-margin.left + 15},${chartHeight/2}) rotate(-90)`)
      .attr('fill', '#4B5563')
      .attr('font-size', '14px')
      .text(t('dashboard.amount'));

    // Create line generators
    const createLine = (key: keyof TransactionChartData) => {
      return d3
        .line<TransactionChartData>()
        .x(d => x(new Date(d.time))!)
        .y(d => y(d[key])!)
        .curve(d3.curveCatmullRom.alpha(0.5)); // Smoother curve
    };

    // Create area generators
    const createArea = (key: keyof TransactionChartData) => {
      return d3
        .area<TransactionChartData>()
        .x(d => x(new Date(d.time))!)
        .y0(chartHeight)
        .y1(d => y(d[key])!)
        .curve(d3.curveCatmullRom.alpha(0.5)); // Smoother curve
    };

    // Draw areas and lines with animations
    const drawLine = (key: 'income' | 'outgoing' | 'balance') => {
      if (!activeLines[key]) return;

      const lineGenerator = createLine(key);
      const areaGenerator = createArea(key);

      // Draw area
      chart.append('path')
        .datum(chartData)
        .attr('fill', `url(#area-gradient-${key})`)
        .attr('d', areaGenerator)
        .attr('opacity', 0)
        .transition()
        .duration(1000)
        .attr('opacity', 0.7);

      // Draw line with animation
      const path = chart.append('path')
        .datum(chartData)
        .attr('fill', 'none')
        .attr('stroke', `url(#line-gradient-${key})`)
        .attr('stroke-width', 3)
        .attr('stroke-linejoin', 'round')
        .attr('stroke-linecap', 'round')
        .attr('opacity', 0.9);

      // Animate line drawing
      const pathLength = path.node()?.getTotalLength() || 0;
      path
        .attr('stroke-dasharray', pathLength)
        .attr('stroke-dashoffset', pathLength)
        .attr('d', lineGenerator)
        .transition()
        .duration(1500)
        .ease(d3.easePolyOut)
        .attr('stroke-dashoffset', 0);

      // Add dots at data points
      chart.selectAll(`.dot-${key}`)
        .data(chartData)
        .enter()
        .append('circle')
        .attr('class', `dot-${key}`)
        .attr('cx', d => x(new Date(d.time))!)
        .attr('cy', d => y(d[key])!)
        .attr('r', 0)
        .attr('fill', colorMap[key])
        .attr('stroke', '#fff')
        .attr('stroke-width', 1)
        .transition()
        .delay((_, i) => 1500 + i * 50)
        .duration(300)
        .attr('r', 4);
    };

    // Draw all active lines
    drawLine('income');
    drawLine('outgoing');
    drawLine('balance');

    // Create interactive tooltip
    const focus = chart.append('g')
      .attr('class', 'focus')
      .style('display', 'none');

    // Add vertical line for tooltip
    focus.append('line')
      .attr('class', 'tooltip-line')
      .attr('y1', 0)
      .attr('y2', chartHeight)
      .attr('stroke', '#9CA3AF')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '3,3');

    // Add tooltip dots for each line
    Object.entries(colorMap).forEach(([key, color]) => {
      if (!activeLines[key as keyof typeof activeLines]) return;

      focus.append('circle')
        .attr('class', `focus-circle-${key}`)
        .attr('r', 5)
        .attr('fill', color)
        .attr('stroke', '#fff')
        .attr('stroke-width', 2);
    });

    // Create overlay for mouse tracking
    chart.append('rect')
      .attr('class', 'overlay')
      .attr('width', chartWidth)
      .attr('height', chartHeight)
      .attr('fill', 'none')
      .attr('pointer-events', 'all')
      .on('mouseover', () => focus.style('display', null))
      .on('mouseout', () => {
        focus.style('display', 'none');
        if (tooltipRef.current) {
          d3.select(tooltipRef.current)
            .transition()
            .duration(300)
            .style('opacity', 0)
            .style('visibility', 'hidden');
        }
      })
      .on('mousemove', function(event) {
        const [mouseX] = d3.pointer(event);
        const xDate = x.invert(mouseX);

        // Find closest data point
        const bisect = d3.bisector((d: TransactionChartData) => new Date(d.time)).left;
        const index = bisect(chartData, xDate);
        const d0 = chartData[index - 1];
        const d1 = chartData[index];

        if (!d0 || !d1) return;

        const d = xDate.getTime() - new Date(d0.time).getTime() > new Date(d1.time).getTime() - xDate.getTime() ? d1 : d0;

        // Update vertical line position
        const xPos = x(new Date(d.time));
        focus.select('.tooltip-line')
          .attr('x1', xPos)
          .attr('x2', xPos);

        // Update tooltip dots positions
        Object.entries(colorMap).forEach(([key]) => {
          if (!activeLines[key as keyof typeof activeLines]) return;

          focus.select(`.focus-circle-${key}`)
            .attr('cx', xPos)
            .attr('cy', y(d[key as keyof TransactionChartData]));
        });

        // Update tooltip content
        if (tooltipRef.current) {
          const tooltip = d3.select(tooltipRef.current);
          const date = new Date(d.time);
          const formattedDate = date.toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          });

          let html = `<div class="font-medium text-gray-800 mb-1">${formattedDate}</div>`;

          if (activeLines.income) {
            html += `<div class="flex items-center gap-2 mb-1">
              <div class="w-3 h-3 rounded-full" style="background-color: ${colorMap.income}"></div>
              <span class="text-sm">${t('dashboard.income')}: <span class="font-medium">${d.income}</span></span>
            </div>`;
          }

          if (activeLines.outgoing) {
            html += `<div class="flex items-center gap-2 mb-1">
              <div class="w-3 h-3 rounded-full" style="background-color: ${colorMap.outgoing}"></div>
              <span class="text-sm">${t('dashboard.outgoing')}: <span class="font-medium">${d.outgoing}</span></span>
            </div>`;
          }

          if (activeLines.balance) {
            html += `<div class="flex items-center gap-2">
              <div class="w-3 h-3 rounded-full" style="background-color: ${colorMap.balance}"></div>
              <span class="text-sm">${t('dashboard.balance')}: <span class="font-medium">${d.balance}</span></span>
            </div>`;
          }

          tooltip.html(html);

          // Position tooltip
          const tooltipWidth = 180;
          const tooltipX = xPos > chartWidth / 2
            ? xPos - tooltipWidth - 10
            : xPos + 10;

          tooltip
            .style('left', `${tooltipX + margin.left}px`)
            .style('top', `${margin.top}px`)
            .transition()
            .duration(300)
            .style('opacity', 1)
            .style('visibility', 'visible');
        }
      });

    // Add zoom functionality
    const zoom = d3
      .zoom()
      .scaleExtent([1, 5])
      .translateExtent([
        [0, 0],
        [chartWidth, chartHeight],
      ])
      .extent([[0, 0], [chartWidth, chartHeight]])
      .on('zoom', (event) => {
        // Update x-axis
        const newX = event.transform.rescaleX(x);
        chart.select('.x-axis').call(d3.axisBottom(newX));

        // Update lines and areas
        Object.keys(activeLines).forEach(key => {
          const typedKey = key as keyof typeof activeLines;
          if (!activeLines[typedKey]) return;

          // Update line
          const newLine = d3
            .line<TransactionChartData>()
            .x(d => newX(new Date(d.time))!)
            .y(d => y(d[typedKey])!)
            .curve(d3.curveCatmullRom.alpha(0.5));

          chart.selectAll(`path.line-${key}`)
            .attr('d', newLine(chartData));

          // Update area
          const newArea = d3
            .area<TransactionChartData>()
            .x(d => newX(new Date(d.time))!)
            .y0(chartHeight)
            .y1(d => y(d[typedKey])!)
            .curve(d3.curveCatmullRom.alpha(0.5));

          chart.selectAll(`path.area-${key}`)
            .attr('d', newArea(chartData));

          // Update dots
          chart.selectAll(`.dot-${key}`)
            .attr('cx', d => newX(new Date(d.time))!);
        });
      });

    svg.call(zoom as any);
  }, [chartData, dimensions, activeLines, t]);

  // Toggle line visibility
  const toggleLine = (line: keyof typeof activeLines) => {
    setActiveLines(prev => ({
      ...prev,
      [line]: !prev[line]
    }));
  };

  return (
    <div className='bg-white p-4 rounded-lg shadow-sm w-full h-full flex flex-col'>
      <motion.div
        className="flex justify-between items-center mb-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h2 className='text-lg font-semibold text-gray-800 mb-1'>
            {t('dashboard.line_chart_title')}
          </h2>
          <p className='text-sm text-gray-500'>
            {t('dashboard.financial_overview')}
          </p>
        </div>

        <div className="flex gap-2">
          {Object.entries(colorMap).map(([key, color]) => (
            <button
              key={key}
              className={`flex items-center gap-1 px-2 py-1 text-xs rounded-md transition-all duration-200 ${
                activeLines[key as keyof typeof activeLines]
                  ? 'bg-gray-100 shadow-sm'
                  : 'bg-white text-gray-400'
              }`}
              onClick={() => toggleLine(key as keyof typeof activeLines)}
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: activeLines[key as keyof typeof activeLines] ? color : '#D1D5DB' }}
              ></div>
              <span>{t(`dashboard.${key}`)}</span>
            </button>
          ))}
        </div>
      </motion.div>

      <div className='relative flex-grow'>
        <svg ref={svgRef} width='100%' height='100%'></svg>
        <div
          ref={tooltipRef}
          className='absolute bg-white p-3 rounded-md shadow-lg text-sm pointer-events-none transition-all duration-300 border border-gray-100'
          style={{ opacity: 0, visibility: 'hidden', width: '180px' }}
        ></div>
      </div>
    </div>
  );
};

export default TransactionChartCard;
