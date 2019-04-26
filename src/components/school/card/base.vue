<template>
<div class="wrap">
    <div class="block">
        <div class="header">
            <div class="fitler-wrap">
                <el-form :inline="true" :model="tFilter" label-width="80px" class="demo-form-inline">
                    <el-form-item label="人员类别">
                        <el-select v-model="deptName" clearable placeholder="全部" @change="changes(deptName)">
                            <el-option v-for="item in manTypes" :key="item.id" :label="item.label" :value="item.label"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="人员归属">
                        <template v-if="deptName === '学生'">
                            <el-select v-model="sFilter.gradeId" clearable placeholder="全部" @change="getClassList">
                                <el-option v-for="item in gradeList" :key="item.gradeId" :label="item.studyPhase + item.gradeName" :value="item.gradeId"></el-option>
                            </el-select>
                            <el-select v-model="sFilter.classId" clearable placeholder="全部">
                                <el-option v-for="item in classList" :key="item.classId" :label="item.className" :value="item.classId"></el-option>
                            </el-select>
                        </template>
                        <template v-else>
                            <el-select v-model="deptId" clearable placeholder="全部">
                                <el-option v-for="item in group" :key="item.id" :label="item.deptname" :value="item.id"></el-option>
                            </el-select>
                        </template>
                    </el-form-item>
                </el-form>
            </div>
            <div class="fitler-wrap">
                <el-form :inline="true" :model="tFilter" class="demo-form-inline">
                    <el-form-item label="人员编号">
                        <el-input v-model="tFilter.personNumber" clearable placeholder="请输入"></el-input>
                    </el-form-item>
                    <el-form-item label="人员姓名">
                        <el-input v-model="tFilter.personName" placeholder="请输入姓名"></el-input>
                    </el-form-item>
                    <el-form-item label="手机号码">
                        <el-input v-model="tFilter.contactNumber" placeholder="请输入手机号码"></el-input>
                    </el-form-item>
                    <el-form-item label="卡ID">
                        <el-input v-model="tFilter.cardId" clearable placeholder="请输入"></el-input>
                    </el-form-item>
                    <el-form-item label="卡状态">
                        <el-select v-model="tFilter.cardStatus" clearable placeholder="全部">
                            <el-option v-for="item in cardStateOps" :key="item.key" :label="item.label" :value="item.key"></el-option>
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
                        <el-button type="success" @click="batchCard(awaitArr)">批量发卡</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="success" @click="show('read')" :loading="readCardLoading">读卡</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="success" @click="shows('set')">工本费设置</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="success" :loading="secretLoading" @click="secret">发放母卡</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>   
                

            
        <div class="tableData">
            <el-table ref="singleTable" :data="tabType == 'staff'?tData:sData" highlight-current-row style="width: 100%" @selection-change="handleSelectionChange1">
                <el-table-column type="selection" align="center" width="60"></el-table-column>
                <el-table-column label="人员类别" property="personTypeValue" align="center"></el-table-column>
                <el-table-column label="人员编号" property="personNumber" align="center"></el-table-column>
                <el-table-column property="personName" label="人员姓名" align="center"></el-table-column>
                <el-table-column prop="personBelong" label="人员归属" align="center">
                </el-table-column>
                <el-table-column label="手机号码" property="contactNumber" align="center"></el-table-column>
                <el-table-column property="cardId" align="center" label="卡ID"></el-table-column>
                <el-table-column prop="cardStatusValue" align="center" label="卡状态">
                </el-table-column>
                <el-table-column label="卡余额" align="center">
                    <el-table-column property="mainWallet" label="主钱包" align="center"></el-table-column>
                    <el-table-column property="subsidyWallet" label="补贴钱包" align="center"></el-table-column>
                </el-table-column>
                <el-table-column property="useCount" label="使用次数" align="center"></el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" v-if="scope.row.cardStatus !== 1" @click="handle('send', scope.row)">发卡</el-button>
                        <el-button type="text" v-if="scope.row.cardStatus === 1" @click="handle('loss', scope.row)">挂失</el-button>
                        <el-button type="text" v-if="scope.row.cardStatus === 4" @click="handle('unloss', scope.row)">解挂</el-button>
                        <el-button type="text" v-if="scope.row.cardStatus === 4" @click="handle('cancel',scope.row)" :disabled="scope.row.cardStatus == 0 ? true : false">{{scope.row.cardStatus == 0 ? '处理中' : '无卡注销'}}</el-button>
						
                    </template>
                </el-table-column>
            </el-table>
            <template v-if="tabType == 'student'">
                <div class="fenye" v-if="sTotal != 0">
                    <div class="fenye_title">
                        共 {{sTotal}} 条数据 每页 {{pageSize}} 条数据 共 {{Math.floor(sTotal/pageSize) + (sTotal%pageSize != 0 ? 1 : 0)}}
                        页
                    </div>
                    <el-pagination :current-page.sync="pageNumber" @current-change="getData" :page-size="pageSize" layout="prev, pager, next, jumper" :total="sTotal"></el-pagination>
                </div>
            </template>
            <template v-else>
                <div class="fenye" v-if="tTotal != 0">
                    <div class="fenye_title">
                        共 {{tTotal}} 条数据 每页 {{pageSize}} 条数据 共 {{Math.floor(tTotal/pageSize) + (tTotal%pageSize != 0 ? 1 : 0)}}
                        页
                    </div>
                    <el-pagination :current-page.sync="pageNumber" @current-change="getData" :page-size="pageSize" layout="prev, pager, next, jumper" :total="tTotal"></el-pagination>
                </div>
            </template>
        </div>
        <!-- 读卡 -->
        <div class="el-title">
            <el-dialog :title="dialogType == 'read'? '卡信息':'发卡信息'" @closed="closeDialog" :visible.sync="showCard" width="1000px" center>
                <div style="width: 100%;height: 100%;padding: 20px;">
                    <div class="p">人员信息</div>
                    <div class="box">
                        <el-form :inline="true" ref="userFormRef" :model="dialogForm" class="demo-form-inline" size="small" label-width="82px">
                            <el-form-item label="人员类别">
                                <el-input v-model="dialogForm.personTypeValue" clearable disabled></el-input>
                            </el-form-item>
                            <el-form-item label="人员编号">
                                <el-input v-model="dialogForm.personNumber" clearable disabled></el-input>
                            </el-form-item>
                            <el-form-item label="人员姓名">
                                <el-input v-model="dialogForm.personName" clearable disabled></el-input>
                            </el-form-item>
                            <el-form-item label="人员归属">
                                <el-input v-model="dialogForm.personBelong" clearable disabled></el-input>
                            </el-form-item>
                            <el-form-item label="手机号码">
                                <el-input v-model="dialogForm.contactNumber" clearable disabled></el-input>
                            </el-form-item>
                            <el-form-item label="身份证号">
                                <el-input v-model="dialogForm.identityCard" clearable disabled></el-input>
                            </el-form-item>
                        </el-form>
                    </div>
                </div>
                <div style="width: 100%;height: 100%;padding:0 20px;">
                    <div class="p">卡片信息</div>
                    <div class="box">
                        <el-form :inline="true" ref="cardFormRef" :model="dialogForm" class="demo-form-inline" size="small" label-width="82px">
                                <el-form-item label="卡ID" prop="cardId">
                                    <el-input v-model="dialogForm.cardId" clearable disabled></el-input>
                                </el-form-item>
                                <el-form-item label="工本费" prop="cost">
                                    <el-input v-model="dialogForm.cost" clearable disabled></el-input>
                                </el-form-item>
                                <el-form-item label="卡押金" prop="cashPledge">
                                    <el-input v-model="dialogForm.cashPledge" clearable disabled></el-input>
                                </el-form-item>
                                <el-form-item label="发卡类型" prop="sendCardType">
                                    <el-select v-model="dialogForm.sendCardType" :disabled="dialogType == 'send'? false :true">
                                        <el-option v-for="item in cardTypes" :key="item.key" :label="item.label" :value="item.key"></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="卡有效期" prop="cardIndate">
                                    <el-select v-model="dialogForm.cardIndate" :disabled="dialogType == 'send'? false :true">
                                        <el-option v-for="item in years" :key="item.key" :label="item.label" :value="item.key"></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="卡分组" prop="cardGroupType">
                                    <el-select v-model="dialogForm.cardGroupType" :disabled="dialogType == 'send'? false :true">
                                        <el-option v-for="item in Cardgroups" :key="item.key" :label="item.label" :value="item.key"></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="次限额" prop="onceQuota">
                                    <el-input v-model.number="dialogForm.onceQuota" clearable :disabled="dialogType == 'read'||typeof dialogType == 'number'"></el-input>
                                </el-form-item>
                                <el-form-item label="日限额" prop="dayQuota">
                                    <el-input v-model.number="dialogForm.dayQuota" clearable :disabled="dialogType == 'read'||typeof dialogType == 'number'"></el-input>
                                </el-form-item>
                        </el-form>
                    </div>
                </div>
                <div style="width: 100%;height: 100%;padding:20px 20px 0;" v-if="dialogType == 'send'">
                    <div class="p">卡密码信息</div>
                    <div class="boxs" style="padding-bottom: 0;">
                        <el-form :inline="true" ref="cardFormRef" :model="dialogForm" class="demo-form-inline" size="small" label-width="82px">
                                <el-form-item label="卡密码" prop="excessPwd">
                                    <el-input v-model="dialogForm.excessPwd" clearable disabled></el-input>
                                </el-form-item>
                                <el-form-item label="说明:">
                                    <span style="color:red">密码为学生手机号后6位（没有手机号码的随机生成），该密码用于自助充值机操作及超额交易</span>
                                </el-form-item>
                        </el-form>
                    </div>
                </div>
                <div style="width: 100%;height: 100%;padding: 20px;">
                    <div class="p" v-if="dialogType != 'send'">操作</div>
                    <div class="boxs" v-if="dialogType != 'send'">
                        <el-button style="background-color:rgb(22, 155, 213);border-color:rgb(22, 155, 213);" type="success" @click="reqSend(2)">修改卡分组</el-button>
                        <el-button style="background-color:rgb(22, 155, 213);border-color:rgb(22, 155, 213);" type="success" @click="reqSend(1)">延长有效期</el-button>
                        <el-button style="background-color:rgb(22, 155, 213);border-color:rgb(22, 155, 213);" type="success" @click="reqSend(3)">注销</el-button>
                    </div>
                    <div style="margin: 20px;display: flex;align-items: center;justify-content: center;">
                        <el-button type="success" @click="readCard" :loading="readCardLoading" v-if="dialogType == 'read'">重新读卡</el-button>
                        <el-button type="success" :loading="sendCardLoading" v-if="dialogType == 'send'" @click="reqSendCard(dialogForm)">发卡</el-button>
                        <el-button type="success" @click="showCard = false">返回</el-button>
                    </div>
                </div>
            </el-dialog>
        </div>
        <!-- 设置 -->
        <div class="el-title">
            <el-dialog title="工本费设置" @closed="closeDialog" :visible.sync="showCards" width="600px" center>
                <div style="width: 490px;margin: 0 auto;text-align: center;height: 100%;padding: 20px;">
                    <div class="p" style="text-align: left;">卡片信息</div>
                    <div class="box">
                        <el-form :inline="true" ref="cardFormRef" :model="dialogForm" class="demo-form-inline" size="small" label-width="82px">
                            <el-form-item label="工本费" prop="cost">
                                <el-input v-model="dialogFormSet.cost" clearable></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-checkbox v-model="checked">注销退还</el-checkbox>
                            </el-form-item>
                            <!-- <br /> -->
                            <el-form-item label="卡押金" prop="cashPledge">
                                <el-input v-model="dialogFormSet.cashPledge" clearable></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-checkbox v-model="checkeds">注销退还</el-checkbox>
                            </el-form-item>
                        </el-form>
                    </div>
                    <div style="margin: 20px;display: flex;align-items: center;justify-content: center;">
                        <el-button type="success" style="margin-left: 20px" @click="suer">确定</el-button>
                        <el-button type="success" style="margin-left: 20px" @click="showCards = false">返回</el-button>
                    </div>
                </div>
            </el-dialog>
        </div>
        <!-- 设置1 -->
        <div class="el-title">
            <el-dialog :title="dialogTypes == 1?'延长有效期':(dialogTypes == 2?'修改卡分组':'注  销')" @closed="closeDialogs" :visible.sync="showReqSend" width="600px" center>
                <div style="width: 490px;margin: 0 auto;text-align: center;height: 100%;padding: 20px;">
                    <div class="p" style="text-align: left;">卡片信息</div>
                    <div class="box">
                        <el-form :inline="true" ref="cardFormRef" :model="dialogForm" class="demo-form-inline" size="small" label-width="82px">
                            <template v-if="dialogTypes == 1">
                                <el-form-item label="有效期延时" prop="indete">
                                    <el-select v-model="dialogForm.indete">
                                        <el-option v-for="item in years" :key="item.key" :label="item.label" :value="item.key"></el-option>
                                    </el-select>
                                </el-form-item>
                            </template>
                            <template v-if="dialogTypes == 2">
                                <el-form-item label="修改卡分组" prop="cardGroupType">
                                    <el-select v-model="dialogForm.cardGroupType">
                                        <el-option v-for="item in Cardgroups" :key="item.key" :label="item.label" :value="item.key"></el-option>
                                    </el-select>
                                </el-form-item>
                            </template>
                            <template v-if="dialogTypes == 3||dialogTypes == 4">
                                <el-form-item label="应退卡金额" prop="cardPrice">
                                    <el-input v-model="dialogForm.cardPrice" clearable disabled></el-input>
                                </el-form-item>
                                <el-form-item label="应退卡押金" prop="cashPledge">
                                    <el-input v-model="dialogForm.cashPledges" clearable disabled></el-input>
                                </el-form-item>
                                <el-form-item label="应退工本费" prop="cost">
                                    <el-input v-model="dialogForm.costs" clearable disabled></el-input>
                                </el-form-item>
                            </template>
                        </el-form>
                    </div>
                    <div style="margin: 20px;display: flex;align-items: center;justify-content: center;">
                        <el-button type="success" style="margin-left: 20px" @click="reqSendCards(1)" v-if="dialogTypes == 1">修改</el-button>
                        <el-button type="success" style="margin-left: 20px" @click="reqSendCards(2)" v-if="dialogTypes == 2">修改</el-button>
                        <el-button type="warning" :disabled="islogout" style="margin-left: 20px" @click="reqSendCards(3)" v-if="dialogTypes == 3">注销</el-button>
                        <el-button type="warning" :disabled="islogout" style="margin-left: 20px" @click="Cancellation" v-if="dialogTypes == 4">注销</el-button>
                        <el-button type="success" style="margin-left: 20px" @click="showReqSend = false">返回</el-button> 
                    </div>
                </div>
            </el-dialog>
        </div>
    </div>
