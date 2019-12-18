export default {
    callOper (v,d3) {
        let {scatter,brusher} = v.internaldata
        var brush = d3.linebrush()
        .x(d3.scaleLinear().range([v.marginX, v.data.endX]))
        .y(d3.scaleLinear().range([v.marginY, v.data.endY]))
		.on("start", function() {
            scatter.selectAll(".selected").classed("selected", false)
            if(v.selectPoints) scatter.selectAll(".pselected").classed("pselected", false)
		})
		.on("brush", function() {
			scatter.selectAll(".square").classed("selected",function(d) {
				// console.log(d.x,d.y);
				return brush.isWithinExtent(d,d.v_x,d.v_y,d.v_x+d.v_width,d.v_y+d.v_height)
            })
            if(v.selectPoints){
                scatter.selectAll(".point").classed("pselected",function(d) {
                    return brush.isWithinExtent(d,d.v_x-d.v_radius,d.v_y-d.v_radius,d.v_x+d.v_radius,d.v_y+d.v_radius)
                })
            }
        })
        .on("end", function() {
            let ds=[]
            let ps =[]
            scatter.selectAll(".selected").each(function(d, i) {ds.push(d)})
            if(v.selectPoints) scatter.selectAll(".pselected").each(function(d, i) {ps.push(d)})
            v.$emit('clicked', {Lattices: ds,Points: ps, oper:'line_select',select_index:null})
		})
        
        brusher.call(brush)
    }
}