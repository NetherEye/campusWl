<template>
<div class="wrap">
    <div class="block">
        <div class="header">
            <div class="fitler-wrap">
                <el-form :inline="true" :model="filter" class="demo-form-inline">
                    <el-form-item label="卡ID" prop="cardPrice">
                        <el-input v-model="filter.cardId" clearable placeholder="请输入内容"></el-input>
                    </el-form-item>
                    <el-form-item label="人员姓名">
                        <el-input v-model="filter.personName" clearable placeholder="请输入姓名"></el-input>
                    </el-form-item>
                    <el-form-item label="人员编号">
                        <el-input v-model="filter.personNumber" clearable placeholder="请输入内容"></el-input>
                    </el-form-item>
                    <el-form-item label="人员类别">
                        <el-select v-model="filter.personType" clearable placeholder="全部">
                            <el-option v-for="item in peopleType" :key="item.key" :label="item.label" :value="item.key">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="卡分组">
                        <el-select v-model="filter.cardGroupType" clearable placeholder="全部">
                            <el-option v-for="item in cardType" :key="item.key" :label="item.label" :value="item.key">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="挂失时间">
                        <el-date-picker
                            v-model="filter.startTime"
                            type="datetime"
                            clearable
                            :editable="false"
                            :picker-options="pickerOptions0"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            placeholder="选择日期时间">
                        </el-date-picker>
                        <span>--</span>
                        <el-date-picker
                            v-model="filter.endTime"
                            type="datetime"
                            clearable
                            :editable="false"
                            :picker-options="pickerOptions1"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            placeholder="选择日期时间">
                        </el-date-picker>
                    </el-form-item>
                    
                    
                    <el-form-item>
                        <el-button type="success" @click="findCx">查询报表</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="success" @click="exports">导出excel</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="success" @click="reset">重置</el-button>
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
                <el-table-column property="personTypeValue" label="人员类别" align="center">
                </el-table-column>
                <el-table-column property="cardGroupTypeValue" label="卡分组" align="center">
                </el-table-column>
                <el-table-column label="挂失时间" prop="createTime" align="center">
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
import schoolApi from "@/assets/api/school"
import fetch from '@/assets/tools/fetch'
import Allapi from "@/assets/api/school/Card";
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
            tableData: [],
            total: 0,
            belongId: '',
            pageNumber: 1,
            pageSize: 10,
            filter: {
                cardId: '',
                personName: '',
                personNumber: '',
                personType: '',
                cardGroupType: '',
                startTime: '',
                endTime: '',
            },
            peopleType: [
                {
                    key: 1,
                    label: '教职工'
                },
                {
                    key: 2,
                    label: '学生'
                }
            ],
            sendType: [{
                    key: 0,
                    label: '新卡'
                },
                {
                    key: 1,
                    label: '补卡'
                }
            ],
            cardType: [{
                    key: 0,
                    label: '临时卡'
                },
                {
                    key: 1,
                    label: '学生卡'
                },
                {
                    key: 2,
                    label: '教师卡'
                }
            ]
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
                reportType: 4,
                ...this.filter
            }
            fetch.get(Allapi.cardReport, par, res => {
                if (res.code == 200) {
                    this.tableData = res.data.m1CardReports
                    this.total = res.data.total
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
        getSummaries(param) {
            const {
                columns,
                data
            } = param;
            const sums = [];
            columns.forEach((column, index) => {
                if (index === 0) {
                    sums[index] = '合计';
                    return;
                } else if (index === 1) {
                    sums[index] = '挂失总数 ' + this.total + ' 张';
                    return;
                } else {
                    sums[index] = '';
                }
            });

            return sums;
        },
        exports() {
            fetch.export(Allapi.exportM1, {...this.filter,pageNumber: this.pageNumber,pageSize: this.pageSize,reportType: 4}, res => {})
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
