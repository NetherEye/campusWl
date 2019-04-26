export default {
	getM1ListInTeacher: '/proxy/api/m1/teacher', // 获取教职工m1卡列表
	readCard: '/proxy/api/m1/readCard', // 读卡

	getSendTeacher: '/proxy/api/m1/teacher/sendCard/', // 获取教职工发卡信息
	getSendStudent: '/proxy/api/m1/student/sendCard/', // 获取学生发卡信息
	getM1ListInStudent: '/proxy/api/m1/student', // 学生列表
	sendCard: '/proxy/api/m1/sendCard', // 最后的发卡操作
	lossCard: '/proxy/api/m1/reportLoss', // 卡挂失
	relieveLossCard: '/proxy/api/m1/relieveLoss', // 卡解挂
	cardLogout: '/proxy/api/m1/logout', // 有卡注销 or 无卡注销
	getM1Report: '/proxy/api/m1/report', // 获取发卡报表
	handleM1Grop: '/proxy/api/m1/group', // 修改卡分组
	cardDelay: '/proxy/api/m1/delayed', // 卡延时
	export: '/proxy/api/m1/export/report', // 导出报表
	ws: 'ws://127.0.0.1:7181',
	delayCard: '/proxy/api/m1/delayed', // 卡延时

	pay: '/proxy/api/m1/pay', // 充值,提现
	recharge: '/proxy/api/transaction/recharge', // 充值记录
	withdraw: '/proxy/api/transaction/withdraw', // 提现记录
	subsidies: '/proxy/api/subsidies', // 补贴人员录入
	project: '/proxy/api/project', // 添加项目
	record: '/proxy/api/record', // 消费记录
	exportRecharge: '/proxy/api/transaction/export/recharge', // 充值
	exportWithdraw: '/proxy/api/transaction/export/withdraw', // 充值
	section: '/proxy/api/section', // 区间
	receive: '/proxy/api/subsidies/receive',
	personlist:'/proxy/api/subsidies/personlist',
	adjustment:'/proxy/api/subsidies/adjustment',
	projectSection:'/proxy/api/subsidies/all/project/section',
	allSection:'/proxy/api/subsidies/project/section',
	exportRecord:'/proxy/api/record/export',
	getSub: '/proxy/api/subsidies/send/receive', // 领取补贴
	overdue:'/proxy/api/subsidies/overdue',
	balance:'/proxy/api/m1/balance',
	accounts:'/proxy/api/subsidies/accounts',
	multiple:'/proxy/api/subsidies/multiple',
	revocation:'/proxy/api/subsidies/revocation/receive',
	exportAccounts:'/proxy/api/subsidies/export/accounts',
	already:'/proxy/api/subsidies/already',
	exportAlready:'/proxy/api/subsidies/export/already',
	none:'/proxy/api/subsidies/none',
	exportNone:'/proxy/api/subsidies/export/none',
	costcash:'/proxy/api/m1/costcash',
	download:'/proxy/api/subsidies/download'
}