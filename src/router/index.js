import Vue from 'vue'
import Router from 'vue-router'

// 家长端
import p_index from '@/components/parents/p_index'
import p_shouye from '@/components/parents/p_shouye'
import baojing from '@/components/parents/baojing'
import guiji from '@/components/parents/guiji'
import weilan from '@/components/parents/weilan'
import weizhi from '@/components/parents/weizhi'
import Cwang from '@/components/parents/Cwang'

// 学校端
import s_index from '@/components/school/s_index'
import zhongduan from '@/components/school/zhongduan'
import s_shouye from '@/components/school/s_shouye'

import base from '@/components/school/card/base'
import send from '@/components/school/form/send'
import loss from '@/components/school/form/loss'
import close from '@/components/school/form/close'
// 消费管理
import region from '@/components/school/cost/region'
import cost from '@/components/school/cost/cost'
import item from '@/components/school/cost/item'
import overdue from '@/components/school/cost/overdue'
import Payment from '@/components/school/cost/Payment'
import PaymentExamine from '@/components/school/cost/PaymentExamine'
import recharge from '@/components/school/card/recharge'
import subsidy from '@/components/school/cost/subsidy'
import userCard from '@/components/school/cost/userCard'
// 黑名单管理
import Blacklist from '@/components/school/cardRecord/Blacklist'
import Blacklist1 from '@/components/school/cardRecord/Blacklist1'
import Blacklist2 from '@/components/school/cardRecord/Blacklist2'
// 设备管理
import DeviceInfo from '@/components/school/device/DeviceInfo'
import DeviceStatus from '@/components/school/device/DeviceStatus'
import MerchantInfo from '@/components/school/device/MerchantInfo'
import PrefixInfo from '@/components/school/device/PrefixInfo'
import AreaInfo from '@/components/school/device/AreaInfo'
import RechargeManage from '@/components/school/device/RechargeManage'

// 教师端
import t_index from '@/components/teacher/t_index'
import t_shouye from '@/components/teacher/t_shouye'
import anquan from '@/components/teacher/anquan'

import logou from '@/components/com/login'

//报表查询
import form1 from '@/components/school/form/form1'
import form2 from '@/components/school/form/form2'
import form3 from '@/components/school/form/form3'
import form4 from '@/components/school/form/form4'
import form5 from '@/components/school/form/form5'
import form6 from '@/components/school/form/form6'
import form7 from '@/components/school/form/form7'
import form8 from '@/components/school/form/form8'
import form9 from '@/components/school/form/form9'
import form10 from '@/components/school/form/form10'

