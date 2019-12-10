import { OverColor } from ".";
import * as d3 from 'd3'
export default {
  callOper (v,d3) {
    v.internaldata.cells.on('mouseover', function(d,i) {
        let curIndex = d3.select(this).attr("yindex");
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
      })
      .on("mouseout",function(d,i){
        let curIndex = d3.select(this).attr("yindex");
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
          d3.select(this).style("fill",d.attrs[v.currentAttr].color)})
      })
      .on("click",function(d,i){
        let ds=[]
        let curIndex = d3.select(this).attr("yindex");
        v.internaldata.cells
        .filter(function(d2,i2){
          if(d2.yindex == curIndex){
            return true;
          }
          else{
            return false;
          }
        })
        .each(function(d, i) {ds.push(d)})
          v.$emit('clicked', {elements: ds, oper:'col_select',select_row:curIndex})
      });
  }
    // MouseOver (target,d, i,v) {

    //   let curIndex = target.attr("yindex");
    //   v.internaldata.cells.filter(function(d1,i1){
    //     if(d1.yindex == curIndex){
    //        return true
    //     }
    //     else{
    //       return false
    //     }
    //   })
    //   // .transition()
    //   .style("fill",OverColor)
    // },
    // MouseOut (target,d, i,v) {
    //   let curIndex = target.attr("yindex");
    //   v.internaldata.cells
    //   .filter(function(d2,i1){
    //     if(d2.yindex == curIndex){
    //       return true;
    //     }
    //     else{
    //       return false;
    //     }
    //   })
    //   .transition()
    //   .each(function(d, i) {
    //     d3.select(this).style("fill",d.attrs['initHead'].color)})
    // },
    // Click (target,d, i,v) {
    //   let ds=[]
    //   let curIndex = target.attr("yindex");
    //   v.internaldata.cells
    //   .filter(function(d2,i2){
    //     if(d2.yindex == curIndex){
    //       return true;
    //     }
    //     else{
    //       return false;
    //     }
    //   })
    //   .each(function(d, i) {ds.push(d)})
    //     v.$emit('clicked', {elements: ds, oper:'row_select',select_row:curIndex})
    // }
}
