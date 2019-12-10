import { OverColor } from ".";
import * as d3 from 'd3'
export default {
    MouseOver (target,d, i,v) {

      let curIndex = target.attr("yindex");
      v.internaldata.cells.filter(function(d1,i1){
        if(d1.yindex == curIndex){
           return true
        }
        else{
          return false
        }
      })
      // .transition()
      .style("fill",OverColor)
    },
    MouseOut (target,d, i,v) {
      let curIndex = target.attr("yindex");
      v.internaldata.cells
      .filter(function(d2,i1){
        if(d2.yindex == curIndex){
          return true;
        }
        else{
          return false;
        }
      })
      .transition()
      .each(function(d, i) {
        d3.select(this).style("fill",d.attrs['initHead'].color)})
    },
    Click (target,d, i,v) {
        v.$emit('clicked', {element: d, data: d.data})
    }
}
