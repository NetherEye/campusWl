<template>
  <div id="myapp">
    <baidu-map class="map" :center="center" @ready="handler" :zoom="15" :scroll-wheel-zoom="true">
      <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>
      <bm-polyline :path="path" stroke-color="blue" :stroke-opacity="0.5" :stroke-weight="2" :editing="false"></bm-polyline>
      <bml-lushu @start="changeBtnText('pause')" @stop="changeBtnText('play_arrow')" @pause="changeBtnText('play_arrow')"
        :path="path" :rotation="rotation" :content="content" :infoWindow="true" :speed="speed" :icon="icon" :play="play">
      </bml-lushu>
    </baidu-map>
    <div class="title_list">
      <span>筛选</span>
      <el-select v-model="value" placeholder="请选择">
        <el-option v-for="item in options" :key="item.contactNumber" :label="item.studentName" :value="item.contactNumber">
        </el-option>
      </el-select>
      <span>时间</span>
      <el-date-picker v-model="value1" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="请选择起始时间" clearable :editable="false" :picker-options="pickerOptions0">
      </el-date-picker>
      <div style="display: inline-block;width:23px;height:2px;background-color: #bababa;margin:0 -15px 5px 5px;"></div>
      <span>时间</span>
      <el-date-picker v-model="value2" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="请选择结束时间" clearable :editable="false" :picker-options="pickerOptions1">
      </el-date-picker>
      <el-button class="cha" @click="look">查询</el-button>
      <el-button class="cha" @click="toggle">播放</el-button>
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
    components: {
      BmlLushu
    },
    data() {
      return {
        center: {
          lng: 106.7091771,
          lat: 26.62990674
        },
        value: '',
        value1: '',
        value2: '',
        options: [],
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
      }
    },
    created() {
      this.getData()
    },
    methods: {
      handler ({BMap, map}) {
        fetch.get(parents.location, '', res => {
          if (res.code === 200) {
            this.center.lng = res.data[0].longitude
            this.center.lat = res.data[0].latitude
          } else{
            this.$message({
              type: "warning",
              message: res.message,
            })
          }
        })
      },
      getData() {
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
      },
      look() {
        this.path = []
        this.play = false
        if (this.value == '') {
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
          belongId: this.value,
          startTime: this.value1,
          endTime: this.value2
        }
        fetch.get(parents.track + '/' + this.value, par, res => {
          if (res.code === 200) {
            res.data.forEach(v => {
              this.path.push({lng: v.longitude*1,lat: v.latitude*1})
            })
            this.$message({
              type: "success",
              message: '查询成功',
            })
          }else{
            this.$message({
              type: "warning",
              message: res.message,
            })
          }
        })
      },
      changeBtnText(val) {
        this.btnText = val
        if (val === 'play_arrow') {
          this.play = false
        }
      },
      toggle() {
        if (this.path.length == 0) {
          this.$message({
            duration: "2000",
            message: "请先选择查询！",
            type: "warning"
          });
          return
        }
        this.play = !this.play
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

  .title_list {
    position: absolute;
    top: 40px;
    left: 40px;
    background: #fff;
    padding-top: 20px;
    padding-right: 20px;
    text-align: left;
    box-shadow: 0px 3px 8px 0px rgba(41, 48, 56, 0.18);
    margin-right: 20px;
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

</style>
