<template>
  <div class="viewport treeclass" v-resize="resize">
  </div>
</template>
<script>
import resize from 'vue-resize-directive'
import {compareString, anchorTodx, toPromise, findInParents} from './d3-utils'

import * as d3 from 'd3'


var i = 0
var currentSelected = null

const props = {
  data: Object,
  zoomable: {
    type: Boolean,
    default: false
  }
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
      maxTextLenght: {
        first: 0,
        last: 0
      }
    }
  },

  mounted () {
    let size = this.getSize()
    let svg = d3.select(this.$el).append('svg')
          .attr('width', size.width)
          .attr('height', size.height)
    var grid = svg.append('g')
    let g = null
    let zoom = null
    if (this.zoomable) {
      g = svg.append('g')
      zoom = d3.zoom().scaleExtent([0.2, 8]).on('zoom', this.zoomed(g))
      svg.call(zoom).on('wheel', () => d3.event.preventDefault())
      svg.call(zoom.transform, d3.zoomIdentity)
    }
    this.internaldata = {
      svg,
      g,
      zoom
    }
    
    this.data.grid && this.onData(this.data.grid)
  },

  methods: {
    getSize () {
      var width = this.$el.clientWidth
      var height = this.$el.clientHeight
      return { width, height }
    },
    resize () {
      const size = this.getSize()
      this.internaldata.svg
              .attr('width', size.width)
              .attr('height', size.height)
      // this.layout.size(this.internaldata.tree, size, this.margin, this.maxTextLenght)
      // this.applyZoom(size)
      this.onData(this.internaldata.griddata)
    },
    clean () {
      console.log(this.internaldata)
      this.internaldata.g.selectAll(".row").remove(); // {#}
    },
    zoomed (g) {
      return () => {
        const transform = d3.event.transform
        const size = this.getSize()
        //const transformToApply = this.updateTransform(transform, size)
        this.currentTransform = transform
        this.$emit('zoom', {transform})
        g.attr('transform', d3.event.transform)
      }
    },
    // removeZoom () {
    //   const { internaldata } = this
    //   internaldata.zoom.on('zoom', null)
    //   internaldata.zoom = null
    // },

    onData(griddata) {
      this.clean()
      if (!griddata) {
        return
      }
      this.internaldata.griddata= griddata
      this.internaldata.row = this.internaldata.g.selectAll(".row")
      .data(griddata)
      .enter()
      .append("g")
      .attr("class", "row");
      this.internaldata.cells = this.internaldata.row.selectAll(".square")
      .data(function(d) {return d;})
      .enter()
      .append("rect")
      .attr("class", "square")
      .attr("x", function(d) { return d.x; })
      .attr("y", function(d) { return d.y; })
      .attr("xindex", function(d) { return d.xindex; })
      .attr("yindex", function(d) { return d.yindex; })
      .attr("width", function(d) { return d.width; })
      .attr("height", function(d) { return d.height; })
      .style("fill", function(d) { return d.attrs.initHead.color; })
      .style("stroke", "#222")
      // .on('mouseover', function(d) {
      //   d3.select(this).style("fill","#4682B4");
      // })
      // .on("mouseout",function(d,i){
      // 	d3.select(this)
      // 	  .transition()
      // 	  .style("fill","#fff");
      // });
    }
  },

  computed: {
    margin () {
      return {x: this.marginX, y: this.marginY}
    }
  },

  watch: {
    data (current, old) {
      this.onData(current.grid)
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
</style>
