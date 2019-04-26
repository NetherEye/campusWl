<template>
  <div class="index">
    <div class="title">
      <div class="title_list">
        <span>报警时间</span>
        <el-date-picker v-model="value" type="datetime" value-format="yyyy-MM-dd" placeholder="请选择时间,可空">
        </el-date-picker>
        <span>姓名</span>
        <el-input v-model="input" placeholder="请输入姓名"></el-input>
        <span>卡号</span>
        <el-input v-model="input1" placeholder="请输入卡号,可空"></el-input>
        <span>围栏名称</span>
        <el-input v-model="input2" placeholder="请输入围栏名称,可空"></el-input>
        <el-button class="cha" @click="look">查询</el-button>
      </div>
    </div>
    <div class="table">
      <el-table ref="table" :data="tableData" tooltip-effect="dark" header-cell-class-name="tableTou"
        cell-class-name="tableRow">
        <el-table-column prop="studentName" label="姓名" align="center">
        </el-table-column>
        <el-table-column label="班级" align="center" show-overflow-tooltip prop="grade">
        </el-table-column>
        <el-table-column prop="belongId" label="卡号" align="center" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="fenceName" align="center" label="围栏名称" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="alarmTime" align="center" label="报警时间" show-overflow-tooltip>

        </el-table-column>
        <el-table-column align="center" label="操作" show-overflow-tooltip>
          <template slot-scope="scope">
            <span style="cursor: pointer;margin-right: 20px;" @click="clickUser(scope.$index,1,scope.row)">查看位置</span>
            <span style="cursor: pointer;" @click="clickUser(scope.$index,2,scope.row)">查看轨迹</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="fenye" v-if="total != 0">
      <div class="fenye_title">共 {{total}} 条数据 每页 {{pageSize}} 条数据 共 {{Math.floor(total/pageSize) + (total%pageSize !=
        0 ? 1 : 0)}} 页</div>
      <el-pagination :current-page.sync="currentPage" :page-size="pageSize" @current-change="handleCurrentChange"
        layout="prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
    <div class="el-title">
      <el-dialog :title="title" :visible.sync="dialogVisible" @closed="isClosed" width="1200px" center>
        <div class="tip">
          <div class="btn" @click="toggle">{{name}}</div>
          <baidu-map class="map" :center="center" :zoom="zoom" :scroll-wheel-zoom="true" @click="get">
            <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>
            <bm-polygon v-if="showWeilan" :path="polygonPath" strokeColor="rgb(255,102,153)" :strokeWeight="1" fillColor="rgb(255,102,153)"
              :stroke-opacity="0.2" :fill-opacity="0.2" :editing="false"></bm-polygon>
            <bm-marker :position="{lng:items.longitude,lat:items.latitude}"
              :icon="{url: require('../../../static/img/p_index/hz.png'), size: {width: 84, height: 84}}" :dragging="false"
              @click="getPoint"></bm-marker>
            <bm-info-window :position="postionMap" :show="show" @close="infoWindowClose" @open="infoWindowOpen" style="font-size: 14px">
              <p style="text-align: center;margin-bottom: 5px;">孩子信息</p>
              <p style="padding: 5px;border-bottom: 1px solid #d7d7d7;">姓名: {{studentName}}</p>
              <p style="padding: 5px;border-bottom: 1px solid #d7d7d7;">定位时间: {{time}}</p>
              <p style="padding: 5px">位置: {{site}}</p>
            </bm-info-window>
          </baidu-map>
        </div>
      </el-dialog>
    </div>
    <div class="el-title">
      <el-dialog :title="title1" :visible.sync="dialogVisible1" @closed="isClosed" width="1200px" center>
        <div class="tip">
          <div class="title_list btn1">
            <span>筛选</span>
            <el-select v-model="value0" placeholder="请选择">
              <el-option v-for="item in options" :key="item.contactNumber" :label="item.studentName" :value="item.contactNumber">
              </el-option>
            </el-select>
            <span>时间</span>
            <el-date-picker v-model="value1" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="请选择起始时间" clearable :editable="false"
       :picker-options="pickerOptions0">
            </el-date-picker>
            <div style="display: inline-block;width:23px;height:2px;background-color: #bababa;margin:0 -15px 5px 5px;"></div>
            <span>时间</span>
            <el-date-picker v-model="value2" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="请选择结束时间" clearable :editable="false"
       :picker-options="pickerOptions1">
            </el-date-picker>
            <el-button class="cha" @click="looks">查询</el-button>
            <el-button class="cha" @click="toggle1">播放</el-button>
          </div>
          <baidu-map class="map" :center="center" :zoom="15" :scroll-wheel-zoom="true">
            <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>
            <bm-polyline :path="path" stroke-color="blue" :stroke-opacity="0.5" :stroke-weight="2" :editing="false"></bm-polyline>
            <bml-lushu @start="changeBtnText('pause')" @stop="changeBtnText('play_arrow')" @pause="changeBtnText('play_arrow')"
              :path="path" :rotation="rotation" :content="content" :infoWindow="true" :speed="speed" :icon="icon" :play="play">
            </bml-lushu>
          </baidu-map>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import fetch from "@/assets/tools/fetch"
  import parents from "@/assets/api/parents"
  import {
    BmlLushu
  } from 'vue-baidu-map'
  export default {
    name: "p_baojing",
    components: {
      BmlLushu
    },
    data() {
      return {
        pickerOptions0: {
            disabledDate: (time) => {
                if (this.value2 != "" && this.value2 != null) {
                    return time.getTime() > Date.now() || time.getTime() > new Date(this.value2).getTime();
                } else {
                    return time.getTime() > Date.now();
                }

            }
        },
        pickerOptions1: {
            disabledDate: (time) => {
                return time.getTime() < new Date(this.value1).getTime() || time.getTime() > Date.now();
            }
        },
        center: {
          lng: 106.7091771,
          lat: 26.62990674
        },
        zoom: 15,
        studentName: '',
        time: '',
        site: '',
        items: [],
        title: "查看位置",
        name: "显示围栏",
        title1: "查看轨迹",
        btnText: 'play_arrow',
        path: [],
        rotation: false,
        play: false,
        content: '',
        speed: 500,
        icon: {
          url: '../../../static/img/p_index/hz.png',
          size: {
            width: 84,
            height: 84
          },
          opts: {
            anchor: {
              width: 27,
              height: 13
            }
          }
        },
        polygonPath: [{
            lng: 116.412732,
            lat: 39.911707
          },
          {
            lng: 116.39455,
            lat: 39.910932
          },
          {
            lng: 116.403461,
            lat: 39.921336
          }
        ],
        show: false,
        showWeilan: false,
        postionMap: {
          lng: 0,
          lat: 0
        },
        dialogVisible: false,
        dialogVisible1: false,
        pageSize: 10,
        total: 0,
        currentPage: 1,
        input: '',
        input1: '',
        input2: '',
        value0: '',
        value1: '',
        value2: '',
        value: '',
        options: [],
        tableData: [],
        ID:[]
      }
    },
    created() {
      this.getData()
    },
    methods: {
      isClosed(){
				this.show = false
				this.center.lat = 26.62990674
        this.center.lng = 106.7091771
				this.postionMap.lng = 0
				this.postionMap.lat = 0
				this.studentName = ''
				this.time = ''
				this.site = ''
        this.path = []
        this.value0 = ''
        this.value1 = ''
        this.value2 = ''
      },
      // 获取报警信息列表
      getData() {
        let par = {
          pageNumber: this.currentPage,
          pageSize: this.pageSize
        }
        fetch.get(parents.alarm, par, res => {
          if (res.code === 200) {
            this.tableData = res.data;
            this.total = res.total;
          } else {
              this.tableData = [];
              this.total = 0;
          }
        }, {target: '.el-table__body-wrapper'})
      },
      look() {
        if (this.input.length > 50) {
          this.$message({
            duration: "2000",
            message: "姓名长度错误！",
            type: "warning"
          });
          return
        }
        if (this.input2.length > 128) {
          this.$message({
            duration: "2000",
            message: "围栏名称长度错误！",
            type: "warning"
          });
          return
        }
        let par = {
          alarmTime: this.value,
          studentName: this.input,
          belongId: this.input1,
          fenceName: this.input2
        }
        fetch.get(parents.alarm, par, res => {
          if (res.code === 200) {
            this.$message({
              duration: "2000",
              message: "查询成功",
              type: "success"
            });
            this.tableData = res.data;
            this.total = res.total;
          } else {
            this.tableData = []
            this.total = 0
            this.$message({
              type: "warning",
              message: res.message,
            })
          }
        }, {target: '.el-table__body-wrapper'})
      },
      changeBtnText(val) {
        this.btnText = val
        if (val === 'play_arrow') {
          this.play = false
        }
      },
      toggle1() {
        if (this.path.length == 0) {
          this.$message({
            duration: "2000",
            message: "请先选择查询！",
            type: "warning"
          });
          return
        }
        this.play = !this.play
      },
      handleCurrentChange() {
        this.getData()
      },
      clickUser(index, id,fence) {
          fetch.get(parents.location+'/'+fence.belongId, {belongId:fence.belongId}, res => {
            if (res.code === 200) {
              this.items = res.data
              this.center.lng = res.data.longitude
              this.center.lat = res.data.latitude
              this.zoom = 15
            } else{
            this.$message({
              type: "warning",
              message: res.message,
            })
          }
          })
        if (id == '1') {
            setTimeout(() => {
              this.dialogVisible = true
            }, 500)
          // 显示围栏
          this.polygonPath = []
          fetch.get(parents.fence+'/'+fence.fenceId,{fenceId:fence.fenceId}, res => {
            this.ID = [{lng:res.data.fenceXYZs[0].longitude,lat:res.data.fenceXYZs[0].latitude}]
            res.data.fenceXYZs.forEach(v => {
              this.polygonPath.push({
                lng: v.longitude,
                lat: v.latitude
              })
            });
          })
        } else {
          this.options = []
            setTimeout(() => {
              this.dialogVisible1 = true
            }, 500)
          fetch.get(parents.student, '', res => {
            if (res.code === 200) {
              this.options = res.data;
            } else{
            this.$message({
              type: "warning",
              message: res.message,
            })
          }
          })
        }
      },
      looks() {
        this.path = []
        this.play = false
        if (this.value0 == '') {
          this.$message({
            duration: "2000",
            message: "请选择孩子",
            type: "warning"
          });
          return
        }
        if (this.value1 == '') {
          this.$message({
            duration: "2000",
            message: "请选择起始时间",
            type: "warning"
          });
          return
        }
        if (this.value2 == '') {
          this.$message({
            duration: "2000",
            message: "请选择结束时间",
            type: "warning"
          });
          return
        }
        if (this.value1 > this.value2) {
          this.$message({
            duration: "2000",
            message: "时间选择错误！",
            type: "warning"
          });
          return
        }
        let par = {
          belongId: this.value0,
          startTime: this.value1,
          endTime: this.value2
        }
        fetch.get(parents.track + '/' + this.value0, par, res => {
          if (res.code === 200) {
            res.data.forEach(v => {
              this.path.push({lat:v.latitude*1,lng:v.longitude*1})
            });
            this.$message({
              type: "success",
              message: '查询成功',
            })
          } else{
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
      getPoint() { //点击地图获取一些信息，
        let par = {
          belongId: this.items.belongId
        }
        fetch.get(parents.location+'/'+this.items.belongId, par, res => {
          if (res.code === 200) {
            this.postionMap.lng = res.data.longitude
            this.postionMap.lat = res.data.latitude
            this.studentName = res.data.studentName
            this.time = res.data.time
          } else{
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
        this.show = true
      },
      toggle() {
        this.showWeilan = !this.showWeilan
        if (this.name == "显示围栏") {
          this.name = "关闭围栏"
          this.center = this.ID[0]
          this.zoom = 17
        } else {
          this.name = "显示围栏"
          this.center = this.ID[0]
          this.zoom = 15
        }
      }
    }

  }

</script>
<style>
  .table .has-gutter .tableTou {
    height: 70px;
    background-color: #e6f0eb;
    color: #666;
    font-size: 18px;
  }

</style>
<style scoped>
  .index {
    margin: 20px;
    background: #fff;
    box-shadow: 0px 2px 9px 0px rgba(105, 105, 105, 0.07);
    border-radius: 3px;
  }

  .title {
    padding: 20px;
  }

  .title_list {
    padding-top: 20px;
    text-align: left;
    box-shadow: 0px 3px 8px 0px rgba(41, 48, 56, 0.18);
    margin-right: 20px;
  }

  .el-input {
    width: 200px;
    margin-bottom: 20px;
  }
  .el-select{
    width: 162px;
  }

  .title_list span {
    margin-left: 20px;
    margin-right: 5px;
    font-family: MicrosoftYaHei;
    font-size: 14px;
    color: #333333;
  }

  .cha {
    margin-left: 20px;
  }

  .title_list .el-button {
    width: 112px;
    height: 40px;
    font-size: 18px;
    background-color: #3ec09c;
    border-radius: 4px;
    color: #fff;
    position: relative;
    top: 3px;
    margin-bottom: 20px;
  }

  .el-table {
    color: #a4a8b3;
  }

  .warning {
    background-color: #e6c824;
    color: #fff;
  }

  .success {
    background-color: #08b065;
    color: #fff;
  }

  .tip {
    height: 650px;
    position: relative;
  }

  .tip .btn {
    position: absolute;
    top: 27px;
    left: 31px;
    width: 112px;
    height: 40px;
    line-height: 40px;
    background-color: #3ec09c;
    border-radius: 4px;
    z-index: 1000;
    color: #fff;
    text-align: center;
    cursor: pointer;
  }

  .tip .btn1 {
    position: absolute;
    top: 20px;
    left: 20px;
    z-index: 1000;
    background: #fff;
    padding-right: 20px;
  }

</style>
