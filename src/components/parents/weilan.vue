<template>
  <div class="index">
    <div class="title">
      <div class="title_list">
        <span>选择围栏</span>
        <el-input v-model="fencename" placeholder="请输入网络名称"></el-input>
        <span>围栏创建时间</span>
        <el-date-picker v-model="time" type="date" value-format="yyyy-MM-dd" placeholder="请选择时间">
        </el-date-picker>
        <span>报警方式</span>
        <el-select v-model="mode" placeholder="请选择">
          <el-option v-for="item in chaxun" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        <el-button class="cha" @click="look">查询</el-button>
        <el-button @click="dialog">添加围栏</el-button>
      </div>
    </div>
    <div class="el-title">
      <el-dialog :title="name" :visible.sync="dialogVisible" @closed="closeAd" width="1200px" center>
        <div class="tip">
          <div class="tip1">
            <span>围栏名称</span>
            <el-input v-model="input" placeholder="请输入内容"></el-input>
            <span>报警方式</span>
            <el-select v-model="value1" placeholder="请选择" style="width:151px">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
            <span>围栏报警</span>
            <el-select v-model="value" placeholder="请选择" style="width:151px">
              <el-option v-for="item in options1" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
            <span>报警时间段</span>
            <el-time-select placeholder="起始时间" v-model="value2" :picker-options="{
                start: '00:00',
                step: '00:05',
                end: '23:59',
              }">
            </el-time-select>
            <div style="display: inline-block;width:23px;height:2px;background-color: #bababa;margin:0 -15px 5px 5px;position: relative;top: 20px;"></div>
            <span>时间</span>
            <el-time-select placeholder="结束时间" v-model="value3" :picker-options="{
                start: '00:00',
                step: '00:05',
                end: '23:59',
                minTime: value2
              }">
            </el-time-select>
          </div>
          <div class="tip2">
            <div class="tip21">围栏描述</div>
            <div class="tip22">
              <el-input v-model="input1" style="width:100%" placeholder="请输入内容"></el-input>
            </div>
          </div>
          <div class="tip2">
            <div style="height: 400px;width: 85px;text-align: center;">位置选择</div>
            <div style="width:100%;height: 400px;border: 1px solid #eee;position: relative;">
              <baidu-map class="map" :center="center" :zoom="zoom" :scroll-wheel-zoom="true" id="map" @click="addP">
                <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>
                <bm-polygon @lineupdate="updatePolygonPath" :path="polygonPath" stroke-color="blue" :stroke-opacity="0.5"
                  :stroke-weight="2" :editing="true" :scroll-wheel-zoom="true"></bm-polygon>

                <bm-point-collection :points="points" shape="BMAP_POINT_SHAPE_WATERDROP" color="red" size="BMAP_POINT_SIZE_SMALL"
                  @click="clickHandler"></bm-point-collection>

              </baidu-map>
              <el-button size="mini" type="warning" style="position: absolute;top:20px;left:20px" @click="clear">清除</el-button>
              <el-button size="mini" type="info" style="position: absolute;top:20px;left:80px" @click="prve">上一步</el-button>
            </div>
          </div>
          <div class="tip3">
            <div>
              <span>添加孩子</span>
              <el-select v-model="value4" multiple placeholder="请选择" @change="change(value4)">
                <el-option v-for="item in options2" :key="item.unionId" :label="item.studentName" :value="item.unionId">
                </el-option>
              </el-select>
            </div>
            <div style="flex:1;">
              <div class="tip2">
                <div class="tip21">已选孩子</div>
                <div class="tip22">
                  <textarea readonly style="width:97%;outline:none;height: 95px;border-radius: 4px;color:#606266;padding:10px;font-size:14px;font-family: Arial;border-color: rgb(220, 223, 230);"
                    v-model="value5"></textarea>
                </div>
              </div>
            </div>
          </div>
          <div style="text-align: center;margin: 20px auto;">
            <el-button v-if="condition" :loading="saveLoading" class="success" @click="save">保存</el-button>
            <el-button v-else :loading="addLoading" class="success" @click="addData">创建网络</el-button>
          </div>
        </div>
      </el-dialog>
    </div>
    <div class="table">
      <el-table ref="table" :data="tableData" tooltip-effect="dark" header-cell-class-name="tableTou" cell-class-name="tableRow">
        <el-table-column prop="fenceName" label="围栏名称" align="center">
        </el-table-column>
        <el-table-column label="创建时间" align="center" show-overflow-tooltip prop="createTime">
        </el-table-column>
        <el-table-column prop="alarmTypeValue" label="报警方式" align="center" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="fenceDescribe" align="center" label="网络描述" show-overflow-tooltip>
        </el-table-column>
        <el-table-column align="center" label="孩子" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-for="(item, index) in scope.row.fenceStudents" :key="index">{{item.studentName}}{{' '}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" show-overflow-tooltip>
          <template slot-scope="scope">
            <span style="cursor: pointer;margin-right: 20px;" @click="clickUser(scope.$index)">删除</span>
            <span style="cursor: pointer;" @click="dialog(scope.$index)">修改</span>
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
  </div>
</template>

<script>
  import fetch from "@/assets/tools/fetch"
  import parents from "@/assets/api/parents"
  export default {
    name: "p_weilan",
    data() {
      return {
        name: '添加围栏',
        id: 1,
        points: [], // 海量点 围栏点标记
        unionId: [],
        center: {
          lat: '26.62990674',
          lng: '106.70917710'
        },
        zoom: 16,
        dialogVisible: false,
        condition: false,
        addLoading:false,
        saveLoading:false,
        pageSize: 10,
        total: 0,
        currentPage: 1,
        fencename: '',
        time: '',
        mode: '',
        input: '',
        value1: '',
        value: '',
        value2: '',
        value3: '',
        value4: [],
        value5: '',
        input1: '',
        input2: '',
        chaxun: [{
          value: '',
          label: '全部'
        }, {
          value: 0,
          label: '短信通知'
        }, {
          value: 1,
          label: '消息通知'
        }],
        options: [{
          value: 0,
          label: '短信通知'
        }, {
          value: 1,
          label: '消息通知'
        }],
        options1: [{
          value: 0,
          label: '进围栏报警'
        }, {
          value: 1,
          label: '出围栏报警'
        }],
        options2: [],
        tableData: [],
        polygonPath: []
      }
    },
    created() {
      this.getData()
    },
    methods: {
      closeAd() {
        this.addLoading = false
        this.saveLoading = false
        this.input = ''
        this.input1 = ''
        this.value2 = ''
        this.value3 = ''
        this.value5 = ''
        this.options2 = ''
        this.value1 = ''
        this.value4 = []
        this.value = ''
        this.polygonPath = []
        this.points = []
      },
      //添加围栏
      addData() {
        var regEn = /[`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘’，。、]/im;

        if (this.input.length >= 50 || regEn.test(this.input)) {
          this.$message({
            type: 'warning',
            message: '请添加正确的围栏名称！'
          })
          return
        }
        if (this.input1.length >= 128 || regEn.test(this.input1)) {
          this.$message({
            type: 'warning',
            message: '请添加正确的围栏描述！'
          })
          return
        }
        if (this.input == '') {
          this.$message({
            duration: "2000",
            message: "请添加围栏名称",
            type: "warning"
          });
          return
        }
        if (this.input1 == '') {
          this.$message({
            duration: "2000",
            message: "请添加围栏描述",
            type: "warning"
          });
          return
        }
        if (this.value === '') {
          this.$message({
            duration: "2000",
            message: "请选择围栏报警",
            type: "warning"
          });
          return
        }
        if (this.value1 === '') {
          this.$message({
            duration: "2000",
            message: "请选择报警方式",
            type: "warning"
          });
          return
        }
        if (this.value2 == '') {
          this.$message({
            duration: "2000",
            message: "请选择开始时间",
            type: "warning"
          });
          return
        }
        if (this.value3 == '') {
          this.$message({
            duration: "2000",
            message: "请选择结束时间",
            type: "warning"
          });
          return
        }
        if (this.value4 == '') {
          this.$message({
            duration: "2000",
            message: "请添加孩子",
            type: "warning"
          });
          return
        }
        if (this.polygonPath == '') {
          this.$message({
            duration: "2000",
            message: "请添加围栏",
            type: "warning"
          });
          return
        }
        let objtwo = []
        this.value4.forEach(v => {
          this.options2.forEach((k,i) => {
            if (v == k.unionId)
              objtwo[i] = {
                studentName: k.studentName,
                studentId: v
              }
          })
        });
        let objone = []
        this.polygonPath.forEach((a, i) => {
            objone[i] = {
              latitude: a.lat,
              longitude: a.lng
            }
          })
        this.addLoading = true
        let par = {
          fenceName: this.input,
          fenceDescribe: this.input1,
          fenceAlarm: parseInt(this.value),
          alarmType: parseInt(this.value1),
          alarmStart: this.value2,
          alarmEnd: this.value3,
          fenceStudent: JSON.stringify(objtwo),
          fenceXYZ: JSON.stringify(objone)
        }
        fetch.post(parents.fence, par, res => {
          if (res.code === 200) {
            this.$message({
              duration: "2000",
              message: "添加成功",
              type: "success"
            });
            this.getData()
            setTimeout(() => {
              this.dialogVisible = false
              this.addLoading = false
            }, 500)
          }else{
              this.addLoading = false
            this.$message({
              type: "warning",
              message: res.message,
            })
          }
        })
      },
      change(id) {
        this.options2.forEach(v => {
          if (id.length == 0) {
            this.value5 = ''
          }
          if (id == v.unionId) {
            this.value5 += ' ' + v.studentName
          }
        })
      },
      save() {
        var regEn = /[`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘’，。、]/im;

        if (this.input.length >= 50 || regEn.test(this.input)) {
          this.$message({
            type: 'warning',
            message: '请添加正确的围栏名称！'
          })
          return
        }
        if (this.input1.length >= 128 || regEn.test(this.input1)) {
          this.$message({
            type: 'warning',
            message: '请添加正确的围栏描述！'
          })
          return
        }
        if (this.input == '') {
          this.$message({
            duration: "2000",
            message: "请添加围栏名称",
            type: "warning"
          });
          return
        }
        if (this.input1 == '') {
          this.$message({
            duration: "2000",
            message: "请添加围栏描述",
            type: "warning"
          });
          return
        }
        if (this.value === '') {
          this.$message({
            duration: "2000",
            message: "请选择围栏报警",
            type: "warning"
          });
          return
        }
        if (this.value1 === '') {
          this.$message({
            duration: "2000",
            message: "请选择报警方式",
            type: "warning"
          });
          return
        }
        if (this.value2 == '') {
          this.$message({
            duration: "2000",
            message: "请选择开始时间",
            type: "warning"
          });
          return
        }
        if (this.value3 == '') {
          this.$message({
            duration: "2000",
            message: "请选择结束时间",
            type: "warning"
          });
          return
        }
        if (this.value4.length === 0) {
          this.$message({
            duration: "2000",
            message: "请添加孩子",
            type: "warning"
          });
          return
        }
        if (this.polygonPath == '') {
          this.$message({
            duration: "2000",
            message: "请添加围栏",
            type: "warning"
          });
          return
        }
        let objtwo = []
        this.value4.forEach(v => {
          this.options2.forEach((k,i) => {
            if (v == k.unionId)
              objtwo[i] = {
                studentName: k.studentName,
                studentId: v
              }
          })
        });
        let objone = []
        this.polygonPath.forEach((a, i) => {
            objone[i] = {
              latitude: a.lat,
              longitude: a.lng
            }
          })
        this.saveLoading = true
        let par = {
          id: this.id,
          fenceName: this.input,
          fenceDescribe: this.input1,
          fenceAlarm: parseInt(this.value),
          alarmType: parseInt(this.value1),
          alarmStart: this.value2,
          alarmEnd: this.value3,
          fenceStudent: JSON.stringify(objtwo),
          fenceXYZ: JSON.stringify(objone)
        }
        fetch.put(parents.fence, par, res => {
          if (res.code === 200) {
            this.$message({
              duration: "2000",
              showClose: true,
              message: "更新成功",
              type: "success"
            });
            this.getData()
            setTimeout(() => {
              this.dialogVisible = false
              this.saveLoading = false
            }, 500)
          }else{
              this.saveLoading = false
            this.$message({
              type: "warning",
              message: res.message,
            })
          }
        })
      },
      // 获取围栏
      getData() {
        let par = {
          pageNumber: this.currentPage,
          pageSize: this.pageSize
        }
        fetch.get(parents.fence, par, res => {
          if (res.code === 200) {
            this.tableData = res.data;
            this.total = res.total;
          } else {
            this.tableData = [];
            this.total1 = 0;
          }
        }, {
          target: '.el-table__body-wrapper'
        })
      },
      look() {
        if (this.fencename.length > 100) {
          this.$message({
            duration: "2000",
            message: "围栏名称长度错误！",
            type: "warning"
          });
          return
        }
        let par = {
          fenceName: this.fencename,
          time: this.time,
          alarmType: this.mode
        }
        fetch.get(parents.fence, par, res => {
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
        }, {
          target: '.el-table__body-wrapper'
        })
      },
      dialog(index) {
        if (typeof index == 'number') {
          this.name = "围栏修改"
          this.condition = true
          this.id = this.tableData[index].id
          this.polygonPath = []
          let par = {
            fenceId: this.id
          }
          fetch.get(parents.fence + '/' + this.id, par, res => {
            this.input = res.data.fenceName
            this.input1 = res.data.fenceDescribe
            this.value2 = res.data.alarmStart
            this.value1 = res.data.alarmType
            this.value = res.data.fenceAlarm
            this.value3 = res.data.alarmEnd

            res.data.fenceStudents.forEach(j => {
              this.value4.push(j.studentId)
              this.value5 += j.studentName
            })

            this.center.lat = res.data.fenceXYZs[0].latitude
            this.center.lng = res.data.fenceXYZs[0].longitude
            this.zoom = 16

            let objone = []
            res.data.fenceXYZs.forEach((a, i) => {
                objone[i] = {
                  lat: a.latitude,
                  lng: a.longitude
                }
              })
            this.polygonPath = objone
          })
          fetch.get(parents.student, '', res => {
            if (res.code === 200) {
              this.options2 = res.data;
            }else{
            this.$message({
              type: "warning",
              message: res.message,
            })
          }
          })
            setTimeout(() => {
              this.dialogVisible = true
            }, 500)
        } else {
          this.name = "添加围栏"
          this.condition = false
          fetch.get(parents.location, '', res => {
            if (res.code === 200) {
              this.center.lng = res.data[0].longitude
              this.center.lat = res.data[0].latitude
            }else{
            this.$message({
              type: "warning",
              message: res.message,
            })
          }
          })
          fetch.get(parents.student, '', res => {
            if (res.code === 200) {
              this.options2 = res.data;
            }else{
            this.$message({
              type: "warning",
              message: res.message,
            })
          }
          })
            setTimeout(() => {
              this.dialogVisible = true
            }, 500)
        }
      },
      clickUser(index) {
        let par = {
          fenceId: this.tableData[index].id
        }
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          fetch.delete(parents.fence, par, res => {
            if (res.code == 200) {
              this.$message({
                duration: "2000",
                showClose: true,
                message: "删除成功",
                type: "success"
              });
              this.getData()
            }else{
            this.$message({
              type: "warning",
              message: res.message,
            })
          }
          })
        }).catch(() => {

        });
      },
      handleCurrentChange() {
        this.getData()
      },
      clear() {
        this.polygonPath = []
        this.points = []
      },
      prve() {
        this.polygonPath = this.polygonPath.slice(0, this.polygonPath.length - 1)
        this.points = this.points.slice(0, this.points.length - 1)
      },
      clickHandler(e) {
        alert(`单击点的坐标为：${e.point.lng}, ${e.point.lat}`);
      },
      addP(a) {
        this.points.push(a.point)
        // if (this.points.length > 3) {
        //   this.points = []
        // } else {
        this.polygonPath.push(a.point)
        // }
      },
      updatePolygonPath(e) {
        this.polygonPath = e.target.getPath()
      },
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
  .map {
    width: 100%;
    height: 100%;
  }

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
  }

  .el-input {
    width: auto;
    margin-bottom: 20px;
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
    background-color: #3ec09c;
    color: #fff;
  }

  .success {
    background-color: #3ec09c;
    color: #fff;
  }

  .tip {
    padding: 20px;
    color: #333;
  }

  .tip span {
    margin: 0 5px 0 20px;
    line-height: 2.9;
  }

  .tip2,
  .tip1 {
    display: flex;
  }

  .tip1 .el-input {
    flex: 1;
  }

  .tip21 {
    width: 85px;
    text-align: center;
    padding-top: 10px;
  }

  .tip22 {
    width: 100%;
  }

  .tip3 {
    display: flex;
    padding-top: 20px;
  }

</style>
