let url = '/proxy'

/* 设备管理模块所有接口 */

let Card = {
	'basic': url + '/api/m1/basic', // 获取人员与M1卡信息
	'read': url + '/api/m1/read', // 读卡
	'sendCard': url + '/api/m1/sendCard', // 发卡
	'cost': url + '/api/m1/cost', // 工本押金
	'fill': url + '/api/m1/fill', // 换卡补登处理  
	'fillwait': url + '/api/m1/fillwait', // 待结转卡片  
    
	'cardReport': url + '/api/m1/cardReport', // 发卡报表
	'report': url + '/api/m1/report', // 挂失报表，销户报表
	'exportM1': url + '/api/m1/export/cardReport', // 导出 
	'logout': url + '/api/m1/logout', // 注销 
	
	'recharge': url + '/api/transaction/recharge', // 充值记录
	'exportRecharge': url + '/api/transaction/export/recharge', // 充值记录导出
	'withdraw': url + '/api/transaction/withdraw', // 提现记录
	'exportWithdraw': url + '/api/transaction/export/withdraw', // 提现记录导出 

	'record': url + '/api/record', 
	'recordExcel': url + '/api/record/excel',
	'merchant': url + '/api/record/merchant', 
	'merchantExcel': url + '/api/record/merchant/excel', 
	'error': url + '/api/record/error',
	'errorExcel': url + '/api/record/error/excel', 
	'device': url + '/api/record/device', 
	'deviceExcel': url + '/api/record/device/excel', 
	
	'fillreport': url + '/api/m1/fillreport', //补登报表
	'fillreportExcel': url + '/api/m1/export/fillreport',
	'writeoff': url + '/api/m1/writeoff', 
	'writeoffreport': url + '/api/m1/writeoffreport', 
	
	'secret': url + '/api/m1/secret', 
}

export default Card
