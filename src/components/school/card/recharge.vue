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
							<el-button type="success" @click="show(1)">充值</el-button>
						</el-form-item>
						<el-form-item>
							<el-button type="success" @click="show(2)">提现</el-button>
						</el-form-item>
					</el-form>
				</div>
			</div>

			<div class="tableData">
				<el-table ref="singleTable" :data="tabType == 'staff'?tData:sData" highlight-current-row style="width: 100%">
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
				<el-dialog :title="dialogType === 1? '充值':'提现'" @closed="closeDialog" :visible.sync="showCard" width="1000px" center>
					<div style="width: 100%;height: 100%;padding: 20px;">
						<div class="p">人员信息</div>
						<div class="box">
							<el-form :inline="true" ref="userFormRef" :model="dialogForm" class="demo-form-inline" size="small" label-width="96px">
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
							<el-form :inline="true" ref="cardFormRef" :model="dialogForm" class="demo-form-inline" size="small" label-width="96px">
								<el-form-item label="卡ID" prop="cardId">
									<el-input v-model="dialogForm.cardId" clearable disabled></el-input>
								</el-form-item>
								<el-form-item label="工本费" prop="cost">
									<el-input v-model="dialogForm.cost" clearable disabled></el-input>
								</el-form-item>
								<el-form-item label="卡押金" prop="cashPledge">
									<el-input v-model="dialogForm.cashPledge" clearable disabled></el-input>
								</el-form-item>
								<el-form-item label="主钱包余额" prop="mainWallet">
									<el-input v-model="dialogForm.mainWallet" clearable disabled></el-input>
								</el-form-item>
								<el-form-item label="补贴钱包余额" prop="subsidyWallet">
									<el-input v-model="dialogForm.subsidyWallet" clearable disabled></el-input>
								</el-form-item>
								<el-form-item label="使用次数" prop="useCount">
									<el-input v-model="dialogForm.useCount" clearable disabled></el-input>
								</el-form-item>
								<el-form-item label="卡有效期" prop="cardIndate">
									<el-select v-model="dialogForm.cardIndate" disabled>
										<el-option v-for="item in years" :key="item.key" :label="item.label" :value="item.key"></el-option>
									</el-select>
								</el-form-item>
								<el-form-item label="发卡类型" prop="sendCardType">
									<el-select v-model="dialogForm.sendCardType" disabled>
										<el-option v-for="item in cardTypes" :key="item.key" :label="item.label" :value="item.key"></el-option>
									</el-select>
								</el-form-item>
								<el-form-item label="卡分组" prop="cardGroupType">
									<el-select v-model="dialogForm.cardGroupType" clearable disabled>
										<el-option v-for="item in Cardgroups" :key="item.key" :label="item.label" :value="item.key"></el-option>
									</el-select>
								</el-form-item>
								<el-form-item label="次限额" prop="onceQuota">
									<el-input v-model.number="dialogForm.onceQuota" clearable disabled></el-input>
								</el-form-item>
								<el-form-item label="日限额" prop="dayQuota">
									<el-input v-model.number="dialogForm.dayQuota" clearable disabled></el-input>
								</el-form-item>
							</el-form>
						</div>
					</div>
					<div style="width: 100%;height: 100%;padding: 20px;">
						<div class="box">
							<el-form :inline="true" ref="cardFormRef" :model="dialogForm" label-width="100px" class="demo-form-inline" size="small">
								
								<template v-if="dialogType === 1">
									<el-form-item label="充值金额">
										<el-input v-model="dialogForm.price" clearable></el-input>
									</el-form-item>
									<el-form-item label="钱包">
										<el-select v-model="moneyType">
											<el-option v-for="item in moneyTypes" :key="item.key" :label="item.label" :value="item.key"></el-option>
										</el-select>
									</el-form-item>
									<el-form-item>
										<span style="color:red">注：充值金额范围 1-20000</span>
									</el-form-item>
								</template>
								<template v-else>
									<el-form-item label="提现金额">
										<el-input v-model="dialogForm.price1" clearable></el-input>
									</el-form-item>
									<el-form-item label="钱包">
										<el-select v-model="moneyType">
											<el-option v-for="item in moneyTypes" :key="item.key" :label="item.label" :value="item.key"></el-option>
										</el-select>
									</el-form-item>
									<el-form-item>
										<span style="color:red">注：提现金额须小于等于当前钱包余额</span>
									</el-form-item>
								</template>
								
							</el-form>
						</div>
					</div>
					<div style="width: 100%;height: 100%;padding:0 20px;">
						<div style="margin: 20px;display: flex;align-items: center;justify-content: center;">
							<el-button type="success" :loading="moneyLoading" @click="reqSendCard(1)" v-if="dialogType === 1">充值</el-button>
							<el-button type="success" :loading="moneyLoadings" @click="reqSendCard(2)" v-if="dialogType === 2">提现</el-button>
							<el-button type="success" @click="readCard" :loading="readCardLoading">重新读卡</el-button>
							<el-button type="success" @click="showCard = false">返回</el-button>
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
	import Pay from "@/assets/api/school/Pay";
	import Allapi from "@/assets/api/school/Card";
	export default {
		data() {
			return {
				deptId:'',
				deptName:'',
				moneyType:1,
            	personType:'',
            	cardIndate:'',
				dialogType: 1, // dialog 类型 默认读卡read 也包含send 发卡状态 ； 内部内容也由 tabType 选项卡内容进行切换
				readCardLoading: false, // 读卡loading
				moneyLoading: false, // 金额操作loading
				moneyLoadings: false, // 金额操作loading
				tFilter: {
					personNumber: "",
					contactNumber: "",
					personName: "",
					cardStatus: "",
					cardId: "",
				},
				tData: [],
				tTotal: 0,
				group: [],
				sFilter: {
					gradeId: "",
					classId: ""
				},
				sData: [],
				sTotal: 0,
				tabType: "staff",
				showCard: false,
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
				gradeList: [],
				classList: [],
				dialogForm: {
					id: '', // 发卡人的id
					jobNumber: '',
					teacherName: '',
					identityCard: '', // 身份证号
					sex: '',
					contactNumber: '', // 手机号
					duty: '', // 职务
					studentId: '', // 学生学号
					studentName: '',
					gradeName: '',
					className: '',
					attendType: '', // 学生就读方式
					bumen: '',
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
					price:'',
					price1:'',
					mainWallet:'',
					subsidyWallet:'',
					cashPledge:'',
					cost:''
				}, // dialog 卡信息
				years: [{
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
					}
				],
				cardTypes: [{
						key: 0,
						label: '新卡'
					},
					{
						key: 1,
						label: '补卡'
					}
				],
				moneyTypes: [{
						key: 1,
						label: '主钱包'
					},
					{
						key: 2,
						label: '补贴钱包'
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
				Cardgroups: [{
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
						if(res.code == 200) {
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
						if(res.code == 200) {
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
				this.gradeList = [];
				this.group = [];
				this.deptId = '';
				this.getData()
			},
			findCx() {
				this.pageNumber = 1
				this.getData()
			},
			indexMethod(index) {
				return index + 1 + (this.pageNumber - 1) * this.pageSize;
			},
			findCx() {
				this.getData();
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
				for(const key in this.tFilter) {
					this.tFilter[key] = "";
				}
				for(const key in this.sFilter) {
					this.sFilter[key] = "";
				}
			},
			show(t, id) {
				fetch.get(Allapi.cost, "", res => {
					if (res.code == 200) {
						this.dialogForm.cost = res.data.cost
						this.dialogForm.cashPledge = res.data.cashPledge
						this.checked = res.data.logoutCost
						this.checkeds = res.data.logoutCashPledge
					} else {
						this.checked = false
						this.checkeds = false
						this.dialogForm.cost = 0
						this.dialogForm.cashPledge = 0
						this.$message({
							type: 'warning',
							message: res.message
						})
					}
				});
				this.dialogType = t;
				this.readCard()
				this.showCard = true;
				
			},
			getClassList() {
				// 获取年级列表
				this.sFilter.classId = "";
				this.classList = [];
				if(this.sFilter.gradeId == "") {
					return;
				}
				fetch.get(
					teacher.class, {
						gradeId: this.sFilter.gradeId
					},
					res => {
						if(res.code == 200) {
							this.classList = res.data;
						} else {
							this.classList = [];
						}
					}
				);
			},
			// dialog 关闭触发
			closeDialog() {
				// 重置表单
				this.resetForm()
				this.readCardLoading = false
				this.moneyLoading = false
				this.moneyLoadings = false
			},
			// 读卡
			readCard() {
				if("WebSocket" in window) {
					// 打开一个 web socket
					var ws = new WebSocket(schoolApi.ws);
					let _this = this
					ws.onopen = function() {
						// 获取物理id
						_this.readCardLoading = true
						getId()
						async function getId() {
							// 获取物理id 
							let id = await new Promise((resove) => {
								ws.send(JSON.stringify({
									type: '00'
								}))
								ws.onmessage = res => {
									resove(JSON.parse(res.data))
								}
							})

							if(id.code === 200) {
								ws.close()
							} else {
								_this.$message({
									type: 'warning',
									message: id.message
								})
								ws.close()
								return
							}

                    		fetch.get(Allapi.read + '/' + id.data.id, '', res => {
								if(res.code === 200) {
		                        let {personTypeValue, personNumber, personName, personBelong, identityCard,sendCardType, contactNumber,m1CardSecret,
                                    controlCardSecret,mainWallet,subsidyWallet,useCount,
                                    cost,cashPledge,
                                    cardIndate,
                                    cardId,
                                    cardGroupType,
                                    onceQuota,
                                    dayQuota} = res.data
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
								

								} else {
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

					ws.onerror = function() {
						// 关闭 websocket
						_this.$message({
							type: 'error',
							message: '连接失败！'
						})
						_this.readCardLoading = false
					};

					ws.onclose = function() {
						// 关闭 websocket
						console.log('连接关闭')
						_this.readCardLoading = false
					};

					return ws

				} else {
					// 浏览器不支持 WebSocket
					alert("您的浏览器不支持 WebSocket!");
				}

			},
			// 发卡 并反馈给 后台
			reqSendCard(num) {
				// 校验
				let {
					m1CardSecret,
					controlCardSecret,
					cardIndate,
					indete,
					cardId,
					cardGroupType,
					subsidyWallet,
					mainWallet,
					physicsId,
					price,
					price1,
					useCount
				} = this.dialogForm
				// 校验
				if(!cardId) {
					this.$message({
						type: 'warning',
						message: '请先进行读卡操作！'
					})
					return
				}
				// 充值
				if(num == 1) {
					if(price === '' || price === undefined) {
						this.$message({
							type: 'warning',
							message: '请输入金额！'
						})
						return
					}
					var num = /^[1-9]\d*$/;
					if(!num.test(price)){
						this.$message({
							type: 'error',
							message: '输入金额有误！'
						})
						return
					}
					if(price < 0) {
						this.$message({
							type: 'warning',
							message: '输入金额不能小于0！'
						})
						return
					}
					if(isNaN(price)) {
						this.$message({
							type: 'warning',
							message: '输入金额只能是数字！'
						})
						return
					}
					if(price > 20000){
						this.$message({
							type: 'error',
							message: '充值金额范围1-20000'
						})
						return
					}
					let par = {
						cardId: cardId,
						mainWallet: mainWallet,
						subsidyWallet: subsidyWallet,
						price: price,
						waterNumber: useCount,
						walletType:this.moneyType
					}
					this.moneyLoading = true
					fetch.post(Pay.toUp, par, res => {
						if(res.code === 200) {
							var ws = new WebSocket(schoolApi.ws);
							let _this = this
							ws.onerror = function() {
								// 关闭 websocket
								_this.$message({
									type: 'error',
									message: '连接失败！'
								})
								_this.moneyLoading = false
							};

							ws.onclose = function() {
								// 关闭 websocket
								console.log('连接关闭')
								_this.moneyLoading = false
								_this.showCard = false
							};
							ws.onopen = () => {
								cz()
								async function cz() {
									let result = await new Promise((resolve) => {
										ws.send(
											JSON.stringify({
												type: '05',
												data: {
													m11Key: m1CardSecret,
													controlKey: controlCardSecret,
													money: price,
													type: _this.moneyType,
													validDate: _this.moneyType == 2 ? cardIndate : ''
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
											message: result.message
										})
										_this.dialogForm['price'] = ''
										_this.getData()
									} else {
										let par = {
											cardId: cardId,
											walletType: _this.moneyType,//1 主钱包 2补贴钱包
											priceType: 2,//撤回类型 1 加 2 减
											price: price,
										}
										fetch.post(Pay.toRecall, par, res => {
											//撤回钱
										})
										_this.$message({
											type: 'warning',
											message: result.message
										})
									}

								}
							}
						} else {
							this.$message({
								type: 'warning',
								message: res.message
							})
							this.moneyLoading = false
						}
					})
				} else {
					if(price1 === '' || price1 === undefined) {
						this.$message({
							type: 'warning',
							message: '请输入金额！'
						})
						return
					}
					var num = /^[1-9]\d*$/;
					if(!num.test(price1)){
						this.$message({
							type: 'error',
							message: '输入金额有误！'
						})
						return
					}
					if(price1 < 0) {
						this.$message({
							type: 'warning',
							message: '输入金额不能小于0！'
						})
						return
					}
					if(isNaN(price1)) {
						this.$message({
							type: 'warning',
							message: '输入金额只能是数字！'
						})
						return
					}
					let par = {
						cardId: cardId,
						mainWallet: mainWallet,
						subsidyWallet: subsidyWallet,
						price: price1,
						waterNumber: useCount,
						walletType: this.moneyType
					}
					this.moneyLoadings = true
					fetch.post(Pay.toDow, par, res => {
						if(res.code === 200) {
							var ws = new WebSocket(schoolApi.ws);
							let _this = this
							ws.onerror = function() {
								// 关闭 websocket
								_this.$message({
									type: 'error',
									message: '连接失败！'
								})
								_this.moneyLoadings = false
							};

							ws.onclose = function() {
								// 关闭 websocket
								console.log('连接关闭')
								_this.moneyLoadings = false
								_this.showCard = false
							};
							ws.onopen = () => {
								cz()
								async function cz() {
									let result = await new Promise((resolve) => {
										ws.send(
											JSON.stringify({
												type: '06',
												data: {
													m11Key: m1CardSecret,
													controlKey: controlCardSecret,
													money: price1,
													type: _this.moneyType,
													validDate: _this.moneyType == 2 ? cardIndate : ''
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
											message: result.message
										})
										_this.dialogForm['price1'] = ''
										_this.getData()
									} else {
										let par = {
											cardId: cardId,
											walletType: _this.moneyType,//1 主钱包 2补贴钱包
											priceType: 1,//撤回类型 1 加 2 减
											price: price1,
										}
										fetch.post(Pay.toRecall, par, res => {
											//撤回钱
										})
										_this.$message({
											type: 'warning',
											message: result.message
										})
									}

								}
							}
						} else {
							this.$message({
								type: 'warning',
								message: res.message
							})
							this.moneyLoadings = false
						}
					})
				}

			},
			// 重置 dialog 表单
			resetForm() {
				for(const key in this.dialogForm) {
					this.dialogForm[key] = ''
				}
			}
		}
	};
</script>

<style scoped>
	* {
		box-sizing: border-box;
	}
	
	.fitler-wrap {
		margin: 22px 6px 0 6px;
		padding: 18px;
		background-color: #ffffff;
		box-shadow: 0px 3px 8px 0px rgba(41, 48, 56, 0.18);
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
	
	.block {
		background-color: #ffffff;
		box-shadow: 0px 2px 9px 0px rgba(105, 105, 105, 0.07);
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
		padding: 20px 0;
		padding-bottom: 0;
	}
</style>