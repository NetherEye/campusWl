<template>
	<div class="wrap">
		<div class="block">
			<div class="header">
				<div class="fitler-wrap">
					<el-form :inline="true" :model="filter" class="demo-form-inline">
						<el-form-item label="部署区域" prop="teacherName">
							<el-select v-model="filter.areaId" placeholder="请选择" clearable>
								<el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id">
								</el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="设备机号">
							<el-input v-model="filter.deviceNo" clearable placeholder="请输入内容"></el-input>
						</el-form-item>
						<el-form-item>
							<el-button type="success" @click="findCx">查询</el-button>
						</el-form-item>
					</el-form>
					<el-form :inline="true">
						<el-form-item>
							<el-button type="success" @click="show('enter')">添加</el-button>
						</el-form-item>
					</el-form>
				</div>
			</div>
			<div class="tableData">
				<el-table ref="singleTable" :data="tableData" highlight-current-row style="width: 100%">
					<el-table-column property="deviceNo" label="充值机编号" align="center">
					</el-table-column>
					<el-table-column property="deviceName" label="部署区域" align="center">
					</el-table-column>
					<el-table-column property="areaName" label="设备账号" align="center">
					</el-table-column>
					<el-table-column property="areaName" label="最小金额" align="center">
					</el-table-column>
					<el-table-column property="merchantName" label="创建时间" align="center">
					</el-table-column>
					<el-table-column label="操作" align="center">
						<template slot-scope="scope">
							<el-button type="text" @click="show('edit', scope.row)">修改</el-button>
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
				<el-dialog :title="dialogType === 'edit' ? '修改' : '添加'" @closed="closeDialog" :visible.sync="showCard" width="800px" center>
					<div style="padding-top: 30px;display: flex;justify-content: center;">
						<el-form :model="dialogForm" label-width="85px" center>
							<el-form-item label="充值机编号">
								<el-input :maxlength="30" v-model="dialogForm.devicePort" clearable></el-input>
							</el-form-item>
							<el-form-item label="部署区域">
								<el-select v-model="dialogForm.merchantId" placeholder="请选择" clearable>
									<el-option v-for="item in mOps" :key="item.id" :label="item.name" :value="item.id">
									</el-option>
								</el-select>
							</el-form-item>
							<el-form-item label="设置密码">
								<el-input :maxlength="30" v-model="dialogForm.deviceIp" clearable></el-input>
							</el-form-item>
							<el-form-item label="重复密码">
								<el-input :maxlength="30" v-model="dialogForm.deviceName" clearable></el-input>
							</el-form-item>
							<el-form-item label="最小金额">
								<el-input :maxlength="30" v-model="dialogForm.deviceName" clearable></el-input>
							</el-form-item>
						</el-form>
					</div>
					<div style="padding: 20px;">
						<div style="display: flex;align-items: center;justify-content: center;">
							<el-button type="success" size="medium" @click="sure">{{dialogType === 'edit' ? '修改' : '添加'}}</el-button>
							<el-button type="success" size="medium" @click="showCard = false">关闭</el-button>
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
	import AreaInfo from "@/assets/api/school/AreaInfo";
	export default {
		data() {
			return {
				showCard: false,
				dialogType: '',
				tableData: [{devicePort:'007'}],
				options:[],
				total: 0,
				pageNumber: 1,
				pageSize: 10,
				filter: {
					areaId: '', 
					deviceNo: '',
				},
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
				}
			}
		},
		created() {
			this.getFilter()
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
			show(type, row) {
				if(type === 'edit'){
					fetch.get(AreaInfo.consumer + '/' + row.id, '', res => {
						if(res.code === 200){
							for (const key in this.dialogForm) {
								this.dialogForm[key] = res.data[key] || ''
							}
						} else {
							this.$message({
								type: 'warning',
								message: res.message
							})
						}
					})
				}
				
				this.getFilter()
				this.dialogType = type
				this.showCard = true
			},
			closeDialog() {
				for(const key in this.dialogForm) {
					this.dialogForm[key] = ''
				}
				this.options = [] // 重置商户列表
			},
			sure() {
				let {password,deviceNo,id,enterpriseNumber} = this.dialogForm
				if(!merchantId||!preId||!deviceType||!deviceName){
					this.$message({
						type: 'warning',
						message: '请填写完整！'
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
					fetch.post(AreaInfo.consumer, {...this.dialogForm}, res => {
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
					fetch.put(AreaInfo.consumer, {...this.dialogForm}, res => {
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
		}
	}
</script>

<style scoped>
	* {
		box-sizing: border-box;
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
</style>