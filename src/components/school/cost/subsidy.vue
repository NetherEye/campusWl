<template>
  <div class="wrap">
    <div class="header">
      <div class="fitler-wrap">
        <el-form :inline="true" :model="sfilter" label-width="80px" class="demo-form-inline">
          <el-form-item label="费用项目:">
            <el-select v-model="sfilter.projects" placeholder="请选择" clearable>
              <el-option v-for="item in projects" :key="item.id" :label="item.name" :value="[item.id,item]">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="执收区间:">
            <el-select v-model="sfilter.sections" placeholder="请选择" clearable>
              <el-option v-for="item in sections" :key="item.id" :label="item.sectionName" :value="[item.id,item]">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="success" @click="inputData = true">补贴信息导入</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div style="display: flex;overflow: auto;">
      <div class="block">
        <div class="header">
          <p style="font-size: 14px;color: #606266;margin-bottom: 20px;" class="fitler-wrap">人员列表</p>
          <div class="fitler-wrap">
            <el-form :inline="true" :model="tfilter" label-width="80px" class="demo-form-inline">
              <el-form-item label="人员类别:" prop="personType">
                <el-select v-model="tfilter.objectId" placeholder="请选择" clearable @change="findCxs">
                  <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="学号/工号:" prop="personType">
                <el-input :maxlength="30" v-model="tfilter.number" clearable placeholder="请输入内容"></el-input>
              </el-form-item>
              <el-form-item label="姓名:" prop="personType">
                <el-input :maxlength="30" v-model="tfilter.name" clearable placeholder="请输入内容"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="success" @click="findCxs">查询</el-button>
              </el-form-item>
              <el-form-item>
                <el-button type="success" @click="resets">重置</el-button>
              </el-form-item>
            </el-form>
            <el-form :inline="true">
              <el-form-item>
                <el-button type="success" @click="addData">添加</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <div class="tableData">
          <el-table ref="Table" :data="tableData" highlight-current-row style="width: 100%" @selection-change="handleSelectionChange1">
            <el-table-column type="selection" align="center" width="60">
            </el-table-column>
            <el-table-column :property="objectId == 2?'jobNumber':'studentId'" label="工号/学号" align="center">
            </el-table-column>
            <el-table-column :property="objectId == 2?'teacherName':'studentName'" label="姓名" align="center">
            </el-table-column>
            <el-table-column property="gender" label="性别" align="center">
            </el-table-column>
            <el-table-column :label="objectId == 2?'人员类型':'年级班级'" align="center">
              <template slot-scope="scope">
                {{objectId == 2?scope.row.deptName:scope.row.gradeName + scope.row.className}}
              </template>
            </el-table-column>
          </el-table>
          <div class="fenye" v-if="totals != 0">
            <div class="fenye_title">共 {{totals}} 条数据 每页 {{pageSizes}} 条数据 共 {{Math.floor(totals/pageSizes) +
              (totals%pageSizes != 0 ? 1 : 0)}} 页</div>
            <el-pagination :current-page.sync="pageNumbers" :page-size="pageSizes" @current-change="getDatas" layout="prev, pager, next, jumper"
              :total="totals">
            </el-pagination>
          </div>
        </div>

      </div>
      <div style="margin: 10px;"></div>
      <div class="block">
        <div class="header">
          <p style="font-size: 14px;color: #606266;margin-bottom: 20px;" class="fitler-wrap">补贴人员列表</p>
          <div class="fitler-wrap">
            <el-form :inline="true" :model="filter" label-width="80px" class="demo-form-inline">
              <el-form-item label="工号/学号:">
                <el-input :maxlength="30" v-model="filter.number" clearable placeholder="请输入内容"></el-input>
              </el-form-item>
              <el-form-item label="姓名:">
                <el-input :maxlength="30" v-model="filter.username" clearable placeholder="请输入内容"></el-input>
              </el-form-item>
              <el-form-item label="审核状态:">
                <el-select v-model="filter.status" placeholder="请选择" clearable>
                  <el-option v-for="item in options1" :key="item.value" :label="item.label" :value="item.value">
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
                <el-button type="success" @click="examine">审核</el-button>
                <el-button type="warning" @click="del">删除</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <div class="tableData">
          <el-table ref="singleTable" :data="tData" highlight-current-row style="width: 100%" @selection-change="handleSelectionChange">
            <el-table-column type="selection" align="center" width="60" :selectable="checkboxInit">
            </el-table-column>
            <el-table-column property="number" label="工号/学号" align="center">
            </el-table-column>
            <el-table-column property="username" label="姓名" align="center">
            </el-table-column>
            <el-table-column property="sex" label="性别" align="center">
            </el-table-column>
            <el-table-column property="projectName" label="项目名称" align="center">
            </el-table-column>
            <el-table-column property="sectionName" label="执收区间" align="center">
            </el-table-column>
            <el-table-column property="money" label="金额" align="center">
            </el-table-column>
            <el-table-column label="发放方式" align="center">
              <template slot-scope="scope">{{['', '刷卡器','消费机'][scope.row.type]}}</template>
            </el-table-column>
            <el-table-column label="审核状态" align="center">
              <template slot-scope="scope">{{status == 'over' ? (scope.row.isValid == 1 && scope.row.status == 0) ? '未审核过期' : '已审核过期' : ['未审核', '已审核','已过期'][scope.row.status]}}</template>
            </el-table-column>
          </el-table>
          <div class="fenye" v-if="tTotal != 0">
            <div class="fenye_title">共 {{tTotal}} 条数据 每页 {{pageSize}} 条数据 共 {{Math.floor(tTotal/pageSize) +
              (tTotal%pageSize != 0 ? 1 : 0)}} 页</div>
            <el-pagination :current-page.sync="pageNumber" :page-size="pageSize" @current-change="getData" layout="prev, pager, next, jumper"
              :total="tTotal">
            </el-pagination>
          </div>
        </div>
        <div class="el-title">
          <el-dialog title="发放补贴" @closed="closeDialog" :visible.sync="showCard" width="800px" center>
            <div style="padding: 30px 30px 0;display: flex;justify-content: space-around;">
              <el-form ref="userFormRef" :model="dialogForm" :label-position="labelPosition" label-width="150px" center
                size="small">
                <el-form-item label="金额:">
                  <el-input :maxlength="10" v-model="dialogForm.money" clearable placeholder="请输入内容"></el-input>
                </el-form-item>
                <el-form-item label="过期时间:">
                  <el-date-picker style="width:203px;" :editable="false" v-model="dialogForm.validTime" type="date" value-format="yyyy-MM-dd"
                    :picker-options="pickerOptions"
                    placeholder="选择日期">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="发放方式:">
                  <el-select v-model="dialogForm.type" placeholder="请选择">
                    <el-option v-for="item in sendType" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-form>
            </div>
            <div style="padding: 20px 0 40px;">
              <div style="display: flex;align-items: center;justify-content: center;">
                <el-button type="success" size="medium" @click="sure">确定</el-button>
                <el-button type="success" size="medium" @click="showCard = false">取消</el-button>
              </div>
            </div>
          </el-dialog>
        </div>
        <div class="el-title">
          <el-dialog title="补贴信息导入" @closed="closeDialogs" :visible.sync="inputData" width="800px" center>
            <div class="wu_region">
              <div class="footer">
                <div class="zly">
                  <input ref="file" style="position: absolute;cursor: pointer;z-index: 99;" class="file" type="file" name="" id="" value="" @change="handleFile" />
                  <div class="ellipsis" style="position: absolute;top:5px;z-index: 1;cursor: pointer;width: 328px;">
                    <p style="margin-left:10px;">{{fileName}}</p>
                  </div>
                </div>
                <el-button type="success" @click="uploading" size="small">导入文件</el-button>
                <el-button type="success" style="margin-left: 0px;" @click="download" size="small">下载模板</el-button>
              </div>
            </div>
          </el-dialog>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
  import schoolApi from "@/assets/api/school"
  import fetch from '@/assets/tools/fetch'
	import XLSX from 'xlsx'
  export default {
    data() {
      return {
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() < Date.now();
          }
        },  
        fileName: '点击此处选择需要导入的Excel文件',
        status:'',
        ID: [],
        Table: [],
        objectId: 2,
        labelPosition: 'right',
        showCard: false,
        inputData: false,
        tableData: [],
        tData: [],
        total: 0,
        tTotal: 0,
        pageNumber: 1,
        pageSize: 20,
        totals: 0,
        pageNumbers: 1,
        pageSizes: 20,
        filter: {
          username: '',
          number: '',
          walletName: '',
          status: ''
        },
        tfilter: {
          schoolId: '',
          number: '',
          objectId: 2,
          name: ''
        },
        sfilter: {
          sections: '',
          projects: ''
        },
        dialogForm: {
          type: '',
          money: '',
          validTime: ''
        },
        projects: [],
        sections: [],
        options: [{
          value: 2,
          label: '教职工'
        }, {
          value: 1,
          label: '学生'
        }],
        options1: [{
          value: 1,
          label: '已审核'
        }, {
          value: 0,
          label: '未审核'
        }, {
          value: 2,
          label: '已过期'
        }],
        sendType: [{
          value: 2,
          label: '消费机'
        }, {
          value: 1,
          label: '刷卡器'
        }]
      }
    },
    created() {
      this.getData()
      this.getDatas()
      this.projectSection()
    },
    methods: {
      findCx() {
          this.pageNumber = 1
          this.getData()
      },
      findCxs() {
          this.pageNumber = 1
          this.getDatas()
      },
      handleFile() {
        var file = this.$refs['file'].files[0];
				this.readExcel(file)
        if(file == undefined) {
					this.$message({
						type: 'warning',
						message: '请选择导入文件！'
					})
        this.$refs['file'].value = ''
        this.fileName = '点击此处选择需要导入的Excel文件'
					return
				};
        if (file.name.lastIndexOf('.')==-1){    //如果不存在"."  
          this.$message({
            type: 'error',
            message: '文件路径不正确！'
          })
        this.$refs['file'].value = ''
        this.fileName = '点击此处选择需要导入的Excel文件'
            return
        }
        var _type = file.name.slice(file.name.lastIndexOf('.') + 1);
        var others = ['xls', 'xlsx'];
        if(others.indexOf(_type) === -1){
          this.$message({
            type: 'error',
            message: '文件格式暂不支持！'
          })
        this.$refs['file'].value = ''
        this.fileName = '点击此处选择需要导入的Excel文件'
          return
        }
				this.fileName = file.name
      },
			readExcel(files) {//表格导入
				var that = this;
				if(files.length<=0){//如果没有文件名
					return false;
				}else if(!/\.(xls|xlsx)$/.test(files.name.toLowerCase())){
					this.$message.error('上传格式不正确，请上传xls或者xlsx格式');
					return false;
				}
			
				const fileReader = new FileReader();
				fileReader.onload = (ev) => {
				try {
					const data = ev.target.result;
					const workbook = XLSX.read(data, {
					type: 'binary'
					});
					const wsname = workbook.SheetNames[0];//取第一张表
					const ws = XLSX.utils.sheet_to_json(workbook.Sheets[wsname]);//生成json表格内容
					
					let a = ws[0]
          let b = {'此行不要删除':"人员编号"}
          
					if (a['此行不要删除'] != b['此行不要删除']) {
						this.$message({
							type: 'warning',
							message: '请导入正确的模板数据'
						})
						this.$refs['file'].value = '';
						this.fileName = '点击此处选择需要导入的Excel文件';
						return false;
					}
			
				} catch (files) {
			
					return false;
				}
				};
				fileReader.readAsBinaryString(files);
			},
      download(){
        fetch.export(schoolApi.download, '', res => {
            if(res.code === 200) {
              this.$message({
                type: 'success',
                message: '导出成功'
              })
            }else {
              this.$message({
                type: 'warning',
                message: res.message
              })
            }
        })
      },
      uploading() {
				var file = this.$refs['file'].files[0];
				if(file == undefined) {
					this.$message({
						type: 'warning',
						message: '请选择导入文件！'
					})
					return
				};

				fetch.exports(schoolApi.subsidies+'/import', file, res => {
          console.log(res);
          if (res.code === 200) {
              this.$message({
                  type: 'success',
                  duration: '1000',
                  message: '导入成功！'
              })
              this.inputData = false
            }else {
                this.$message({
                    type: 'warning',
                    message: res.message
                })
                
            }
				})
			},
      //获取所以区间和项目
      projectSection(){
        fetch.get(schoolApi.projectSection, '', res => {
          if (res.code == 200) {
            this.projects = res.data.projects
            this.sections = res.data.sections
          } else {
            this.projects = []
            this.sections = []
          }
        })
      },
      getData() {
        if (this.filter.status == 2) {
          this.status = 'over'
        }else{
          this.status = ''
        }
        let par = {
          pageNumber: this.pageNumber,
          pageSize: this.pageSize,
          ...this.filter
        }
        fetch.get(schoolApi.subsidies, par, res => {
          if (res.code == 200) {
            this.tData = res.data
            this.tTotal = res.total
          } else {
            this.tData = []
            this.tTotal = 0
          }
        }, {
            target: '.el-table__body-wrapper'
        })
      },
      getDatas() {
        this.objectId = this.tfilter.objectId
        this.Table = []
        let par = {
          pageNumber: this.pageNumbers,
          pageSize: this.pageSizes,
          ...this.tfilter
        }
        fetch.get(schoolApi.personlist, par, res => {
          if (res.code == 200) {
            this.tableData = res.data
            this.totals = res.total
          } else {
            this.tableData = []
            this.totals = 0
          }
        }, {
            target: '.el-table__body-wrapper'
        })
      },
      addData(){
        for (const key in this.sfilter) {
          if (this.sfilter[key] === '') {
            this.$message({
                duration: "2000",
                showClose: true,
                message: '请选择项目区间！',
                type: "warning"
              });
              return
          }
        }
        if (this.Table.length == 0) {
          this.$message({
              duration: "2000",
              showClose: true,
              message: '请选择人员！',
              type: "warning"
            });
            return
        } else if(this.Table.length > 1) {
          this.$message({
              duration: "2000",
              showClose: true,
              message: '请单个添加人员！',
              type: "warning"
            });
            return
        } else {
          this.showCard = true
        }
      },
      reset() {
        for (const key in this.filter) {
          this.filter[key] = ''
        }
        this.status = ''
      },
      resets() {
        for (const key in this.tfilter) {
          this.tfilter[key] = ''
        }
      },
      closeDialog() {
        for (const key in this.dialogForm) {
          this.dialogForm[key] = ''
        }
      },
      closeDialogs() {
        this.$refs['file'].value = ''
        this.fileName = '点击此处选择需要导入的Excel文件'
      },
      sure() {
        for (const key in this.dialogForm) {
          if (this.dialogForm[key] === '') {
            this.$message({
                duration: "2000",
                showClose: true,
                message: '请填写完整！',
                type: "warning"
              });
              return
          }
        }
        var num = /^[1-9]\d*$/;
				if(!num.test(this.dialogForm.money)){
					this.$message({
						type: 'error',
						message: '输入金额有误！'
					})
					return
				}
        if (this.dialogForm.money < 0) {
            this.$message({
                duration: "2000",
                showClose: true,
                message: '补贴金额不能小于0！',
                type: "warning"
              });
              return
          }
          if (this.dialogForm.money > 20000) {
            this.$message({
                duration: "2000",
                showClose: true,
                message: '补贴金额有误！',
                type: "warning"
              });
              return
          }
        let par = {
          userId:this.Table[0].id,
          number:this.tfilter.objectId == 2 ? this.Table[0].jobNumber : this.Table[0].studentId,
          username:this.tfilter.objectId == 2 ? this.Table[0].teacherName : this.Table[0].studentName,
          walletName:this.sfilter.walletType == 1 ? '主钱包' : '补贴钱包',
          personType:this.tfilter.objectId,
          sex:this.Table[0].gender,
          money:this.dialogForm.money,
          validTime:this.dialogForm.validTime,
          type:this.dialogForm.type,
          projectId:this.sfilter.projects[0],
          sectionId:this.sfilter.sections[0],
          projectName:this.sfilter.projects[1].name,
          sectionName:this.sfilter.sections[1].sectionName,
          groupType:this.tfilter.objectId == 2 ? this.Table[0].deptName : this.Table[0].gradeName+this.Table[0].className,
        }
        if (par.number == '' || par.number === undefined ) {
           this.$message({
              duration: "2000",
              showClose: true,
              message: '补贴人员信息不完整！',
              type: "warning"
            });
            return
        }
        if (par.username == '' || par.username === undefined ) {
           this.$message({
              duration: "2000",
              showClose: true,
              message: '补贴人员信息不完整！',
              type: "warning"
            });
            return
        }
        if (par.walletName == '' || par.walletName === undefined ) {
           this.$message({
              duration: "2000",
              showClose: true,
              message: '补贴人员信息不完整！',
              type: "warning"
            });
            return
        }
        if (par.personType == '' || par.personType === undefined ) {
           this.$message({
              duration: "2000",
              showClose: true,
              message: '补贴人员信息不完整！',
              type: "warning"
            });
            return
        }
        if (par.projectName == '' || par.projectName === undefined ) {
           this.$message({
              duration: "2000",
              showClose: true,
              message: '补贴人员信息不完整！',
              type: "warning"
            });
            return
        }
        if (par.sectionName == '' || par.sectionName === undefined ) {
           this.$message({
              duration: "2000",
              showClose: true,
              message: '补贴人员信息不完整！',
              type: "warning"
            });
            return
        }
        if (par.groupType == '' || par.groupType === undefined ) {
           this.$message({
              duration: "2000",
              showClose: true,
              message: '补贴人员信息不完整！',
              type: "warning"
            });
            return
        }
        fetch.post(schoolApi.subsidies, par, res => {
          if (res.code == 200) {
            this.$message({
              duration: "2000",
              showClose: true,
              message: "录入成功！",
              type: "success"
            });
            this.getData()
            this.showCard = false
          }else {
                this.$message({
                    type: 'warning',
                    message: res.message
                })
            }
        })
        
      },
      examine() {
        if (this.ID.length == 0) {
            this.$message({
                duration: "2000",
                showClose: true,
                message: '请选择补贴人员！',
                type: "warning"
              });
              return
          }
        let IDs = ''
        this.ID.forEach(v => {
          IDs += v.id + ','
        });
        fetch.put(schoolApi.subsidies+'/multiple',{ids: IDs.slice(0, IDs.lastIndexOf(','))}, res => {
            if (res.code == 200) {
              this.$message({
                duration: "2000",
                showClose: true,
                message: "审核成功！",
                type: "success"
              });
              this.ID = []
              this.getData()
            }else {
                this.$message({
                    type: 'warning',
                    message: res.message
                })
            }
        })
      },
      del(){
        if (this.ID.length == 0) {
            this.$message({
                duration: "2000",
                showClose: true,
                message: '请选择补贴人员！',
                type: "warning"
              });
              return
          }
        let IDs = ''
				this.ID.forEach(v => {
					IDs += v.id + ','
				});
				this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
          let data = IDs.split(",")
          for (let i = 0; i < data.length-1; i++) {
            fetch.delete(schoolApi.subsidies+'/'+data[i], '', res => {
              if (res.code == 200) {
                this.$message({
                  duration: "2000",
                  showClose: true,
                  message: "删除成功",
                  type: "success"
                });
                this.getData()
              }
            })
          }
				}).catch(() => {

				});
      },
      checkboxInit(row){
    　　if (row.status == 1)//这个判断根据你的情况而定
    　　　　return 0;//不可勾选
    　　else
    　　　　return 1;//可勾选
    　　},
      handleSelectionChange(val) {
        this.ID = val;
      },
      handleSelectionChange1(val) {
        this.Table = val;
      }
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
    /* display: flex; */
    width: 100%;
    height: 100%;
    padding: 20px;
    background-color: #edf0f5;
    overflow: auto;
  }

  .block {
    background-color: #ffffff;
    box-shadow: 0px 2px 9px 0px rgba(105, 105, 105, 0.07);
    border-radius: 3px;
  }
.wu_region {
		padding: 50px 100px 50px;
	}
	
	.wu_region .footer {
		display: flex;
		justify-content: space-around;
	}
	
	.wu_region .zly {
		width: 330px;
		height: 30px;
		background-color: #ffffff;
		border-radius: 4px;
		border: solid 1px #eeeeee;
		position: relative;
		cursor: pointer;
	}
	
	.wu_region .zly .file {
		width: 100%;
		height: 100%;
		border: none;
		/* outline: none; */
		opacity: 0;
		cursor: pointer;
		float: right;
	}
	
	.wu_region .wu_bt4 {
		width: 100px;
		height: 44px;
		background-color: #128fe3;
		border-radius: 4px;
		border: solid 1px #128fe3;
		color: #ffffff;
		cursor: pointer;
	}
</style>
