import * as d3 from 'd3';
import {useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';

const TaskBarChartCard = ({data}: {data: Record<string, any>[]}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [dimensions, setDimensions] = useState({width: 0, height: 0});
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
    const margin = {top: 10, right: 10, bottom: 20, left: 30};

    const taskCounts = data.reduce((acc, task) => {
      acc[task.status] = (acc[task.status] || 0) + 1;
      return acc;
    }, {});

    const chartData = Object.entries(taskCounts).map(([label, value]) => ({
      label,
      value,
    }));

    const svg = d3
      .select(svgRef.current)
      .html('')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3
      .scaleBand()
      .domain(chartData.map((d) => d.label))
      .range([0, width - margin.left - margin.right])
      .padding(0.2);
    const y = d3
      .scaleLinear()
      .domain([0, d3.max(chartData, (d) => d.value)])
      .nice()
      .range([height - margin.top - margin.bottom, 0]);

    svg
      .append('g')
      .attr('transform', `translate(0,${height - margin.top - margin.bottom})`)
      .call(d3.axisBottom(x));
    svg.append('g').call(d3.axisLeft(y));

    svg
      .selectAll('.bar')
      .data(chartData)
      .enter()
      .append('rect')
      .attr('x', (d) => x(d.label) || 0)
      .attr('y', (d) => y(d.value))
      .attr('width', x.bandwidth())
      .attr('height', (d) => height - margin.top - margin.bottom - y(d.value))
      .attr('fill', '#71717A');
  }, [data, dimensions]);

  return (
    <div className='bg-white shadow-md p-2 rounded-md w-full h-full flex flex-col'>
      <h2 className='text-xl font-semibold text-zinc-900 mb-3'>
        {t('dashboard.bar_chart_title')}
      </h2>
      <svg ref={svgRef} width='100%' height='100%'></svg>
    </div>
  );
};
export default TaskBarChartCard;
