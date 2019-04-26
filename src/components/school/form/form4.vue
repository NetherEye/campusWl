<template>
<div class="wrap">
    <div class="block">
        <div class="header">
            <div class="fitler-wrap">
                <el-form :inline="true" :model="filter" class="demo-form-inline">
                    <el-form-item label="卡ID">
                        <el-input v-model="filter.cardId" clearable placeholder="请输入内容"></el-input>
                    </el-form-item>
                    <el-form-item label="人员姓名">
                        <el-input v-model="filter.personName" clearable placeholder="请输入姓名"></el-input>
                    </el-form-item>
                    <el-form-item label="人员编号">
                        <el-input v-model="filter.personNumber" clearable placeholder="请输入内容"></el-input>
                    </el-form-item>
                    <el-form-item label="开始日期">
                        <el-date-picker
                            v-model="filter.startDate"
                            type="datetime"
                            clearable
                            :editable="false"
                            :picker-options="pickerOptions0"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            placeholder="选择日期时间">
                        </el-date-picker>
                        <span>--</span>
                        <el-date-picker
                            v-model="filter.endDate"
                            type="datetime"
                            clearable
                            :editable="false"
                            :picker-options="pickerOptions1"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            placeholder="选择日期时间">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="success" @click="findCx">查询</el-button>
                    </el-form-item>
                </el-form>
            </div>
            
        </div>   
        
        <div class="tableData">
            <el-table ref="singleTable" :data="tableData" highlight-current-row style="width: 100%" :summary-method="getSummaries" show-summary>
                <el-table-column property="cardId" label="卡ID" align="center">
                </el-table-column>
                <el-table-column property="personName" label="人员姓名" align="center">
                </el-table-column>
                <el-table-column property="personNumber" label="人员编号" align="center">
                </el-table-column>
                <el-table-column prop="writeoffPrice" label="冲销金额" align="center">
                </el-table-column>
                <el-table-column property="walletTypeValue" label="钱包" align="center"></el-table-column>
                <el-table-column property="originalTypeValue" label="交易类型" align="center"></el-table-column>
                <el-table-column property="cardBalance" label="冲销后卡余额" align="center">
                </el-table-column>
                <el-table-column prop="transactDate" label="冲销时间" align="center">
                </el-table-column>
            </el-table>
            <div class="fenye" v-if="total != 0">
                <div class="fenye_title">共 {{total}} 条数据 每页 {{pageSize}} 条数据 共 {{Math.floor(total/pageSize) + (total%pageSize != 0 ? 1 : 0)}} 页</div>
                <el-pagination :current-page.sync="pageNumber" :page-size="pageSize" @current-change="getData" layout="prev, pager, next, jumper" :total="total">
                </el-pagination>
            </div>
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
                    if (this.filter.endDate != "" && this.filter.endTime != null) {
                        return time.getTime() > Date.now() || time.getTime() > new Date(this.filter.endDate).getTime();
                    } else {
                        return time.getTime() > Date.now();
                    }

                }
            },
            pickerOptions1: {
                disabledDate: (time) => {
                    return time.getTime() < new Date(this.filter.startDate).getTime() || time.getTime() > Date.now();
                }
            },
            tableData: [],
            total: 0,
            totalPrice:0,
            pageNumber: 1,
            pageSize: 10,
            filter: {
                cardId: '',
                personName: '',
                personNumber: '',
                startDate: '',
                endDate: '',
            },
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
                ...this.filter,
            }
            fetch.get(Allapi.writeoffreport, par, res => {
                if (res.code == 200) {
                    this.tableData = res.data.m1Writeoffs
                    this.total = res.data.sumCount
                    this.totalPrice = res.data.totalPrice
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
        getSummaries(param) {
            const { columns, data } = param;
            const sums = [];
            columns.forEach((column, index) => {
                if (index === 0) {
                    sums[index] = '合计';
                    return;
                }else if(index === 1){
                    sums[index] = '总笔数 ' + this.total + ' 笔';
                    return;
                } else if (index === 3) {
                    sums[index] = this.totalPrice + '元';
                    return;
                } else{
                    sums[index] = '';
                }
            }); 

            return sums;
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