//card管理
import card1 from '@/components/school/card/card1'
import card2 from '@/components/school/card/card2'
import card3 from '@/components/school/card/card3'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/logou',
      name: '下线',
      component: logou
    },
    {
      path: '/',
      name: '家长主页',
      component: p_index,
      redirect: '/p_shouye',
      meta : {
        level : '家长'
      },
      children:[
        {
          path: '/p_shouye',
          name: '首页',
          component: p_shouye,
          meta : {
            level : '家长'
          }
        },
        {
          path: '/baojing',
          name: '报警',
          component: baojing,
          meta : {
            level : '家长'
          }
        },
        {
          path: '/guiji',
          name: '轨迹',
          component: guiji,
          meta : {
            level : '家长'
          }
        },
        {
          path: '/weilan',
          name: '围栏',
          component: weilan,
          meta : {
            level : '家长'
          }
        },
        {
          path: '/weizhi',
          name: '位置',
          component: weizhi,
          meta : {
            level : '家长'
          }
        },
        {
          path: '/Cwang',
          name: 'C网',
          component: Cwang,
          meta : {
            level : '家长'
          }
        }
        ]
    },
    {
      path: '/school',
      name: '学校',
      component: s_index,
      redirect: '/s_shouye',
      meta : {
        level : '学校'
      },
      children :[
        {
          path: '/s_shouye',
          name: '学校主页',
          component: s_shouye,
          meta : {
            level : '学校'
          },
        },{
          path: '/logou',
          name: '退出',
          component: logou,
          meta : {
            level : '学校'
          },
        },
        {
          path: '/zhongduan',
          name: '学校终端',
          component: zhongduan,
          meta : {
            level : '学校'
          },
        },
        {
          path: '/base',
          name: 'm1卡基本管理',
          component: base,
          meta : {
            level : '学校'
          },
        },
        {
          path: '/send',
          name: 'm1卡发卡报表',
          component: send,
          meta : {
            level : '学校'
          },
        },
        {
          path: '/loss',
          name: 'm1卡挂失报表',
          component: loss,
          meta : {
            level : '学校'
          },
        },
        {
          path: '/close',
          name: 'm1卡销户报表',
          component: close,
          meta : {
            level : '学校'
          },
        },
        {
          path: '/overdue',
          name: '过期补贴查询',
          component: overdue,
          meta : {
            level : '学校'
          },
        },
        {
          path: '/Payment',
          name: '收付明细调整',
          component: Payment,
          meta : {
            level : '学校'
          },
        },
        {
          path: '/PaymentExamine',
          name: '收付明细调整审核',
          component: PaymentExamine,
          meta : {
            level : '学校'
          },
        },
        {
          path: '/cost',
          name: '缴纳应收费用',
          component: cost,
          meta : {
            level : '学校'
          },
        },
        {
          path: '/region',
          name: '执收区间',
          component: region,
          meta : {
            level : '学校'
          },
        },
        {
          path: '/item',
          name: '项目创建',
          component: item,
          meta : {
            level : '学校'
          },
        },
        {
          path: '/recharge',
          name: '充值提现',
          component: recharge,
          meta : {
            level : '学校'
          },
        },
        {
          path: '/subsidy',
          name: '补贴缴费',
          component: subsidy,
          meta : {
            level : '学校'
          },
        },
        {
          path: '/userCard',
          name: '用户卡补贴',
          component: userCard,
          meta : {
            level : '学校'
          },
        },
        {
          path: '/PrefixInfo',
          name: '前置信息管理',
          component: PrefixInfo,
          meta : {
            level : '学校'
          },
        },
        {
          path: '/MerchantInfo',
          name: '商户信息',
          component: MerchantInfo,
          meta : {
            level : '学校'
          },
        },
        {
          path: '/DeviceStatus',
          name: '设备状态监控',
          component: DeviceStatus,
          meta : {
            level : '学校'
          },
        },
        {
          path: '/DeviceInfo',
          name: '设备信息管理',
          component: DeviceInfo,
          meta : {
            level : '学校'
          },
        },
        {
          path: '/AreaInfo',
          name: '区域信息管理',
          component: AreaInfo,
          meta : {
            level : '学校'
          },
        },
        {
          path: '/RechargeManage',
          name: '自助充值机管理',
          component: RechargeManage,
          meta : {
            level : '学校'
          },
        },
        {
          path: '/Blacklist',
          name: '黑名单设置',
          component: Blacklist,
          meta : {
            level : '学校'
          },
        },
        {
          path: '/Blacklist1',
          name: '黑名单设置1',
          component: Blacklist1,
          meta : {
            level : '学校'
          },
        },
        {
          path: '/Blacklist2',
          name: '黑名单设置2',
          component: Blacklist2,
          meta : {
            level : '学校'
          },
        },
        {
          path: '/form1',
          name: '充值报表',
          component: form1,
          meta : {
            level : '学校'
          },
        },
        {
          path: '/form2',
          name: '提现报表',
          component: form2,
          meta : {
            level : '学校'
          },
        },
        {
          path: '/form3',
          name: '补登报表',
          component: form3,
          meta : {
            level : '学校'
          },
        },
        {
          path: '/form4',
          name: '交易冲销报表',
          component: form4,
          meta : {
            level : '学校'
          },
        },
        {
          path: '/form5',
          name: '个人对账报表',
          component: form5,
          meta : {
            level : '学校'
          },
        },
        {
          path: '/form6',
          name: '商户对账报表',
          component: form6,
          meta : {
            level : '学校'
          },
        },
        {
          path: '/form7',
          name: '异常消费报表',
          component: form7,
          meta : {
            level : '学校'
          },
        },
        {
          path: '/form8',
          name: '设备流水报表',
          component: form8,
          meta : {
            level : '学校'
          },
        },
        {
          path: '/form9',
          name: '充值机取钞记录',
          component: form9,
          meta : {
            level : '学校'
          },
        },
        {
          path: '/form10',
          name: '充值机明细报表',
          component: form10,
          meta : {
            level : '学校'
          },
        },
        {
          path: '/card1',
          name: '卡片交易冲销',
          component: card1,
          meta : {
            level : '学校'
          },
        },
        {
          path: '/card2',
          name: '换卡补登处理',
          component: card2,
          meta : {
            level : '学校'
          },
        },
        {
          path: '/card3',
          name: '待结转卡片查询',
          component: card3,
          meta : {
            level : '学校'
          },
        }
      ]
    },
    {
      path: '/teacher',
      name: '教师',
      component: t_index,
      redirect: '/t_shouye',
      meta : {
        level : '教师'
      },
      children: [
        {
          path: '/t_shouye',
          name: '教师主页',
          component: t_shouye,
          meta : {
            level : '教师'
          },
        },
        {
          path: '/anquan',
          name: '教师安全',
          component: anquan,
          meta : {
            level : '教师'
          },
        },
      ]
    }
  ]
})
