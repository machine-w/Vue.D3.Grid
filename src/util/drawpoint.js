export function drawCircle(contions,point,Opacity=1) {
    let color_id= "color"+point.color.slice(1)+point.core_color.slice(1)
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
                    {offset: "0%", color: point.core_color},
                    // {offset: "50%", color: "#FFF845"},
                    // {offset: "90%", color: "#FFDA4E"},
                    {offset: "100%", color: point.color}
                ])
            .enter().append("stop")
            .attr("offset", function(d) { return d.offset; })
            .attr("stop-color", function(d) { return d.color; })
    }

    contions.append("circle")
        .data([point])
		.attr('class', 'point')
		.attr("cx", function(d) { return d.v_x })
        .attr("cy", function(d) { return d.v_y })
        .style("fill", "url(#"+color_id+")")
		// .style("fill",color)
        .attr("r", function(d) { return d.v_radius })
        .style("opacity", Opacity)
    contions.append("circle")
        .data([point])
		.attr('class', 'point-core')
		.attr("cx", function(d) { return d.v_x })
        .attr("cy", function(d) { return d.v_y })
		.style("fill",function(d) { return d.core_color })
        .attr("r", function(d) { return d.v_core_radius })
        .style("opacity", Opacity)
}