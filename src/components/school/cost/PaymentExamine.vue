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
          <el-form :inline="true">
            <el-form-item>
              <el-button type="success" @click="adjustment">审核通过</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="tableData">
        <el-table ref="singleTable" :data="tableData" highlight-current-row style="width: 100%" @selection-change="handleSelectionChange">
          <el-table-column type="selection" align="center" width="60" :selectable="checkboxInit">
          </el-table-column>
          <el-table-column property="number" label="工号/学号" align="center">
          </el-table-column>
          <el-table-column property="username" label="姓名" align="center">
          </el-table-column>
          <el-table-column property="sectionName" label="执收区间" align="center">
          </el-table-column>
          <el-table-column property="projectName" label="费用项目" align="center">
          </el-table-column>
          <el-table-column property="subsidies" label="调整后应补金额" align="center">
          </el-table-column>
          <el-table-column property="money" label="实补金额" align="center">
          </el-table-column>
          <el-table-column property="adjustmentMoney" label="调整前应补金额" align="center">
          </el-table-column>
          <el-table-column label="状态" align="center">
            <template slot-scope="scope">{{(scope.row.adjustmentStatus == 0)? '未审核' : '已审核'}}</template>
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
      getData() {
        let par = {
          pageNumber: this.pageNumber,
          pageSize: this.pageSize,
          ...this.filter
        }
        fetch.get(schoolApi.adjustment + '/check', par, res => {
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
      closeDialog() {
        for (const key in this.dialogForm) {
          this.dialogForm[key] = ''
        }
      },
      adjustment() {
        if (this.ID.length === 0) {
            this.$message({
                duration: "2000",
                showClose: true,
                message: '请先选择要审核的人员!',
                type: "warning"
              });
              return
          }
        let IDs = ''
        this.ID.forEach(v => {
          IDs += v.id + ','
        });
        fetch.put(schoolApi.adjustment + '/check', {
          ids: IDs.slice(0, IDs.lastIndexOf(','))
        }, res => {
          if (res.code === 200 && res.data > 0) {
            this.$message({
              message: "审核成功！",
              type: "success"
            });
            this.ID = []
            this.getData()
          } else if(res.code === 200 && res.data <= 0) {
              this.$message({
                  type: 'warning',
                  message: '未调整'
              })
          } else {
              this.$message({
                  type: 'warning',
                  message: res.message
              })
          }
        })
      },
      findCx() {
          this.pageNumber = 1
          this.getData()
      },
      checkboxInit(row,index){
    　　if (row.adjustmentStatus == 1)//这个判断根据你的情况而定
    　　　　return 0;//不可勾选
    　　else
    　　　　return 1;//可勾选
    　　},
      handleSelectionChange(val) {
        this.ID = val;
      },
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
