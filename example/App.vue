<template>
   <div id="app" class="container-fluid">
    <div class="col-md-3">

      <div class="panel panel-default">
        <div class="panel-heading">控制</div>

        <div class="panel-body">
            <div class="form-horizontal">

            <div class="form-group">
              <label for="type" class="control-label col-sm-3">查看属性</label>
                <div  class="col-sm-9">
                  <select id="type" class="form-control" v-model="viewAttr">
                    <option value="initHead">初始水头</option>
                    <option value="initnormality">初始浓度</option>
                  </select>
                </div>
            </div>

            <div class="form-group">
              <label for="layout-type" class="control-label col-sm-3">操作模式</label>
                <div  class="col-sm-9">
                  <select id="layout-type" class="form-control" v-model="operMode">
                    <option value="single_select">单点选择</option>
                    <option value="row_select">行选择</option>
                    <option value="col_select">列选择</option>
                  </select>       
              </div>
            </div> 

            <div class="form-group">
              <label for="margin-x" class="control-label col-sm-3">左边框</label>
              <div class="col-sm-7">
                <input id="margin-x" class="form-control" type="range" min="10" max="100" v-model.number="Marginx">
              </div> 
                <div class="col-sm-2">
                  <p>{{Marginx}}px</p>       
              </div> 
            </div>  
            <div class="form-group">
              <label for="margin-x" class="control-label col-sm-3">上边框</label>
              <div class="col-sm-7">
                <input id="margin-x" class="form-control" type="range" min="10" max="100" v-model.number="Marginy">
              </div> 
                <div class="col-sm-2">
                  <p>{{Marginy}}px</p>       
              </div> 
            </div>  
           

            <div class="form-group">
              <label for="margin-y" class="control-label col-sm-3">格子宽度</label>
              <div class="col-sm-7">
                <input id="margin-y" class="form-control" type="range" min="10" max="100" v-model.number="latticeWidth">
              </div>
              <div class="col-sm-2">
                <p>{{latticeWidth}}px</p>       
              </div> 
            </div>        


            <div class="form-group">
              <span v-if="currentNode">Current Node: {{currentNode.data.text}}</span>
              <span v-else>无选择节点</span>
               <i v-if="isLoading" class="fa fa-spinner fa-spin fa-2x fa-fw"></i>
            </div>  

            <button type="button" :disabled="!currentNode" class="btn btn-primary" @click="expandAll" data-toggle="tooltip" data-placement="top" title="Expand All from current">
            <i class="fa fa-expand" aria-hidden="true"></i>          
            </button>

            <button type="button" :disabled="!currentNode" class="btn btn-secondary" @click="collapseAll" data-toggle="tooltip" data-placement="top" title="Collapse All from current">
            <i class="fa fa-compress" aria-hidden="true"></i>            
            </button>

            <button type="button" :disabled="!currentNode" class="btn btn-success" @click="showOnlyChildren" data-toggle="tooltip" data-placement="top" title="Show Only Children from current">
            <i class="fa fa-search-plus" aria-hidden="true"></i>       
            </button>

            <button type="button" :disabled="!currentNode" class="btn btn-warning" @click="show" data-toggle="tooltip" data-placement="top" title="Show current">
            <i class="fa fa-binoculars" aria-hidden="true"></i>           
            </button>

            <button type="button"  class="btn btn-warning" @click="getAllOrdersRow" data-toggle="tooltip" data-placement="top" title="freshData">
            <i class="fa fa-arrows-alt" aria-hidden="true"></i>           
            </button>

            <button type="button" class="btn btn-warning" @click="getAllOrders" data-toggle="tooltip" data-placement="top" title="Reset Zoom">
            <i class="fa fa-arrows-alt" aria-hidden="true"></i>                             
            </button>

        </div> 
      </div>     
    </div>


    <div class="panel panel-default">
        <div class="panel-heading">属性</div>

        <div class="panel-body log">
          <div v-for="e in events" :key="e.eventName">
            <p><b>Name:</b> {{e.eventName}} <b>Data:</b>{{e.data.text}}</p>
          </div>
        </div>
    </div>

  </div>
    <div class="col-md-9 panel panel-default">
      <D3grid ref="tree" class="tree" :viewAttr="viewAttr" :marginX="Marginx" :marginY="Marginy" :data="griddata" :latticeWidth="latticeWidth"></D3grid>
    </div>
  </div>
</template>

<script>
import axios from "axios"
import D3grid from '../src/D3grid'
export default {
  name: 'app',
  data () {
    return {
      griddata:{},
      viewAttr: 'initHead',
      operMode: 'single_select',
      Marginx: 30,
      Marginy: 30,
      nodeText: 'text',
      currentNode: null,
      zoomable: true,
      isLoading: false,
      events: [],
      latticeWidth: 10,
    }
  },
  components: {
    D3grid
  },
  methods: {
    do (action) {
      if (this.currentNode) {
        this.isLoading = true
        this.$refs['tree'][action](this.currentNode).then(() => { this.isLoading = false })
      }
    },

    expandAll () {
      this.do('expandAll')
    },
    collapseAll () {
      this.do('collapseAll')
    },
    showOnlyChildren () {
      this.do('showOnlyChildren')
    },
    show () {
      this.do('show')
    },
    onClick (evt) {
      this.currentNode = evt.element
      this.onEvent('onClick', evt)
    },
    onExpand (evt) {
      this.onEvent('onExpand', evt)
    },
    onRetract (evt) {
      this.onEvent('onRetract', evt)
    },
    onEvent (eventName, data) {
      this.events.push({eventName, data: data.data})
      // console.log({eventName, data: data})
    },
    resetZoom () {
      this.isLoading = true
      this.$refs['tree'].resetZoom().then(() => { this.isLoading = false })
    },
    getAllOrders() {
      axios.get("/api/getGridDataLayer").then(res => {
        this.griddata = res.data
        // console.log(res.data.data);
      });
    },
    getAllOrdersRow() {
      axios.get("/api/getGridDataRow").then(res => {
        this.griddata = res.data
        // console.log(res.data.data);
      });
    },
    
  },
  mounted() {
      this.getAllOrders();
    }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 20px;
}

.tree {
  height: 1600px;
  width: 100%;
}

.log  {
  height: 500px;
  overflow-x: auto;
  overflow-y: auto;
  overflow: auto;
  text-align: left;
}

</style>
