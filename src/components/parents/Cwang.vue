<template>
  <div class="cw">
    <ul>
      <li v-for="item in childrenData" @click="cnet(item)">
        <img src="../../../static/img/p_index/hz.png" alt="">
        <p>{{item.studentName}}</p>
        <div>终端号码 {{item.belongId}}</div>
      </li>
    </ul>
    <div class="el-title">
      <el-dialog :title="name+'的C网设置'" :visible.sync="dialogVisible" @closed="closeDialog" width="800px" center>
        <div class="tip">
          <div class="btn">
              <div class="hm"><span>设置亲情号码</span></div>
              <div class="sf">
                  <span>身份</span>
                  <el-select v-model="value" placeholder="请选择" disabled>
                    <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select><br>
                <span>身份</span>
                  <el-select v-model="value1" placeholder="请选择" disabled>
                    <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select><br>
                <span>身份</span>
                  <el-select v-model="value2" placeholder="请选择" disabled>
                    <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
              </div>
              <div class="sj">
                  <span>手机号码</span><el-input :maxlength="11" v-model="input" placeholder="请输入内容" @change="test(input)"></el-input><br>
                  <span>手机号码</span><el-input :maxlength="11" v-model="input1" placeholder="请输入内容" @change="test(input1)"></el-input><br>
                  <span>手机号码</span><el-input :maxlength="11" v-model="input2" placeholder="请输入内容" @change="test(input2)"></el-input>
              </div>
          </div>
          <div class="tip_conter">
            <span>设置SOS号码</span><el-input :maxlength="11" v-model="input3" placeholder="请输入内容" @change="test(input3)"></el-input><br>
            <span class="name1">设置允许呼入号码</span>
            <el-input 
                type="textarea"
                :rows="4"
                :maxlength="110"
                placeholder="请输入内容,多个号码请用英文逗号隔开"
                v-model="textarea">
            </el-input><br>
            <span class="name2">设置允许接收短信号码</span>
            <el-input 
                type="textarea"
                :rows="4"
                :maxlength="110"
                placeholder="请输入内容,多个号码请用英文逗号隔开"
                v-model="textarea1">
            </el-input>
          </div>
          <el-button class="save" @click="cset">保存</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import fetch from "@/assets/tools/fetch"
