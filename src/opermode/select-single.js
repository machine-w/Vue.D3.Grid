import { OverColor } from ".";

export default {
  callOper (v,d3) {
    v.internaldata.cells.on('mouseover', function(d,i) {
        d3.select(this).transition().style("fill",OverColor);
      })
      .on("mouseout",function(d,i){
        d3.select(this).transition().style("fill",d.attrs[v.currentAttr].color);
      })
      .on("click",function(d,i){
        v.$emit('clicked', {elements: [d],oper:'single_select'})
      });
  }
}