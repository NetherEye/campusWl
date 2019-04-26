<template>
  <div class="wrap">
    <div class="block">
      <div class="header">
        <div class="fitler-wrap">
          <el-form :inline="true" :model="filter" class="demo-form-inline">
            <el-form-item label="工号/学号:">
              <el-input :maxlength="30" v-model="filter.number" clearable placeholder="请输入内容"></el-input>
            </el-form-item>
            <el-form-item label="姓名">
              <el-input :maxlength="30" v-model="filter.username" clearable placeholder="请输入内容"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="success" @click="findCx">查询</el-button>
            </el-form-item>
            <el-form-item>
              <el-button type="success" @click="reset">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="tableData">
        <el-table ref="singleTable" :data="tableData" highlight-current-row style="width: 100%">
          <el-table-column type="selection" align="center" width="60">
          </el-table-column>
          <el-table-column property="number" label="工号/学号" align="center">
          </el-table-column>
          <el-table-column property="username" label="姓名" align="center">
          </el-table-column>
          <el-table-column property="sectionName" label="执收区间" align="center">
          </el-table-column>
          <el-table-column property="projectName" label="费用项目" align="center">
          </el-table-column>
          <el-table-column property="walletName" label="钱包名称" align="center">
          </el-table-column>
          <el-table-column property="subsidies" label="应补贴金额" align="center">
          </el-table-column>
          <el-table-column property="receiveMoney" label="已补贴金额" align="center">
          </el-table-column>
          <el-table-column label="领取状态" align="center">
            <template slot-scope="scope">{{['未领取', '已领取'][scope.row.receiveStatus]}}</template>
          </el-table-column>
          <el-table-column label="领取方式" align="center">
            <template slot-scope="scope">{{['', '刷卡器','消费机'][scope.row.type]}}</template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button type="text" v-if="scope.row.type === 1 && scope.row.receiveStatus === 0"
                @click="show(scope.row)">发放补贴</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="fenye" v-if="total != 0">
          <div class="fenye_title">共 {{total}} 条数据 每页 {{pageSize}} 条数据 共 {{Math.floor(total/pageSize) + (total%pageSize
            != 0 ? 1 : 0)}} 页</div>
          <el-pagination :current-page.sync="pageNumber" :page-size="pageSize" @current-change="getData"
            layout="prev, pager, next, jumper" :total="total">
          </el-pagination>
        </div>
      </div>
      <div class="el-title">
        <el-dialog title="发放补贴" @closed="closeDialog" :visible.sync="showCard" width="800px" center>
          <div style="width: 400px;margin: 20px auto 0;">
            <el-form :inline="true" ref="userFormRef" :model="dialogForm" :label-position="labelPosition"
              label-width="150px" size="small">
              <el-form-item label="费用项目:">
                <el-input v-model="dialogForm.projectName" clearable disabled></el-input>
              </el-form-item>
              <el-form-item label="执收区间:">
                <el-input v-model="dialogForm.sectionName" clearable disabled></el-input>
              </el-form-item>
              <el-form-item label="钱包名称:">
                <el-input v-model="dialogForm.walletName" clearable disabled></el-input>
              </el-form-item>
              <el-form-item label="应补金额:">
                <el-input v-model="dialogForm.subsidies" clearable disabled></el-input>
              </el-form-item>
              <el-form-item label="未补金额:">
                <el-input v-model="dialogForm.money" clearable disabled></el-input>
              </el-form-item>
            </el-form>
          </div>
          <div style="padding: 20px 0 40px;">
            <div style="display: flex;align-items: center;justify-content: center;">
              <el-button type="success" size="medium" :loading="getSubLoading" @click="sure">
                确定</el-button>
              <el-button type="success" size="medium" @click="showCard = false">取消</el-button>
            </div>
          </div>
        </el-dialog>
      </div>
    </div>

  </div>
</template>

