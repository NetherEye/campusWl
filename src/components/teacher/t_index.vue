<template>
  <div class="wrap public">
    <div class="top">
      <div class="top_left">
        <img src="../../../static/img/p_index/logo.png" alt="">
        <span>物联校园</span>
      </div>
      <div class="top_right">
        <div class="userInfo">
          <i></i>
          <span>{{userType}}</span>
        </div>
        <div class="logout">
          <i></i>
          <span @click="quit">退出</span>
        </div>
      </div>
    </div>
    <div class="content">
      <div class="left">
        <div class="left_nav">
          <li v-for="(i,index) in this.navData" :class="jumpActive == index?'active_nav':''" >
            <div class="mainNav"  @click="isClick(index,i.status,i.path)">
            <img :src="i.icon"/>
            <span>{{i.title}}</span>
            </div>
            <div v-for="x in i.fuTitl" v-if="i.status" @click="isClick2(x.path,index)">
              <i></i>
              <span>{{x.title}}</span>
            </div>
          </li>
        </div>
      </div>
      <div class="right">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
  import fetch from '@/assets/tools/fetch'
  import allApi from "@/assets/api/login"
  export default {
    name: "p_index",
    data () {
      return {
        navData : [
          {
            title : '首页',
            status: true,
            path : 't_shouye',
            icon: '../../../static/img/cg/sy.png'
          },
          {
            title : '学生安全',
            status: false,
            path : 'anquan',
            icon: '../../../static/img/cg/an.png',
          }
        ],
        jumpActive: 0,
        userType :''
      }
    },
    created (){

      this.userType = JSON.parse(sessionStorage.getItem('userInfo')).nickname || ''
      let path = JSON.parse(sessionStorage.getItem('activeNav'))
        if(path){
          this.jumpActive = path.index
        }
    },
    methods: {
      isClick (index,status,path) {
        this.jumpActive = index
        sessionStorage.setItem('activeNav', JSON.stringify({path:path,index:index}))
        this.navData[index].status = !this.navData[index].status
        this.$router.push({
          path: path
        })
      },
      quit () {
        fetch.get(allApi.logout,'',res=>{
          if (res.code == 200){
            this.$message({
              duration: "2000",
              showClose: true,
              message: '退出成功',
              type: "success"
            });
            localStorage.clear()
            sessionStorage.clear()
            window.location.href = res.data
          }else{
            this.$message({
              message: res.message,
              type: "warning"
            });
          }
        })
      },
    },

  }
</script>

<style scoped>
  .left_nav li div {
    cursor: pointer;
  }

  .fenNav {
    margin-left: 36px;
    color: #323332;
    opacity: 0.6;
  }

  .fenNav i {
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
  }

  .fu_nav i {
    background-color: #3ec09c;
  }

  .left_nav li {
    font-size: 14px;
    line-height: 48px;
    letter-spacing: 0px;
    font-family: MicrosoftYaHei;
    padding-left: 38px;
  }

  .left_nav {
    margin-top: 50px;

  }

  .mainNav img {
    width: 40px;
    height: 40px;
  }

  .fu_nav {
    color: #00bd57;
    opacity: 1;
  }

  .active_nav {

    /*background: url('../../../static/img/p_index/biaoti.png') no-repeat top left;
    background-size: 260px 50px;*/
  }

  .active_nav .mainNav {
    color: rgb(10, 180, 110);

  }

  .mainNav {
    height: 50px;
    color: #323332;
    display: flex;
    align-items: center;
  }

  .top {
    height: 60px;
    background: url("../../../static/img/cg/bg.png") no-repeat;
    background-size: 100% 100%;
    position: absolute;
    width: 100%;
    overflow: hidden;
  }

  .content {
    position: absolute;
    top: 60px;
    left: 0;
    bottom: 0;
    right: 0;
  }


  .top_left {
    float: left;
    margin-left: 37px;
    margin-top: 10px;
    display: flex;
    align-items: center;
  }

  .top_left img {
    width: 36px;
    height: 40px;
    margin-right: 10px;
  }


  .top_left span {
    font-size: 15px;
    color: #ffffff;
  }



  .tr_left {
    float: left;
    margin-right: 30px;
    display: flex;
  }

  .tr_left img {
    width: 57px;
    position: relative;
    top: -3px;
  }

  .tr_left span {
    font-size: 18px;
    color: white;
  }

  .top_right {
    display: flex;
    align-items: center;
    height: 100%;
    float: right;
    padding-right: 24px;
  }

  .top_right .userInfo,
  .top_right .logout {
    display: flex;
    align-items: center;
    margin-left: 30px;
  }

  .top_right .userInfo i {
    display: block;
    width: 30px;
    height: 30px;
    background: url(../../../static/img/cg/tx.png) no-repeat;
    background-size: 100% 100%;
  }

  .top_right .userInfo span {
    font-size: 14px;
    color: #edf0f5;
    margin-left: 10px;
  }

  .top_right .logout {
    cursor: pointer;
  }

  .top_right .logout i {
    display: block;
    width: 30px;
    height: 30px;
    background: url(../../../static/img/cg/quit.png) no-repeat;
    background-size: 100% 100%;
  }

  .top_right .logout span {
    font-size: 14px;
    color: #edf0f5;
    margin-left: 10px;
  }

  .left {
    width: 210px;
    height: 100%;
    position: absolute;
    top: 0;
    background: url('../../../static/img/cg/y.png') no-repeat left bottom;
    overflow-y: auto;
  }

  .right {
    top: 0;
    right: 0;
    bottom: 0;
    position: absolute;
    left: 210px;
    overflow-y: auto;
    background-color: rgb(230, 240, 245);
  }
</style>
