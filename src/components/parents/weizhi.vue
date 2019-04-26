<template>
  <div id="myapp">
    <baidu-map class="map" :center="center" :zoom="zoom" @ready="handler" :scroll-wheel-zoom="true" @click="get">
      <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>
      <bm-polygon v-for="(item, index) in polygonPath" :key="index+1" v-if="showWeilan" :path="pen(item.fenceXYZs)"
        strokeColor="rgb(255,102,153)" :stroke-weight="1" fillColor="rgb(255,102,153)" :stroke-opacity="0.2"
        :fill-opacity="0.2" :editing="false"></bm-polygon>
      <bm-marker v-for="(item,index) in items" :key="index" :position="{lng:item.longitude,lat:item.latitude}" :icon="{url: require('../../../static/img/p_index/hz.png'), size: {width: 84, height: 84}}"
        :dragging="false" @click="getPoint(item)"></bm-marker>
      <bm-info-window :position="postionMap" :show="show" @close="infoWindowClose" @open="infoWindowOpen" style="font-size: 14px">
        <p style="text-align: center;margin-bottom: 5px;">孩子信息</p>
        <p style="padding: 5px;border-bottom: 1px solid #d7d7d7;">姓名: {{studentName}}</p>
        <p style="padding: 5px;border-bottom: 1px solid #d7d7d7;">定位时间: {{time}}</p>
        <p style="padding: 5px;border-bottom: 1px solid #d7d7d7;">位置: {{site}}</p>
        <el-button size="mini" style="display: block;background-color: #08b065;color: #fff;margin: 10px auto 0" @click="go">查看轨迹</el-button>
      </bm-info-window>
    </baidu-map>
    <ul>
      <li @click="handler"><img src="../../../static/img/p_index/sx.png">刷新</li>
      <li @click="toggle"><img src="../../../static/img/p_index/wl.png">{{name}}</li>
      <li @click="jt"><img src="../../../static/img/p_index/jt.png">启动监听</li>
      <li @click="hj"><img src="../../../static/img/p_index/hj.png">反向呼叫</li>
    </ul>
    <div class="el-title">
      <el-dialog title="启动监听" :visible.sync="dialogVisible" width="800px" center>
        <div class="tip">
          <div class="tip_time">
            <span>请选择监听的孩子</span>&nbsp;&nbsp;
            <el-select v-model="value" placeholder="请选择">
              <el-option v-for="item in options" :key="item.contactNumber" :label="item.studentName" :value="item.contactNumber">
              </el-option>
            </el-select>
          </div>
          <div class="tip_conter">
            <img src="../../../static/img/p_index/ts.png">
            <p>为确保安全，监听为单向通讯，对方将无法接听您的信息请确保您的手机在身边，并保持通讯畅通</p>
          </div>
          <div class="btn">
            <el-button class="jt" @click="listen">监听</el-button>
            <el-button class="qx" @click="dialogVisible = false">取消</el-button>
          </div>
        </div>
      </el-dialog>
    </div>
    <div class="el-title">
      <el-dialog title="反向呼叫" :visible.sync="dialogVisible1" width="800px" center>
        <div class="tip">
          <div class="tip_time">
            <span>请选择呼叫的孩子</span>&nbsp;&nbsp;
            <el-select v-model="value" placeholder="请选择">
              <el-option v-for="item in options" :key="item.contactNumber" :label="item.studentName" :value="item.contactNumber">
              </el-option>
            </el-select>
          </div>
          <div class="btn">
            <el-button class="jt" @click="call">呼叫</el-button>
            <el-button class="qx" @click="dialogVisible1 = false">取消</el-button>
          </div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import fetch from "@/assets/tools/fetch"
  import parents from "@/assets/api/parents"
  export default {
    data() {
      return {
        postionMap: {
          lng: '',
          lat: ''
        },
        studentName: '',
        time: '',
        site: '工业园区',
        name: "显示围栏",
        polygonPath: [],
        center: {
          lng: 106.7091771,
          lat: 26.62990674
        },
        zoom: 15,
        show: false,
        showWeilan: false,
        items: [],
        dialogVisible: false,
        dialogVisible1: false,
        value: '',
        options: []
      }
    },
    created() {
      
    },
    methods: {
      handler ({BMap, map}) {
        fetch.get(parents.location, '', res => {
          if (res.code === 200) {
            this.items = res.data
            this.center.lng = res.data[0].longitude
            this.center.lat = res.data[0].latitude
            this.zoom = 15
            this.$message({
              duration: "2000",
              message: "更新成功",
              type: "success"
            });
          }else{
            this.$message({
              type: "warning",
              message: res.message,
            })
          }
        })
      },
      pen(a) {
        const b = []
        a.forEach(v => {
          b.push({
            lng: v.longitude,
            lat: v.latitude
          })
        });
        return b
      },
      jt() {
        this.dialogVisible = true
        fetch.get(parents.student, '', res => {
          if (res.code === 200) {
            this.options = res.data;
          }else{
            this.$message({
              type: "warning",
              message: res.message,
            })
          }
        })
      },
      hj() {
        this.dialogVisible1 = true
        fetch.get(parents.student, '', res => {
          if (res.code === 200) {
            this.options = res.data;
          }else{
            this.$message({
              type: "warning",
              message: res.message,
            })
          }
        })
      },
      listen() {
        let par = {
          belongId: this.value
        }
        fetch.get(parents.listen, par, res => {
          if (res.code === 200) {
            this.$message({
              duration: "2000",
              message: res.message,
              type: "success"
            });
            setTimeout(() => {
              this.dialogVisible = false
            }, 500)
          }else{
            this.$message({
              type: "warning",
              message: res.message,
            })
          }
        })
      },
      call() {
        let par = {
          belongId: this.value
        }
        fetch.get(parents.call, par, res => {
          if (res.code === 200) {
            this.$message({
              duration: "2000",
              message: res.message,
              type: "success"
            });
            setTimeout(() => {
              this.dialogVisible1 = false
            }, 500)
          }else{
            this.$message({
              type: "warning",
              message: res.message,
            })
          }
        })
      },
      get(e) {
        let geocoder = new BMap.Geocoder(); //创建地址解析器的实例
        geocoder.getLocation(e.point, rs => {
          this.site = rs.address;
        });
      },
      getPoint(item) { //点击地图获取一些信息，
        let par = {
          belongId: item.belongId
        }
        fetch.get(parents.location + '/' + item.belongId, par, res => {
          if (res.code === 200) {
            this.postionMap.lng = res.data.longitude
            this.postionMap.lat = res.data.latitude
            this.studentName = res.data.studentName
            this.time = res.data.time
          }else{
            this.$message({
              type: "warning",
              message: res.message,
            })
          }
        })
        setTimeout(() => {
          this.show = true
        }, 500)
      },
      infoWindowClose() {
        this.show = false
      },
      infoWindowOpen() {
        setTimeout(() => {
          this.show = true
        }, 500)
      },
      toggle() {
        this.showWeilan = !this.showWeilan
        if (this.name == "显示围栏") {
          this.name = "关闭围栏"
          fetch.get(parents.fenceShow, '', res => {
            this.polygonPath = res.data
          })
        } else {
          this.name = "显示围栏"
        }
      },
      go() {
        this.$router.push({
          path: '/guiji'
        });
      }
    }
  }

