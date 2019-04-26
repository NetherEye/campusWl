<template>
<div class="wrap">
    <div class="block">
        <div class="header">
            <div class="fitler-wrap">
                <el-form :inline="true" :model="filter" class="demo-form-inline">
                    <el-form-item label="工号/学号:">
                        <el-input :maxlength="30" v-model="filter.personType" clearable placeholder="请输入内容"></el-input>
                    </el-form-item>
                    <el-form-item label="姓名">
                        <el-input :maxlength="30" v-model="filter.name" clearable placeholder="请输入内容"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="success" @click="getData">查询</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="success" @click="reset">重置</el-button>
                    </el-form-item>
                </el-form>
                <el-form :inline="true" class="demo-form-inline">
                    <el-form-item>
                        <el-button type="success" @click="show('read')">读卡</el-button>
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
                <el-table-column property="name" label="姓名" align="center">
                </el-table-column>
                <el-table-column property="operationDate" label="执收区间" align="center">
                </el-table-column>
                <el-table-column property="operationTime" label="费用项目" align="center">
                </el-table-column>
                <el-table-column property="cost" label="钱包名称" align="center">
                </el-table-column>
                <el-table-column property="cashPledge" label="应缴费用" align="center">
                </el-table-column>
                <el-table-column property="cardPrice" label="已缴费用" align="center">
                </el-table-column>
                <el-table-column property="cost" label="欠费金额" align="center">
                </el-table-column>
                <el-table-column property="cashPledge" label="缴费状态" align="center">
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" @click="handle(scope.row)">缴费</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="fenye">
                <div class="fenye_title">共 {{total}} 条数据 每页 {{pageSize}} 条数据 共 {{Math.floor(total/pageSize) + (total%pageSize != 0 ? 1 : 0)}} 页</div>
                <el-pagination :current-page.sync="pageNumber" :page-size="pageSize" @current-change="getData" layout="prev, pager, next, jumper" :total="total">
                </el-pagination>
            </div>
        </div>
        <div class="el-title">
            <el-dialog title="缴纳应收费用" @closed="closeDialog" :visible.sync="showCard" width="800px" center>
                <div style="width: 400px;margin: 20px auto 0;">
                    <el-form :inline="true" ref="userFormRef" :model="dialogForm" :label-position="labelPosition" label-width="150px" size="small">
                        <el-form-item label="工号/学号:" prop="teacherName">
                            <el-input v-model="dialogForm.teacherName" clearable disabled></el-input>
                        </el-form-item>
                        <el-form-item label="姓名:" prop="teacherName">
                            <el-input v-model="dialogForm.teacherName" clearable disabled></el-input>
                        </el-form-item>
                        <el-form-item label="费用项目:" prop="teacherName">
                            <el-input v-model="dialogForm.teacherName" clearable disabled></el-input>
                        </el-form-item>
                        <el-form-item label="执收区间:" prop="teacherName">
                            <el-input v-model="dialogForm.teacherName" clearable disabled></el-input>
                        </el-form-item>
                        <el-form-item label="欠费金额:" prop="teacherName">
                            <el-input v-model="dialogForm.teacherName" clearable disabled></el-input>
                        </el-form-item>
                        <el-form-item label="缴纳金额:" prop="jobNumber">
                            <el-input v-model.number="dialogForm.jobNumber" clearable></el-input>
                        </el-form-item>
                        <el-form-item label="支付方式:" prop="teacherName">
                          <el-select v-model="dialogForm.teacherName" placeholder="请选择">
                            <el-option
                              v-for="item in options"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value">
                            </el-option>
                          </el-select>
                        </el-form-item>
                    </el-form>
                </div>
                <div style="padding: 20px 0 40px;">
                    <div style="display: flex;align-items: center;justify-content: center;">
                        <el-button type="success" size="medium" style="margin-left: 20px" @click="sure">确定</el-button>
                        <el-button type="success" size="medium" style="margin-left: 20px" @click="showCard = false">取消</el-button>
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
            labelPosition:'right',
            showCard:false,
            tableData: [{
              number:'1'
            }],
            total: 0,
            pageNumber: 1,
            pageSize: 10,
            filter: {
                personType: '',
                name: '',
                times: '',
                dates: ''
            },
            dialogForm:{
              jobNumber:'',
              teacherName:''
            },
            options:[{
              value:'校园卡',
              lable:'校园卡'
            },{
              value:'现金',
              lable:'现金'
            }]
        }
    },
    created() {
        // this.getData()
    },
    methods: {
        getData() {
            let par = {
                pageNumber: this.pageNumber,
                pageSize: this.pageSize,
                reportType: 2,
                ...this.filter,
            }
            fetch.get(schoolApi.getM1Report, par, res => {
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
        show(type){

        },
        handle(id){
          this.showCard = true
        },
        closeDialog(){
          for (const key in this.dialogForm) {
                this.dialogForm[key] = ''
            }
        },
        sure(){
          console.log(this.dialogForm);
        }
    }
}
</script>

<style scoped>
* {
    box-sizing: border-box;
}


.fitler-wrap{
    padding: 18px;
    background-color: #ffffff;
	box-shadow: 0px 3px 8px 0px 
		rgba(41, 48, 56, 0.18);
    
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
.block{
    background-color: #ffffff;
	box-shadow: 0px 2px 9px 0px 
		rgba(105, 105, 105, 0.07);
	border-radius: 3px;
}
</style>
