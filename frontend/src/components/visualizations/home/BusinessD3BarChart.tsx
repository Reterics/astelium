import {useEffect, useRef, useState} from "react";
import * as d3 from "d3";
import { motion } from "framer-motion";

const data = [
  { month: "Jan", sales: 4000 },
  { month: "Feb", sales: 3000 },
  { month: "Mar", sales: 5000 },
  { month: "Apr", sales: 7000 },
  { month: "May", sales: 6000 },
  { month: "Jun", sales: 9000 },
  { month: "Jul", sales: 8000 },
  { month: "Aug", sales: 7500 },
  { month: "Sep", sales: 9500 },
  { month: "Oct", sales: 11000 },
  { month: "Nov", sales: 10500 },
  { month: "Dec", sales: 12000 },
];

const BusinessD3BarChart = () => {
  const svgRef = useRef(null);
  const [dimensions, setDimensions] = useState({width: 0, height: 0});

  useEffect(() => {
    if (!svgRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      const {width} = entries[0].contentRect;
      setDimensions({width, height: width * 0.6});
    });

    resizeObserver.observe(svgRef.current);
    return () => resizeObserver.disconnect();
  }, []);


  useEffect(() => {
    const {width, height} = dimensions;
    if (!width || !height) return;
    const margin = { top: 10, right: 0, bottom: 20, left: 32 };

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .style("background", "none");

    const xScale = d3
      .scaleBand()
      .domain(data.map((d) => d.month))
      .range([margin.left, width - margin.right])
      .padding(0.3);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.sales) as number])
      .range([height - margin.bottom, margin.top]);

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale).ticks(5);

    svg.selectAll(".x-axis").remove();
    svg.selectAll(".y-axis").remove();

    svg
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(xAxis)
      .selectAll("text")
      .attr("fill", "oklch(0.21 0.006 285.885)")
      .attr("font-size", "8px");

    svg
      .append("g")
      .attr("class", "y-axis")
      .attr("transform", `translate(${margin.left},0)`)
      .call(yAxis)
      .selectAll("text")
      .attr("fill", "oklch(0.21 0.006 285.885)")
      .attr("font-size", "8px");

    svg.selectAll(".bar").remove();

    svg
      .selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => xScale(d.month) as number)
      .attr("y", height - margin.bottom)
      .attr("width", xScale.bandwidth())
      .attr("height", 0)
      .attr("fill", "#5087bb")
      .transition()
      .duration(4000)
      .attr("y", (d) => yScale(d.sales))
      .attr("height", (d) => height - margin.bottom - yScale(d.sales));
    return () => {
      svg.html('')
    };
  }, [dimensions]);

  return (
    <motion.div
      animate={{translateY: [3, -3, 3]}}
      transition={{repeat: Infinity, duration: 4, ease: 'easeInOut'}}
      className="w-full h-full bg-zinc-50 shadow-md border border-zinc-300 rounded-xs p-2 flex flex-col items-center"
    >
      <h2 className="text-sm font-semibold text-zinc-700 mb-3 sm:text-xs sm:mb-1">📊 Monthly Sales Performance</h2>
      <svg ref={svgRef} className='w-full h-full flex' />
    </motion.div>
  );
};

export default BusinessD3BarChart;
