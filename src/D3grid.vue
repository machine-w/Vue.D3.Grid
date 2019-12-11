<template>
  <div class="viewport treeclass" v-resize="resize">
  </div>
</template>
<script>
import * as d3 from 'd3'
import './util/polybrush'
import resize from 'vue-resize-directive'
import {compareString, anchorTodx, toPromise, findInParents} from './d3-utils'
import {ATTRS} from './attrs'
import {MODES} from './opermode/'
import single_select from './opermode/select-single'
import row_select from './opermode/select-row'
import col_select from './opermode/select-col'
import poly_select from './opermode/select-poly'



var i = 0
var currentSelected = null

const oper_mode = {
  single_select,
  row_select,
  col_select,
  poly_select
}

const props = {
  data: Object,
  latticeWidth:{
    type: Number,
    default: 20
  },
  marginX: {
    type: Number,
    default: 60
  },
  marginY: {
    type: Number,
    default: 40
  },
  viewAttr: {
    type: String,
    default: 'initHead',
    validator (value) {
      return ATTRS.indexOf(value) !== -1
    }
  },
  operMode: {
    type: String,
    default: 'single_select',
    validator (value) {
      return MODES.indexOf(value) !== -1
    }
  },

  // zoomable: {
  //   type: Boolean,
  //   default: false
  // }
}

const directives = {
  resize
}


