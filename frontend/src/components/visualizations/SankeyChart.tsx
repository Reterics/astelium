import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import {
  sankey,
  sankeyLinkHorizontal,
  SankeyNodeMinimal,
  SankeyLinkMinimal,
  SankeyExtraProperties, SankeyNode
} from 'd3-sankey';

interface SankeyNodeExtended extends SankeyNodeMinimal<SankeyExtraProperties, SankeyExtraProperties> {
  name: string;
}

interface SankeyLinkExtended extends SankeyLinkMinimal<SankeyExtraProperties, SankeyExtraProperties> {
  source: SankeyNodeExtended;
  target: SankeyNodeExtended;
  value: number;
  gradientId?: string;
}

export interface SankeyInputData {
  nodes: SankeyNode<SankeyNodeExtended, SankeyLinkExtended>[];
  links: { source: number, target: number, value: number }[]
}

export interface SankeyChartProps {
  data: SankeyInputData;
  width?: number;
  height?: number;
  themeColor?: string;
  fills?: string[];
  onMouseMove?: (event: MouseEvent, data: any) => void;
  onMouseOut?: () => void;
  onMouseOver?: () => void;
  onClick?: (data: any) => void;
}

const SankeyChart: React.FC<SankeyChartProps> = ({
  data,
  width = 800,
  height = 500,
  themeColor = '#A0A0A0',
  fills = ['#dae8ed', '#bbd9ef', '#b4cde3', '#f6c7c1', '#ABEBC6'],
  onMouseMove,
  onMouseOut,
  onMouseOver,
  onClick,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!data || !svgRef.current) return;

    const margin = { top: 20, right: 30, bottom: 30, left: 50 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const ctx = document.createElement('canvas').getContext('2d')!;
    ctx.font = "12px Arial";

    const minNodeWidth = 80;
    const maxNodeWidth = 150;
    const nodeWidths: Record<string, number> = {};

    data.nodes.forEach(node => {
      const textWidth = ctx.measureText(node.name).width + 20;
      nodeWidths[node.name] = Math.min(Math.max(textWidth, minNodeWidth), maxNodeWidth);
    });

    const sankeyGenerator = sankey<SankeyNodeExtended, SankeyLinkExtended>()
      .nodeWidth(minNodeWidth)
      .nodePadding(15)
      .extent([[1, 1], [innerWidth - 1, innerHeight - 5]]);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const { nodes, links } = sankeyGenerator(data);

    nodes.forEach(node => {
      node.x1 = node.x0! + nodeWidths[node.name];
    });

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const colorScale = d3.scaleOrdinal<string>()
      .domain(nodes.map(d => d.name))
      .range(fills);

    const defs = svg.append("defs");

    links.forEach((link, i) => {
      const gradientId = `gradient-${i}`;
      const gradient = defs.append("linearGradient")
        .attr("id", gradientId)
        .attr("gradientUnits", "userSpaceOnUse")
        .attr("x1", link.source.x1 || 0)
        .attr("x2", link.target.x0 || 0);

      gradient.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", d3.color(colorScale(link.source?.name))?.brighter(1.5)?.toString() || themeColor);

      gradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", d3.color(colorScale(link.target?.name))?.darker(0.5)?.toString() || themeColor);

      link.gradientId = gradientId;
    });

    g.append('g')
      .selectAll('path')
      .data(links)
      .join('path')
      .attr('d', sankeyLinkHorizontal())
      .attr('fill', 'none')
      .attr('stroke', d => `url(#${d.gradientId})`)
      .attr('stroke-width', d => Math.max(1, (d as any).width))
      .attr('stroke-opacity', 0.4)
      .style('cursor', 'pointer')
      .on('mouseover', () => onMouseOver?.())
      .on('mousemove', (event, d) => onMouseMove?.(event, d))
      .on('mouseout', () => onMouseOut?.())
      .on('click', (_event, d) => onClick?.(d));

    const node = g.append('g')
      .selectAll('g')
      .data(nodes)
      .join('g')
      .attr('transform', d => `translate(${d.x0},${d.y0})`);

    node.append('rect')
      .attr('width', d => nodeWidths[d.name])
      .attr('height', d => Math.max(30, d.y1! - d.y0!))
      .attr('fill', d => colorScale(d.name) || themeColor)
      .style('cursor', 'move');

    node.append('foreignObject')
      .attr('x', 5)
      .attr('y', 5)
      .attr('width', d => nodeWidths[d.name] - 10)
      .attr('height', d => Math.max(30, d.y1! - d.y0!) - 10)
      .append('xhtml:div')
      .style('display', 'flex')
      .style('align-items', 'center')
      .style('justify-content', 'center')
      .style('width', '100%')
      .style('height', '100%')
      .style('text-align', 'center')
      .style('overflow-wrap', 'break-word')
      .style('font-size', '12px')
      .style('color', '#333')
      .style('user-select', 'text')
      .text(d => d.name);

    node.call(
      d3.drag<any, any>()
        .subject(d => d)
        .on('start', function () { this.parentNode.appendChild(this); })
        .on('drag', function (event, d) {
          d.y0 += event.dy;
          d.y1 += event.dy;
          d3.select(this)
            .attr('transform', `translate(${d.x0},${d.y0})`);
          sankeyGenerator.update({ nodes, links });
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          g.selectAll('path').attr('d', sankeyLinkHorizontal());
        })
    );
  }, [data, width, height, themeColor, fills, onMouseMove, onMouseOut, onMouseOver, onClick]);

  return <svg ref={svgRef} width={width} height={height} className='bg-white rounded shadow' />;
};

export default SankeyChart;
