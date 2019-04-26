<template>
<div class="wrap">
    <div class="block">
        <div class="header">
            <div class="fitler-wrap">
                <el-form :inline="true" :model="filter" class="demo-form-inline">
                    <el-form-item label="人员姓名">
                        <el-input v-model="filter.personName" clearable placeholder="请输入姓名"></el-input>
                    </el-form-item>
                    <el-form-item label="人员编号">
                        <el-input v-model="filter.personNumber" clearable placeholder="请输入"></el-input>
                    </el-form-item>
                    <el-form-item label="领取状态">
                        <el-select v-model="filter.status" clearable placeholder="全部">
                            <el-option v-for="item in sendType" :key="item.key" :label="item.label" :value="item.key"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="success" @click="findCx">查询</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="success" @click="reset">重置</el-button>
                    </el-form-item>
                </el-form>
                <el-form :inline="true" class="demo-form-inline">
                    <el-form-item>
                        <el-button type="success" :loading="readCardLoading" @click="readCard">读卡</el-button>
                    </el-form-item>
                </el-form>
            </div>
            
        </div>   
        
        <div class="tableData" v-if="condition">
            <el-table ref="singleTable" :data="tableData" highlight-current-row style="width: 100%" @selection-change="handleSelectionChange">
                <el-table-column property="personName" label="人员姓名" align="center">
                </el-table-column>
                <el-table-column property="personNumber" label="人员编号" align="center">
                </el-table-column>
                <el-table-column property="mainWallet" label="主钱包" align="center">
                </el-table-column>
                <el-table-column property="subsidyWallet" label="补贴钱包" align="center">
                </el-table-column>
                <el-table-column property="sumPrice" label="金额合计" align="center">
                </el-table-column>
                <el-table-column property="statusValue" label="领取状态" align="center">
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" :disabled="scope.row.status == 1 ? true: false" @click="shows(scope.row)">补登</el-button>	
                    </template>
                </el-table-column>
            </el-table>
            <div class="fenye" v-if="total != 0">
                <div class="fenye_title">共 {{total}} 条数据 每页 {{pageSize}} 条数据 共 {{Math.floor(total/pageSize) + (total%pageSize != 0 ? 1 : 0)}} 页</div>
                <el-pagination :current-page.sync="pageNumber" :page-size="pageSize" @current-change="getData" layout="prev, pager, next, jumper" :total="total">
                </el-pagination>
            </div>
        </div>
        <!-- 设置1 -->
        <div class="el-title">
            <el-dialog title="补登" @closed="closeDialog" :visible.sync="showCard" width="650px" center>
                <div style="width: 100%;height:100%;margin: 0 auto;text-align: center;height: 100%;padding: 20px;">
                    <div style="text-align: left;">卡片信息</div>
                    <div class="box">
                        <el-form :inline="true" ref="cardFormRef" :model="dialogForm" class="demo-form-inline" size="small" label-width="82px">
                            <el-form-item label="卡ID">
                                <el-input v-model="dialogForm.cardId" clearable disabled></el-input>
                            </el-form-item>
                            <el-form-item label="姓名">
                                <el-input v-model="dialogForm.personName" clearable disabled></el-input>
                            </el-form-item>
                        </el-form>
                    </div>
                    <div style="text-align: left;">当前卡余额</div>
                    <div class="box">
                        <el-form :inline="true" ref="cardFormRef" :model="dialogForm" class="demo-form-inline" size="small" label-width="82px">
                            <el-form-item label="主钱包">
                                <el-input v-model="dialogForm.mainWallets" clearable disabled></el-input>
                            </el-form-item>
                            <el-form-item label="补贴钱包">
                                <el-input v-model="dialogForm.subsidyWallets" clearable disabled></el-input>
                            </el-form-item>
                        </el-form>
                    </div>
                    <div style="text-align: left;">补登金额</div>
                    <div class="box">
                        <el-form :inline="true" ref="cardFormRef" :model="dialogForm" class="demo-form-inline" size="small" label-width="82px">
                            <el-form-item label="主钱包">
                                <el-input v-model="dialogForm.mainWallet" clearable disabled></el-input>
                            </el-form-item>
                            <el-form-item label="补贴钱包">
                                <el-input v-model="dialogForm.subsidyWallet" clearable disabled></el-input>
                            </el-form-item>
                        </el-form>
                    </div>
                    <div style="margin: 20px;display: flex;align-items: center;justify-content: center;">
                        <el-button type="success" style="margin-left: 20px" :loading="sureLoading" @click="sure">提交</el-button>
                        <el-button type="success" style="margin-left: 20px" @click="showCard = false">返回</el-button> 
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
import Pay from "@/assets/api/school/Pay";
import Allapi from "@/assets/api/school/Card";
export default {
    data() {
        return {
            row:[],
            awaitArr :[],
            tableData: [],
            total: 0,
            belongId: '',
            pageNumber: 1,
            pageSize: 10,
            condition:false,
            showCard:false,
            readCardLoading:false,
            sureLoading:false,
            filter: {
                status: '',
                personName: '',
                personNumber:'',
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
                    label: '处理中'
                },
                {
                    key: 1,
                    label: '已领取'
                },
                {
                    key: 2,
                    label: '未领取'
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
            dialogForm:{
                personName:'',
                cardId:'',
                mainWallet:'',
                subsidyWallet:'',
                mainWallets:'',
                subsidyWallets:'',
            },
            dialogFormSet:{},
            cardData:[]
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
            if (!this.condition) {
                this.$message({
                    type: 'warning',
                    message: '请先进行读卡操作'
                })
            }else{
                this.readCard()
            }
        },
        reset(){
            for (const key in this.filter) {
                this.filter[key] = ''
            }
        },
        closeDialog(){
            for (const key in this.dialogForm) {
                this.dialogForm[key] = '';
            }
        },
        handleSelectionChange(val) {
        	this.awaitArr = val
        },
        
         // 读卡
        readCard(){
        	if("WebSocket" in window){
                // 打开一个 web socket
                var ws = new WebSocket(schoolApi.ws);
                let _this = this
                ws.onopen = function(){
                    // 获取物理id
                    _this.readCardLoading = true
                    getId()
                    async function getId(){
                    	// 获取物理id 
                    	let id = await new Promise((resove) => {
                    		ws.send(JSON.stringify({type: '00'}))
                    		ws.onmessage = res => {
                    			resove(JSON.parse(res.data))
                    		}
                    	})
                    	if(id.code === 200){
                    		ws.close()
						}else{
							_this.$message({
								type: 'warning',
								message: id.message
							})
                            ws.close()
                            return
						}
						
                    	fetch.get(Allapi.read + '/' + id.data.id, '', res => {
		                    if(res.code === 200){
                                _this.condition = true
                                _this.cardData = res.data
                                let {cardId,personName, mainWallet, subsidyWallet} = res.data
                                _this.dialogForm.cardId = cardId
                                _this.dialogForm.personName = personName
                                _this.dialogForm.mainWallets = mainWallet
                                _this.dialogForm.subsidyWallets = subsidyWallet
                                let par = {
                                    cardId:cardId,
                                    pageNumber: _this.pageNumber,
                                    pageSize: _this.pageSize,
                                    ..._this.filter
                                }
                                fetch.get(Allapi.fill, par, re => {
                                    if (re.code == 200) {
                                        _this.tableData = re.data
                                        _this.total = re.total
                                    } else {
                                        _this.tableData = []
                                        _this.total = 0
                                        ws.close()
                                        return
                                    }
                                }, {
                                    target: '.el-table__body-wrapper'
                                });
		                    }else{
                                _this.$message({
                                    type: 'warning',
                                    message: res.message
                                })
                                ws.close()
		                        // 重置表单
		                        _this.resetForm()
                                _this.readCardLoading = false
		                    }
		                })
                    }
                };
                ws.onerror = function(){ 
                    _this.$message({
                    	type: 'error',
                    	message: '连接失败！'
                    })
					_this.readCardLoading = false
                };
                ws.onclose = function(){ 
					_this.readCardLoading = false
                };
                return ws
            }else{
                alert("您的浏览器不支持 WebSocket!");
            }
        },
        shows(row){
            this.readCard()
            this.row = row
            this.dialogForm.mainWallet = row.mainWallet
            this.dialogForm.subsidyWallet = row.subsidyWallet
            this.showCard = true
        },
        sure(){
            this.sureLoading = true
            let par = {
                id:this.row.id,
                cardId:this.cardData.cardId,
                mainWallet:this.cardData['mainWallet'],
                subsidyWallet:this.cardData['subsidyWallet'],
                mainWalletFill:this.row.mainWallet,
                subsidyWalletFill:this.row.subsidyWallet,
                waterNumber: this.cardData.useCount,
            }
            fetch.post(Allapi.fill, par, res => {
                if (res.code == 200) {
					var ws = new WebSocket(schoolApi.ws);
                    let _this = this
                    ws.onerror = function() {
                        // 关闭 websocket
                        _this.$message({
                            type: 'error',
                            message: '连接失败！'
                        })
                    };

                    ws.onclose = function() {
                        // 关闭 websocket
                        console.log('连接关闭')
                        _this.readCard()
                        _this.showCard = false
                        _this.sureLoading = false
                    };
                    ws.onopen = () => {
                        cz()
                        async function cz() {
                            let result = await new Promise((resolve) => {
                                ws.send(
                                    JSON.stringify({
                                        type: '05',
                                        data: {
                                            m11Key: _this.cardData.m1CardSecret,
                                            controlKey: _this.cardData.controlCardSecret,
                                            money: _this.row.mainWallet,
                                            type: 1,
                                            validDate: ''
                                        }
                                    })
                                )
                                ws.onmessage = rl => {
                                    let _res = JSON.parse(rl.data)
                                    resolve(_res)
                                }
                            })
                            let result1 = await new Promise((resolve) => {
                                ws.send(
                                    JSON.stringify({
                                        type: '05',
                                        data: {
                                            m11Key: _this.cardData.m1CardSecret,
                                            controlKey: _this.cardData.controlCardSecret,
                                            money: _this.row.subsidyWallet,
                                            type: 2,
                                            validDate: _this.cardData.cardIndate
                                        }
                                    })
                                )
                                ws.onmessage = rl => {
                                    let _res = JSON.parse(rl.data)
                                    resolve(_res)
                                }
                            })
                            if(result.code === 200) {
                                if(result1.code === 200) {
                                    _this.$message({
                                        type: 'success',
                                        message: res.message
                                    })
                                    ws.onclose()
                                } else {
                                    _this.sureLoading = false
                                    let par = {
                                        cardId: _this.cardData.cardId,
                                        walletType: 2,//1 主钱包 2补贴钱包
                                        priceType: 2,//撤回类型 1 加 2 减
                                        price: _this.row.subsidyWallet,
                                    }
                                    fetch.post(Pay.toRecall, par, res => {
                                        //撤回钱
                                    })
                                }
                            } else {
                                _this.sureLoading = false
                                let par = {
                                    cardId: _this.cardData.cardId,
                                    walletType: 1,//1 主钱包 2补贴钱包
                                    priceType: 2,//撤回类型 1 加 2 减
                                    price: _this.row.mainWallet,
                                }
                                fetch.post(Pay.toRecall, par, res => {
                                    //撤回钱
                                })
                            }

                        }
                    }
                } else {
                    this.$message({
                        type: 'warning',
                        message: res.message
                    })
                }
            });
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
