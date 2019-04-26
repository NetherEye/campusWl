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
            <el-form-item label="费用项目:">
              <el-select v-model="filter.projectName" placeholder="请选择" clearable>
                <el-option v-for="item in projectName" :key="item.id" :label="item.name" :value="item.name">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="执收区间:">
              <el-select v-model="filter.sectionName" placeholder="请选择" clearable>
                <el-option v-for="item in sectionName" :key="item.id" :label="item.sectionName" :value="item.sectionName">
                </el-option>
              </el-select>
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
          <el-table-column property="subsidies" label="应补金额" align="center">
          </el-table-column>
          <el-table-column property="money" label="实补金额" align="center">
          </el-table-column>
          <el-table-column label="状态" align="center">
            <template slot-scope="scope">{{(scope.row.status == 0 || scope.row.adjustmentStatus == 0) ? '未审核' : '已审核'}}</template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button type="text" @click="show(scope.row.id)" v-if="scope.row.adjustmentStatus != 1">调整</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="fenye" v-if="total != 0">
          <div class="fenye_title">共 {{total}} 条数据 每页 {{pageSize}} 条数据 共 {{Math.floor(total/pageSize) + (total%pageSize
            != 0 ? 1 : 0)}} 页</div>
          <el-pagination :current-page.sync="pageNumber" :page-size="pageSize" @current-change="getData" layout="prev, pager, next, jumper"
            :total="total">
          </el-pagination>
        </div>
      </div>
      <div class="el-title">
        <el-dialog title="调整" @closed="closeDialog" :visible.sync="showCard" width="800px" center>
          <div style="width: 400px;margin: 20px auto 0;">
            <el-form :inline="true" ref="userFormRef" :model="dialogForm" :label-position="labelPosition" label-width="150px"
              size="small">
              <el-form-item label="工号/学号:">
                <el-input v-model="dialogForm.number" clearable disabled></el-input>
              </el-form-item>
              <el-form-item label="费用项目名称:">
                <el-input v-model="dialogForm.projectName" clearable disabled></el-input>
              </el-form-item>
              <el-form-item label="执收区间名称:">
                <el-input v-model="dialogForm.sectionName" clearable disabled></el-input>
              </el-form-item>
              <el-form-item label="实补金额:">
                <el-input v-model="dialogForm.money" clearable disabled></el-input>
              </el-form-item>
              <el-form-item label="调整后应补金额:">
                <el-input :maxlength="30" v-model="dialogForm.subsidies" clearable></el-input>
              </el-form-item>
            </el-form>
          </div>
          <div style="padding: 20px 0 40px;">
            <div style="display: flex;align-items: center;justify-content: center;">
              <el-button type="success" size="medium" style="margin-left: 20px" @click="sure">提交</el-button>
              <el-button type="success" size="medium" style="margin-left: 20px" @click="showCard = false">关闭</el-button>
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
  export default {
    data() {
      return {
        ID: '',
        labelPosition: 'right',
        showCard: false,
        tableData: [],
        total: 0,
        pageNumber: 1,
        pageSize: 20,
        filter: {
          projectName: '',
          sectionName: '',
          number: '',
          username: ''
        },
        dialogForm: {
          subsidies: '',
          number: '',
          projectName: '',
          sectionName: '',
          username: ''
        },
        sectionName: [],
        projectName: []
      }
    },
    created() {
      this.getData()
      this.projectSection()
    },
    methods: {
      //获取所以区间和项目
      projectSection() {
        fetch.get(schoolApi.allSection, '', res => {
          if (res.code == 200) {
            this.projectName = res.data.projects
            this.sectionName = res.data.sections
          } 
        })
      },
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
        fetch.get(schoolApi.adjustment, par, res => {
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
      show(id) {
        this.showCard = true
        this.ID = id
        fetch.put(schoolApi.adjustment, {
          id: id
        }, res => {
          if (res.code == 200) {
            this.dialogForm = res.data
          } else {
                this.$message({
                    type: 'warning',
                    message: res.message
                })
            }
        })
      },
      closeDialog() {
        for (const key in this.dialogForm) {
          this.dialogForm[key] = ''
        }
      },
      sure() {
					if(this.dialogForm.subsidies === '' || this.dialogForm.subsidies === undefined) {
						this.$message({
							type: 'warning',
							message: '请输入金额！'
						})
						return
					}
					var num = /^[1-9]\d*$/;
					if(!num.test(this.dialogForm.subsidies)){
						this.$message({
							type: 'error',
							message: '输入金额有误！'
						})
						return
					}
					if(this.dialogForm.subsidies < 0) {
						this.$message({
							type: 'warning',
							message: '输入金额不能小于0！'
						})
						return
					}
					// if(this.dialogForm.subsidies > 1000){
					// 	this.$message({
					// 		type: 'error',
					// 		message: '输入金额有误！'
					// 	})
					// 	return
					// }
        fetch.put(schoolApi.adjustment, {
          id: this.ID,
          money:this.dialogForm.subsidies
        }, res => {
          if (res.code == 200) {
            this.$message({
              message: "调整成功！",
              type: "success"
            });
            this.getData()
            this.showCard = false
          } else {
                this.$message({
                    type: 'warning',
                    message: res.message
                })
            }
        })
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