import parents from "@/assets/api/parents"
  export default {
    name: "p_Cwang",
    data() {
      return {
        id:'',
        name:'',
        dialogVisible: false,
        value: '父亲',
        value1:'母亲',
        value2:'其他',
        input: '',
        input1: '',
        input2: '',
        input3: '',
        textarea:'',
        textarea1:'',
        options: [{
          value: '父亲',
          label: '父亲'
        }, {
          value: '母亲',
          label: '母亲'
        }, {
          value: '其他',
          label: '其他'
        }],
        childrenData: []
      }
    },
    created() {
      this.getData()
    },
    methods: {
      test(a){
        var reg = /^[0-9]*$/;
        if (!reg.test(a)) {
          this.$message({
            type: 'warning',
            message: '手机号码只能是数字！'
          })
          return
        }
      },
      getData(){
        fetch.get(parents.cnet, '', res => {
          if (res.code === 200) {
            this.childrenData = res.data;
          }else{
            this.$message({
              type: "warning",
              message: res.message,
            })
          }
        })
      },
      closeDialog(){
        this.input = ''
        this.input1 = ''
        this.input2 = ''
        this.input3 = ''
        this.textarea = ''
        this.textarea1 = ''
      },
      cnet(item){
        this.dialogVisible = true
        this.id = item.id
        let par = {
          id: item.id
        }
        fetch.get(parents.cnet+'/'+item.id, par, res => {
          if (res.code === 200) {
            this.name = res.data.studentName
						this.input = res.data.familyNumber.split(',')[0]
						this.input1 = res.data.familyNumber.split(',')[1]
						this.input2 = res.data.familyNumber.split(',')[2]
            this.input3 = res.data.sos
            this.textarea = res.data.incomingCalls
            this.textarea1 = res.data.incomingSms
          }else{
            this.$message({
              type: "warning",
              message: res.message,
            })
          }
        })
      },
      cset(){
        var myreg = /^(1[3456789][0-9]{9})$/;
        if (this.input == ''||this.input1 == ''||this.input2 == ''||this.input3 == '') {}
        else if (!myreg.test(this.input)||!myreg.test(this.input1)||!myreg.test(this.input2)||!myreg.test(this.input3)) {
          this.$message({
            type: 'warning',
            message: '手机号码格式不正确'
          })
          return 
        }
        var reg = /^[0-9]*$/;
        if (!reg.test(this.input)||!reg.test(this.input1)||!reg.test(this.input2)||!reg.test(this.input3)) {
          this.$message({
            type: 'warning',
            message: '手机号码只能是数字！'
          })
          return
        }
        if (this.input == '' && this.input1 == '' && this.input2 == '')  {
          this.$message({
            type: 'warning',
            message: '请至少填写一个亲情号码！'
          })
          return 
        }
        if (this.input3 == '')  {
          this.$message({
            type: 'warning',
            message: 'SOS号码不能为空！'
          })
          return 
        }
        if (this.value == this.value1 || this.value == this.value2 || this.value1 == this.value2)  {
          this.$message({
            type: 'warning',
            message: '该身份已经添加！'
          })
          return 
        }
        if (this.input==this.input1&&this.input2==''||this.input==this.input2&&this.input1==''||this.input1==this.input2&&this.input=='')  {
          this.$message({
            type: 'warning',
            message: '该手机号已经添加！'
          })
          return 
        }
        if ((this.input==this.input1||this.input==this.input2||this.input1==this.input2)&&this.input!=''&&this.input1!=''&&this.input2!='')  {
          this.$message({
            type: 'warning',
            message: '该手机号已经添加！'
          })
          return 
        }
        let par = {
          id: this.id,
          familyNumber: this.input+','+this.input1+','+this.input2 == ',,' ? '' : this.input+','+this.input1+','+this.input2,
          sos: this.input3,
          incomingCalls: this.textarea == ''?'':(this.textarea == '*'?'*':(this.textarea.length<11?this.textarea+'*':this.textarea)),
          incomingSms: this.textarea1 == ''?'':(this.textarea1 == '*'?'*':(this.textarea1.length<11?this.textarea1+'*':this.textarea1))
        }
        let a = par.incomingCalls.split(",")
        let b = par.incomingSms.split(",")
        for (let i = 0; i < a.length; i++) {
          if (a[i] === '') {}
          else if (!myreg.test(a[i])) {
            this.$message({
              type: 'warning',
              message: '允许呼入号码格式不正确！'
            })
            return 
          }else if (!reg.test(a[i])) {
            this.$message({
              type: 'warning',
              message: '允许呼入号码只能是数字！'
            })
            return 
          }
        }
        for (let i = 0; i < b.length; i++) {
          if (b[i] === '') {}
          else if (!myreg.test(b[i])) {
            this.$message({
              type: 'warning',
              message: '接收短信入号码格式不正确！'
            })
            return 
          }else if (!reg.test(b[i])) {
            this.$message({
              type: 'warning',
              message: '接收短信号码只能是数字！'
            })
            return 
          }
        }
        fetch.put(parents.card, par, res => {
          if (res.code === 200) {
            this.$message({
              duration: "2000",
              message: res.message,
              type: "success"
            });
            setTimeout(() => {
              this.dialogVisible = false
            },1000)
          }else{
            this.$message({
              type: "warning",
              message: res.message,
            })
          }
        })
      }
    }
  }

</script>
<style>
  .el-textarea .el-textarea__inner{
    font-family: Arial;
  }
</style>
<style scoped>
  .cw ul li {
    float: left;
    width: 286px;
    padding-top: 20px;
    margin-left: 35px;
    margin-top: 31px;
    background-color: #ffffff;
    font-size: 16px;
    text-align: center;
    box-shadow: 0px 3px 8px 0px rgba(41, 48, 56, 0.18);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;

  }

  .cw ul li img {
    width: 100%;
    max-width: 84px;
    height: auto;
  }

  .cw ul li p {
    color: #333;
    margin: 10px;
  }

  .cw ul li div {
    width: 286px;
    height: 46px;
    background-color: #08b065;
    line-height: 46px;
    color: #fff;
  }
  .btn{
      display: flex;
  }
.tip{
    padding: 20px;color: #333;
}
.btn .sf,.btn .sj{
    flex: 1;
}
.btn div.hm{
    width: 120px;
    padding-top: 10px;
}
.btn div.hm span{
    position: relative;
    left: 20px;
}
.btn span{
    margin-right: 10px;
}
.tip_conter span{
    display: inline-block;
    width: 162px;
    text-align: right;
    position: relative;
    right: 15px;
}
.tip_conter .name1,.tip_conter .name2{
    position: relative;
    top: -90px;
}
.el-select,.el-input,.el-textarea{
    width: auto;
    margin-bottom: 20px;
}
.tip_conter .el-input,.tip_conter .el-textarea{
    width: 551px;
}
.tip_conter .el-textarea{
    margin-left: -3px;
}
.save {
    display: block;
	width: 90px;
    height: 30px;
    line-height: 0;
    background-color: #08b065;
    color: #fff;
    margin: 20px auto;
}
</style>
