<template>
<div class="wrap">
    <div class="block">
        <div class="header">
            <div class="fitler-wrap">
                <el-form :inline="true" :model="filter" class="demo-form-inline">
                    <el-form-item label="月份">
                        <!-- <el-select v-model="filter.month" placeholder="请选择" clearable>
                            <el-option v-for="item in Month" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select> -->
                        <el-date-picker
                        v-model="filter.month"
                        type="month"
                        placeholder="全部">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="success" @click="findCx">查询</el-button>
                    </el-form-item>
                </el-form>
            </div>
            
        </div>   
        
        <div class="tableData">
            <el-table ref="singleTable" :data="tableData" highlight-current-row style="width: 100%">
                <el-table-column property="device_number" label="充值机编号" align="center">
                </el-table-column>
                <el-table-column property="device_serial_number" label="部署区域" align="center">
                </el-table-column>
                <el-table-column property="price" label="取钞流水号" align="center">
                </el-table-column>
                <el-table-column property="type" label="取钞日期" align="center">
                </el-table-column>
                <el-table-column property="card_id" label="取钞时间" align="center">
                </el-table-column>
                <el-table-column property="use_count" label="金额" align="center">
                </el-table-column>
                <el-table-column label="现金明细" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" @click="show(scope.row)">查看</el-button>	
                    </template>
                </el-table-column>
            </el-table>
            <div class="fenye" v-if="total != 0">
                <div class="fenye_title">共 {{total}} 条数据 每页 {{pageSize}} 条数据 共 {{Math.floor(total/pageSize) + (total%pageSize != 0 ? 1 : 0)}} 页</div>
                <el-pagination :current-page.sync="pageNumber" :page-size="pageSize" @current-change="getData" layout="prev, pager, next, jumper" :total="total">
                </el-pagination>
            </div>
        </div>
        <div class="el-title">
            <el-dialog title="充值明细" @closed="closeDialog" :visible.sync="showCard" width="1200px" center>
                <div class="tableData">
                    <el-table ref="singleTable" :data="tableData" highlight-current-row style="width: 100%;">
                        <el-table-column property="device_number" label="卡ID" align="center">
                        </el-table-column>
                        <el-table-column property="device_serial_number" label="充值前金额" align="center">
                        </el-table-column>
                        <el-table-column property="price" label="充值金额" align="center">
                        </el-table-column>
                        <el-table-column property="type" label="充值后金额" align="center">
                        </el-table-column>
                        <el-table-column property="card_id" label="使用次数" align="center">
                        </el-table-column>
                        <el-table-column property="use_count" label="充值时间" align="center">
                        </el-table-column>
                        <el-table-column property="card_id" label="是否成功" align="center">
                        </el-table-column>
                        <el-table-column property="use_count" label="是否上传至平台" align="center">
                        </el-table-column>
                    </el-table>
                    <div class="fenye" v-if="total != 0">
                        <div class="fenye_title">共 {{total}} 条数据 每页 {{pageSize}} 条数据 共 {{Math.floor(total/pageSize) + (total%pageSize != 0 ? 1 : 0)}} 页</div>
                        <el-pagination :current-page.sync="pageNumber" :page-size="pageSize" @current-change="getData" layout="prev, pager, next, jumper" :total="total">
                        </el-pagination>
                    </div>
                </div>
                <div style="padding: 20px;">
                    <div style="display: flex;align-items: center;justify-content: center;">
                        <el-button type="success" size="medium" @click="showCard = false">关闭</el-button>
                    </div>
                </div>
            </el-dialog>
        </div>
    </div>

</div>
</template>

<script>
import Allapi from "@/assets/api/school/Card";
import fetch from '@/assets/tools/fetch'
export default {
    data() {
        return {
            pickerOptions0: {
                disabledDate: (time) => {
                    if (this.filter.endTime != "" && this.filter.endTime != null) {
                        return time.getTime() > Date.now() || time.getTime() > new Date(this.filter.endTime).getTime();
                    } else {
                        return time.getTime() > Date.now();
                    }

                }
            },
            pickerOptions1: {
                disabledDate: (time) => {
                    return time.getTime() < new Date(this.filter.startTime).getTime() || time.getTime() > Date.now();
                }
            },
            tableData: [{price:'1'}],
            total: 10,
            pageNumber: 1,
            pageSize: 10,
            filter: {
                month: ''
            },
            showCard: false,
        }
    },
    created() {
        // this.getData()
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
            fetch.get(Allapi.device, par, res => {
                if (res.code == 200) {
                    this.tableData = res.data
                    this.total = res.total || ''
                } else {
                    this.tableData = []
                    this.total = 0
                }
            }, {
                target: '.el-table__body-wrapper'
            });
        },
        reset(){
            for (const key in this.filter) {
                this.filter[key] = ''
            }
        },
        show(){
            this.showCard = true
        },
        closeDialog() {
            for(const key in this.dialogForm) {
                this.dialogForm[key] = ''
            }
            this.options = [] // 重置商户列表
        },
        
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
    padding: 20px 40px 20px 20px;
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
