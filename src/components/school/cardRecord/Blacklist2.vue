<template>
  <div class="wrap">
    <div class="header">
      <div class="fitler-wrap">
        <el-form :inline="true" :model="sfilter" class="demo-form-inline">
          <el-form-item label="费用项目:" prop="personType">
            <el-select v-model="sfilter.projectName" placeholder="请选择" clearable>
              <el-option v-for="item in projectName" :key="item.id" :label="item.name" :value="item.name">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="执收区间:" prop="personType">
            <el-select v-model="sfilter.sectionName" placeholder="请选择" clearable @change="getData">
              <el-option v-for="item in sectionName" :key="item.id" :label="item.sectionName" :value="item.sectionName">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </div>
      <div class="block" v-if="condition">
        <div class="header">
          <div class="fitler-wrap">
            <el-form :inline="true" :model="tfilter" class="demo-form-inline">
              <el-form-item label="学号/工号:" prop="personType">
                <el-input :maxlength="30" v-model="tfilter.number" clearable placeholder="请输入内容"></el-input>
              </el-form-item>
              <el-form-item label="姓名:" prop="personType">
                <el-input :maxlength="30" v-model="tfilter.username" clearable placeholder="请输入内容"></el-input>
              </el-form-item>
              <el-form-item label="人员类别:" prop="personType">
                <el-select v-model="tfilter.personType" placeholder="请选择" clearable @change="getData">
                  <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="success" @click="getData">查询</el-button>
              </el-form-item>
              <el-form-item>
                <el-button type="success" @click="reset">重置</el-button>
              </el-form-item>
              <el-form-item>
                <el-button type="success" @click="exportNone">导出</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <div class="tableData">
          <el-table ref="singleTable" :data="tableData" highlight-current-row style="width: 100%" :summary-method="getSummaries" show-summary>
          <el-table-column label="序号" type="index" :index="indexMethod" width="100px" align="center"></el-table-column>
            <el-table-column property="number" label="工号/学号" align="center">
            </el-table-column>
            <el-table-column property="username" label="姓名" align="center">
            </el-table-column>
            <el-table-column property="personType" label="人员类别" align="center">
              <template slot-scope="scope">
                  {{['数据错误！' ,'学生', '教师'][scope.row.personType]}}
                </template>
            </el-table-column>
            <el-table-column property="groupType" label="班级/部门" align="center">
            </el-table-column>
            <el-table-column property="subsidies" label="补贴金额（元）" align="center">
            </el-table-column>
            <el-table-column property="money" label="未领取（元）" align="center">
            </el-table-column>
          </el-table>
          <div class="fenye" v-if="total != 0">
            <div class="fenye_title">共 {{total}} 条数据 每页 {{pageSize}} 条数据 共 {{Math.floor(total/pageSize) +
              (total%pageSize != 0 ? 1 : 0)}} 页</div>
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
        condition:false,
        alreadyMoney:0,
        subsidiesMoney:0,
        noneMoney:0,
        tableData: [],
        total: 0,
        pageNumber: 1,
        pageSize: 20,
        tfilter: {
          startTime: '',
          endTime: '',
          number: '',
          personType: 1,
          username: ''
        },
        sfilter: {
          projectName: '',
          sectionName: ''
        },
        projectName: [],
        sectionName: [],
        options: [{
          value: 2,
          label: '教职工'
        }, {
          value: 1,
          label: '学生'
        }],
      }
    },
    created() {
      this.getData()
      this.projectSection()
    },
    methods: {
      //获取所以区间和项目
      projectSection(){
        fetch.get(schoolApi.allSection, '', res => {
          if (res.code == 200) {
            this.projectName = res.data.projects
            this.sectionName = res.data.sections
          }
        })
      },
      getData() {
        if (this.sfilter.projectName == '') {
          this.$message({
            message:'请选择项目区间！',
            type:'warning'
          })
          return
        }
        this.condition = true
        let par = {
          ...this.sfilter,
          ...this.tfilter
        }
        fetch.get(schoolApi.none, par, res => {
          if (res.code == 200) {
            this.tableData = res.data
            this.total = res.totalSize
            this.alreadyMoney = res.alreadyMoney
            this.noneMoney = res.noneMoney
            this.subsidiesMoney = res.subsidiesMoney
          } else {
            this.tableData = []
            this.total = 0
          }
        }, {
            target: '.el-table__body-wrapper'
        })
      },
      exportNone(){
        let par = {
          ...this.sfilter,
          ...this.tfilter
        }
        fetch.export(schoolApi.exportNone, par, res => {})
      },
      reset() {
        for (const key in this.tfilter) {
          this.tfilter[key] = ''
        }
      },
      indexMethod(index) {
        return index + 1 + (this.pageNumber - 1) * this.pageSize;
      },
      getSummaries(param) {
	        const { columns, data } = param;
	        const sums = [];
	        columns.forEach((column, index) => {
	        	if (index === 0) {
              sums[index] = '合计: '+this.total+'笔';
              return;
            }
	        	if (index === 5) {
              sums[index] = this.subsidiesMoney+'元';
              return;
            }else if (index === 6) {
              sums[index] = this.noneMoney+'元';
              return;
            }else{
              sums[index] = '————';
            }
	          	
	        });
	
	    	return sums;
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
    /* display: flex; */
    height: 100%;
    padding: 20px;
    background-color: #edf0f5;
    overflow: auto;
  }

  .block {
    background-color: #ffffff;
    box-shadow: 0px 2px 9px 0px rgba(105, 105, 105, 0.07);
    border-radius: 3px;
  }

</style>
