import { OverColor } from ".";
export default {
    callOper (v,d3) {
        let {scatter} = v.internaldata
        // let p_brush = d3.polybrush()
        //             .x(d3.scaleLinear().range([v.marginX, size.width]))
        //             .y(d3.scaleLinear().range([v.marginY, size.height]))
        //             .on("start", function() {
        //                 d3.selectAll(".selected").classed("selected", false);
        //             })
        //             .on("brush", function() {
        //                 v.internaldata.cells.classed("selected", function(d) {
        //                     return p_brush.isWithinExtent(d.x + d.width / 2, d.y + d.height / 2);
        //                 });
        //             });
        // v.internaldata.scatter
        // // .append("g")
        // .attr("class", "brush")
        // .call(p_brush);
        const size = v.getSize()
        var brush = d3.polybrush()
        .x(d3.scaleLinear().range([v.marginX, size.width]))
        .y(d3.scaleLinear().range([v.marginY, size.height]))
		.on("start", function() {
			// v.internaldata.scatter.selectAll(".selected").classed("selected", false);
		})
		.on("brush", function() {
			// set the 'selected' class for the circle
			scatter.selectAll(".square").filter(function(d,i) {
				// console.log(d.x,d.y);
				if (brush.isWithinExtent(d.v_x+d.v_width/2, d.v_y + d.v_height/2)) {
					return true;
				} else {
					return false;
				}
			}).style("fill",OverColor).attr("class", "selected")
        });
        scatter.append("g")
            .attr("class", "brush")
            .call(brush);
    }
}