<script>
  import schoolApi from "@/assets/api/school"
  import fetch from '@/assets/tools/fetch'
  import Allapi from "@/assets/api/school/Card";
  export default {
    data() {
      return {
        useCount: '',
        mainWallet: '',
        subsidyWallet: '',
        labelPosition: 'right',
        showCard: false,
        tableData: [],
        total: 0,
        pageNumber: 1,
        pageSize: 20,
        filter: {
          number: '',
          username: ''
        },
        dialogForm: {
          money: '',
          subsidies: '',
          walletName: '',
          sectionName: '',
          projectName: '',
          cardId: '',
          mainWallet: '',
          subsidyWallet: '',
        },
        getSubLoading: false
      }
    },
    created() {
      this.getData()
    },
    methods: {
      findCx() {
        this.pageNumber = 1
        this.getData()
      },
      getData() {
        let par = {
          pageNumber: this.pageNumber,
          pageSize: this.pageSize,
          ...this.filter
        }
        fetch.get(schoolApi.receive, par, res => {
          if (res.code == 200) {
            this.tableData = res.data
            this.total = res.total
          } else {
            this.tableData = []
            this.total = 0
          }

        }, {
          target: '.el-table__body-wrapper'
        })
      },
      reset() {
        for (const key in this.filter) {
          this.filter[key] = ''
        }
      },
      getMeony() {
        let ws = new WeakSet
      },
      show(row) {
        let {
          projectName,
          sectionName,
          walletName,
          subsidies,
          money,
          id,
          personType,
          validTime
        } = row
        this.dialogForm['projectName'] = projectName
        this.dialogForm['sectionName'] = sectionName
        this.dialogForm['walletName'] = walletName
        this.dialogForm['subsidies'] = subsidies
        this.dialogForm['money'] = money
        this.dialogForm['personType'] = personType
        this.dialogForm['id'] = id
        this.dialogForm['validTime'] = validTime
        this.showCard = true
      },
      closeDialog() {
        for (const key in this.dialogForm) {
          this.dialogForm[key] = ''
        }
      },
      sure() {
        if ("WebSocket" in window) {
          this.getSubLoading = true
          let ws = new WebSocket(schoolApi.ws)
          let _this = this
          ws.onerror = function () {
            // 关闭 websocket
            _this.$message({
              type: 'error',
              message: '连接失败！'
            })
            _this.getSubLoading = false
            _this.showCard = false
          };
          ws.onclose = function () {
            // 关闭 websocket
            console.log('连接关闭')
            _this.getSubLoading = false
            _this.showCard = false
          };

          ws.onopen = function () {
            handle()
            async function handle() {
              // 事先获取物理id
              let obj1 = await new Promise((resolve) => {
                ws.send(
                  JSON.stringify({
                    type: '00'
                  })
                )
                ws.onmessage = rl => {
                  let _res = JSON.parse(rl.data)
                  resolve(_res)
                }
              })
              if (obj1.code != 200) {
                _this.$message({
                  type: 'warning',
                  message: obj1.message
                })
                ws.close()
                return
              }

              // 通过物理id获取卡信息 并且拿到卡秘钥和卡控
                fetch.get(Allapi.read + '/' + obj1.data.id, '', res => {
                  if (res.code === 200) {
                    _this.dialogForm['cardId'] = res.data.cardId
                    _this.dialogForm['m1CardSecret'] = res.data.m1CardSecret
                    _this.dialogForm['controlCardSecret'] = res.data.controlCardSecret
                    _this.useCount = res.data.useCount

                    look()

                    async function look() {
                      let result1 = await new Promise((resolve) => {
                        ws.send(JSON.stringify({
                          type: '07',
                          data: {
                            m11Key: res.data.m1CardSecret,
                            controlKey: res.data.controlCardSecret,
                            type: 1
                          }
                        }))
                        ws.onmessage = res => {
                          let _res = JSON.parse(res.data)
                          resolve(_res)
                        }
                      })
                      if (result1.code != 200) {
                        _this.$message({
                          type: 'warning',
                          message: result1.message
                        })
                        ws.close()
                        return
                      }

                      let result2 = await new Promise((resolve) => {
                        ws.send(JSON.stringify({
                          type: '07',
                          data: {
                            m11Key: res.data.m1CardSecret,
                            controlKey: res.data.controlCardSecret,
                            type: 2
                          }
                        }))
                        ws.onmessage = res => {
                          let _res = JSON.parse(res.data)
                          resolve(_res)
                        }
                      })
                      if (result2.code != 200) {
                        _this.$message({
                          type: 'warning',
                          message: result2.message
                        })
                        ws.close()
                        return
                      }
                      fetch.put(schoolApi.getSub, {
                        id: _this.dialogForm['id'],
                        cardId: _this.dialogForm['cardId'],
                        mainWallet: result1.data.money,
                        subsidyWallet: result2.data.money,
                        waterNumber: _this.useCount,
                      }, res => {
                        if (res.code === 200) {
                          cz()
                          async function cz() {
                            // 通过卡秘钥和卡控对卡进行充值
                            let obj3 = await new Promise((resolve) => {
                              ws.send(
                                JSON.stringify({
                                  type: '05',
                                  data: {
                                    m11Key: _this.dialogForm['m1CardSecret'],
                                    controlKey: _this.dialogForm['controlCardSecret'],
                                    money: _this.dialogForm['money'],
                                    type: 2,
                                    validDate: _this.dialogForm['validTime'].slice(0, 10)
                                  }
                                })
                              )
                              ws.onmessage = rl => {
                                let _res = JSON.parse(rl.data)
                                resolve(_res)
                              }
                            })
                            if (obj3.code === 200) {
                                _this.$message({
                                  type: 'success',
                                  message: obj3.message
                                })
                                _this.getData()
                                ws.close()
                            } else {
                              _this.$message({
                                type: 'success',
                                message: obj3.message
                              })
                                ws.close()
                              fetch.put(schoolApi.revocation, {
                                id: _this.dialogForm['id'],
                                cardId: _this.dialogForm['cardId'],
                                mainWallet: result1.data.money,
                                subsidyWallet: result2.data.money,
                                waterNumber: _this.useCount,
                              }, res => {console.log('cehui sucess');})
                            }

                          }
                        } else {
                          _this.$message({
                            type: 'warning',
                            message: res.message
                          })
                          ws.close()
                          return
                        }
                      })
                    }
                  } else {
                    _this.getSubLoading = false
                    _this.$message({
                      type: 'warning',
                      message: res.message
                    })
                  }
                })
            }
          }


        } else {
          // 浏览器不支持 WebSocket
          alert("您的浏览器不支持 WebSocket!");
        }
      }
    }
  }

</script>

<style scoped>
  * {
    box-sizing: border-box;
  }

  .fitler-wrap {
    padding: 18px;
    background-color: #ffffff;
    box-shadow: 0px 3px 8px 0px rgba(41, 48, 56, 0.18);

  }

  .header {
    padding: 20px 24px;
    background-color: #fff;
  }

  .wrap {
    height: 100%;
    padding: 20px;
    background-color: #edf0f5;
    overflow-x: hidden;
    overflow-y: auto;
  }

  .block {
    background-color: #ffffff;
    box-shadow: 0px 2px 9px 0px rgba(105, 105, 105, 0.07);
    border-radius: 3px;
  }

</style>
