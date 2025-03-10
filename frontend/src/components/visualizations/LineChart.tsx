import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface LineChartProps {
  data: Record<string, number>[];
  width?: number;
  height?: number;
  themeColor?: string;
  backgroundColor?: string;
  zoomLimit?: [number, number];
  yAxis: string;
  xAxis: string;
  scaleType?: 'linear' | 'log';
  zoomType?: 'auto' | 'free' | 'normal';
  mouseLine?: 'target' | 'horizontal' | 'vertical' | 'none';
  onMouseMove?: (data: any) => void;
  onMouseOut?: () => void;
  onMouseOver?: () => void;
}

const LineChart: React.FC<LineChartProps> = ({
  data,
  width = 600,
  height = 300,
  themeColor = '#464646',
  backgroundColor = 'white',
  zoomLimit = [0.5, 100],
  scaleType = 'linear',
  zoomType = 'normal',
  mouseLine = 'none',
  xAxis = 'timestamp',
  yAxis = 'count',
  onMouseMove,
  onMouseOut,
  onMouseOver,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const xScaleRef = useRef(d3.scaleTime());
  const yScaleRef = useRef(d3.scaleLinear());

  useEffect(() => {
    if (!data.length || !svgRef.current) return;

    const margin = { top: 20, right: 30, bottom: 30, left: 50 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const xScale = d3
      .scaleTime()
      .domain(d3.extent(data, (d) => new Date(d[xAxis])) as [Date, Date])
      .range([0, innerWidth]);

    const yScale =
      scaleType === 'log'
        ? d3.scaleLog().domain([1, d3.max(data, (d) => d[yAxis]) || 10]).range([innerHeight, 0])
        : d3.scaleLinear().domain([0, d3.max(data, (d) => d[yAxis]) || 10]).nice().range([innerHeight, 0]);

    xScaleRef.current = xScale;
    yScaleRef.current = yScale;

    const line = d3
      .line<Record<string, number>>()
      .x((d) => xScale(new Date(d[xAxis])))
      .y((d) => yScale(d[yAxis]))
      .curve(d3.curveLinear);

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const path = g.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', themeColor)
      .attr('stroke-width', 2)
      .attr('d', line);

    const xAxisGroup = g.append('g')
      .attr('transform', `translate(0,${innerHeight})`);

    const yAxisGroup = g.append('g');

    let vLine: any, hLine: any;
    if (mouseLine === 'target' || mouseLine === 'vertical') {
      vLine = g.append('line')
        .attr('y1', 0)
        .attr('y2', innerHeight)
        .attr('stroke-dasharray', '4')
        .style('stroke', themeColor)
        .style('opacity', '0');
    }
    if (mouseLine === 'target' || mouseLine === 'horizontal') {
      hLine = g.append('line')
        .attr('x1', 0)
        .attr('x2', innerWidth)
        .attr('stroke-dasharray', '4')
        .style('stroke', themeColor)
        .style('opacity', '0');
    }

    const updateAxes = () => {
      xAxisGroup.call(d3.axisBottom(xScaleRef.current).ticks(5));
      yAxisGroup.call(d3.axisLeft(yScaleRef.current));
      yAxisGroup.selectAll('.tick line')
        .attr('stroke', themeColor)
        .style('opacity', '0.4')
        .attr('stroke-dasharray', '4')
        .attr('x2', innerWidth);
      xAxisGroup.selectAll('.tick line')
        .attr('stroke', themeColor)
        .style('opacity', '0.4')
        .attr('stroke-dasharray', '4')
        .attr('y2', -innerHeight);
    };

    updateAxes();

    const zoom = d3.zoom()
      .scaleExtent(zoomLimit)
      .on('zoom', (event) => {
        if (zoomType === 'normal' || zoomType === 'auto') {
          const newXScale = event.transform.rescaleX(xScale);
          xScaleRef.current = newXScale;
          path.attr(
            'd',
            line
              .x((d) => newXScale(new Date(d[xAxis])))
              .y((d) => yScale(d[yAxis]))
          );
          updateAxes();
        }
      });

    svg.call(zoom as unknown as (selection: d3.Selection<SVGSVGElement, unknown, null, undefined>) => void);

    svg.on('mousemove', function (event) {
      const [mouseX] = d3.pointer(event);
      const xDate = xScaleRef.current.invert(mouseX - margin.left);
      const nearest =
        data.reduce((prev, curr) =>
          (Math.abs(new Date(curr[xAxis]).getTime() - xDate.getTime()) < Math.abs(new Date(prev[xAxis]).getTime() - xDate.getTime()) ? curr : prev));
      const nearestX = xScaleRef.current(new Date(nearest[xAxis]));
      const nearestY = yScaleRef.current(nearest[yAxis]);

      if (mouseLine === 'target' || mouseLine === 'vertical') {
        vLine.attr('x1', nearestX).attr('x2', nearestX).style('opacity', '0.8');
      }
      if (mouseLine === 'target' || mouseLine === 'horizontal') {
        hLine.attr('y1', nearestY).attr('y2', nearestY).style('opacity', '0.8');
      }

      if (typeof onMouseMove === 'function') {
        onMouseMove(nearest);
      }
    });

    svg.on('mouseout', () => {
      vLine?.style('opacity', '0');
      hLine?.style('opacity', '0');
      if (typeof onMouseOut === 'function') {
        onMouseOut();
      }
    });

    svg.on('mouseover', () => onMouseOver && onMouseOver());
  }, [data, width, height, themeColor, backgroundColor, zoomLimit, scaleType, zoomType, mouseLine, onMouseMove, onMouseOut, onMouseOver, xAxis, yAxis]);

  return <svg ref={svgRef} width={width} height={height} className='bg-white rounded shadow' />;
};

export default LineChart;
