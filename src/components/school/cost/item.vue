<template>
  <div class="wrap">
    <div class="block">
      <div class="header">
        <div class="fitler-wrap">
          <el-form :inline="true" :model="filter" class="demo-form-inline">
            <el-form-item label="项目编号:">
              <el-input :maxlength="30" v-model="filter.number" placeholder="请输入" clearable></el-input>
            </el-form-item>
            <el-form-item label="项目名称:">
              <el-input :maxlength="30" v-model="filter.name" placeholder="请输入" clearable></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="success" @click="handle('录入')">录入</el-button>
            </el-form-item>
            <el-form-item>
              <el-button type="success" @click="findCx">查询</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="tableData">
        <el-table ref="singleTable" :data="tableData" highlight-current-row style="width: 100%" @selection-change="handleSelectionChange">
          <el-table-column label="序号" type="index" :index="indexMethod" width="100px" align="center"></el-table-column>
          <el-table-column label="项目编号" property="number" align="center"></el-table-column>
          <el-table-column label="项目名称" property="name" align="center"></el-table-column>
          <el-table-column label="收支类型" align="center">
            <template slot-scope="scope">{{['', '普通补贴'][scope.row.type]}}</template>
          </el-table-column>
          <el-table-column label="钱包类型" align="center">
            <template slot-scope="scope">{{['', '主钱包','补贴钱包'][scope.row.walletType]}}</template>
          </el-table-column>
          <el-table-column label="创建时间" property="createTime" align="center"></el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button type="text" @click="handle('编辑', scope.row.id)">编辑</el-button>
              <el-button type="text" @click="handle('查看', scope.row.id)">查看</el-button>
              <el-button type="text" @click="del(scope.row.id)">删除</el-button>
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
        <el-dialog :title="type" @closed="closeDialog" :visible.sync="showCard" width="800px" center>
          <div style="padding-top: 30px;display: flex;justify-content: center;">
            <el-form ref="formRef" :model="dialogForm" label-width="75px" center>
              <el-form-item label="项目编号:">
                <el-input :maxlength="30" style="width:auto;" v-model="dialogForm.number" clearable :disabled="type == '查看' ? true : false"></el-input>
              </el-form-item>
              <el-form-item label="项目名称:">
                <el-input :maxlength="30" style="width:auto;" v-model="dialogForm.name" clearable :disabled="type == '查看' ? true : false"></el-input>
              </el-form-item>
              <el-form-item label="收支类型:">
                <el-select v-model="dialogForm.type" placeholder="请选择" clearable :disabled="type == '查看' ? true : false">
                  <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="钱包类型:" prop="contactNumber">
                <el-select v-model="dialogForm.walletType" placeholder="请选择" clearable :disabled="type == '查看' ? true : false">
                  <el-option v-for="item in options1" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </div>
					<div style="padding: 20px;">
						<div style="display: flex;align-items: center;justify-content: center;" v-if="type != '查看'">
                <el-button type="success" size="medium" @click="save(type)">保存</el-button>
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
  export default {
    data() {
      return {
        ID: '',
        showCard: false,
        type: '录入',
        filter: {
          number: '',
          name: ''
        },
        dialogForm: {
          number: '',
          name: '',
          type: '',
          walletType: 2
        },
        total: 0,
        pageNumber: 1,
        pageSize: 20,
        tableData: [],
        options: [{
          value: 1,
          label: '普通补贴'
        }],
        options1: [{
          value: 1,
          label: '主钱包'
        }, {
          value: 2,
          label: '补贴钱包'
        }]
      };
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
          ...this.filter
        };
        fetch.get(schoolApi.project, par, res => {
          if (res.code == 200) {
            this.tableData = res.data;
            this.total = res.total;
          } else {
            this.tableData = [];
            this.total = 0;
          }
        }, {
          target: '.el-table__body-wrapper'
        });
      },
      save(type) {
				for (const key in this.dialogForm) {
					if (this.dialogForm[key] == "") {
						this.$message({
				          message: '请填写完整信息！',
				          type: 'error'
						});
						return
					}
        }
					var str = /[\u4e00-\u9fa5]$/;
					if(!str.test(this.dialogForm.name)) {
						this.$message({
							type: 'warning',
							message: '项目名称只能是中文！'
						})
						return
					}
        if(isNaN(this.dialogForm.number)){
          this.$message({
            type: 'warning',
            message: '项目编号只能是数字！'
          })
          return
        }
        if (type === '录入') {
          let par = {
            ...this.dialogForm
          };
          fetch.post(schoolApi.project, par, res => {
            if (res.code == 200) {
              this.$message({
                message: res.message,
                type: "success"
              });
              this.getData()
              this.showCard = false
            } else {
                this.$message({
                    type: 'warning',
                    message: res.message
                })
            }
          });
        } else {
          let par = {
            id: this.ID,
            ...this.dialogForm
          };
          fetch.put(schoolApi.project, par, res => {
            if (res.code == 200) {
              this.$message({
                message: res.message,
                type: "success"
              });
              this.getData()
              this.showCard = false
            } else {
                this.$message({
                    type: 'warning',
                    message: res.message
                })
            }
          });
        }
      },
      handle(type, id) {
        this.type = type
        this.showCard = true
        if (type === '查看') {
          fetch.get(schoolApi.project + '/' + id, '', res => {
            if (res.code == 200) {
              this.dialogForm.walletType = res.data.walletType
              this.dialogForm.number = res.data.number
              this.dialogForm.name = res.data.name
              this.dialogForm.type = res.data.type
            } else {
                this.$message({
                    type: 'warning',
                    message: res.message
                })
            }
          });
        }
        if (type === '编辑') {
          fetch.get(schoolApi.project + '/' + id, '', res => {
            if (res.code == 200) {
              this.dialogForm.walletType = res.data.walletType
              this.dialogForm.number = res.data.number
              this.dialogForm.name = res.data.name
              this.dialogForm.type = res.data.type
              this.ID = res.data.id
            } else {
                this.$message({
                    type: 'warning',
                    message: res.message
                })
            }
          });
        }
      },
      closeDialog() {
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
      del(id) {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
        fetch.delete(schoolApi.project + '/' + id, '', res => {
          if (res.code == 200) {
            this.$message({
              message: res.message,
              type: "success"
            });
            this.getData()
          } else {
                this.$message({
                    type: 'warning',
                    message: res.message
                })
            }
        });
        }).catch(() => {});
      },
      clickUser() {
				let ID = ''
				this.Table.forEach(v => {
					ID += v.id+','
				});
				this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					fetch.delete(SchoolIntroduce.deleteSchoolInformByid, {schoolInformIds:ID.slice(0,ID.lastIndexOf(','))}, res => {
						if (res.code == 200) {
							this.$message({
								duration: "2000",
								showClose: true,
								message: "删除成功",
								type: "success"
							});
							this.getData()
						}else {
                this.$message({
                    type: 'warning',
                    message: res.message
                })
            }
					})
				}).catch(() => {

				});
			},
			handleSelectionChange(val) {
				this.ID = val;
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
