import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

interface ImpactData {
  label: string;
  before: number;
  after: number;
}

interface ImpactChartProps {
  data: ImpactData[];
}

export const ImpactChart = ({ data }: ImpactChartProps) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 600;
    const height = 400;
    const margin = { top: 20, right: 30, bottom: 40, left: 150 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const yScale = d3
      .scaleBand()
      .domain(data.map((d) => d.label))
      .range([0, innerHeight])
      .padding(0.4);

    const xScale = d3.scaleLinear().domain([0, 100]).range([0, innerWidth]);

    // Axes
    g.append("g")
      .call(d3.axisLeft(yScale).tickSize(0))
      .attr("class", "text-secondary font-headline font-bold text-sm")
      .selectAll("text")
      .attr("dx", "-10px");

    g.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale).ticks(5).tickFormat((d) => `${d}%`))
      .attr("class", "text-secondary font-mono text-xs opacity-50");

    // Grid lines
    g.append("g")
      .attr("class", "grid")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale).ticks(5).tickSize(-innerHeight).tickFormat(() => ""))
      .attr("stroke-opacity", 0.1)
      .attr("stroke-dasharray", "2,2");

    // Bars
    const barGroups = g
      .selectAll(".bar-group")
      .data(data)
      .enter()
      .append("g")
      .attr("class", "bar-group")
      .attr("transform", (d) => `translate(0, ${yScale(d.label)})`);

    // Before Bar (Status Quo)
    barGroups
      .append("rect")
      .attr("height", yScale.bandwidth())
      .attr("width", 0)
      .attr("fill", "var(--color-tertiary)")
      .attr("opacity", 0.3)
      .attr("rx", 4)
      .transition()
      .duration(1000)
      .attr("width", (d) => xScale(d.before));

    // After Bar (Agentic)
    barGroups
      .append("rect")
      .attr("y", yScale.bandwidth() * 0.2)
      .attr("height", yScale.bandwidth() * 0.6)
      .attr("width", 0)
      .attr("fill", "var(--color-primary)")
      .attr("rx", 4)
      .transition()
      .duration(1000)
      .delay(500)
      .attr("width", (d) => xScale(d.after));

    // Labels
    barGroups
      .append("text")
      .attr("x", (d) => xScale(d.after) + 10)
      .attr("y", yScale.bandwidth() / 2 + 5)
      .attr("class", "text-primary font-mono text-xs font-bold")
      .text((d) => `${d.after}%`)
      .attr("opacity", 0)
      .transition()
      .duration(500)
      .delay(1500)
      .attr("opacity", 1);

    // Legend
    const legend = svg.append("g").attr("transform", `translate(${margin.left}, ${height - 10})`);

    legend.append("rect").attr("width", 12).attr("height", 12).attr("fill", "var(--color-tertiary)").attr("opacity", 0.3).attr("rx", 2);
    legend.append("text").attr("x", 18).attr("y", 10).text("Status Quo").attr("class", "text-secondary text-[10px] uppercase font-bold");

    legend.append("rect").attr("x", 100).attr("width", 12).attr("height", 12).attr("fill", "var(--color-primary)").attr("rx", 2);
    legend.append("text").attr("x", 118).attr("y", 10).text("Agentic Future").attr("class", "text-primary text-[10px] uppercase font-bold");

  }, [data]);

  return (
    <div className="w-full h-full flex items-center justify-center">
      <svg
        ref={svgRef}
        viewBox="0 0 600 400"
        className="w-full h-auto max-w-2xl overflow-visible"
      />
    </div>
  );
};
