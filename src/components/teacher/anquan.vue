<template>
  <div class="wrap">
    <div class="header">
      <div class="header_content">
        <div class="hc_input">
          <span style="font-size: 14px;font-family: MicrosoftYaHei;color: #333333;width: 40px;line-height: 40px">姓名</span>
          <el-input v-model="input1" placeholder="请输入姓名"></el-input>
        </div>

        <div class="hc_input">
          <span style="font-size: 14px;font-family: MicrosoftYaHei;color: #333333;width: 40px;line-height: 40px">年级</span>
          <el-select v-model="value1" clearable placeholder="请选择" @change="changeSelect(value1)">
            <el-option v-for="item in options1" :key="item.gradeId" :label="item.studyPhase + item.gradeName" :value="item.gradeId">
            </el-option>
          </el-select>
        </div>
        <div class="hc_input">
          <span style="font-size: 14px;font-family: MicrosoftYaHei;color: #333333;width: 40px;line-height: 40px">班级</span>
          <el-select v-model="value2" clearable placeholder="请选择">
            <el-option v-for="item in options2" :key="item.classId" :label="item.className" :value="item.classId">
            </el-option>
          </el-select>
        </div>
        <el-button type="success" style="margin-left: 20px" @click="findCx">查询</el-button>
      </div>
    </div>
    <div class="tableData">
      <el-table ref="singleTable" :data="tableData" highlight-current-row style="width: 100%">
        <el-table-column type="index" :index="indexMethod" label="序号" width="100px" align="center">
        </el-table-column>
        <el-table-column property="studentName" label="姓名" align="center">
        </el-table-column>

        <el-table-column label="班级" align="center">
          <template slot-scope="scope">
            <div>{{scope.row.studyPhase + scope.row.gradeName + scope.row.className}}</div>
          </template>
        </el-table-column>

        <el-table-column property="contactNumber" align="center" label="手机号">
        </el-table-column>
        <el-table-column property="power" align="center" label="电量">
        </el-table-column>
        <el-table-column property="status" align="center" label="设备状态">
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <div>
              <span style="cursor: pointer;margin-right: 20px;color: rgb(62, 192, 156);" @click="clickUser(scope.$index,1,scope.row)">查看位置</span>
              <span style="cursor: pointer;color: rgb(62, 192, 156);" @click="clickUser(scope.$index,2,scope.row)">查看轨迹</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="fenye" v-if="total != 0">
        <div class="fenye_title">共 {{total}} 条数据 每页 {{pageSize}} 条数据 共 {{Math.floor(total/pageSize) + (total%pageSize
          != 0 ? 1 : 0)}} 页</div>
        <el-pagination :current-page.sync="pageNumber" :page-size="pageSize" @current-change="handleCurrentChange"
          layout="prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </div>
    <div class="el-title">
      <el-dialog :title="title" :visible.sync="dialogVisible" @closed="close" width="80%" center>
        <div class="tip">
          <baidu-map class="map" :center="center" :zoom="zoom" :scroll-wheel-zoom="true" @click="get">
            <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>
            <bm-marker :position="{lng:items.longitude,lat:items.latitude}" :icon="{url: require('../../../static/img/p_index/hz.png'), size: {width: 84, height: 84}}"
              :dragging="false" @click="getPoint"></bm-marker>
            <bm-info-window :position="postionMap" :show="show" @close="infoWindowClose" @open="infoWindowOpen" style="font-size: 14px">
              <p style="text-align: center;margin-bottom: 5px;">孩子信息</p>
              <p style="padding: 5px;border-bottom: 1px solid #d7d7d7;">姓名: {{studentName}}</p>
              <p style="padding: 5px;border-bottom: 1px solid #d7d7d7;">定位时间: {{time}}</p>
              <p style="padding: 5px;border-bottom: 1px solid #d7d7d7;">位置: {{site}}</p>
            </bm-info-window>
          </baidu-map>
        </div>
      </el-dialog>
    </div>
    <div class="el-title">
      <el-dialog :title="title1" :visible.sync="dialogVisible1" @closed="close" width="80%" center>
        <div class="tip">
          <div class="title_list btn1">
            <span>时间</span>
            <el-date-picker v-model="value11" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="请选择起始时间" clearable :editable="false" :picker-options="pickerOptions0">
            </el-date-picker>
            <div style="display: inline-block;width:23px;height:2px;background-color: #bababa;margin:0 -15px 5px 5px;"></div>
            <span>时间</span>
            <el-date-picker v-model="value12" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="请选择结束时间" clearable :editable="false" :picker-options="pickerOptions1">
            </el-date-picker>
            <el-button class="cha" @click="looks">查询</el-button>
            <el-button class="cha" @click="toggle1">播放</el-button>
          </div>
          <baidu-map class="map" :center="center" :zoom="17" :scroll-wheel-zoom="true">
            <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>
            <bm-polyline :path="path" stroke-color="blue" :stroke-opacity="0.5" :stroke-weight="2" :editing="false"></bm-polyline>
            <bml-lushu @start="changeBtnText('pause')" @stop="changeBtnText('play_arrow')" @pause="changeBtnText('play_arrow')"
              :path="path" :rotation="rotation" :content="content" :infoWindow="true" :speed="speed" :icon="icon" :play="play">
            </bml-lushu>
          </baidu-map>
        </div>
      </el-dialog>
    </div>
    <!--弹窗3-->
    <div class="el-title">
      <el-dialog :title="stuName" :visible.sync="dialogVisible3" width="800px" margin-top='30vh' center>
        <div class="tips">
          <el-row>
            <el-col :span="12">
              <div class="infList">
                <span>学生名字</span>
                <el-input placeholder="请输入内容" v-model="input11" :disabled="true">
                </el-input>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="infList">
                <span>手机号码</span>
                <el-input placeholder="请输入内容" v-model="input12" :disabled="true">
                </el-input>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <div class="infList">
                <span>学校</span>
                <el-input placeholder="请输入内容" v-model="input13" :disabled="true">
                </el-input>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="infList">
                <span>班级</span>
                <el-input placeholder="请输入内容" v-model="input14" :disabled="true">
                </el-input>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <div class="infList">
                <span>家长名字</span>
                <el-input placeholder="请输入内容" v-model="input15" :disabled="true">
                </el-input>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="infList">
                <span>是否激活</span>
                <el-input placeholder="请输入内容" v-model="input16" :disabled="true">
                </el-input>
              </div>
            </el-col>
          </el-row>
        </div>
        <div class="btn" style="text-align: center;">
          <el-button type="success" @click="active">激活</el-button>
        </div>
        <div style="height: 30px"></div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import fetch from '@/assets/tools/fetch'
  import allApi from "@/assets/api/teacher"
  import parents from "@/assets/api/parents"
  import {
    BmlLushu
  } from 'vue-baidu-map'
  export default {
    name: "t_anquan",
    components: {
      BmlLushu
    },
    data() {
      return {
          pickerOptions0: {
              disabledDate: (time) => {
                  if (this.value12 != "" && this.value12 != null) {
                      return time.getTime() > Date.now() || time.getTime() > new Date(this.value12).getTime();
                  } else {
                      return time.getTime() > Date.now();
                  }

              }
          },
          pickerOptions1: {
              disabledDate: (time) => {
                  return time.getTime() < new Date(this.value11).getTime() || time.getTime() > Date.now();
              }
          },
        stuID: '',
        stuName: '',
        dialogVisible3: false,
        options1: '',
        options2: '',
        value1: '',
        value2: '',
        value11 :'',
        value12 :'',
        input1: '',
        input11: '',
        input12: '',
        input13: '',
        input14: '',
        input15: '',
        input16: '',
        input2: '',
        input3: '',
        input4: '',
        tableData: [],
        total: 0,
        title: "查看位置",
        name: "显示围栏",
        title1: "查看轨迹",
        name1: "播放",
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
        center: {
          lng: 106.7091771,
          lat: 26.62990674
        },
        postionMap: {
          lng: 106.7091771,
          lat: 26.62990674
        },
        studentName: '',
        time: '',
        site: '工业园区',
        zoom: 13,
        items: '',
        show: false,
        showWeilan: false,
        dialogVisible: false,
        dialogVisible1: false,
        pageNumber: 1,
        pageSize: 10,
        classId: ''
      }
    },
    created() {
      this.gerGrade()
      this.getData()
    },
    methods: {
      close(){
        this.path = []
        this.items = ''
				this.center.lat = 26.62990674
				this.center.lng = 106.7091771
				this.postionMap.lng = 0
				this.postionMap.lat = 0
				this.studentName = ''
				this.time = ''
				this.site = ''
				this.value11 = ''
        this.value12 = ''
        this.play = false
      },
      active() {
        let a = {
          studentId: this.stuID
        }
        fetch.post(allApi.jh, a, res => {
          if (res.code == 200) {
            this.$message({
              message: res.message,
              type: 'success'
            });
            this.getData()
            this.dialogVisible3 = false
          }else{
            this.$message({
              type: "warning",
              message: res.message,
            })
          }

        })
      },
      findUser(index, row) {
        let a = {
          id: row.unionId
        }
        fetch.get(allApi.student + "/" + row.unionId, a, res => {
          this.stuName = res.data.studentName
          this.input11 = res.data.studentName
          this.input12 = res.data.contactNumber
          this.input13 = res.data.schoolName
          this.input14 = res.data.gradeName + res.data.className
          this.input15 = res.data.parentName
          this.stuID = res.data.unionId
          if (res.data.activeStatus == 2 || res.data.activeStatus == 3) {
            this.input16 = '未激活'
          } else {
            this.input16 = '已激活'
          }
        })
        this.dialogVisible3 = true
      },
      indexMethod(index) {
        return index + 1 + (this.pageNumber - 1) * this.pageSize;
      },
      changeSelect(val) {
        if (val === '') {
          return false
        }
        this.options2 = []
        this.getClass(val)
        this.value2 = ''
      },
      getClass(val) {
        let a = {
          gradeId: val
        }
        fetch.get(allApi.class, a, res => {
          if (res.code == 200) {
            this.options2 = res.data
          } else if (res.code == 201) {
            return
          }else{
            this.$message({
              type: "warning",
              message: res.message,
            })
          }
        })
      },
      gerGrade() {
        fetch.get(allApi.grade, '', res => {
          this.options1 = res.data
        })
      },
      findCx() {
          this.pageNumber = 1
          this.getData()
      },
      getData() {
        let a = {
          studentName: this.input1,
          studentId: this.input2,
          contactNumber: this.input3,
          classId: this.value2,
          pageNumber: this.pageNumber,
          gradeId: this.value1,
          pageSize: this.pageSize
        }

        fetch.get(allApi.student, a, res => {

          if (res.code == 200) {
            this.tableData = res.data
            this.total = res.total
          } else {
            this.tableData = []
            this.total = 0
            this.$message({
              type: "warning",
              message: res.message,
            })
  
          }

        }, {
          target: '.el-table__body-wrapper'
        })
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
      clickUser(index, id, tel) {
        if (tel.activeStatus === 1 ) {
          fetch.get(parents.location + '/' + tel.contactNumber, '', res => {
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
            },500)
          } else {
            setTimeout(() => {
              this.dialogVisible1 = true
            },500)
          }
        } else {
          this.$message({
            duration: "2000",
            message: "尚未激活，请激活成功再次查看",
            type: "warning"
          });
        }


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
        fetch.get(parents.location + '/' + this.items.belongId, par, res => {
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
      looks() {
        if (this.value11 > this.value12){
          this.$message({
            message: "开始时间大于结束时间",
            type: "warning"
          });
          return
        }
        this.path = []
        if (this.value11 == '') {
          this.$message({
            duration: "2000",
            message: "请选择起始时间",
            type: "warning"
          });
          return
        }
        if (this.value12 == '') {
          this.$message({
            duration: "2000",
            message: "请选择结束时间",
            type: "warning"
          });
          return
        }
        let par = {
          belongId: this.items.belongId,
          startTime: this.value11,
          endTime: this.value12
        }
        fetch.get(parents.track + '/' + this.items.belongId, par, res => {
          if (res.code === 200) {
            res.data.forEach(v => {
              this.path.push({lat:v.latitude*1,lng:v.longitude*1})
            });
          } else{
            this.$message({
              type: "warning",
              message: res.message,
            })
          }
        })
      },
      infoWindowClose() {
        this.show = false
      },
      infoWindowOpen() {
        this.show = true
      }
    }
  }

</script>

<style scoped>
  .el-title1 {
    height: 600px;
  }

  .infList {

    margin-top: 30px;
    display: flex;

  }

  .infList span {
    text-align: center;
    line-height: 40px;
    width: 100px;
  }

  .hc_input {
    display: flex;
    margin-left: 20px;
  }

  .tip {
    height: 600px;
    position: relative;
  }

  .tips {
    height: 240px;
    position: relative;
  }

  .tip .btn {
    position: absolute;
    top: 27px;
    left: 31px;
    width: 112px;
    height: 40px;
    line-height: 40px;
    background-color: #08b065;
    border-radius: 4px;
    z-index: 1000;
    color: #fff;
    text-align: center;
    cursor: pointer;
  }
  .title_list {
    padding-top: 20px;
    text-align: left;
    box-shadow: 0px 3px 8px 0px rgba(41, 48, 56, 0.18);
    margin-right: 20px;
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
    background-color: #08b065;
    border-radius: 4px;
    color: #fff;
    position: relative;
    top: 3px;
    margin-bottom: 20px;
  }

.tip .btn1 {
    position: absolute;
    top: 20px;
    left: 20px;
    z-index: 1000;
    background: #fff;
    padding-right: 20px;
  }
  .header {
    width: 97%;
    background-color: #fff;
    height: 118px;
    margin: 0 auto;
    margin-top: 21px;
  }

  .wrap {
    width: 97%;
    background-color: #fff;
    margin: 0 auto;
  }

  .header_content {
    width: 98%;
    height: 76px;
    background-color: #ffffff;
    box-shadow: 0px 3px 8px 0px rgba(41, 48, 56, 0.18);
    position: relative;
    margin: 0 auto;
    top: 21px;
    display: flex;
    align-items: center;
  }

</style>