</script>
<style scoped>
  #myapp {
    height: 95%;
    margin: 20px;
  }

  .map {
    width: 100%;
    height: 100%;
  }

  .tip {
    text-align: center;
    padding: 20px 0 30px;
  }

  .tip_time {
    margin-bottom: 30px;
  }

  .tip_conter p {
    width: 460px;
    font-size: 18px;
    line-height: 2;
    color: #999999;
    margin: 30px auto 20px;
  }

  .jt {
    width: 90px;
    height: 30px;
    line-height: 0;
    background-color: #3ec09c;
    color: #fff;
    margin-right: 20px;
  }

  .qx {
    width: 90px;
    height: 30px;
    line-height: 0;
    background-color: #3ec09c;
    color: #fff;
  }

  ul {
    position: absolute;
    top: 78px;
    left: 100px;
    display: flex;
    align-items: center;
    justify-content: space-around;
    text-align: center;
    width: 587px;
    height: 32px;
    line-height: 32px;
    padding: 10px 0;
    background-color: #ffffff;
    box-shadow: 0px 3px 8px 0px rgba(41, 48, 56, 0.18);
  }

  li {
    width: 100%;
    border-right: 1px solid #d7d7d7;
    font-size: 18px;
    color: #6a6c6f;
    cursor: pointer;
  }

  li:last-child {
    border-right: none;
  }

  ul li img {
    max-width: 100%;
    margin-right: 10px;
  }

</style>
