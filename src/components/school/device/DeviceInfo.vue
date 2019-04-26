<template>
	<div class="wrap">
		<div class="block">
			<div class="header">
				<div class="fitler-wrap">
					<el-form :inline="true" :model="filter" class="demo-form-inline">
						<el-form-item label="区域名称:" prop="teacherName">
							<el-select v-model="filter.areaId" @change="getChild(filter.areaId)" placeholder="请选择" clearable>
								<el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id">
								</el-option>
							</el-select>
						</el-form-item>
						<el-form-item v-if="childOps.length !== 0">
							<el-select v-model="filter.childArea" @change="getmOps" placeholder="请选择" clearable>
								<el-option v-for="item in childOps" :key="item.id" :label="item.name" :value="item.id">
								</el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="商户名称">
							<el-select v-model="filter.merchantId" placeholder="请选择" clearable>
								<el-option v-for="item in filterMops" :key="item.id" :label="item.name" :value="item.id">
								</el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="设备机号:">
							<el-input v-model="filter.deviceNo" clearable placeholder="请输入内容"></el-input>
						</el-form-item>
						<el-form-item label="设备名称:">
							<el-input v-model="filter.deviceName" clearable placeholder="请输入内容"></el-input>
						</el-form-item>
						<el-form-item label="设备状态:">
							<el-select v-model="filter.deviceStauts" placeholder="请选择" clearable>
								<el-option v-for="item in ops1" :key="item.value" :label="item.label" :value="item.value">
								</el-option>
							</el-select>
						</el-form-item>
						<el-form-item>
							<el-button type="success" @click="findCx">查询</el-button>
						</el-form-item>
						<el-form-item>
							<el-button type="success" @click="reset">重置</el-button>
						</el-form-item>
					</el-form>
					<el-form :inline="true">
						<el-form-item>
							<el-button type="success" @click="show('enter')">录入</el-button>
						</el-form-item>
					</el-form>
				</div>
			</div>
			<div class="tableData">
				<el-table ref="singleTable" :data="tableData" highlight-current-row style="width: 100%">
					<el-table-column property="deviceNo" label="设备机号" align="center">
					</el-table-column>
					<el-table-column property="deviceName" label="设备名称" align="center">
					</el-table-column>
					<el-table-column property="areaName" label="区域名称" align="center">
					</el-table-column>
					<el-table-column property="merchantName" label="商户名称" align="center">
					</el-table-column>
					<el-table-column property="communicationMode" label="通讯方式" align="center">
						<template slot-scope="scope">
							{{['串口', '以太网'][scope.row.communicationMode]}}
						</template>
					</el-table-column>
					<el-table-column property="devicePort" label="设备端口" align="center">
					</el-table-column>
					<el-table-column property="deviceType" label="设备类型" align="center">
						<template slot-scope="scope">
							{{['消费机'][scope.row.deviceType]}}
						</template>
					</el-table-column>
					<el-table-column property="mac" label="mac地址" align="center">
					</el-table-column>
					<el-table-column property="deviceStauts" label="设备状态" align="center">
						<template slot-scope="scope">
							{{['启用', '未启用', '启用中'][scope.row.deviceStauts]}}
						</template>
					</el-table-column>
					<el-table-column property="deviceUse" label="设备用途" align="center">
						<template slot-scope="scope">
							{{['消费'][scope.row.deviceUse]}}
						</template>
					</el-table-column>
					<el-table-column property="deviceIp" label="设备IP地址" align="center">
					</el-table-column>
					<el-table-column property="preIp" label="前置IP" align="center">
					</el-table-column>
					<el-table-column property="gateway" label="设备网关" align="center">
					</el-table-column>
					<el-table-column property="subnetMask" label="设备子网掩码" align="center">
					</el-table-column>
					<el-table-column property="deviceSerialNo" label="设备唯一识别码" align="center">
					</el-table-column>
					<el-table-column property="preName" label="前置名称" align="center">
					</el-table-column>
					<el-table-column property="create_time" label="创建时间" align="center">
					</el-table-column>
					<el-table-column property="update_time" label="更新时间" align="center">
					</el-table-column>
					<el-table-column label="操作" align="center" width="230px">
						<template slot-scope="scope">
							<el-button type="text" @click="show('edit', scope.row)">编辑</el-button>
							<el-button type="text" @click="stop(scope.row)" :disabled="scope.row.mac == ''||scope.row.mac == undefined ? true:false">
								{{scope.row.deviceStauts === 0 ? '停用' : scope.row.deviceStauts === 1 ? '启用' : '启用中'}}
							</el-button>
							<el-button type="text" @click="handle(scope.row.id)" :disabled="scope.row.mac == ''||scope.row.mac == undefined ? true:false">参数配置</el-button>
							<el-button type="text" @click="del(scope.row)">删除</el-button>
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
				<el-dialog :title="dialogType === 'edit' ? '编辑' : '录入'" @closed="closeDialog" :visible.sync="showCard" width="980px" center>
					<div style="text-align: center;margin: 20px auto 0;">
						<el-form :inline="true" :model="dialogForm" :label-position="labelPosition" label-width="150px" size="small">
							<el-form-item label="商户ID:">
								<el-select v-model="dialogForm.merchantId" placeholder="请选择" clearable>
									<el-option v-for="item in mOps" :key="item.id" :label="item.name" :value="item.id">
									</el-option>
								</el-select>
							</el-form-item>
							<el-form-item label="设备类型:">
								<el-select v-model="dialogForm.deviceType" placeholder="请选择" clearable>
									<el-option v-for="item in eqOps" :key="item.value" :label="item.label" :value="item.value">
									</el-option>
								</el-select>
							</el-form-item>
							<el-form-item label="设备用途:">
								<el-select v-model="dialogForm.deviceUse" placeholder="请选择" clearable>
									<el-option v-for="item in useOps" :key="item.value" :label="item.label" :value="item.value">
									</el-option>
								</el-select>
							</el-form-item>
							<el-form-item label="设备端口:">
								<el-input :maxlength="10" v-model="dialogForm.devicePort" clearable></el-input>
							</el-form-item>
							<el-form-item label="设备IP地址:">
								<el-input :maxlength="30" v-model="dialogForm.deviceIp" clearable></el-input>
							</el-form-item>
							<el-form-item label="所属前置:">
								<el-select v-model="dialogForm.preId" placeholder="请选择" clearable>
									<el-option v-for="item in preOps" :key="item.id" :label="item.name" :value="item.id">
									</el-option>
								</el-select>
							</el-form-item>
							<el-form-item label="设备名称:">
								<el-input :maxlength="30" v-model="dialogForm.deviceName" clearable></el-input>
							</el-form-item>
							<el-form-item label="通讯方式:">
								<el-select v-model="dialogForm.communicationMode" placeholder="请选择" clearable>
									<el-option v-for="item in options5" :key="item.value" :label="item.label" :value="item.value">
									</el-option>
								</el-select>
							</el-form-item>
							<el-form-item label="接入方式:">
								<el-select v-model="dialogForm.access" placeholder="请选择" clearable>
									<el-option label="云前置" value="0">
									</el-option>
									<el-option label="局域网" value="1">
									</el-option>
								</el-select>
							</el-form-item>
							<el-form-item :label="dialogForm.access == 1?'管理员密码:':'设备机号:'" v-if="dialogForm.access != ''">
								<el-input v-if="dialogForm.access == 1" :maxlength="30" v-model="dialogForm.password" clearable></el-input>
								<el-input v-if="dialogForm.access == 0" :maxlength="30" v-model="dialogForm.deviceNo" clearable></el-input>
							</el-form-item>
							
							<template>
								<el-form-item style="width:353px">
								</el-form-item>
							</template>
						</el-form>
					</div>
					<div style="padding: 20px;">
						<div style="display: flex;align-items: center;justify-content: center;">
							<el-button type="success" size="medium" @click="sure">确认</el-button>
							<el-button type="success" size="medium" @click="showCard = false">关闭</el-button>
						</div>
					</div>
				</el-dialog>
			</div>
			<el-dialog :visible.sync="dialogSetShow" width="946px" center custom-class="el-title">
				<template slot="title">
					<div class="dialog-tab">
						<div class="set"><span :class="dialogCardType === 'info' ? 'activeT' : ''" @click="handleTab('info')">设备信息</span></div>
						<div class="pwd"><span :class="dialogCardType === 'inspect' ? 'activeT' : ''" @click="handleTab('inspect')">检查设置</span></div>
						<div class="set"><span :class="dialogCardType === 'time' ? 'activeT' : ''" @click="handleTab('time')">时间设置</span></div>
						<div class="pwd"><span :class="dialogCardType === 'quota' ? 'activeT' : ''" @click="handleTab('quota')">限额设置</span></div>
					</div>
				</template>

				<template v-if="dialogCardType === 'info'">
					<el-form ref="formRef" :model="infoDialogForm" :inline="true" style="text-align: center;padding-top: 20px;">
						<el-form-item label="设备编号:">
							<el-input style="width:auto;" v-model="infoDialogForm.deviceNo" clearable disabled></el-input>
						</el-form-item>
						<el-form-item label="设备名称:">
							<el-input style="width:auto;" v-model="infoDialogForm.deviceName" clearable disabled></el-input>
						</el-form-item>
					</el-form>
					<el-form ref="formRef" :model="infoDialogForm" label-width="240px" style="padding-top: 20px;">
						<el-form-item label="当前记录数:">
							<el-input style="width:auto;" v-model="infoDialogForm.deviceRecordCount" clearable disabled></el-input>
						</el-form-item>
						<el-form-item label="设备名单使用情况:">
							<el-input style="width:auto;" v-model="infoDialogForm.maxCount" clearable disabled></el-input>
						</el-form-item>
						<el-form-item label="白名单列表:">
							<el-input style="width:auto;" v-model="infoDialogForm.whiteCard" clearable disabled></el-input>
						</el-form-item>
						<el-form-item label="黑名单列表:">
							<el-input style="width:auto;" v-model="infoDialogForm.blackCard" clearable disabled></el-input>
						</el-form-item>
						<el-form-item label="补贴名单列表:">
							<el-input style="width:auto;" v-model="infoDialogForm.remained" clearable disabled></el-input>
						</el-form-item>
					</el-form>
				</template>

				<template v-if="dialogCardType === 'inspect'">
					<el-form ref="formRef" :model="inspectDialogForm" label-width="100px" style="width: 320px;margin: 0 auto;text-align: center;padding-top: 20px;">
						<el-form-item label="检查白名单:">
							<el-select v-model="inspectDialogForm.aCheckValid" placeholder="请选择">
								<el-option v-for="item in aCheckValid" :key="item.value" :label="item.label" :value="item.value">
								</el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="检查黑名单:">
							<el-select v-model="inspectDialogForm.aCheckDisabled" placeholder="请选择">
								<el-option v-for="item in aCheckDisabled" :key="item.value" :label="item.label" :value="item.value">
								</el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="检查刷卡间隔:">
							<el-select v-model="inspectDialogForm.aCheckInterval" placeholder="请选择">
								<el-option v-for="item in aCheckInterval" :key="item.value" :label="item.label" :value="item.value">
								</el-option>
							</el-select>
						</el-form-item>
						<template v-if="inspectDialogForm.aCheckInterval != 0">
							<el-form-item label="同卡间隔时间:">
								<el-input style="width: 190px;margin-right: 10px;" v-model="inspectDialogForm.sameCardInterval" clearable></el-input>
								<span>秒</span>
							</el-form-item>
							<el-form-item label="异卡间隔时间:">
								<el-input style="width: 190px;margin-right: 10px;" v-model="inspectDialogForm.diffCardInterval" clearable></el-input>
								<span>秒</span>
							</el-form-item>
						</template>
					</el-form>
					<div class="dialog-footer">
						<div class="btn" @click="btn(inspectDialogForm,2)">提交</div>
					</div>
				</template>

				<template v-if="dialogCardType === 'time'">
					<el-button size="small" type="primary" style="background: #07bde4;margin:20px 0 0 40px" @click="addDomain">创建时间段</el-button>
					<el-form ref="formRef" :inline="true" label-width="100px" style="padding-top: 20px;text-align: center;">
						<el-form-item
							v-for="(domain, index) in dynamicValidateForm.domains"
							:label="'交易时间段' + index+':'"
							:key="domain.key">
							<el-time-select style="width: 187px;margin-right: 10px;" clearable size="small"
							 v-model="dynamicValidateForm.domains[index].begintime" placeholder="任意时间点"
							 :picker-options="{
								start: '00:00',
								step: '00:05',
								end: '23:59'
							}">
							</el-time-select>
							<span>--</span>
							<el-time-select style="width: 187px;margin: 0 10px;" clearable size="small"
							 v-model="dynamicValidateForm.domains[index].endtime" placeholder="任意时间点"
							  :picker-options="{
								start: '00:00',
								step: '00:05',
								end: '23:59'
							}">
							</el-time-select>
							<el-button type="primary" size="small" style="background: #07bde4;" @click.prevent="removeDomain(domain)">删除</el-button>
						</el-form-item>
					</el-form>
					<div class="dialog-footer">
						<div class="btn" @click="btn(dynamicValidateForm,3)">提交</div>
					</div>
				</template>

				<template v-if="dialogCardType === 'quota'">
					<el-form ref="formRef" :model="quotaDialogForm" label-width="100px" style="width: 321px;margin: 0 auto;padding-top: 20px;">
						<el-form-item label="次限额:">
							<el-input style="width: 190px;margin-right: 10px;" v-model="quotaDialogForm.perConsumelimit" clearable></el-input>
							<span>元</span>
						</el-form-item>
						<el-form-item label="日限额:">
							<el-input style="width: 190px;margin-right: 10px;" v-model="quotaDialogForm.dayConsumelimit" clearable></el-input>
							<span>元</span>
						</el-form-item>
						<el-form-item label="扣费优先级:">
							<el-select style="width: 190px;" v-model="quotaDialogForm.consumeMode" placeholder="请选择">
								<el-option v-for="item in consumer" :key="item.value" :label="item.label" :value="item.value">
								</el-option>
							</el-select>
						</el-form-item>
					</el-form>
					<div class="dialog-footer">
						<div class="btn" @click="btn(quotaDialogForm,4)">提交</div>
					</div>
				</template>

				<template slot="footer">
					<div class="dialog-footer"></div>
				</template>

			</el-dialog>
		</div>

	</div>
