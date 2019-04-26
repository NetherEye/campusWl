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
          <el-table-column label="执收区间编号" property="sectionId" align="center"></el-table-column>
          <el-table-column label="执收区间名称" property="sectionName" align="center"></el-table-column>
          <el-table-column label="创建时间" property="createTime" align="center"></el-table-column>
          <el-table-column label="状态" align="center">
            <template slot-scope="scope">
            {{scope.row.status == 0 ? '隐藏' : (scope.row.status == 1 ? '正常' : '无效')}}
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button type="text" @click="handle('编辑', scope.row.id)">编辑</el-button>
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
        <el-dialog :title="type" @closed="closeDialog" :visible.sync="showCard" width="800px"
          center>
          <div style="padding-top: 30px;display: flex;justify-content: center;">
              <el-form ref="formRef" :model="dialogForm" label-width="100px" center>
                <el-form-item label="执收区间编号:">
                  <el-input :maxlength="30" v-model="dialogForm.sectionId" clearable></el-input>
                </el-form-item>
                <el-form-item label="执收区间名称:">
                  <el-input :maxlength="30" v-model="dialogForm.sectionName" clearable></el-input>
                </el-form-item>
                <el-form-item label="状态:">
                  <el-select v-model="dialogForm.status" placeholder="请选择" clearable>
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
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
        ID:'',
        showCard:false,
        type:'录入',
        filter: {
          contactNumber: '',
          teacherName: ''
        },
        dialogForm:{
          sectionId:'',
          sectionName:'',
          status:''
        },
        total: 10,
        pageNumber: 1,
        pageSize: 20,
        tableData: [],
        options: [{
          value: -1,
          label: '无效'
        }, {
          value: 1,
          label: '正常'
        },{
          value: 0,
          label: '隐藏'
        }]
      };
    },
    created() {
      this.getData()
    },
    methods: {
      getData() {
        let par = {
            pageNumber: this.pageNumber,
            pageSize: this.pageSize,
        };
        fetch.get(schoolApi.section, par, res => {
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
      save(type){
				for (const key in this.dialogForm) {
					if (this.dialogForm[key] === "") {
						this.$message({
				          message: '请填写完整信息！',
				          type: 'error'
						});
						return
					}
        }
					var str = /[\u4e00-\u9fa5]$/;
					if(!str.test(this.dialogForm.sectionName)) {
						this.$message({
							type: 'warning',
							message: '执收区间名称只能是中文！'
						})
						return
					}
        if(isNaN(this.dialogForm.sectionId)){
          this.$message({
            type: 'warning',
            message: '执收区间编号只能是数字！'
          })
          return
        }
        if (type === '录入') {
          let par = {
            ...this.dialogForm
        };
        fetch.post(schoolApi.section, par, res => {
              if (res.code == 200) {
                  this.$message({
                    message: res.message,
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
          });
        } else {
          let par = {
            id:this.ID,
            ...this.dialogForm
        };
        fetch.put(schoolApi.section, par, res => {
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
      handle(type,id) {
        this.closeDialog()
        this.type = type
        this.showCard = true
        if (type === '编辑') {
          fetch.get(schoolApi.section+'/'+id, '', res => {
              if (res.code == 200) {
                  this.dialogForm.sectionId = res.data.sectionId
                  this.dialogForm.sectionName = res.data.sectionName
                  this.dialogForm.status = res.data.status
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
          fetch.delete(schoolApi.section+'/'+id, {id:id}, res => {
                if (res.code == 200) {
                    this.$message({
                      message: res.message,
                      type: "success"
                    });
                    this.getData()
                }
            });
        }).catch(() => {});
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
