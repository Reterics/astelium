import {useEffect, useRef, useState} from 'react';
import * as d3 from 'd3';
import {transformTransactionData} from '../../utils/utils.ts';

export interface TransactionChartData {
  time: string;
  income: number;
  outgoing: number;
  balance: number;
}

const TransactionChartCard = ({data}: {data: Record<string, any>[]}) => {
  const chartData = transformTransactionData(data);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [dimensions, setDimensions] = useState({width: 0, height: 0});

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
    const margin = {top: 10, right: 20, bottom: 20, left: 40};

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear previous chart

    const x = d3
      .scaleUtc()
      .domain(d3.extent(chartData, (d) => new Date(d.time)) as [Date, Date])
      .range([margin.left, width - margin.right]);

    const yMax =
      d3.max(chartData, (d) => Math.max(d.income, d.outgoing, d.balance)) || 0;
    const yMin =
      d3.min(chartData, (d) => Math.min(d.income, d.outgoing, d.balance)) || 0;

    const y = d3
      .scaleLinear()
      .domain([yMin, yMax])
      .nice()
      .range([height - margin.bottom, margin.top]);

    const colorMap = {
      income: '#4CAF50',
      outgoing: '#F44336',
      balance: '#2196F3',
    };

    const xAxis = svg
      .append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x));

    svg
      .append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));

    const lineIncome = d3
      .line<TransactionChartData>()
      .x((d) => x(new Date(d.time))!)
      .y((d) => y(d.income)!)
      .curve(d3.curveLinear);

    const lineOutgoing = d3
      .line<TransactionChartData>()
      .x((d) => x(new Date(d.time))!)
      .y((d) => y(d.outgoing)!)
      .curve(d3.curveLinear);

    const lineBalance = d3
      .line<TransactionChartData>()
      .x((d) => x(new Date(d.time))!)
      .y((d) => y(d.balance)!)
      .curve(d3.curveLinear);

    const pathIncoming = svg
      .append('path')
      .datum(chartData)
      .attr('fill', 'none')
      .attr('stroke', colorMap.income)
      .attr('stroke-width', 2)
      .attr('d', lineIncome);

    const pathOutgoing = svg
      .append('path')
      .datum(chartData)
      .attr('fill', 'none')
      .attr('stroke', colorMap.outgoing)
      .attr('stroke-width', 2)
      .attr('d', lineOutgoing);

    const pathBalance = svg
      .append('path')
      .datum(chartData)
      .attr('fill', 'none')
      .attr('stroke', colorMap.balance)
      .attr('stroke-width', 2)
      .attr('d', lineBalance);

    const verticalLine = svg
      .append('line')
      .attr('stroke', 'black')
      .attr('stroke-dasharray', '4 4')
      .attr('opacity', 0);

    const tooltip = svg
      .append('text')
      .attr('opacity', 0)
      .attr('font-size', '12px')
      .attr('fill', 'black');

    svg
      .append('rect')
      .attr('width', width)
      .attr('height', height)
      .attr('fill', 'transparent')
      .on('mousemove', function (event) {
        const [mouseX] = d3.pointer(event);
        const closestData = chartData.reduce((prev, curr) =>
          Math.abs(x(new Date(curr.time))! - mouseX) <
          Math.abs(x(new Date(prev.time))! - mouseX)
            ? curr
            : prev
        );

        verticalLine
          .attr('x1', x(new Date(closestData.time))!)
          .attr('x2', x(new Date(closestData.time))!)
          .attr('y1', margin.top)
          .attr('y2', height - margin.bottom)
          .attr('opacity', 1);

        tooltip
          .attr('x', x(new Date(closestData.time))! + 10)
          .attr('y', margin.top + 10)
          .text(
            `Income: ${closestData.income}, Outgoing: ${closestData.outgoing}, Balance: ${closestData.balance}`
          )
          .attr('opacity', 1);
      })
      .on('mouseout', function () {
        verticalLine.attr('opacity', 0);
        tooltip.attr('opacity', 0);
      });

    const zoom = d3
      .zoom()
      .scaleExtent([1, 5])
      .translateExtent([
        [margin.left, 0],
        [width - margin.right, height],
      ])
      .on('zoom', (event) => {
        const newX = event.transform.rescaleX(x);
        xAxis.call(d3.axisBottom(newX));

        lineIncome.x((d) => newX(new Date(d.time))!);
        lineOutgoing.x((d) => newX(new Date(d.time))!);
        lineBalance.x((d) => newX(new Date(d.time))!);

        pathIncoming.attr('d', lineIncome(chartData));
        pathOutgoing.attr('d', lineOutgoing(chartData));
        pathBalance.attr('d', lineBalance(chartData));
      });

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    svg.call(zoom);
  }, [chartData, data, dimensions]);

  return (
    <div className='bg-white shadow-md p-2 rounded-md w-full h-full flex flex-col'>
      <h2 className='text-lg font-semibold mb-2'>Transaction Overview</h2>
      <svg ref={svgRef} width='100%' height='100%'></svg>
    </div>
  );
};

export default TransactionChartCard;
