<template>
  <div class="wrap">
    <div class="block">
      <div class="header">
        <div class="fitler-wrap">
          <el-form :inline="true" :model="filter" class="demo-form-inline">
            <el-form-item>
              <el-button type="success" @click="handle('录入')">录入</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="tableData">
        <el-table ref="singleTable" :data="tableData" highlight-current-row style="width: 100%">
          <el-table-column label="前置ID" property="id" align="center"></el-table-column>
          <el-table-column label="前置名称" property="name" align="center"></el-table-column>
          <el-table-column label="前置IP" property="ipAddress" align="center"></el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button type="text" @click="handle('编辑', scope.row)">编辑</el-button>
              <el-button type="text" @click="handle('查看', scope.row)">查看</el-button>
              <el-button type="text" @click="del(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="fenye" v-if="total != 0">
          <div class="fenye_title">
            共 {{total}} 条数据 每页 {{pageSize}} 条数据 共 {{Math.floor(total/pageSize) + (total%pageSize != 0 ? 1 : 0)}}
            页
          </div>
          <el-pagination :current-page.sync="pageNumber" @current-change="getData" :page-size="pageSize" layout="prev, pager, next, jumper"
            :total="total"></el-pagination>
        </div>
      </div>

      <div class="el-title">
        <el-dialog :title="type" @closed="closeDialog" :visible.sync="showCard" width="800px"
          center>
          <div style="padding-top: 30px;display: flex;justify-content: center;">
              <el-form ref="formRef" :model="dialogForm" label-width="75px" center>
                <el-form-item label="前置IP:">
                  <el-input :maxlength="30" style="width:auto;" v-model="dialogForm.c" clearable :disabled="type == '查看' ? true : false"></el-input>
                </el-form-item>
                <el-form-item label="前置端口:">
                  <el-input :maxlength="10" style="width:auto;" v-model="dialogForm.e" clearable :disabled="type == '查看' ? true : false"></el-input>
                </el-form-item>
                <el-form-item label="前置名称:">
                  <el-input :maxlength="30" style="width:auto;" v-model="dialogForm.d" clearable :disabled="type == '查看' ? true : false"></el-input>
                </el-form-item>
              </el-form>
          </div>
					<div style="padding: 20px;">
						<div style="display: flex;align-items: center;justify-content: center;" v-if="type != '查看'">
                <el-button type="success" size="medium" @click="subForm">确定</el-button>
                <el-button type="warning" size="medium" @click="showCard = false">取消</el-button>
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
  import AreaInfo from "@/assets/api/school/AreaInfo";
  export default {
    data() {
      return {
        ip:/\d+\.\d+\.\d+\.\d+/,
        showCard:false,
        type:'录入',
        filter: {
          contactNumber: '',
          teacherName: ''
        },
        dialogForm:{
          b:'',
          c:'',
          d:'',
          e:'',
        },
        total: 0,
        pageNumber: 1,
        pageSize: 10,
        tableData: [],
        options: []
      };
    },
    created() {
			this.getData()
    },
    methods: {
      getData() {
				let par = {
					pageSize: this.pageSize,
					pageNumber: this.pageNumber
				}
				fetch.get(AreaInfo.pre, par, res => {
					if(res.code === 200) {
						this.tableData = res.data
						this.total = res.total
					} else {
						this.tableData = []
						this.total = 0
					}
				}, {
					target: '.el-table__body-wrapper'
				})
			},
      handle(type,id) {
        this.type = type
				if(type === '编辑' || type === '查看'){
					fetch.get(AreaInfo.pre + '/' + id.id, '', res => {
						if(res.code === 200) {
							let {id, ipAddress, name, port} = res.data
							this.dialogForm['b'] = id
							this.dialogForm['c'] = ipAddress
							this.dialogForm['d'] = name
							this.dialogForm['e'] = port
						} else {
              this.$message({
                type: 'warning',
                message: res.message
              })
            }
					})
				}
        
        this.showCard = true
      },
      closeDialog(){
        for (const key in this.filter) {
          this.filter[key] = "";
        }
        for (const key in this.dialogForm) {
          this.dialogForm[key] = "";
        }
      },
      indexMethod(index) {
        return index + 1 + (this.pageNumber - 1) * this.pageSize;
      },
      del(id){
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
        fetch.delete(AreaInfo.pre + '/' + id.id, '', res => {
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
      subForm() {
					if(this.type === '录入'){
						let {
							c,
							d,
							e
						} = this.dialogForm
						
						if(d === '' || c === '' || e === ''){
							this.$message({
								type: 'warning',
								message: '不能为空！'
							})
							return
            }
          if (!this.ip.test(c)) {
            this.$message({
              type: 'warning',
              message: '前置IP输入不正确！'
            })
            return
          }
          if (isNaN(e)) {
            this.$message({
              type: 'warning',
              message: '前置端口只能是数字！'
            })
            return
          }
          if(e > 65535){
						this.$message({
							type: 'warning',
							message: '端口号超过范围！'
						})
						return
					}
						let par = {
							ipAddress: c,
							name: d,
							port: e
						}
						fetch.post(AreaInfo.pre, par, res => {
							if(res.code === 200){
								this.$message({
									type: 'success',
									message: '添加成功！'
								})
								this.getData()
								this.showCard = false
							} else {
                this.$message({
                  type: 'warning',
                  message: res.message
                })
              }
						})
					}
					if(this.type === '编辑'){
						let {
							b,
							c,
							d,
							e
						} = this.dialogForm
						
						if(d === '' || c === '' || e === ''){
							this.$message({
								type: 'warning',
								message: '不能为空！'
							})
							return
						}
          if (!this.ip.test(c)) {
            this.$message({
              type: 'warning',
              message: '前置IP输入不正确！'
            })
            return
          }
          if (isNaN(e)) {
            this.$message({
              type: 'warning',
              message: '前置端口只能是数字！'
            })
            return
          }
          if(e > 65535){
						this.$message({
							type: 'warning',
							message: '端口号超过范围！'
						})
						return
					}
						let par = {
							ipAddress: c,
							name: d,
							id: b,
							port: e
						}
	
						fetch.put(AreaInfo.pre, par, res => {
							if(res.code === 200){
								this.$message({
									type: 'success',
									message: '修改成功！'
								})
								this.getData()
								this.showCard = false
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
  };

</script>

<style scoped>
  * {
    box-sizing: border-box;
  }

  .fitler-wrap {
    padding: 18px;
    padding-bottom: 0;
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
