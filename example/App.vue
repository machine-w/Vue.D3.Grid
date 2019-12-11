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
                    <option value="poly_select">多边形选择</option>
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
              <span v-if="currentLattices">当前节点数量： {{currentLattices.length}}</span>
              <span v-else>无选择节点</span>
               <i v-if="isLoading" class="fa fa-spinner fa-spin fa-2x fa-fw"></i>
            </div>  

            <!-- <button type="button" :disabled="!currentLattices" class="btn btn-primary" @click="expandAll" data-toggle="tooltip" data-placement="top" title="Expand All from current">
            <i class="fa fa-expand" aria-hidden="true"></i>          
            </button>

            <button type="button" :disabled="!currentLattices" class="btn btn-secondary" @click="collapseAll" data-toggle="tooltip" data-placement="top" title="Collapse All from current">
            <i class="fa fa-compress" aria-hidden="true"></i>            
            </button>

            <button type="button" :disabled="!currentLattices" class="btn btn-success" @click="showOnlyChildren" data-toggle="tooltip" data-placement="top" title="Show Only Children from current">
            <i class="fa fa-search-plus" aria-hidden="true"></i>       
            </button>

            <button type="button" :disabled="!currentLattices" class="btn btn-warning" @click="show" data-toggle="tooltip" data-placement="top" title="Show current">
            <i class="fa fa-binoculars" aria-hidden="true"></i>           
            </button> -->

            <button type="button"  class="btn btn-default" @click="getAllOrdersRow" data-toggle="tooltip" data-placement="top" title="freshData">
            <i class="fa fa-arrows" aria-hidden="true"></i>           
            </button>

            <button type="button" class="btn btn-default" @click="getAllOrders" data-toggle="tooltip" data-placement="top" title="Reset Zoom">
            <i class="fa fa-arrows-alt" aria-hidden="true"></i>                             
            </button>
            <button type="button" class="btn btn-warning" @click="()=>{this.events=[]}" data-toggle="tooltip" data-placement="top" title="clear events">
            <i class="fa fa-trash" aria-hidden="true"></i>  删除记录                          
            </button>

        </div> 
      </div>     
    </div>


    <div class="panel panel-default">
        <div class="panel-heading">当前节点</div>
        
        <div class="panel-body log">
          <div v-for="e in events" :key="e.oper">
            <p><b>数据:</b> {{e.data}} <b>当前操作:</b>{{e.oper}}</p>
          </div>
        </div>
    </div>

  </div>
    <div class="col-md-9 panel panel-default">
      <D3grid ref="grid" class="grid" :operMode="operMode" :viewAttr="viewAttr" :marginX="Marginx" :marginY="Marginy" :data="griddata" :latticeWidth="latticeWidth"
       @clicked="onClick" ></D3grid>
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
      currentLattices: null,
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
      if (this.currentLattices) {
        this.isLoading = true
        this.$refs['grid'][action](this.currentLattices).then(() => { this.isLoading = false })
      }
    },

    // expandAll () {
    //   this.do('expandAll')
    // },
    // collapseAll () {
    //   this.do('collapseAll')
    // },
    // showOnlyChildren () {
    //   this.do('showOnlyChildren')
    // },
    // show () {
    //   this.do('show')
    // },
    onClick (evt) {
      // console.log(evt)
      this.currentLattices = evt.elements
      this.onEvent(evt)
    },
    onEvent (data) {
      this.events.push({data:data.elements, oper: data.oper})
      // console.log({eventName, data: data.oper})
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

.grid {
  height: 1600px;
  width: 100%;
}

.log  {
  height: 1200px;
  overflow-x: auto;
  overflow-y: auto;
  overflow: auto;
  text-align: left;
}

</style>
