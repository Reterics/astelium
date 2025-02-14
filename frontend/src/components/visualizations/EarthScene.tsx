import {useEffect, useRef} from 'react';
import * as d3 from 'd3';
import {geoOrthographic, geoPath} from 'd3-geo';
import worldData from '../../assets/earth.geo.json';

const EarthScene = () => {
  const svgRef = useRef(null);

  useEffect(() => {
    const svgElement = svgRef.current! as HTMLElement;
    if (!svgElement || !svgElement.clientWidth || !svgElement.clientHeight) {
      return;
    }
    const width = svgElement.clientWidth || 500;
    const height = svgElement.clientHeight || 500;
    const projection = geoOrthographic()
      .scale(400)
      .translate([width / 2, height / 2]);
    const path = geoPath().projection(projection);

    const svg = d3
      .select(svgRef.current!)
      .attr('width', width)
      .attr('height', height)
      .append('g');

    const globe = svg
      .selectAll('path')
      .data(worldData.features)
      .enter()
      .append('path')
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      .attr('d', path)
      .attr('fill', '#2d2d2d')
      .attr('stroke', '#888');

    const rotationSpeed = 0.02;
    let lambda = 0;

    const timer = d3.timer(() => {
      lambda += rotationSpeed;
      projection.rotate([lambda, 0]);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      globe.attr('d', path);
    });

    return () => {
      timer.stop();
      svg.remove();
    };
  }, []);

  return <svg ref={svgRef} className='w-full h-full' />;
};

export default EarthScene;
