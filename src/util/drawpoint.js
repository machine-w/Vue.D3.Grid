export function drawCircle(contions,x, y, size,core_size,color="#FFFFFF",core_color="#000000",Opacity=1) {
    let color_id= "color"+color.slice(1)+core_color.slice(1)
    if (contions.selectAll("#"+color_id+"").size() == 0){
        contions.append("defs")
            .attr('class', 'point-color')
            .append("radialGradient")
            .attr("id", color_id)
            .attr("cx", "50%")	//not really needed, since 50% is the default
            .attr("cy", "50%")	//not really needed, since 50% is the default
            .attr("r", "50%")	//not really needed, since 50% is the default
            .selectAll("stop")
            .data([
                    {offset: "0%", color: core_color},
                    // {offset: "50%", color: "#FFF845"},
                    // {offset: "90%", color: "#FFDA4E"},
                    {offset: "100%", color: color}
                ])
            .enter().append("stop")
            .attr("offset", function(d) { return d.offset; })
            .attr("stop-color", function(d) { return d.color; })
    }

	contions.append("circle")
		.attr('class', 'point')
		.attr("cx", x)
        .attr("cy", y)
        .style("fill", "url(#"+color_id+")")
		// .style("fill",color)
        .attr("r", size)
        .style("opacity", Opacity)
    contions.append("circle")
		.attr('class', 'point-core')
		.attr("cx", x)
		.attr("cy", y)
		.style("fill",core_color)
        .attr("r", core_size)
        .style("opacity", Opacity)
}