</template>

<script>
	import schoolApi from "@/assets/api/school"
	import fetch from '@/assets/tools/fetch'
	import AreaInfo from "@/assets/api/school/AreaInfo";
	export default {
		data() {
			return {
				labelPosition: 'right',
				showCard: false,
				dialogSetShow: false,
				dialogType: '',
				dialogCardType: 'info',
				tableData: [],
				total: 0,
				pageNumber: 1,
				pageSize: 10,
				filterMops: [], // 筛选商户列表
				filter: {
					areaId: '', 
					areaName: '', 
					childArea: '',
					merchantId: '',
					deviceNo: '',
					deviceName: '',
					deviceStauts: '',
					childArea: '', // 子级区域id
				},
				dynamicValidateForm: {
					domains: [{
						begintime:'',
						endtime:''
					}]
				},
				childOps: [],
				options: [],
				ops1: [
					{
						value: 0,
						label: '启用'
					},
					{
						value: 1,
						label: '未启用'
					},
					{
						value: 2,
						label: '启用中'
					}
				],
				dialogForm: {
					merchantId: '', // 商户id
					preId: '', // 前置服务器id
					deviceType: '', // 设备类型
					deviceUse: '', // 设备用途
					devicePort: 4001, // 设备端口
					deviceName: '', // 设备名称
					deviceIp: '', // ip
					password: '',
					communicationMode: '', // 通讯方式
					access:'',
					deviceNo:'',
					enterpriseNumber:''
				},
				mOps: [], // 商户列表
				preOps: [], // 前置服务器列表
				eqOps: [
					{
						value: 0,
						label: '消费机'
					}
				],
				useOps: [
					{
						value: 0,
						label: '消费'
					}
				],
				options4: [{
					value: '启用',
					lable: '启用'
				}, {
					value: '未启用',
					lable: '未启用'
				}],
				options5: [{
					value: 0,
					label: '串口'
				}, {
					value: 1,
					label: '以太网'
				}],
				consumer: [{
					value: 0,
					label: '先补贴后现金'
				}, {
					value: 1,
					label: '先现金后补贴'
				}, {
					value: 2,
					label: '只扣现金'
				}, {
					value: 3,
					label: '只扣补贴'
				}],
				quotaDialogForm:[],
				inspectDialogForm:[],
				infoDialogForm:{
					deviceNo:'',
					deviceName:'',
					deviceRecordCount:'',
					maxCount:'',
					blackCard:'',
					whiteCard:'',
					remained:'',
				},
				aCheckValid:[{
					value: 0,
					label: '不检查'
				}, {
					value: 1,
					label: '检查'
				}],
				aCheckDisabled:[{
					value: 0,
					label: '不检查'
				}, {
					value: 1,
					label: '检查'
				}],
				aCheckInterval:[{
					value: 0,
					label: '不检查'
				}, {
					value: 1,
					label: '检查'
				}],
			}
		},
		created() {
			 this.getFilter()
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
				par['areaId'] = this.filter.areaId === '' ? this.filter.childArea : this.filter.areaId
				
				fetch.get(AreaInfo.consumer, par, res => {
					if(res.code == 200) {
						this.tableData = res.data
						this.total = res.total || 0
					} else {
						this.tableData = []
						this.total = 0
					}

				}, {
					target: '.el-table__body-wrapper'
				})
			},
			getFilter() {
				fetch.get(AreaInfo.region + '/all', '', res => {
					if(res.code === 200) {
						this.options = res.data
					} else {
						this.options = []
					}
				})
			},
			reset() {
				for(const key in this.filter) {
					this.filter[key] = ''
				}
				for(const key in this.dialogForm) {
					this.dialogForm[key] = ''
				}
			},
			show(type, row) {
				if(type === 'enter') {
					if(this.filter.areaId === '') {
						this.$message({
							duration: "2000",
							message: "请选择区域",
							type: "warning"
						});
						return
					}
					// 获取录入所需数据
					this.getEnterData()
				}
				if(type === 'edit'){
					
					fetch.get(AreaInfo.consumer + '/' + row.id, '', res => {
						if(res.code === 200){
							this.getEditData(res.data.merchantId)
							let {merchantId, preId, deviceType, deviceName, deviceUse, deviceIp, devicePort, communicationMode, password, id,deviceNo,enterpriseNumber} = res.data
							this.dialogForm['merchantId'] = String(merchantId)
							this.dialogForm['preId'] = preId
							this.dialogForm['deviceType'] = deviceType
							this.dialogForm['deviceName'] = deviceName
							this.dialogForm['deviceUse'] = Number(deviceUse)
							this.dialogForm['deviceIp'] = deviceIp
							this.dialogForm['devicePort'] = devicePort
							this.dialogForm['communicationMode'] = communicationMode
							this.dialogForm['password'] = password
							this.dialogForm['id'] = id
							this.dialogForm['deviceNo'] = deviceNo
							this.dialogForm['enterpriseNumber'] = enterpriseNumber
						} else {
							this.$message({
								type: 'warning',
								message: res.message
							})
						}
					})
				}
				
				this.dialogType = type
				this.showCard = true
			},
			// 获取录入数据
			getEnterData(){
				fetch.get(AreaInfo.getMerchantByRegion + '/' + (this.filter.areaId === '' ? this.filter.childArea : this.filter.areaId), '', res => {
					if(res.code === 200){
						this.mOps = res.data
					}else{
						this.mOps = []
					}
				})
				
				fetch.get(AreaInfo.pre, '', res => {
					if(res.code === 200){
						this.preOps = res.data
					}else{
						this.preOps = []
					}
				})
			},
			// 获取编辑数据
			getEditData(areaId){
				fetch.get(AreaInfo.pre, '', res => {
					if(res.code === 200){
						this.preOps = res.data
					}else{
						this.preOps = []
					}
				})
				fetch.get(AreaInfo.getMerchantByRegion + '/' + areaId, '', res => {
					if(res.code === 200){
						this.mOps = res.data
					}else{
						this.mOps = []
					}
				})
			},
			handle(id) {
				this.dialogSetShow = true
				fetch.get(AreaInfo.consumer+'/'+id, {id:id}, res => {
					if(res.code == 200) {
						this.infoDialogForm.deviceNo = res.data.deviceNo
						this.infoDialogForm.deviceName = res.data.deviceName
					} else {
						this.infoDialogForm = []
					}

				})
				fetch.get(AreaInfo.set+'/'+id, {id:id}, res => {
					if(res.code === 200){
						this.infoDialogForm.deviceRecordCount = res.data.deviceRecordCount.count
						this.infoDialogForm.remained = res.data.listCount.remained
						this.infoDialogForm.blackCard = res.data.listCount.blackCard
						this.infoDialogForm.whiteCard = res.data.listCount.whiteCard
						this.infoDialogForm.maxCount = res.data.listCount.maxCount
						this.inspectDialogForm = res.data
						this.quotaDialogForm = res.data
						this.dynamicValidateForm.domains = res.data.spanTimeofPrice
					}else{
						this.infoDialogForm = []
						this.inspectDialogForm = []
						this.quotaDialogForm = []
						this.dynamicValidateForm.domains = [] 
						this.$message({
							type: 'warning',
							message: res.message
						})
					}
				})
			},
			btn(data,id){
				if (id == 2) {
					let par = {
						deviceNo:this.infoDialogForm.deviceNo,
						sameCardInterval:data.sameCardInterval,
						diffCardInterval:data.diffCardInterval,
						aCheckValid:data.aCheckValid,
						aCheckDisabled:data.aCheckDisabled,
						aCheckInterval:data.aCheckInterval,
					}
					fetch.put(AreaInfo.set, par, res => {
						if(res.code === 200){
							this.$message({
								message:res.message,
								type:'success'
							})
							this.dialogSetShow = false
						} else {
							this.$message({
								type: 'warning',
								message: res.message
							})
						}
					})
				} else if (id == 3){
					let spanTimeofPrice = []
					data.domains.forEach((v,i) => {
						spanTimeofPrice[i] = {begintime:v.begintime,endtime:v.endtime,clockmodule:'0',price:'0',times:'10'}
					});
					let par = {
						deviceNo:this.infoDialogForm.deviceNo,
						spanTimeofPrice:JSON.stringify(spanTimeofPrice)
					}
					fetch.put(AreaInfo.set, par, res => {
						if(res.code === 200){
							this.$message({
								message:res.message,
								type:'success'
							})
							this.dialogSetShow = false
						} else {
							this.$message({
								type: 'warning',
								message: res.message
							})
						}
					})
				} else if (id == 4){
					let par = {
						deviceNo:this.infoDialogForm.deviceNo,
						perConsumelimit:data.perConsumelimit,
						dayConsumelimit:data.dayConsumelimit,
						consumeMode:data.consumeMode,
					}
					fetch.put(AreaInfo.set, par, res => {
						if(res.code === 200){
							this.$message({
								message:res.message,
								type:'success'
							})
							this.dialogSetShow = false
						} else {
							this.$message({
								type: 'warning',
								message: res.message
							})
						}
					})
				}
			},
			closeDialog() {
				for(const key in this.dialogForm) {
					this.dialogForm[key] = ''
				}
				this.dialogForm['devicePort'] = 4001
				this.mOps = [] // 重置商户列表
				this.preOps = [] // 重置商户列表
			},
			sure() {
				let {merchantId, preId, deviceType, deviceName, deviceUse, deviceIp, devicePort, communicationMode, password,deviceNo,access,id,enterpriseNumber} = this.dialogForm
				if(merchantId === ''||preId === ''||deviceType === ''||deviceName === ''||deviceUse === ''||deviceIp === ''||devicePort === ''||communicationMode === ''||access === ''){
					this.$message({
						type: 'warning',
						message: '请填写完整！'
					})
					return
				}
				if(access == 0 && deviceNo === ''){
						this.$message({
							type: 'warning',
							message: '请填写完整！'
						})
						return
				}
				if(access == 1 && password === ''){
					this.$message({
						type: 'warning',
						message: '请填写完整！'
					})
					return
				}
				if(devicePort > 65535){
					this.$message({
						type: 'warning',
						message: '端口号超过范围！'
					})
					return
				}
				var ip = /\d+\.\d+\.\d+\.\d+/;
				if(!ip.test(deviceIp)){
					this.$message({
						type: 'warning',
						message: '设备IP地址错误！'
					})
					return
				}
				var str = /[\u4e00-\u9fa5]$/;
				if(str.test(password)){
					this.$message({
						type: 'warning',
						message: '管理员密码不能含中文！'
					})
					return
				}
				if(this.dialogType === 'enter'){
					let par = {
						merchantId, preId, deviceType, deviceName, deviceUse, deviceIp, devicePort, communicationMode, password,deviceNo,
						areaId: this.filter.areaId === '' ? this.filter.childArea : this.filter.areaId
					}
					fetch.post(AreaInfo.consumer, par, res => {
						if(res.code == 200) {
							this.$message({
								type: 'success',
								message: res.message
							})
							this.showCard = false
							this.getData()
						} else {
							this.$message({
								type: 'warning',
								message: res.message
							})
						}
					})
				}
				if(this.dialogType === 'edit'){
					let par = {
						merchantId, preId, deviceType, deviceName, deviceUse, deviceIp, devicePort, communicationMode, password, id,deviceNo,enterpriseNumber
					}
					fetch.put(AreaInfo.consumer, par, res => {
						if(res.code == 200) {
							this.$message({
								type: 'success',
								message: res.message
							})
							this.showCard = false
							this.getData()
						} else {
							this.$message({
								type: 'warning',
								message: res.message
							})
						}
					})
				}
			},
			enter() {

			},
			handleTab(t) {
				if(t === this.dialogCardType) {
					return
				}
				this.dialogCardType = t
			},
			// 获取子区域
			getChild(v){
				this.childOps = []
				this.filter['childArea'] = ''
				this.filter.merchantId = ''
				this.filterMops = []
				this.getmOps()
				if(v === ''){
					return
				}
				fetch.get(AreaInfo.child, '', res => {
					if(res.code === 200) {
						res.data.forEach(a => {
							if (a.id === v) {
								this.childOps = a.child
							}
						});
					}
				})
			},
			// 获取商户
			getmOps(){
				if(this.filter.areaId === '' && this.filter.childArea === ''){
					return
				}
				fetch.get(AreaInfo.getMerchantByRegion + '/' + (this.filter.areaId === ''|| this.filter.childArea != '' ? this.filter.childArea : this.filter.areaId), '', res => {
					if(res.code === 200){
						this.filterMops = res.data
					}else{
						this.filterMops = []
					}
				})
			},
			del(id) {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
				fetch.delete(AreaInfo.consumer + '/' + id.id, '', res => {
					if(res.code === 200) {
						this.$message({
								type: 'success',
								message: '删除成功！'
							})
						this.getData()
					} else {
						this.$message({
							type: 'warning',
							message: res.message
						})
					}
				})
        }).catch(() => {});
			},
			addDomain() {
				this.dynamicValidateForm.domains.push({
				value: '',
				key: Date.now()
				});
			},
			removeDomain(item) {
				var index = this.dynamicValidateForm.domains.indexOf(item)
				if (index !== -1) {
				this.dynamicValidateForm.domains.splice(index, 1)
				}
			},
			stop(row){
				if(row.deviceStauts === 2){
					return
				}
				fetch.put(AreaInfo.consumer + '/' + row.id, '', res => {
					if(res.code === 200){
						this.getData()
					} else {
						this.$message({
							type: 'warning',
							message: res.message
						})
					}
				})
			}
		}
	}
</script>

<style scoped>
	* {
		box-sizing: border-box;
	}
	
	.dialog-tab {
		display: flex;
		justify-content: space-around;
		padding-right: 31px;
		letter-spacing: 2px;
		color: #ffffff;
		font-size: 18px;
	}
	
	.dialog-tab>div>span {
		opacity: 0.5;
		cursor: pointer;
	}
	
	.dialog-tab .activeT {
		opacity: 1;
		position: relative;
		transition: all .2s;
	}
	
	.activeT {
		opacity: 1;
		position: relative;
		transition: all .2s;
	}
	
	.activeT::before {
		content: url(../../../assets/sjj.png);
		position: absolute;
		bottom: -36px;
		left: 28px;
	}
	
	.fitler-wrap {
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
	
	.btn {
		width: 100px;
		height: 30px;
		margin: 0 auto;
		background-color: #07bde4;
		border-radius: 4px;
		border: solid 1px #eeeeee;
		user-select: none;
		cursor: pointer;
		text-align: center;
		line-height: 30px;
		font-size: 14px;
		letter-spacing: 1px;
		color: #ffffff;
	}
</style>