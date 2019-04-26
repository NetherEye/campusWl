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
                <el-table-column property="walletName" label="钱包类型" align="center">
                </el-table-column>
                <el-table-column property="subsidies" label="应补金额" align="center">
                </el-table-column>
                <el-table-column label="状态" align="center">
                    <template slot-scope="scope">{{['未过期', '已过期',][scope.row.isValid]}}</template>
                </el-table-column>
                <el-table-column property="validTime" label="过期日期" align="center">
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope"><el-button type="text" @click="overdue(scope.row.id)">延期</el-button></template>
                </el-table-column>
            </el-table>
            <div class="fenye" v-if="total != 0">
                <div class="fenye_title">共 {{total}} 条数据 每页 {{pageSize}} 条数据 共 {{Math.floor(total/pageSize) + (total%pageSize != 0 ? 1 : 0)}} 页</div>
                <el-pagination :current-page.sync="pageNumber" :page-size="pageSize" @current-change="getData" layout="prev, pager, next, jumper" :total="total">
                </el-pagination>
            </div>
        </div>
        <div class="el-title">
            <el-dialog title="延期时间" @closed="closeDialog" :visible.sync="showCard" width="800px" center>
                <div style="width: 400px;margin: 20px auto 0;">
                    <el-form :inline="true" ref="userFormRef" :label-position="labelPosition" label-width="150px" size="small">
                        <el-form-item label="延期时间:">
                          <el-date-picker
                            v-model="expirationTime"
                            type="date"
                            clearable
                            :editable="false"
                            value-format="yyyy-MM-dd"
                            :picker-options="pickerOptions0"
                            placeholder="选择日期">
                          </el-date-picker>
                        </el-form-item>
                    </el-form>
                </div>
                <div style="padding: 20px 0 40px;">
                    <div style="display: flex;align-items: center;justify-content: center;">
                        <el-button type="success" size="medium" @click="sure">确定</el-button>
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
export default {
    data() {
        return {
            pickerOptions0: {
                disabledDate(time) {
                    return time.getTime() < Date.now();
                }
            },  
            ID:'',
            labelPosition:'right',
            showCard:false,
            tableData: [{
              number:'1'
            }],
            total: 0,
            pageNumber: 1,
            pageSize: 20,
            filter: {
                number: '',
                username: ''
            },
            expirationTime:'',
            options:[{
              value:1,
              label:'校园卡'
            },{
              value:2,
              label:'现金'
            }]
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
            fetch.get(schoolApi.overdue, par, res => {
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
        closeDialog(){
            this.expirationTime = ''
            for (const key in this.dialogForm) {
                this.dialogForm[key] = ''
            }
        },
        sure(){
          let par = {
                id:this.ID,	
                expirationTime:this.expirationTime
            }
            fetch.put(schoolApi.overdue, par, res => {
                if (res.code == 200) {
                    this.$message({
                    message: "延期成功！",
                    type: "success"
                    });
                    this.getData()
                    this.showCard = false
                }else {
                this.$message({
                    type: 'warning',
                    message: res.message
                })
            }

            })
        },
        overdue(id){
            this.showCard = true 
            this.ID = id
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
