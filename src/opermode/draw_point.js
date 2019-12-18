import { OverColor } from ".";
import {drawCircle} from "../util/drawpoint"
import { snow } from "color-name";
export default {
  callOper (v,d3) {
      let {svg,scatter,zoom,griddata,scalex,scaley,scalew} = v.internaldata
      let pointattr = v.pointattr
      let preFill=OverColor
      //选择点
      svg.selectAll(".point,.point-core")
      .on('mouseover', function(d,i) {
        preFill=d3.select(this).style('fill')
        d3.select(this).style("fill","FF6666")
      })
      .on("mouseout",function(d,i){
        d3.select(this).style("fill",preFill)
      })
      .on("click",function(d,i){
        // console.log(d)
        v.$emit('clicked', {elements: [d],oper:'draw_point',select_index:null})
      })
      //新建点
      v.internaldata.cells
      .on('mouseover', function(d,i) {
        d3.select(this).style("fill",OverColor);
      })
      .on("mouseout",function(d,i){
        d3.select(this).transition().style("fill",d.attrs[v.currentAttr].color)
      })
      .on("click",function(d,i){
        // d3.select(this).style("fill",OverColor);
        let coords = d3.mouse(this)
        const point = {
          index:griddata.points.length,
          v_x:coords[0],
          v_y:coords[1],
          v_radius:pointattr.radius,
          v_core_radius:pointattr.core_radius,
          x: scalex.invert(coords[0]),
          y: scaley.invert(coords[1]),
          radius:scalew.invert(pointattr.radius),
          core_radius:scalew.invert(pointattr.core_radius),
          color:pointattr.color,
          core_color:pointattr.core_color,
          attrs:{...pointattr.attrs}
          }
        drawCircle(scatter,point,v.Opacity)
        griddata.points.push(point)
        svg.call(zoom.transform, d3.zoomIdentity.translate(v.currentTransform.x, v.currentTransform.y).scale(v.currentTransform.k))
        // d3.select(this).style("fill",OverColor);
        v.updateOper()
        v.$emit('clicked', {elements: [point],oper:'draw_point',select_index:null})
      })
  }
}