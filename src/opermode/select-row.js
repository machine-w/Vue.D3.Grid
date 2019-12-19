import { OverColor } from ".";
import * as d3 from 'd3'
export default {
  callOper (v,d3) {
    let {cells,row} = v.internaldata
    let selectedIndex=null
    cells.on('mouseover', function(d,i) {
        let curIndex = d3.select(this).attr("xindex")
        cells.classed('selected',function(d1,i1){
          if(d1.xindex == curIndex || selectedIndex == d1.xindex){
            return true
          }
          else{
            return false
          }
        })
      })
      // .on("mouseout",function(d,i){
      // })
      .on("click",function(d,i){
        let ds=[]
        let querystr=''
        let curIndex = d3.select(this).attr("xindex");
        if (selectedIndex != curIndex ){
          cells.classed('selected',function(d1,i1){
            if(curIndex == d1.xindex){
              return true
            }else{
              return false
            }
          })
          selectedIndex = curIndex
        }
        if(v.reverseSelect){
            querystr="*:not(.selected)"
        }else{
            querystr=".selected"
        }
        if(v.gridVisible == 1){
            querystr +=":not(.invalid)"
        }
        row.selectAll(querystr).each(function(d, i) {ds.push(d)})
        v.$emit('clicked', {Lattices: ds,Points: [], oper:'row_select',select_index:curIndex})
      });
  }
}
