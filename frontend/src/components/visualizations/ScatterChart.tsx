import React, {useEffect, useRef} from 'react';
import * as d3 from 'd3';

interface ScatterChartProps {
  data: {[key: string]: any}[];
  width?: number;
  height?: number;
  xAxisLabel?: string;
  xAxisType?: 'time' | 'number' | 'log';
  xAxisValue?: string;
  yAxisLabel?: string;
  yAxisType?: 'time' | 'number' | 'log';
  yAxisValue?: string;
  themeColor?: string;
  borderColor?: string;
  fills?: string[];
  fillKey?: string;
  scaleType?: 'linear' | 'log';
  tickColor?: string;
  onMouseMove?: (event: MouseEvent, data: unknown) => void;
  onMouseOut?: () => void;
  onMouseOver?: (event: MouseEvent, data: unknown) => void;
  onClick?: (data: any) => void;
}

const ScatterChart: React.FC<ScatterChartProps> = ({
  data,
  width = 800,
  height = 500,
  xAxisLabel = 'X Axis',
  xAxisType = 'time',
  xAxisValue = 'timestamp',
  yAxisLabel = 'Y Axis',
  yAxisType = 'number',
  yAxisValue = 'count',
  themeColor = 'black',
  borderColor = 'gray',
  fills = ['steelblue'],
  fillKey = 'color',
  scaleType = 'linear',
  tickColor = 'black',
  onMouseMove,
  onMouseOut,
  onMouseOver,
  onClick,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!data || !svgRef.current) return;

    const margin = {top: 30, right: 10, bottom: 50, left: 60};
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // Compute scale domains
    const xMin = d3.min(data, (d) => d[xAxisValue])!;
    const xMax = d3.max(data, (d) => d[xAxisValue])!;
    const yMin = d3.min(data, (d) => d[yAxisValue])!;
    const yMax = d3.max(data, (d) => d[yAxisValue])!;

    /**
     * Returns the appropriate D3 scale for the given axis type.
     * Supports: time, linear, and log scales.
     */
    const getScale = (axis: 'x' | 'y') => {
      const type = axis === 'x' ? xAxisType : yAxisType;
      const min = axis === 'x' ? xMin : yMin;
      const max = axis === 'x' ? xMax : yMax;
      const range = axis === 'x' ? [0, innerWidth] : [innerHeight, 0];

      if (type === 'time') {
        return d3.scaleTime().domain([min, max]).range(range);
      }
      if (scaleType === 'log') {
        return d3
          .scaleLog()
          .domain([Math.max(1, min), max * 1.1])
          .range(range);
      }
      return d3
        .scaleLinear()
        .domain([min * 0.9, max * 1.1])
        .range(range);
    };

    // Create scales
    const x = getScale('x');
    const y = getScale('y');

    // Create Axes
    const xAxis = d3
      .axisBottom(x)
      .ticks(innerWidth / 100)
      .tickSize(-innerHeight);
    const yAxis = d3
      .axisLeft(y)
      .ticks(innerHeight / 50)
      .tickSize(-innerWidth);

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const xAxisNode = g
      .append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(xAxis);

    xAxisNode
      .append('text')
      .attr('x', innerWidth)
      .attr('y', 40)
      .style('text-anchor', 'end')
      .style('font-weight', 'bold')
      .style('fill', themeColor)
      .text(xAxisLabel);

    const yAxisNode = g.append('g').attr('class', 'y-axis').call(yAxis);

    yAxisNode
      .append('text')
      .attr('x', -10)
      .attr('y', -20)
      .style('text-anchor', 'end')
      .style('font-weight', 'bold')
      .style('fill', themeColor)
      .text(yAxisLabel);

    const dots = g
      .append('g')
      .attr('clip-path', 'url(#clip)')
      .selectAll('.dot')
      .data(data)
      .enter()
      .append('circle')
      .attr('class', 'dot')
      .attr('r', 6)
      .attr('cx', (d) => x(d[xAxisValue]))
      .attr('cy', (d) => y(d[yAxisValue]))
      .style('fill', (d) => fills[d[fillKey]] || fills[0])
      .attr('stroke', (d) =>
        d3
          .rgb(fills[d[fillKey]] || fills[0])
          .darker(2)
          .toString()
      )
      .style('fill-opacity', 0.6)
      .on('mouseover', (event, d) => onMouseOver?.(event, d))
      .on('mouseout', () => onMouseOut?.())
      .on('mousemove', (event, d) => onMouseMove?.(event, d))
      .on('click', (_event, d) => onClick?.(d));

    svg
      .selectAll('.x-axis .tick text, .y-axis .tick text')
      .style('fill', tickColor)
      .style('font-size', '12px');

    svg
      .selectAll('.x-axis .domain, .y-axis .domain')
      .attr('stroke', borderColor);

    g.selectAll('.tick line')
      .attr('stroke-dasharray', '4')
      .style('opacity', '0.4')
      .attr('stroke', borderColor);

    const zoomBehavior = d3
      .zoom()
      .scaleExtent([0.5, 10])
      //.translateExtent([[-100, 100], [width, height]])
      //.extent([[-100, 100], [width, height]])
      .on('zoom', (event) => {
        const newX = event.transform.rescaleX(x);
        const newY = event.transform.rescaleY(y);

        xAxisNode.call(xAxis.scale(newX));
        yAxisNode.call(yAxis.scale(newY));

        dots
          .attr('cx', (d) => newX(d[xAxisValue]))
          .attr('cy', (d) => newY(d[yAxisValue]));

        g.selectAll('.tick line')
          .attr('stroke', themeColor)
          .style('opacity', '0.4')
          .attr('stroke-dasharray', '4');
      });

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    svg.call(zoomBehavior);
  }, [
    data,
    width,
    height,
    xAxisLabel,
    yAxisLabel,
    themeColor,
    borderColor,
    tickColor,
    fillKey,
    fills,
    scaleType,
    onMouseMove,
    onMouseOut,
    onMouseOver,
    onClick,
    xAxisValue,
    yAxisValue,
    xAxisType,
    yAxisType,
  ]);

  return (
    <svg
      ref={svgRef}
      width={width}
      height={height}
      className='bg-white rounded shadow'
    />
  );
};

export default ScatterChart;
