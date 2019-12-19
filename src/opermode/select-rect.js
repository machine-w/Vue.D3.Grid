export default {
    callOper (v,d3) {
        let {scatter,rectbrusher} = v.internaldata
        var brush = d3.brush()
        // .x(d3.scaleLinear().range([v.marginX, v.data.endX]))
        // .y(d3.scaleLinear().range([v.marginY, v.data.endY]))
		.on("start", function() {
            scatter.selectAll(".selected").classed("selected", false)
            if(v.selectPoints) scatter.selectAll(".pselected").classed("pselected", false)
		})
		.on("brush", function() {
			scatter.selectAll(".square").classed("selected",function(d) {
                var s = d3.event.selection;
				let centerx = d.v_x + d.v_width/2;
                let centery = d.v_y +d.v_height/2;
                return (centerx<=s[1][0] && centerx >= s[0][0] && centery<=s[1][1] && centery >= s[0][1])
            })
            if(v.selectPoints){
                scatter.selectAll(".point").classed("pselected",function(d) {
                    var s = d3.event.selection;
                    let centerx = d.v_x;
                    let centery = d.v_y;
                    return (centerx<=s[1][0] && centerx >= s[0][0] && centery<=s[1][1] && centery >= s[0][1])
                })
            }
        })
        .on("end", function() {
            let ds=[]
            let ps =[]
            if(v.reverseSelect){
                scatter.selectAll("*:not(.selected).square").each(function(d, i) {ds.push(d)})         
            }else{
                scatter.selectAll(".selected").each(function(d, i) {ds.push(d)})
            }
            // scatter.selectAll(".selected").each(function(d, i) {ds.push(d)})
            if(v.selectPoints) scatter.selectAll(".pselected").each(function(d, i) {ps.push(d)})
            v.$emit('clicked', {Lattices: ds,Points: ps, oper:'rect_select',select_index:null})
		})
        // rectbrusher.call(brush.clear);
        rectbrusher.call(brush)
    }
}