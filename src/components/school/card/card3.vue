<template>
<div class="wrap">
    <div class="block">
        <div class="header">
            <div class="fitler-wrap">
                <el-form :inline="true" :model="filter" class="demo-form-inline">
                    <el-form-item label="卡ID">
                        <el-input v-model="filter.cardId" clearable placeholder="请输入"></el-input>
                    </el-form-item>
                    <el-form-item label="人员姓名">
                        <el-input v-model="filter.personName" clearable placeholder="请输入姓名"></el-input>
                    </el-form-item>
                    <el-form-item label="人员编号">
                        <el-input v-model="filter.personNumber" clearable placeholder="请输入"></el-input>
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
                <el-table-column property="cardId" label="卡ID" align="center">
                </el-table-column>
                <el-table-column property="personName" label="人员姓名" align="center">
                </el-table-column>
                <el-table-column property="personNumber" label="人员编号" align="center">
                </el-table-column>
                <el-table-column property="mainWallet" label="主钱包" align="center">
                </el-table-column>
                <el-table-column property="subsidyWallet" label="补贴钱包" align="center">
                </el-table-column>
                <el-table-column property="statusUpdateDate" label="状态改变时间" align="center">
                </el-table-column>
                <el-table-column property="djs" label="补登剩余小时" align="center">
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
    function InitTime(endtime){
        var dd,hh,mm,ss = null;
        var time = new Date(endtime).getTime() - new Date().getTime();
        if(time<=0){
            return '结束'
        }else{
            dd = Math.floor(time / 1000 / 60 / 60 / 24);
            hh = Math.floor((time / 1000 / 60 / 60) % 24);
            mm = Math.floor((time / 1000 / 60) % 60);
            ss = Math.floor((time / 1000) % 60);
            var str = dd+"天"+hh+"小时"+mm+"分"+ss+"秒";
            return str;
        }
    }
export default {
    data() {
        return {
            awaitArr :[],
            tableData: [],
            total: 0,
            belongId: '',
            pageNumber: 1,
            pageSize: 10,
            showCard:false,
            filter: {
                cardId:'',
                personName:'',
                personNumber:''
            },
            moneyTypes: [{
                    key: 0,
                    label: '全部'
                },{
                    key: 1,
                    label: '主钱包'
                },
                {
                    key: 2,
                    label: '补贴钱包'
                }
            ],
            peopleType: [
                {
                    key: 1,
                    label: '学生'
                },
                {
                    key: 2,
                    label: '教师'
                }
            ],
            sendType: [
                {
                    key: 0,
                    label: '全部'
                },
                {
                    key: 1,
                    label: '已领取'
                },
                {
                    key: 2,
                    label: '未领取'
                },
                {
                    key: 3,
                    label: '处理中'
                }
            ],
            cardType: [
                {
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
            ],
            dialogForm:{},
            dialogFormSet:{}
        }
    },
    created() {
        this.getData()
    },
    mounted(){
        setInterval(()=> {
            for (var key in this.tableData) {
                var t = new Date(this.tableData[key]["remainDate"]).getTime();
                var n = new Date().getTime();
                var time = t - n;
                if (time > 0) {
                    var dd = Math.floor(time / 1000 / 60 / 60 / 24);
                    var hh = Math.floor((time / 1000 / 60 / 60) % 24);
                    var mm = Math.floor((time / 1000 / 60) % 60);
                    var ss = Math.floor((time / 1000) % 60);
                    this.tableData[key]["djs"] = dd + "天" + hh + "小时" + mm + "分" + ss + "秒";
                }else{
                    this.tableData[key]["djs"] = '结束'
                }
            }
        }, 1000);

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
            fetch.get(Allapi.fillwait, par, res => {
                if (res.code == 200) {
                    this.tableData = res.data
                    this.total = res.total
                    this.tableData.map((obj,index)=>{
                        this.$set(obj,"djs",InitTime(obj.remainDate));
                    })
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

	.box {
		box-shadow: 0px 1px 3px 0px rgba(41, 48, 56, 0.18);
		margin-top: 5px;
		padding: 20px 0 0;
		margin-bottom: 20px;
	}
</style>
