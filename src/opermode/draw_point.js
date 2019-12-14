import { OverColor } from ".";
import {drawCircle} from "../util/drawpoint"


export default {
  callOper (v,d3) {
      let {svg,scatter,zoom} = v.internaldata
      v.internaldata.cells
      .on("click",function(d,i){
        var coords = d3.mouse(this)
        drawCircle(scatter,coords[0], coords[1], 1,.1,OverColor,"#000000",v.Opacity)
        // drawCircle(scatter,coords[0]+50, coords[1], 5,2,OverColor,"#000000")
        // drawCircle(scatter,coords[0]+10, coords[1], 5,1,"#ff0000","#000000")
        // drawCircle(scatter,coords[0]+20, coords[1], 5,1,"#ffee00","#000000")
        // drawCircle(scatter,coords[0]+30, coords[1], 5,.5)
        // drawCircle(scatter,coords[0]+40, coords[1], 5,.2,"#ff00FF","#000000")
        svg.call(zoom.transform, d3.zoomIdentity.translate(v.currentTransform.x, v.currentTransform.y).scale(v.currentTransform.k))
        // v.$emit('clicked', {elements: [d],oper:'single_select',select_index:null})
        // d3.select(this).transition().style("fill",d.attrs[v.currentAttr].color);
      });
  }
}