export default {
  props,
  directives,
  data () {
    return {
      currentTransform: null,
      currentAttr:null,
      currentOperMode:null
    }
  },

  mounted () {
    let size = this.getSize()
    let svg = d3.select(this.$el).append('svg')
          .attr('width', size.width)
          .attr('height', size.height)
    let grid = svg.append('g')
    // let g = null
    // let zoom = null
    // if (this.zoomable) {
    //   g = svg.append('g')
    //   zoom = d3.zoom().scaleExtent([0.2, 8]).on('zoom', this.zoomed(g))
    //   svg.call(zoom).on('wheel', () => d3.event.preventDefault())
    //   svg.call(zoom.transform, d3.zoomIdentity)
    // }
    //////////////////////////////////////////////////////////////////
    let clip = svg.append("defs")
        // .attr("class", "clip")
        .append("SVG:clipPath")
        .attr("id", "clip")
        .append("SVG:rect")
        .attr("width", size.width )
        .attr("height", size.height )
        .attr("x", this.marginX)
        .attr("y", this.marginY);
    let scatter = svg.append('g')
        .attr("clip-path", "url(#clip)")

    let brusher=svg.append("g").attr("class", "brush")//.x(d3.scaleLinear().range([0, 0])).y(d3.scaleLinear().range([0, 0]))
        // .attr("class", "clip")
    var zoom = d3.zoom()
      .scaleExtent([.1, 100])  // This control how much you can unzoom (x0.5) and zoom (x20)
      .extent([[0, 0], [size.width, size.height]])
      .on("zoom", this.updateChart);

    svg.call(zoom).on('wheel', () => d3.event.preventDefault()).on("dblclick.zoom", () => {})
    this.internaldata = {
      svg,
      scatter,
      clip,
      zoom,
      brusher
    }
    this.currentAttr=this.viewAttr
    
    this.data && this.onData(this.data)
  },

  methods: {
    
    getSize () {
      var width = this.$el.clientWidth
      var height = this.$el.clientHeight
      // console.log(width,height)
      return { width, height }
    },
    resize () {
      const size = this.getSize()
      this.internaldata.svg
              .attr('width', size.width)
              .attr('height', size.height)
      // this.onData(this.internaldata.griddata)
      this.redraw()
    },
    clean () {
      ['.row', '.axis'].forEach(selector => {
        this.internaldata.svg.selectAll(selector).remove()
      })
    },
    // zoomed (g) {
    //   return () => {
    //     const transform = d3.event.transform
    //     this.$emit('zoom', {transform})
    //     g.attr('transform', d3.event.transform)
    //   }
    // },
    updateChart(g) {
      this.currentTransform = d3.event.transform
      var newX = d3.event.transform.rescaleX(this.internaldata.axis_scalex);
      var newY = d3.event.transform.rescaleY(this.internaldata.axis_scaley);
      // update axes with these new boundaries
      this.internaldata.xAxis.call(d3.axisTop(newX))
      this.internaldata.yAxis.call(d3.axisLeft(newY))
      this.internaldata.svg
        .selectAll(".row")
        .attr('transform', d3.event.transform);
      this.internaldata.svg
        .selectAll(".brush")
        .attr('transform', d3.event.transform);
    },
    onData(griddata) {
      
      if (!griddata && !griddata.grid) {
        this.internaldata.griddata = null
        this.clean()
        return
      }
      griddata.startX=this.marginX
      griddata.startY=this.marginY
      this.internaldata.griddata= griddata
      griddata.latticeWidth=this.latticeWidth
      griddata.endX=griddata.startX+griddata.xcount*this.latticeWidth
      griddata.latticeHeigth=this.latticeWidth / griddata.width * griddata.height //计算格子高度
      griddata.endY=griddata.startY+griddata.ycount* griddata.latticeHeigth
      //横轴比例尺
      this.internaldata.scalex = d3.scaleLinear()
      .domain([griddata.startposX, griddata.endposX])
      .range([griddata.startX, griddata.endX]);
      this.internaldata.scalew = d3.scaleLinear()
      .domain([0, griddata.width])
      .range([0, this.latticeWidth]);
      //纵轴比例尺
      this.internaldata.scaley = d3.scaleLinear()
      .domain([griddata.startposY, griddata.endposY])
      .range([griddata.startY, griddata.endY]);
      this.internaldata.scaleh = d3.scaleLinear()
      .domain([0, griddata.height])
      .range([0, griddata.latticeHeigth]);
      //增加虚拟空间坐标和大小属性
      for (let row of griddata.grid) {
        for (let cell of row) {
          cell.v_width = this.internaldata.scalew(cell.width)
          cell.v_height = this.internaldata.scaleh(cell.height)
          cell.v_x = this.internaldata.scalex(cell.x)
          cell.v_y = this.internaldata.scaley(cell.y)
        }
      }
      // console.log(griddata.startX,griddata.endX,griddata.startposX,griddata.endposX,this.internaldata.scalex(griddata.startposX))
      this.redraw()
    },
    redraw(){
      let {griddata,clip,zoom,svg} = this.internaldata
      if (griddata) {
        this.clean()
        const size = this.getSize()
        //坐标轴比例尺
        const maxposWidth = (size.width-this.marginX)/(griddata.endX-griddata.startX)*(griddata.endposX-griddata.startposX)+griddata.startposX
        this.internaldata.axis_scalex = d3.scaleLinear()
        .domain([griddata.startposX, maxposWidth])
        .range([griddata.startX, size.width]);
        const maxposHeight = (size.height-this.marginY)/(griddata.endY-griddata.startY)*(griddata.endposY-griddata.startposY)+griddata.startposY
        this.internaldata.axis_scaley = d3.scaleLinear()
        .domain([griddata.startposY, maxposHeight])
        .range([griddata.startY, size.height]);
        clip.attr("width", size.width ).attr("height", size.height ).attr("x", this.marginX).attr("y", this.marginY);
        zoom.extent([[0, 0], [size.width, size.height]])
        // svg.call(zoom).on('wheel', () => d3.event.preventDefault()) 
        return this.updateGraph(griddata)
      }
      return Promise.resolve('no graph')
    },
    updateGraph (griddata) {
      // TODO: 动画效果
      return new Promise((resolve, reject) => {
        const curAttr =this.currentAttr
        
        let {scalex,scalew,scaley,scaleh,g,svg,axis_scalex,axis_scaley} = this.internaldata
        this.internaldata.xAxis = svg.append("g")
          .attr("class", "axis")
          .style("font", "15px times")
          .attr("transform", "translate(0," + griddata.startY + ")")
          .call(d3.axisTop(axis_scalex));
        this.internaldata.yAxis = svg.append("g")
          .attr("class", "axis")
          .style("font", "15px times")
          .attr("transform", "translate(" + griddata.startX + ",0)")
          .call(d3.axisLeft(axis_scaley));
        this.internaldata.row = this.internaldata.scatter.selectAll(".row")
        .data(griddata.grid)
        .enter()
        .append("g")
        .attr("class", "row");
        // console.log(curAttr)
        this.internaldata.cells = this.internaldata.row.selectAll(".square")
        .data(function(d) {return d;})
        .enter()
        .append("rect")
        .attr("class", "square")
        .attr("x", function(d) { return d.v_x; })
        .attr("y", function(d) { return d.v_y; })
        .attr("xindex", function(d) { return d.xindex; })
        .attr("yindex", function(d) { return d.yindex; })
        .attr("width", function(d) { return d.v_width; })
        .attr("height", function(d) { return d.v_height; })
        .style("fill", function(d) { return d.attrs[curAttr].color; })
        .style("stroke", "#222");

        //更新操作
        this.updateOper()
        
        this.internaldata.scatter.call(this.internaldata.zoom.transform, this.currentTransform)
        resolve('ok')
      });
    },
    updateOper(){
        this.internaldata.brusher.selectAll('*').remove()//.attr("width", "0").attr("height", "0");
        this.updateColor()
        this.getOperMode.callOper(this,d3)
    },
    updateColor(){
      let that = this
      let {row,cells,griddata} = this.internaldata
      cells.data(function(d) {return d}).style("fill", function(d) { return d.attrs[that.currentAttr].color })

    }

  },

  computed: {
    margin () {
      return {x: this.marginX, y: this.marginY}
    },
    getOperMode () {
      return oper_mode[this.operMode]
    },
  },

  watch: {
    data (current, old) {
      this.onData(current)
    },
    latticeWidth (current, old) {
      this.onData(this.data)
    },
    marginX (current, old) {
      this.onData(this.data)
    },
    marginY (current, old) {
      this.onData(this.data)
    },
    viewAttr (current, old) {
      this.currentAttr=current
      this.updateColor()
      // this.redraw()
    },
    operMode (current, old) {
      this.currentOperMode=current
      this.updateOper()
      // this.redraw()
    },
    // zoomable (newValue) {
    //   if (newValue) {
    //     this.internaldata.zoom = this.setUpZoom()
    //     return
    //   }
    //   this.removeZoom()
    // }
  }
}
</script>

<style>
.treeclass .nodetree  circle {
  fill: #999;
  r: 2.5;
}

.treeclass .node--internal circle {
  cursor: pointer;
  fill:  #555;
  r: 3;
}

.treeclass .nodetree text {
  font: 10px sans-serif;
  cursor: pointer;
}

.treeclass .nodetree.selected text {
  font-weight: bold;
}

.treeclass .node--internal text {
  text-shadow: 0 1px 0 #fff, 0 -1px 0 #fff, 1px 0 0 #fff, -1px 0 0 #fff;
}

.treeclass .linktree {
  fill: none;
  stroke: #555;
  stroke-opacity: 0.4;
  stroke-width: 1.5px;
}
.brush .extent {
    stroke: #555;
    stroke-width: 3.5px;
    fill: #fff;
    fill-opacity: 0.3;
}
.brush .selection {
    stroke: #555;
    stroke-width: 1.5px;
    fill: #000;
    fill-opacity: 0.3;
}
.square{
    fill: #fff;
    stroke: #222;
    /* stroke-opacity: 0.5; */
}
.selected {
    fill: steelblue;
    /* fill-opacity: 0.4; */
    stroke: #111;
    /* stroke-opacity: 0.5; */
}
</style>
