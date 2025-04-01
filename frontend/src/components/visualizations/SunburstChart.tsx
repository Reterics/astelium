import React, {useEffect, useRef} from 'react';
import * as d3 from 'd3';
import {HierarchyRectangularNode} from 'd3';

interface SunburstChartProps {
  data: any[];
  width?: number;
  height?: number;
  nestKeys?: string[];
}

export interface HierarchicalData {
  name: string;
  children: HierarchicalData[];
}

interface SunburstHData extends HierarchyRectangularNode<HierarchicalData> {
  current: HierarchyRectangularNode<HierarchicalData>;
  target: HierarchyRectangularNode<HierarchicalData>;
}

const SunburstChart: React.FC<SunburstChartProps> = ({
  data,
  nestKeys = ['color', 'country_name', 'ip_address', 'id'],
  width = 928,
  height = 928,
}) => {
  const ref = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!ref.current || !nestKeys.length) return;

    const outerRadius = Math.min(width, height) / 4;
    const radius = outerRadius / 1.6;

    // Convert flat data to hierarchical format
    const nestData = (
      data: Record<string, unknown>[],
      keys: string[]
    ): HierarchicalData[] => {
      if (!keys.length) return data as unknown as HierarchicalData[];
      const [key, ...restKeys] = keys;
      const grouped = d3.group(data, (d) => d[key]);
      return Array.from(grouped, ([key, values]) => ({
        name: key as string,
        children: nestData(values, restKeys),
      }));
    };

    // Create hierarchical data structure
    const hierarchyData = {
      name: 'root',
      children: nestData(data, nestKeys),
    };

    // D3 hierarchy & partitioning
    const hierarchy = d3
      .hierarchy(hierarchyData)
      .sum(() => 1)
      .sort((a, b) => b.value! - a.value!);

    const root: SunburstHData = d3
      .partition<HierarchicalData>()
      .size([2 * Math.PI, hierarchy.height + 1])(
      hierarchy
    ) as unknown as SunburstHData;
    root.each((d) => (d.current = d));

    const color = d3.scaleOrdinal(
      d3.quantize(d3.interpolateRainbow, (hierarchy.children?.length || 0) + 1)
    );

    const arc = d3
      .arc<{x0: number; x1: number; y0: number; y1: number}>()
      .startAngle((d) => d.x0)
      .endAngle((d) => d.x1)
      .padAngle((d) => Math.min((d.x1 - d.x0) / 2, 0.005))
      .padRadius(outerRadius)
      .innerRadius((d) => d.y0 * radius)
      .outerRadius((d) => Math.max(d.y0 * radius, d.y1 * radius - 1));

    d3.select(ref.current).selectAll('*').remove();

    const svg = d3
      .select(ref.current)
      .attr('viewBox', [-width / 2, -height / 2, width, height])
      .style('font', '10px sans-serif');

    // Create arcs
    const path = svg
      .append('g')
      .selectAll('path')
      .data(root.descendants().slice(1) as SunburstHData[])
      .join('path')
      .attr('fill', (d) => {
        while (d.depth > 1) d = d.parent as SunburstHData;
        return color(d.data?.name);
      })
      .attr('fill-opacity', (d) =>
        arcVisible(d.current) ? (d.children ? 0.6 : 0.4) : 0
      )
      .attr('pointer-events', (d) => (arcVisible(d.current) ? 'auto' : 'none'))
      .attr('d', (d) => arc(d.current))
      .style('cursor', (d) => (d.children ? 'pointer' : 'default'))
      .on('click', (event, p) => clicked(event, p));

    path.append('title').text(
      (d) =>
        `${d
          .ancestors()
          .map((d) => d.data.name)
          .reverse()
          .join('/')}\n${d.value}`
    );

    // Create labels
    const label = svg
      .append('g')
      .attr('pointer-events', 'none')
      .attr('text-anchor', 'middle')
      .style('user-select', 'none')
      .selectAll('text')
      .data(root.descendants().slice(1))
      .join('text')
      .attr('dy', '0.35em')
      .attr('fill-opacity', (d) => +labelVisible(d.current))
      .attr('transform', (d) => labelTransform(d.current))
      .text((d) => d.data.name);

    const parent = svg
      .append('circle')
      .datum(root)
      .attr('r', radius)
      .attr('fill', 'none')
      .attr('pointer-events', 'all')
      .on('click', (event, p) => clicked(event, p));

    // Click (Zoom) function
    function clicked(event: MouseEvent, p: SunburstHData) {
      parent.datum(p.parent || root);

      root.each((d) => {
        d.target = {
          x0:
            Math.max(0, Math.min(1, (d.x0 - p.x0) / (p.x1 - p.x0))) *
            2 *
            Math.PI,
          x1:
            Math.max(0, Math.min(1, (d.x1 - p.x0) / (p.x1 - p.x0))) *
            2 *
            Math.PI,
          y0: Math.max(0, d.y0 - p.depth),
          y1: Math.max(0, d.y1 - p.depth),
        } as HierarchyRectangularNode<HierarchicalData>;
      });

      const t = svg.transition().duration(event.altKey ? 7500 : 750);

      path
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        .transition(t)
        .tween('data', (d) => {
          const i = d3.interpolate(d.current, d.target);
          return (t) => (d.current = i(t));
        })
        .filter(function (d) {
          return !!(
            (this as SVGSVGElement)?.getAttribute('fill-opacity') ||
            arcVisible(d.target)
          );
        })
        .attr('fill-opacity', (d) =>
          arcVisible(d.target) ? (d.children ? 0.6 : 0.4) : 0
        )
        .attr('pointer-events', (d) => (arcVisible(d.target) ? 'auto' : 'none'))
        .attrTween('d', (d) => () => arc(d.current)!);

      label
        .filter(function (d) {
          return !!(
            (this as SVGTextElement)?.getAttribute('fill-opacity') ||
            labelVisible(d.target)
          );
        })
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        .transition(t)
        .attr('fill-opacity', (d) => +labelVisible(d.target))
        .attrTween('transform', (d) => () => labelTransform(d.current));
    }

    function arcVisible(d: HierarchyRectangularNode<HierarchicalData>) {
      return d.y1 <= 3 && d.y0 >= 1 && d.x1 > d.x0;
    }

    function labelVisible(d: HierarchyRectangularNode<HierarchicalData>) {
      return d.y1 <= 3 && d.y0 >= 1 && (d.y1 - d.y0) * (d.x1 - d.x0) > 0.03;
    }

    function labelTransform(d: HierarchyRectangularNode<HierarchicalData>) {
      const x = (((d.x0 + d.x1) / 2) * 180) / Math.PI;
      const y = ((d.y0 + d.y1) / 2) * radius;
      return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
    }
  }, [data, width, height, nestKeys]);

  return <svg ref={ref} className='block mx-auto'></svg>;
};

export default SunburstChart;
