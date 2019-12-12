export default {
    callOper (v,d3) {
        let {scatter,rectbrusher} = v.internaldata
        var brush = d3.brush()
        // .x(d3.scaleLinear().range([v.marginX, v.data.endX]))
        // .y(d3.scaleLinear().range([v.marginY, v.data.endY]))
		.on("start", function() {
            scatter.selectAll(".selected").classed("selected", false)
		})
		.on("brush", function() {
			scatter.selectAll(".square").classed("selected",function(d) {
                var s = d3.event.selection;
				let centerx = d.v_x + d.v_width/2;
                let centery = d.v_y +d.v_height/2;
                return (centerx<=s[1][0] && centerx >= s[0][0] && centery<=s[1][1] && centery >= s[0][1])
			})
        })
        .on("end", function() {
            let ds=[]
            scatter.selectAll(".selected").each(function(d, i) {ds.push(d)})
            v.$emit('clicked', {elements: ds, oper:'rect_select'})
		})
        // rectbrusher.call(brush.clear);
        rectbrusher.call(brush)
    }
}