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
							<el-select v-model="filter.childArea" placeholder="请选择" clearable>
								<el-option v-for="item in childOps" :key="item.id" :label="item.name" :value="item.id">
								</el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="设备机号:">
							<el-input v-model="filter.deviceNo" clearable placeholder="请输入内容"></el-input>
						</el-form-item>
						<el-form-item label="设备名称:">
							<el-input v-model="filter.deviceName" clearable placeholder="请输入内容"></el-input>
						</el-form-item>
						<el-form-item label="状态:">
							<el-select v-model="filter.connectStatus" placeholder="请选择" clearable>
								<el-option v-for="item in ops" :key="item.value" :label="item.label" :value="item.value">
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
				</div>
			</div>
			<div class="tableData">
				<el-table ref="singleTable" :data="tableData" highlight-current-row style="width: 100%">
					<el-table-column property="areaName" label="区域名称" align="center">
					</el-table-column>
					<el-table-column property="deviceNo" label="设备机号" align="center">
					</el-table-column>
					<el-table-column property="deviceName" label="设备名称" align="center">
					</el-table-column>
					<el-table-column property="connectStatus" label="状态" align="center">
						<template slot-scope="scope">
							{{['...' ,'联机', '脱机'][scope.row.connectStatus]}}
						</template>
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
					areaId:'',
					areaName: '', 
					childArea: '',
					deviceNo: '',
					deviceName: '',
					deviceStauts: '',
					childArea: '', // 子级区域id
				},
				childOps: [],
				options: [],
				ops: [
					{
						value: 1,
						label: '联机'
					},
					{
						value: 2,
						label: '脱机'
					}
				]
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
			
			
			// 获取子区域
			getChild(v){
				this.childOps = []
				this.filter['childArea'] = ''
				if(v === ''){
					return
				}
				fetch.get(AreaInfo.region + '/' + v, '', res => {
					if(res.code === 200) {
						this.childOps = res.data.child.length !== 0 ? res.data.child : []
					} else {
						this.$message({
							type: 'warning',
							message: res.message
						})
					}
				})
			},

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