</div>
</template>

<script>
import parents from "@/assets/api/parents";
import fetch from "@/assets/tools/fetch";
import teacher from "@/assets/api/teacher";
import schoolApi from "@/assets/api/school";
import Allapi from "@/assets/api/school/Card";
export default {
    data() {
        return {
            checked:false,
            checkeds:false,
            deptId:'',
            deptName:'',
            personType:'',
            cardId:"",
            cardIndate:'',
            m1CardSecret:'',
            controlCardSecret:'',
            indete:'',
            dialogType: 'read', // dialog 类型 默认读卡read 也包含send 发卡状态 ； 内部内容也由 tabType 选项卡内容进行切换
            dialogTypes: 1,//xiugai
            readCardLoading: false, // 读卡loading
            sendCardLoading: false, // 发卡loading
            secretLoading:false,
            tFilter: {
                personNumber: "",
                contactNumber: "",
                personName: "",
                cardStatus: "",
                cardId: "",
            },
            tData: [],
            tTotal: 0,
            sFilter: {
                gradeId: "",
                classId: ""
            },
            sData: [],
            sTotal: 0,
            tabType: "staff",
            showCard: false,
            showCards: false,
            showCardCancel: false,
            showReqSend:false,
            pageNumber: 1,
            pageSize: 10,
            cardStateOps: [{
                    key: 4,
                    label: "挂失"
                },
                {
                    key: 1,
                    label: "正常"
                },
                {
                    key: 2,
                    label: "注销"
                },
                {
                    key: 3,
                    label: "未发卡"
                }
            ],
                mainWallet: '', // 主钱包
                subsidyWallet: '', // 补贴钱包
            gradeList: [],
            classList: [],
            dialogForm: {
            	id: '', // 发卡人的id
                personTypeValue: "",//人员类别
                personNumber: "",//人员编号
                personName: "",//人员姓名
                personBelong: "",//人员归属
                identityCard: '', // 身份证号
                sex: '',
                contactNumber: '', // 手机号
                duty: '', // 职务
                studentId: '', // 学生学号
                studentName: '',
                gradeName: '',
                className: '',
                attendType: '', // 学生就读方式
                deptName: '',
                m1CardSecret: '', // 卡秘钥
                controlCardSecret: '', // 卡空密码
                excessPwd: '', // 消费超额密码
                cardId: '', // 发卡时的卡id
                personId: '', // 卡人 id
                cardPrice: '', // 卡余额
                physicsId: '', // 物理id
                onceQuota: '', // 次限额
                dayQuota: '',
                useCount: '', // 使用次数
                cardIndate: '', // 卡有效期
                sendCardType: '', // 发卡类型
                cardGroupType: '', //卡分组
                cashPledge:'',
                cost:'',
                cashPledges:'',
                costs:'',
                bumen: '',
                cardStatus: '',
                indete: '', // 卡有效期延时时间
                mainWallet: '', // 主钱包
                subsidyWallet: '', // 补贴钱包
            }, // dialog 卡信息
            dialogFormSet:{
                cost:'',
                cashPledge:''
            },
            years: [
                {
                    key: 1,
                    label: '一年'
                },
                {
                    key: 2,
                    label: '二年'
                },
                {
                    key: 3,
                    label: '三年'
                },
                {
                    key: 4,
                    label: '四年'
                },
                {
                    key: 5,
                    label: '五年'
                },
                {
                    key: 6,
                    label: '六年'
                }
            ],
            cardTypes: [
                {
                    key: 0,
                    label: '新卡'
                },
                {
                    key: 1,
                    label: '补卡'
                }
            ],
            manTypes: [
                {
                    key: '',
                    label: '全部'
                },
                {
                    key: 1,
                    label: '教职工'
                },
                {
                    key: 2,
                    label: '学生'
                }
            ],
            islogout: false, // 注销禁用 在后台钱 和卡的钱不等是设置
            group: [],
            Cardgroups: [
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
            awaitArr: [], // 学生批量等待
            count: 0, // 全局批量计次
            
        };
    },
    created() {
        this.getData();
    },
    methods: {
        changes(i){// table栏切换
            if (i === '学生') {
                this.personType = 2
                this.tabType = 'student'
                // 获取年级列表
                fetch.get(teacher.grade, "", res => {
                    if (res.code == 200) {
                        this.gradeList = res.data;
                    } else {
                        this.gradeList = [];
                    }
                });
            }else if(i === '教职工') {
                this.personType = 1
                this.tabType = 'staff'
                //部门
                fetch.get(teacher.dept, "", res => {
                    if (res.code == 200) {
                        this.group = res.data;
                    } else {
                        this.group = [];
                    }
                });
            }else {
                this.personType = ''
                this.tabType = ''
            }
            this.reset(); // 重置数据
            this.pageNumber = 1;
            this.awaitArr = [];
            this.gradeList = [];
            this.group = [];
            this.deptId = '';
            this.getData()
        },
        suer(){
            var num = /^[1-9]\d*$/;
            if(!num.test(this.dialogFormSet.cost) || !num.test(this.dialogFormSet.cashPledge) || this.dialogFormSet.cost > 100 || this.dialogFormSet.cashPledge > 100){
                this.$message({
                    type: 'error',
                    message: '输入金额有误！'
                })
                return
            }
            let par = {
                logoutCost:this.checked,
                logoutCashPledge:this.checkeds,
                ...this.dialogFormSet
            }
            fetch.post(Allapi.cost, par, res => {
                if (res.code == 200) {
                    this.$message({
                        type:'success',
                        message:'设置成功！'
                    })
                    this.showCards = false
                } else {
                    this.$message({
                        type: 'warning',
                        message: res.message
                    })
                }
            });
        },
        indexMethod(index) {
            return index + 1 + (this.pageNumber - 1) * this.pageSize;
        },
        secret(){
        	if("WebSocket" in window){
                var ws = new WebSocket(schoolApi.ws);
                let _this = this
                ws.onopen = function(){
                    _this.secretLoading = true
                    fetch.get(Allapi.secret, '', res => {
                        if(res.code === 200){
                            getId()
                            async function getId(){
                                let id = await new Promise((resove) => {
                                    ws.send(JSON.stringify({type: '08', data: {m11Key: res.data.m1CardSecret}}))
                                    ws.onmessage = re => {
                                        let a = JSON.parse(re.data)
                                        if(a.code === 200){
                                            _this.$message({
                                                type: 'success',
                                                message: a.message
                                            })
                                            ws.close()
                                        }else{
                                            _this.$message({
                                                type: 'warning',
                                                message: a.message
                                            })
                                            ws.close()
                                            return
                                        }
                                    }
                                })
                            }
                        }else{
                            _this.$message({
                                type: 'warning',
                                message: res.message
                            })
                            ws.close()
                        }
                    })
                    
                };
                
                ws.onerror = function(){ 
                    _this.$message({
                    	type: 'error',
                    	message: '连接失败！'
                    })
					_this.secretLoading = false
                };
                  
                ws.onclose = function(){ 
					_this.secretLoading = false
                };
				
                return ws
                
            }else{
                alert("您的浏览器不支持 WebSocket!");
            }
        },
        findCx() {
            this.pageNumber = 1
            this.getData()
        },
        getData() {
            if (this.tabType == "staff") {
                let par = {
                    personType:this.personType,
                    deptId:this.deptId,
                    pageNumber: this.pageNumber,
                    pageSize: this.pageSize,
                    ...this.tFilter
                };
                fetch.get(Allapi.basic, par, res => {
                    if (res.code == 200) {
                        this.tData = res.data;
                        this.tTotal = res.total;
                    } else {
                        this.tData = [];
                        this.tTotal = 0;
                    }
                }, {
                target: '.el-table__body-wrapper'
            });
            } else {
                let par = {
                    personType:this.personType,
                    pageNumber: this.pageNumber,
                    pageSize: this.pageSize,
                    ...this.tFilter,
                    ...this.sFilter
                };
                fetch.get(Allapi.basic, par, res => {
                    if (res.code == 200) {
                        this.sData = res.data;
                        this.sTotal = res.total;
                    } else {
                        this.sData = [];
                        this.sTotal = 0;
                    }
                }, {
                target: '.el-table__body-wrapper'
            });
            }
        },
        // 重置 filter 表单
        reset() {
            for (const key in this.tFilter) {
                this.tFilter[key] = "";
            }
            for (const key in this.sFilter) {
                this.sFilter[key] = "";
            }
        },
        reqSend(i){
            this.dialogTypes = i;
            if (i === 3) {
                fetch.get(Allapi.logout, {cardId: this.cardId, type: 1}, res => {
                    if (res.code == 200) {
                        this.dialogForm.costs = res.data.cost
                        this.dialogForm.cashPledges = res.data.cashPledge
                        this.dialogForm.cardPrice = res.data.backPrice
                    } else {
                        this.dialogForm.costs = 0
                        this.dialogForm.cashPledges = 0
                        this.dialogForm.cardPrice = 0
                    }
                });
            }
            this.showReqSend = true
        },
        show(t, id) { // 显示 dialog
            this.dialogType = t;
            if(t == 'send'){ // 如果显示 dialog为发卡状态 则请求发卡信息
                this.getSendCardInfo(this.tabType, id)
            }else if(t == 'read'){
                this.readCard()
            }
            this.showCard = true
        },
        shows(t) { 
            this.dialogType = t
            this.showCards = true;
            fetch.get(Allapi.cost, "", res => {
                if (res.code == 200) {
                    this.dialogFormSet.cost = res.data.cost
                    this.dialogFormSet.cashPledge = res.data.cashPledge
                    this.checked = res.data.logoutCost
                    this.checkeds = res.data.logoutCashPledge
                } else {
                    this.checked = false
                    this.checkeds = false
                    this.dialogFormSet.cost = 0
                    this.dialogFormSet.cashPledge = 0
                    this.$message({
                        type: 'warning',
                        message: res.message
                    })
                }
            });
        },
        getClassList() {
            // 获取年级列表
            this.sFilter.classId = "";
            this.classList = [];
            if (this.sFilter.gradeId == "") {
                return;
            }
            fetch.get(
                teacher.class, {
                    gradeId: this.sFilter.gradeId
                },
                res => {
                    if (res.code == 200) {
                        this.classList = res.data;
                    } else {
                        this.classList = [];
                    }
                }
            );
        },
        handleSelectionChange2(val) {
        	this.awaitArr = val
        },
        handleSelectionChange1(val) {
        	this.awaitArr = val
        },
        handle(type, row) { // 操作
            this.cardId = row.cardId
            if (type == "send") {
                this.show('send', this.tabType == 'staff' ? row.id : row.id)
            } else if (type == "loss") {
                this.$confirm("是否挂失？", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(() => {
                    fetch.post(schoolApi.lossCard, {cardId: row.cardId}, res => {
                        if(res.code === 200){
                            this.$message({
                                type: 'success',
                                message: res.message
                            })
                            this.getData()
                        } else {
                            this.$message({
                                type: 'warning',
                                message: res.message
                            })
                        }
                        
                    })
                });
            } else if (type == "unloss") {
                this.$confirm("是否解挂？", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(() => {
                    fetch.post(schoolApi.relieveLossCard, {cardId: row.cardId}, res => {
                        if(res.code === 200){
                            this.$message({
                                type: 'success',
                                message: res.message
                            })
                            this.getData()
                            
                        } else {
                            this.$message({
                                type: 'warning',
                                message: res.message
                            })
                        }
                    })
                });
            }else{
                if(row.cardStatus === 2 || row.cardStatus === 3) {
					this.$message({
						type: 'warning',
						message: '当前状态不可注销！'
					})
					return
                }
                fetch.get(Allapi.logout, {cardId: row.cardId, type: 2}, res => {
                    if (res.code == 200) {
                        this.dialogForm.costs = res.data.cost
                        this.dialogForm.cashPledges = res.data.cashPledge
                        this.dialogForm.cardPrice = res.data.backPrice
                    } else {
                        this.dialogForm.costs = 0
                        this.dialogForm.cashPledges = 0
                        this.dialogForm.cardPrice = 0
                    }
                });
                this.dialogTypes = 4
                this.showReqSend = true
            }
        },
        Cancellation(){
            fetch.post(schoolApi.cardLogout, {
                cardId: this.cardId,
                type: 2
            }, res => {
                if(res.code === 200) {
                    this.$message({
                        type: 'success',
                        message: res.message
                    })
                    this.showCard = false;
                    this.showReqSend = false
                    this.getData()
                }else {
                    this.$message({
                        type: 'warning',
                        message: res.message
                    })
                }

            })
        },
        // dialog 关闭触发
        closeDialog(){
            this.islogout = false
            // this.$refs['cardFormRef'].resetFields()
            // this.$refs['userFormRef'].resetFields()
            this.readCardLoading = false
            this.sendCardLoading = false
            // 重置表单
            this.resetForm()
            
            if(this.count > 0){
            	this.count--
            	if(this.count > 0){
            		this.show('send', this.awaitArr[this.awaitArr.length - this.count].id)
            	}else{
            		this.count = 0
            		this.awaitArr = []
            		this.$refs.singleTable.clearSelection();
            	}
            	
            	
            	
            }
            
        },
        closeDialogs(){
            //
        },
        // 读取硬件 card
        readEquiqment(par){
            if("WebSocket" in window){
                // 打开一个 web socket
                var ws = new WebSocket(schoolApi.ws);
                ws.onopen = function(){
                    // Web Socket 已连接上，使用 send() 方法发送数据
                    ws.send(JSON.stringify(par));
                };
                
                ws.onerror = function(){ 
                    // 关闭 websocket
                    alert('连接失败！')
                };
                  
                ws.onclose = function(){ 
                    // 关闭 websocket
                    console.log('连接关闭')
                };
				
                return ws
                
            }else{
                // 浏览器不支持 WebSocket
                alert("您的浏览器不支持 WebSocket!");
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
		                        let {personTypeValue, personNumber, personName, personBelong, identityCard,sendCardType, contactNumber,m1CardSecret,
                                    controlCardSecret,mainWallet,subsidyWallet,useCount,cost,cashPledge,cardIndate,cardId,excessPwd,cardGroupType,
                                    onceQuota,dayQuota} = res.data
		                            _this.dialogForm.cardGroupType = res.data.cardGroupType
		                            _this.dialogForm.cardStatus = res.data.cardStatus
                                    _this.personType = res.data.personType
                                    _this.cardId = res.data.cardId
                                    _this.m1CardSecret = res.data.m1CardSecret
                                    _this.controlCardSecret = res.data.controlCardSecret
                                    _this.cardIndate = res.data.cardIndate
                                    _this.dialogForm.m1CardSecret = m1CardSecret
                                    _this.dialogForm.controlCardSecret = controlCardSecret
                                
                                // 用户信息
                                _this.dialogForm['personTypeValue'] = personTypeValue 
                                _this.dialogForm['personNumber'] = personNumber 
                                _this.dialogForm['personName'] = personName 
                                _this.dialogForm['personBelong'] = personBelong
                                _this.dialogForm['contactNumber'] = contactNumber 
                                _this.dialogForm['identityCard'] = identityCard 
                                
                                // 卡信息
                                _this.dialogForm['cardId'] = cardId 
                                _this.dialogForm['excessPwd'] = excessPwd 
                                _this.dialogForm['sendCardType'] = sendCardType
                                _this.dialogForm['cost'] = cost 
                                _this.dialogForm['cashPledge'] = cashPledge 
                                _this.dialogForm['cardGroupType'] = cardGroupType
                                _this.dialogForm['cardIndate'] = cardIndate
                                _this.dialogForm['onceQuota'] = onceQuota 
                                _this.dialogForm['dayQuota'] = dayQuota
								_this.dialogForm['mainWallet'] = mainWallet 
								_this.dialogForm['subsidyWallet'] = subsidyWallet 
                                _this.dialogForm['useCount'] = useCount 
		                        
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
                    // 关闭 websocket
                    _this.$message({
                    	type: 'error',
                    	message: '连接失败！'
                    })
					_this.readCardLoading = false
                };
                  
                ws.onclose = function(){ 
                    // 关闭 websocket
                    console.log('连接关闭')
					_this.readCardLoading = false
                };
				
                return ws
                
            }else{
                // 浏览器不支持 WebSocket
                alert("您的浏览器不支持 WebSocket!");
            }
        	
        },
        // 发卡 并反馈给 后台
        reqSendCard(row){
            this.sendCardLoading = true
            if(row.onceQuota < 0 || row.dayQuota < 0){
                this.$message({
                    type: 'error',
                    message: '输入的金额不能小于0！'
                })
                this.sendCardLoading = false
                return
            }
            if(row.onceQuota > 20000 || row.dayQuota > 20000){
                this.$message({
                    type: 'error',
                    message: '输入的金额有误！'
                })
                this.sendCardLoading = false
                return
            }
        	let count = 0;
        	// 先校验卡是否已被写入
        	
        	if("WebSocket" in window) {
                var ws = new WebSocket(schoolApi.ws);
                let _this = this
        		ws.onerror = function(){ 
                    _this.$message({
                    	type: 'error',
                    	message: '连接失败！'
                    })
                    _this.sendCardLoading = false
               	};
                ws.onclose = function(){ 
                    // 关闭 websocket
                    console.log('连接关闭')
                    _this.sendCardLoading = false
                };
                
                ws.onopen = go => {
                	handle()
                }
                
                var handle = async () => {
                	// 先判断卡是否被写过
                	let isRead = await new Promise(resolve => {
                		ws.send(JSON.stringify({type: '02', data: {m11Key: row.m1CardSecret, controlKey: row.controlCardSecret}}))
                		ws.onmessage = res => {
                			resolve(JSON.parse(res.data))
                		}
                	})
                	if(isRead.code === 202){
                		_this.$message({
                			type: 'warning',
                			message: isRead.message
                		})
                		ws.close()
                		return	
                	}
                	if(isRead.code != 208){
                		_this.$message({
                			type: 'warning',
                			message: '卡已被使用！'
                		})
                		ws.close()
                		return	
                	}
                	let sendCard = await new Promise(resolve => {
                		// 校验用户输入
				        let arr = ['onceQuota', 'dayQuota', 'cardIndate', 'sendCardType', 'cardGroupType'];
				        for(let i = 0, len = arr.length; i < len; i++){
				            if(row[arr[i]] === '' || row[arr[i]] ===  undefined || row[arr[i]] === null){
				                _this.$message({
				                    type: 'error',
				                    message: '请填写完整！'
				                })
				                ws.close()
				                return
				            }
                        }
				        var par = {
				            type: '01',
				            data: {
				                number: row.cardId,
				                name : row.personName,
				                m11Key: row.m1CardSecret,
				                controlKey: row.controlCardSecret,
				                enableTime: new Date().toLocaleDateString().replace(/\//g, '-'),
				                endTime : new Date(new Date().setFullYear(new Date().getFullYear() + row.cardIndate)).toLocaleDateString().replace(/\//g, '-'),
				                consumerPwd : row.excessPwd,
				                singleLimit : row.onceQuota,
				                dailyLimit : row.dayQuota,
				                cardStatus : 1,
				                cardType : _this.dialogForm.cardGroupType
				            }
				        }
				        // 校验
				        for (const key in par.data) {
				            if (par.data[key] === '' || par.data[key] === null || par.data[key] === undefined) {
				                _this.$message({
				                    type: 'error',
				                    message: '发卡参数错误'
				                })
				                ws.close()
				                return
				            }
				        }
				        ws.send(JSON.stringify(par))
				        ws.onmessage = res => {
				        	resolve(JSON.parse(res.data))
				        }
				        
                	})
                	
                	if(sendCard.code != 200){
                		_this.$message({
	                        type: 'warning',
	                        message: '卡写入数据失败'
	                    })
	                    ws.close()
                		return
                	}
                	
                	let pyId = await new Promise(resolve => {
                		
				        var par = {
				            type: '00',
				        }
				        ws.send(JSON.stringify(par))
				        ws.onmessage = res => {
				        	resolve(JSON.parse(res.data))
				        }
				        
                	})
                	
                	if(pyId.code != 200){ // 如果获取物理id 失败 讲不会发送发卡请求给后台，此处讲注销刚才写入的卡
                		_this.$message({
	                        type: 'warning',
	                        message: '卡写入数据失败'
	                    })
                		ws.send(JSON.stringify({type: '03', data: {m11Key: row.m1CardSecret, controlKey: row.controlCardSecret}}))
	                    ws.close()
                		return
                	}
                	let dat = {
                        personId: row.id,
                        id: row.cardId,
                        physicsId: pyId.data.id,
                        onceQuota: row.onceQuota,
                        dayQuota: row.dayQuota,
                        indate: row.cardIndate,
                        sendCardType: row.sendCardType,
                        cardGroupType: _this.dialogForm.cardGroupType,
                        excessPwd: row.excessPwd,
                        controlCardSecret: row.controlCardSecret,
                        cost: row.cost,
                        cashPledge: row.cashPledge,
                        logoutCost:_this.checked,
                        logoutCashPledge:_this.checkeds
                    }
                    fetch.post(Allapi.sendCard, dat, res => {
                        if(res.code === 200){
                        	_this.$message({
                        		type: 'success',
                        		message: '激活成功'
                        	})
                            if(_this.count <= 1){
                            	_this.getData()
                            }
                             _this.showCard = false
                        }else{
                            _this.$message({
                                type: 'warning',
                                message: res.message
                            })
                            _this.sendCardLoading = false
                        	ws.send(JSON.stringify({type: '03', data: {m11Key: row.m1CardSecret, controlKey: row.controlCardSecret}}))
                        }
                    })
                	
                	
                }
        		
        		
        	}else{
        		this.$message({
        			type: 'warning',
        			message: '浏览器不支持WebSocket！'
        		})
        	}
        	
        },
        // 卡特殊操作
        reqSendCards(num) {
            // num： 1 卡延时 2 卡分组修改 3 卡注销 4 卡回收
            // 先对卡进行操作，操作成功后 便调用接口反馈给后台

            // 校验
            if(!this.cardId) {
                this.$message({
                    type: 'warning',
                    message: '请先进行读卡操作！'
                })
                return
            }

            if(num === 1) {

                if(!this.dialogForm.indete) {
						this.$message({
							type: 'warning',
							message: '请选择延期时长！'
						})
						return
					}

					fetch.post(schoolApi.delayCard, {
						cardId: this.cardId,
						indete: this.dialogForm.indete
					}, re => {
						if(re.code === 200) {

							let par = {
								m11Key: this.m1CardSecret,
								controlKey: this.controlCardSecret,
								endTime: new Date(new Date(this.dialogForm.cardIndate).setFullYear(new Date(this.dialogForm.cardIndate).getFullYear() + this.dialogForm.indete)).toLocaleDateString().replace(/\//g, '-')
                            }
							let ws = this.readEquiqment({
								type: '04',
								data: { ...par
								}
							})
							ws.onmessage = res => {
                                if(JSON.parse(res.data).code === 200) {
                                    this.$message({
                                        type: 'success',
                                        message: '操作成功'
                                    })
                                    this.readCard()
                                    this.showReqSend = false
                                }
							}

						}else{
							this.$message({
								type: 'warning',
								message: re.message
							})
						}
					})

            } else if(num === 2) {
                if(this.dialogForm.cardGroupType === '' || this.dialogForm.cardGroupType === null) {
                    this.$message({
                        type: 'warning',
                        message: '请选择分组！'
                    })
                    return
                }

                fetch.post(schoolApi.handleM1Grop, {
                    cardId: this.cardId,
                    cardGroupType: this.dialogForm.cardGroupType
                }, re => {
                    if(re.code === 200) {

                        let par = {
                            m11Key: this.m1CardSecret,
                            controlKey: this.controlCardSecret,
                            cardType: this.dialogForm.cardGroupType
                        }
                            console.log(par);
                        let ws = this.readEquiqment({
                            type: '04',
                            data: { ...par
                            }
                        })
                        ws.onmessage = res => {
                            if(JSON.parse(res.data).code === 200) {
                                this.$message({
                                    type: 'success',
                                    message: '操作成功'
                                })
                                this.readCard()
                                this.showReqSend = false
                            }
                        }
                    }else{
                        this.$message({
                            type: 'warning',
                            message: re.message
                        })
                    }
                })

            } else if(num === 3) {
                 this.$confirm('确定进行有卡注销, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
                    fetch.post(schoolApi.cardLogout, {
                    cardId: this.cardId,
                    type: 1
                }, res => {
                    if (res.code != 200) {
                                this.$message({
                                type: 'warning',
                                message: res.message
                            })
                            return
                        }
                        
                    if("WebSocket" in window) {
                                // 打开一个 web socket
                                var ws = new WebSocket(schoolApi.ws);
                                let _this = this
                                ws.onopen = t => {
                                    handle()
                                    async function handle() {
                                        let last = await new Promise((resolve) => {
                                            ws.send(JSON.stringify({
                                                type: '03',
                                                data: {
                                                    m11Key: _this.m1CardSecret,
                                                    controlKey: _this.controlCardSecret,
                                                }
                                            }))
                                            ws.onmessage = res => {
                                                let _res = JSON.parse(res.data)
                                                resolve(_res)
                                            }
                                        })
                                        if(last.code === 200) {
                                            _this.$message({
                                                type: 'success',
                                                message: '注销成功'
                                            })
                                            _this.getData()
                                            _this.showReqSend = false
                                            _this.showCard = false
                                        }else{
                                            _this.$message({
                                                type: 'warning',
                                                message: last.message
                                            })
                                        }
                                        }

                                    }
                                }else{
                                    this.$message({
                                        type: 'warning',
                                        message: '浏览器不支持WebSocket！'
                                    })
                                }
                })
				}).catch(() => {

				});
                

        
            }

        },
        // 先向后台获取发卡时写入卡中的信息
        getSendCardInfo(type, id){ // type 根据当前tabType 选择请求教职工还是学生
            fetch.get(Allapi.sendCard, {id:id}, res => {
                if(res.code === 200){
                    for (const key in this.dialogForm) {
                        this.dialogForm[key] = res.data[key] || ''
                        if(res.data[key] === 0){
                        	this.dialogForm[key] = res.data[key]
                        }
                    }
                    this.checked = res.data.logoutCost
                    this.checkeds = res.data.logoutCashPledge
                    this.dialogForm.personBelong = res.data.personBelong
                    this.dialogForm.onceQuota = 100
                    this.dialogForm.dayQuota = 300
                    this.dialogForm.cardIndate = 3
                }else{
                    this.$message({
                        type: 'warning',
                        message: res.message
                    })
                    // 重置表单
                    this.resetForm()
                }
            })
        },
        // 重置 dialog 表单
        resetForm(){
        	for (const key in this.dialogForm) {
                this.dialogForm[key] =  ''
            }
        },
        batchCard(arr){
        	if(arr.length === 0){
        		this.$message({
        			type: 'warning',
        			message: '至少勾选一项'
        		})
        	}else{
        		this.count = arr.length;
        		this.show('send', arr[this.awaitArr.length - this.count].id)
        	}
        }
    }
};
</script>

<style scoped>
* {
    box-sizing: border-box;
}

.fitler-wrap{
    margin: 22px 6px 0 6px;
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


.activeTab {
    background-color: #ebf3f0;
    box-shadow: 0px 2px 9px 0px rgba(105, 105, 105, 0.07);
    color: #08b065 !important;
}

.box {
    box-shadow: 0px 1px 3px 0px rgba(41, 48, 56, 0.18);
    margin-top: 5px;
    padding: 20px;
    padding-bottom: 0;
}
.boxs{
    display: flex;
    justify-content: space-around;
    box-shadow: 0px 1px 3px 0px rgba(41, 48, 56, 0.18);
    margin-top: 5px;
    padding: 20px;
}
</style>
