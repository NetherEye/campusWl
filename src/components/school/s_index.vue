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
        <div class="logout" @click="quit">
          <i></i>
          <span>退出</span>
        </div>
      </div>
    </div>
    <div class="content">
      <div class="left">
        <div class="left_nav">
          <li v-for="(i,index) in this.navData" :class="navIndex==index?'active_nav':''" :key="index">
            <div class="mainNav" @click="isClick(index,i.status,i.path)">
              <img :src="i.icon" />
              <span>{{i.title}}</span>
            </div>
            <div class="fenNav ellipsis" v-for="x in i.fuTitl" :class="fuNav == x.path?'fu_nav':''" v-if="i.status" @click="isClick2(index,x.path)">
              <i></i>
              <el-tooltip effect="dark" :content="x.title" :disabled="x.title.length > 7 ? false : true" placement="top">
              <span>{{x.title}}</span>
              </el-tooltip>
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
    data() {
      return {
        userType: '',
        fuNav: '',
        navIndex: 0,
        navData: [{
            title: '首页',
            status: true,
            path: 's_shouye',
            icon: '../../../static/img/cg/sy.png'
          },
          {
            title: '学生管理',
            status: false,
            icon: '../../../static/img/cg/z.png',
            path: 'zhongduan',
          },
          {
            title: '设备管理',
            status: false,
            icon: '../../../static/img/cg/sb.png',
            fuTitl: [{
                title: '区域管理',
                path: 'AreaInfo',
              },
              {
                title: '商户管理',
                path: 'MerchantInfo',
              },
              {
                title: '前置信息管理',
                path: 'PrefixInfo',
              },
              {
                title: '消费机管理',
                path: 'DeviceInfo',
              },
              {
                title: '自助充值机管理',
                path: 'RechargeManage',
              },
              {
                title: '设备状态监控',
                path: 'DeviceStatus',
              }
            ]
          },
          {
            title: '卡片管理',
            status: false,
            icon: '../../../static/img/cg/m1.png',
            fuTitl: [{
                title: '基本管理',
                path: 'base',
              },{
                title: '充值提现',
                path: 'recharge',
              },{
                title: '卡片交易冲销',
                path: 'card1',
              },{
                title: '换卡补登处理',
                path: 'card2',
              },{
                title: '待结转卡片查询',
                path: 'card3',
              },
            ]
          },
          {
            title: '收付管理',
            status: false,
            icon: '../../../static/img/cg/xf.png',
            fuTitl: [
              {
                title: '项目管理',
                path: 'item',
              },
              {
                title: '执收区间管理',
                path: 'region',
              },
              {
                title: '收付明细管理',
                path: 'subsidy',
              },
              {
                title: '用户卡收付',
                path: 'userCard',
              },
              {
                title: '补贴明细调整',
                path: 'Payment',
              },
              {
                title: '补贴明细调整审核',
                path: 'PaymentExamine',
              },
              {
                title: '过期补贴查询',
                path: 'overdue',
              },{
                title: '补贴账目记录',
                path: 'Blacklist',
              },{
                title: '补贴已领取记录',
                path: 'Blacklist1',
              },{
                title: '补贴未领取记录',
                path: 'Blacklist2',
              }
            ]
          },
          {
            title: '报表查询',
            status: false,
            icon: '../../../static/img/cg/jl.png',
            fuTitl: [
              {
                title: '发卡报表',
                path: 'send',
              },
              {
                title: '挂失报表',
                path: 'loss',
              },
              {
                title: '注销报表',
                path: 'close',
              },{
                title: '充值报表',
                path: 'form1',
              },
              {
                title: '提现报表',
                path: 'form2',
              },
              {
                title: '补登报表',
                path: 'form3',
              },{
                title: '交易冲销报表',
                path: 'form4',
              },
              {
                title: '个人对账报表',
                path: 'form5',
              },
              {
                title: '商户对账报表',
                path: 'form6',
              },{
                title: '异常消费报表',
                path: 'form7',
              },
              {
                title: '设备流水报表',
                path: 'form8',
              },{
                title: '充值机取钞记录',
                path: 'form9',
              },
              {
                title: '充值机明细报表',
                path: 'form10',
              }
            ]
          },
        ],
      }
    },
    created() {
      this.userType = JSON.parse(sessionStorage.getItem('userInfo')).nickname || ''
      let path = JSON.parse(sessionStorage.getItem('activeNav'))
      if (path) {
        this.navIndex = path.index
        this.navData[path.index].status = true
        this.fuNav = path.path

      }
    },
    methods: {
      isClick(index, status, path) {
        this.fuNav = ''
        this.navIndex = index
        this.navData[index].status = !this.navData[index].status
        sessionStorage.setItem('activeNav', JSON.stringify({
          path: path,
          index: index
        }))
        this.$router.push({
          path: path
        })
      },
      isClick2(index, path) {
        this.fuNav = path
        this.navIndex = index
        sessionStorage.setItem('activeNav', JSON.stringify({
          path: path,
          index: index
        }))
        this.$router.push({
          path: path
        })
      },
      quit() {
        fetch.get(allApi.logout, '', res => {
          if (res.code == 200) {
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
