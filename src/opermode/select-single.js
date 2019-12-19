import { OverColor } from ".";

export default {
  callOper (v,d3) {
    v.internaldata.cells.on('mouseover', function(d,i) {
        // d3.select(this).style("fill",OverColor)
        d3.select(this).classed("selected",true)
      })
      .on("mouseout",function(d,i){
        d3.select(this).classed("selected",false)
        // d3.select(this).transition().style("fill",d.attrs[v.currentAttr].color);
      })
      .on("click",function(d,i){
        // d3.select(this).classed("selected",false)
        d3.select(this).style("stroke","#ff6666").transition().style("stroke","#222")
        // d3.select(this).style("fill","#ff6666 !important").transition().style("fill",OverColor)
        v.$emit('clicked', {Lattices: [d],Points: [],oper:'single_select',select_index:null})
        // d3.select(this).transition().style("fill",d.attrs[v.currentAttr].color);
      });
  }
}