import {useEffect, useRef, useState} from 'react';
import * as d3 from 'd3';

const HomeLineChart = () => {
  const chartRef = useRef(null);
  const [dimensions, setDimensions] = useState({width: 0, height: 0});

  useEffect(() => {
    if (!chartRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      const {width, height} = entries[0].contentRect;
      setDimensions({width, height: Math.floor(height * 0.75)});
    });

    resizeObserver.observe(chartRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    const {width, height} = dimensions;

    const svg = d3
      .select(chartRef.current)
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    const data = Array.from({length: 30}, (_, i) => ({
      x: i,
      y: Math.pow(i + 1, 1.5) * 2 + Math.random() * 20,
    }));

    const xScale = d3
      .scaleLinear()
      .domain([0, 30])
      .range([50, width - 50]);
    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.y)! * 1.2])
      .range([height - 50, 50]);

    // Add visible grid (horizontal and vertical lines)
    const gridLines = svg.append('g').attr('class', 'grid');

    // Horizontal grid lines
    gridLines
      .selectAll('line.horizontal')
      .data(yScale.ticks(10))
      .enter()
      .append('line')
      .attr('x1', 50)
      .attr('x2', width - 50)
      .attr('y1', (d) => yScale(d))
      .attr('y2', (d) => yScale(d))
      .attr('stroke', '#aaa')
      .attr('stroke-width', 1)
      .attr('opacity', 0.6);

    // Vertical grid lines
    gridLines
      .selectAll('line.vertical')
      .data(xScale.ticks(10))
      .enter()
      .append('line')
      .attr('x1', (d) => xScale(d))
      .attr('x2', (d) => xScale(d))
      .attr('y1', 50)
      .attr('y2', height - 50)
      .attr('stroke', '#aaa')
      .attr('stroke-width', 1)
      .attr('opacity', 0.6);

    const line = d3
      .line()
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      .x((d) => xScale(d.x))
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      .y((d) => yScale(d.y))
      .curve(d3.curveLinear);

    const gradient = svg
      .append('defs')
      .append('linearGradient')
      .attr('id', 'lineGradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');

    gradient
      .append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#4f46e5')
      .attr('stop-opacity', 0.9);

    gradient
      .append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#4f46e5')
      .attr('stop-opacity', 0.1);

    const path = svg
      .append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', 'url(#lineGradient)')
      .attr('stroke-width', 5)
      .attr('d', line as unknown as [number, number])
      .style('filter', 'drop-shadow(0px 4px 10px rgba(79, 70, 229, 0.6))');

    // Slower animated draw effect
    path
      .attr('stroke-dasharray', path.node()!.getTotalLength())
      .attr('stroke-dashoffset', path.node()!.getTotalLength())
      .transition()
      .duration(5000) // Slower animation duration
      .ease(d3.easeCubicInOut)
      .attr('stroke-dashoffset', 0);

    return () => {
      svg.remove();
    };
  }, [dimensions]);

  return <div ref={chartRef} className='w-full h-full flex' />;
};

export default HomeLineChart;
