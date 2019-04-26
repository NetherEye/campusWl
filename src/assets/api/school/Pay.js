let url = '/proxy'

/* 消费管理模块所有接口 */

let Pay = {
	'toUp': url + '/api/m1/pay', // 充值
	'toDow': url + '/api/m1/withdraw', // tixian  
	'toRecall': url + '/api/m1/cardRecall', // 撤回
}

export default Pay
