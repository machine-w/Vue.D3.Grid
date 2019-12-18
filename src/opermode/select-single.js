import { OverColor } from ".";

export default {
  callOper (v,d3) {
    v.internaldata.cells.on('mouseover', function(d,i) {
        d3.select(this).style("fill",OverColor);
      })
      .on("mouseout",function(d,i){
        d3.select(this).transition().style("fill",d.attrs[v.currentAttr].color);
      })
      .on("click",function(d,i){
        d3.select(this).style("fill","#ff6666").style("stroke", "#f00").transition().style("fill",OverColor).style("stroke", "#222")
        v.$emit('clicked', {Lattices: [d],Points: [],oper:'single_select',select_index:null})
        // d3.select(this).transition().style("fill",d.attrs[v.currentAttr].color);
      });
  }
}