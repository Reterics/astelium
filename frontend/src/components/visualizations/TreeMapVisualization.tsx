import {useCallback, useEffect, useRef, useState} from 'react';
import * as d3 from 'd3';
import DiiHelper from 'dii-helper';
import {HierarchyNode, HierarchyRectangularNode} from 'd3';
import {HierarchicalData} from './SunburstChart.tsx';

interface TreeMapProps {
  data: any[];
  nestKeys: string[]; // Define nesting levels
  width?: number;
  height?: number;
  fillKey?: string;
}

const TreeMapVisualization: React.FC<TreeMapProps> = ({
  data,
  nestKeys,
  width = 800,
  height = 600,
  fillKey = 'value',
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [currentRoot, setCurrentRoot] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const xScale = useRef(d3.scaleLinear());
  const yScale = useRef(d3.scaleLinear());
  const colorScale = d3.scaleOrdinal(d3.schemeCategory10);
  useEffect(() => {
    if (!data || !svgRef.current) return;

    const nestedData = DiiHelper.nestKeys(data, nestKeys);

    const flare = {
      name: 'Root',
      children: nestedData,
    };

    const margin = {top: 30, right: 10, bottom: 10, left: 10};
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const root = d3
      .hierarchy(flare)
      .sum((d: any) => d[fillKey] || 1)
      .sort((a, b) => b.value! - a.value!);

    const treemap = d3
      .treemap<HierarchicalData>()
      .tile(d3.treemapSquarify)
      .size([innerWidth, innerHeight])
      .padding(1)
      .round(true);

    treemap(root as HierarchyNode<HierarchicalData>);
    xScale.current.range([0, width]).domain([0, innerWidth]);
    yScale.current.range([0, height]).domain([0, innerHeight]);
    //drawTree(root);
    setCurrentRoot(root);
  }, [data, width, height, fillKey, nestKeys]);

  const drawTree = useCallback(
    (node: any) => {
      if (!svgRef.current) return;
      d3.select(svgRef.current).selectAll('*').remove();

      const svg = d3.select(svgRef.current);
      const assignColor = (d: any) => {
        return colorScale(d.data.name);
      };

      const g = svg.append('g').attr('class', 'depth');

      const nodes = g
        .selectAll('g')
        .data(
          (node.children ||
            node.leaves()) as HierarchyRectangularNode<HierarchicalData>[]
        )
        .enter()
        .append('g');

      nodes
        .selectAll('rect.child')
        .data((d) => d.children || [])
        .enter()
        .append('rect')
        .attr('class', 'child')
        .attr('x', (d) => xScale.current(d.x0) - xScale.current(node.x0))
        .attr('y', (d) => yScale.current(d.y0) - yScale.current(node.y0))
        .attr('width', (d) => xScale.current(d.x1) - xScale.current(d.x0))
        .attr('height', (d) => yScale.current(d.y1) - yScale.current(d.y0))
        .attr('fill', assignColor)
        .attr('stroke', '#fff')
        .style('opacity', 1)
        .on('click', (_event, d) => zoom(d));

      nodes
        .append('rect')
        .attr('class', 'parent')
        .attr(
          'transform',
          (d) => `translate(${xScale.current(d.x0)},${yScale.current(d.y0)})`
        )
        .attr('width', (d) => xScale.current(d.x1) - xScale.current(d.x0))
        .attr('height', (d) => yScale.current(d.y1) - yScale.current(d.y0))
        .attr('fill', assignColor)
        .attr('stroke', '#fff')
        .style('cursor', (d) => (d.children ? 'pointer' : 'default'))
        .on('click', (_event, d) => zoom(d))
        .on('mouseover', function () {
          d3.select(this).style('opacity', 0.5);
        })
        .on('mouseout', function () {
          d3.select(this).style('opacity', 1);
        })
        .attr('opacity', 1);

      nodes
        .append('text')
        .attr('x', (d) => xScale.current(d.x0) + 5)
        .attr('y', (d) => yScale.current(d.y0) + 10)
        .attr('text-anchor', 'start')
        .attr('dy', '0.35em')
        .attr('fill', 'black')
        .attr('font-size', '12px')
        .attr('pointer-events', 'none')
        .text((d) => d.data?.name);

      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [svgRef.current]
  );

  useEffect(() => {
    if (currentRoot) {
      drawTree(currentRoot);
    }
  }, [currentRoot, drawTree]);

  const zoom = (d: any) => {
    setHistory((prev) => [...prev, currentRoot]);

    const svg = d3.select(svgRef.current);
    const g = svg.select('g');

    const x0 = xScale.current(d.x0);
    const x1 = xScale.current(d.x1);
    const y0 = yScale.current(d.y0);
    const y1 = yScale.current(d.y1);

    const nodeWidth = x1 - x0;
    const nodeHeight = y1 - y0;

    const scaleX = width / nodeWidth;
    const scaleY = height / nodeHeight;

    const translateX = -x0 * scaleX;
    const translateY = -y0 * scaleY;

    g.transition()
      .duration(600)
      .ease(d3.easeCubicOut)
      .attr(
        'transform',
        `translate(${translateX},${translateY}) scale(${scaleX},${scaleY})`
      )
      .on('end', () => {
        setCurrentRoot(d);
        xScale.current.domain([d.x0, d.x1]);
        yScale.current.domain([d.y0, d.y1]);
      });
  };

  const zoomOut = () => {
    if (history.length > 0) {
      const prev = history.pop();
      setHistory([...history]);
      setCurrentRoot(prev);
      xScale.current.domain([prev.x0, prev.x1]);
      yScale.current.domain([prev.y0, prev.y1]);
      drawTree(prev);
    }
  };

  return (
    <div className='relative'>
      {history.length > 0 && (
        <button
          className='mb-2 px-3 py-1 bg-gray-800 text-white rounded'
          onClick={zoomOut}
        >
          Back
        </button>
      )}
      <svg
        ref={svgRef}
        width={width}
        height={height}
        className='bg-gray-100 rounded shadow-lg'
      />
    </div>
  );
};

export default TreeMapVisualization;
