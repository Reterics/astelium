import * as d3 from 'd3';
import {useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {motion} from 'framer-motion';

// Status color mapping for a more visually appealing chart
const statusColors = {
  'open': '#3B82F6', // blue
  'in-progress': '#F59E0B', // amber
  'completed': '#10B981', // green
  'cancelled': '#EF4444', // red
  'on-hold': '#8B5CF6', // purple
  'default': '#6B7280', // gray
};

const TaskBarChartCard = ({data}: {data: Record<string, any>[]}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const [dimensions, setDimensions] = useState({width: 0, height: 0});
  const [hoveredBar, setHoveredBar] = useState<string | null>(null);
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
    if (!svgRef.current || data.length === 0 || dimensions.width === 0) return;

    const {width, height} = dimensions;
    const margin = {top: 20, right: 30, bottom: 40, left: 50};
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    // Process data
    const taskCounts = data.reduce((acc, task) => {
      const status = task.status || 'default';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    const chartData = Object.entries(taskCounts)
      .map(([label, value]) => ({
        label,
        value,
        color: statusColors[label as keyof typeof statusColors] || statusColors.default
      }))
      .sort((a, b) => b.value - a.value); // Sort by value descending

    // Clear previous chart
    const svg = d3.select(svgRef.current).html('');

    // Create chart container with margin convention
    const chart = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Create scales
    const x = d3
      .scaleBand()
      .domain(chartData.map(d => d.label))
      .range([0, chartWidth])
      .padding(0.3);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(chartData, d => d.value) * 1.1]) // Add 10% padding at top
      .nice()
      .range([chartHeight, 0]);

    // Add gradient definitions
    const defs = svg.append('defs');

    chartData.forEach(d => {
      const gradientId = `gradient-${d.label}`;
      const gradient = defs.append('linearGradient')
        .attr('id', gradientId)
        .attr('x1', '0%')
        .attr('y1', '0%')
        .attr('x2', '0%')
        .attr('y2', '100%');

      gradient.append('stop')
        .attr('offset', '0%')
        .attr('stop-color', d.color)
        .attr('stop-opacity', 0.8);

      gradient.append('stop')
        .attr('offset', '100%')
        .attr('stop-color', d.color)
        .attr('stop-opacity', 0.5);
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
      .call(d3.axisBottom(x))
      .selectAll('text')
      .attr('transform', 'translate(-10,0)rotate(-45)')
      .attr('text-anchor', 'end')
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
      .text(t('dashboard.task_status'));

    chart.append('text')
      .attr('text-anchor', 'middle')
      .attr('transform', `translate(${-margin.left + 15},${chartHeight/2}) rotate(-90)`)
      .attr('fill', '#4B5563')
      .attr('font-size', '14px')
      .text(t('dashboard.task_count'));

    // Create a group for each bar
    const bars = chart.selectAll('.bar')
      .data(chartData)
      .enter()
      .append('g')
      .attr('class', 'bar')
      .style('cursor', 'pointer');

    // Add the bars with animations
    bars.append('rect')
      .attr('x', d => x(d.label) || 0)
      .attr('width', x.bandwidth())
      .attr('y', chartHeight)
      .attr('height', 0)
      .attr('rx', 4) // Rounded corners
      .attr('fill', d => `url(#gradient-${d.label})`)
      .attr('stroke', d => d.color)
      .attr('stroke-width', 1)
      .attr('opacity', d => hoveredBar === d.label ? 1 : 0.9)
      .transition()
      .duration(800)
      .delay((_, i) => i * 100)
      .attr('y', d => y(d.value))
      .attr('height', d => chartHeight - y(d.value));

    // Add value labels on top of bars
    bars.append('text')
      .attr('x', d => (x(d.label) || 0) + x.bandwidth() / 2)
      .attr('y', d => y(d.value) - 5)
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .attr('font-weight', 'bold')
      .attr('fill', d => d.color)
      .attr('opacity', 0)
      .text(d => d.value)
      .transition()
      .duration(800)
      .delay((_, i) => i * 100 + 400)
      .attr('opacity', 1);

    // Add hover effects
    bars
      .on('mouseenter', function(event, d) {
        setHoveredBar(d.label);

        d3.select(this).select('rect')
          .transition()
          .duration(300)
          .attr('opacity', 1)
          .attr('y', y => y - 5)
          .attr('height', h => h + 5);

        // Show tooltip
        if (tooltipRef.current) {
          const tooltip = d3.select(tooltipRef.current);
          tooltip.html(`
            <div class="font-medium">${d.label}</div>
            <div class="text-lg">${d.value} ${t('dashboard.tasks')}</div>
          `);

          const [x, y] = d3.pointer(event, svg.node());
          tooltip
            .style('left', `${x}px`)
            .style('top', `${y - 40}px`)
            .transition()
            .duration(300)
            .style('opacity', 1)
            .style('visibility', 'visible');
        }
      })
      .on('mouseleave', function() {
        setHoveredBar(null);

        d3.select(this).select('rect')
          .transition()
          .duration(300)
          .attr('opacity', 0.9)
          .attr('y', d => y(d.value))
          .attr('height', d => chartHeight - y(d.value));

        // Hide tooltip
        if (tooltipRef.current) {
          d3.select(tooltipRef.current)
            .transition()
            .duration(300)
            .style('opacity', 0)
            .style('visibility', 'hidden');
        }
      });

  }, [data, dimensions, hoveredBar, t]);

  return (
    <div className='bg-white p-4 rounded-lg shadow-sm w-full h-full flex flex-col'>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className='text-lg font-semibold text-gray-800 mb-1'>
          {t('dashboard.bar_chart_title')}
        </h2>
        <p className='text-sm text-gray-500 mb-4'>
          {t('dashboard.tasks_by_status')}
        </p>
      </motion.div>

      <div className='relative flex-grow'>
        <svg ref={svgRef} width='100%' height='100%'></svg>
        <div
          ref={tooltipRef}
          className='absolute bg-white p-2 rounded-md shadow-lg text-sm pointer-events-none transition-all duration-300'
          style={{ opacity: 0, visibility: 'hidden' }}
        ></div>
      </div>
    </div>
  );
};
export default TaskBarChartCard;
