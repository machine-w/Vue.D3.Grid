import { OverColor } from ".";
export default {
    callOper (v,d3) {
        let {scatter,brusher} = v.internaldata
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
        .x(d3.scaleLinear().range([v.marginX, v.data.endX]))
        .y(d3.scaleLinear().range([v.marginY, v.data.endY]))
		.on("start", function() {
            scatter.selectAll(".selected").classed("selected", false)
		})
		.on("brush", function() {
			scatter.selectAll(".square").classed("selected",function(d) {
				// console.log(d.x,d.y);
				return brush.isWithinExtent(d.v_x+d.v_width/2, d.v_y + d.v_height/2)
			})
        })
        .on("end", function() {
            let ds=[]
            scatter.selectAll(".selected").each(function(d, i) {ds.push(d)})
            v.$emit('clicked', {elements: ds, oper:'poly_select'})
		})
        
        brusher.call(brush)
    }
}