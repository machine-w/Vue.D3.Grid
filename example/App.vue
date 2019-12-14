<template>
   <div id="app" class="container-fluid">
    <div class="col-md-2">
      <div class="panel panel-default">
        <div class="panel-heading">基础控制</div>
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
                      <option value="line_select">线形选择</option>
                      <option value="rect_select">矩形选择</option>
                      <option value="draw_point">画点</option>
                    </select>       
                  </div>
              </div>

              <div class="form-group">
                <label for="Opacity" class="control-label col-sm-3">透明度</label>
                <div class="col-sm-7">
                  <input id="Opacity" class="form-control" type="range" min="0" max="100" v-model.number="Opacity">
                </div> 
                  <div class="col-sm-2">
                    <p>{{vOpacity}}</p>       
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
                <label for="strokeWidth" class="control-label col-sm-3">边框宽度</label>
                <div class="col-sm-7">
                  <input id="strokeWidth" class="form-control" type="range" min="0" max="100" v-model.number="strokeWidth">
                </div>
                <div class="col-sm-2">
                  <p>{{vstrokeWidth}}px</p>    
                </div> 
              </div>

              <div class="form-group">
                <label for="viewBackgroud" class="control-label col-sm-5">是否显示背景图片</label>
                <div class="col-sm-4">
                  <input type="checkbox" id="viewBackgroud" v-model="viewBackgroud">
                </div>
                <div class="col-sm-3">
                  <p>{{viewBackgroud?'是':'否'}}</p>       
                </div> 
              </div>

              <div class="form-group">
                <label for="layout-type" class="control-label col-sm-3">背景图片</label>
                  <div  class="col-sm-9">
                    <input  class="form-control" v-model="bgImg" >
                  </div>
              </div>         


              <div class="form-group">
                <span v-if="currentLattices">当前选择节点数量： {{currentLattices.length}}</span>
                <span v-else>无选择节点</span>
                <i v-if="isLoading" class="fa fa-spinner fa-spin fa-2x fa-fw"></i>
              </div>
              <div class="form-group">
                <span v-if="currentOper">当前操作： {{currentOper}}</span>
              </div>
              <div class="form-group">
                <span v-if="row_select">当前选择行： {{currentIndex}}</span>
                <span v-if="col_select">当前选择列： {{currentIndex}}</span>
              </div>

              <button type="button"  class="btn btn-default" @click="getAllOrdersRow" data-toggle="tooltip" data-placement="top" title="freshData">
              <i class="fa fa-arrows" aria-hidden="true"></i>加载横向网格       
              </button>

              <button type="button" class="btn btn-default" @click="getAllOrders" data-toggle="tooltip" data-placement="top" title="Reset Zoom">
              <i class="fa fa-arrows-alt" aria-hidden="true"></i>加载俯视网格                           
              </button>
              <button type="button" class="btn btn-warning" @click="()=>{this.events=[]}" data-toggle="tooltip" data-placement="top" title="clear events">
              <i class="fa fa-trash" aria-hidden="true"></i>删除节点记录                          
              </button>

            </div> 
        </div>
      </div>     
      <div class="panel panel-default">
          <div class="panel-heading">修改节点值</div>
          <div class="panel-body">
            <div class="form-horizontal">

              <div class="form-group">
                <label for="layout-type" class="control-label col-sm-3">zone</label>
                  <div  class="col-sm-9">
                    <input  class="form-control" v-model.number="v_zone" >
                  </div>
              </div> 
              <div class="form-group">
                <label for="layout-type" class="control-label col-sm-3">value</label>
                  <div  class="col-sm-9">
                    <input  class="form-control" v-model="v_value.a" >
                  </div>
              </div> 
              <div class="form-group">
                <label for="layout-type" class="control-label col-sm-3">color</label>
                  <div  class="col-sm-9">
                    <input  class="form-control" v-model="v_color" >
                  </div>
              </div> 

               <div class="form-group">
                <button type="button" class="btn btn-primary" @click="modifyNodeValue" data-toggle="tooltip" data-placement="top" title="clear events">
                <i class="fa fa-trash" aria-hidden="true"></i>修改被选择节点值                      
                </button>
               </div>

            </div>
            

            
          </div>
      </div>

      <div class="panel panel-default">
          <div class="panel-heading">分割与合并</div>
          <div class="panel-body">
            <div class="form-horizontal">

              <div class="form-group">
                <label for="splitRate" class="control-label col-sm-3">分割比例</label>
                <div class="col-sm-7">
                  <input id="splitRate" class="form-control" type="range" min="1" max="99" v-model.number="splitRate">
                </div>
                <div class="col-sm-2">
                  <p>{{splitRate}}%</p>       
                </div> 
              </div>

              <div class="form-group">
                <label for="useSecondValue" class="control-label col-sm-6">合并时属性取后一行（列）</label>
                <div class="col-sm-3">
                  <input type="checkbox" id="useSecondValue" v-model="useSecondValue">
                </div>
                <div class="col-sm-3">
                  <p>{{useSecondValue?'是':'否'}}</p>       
                </div> 
              </div>               

             
              <button type="button" :disabled="!row_select" class="btn btn-default" @click="splitRow" data-toggle="tooltip" data-placement="top" title="clear events">
              <i class="fa fa-trash" aria-hidden="true"></i>行分割                      
              </button>

              <button type="button" :disabled="!row_select" class="btn btn-default" @click="joinRow" data-toggle="tooltip" data-placement="top" title="clear events">
              <i class="fa fa-trash" aria-hidden="true"></i>行合并                     
              </button>

              <button type="button" :disabled="!col_select" class="btn btn-default" @click="splitCol" data-toggle="tooltip" data-placement="top" title="clear events">
              <i class="fa fa-trash" aria-hidden="true"></i>列分割                      
              </button>

              <button type="button" :disabled="!col_select" class="btn btn-default" @click="joinCol" data-toggle="tooltip" data-placement="top" title="clear events">
              <i class="fa fa-trash" aria-hidden="true"></i>列合并                    
              </button>
              

            </div>
            

            
          </div>
      </div>

      <div class="panel panel-default">
          <div class="panel-heading">点操作</div>
          <div class="panel-body">
            <div class="form-horizontal">

              <div class="form-group">
                <label for="viewPoints" class="control-label col-sm-5">是否显示点</label>
                <div class="col-sm-4">
                  <input type="checkbox" id="viewPoints" v-model="viewPoints">
                </div>
                <div class="col-sm-3">
                  <p>{{viewPoints?'是':'否'}}</p>       
                </div> 
              </div>               

             
              <button type="button" :disabled="!row_select" class="btn btn-default" @click="splitRow" data-toggle="tooltip" data-placement="top" title="clear events">
              <i class="fa fa-trash" aria-hidden="true"></i>行分割                      
              </button>

              <button type="button" :disabled="!row_select" class="btn btn-default" @click="joinRow" data-toggle="tooltip" data-placement="top" title="clear events">
              <i class="fa fa-trash" aria-hidden="true"></i>行合并                     
              </button>

              <button type="button" :disabled="!col_select" class="btn btn-default" @click="splitCol" data-toggle="tooltip" data-placement="top" title="clear events">
              <i class="fa fa-trash" aria-hidden="true"></i>列分割                      
              </button>

              <button type="button" :disabled="!col_select" class="btn btn-default" @click="joinCol" data-toggle="tooltip" data-placement="top" title="clear events">
              <i class="fa fa-trash" aria-hidden="true"></i>列合并                    
              </button>
              

            </div>
            

            
          </div>
      </div>

    </div>
    <div class="col-md-8 panel panel-default">
      <D3grid ref="grid" class="grid" :viewPoints="viewPoints" :bgImg="bgImg" :viewBackgroud="viewBackgroud" :strokeWidth="vstrokeWidth" :Opacity="vOpacity" :operMode="operMode" :viewAttr="viewAttr" :marginX="Marginx" :marginY="Marginy" :data="griddata" :latticeWidth="latticeWidth"
       @clicked="onClick" ></D3grid>
    </div>
    <div class="col-md-2">
      <div class="panel panel-default">
          <div class="panel-heading">当前节点</div>
          <div class="panel-body log">
            <div v-for="e in events" :key="e.oper">
              <p><b>数据:</b> {{e.data}} <b>当前操作:</b>{{e.oper}}</p>
            </div>
          </div>
      </div>
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
      Marginx: 70,
      Marginy: 30,
      Opacity: 50,
      strokeWidth:20,
      currentLattices: null,
      currentIndex:null,
      currentOper:null,
      isLoading: false,
      events: [],
      latticeWidth: 10,

      v_zone:0,
      v_value:{'a':1},
      v_color:'#000000',

      splitRate:50,
      useSecondValue:false,
      viewBackgroud:true,
      bgImg:'bg.png',

      viewPoints:true,
    }
  },
  mounted() {
      this.getAllOrders()
  },
  components: {
    D3grid
  },
  methods: {
    do (action,...args) {
      if (this.currentLattices) {
        this.isLoading = true
        this.$refs['grid'][action](this.currentLattices,...args).then(() => { this.isLoading = false })
      }
    },

    modifyNodeValue () {
      // this.do('modifyCurAttr',{'zone':this.v_zone,'color':this.v_color,'value':this.v_value})
      this.do('modifyCurAttr',this.v_zone,this.v_color,this.v_value)
    },
    splitRow(){
      this.currentOper = null
      this.do('splitRow',this.currentIndex,this.splitRate/100)
    },
    joinRow(){
      this.currentOper = null
      this.do('joinRow',this.currentIndex,this.useSecondValue)
    },
    splitCol(){
      this.currentOper = null
      this.do('splitCol',this.currentIndex,this.splitRate/100)
    },
    joinCol(){
      this.currentOper = null
      this.do('joinCol',this.currentIndex,this.useSecondValue)
    },
    onClick (evt) {
      // console.log(evt)
      this.currentLattices = evt.elements
      this.currentIndex = evt.select_index
      this.currentOper = evt.oper
      // console.log(this.currentIndex)
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
  
  computed: {
    row_select() {
      return (this.currentOper == 'row_select') ? true:false
    },
    col_select() {
      return (this.currentOper == 'col_select') ? true:false
    },
    vOpacity() {
      return this.Opacity/100
    },
    vstrokeWidth() {
      return this.strokeWidth/20
    }
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
  height: 1700px;
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
