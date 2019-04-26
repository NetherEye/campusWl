<template>
<div class="wrap">
    <div class="block">
        <div class="header">
            <div class="fitler-wrap">
                <el-form :inline="true" :model="filter" class="demo-form-inline">
                    <el-form-item label="钱包">
                        <el-select v-model="filter.walletType" clearable placeholder="全部">
                            <el-option v-for="item in moneyTypes" :key="item.key" :label="item.label" :value="item.key"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="交易类型">
                        <el-select v-model="filter.type" clearable placeholder="全部">
                            <el-option v-for="item in sendType" :key="item.key" :label="item.label" :value="item.key">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="开始时间:">
                      <el-date-picker
                        v-model="filter.startDate"
                        type="datetime"
                        clearable
                        :editable="false"
                        :picker-options="pickerOptions0"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        placeholder="选择日期时间">
                      </el-date-picker>
                    </el-form-item>
                    <el-form-item>
                      <span>--</span>
                    </el-form-item>
                    <el-form-item label="结束时间:">
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
                    <el-form-item>
                        <el-button type="success" @click="reset">重置</el-button>
                    </el-form-item>
                </el-form>
                <el-form :inline="true" class="demo-form-inline">
                    <el-form-item>
                        <el-button type="success" :loading="readCardLoading" @click="readCard">读卡</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="success" @click="shows">交易冲销</el-button>
                    </el-form-item>
                </el-form>
            </div>
            
        </div>   
        
        <div class="tableData" v-if="condition">
            <el-table ref="singleTable" :data="tableData" highlight-current-row style="width: 100%" @selection-change="handleSelectionChange">
                <el-table-column type="selection" align="center" width="60"></el-table-column>
                <el-table-column property="cardId" label="卡ID" align="center">
                </el-table-column>
                <el-table-column property="personNumber" label="人员编号" align="center">
                </el-table-column>
                <el-table-column property="personName" label="姓名" align="center">
                </el-table-column>
                <el-table-column property="walletTypeValue" label="钱包" align="center">
                </el-table-column>
                <el-table-column property="price" label="发生金额" align="center">
                </el-table-column>
                <el-table-column property="cardBalance" label="卡余额" align="center">
                </el-table-column>
                <el-table-column property="useCount" label="使用次数" align="center">
                </el-table-column>
                <el-table-column property="typeValue" label="交易类型" align="center">
                </el-table-column>
                <el-table-column property="statusValue" label="交易状态" align="center">
                </el-table-column>
                <el-table-column property="transactDate" label="交易时间" align="center">
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
            <el-dialog title="交易冲销" @closed="closeDialog" :visible.sync="showCard" width="980px" center>
                <div style="width: 100%;height:100%;margin: 0 auto;text-align: center;height: 100%;padding: 20px;">
                    <div class="p" style="text-align: left;">卡片信息</div>
                    <div class="box">
                        <el-form :inline="true" ref="cardFormRef" :model="dialogForm" class="demo-form-inline" size="small" label-width="82px">
                            <el-form-item label="卡ID">
                                <el-input v-model="dialogForm.cardId" clearable disabled></el-input>
                            </el-form-item>
                            <el-form-item label="人员编号">
                                <el-input v-model="dialogForm.personNumber" clearable disabled></el-input>
                            </el-form-item>
                            <el-form-item label="姓名">
                                <el-input v-model="dialogForm.personName" clearable disabled></el-input>
                            </el-form-item>
                            <el-form-item label="钱包">
                                <el-input v-model="dialogForm.walletTypeValue" clearable disabled></el-input>
                            </el-form-item>
                            <el-form-item label="发生金额">
                                <el-input v-model="dialogForm.price" clearable disabled></el-input>
                            </el-form-item>
                            <el-form-item label="卡余额">
                                <el-input v-model="dialogForm.cardBalance" clearable disabled></el-input>
                            </el-form-item>
                            <el-form-item label="使用次数">
                                <el-input v-model="dialogForm.useCount" clearable disabled></el-input>
                            </el-form-item>
                            <el-form-item label="交易类型">
                                <el-input v-model="dialogForm.typeValue" clearable disabled></el-input>
                            </el-form-item>
                            <el-form-item label="交易时间">
                                <el-input v-model="dialogForm.transactDate" clearable disabled></el-input>
                            </el-form-item>
                        </el-form>
                    </div>
                    <div style="margin: 20px;display: flex;align-items: center;justify-content: center;">
                        <el-form ref="cardFormRef" :model="dialogFormSet" class="demo-form-inline" size="small" label-width="82px">
                            <el-form-item label="正确金额">
                                <el-input v-model="cardPrice" clearable @input="sums"></el-input>
                            </el-form-item>
                            <el-form-item label="冲销金额">
                                <el-input v-model="cost" clearable disabled></el-input>
                            </el-form-item>
                        </el-form>
                    </div>
                    <div style="margin: 20px;display: flex;align-items: center;justify-content: center;">
                        <el-button type="success" style="margin-left: 20px" @click="sure">提交</el-button>
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
import Allapi from "@/assets/api/school/Card";
import Pay from "@/assets/api/school/Pay";
export default {
    data() {
        return {
            pickerOptions0: {
                disabledDate: (time) => {
                    if (this.filter.endDate != "" && this.filter.endDate != null) {
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
            awaitArr: [],
            tableData: [],
            total: 0,
            cardPrice: '',
            cost: 0,
            pageNumber: 1,
            pageSize: 10,
            condition:false,
            showCard:false,
            readCardLoading:false,
            filter: {
                walletType: '',
                type: '',
                startDate: '',
                endDate: '',
            },
            moneyTypes: [{
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
                    key: 1,
                    label: '消费'
                },
                {
                    key: 5,
                    label: '充值'
                },
                {
                    key: 6,
                    label: '补贴'
                },
                {
                    key: 7,
                    label: '缴费'
                },
                {
                    key: 10,
                    label: '提现'
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
                cardId:'',
                personNumber:'',
                personName:'',
                walletTypeValue:'',
                price:'',
                cardBalance:'',
                useCount:'',
                typeValue:'',
                transactDate:'',
            },
            dialogFormSet:{},
            cardData:{}
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

                                let {cardId,personName, mainWallet, subsidyWallet,m1CardSecret,
                                    controlCardSecret} = res.data
                                let par = {
                                    cardId:cardId,
                                    pageNumber: _this.pageNumber,
                                    pageSize: _this.pageSize,
                                    ..._this.filter
                                }
                                fetch.get(Allapi.writeoff, par, res => {
                                    if (res.code == 200) {
                                        _this.tableData = res.data
                                        _this.total = res.total
                                        _this.readCardLoading = false
                                    } else {
                                        _this.tableData = []
                                        _this.total = 0
                                        _this.$message({
                                            type: 'warning',
                                            message: res.message
                                        })
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
        sure(){
            if(this.cardPrice === '' || this.cardPrice === undefined) {
                this.$message({
                    type: 'warning',
                    message: '请输入金额！'
                })
                return
            }
            var num = /^[1-9]\d*$/;
            if(!num.test(this.cardPrice)){
                this.$message({
                    type: 'error',
                    message: '输入金额有误！'
                })
                return
            }
            if(this.cardPrice < 0) {
                this.$message({
                    type: 'warning',
                    message: '输入金额不能小于0！'
                })
                return
            }
            // if(this.cardPrice > 20000){
            //     this.$message({
            //         type: 'error',
            //         message: '输入金额有误！'
            //     })
            //     return
            // }
            let par = {
                id:this.dialogForm['id'],
                mainWallet:this.cardData['mainWallet'],
                subsidyWallet:this.cardData['subsidyWallet'],
                waterNumber:this.cardData['useCount'],
                practicalPrice:this.cardPrice,
                writeoffPrice:this.cost,
                cardId:this.cardData['cardId'],
            }
            fetch.post(Allapi.writeoff, par, res => {
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
                    };
                    ws.onopen = () => {
                        console.log(_this.cost);
                        if (_this.cost > 0) {
                            chongzhi()
                            async function chongzhi() {
                                let result = await new Promise((resolve) => {
                                    ws.send(
                                        JSON.stringify({
                                            type: '05',
                                            data: {
                                                m11Key: _this.cardData.m1CardSecret,
                                                controlKey: _this.cardData.controlCardSecret,
                                                money: _this.cost,
                                                type: _this.dialogForm.walletTypeValue === '主钱包'?1:2,
                                                validDate: _this.dialogForm.walletTypeValue === '主钱包'? '' : _this.cardData.cardIndate
                                            }
                                        })
                                    )
                                    ws.onmessage = rl => {
                                        let _res = JSON.parse(rl.data)
                                        resolve(_res)
                                    }
                                })
                                ws.close()
                                if(result.code === 200) {
                                    _this.$message({
                                        type: 'success',
                                        message: res.message
                                    })
                                    _this.showCard = false
                                    _this.readCard()
                                } else {
                                    _this.$message({
                                        type: 'warning',
                                        message: result.message
                                    })
                                    let par = {
                                        cardId: _this.cardData.cardId,
                                        walletType: _this.dialogForm.walletTypeValue === '主钱包'?1:2,//1 主钱包 2补贴钱包
                                        priceType: 2,//撤回类型 1 加 2 减
                                        price: _this.cost,
                                    }
                                    fetch.post(Pay.toRecall, par, res => {
                                        //撤回钱
                                    })
                                }

                            }
                        } else {
                            koukuan()
                            async function koukuan() {
                                let result = await new Promise((resolve) => {
                                    ws.send(
                                        JSON.stringify({
                                            type: '06',
                                            data: {
                                                m11Key: _this.cardData.m1CardSecret,
                                                controlKey: _this.cardData.controlCardSecret,
                                                money: Math.abs(_this.cost),
                                                type: _this.dialogForm.walletTypeValue === '主钱包'?1:2,
                                                validDate: _this.dialogForm.walletTypeValue === '主钱包'? '' : _this.cardData.cardIndate
                                            }
                                        })
                                    )
                                    ws.onmessage = rl => {
                                        let _res = JSON.parse(rl.data)
                                        resolve(_res)
                                    }
                                })
                                ws.close()
                                if(result.code === 200) {
                                    _this.$message({
                                        type: 'success',
                                        message: res.message
                                    })
                                    _this.showCard = false
                                    _this.readCard()
                                } else {
                                    _this.$message({
                                        type: 'warning',
                                        message: result.message
                                    })
                                    let par = {
                                        cardId: _this.cardData.cardId,
                                        walletType: _this.dialogForm.walletTypeValue === '主钱包'?1:2,//1 主钱包 2补贴钱包
                                        priceType: 1,//撤回类型 1 加 2 减
                                        price: Math.abs(_this.cost),
                                    }
                                    fetch.post(Pay.toRecall, par, res => {
                                        //撤回钱
                                    })
                                }

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
        },
        reset(){
            for (const key in this.filter) {
                this.filter[key] = ''
            }
        },
        closeDialog(){
            this.cardPrice = ''
        },
        handleSelectionChange(val) {
        	this.awaitArr = val
        },
        shows(){
            if (this.awaitArr.length == 0) {
                this.$message({
                    type: 'warning',
                    message: '请选择冲销人员'
                })
            }else if (this.awaitArr.length > 1) {
                this.$message({
                    type: 'warning',
                    message: '请重新选择人员'
                })
            }else{
                this.dialogForm = this.awaitArr[0]
                this.cost = this.dialogForm.price - this.cardPrice
                this.showCard = true
            }
        },
        sums(){
            if (this.dialogForm.typeValue === '消费'||this.dialogForm.typeValue === '缴费'||this.dialogForm.typeValue === '提现') {
                this.cost = this.dialogForm.price - this.cardPrice
            }else{
                this.cost = this.cardPrice - this.dialogForm.price
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
		padding: 20px 0;
		padding-bottom: 0;
	}
</style>
