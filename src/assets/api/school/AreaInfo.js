let url = '/proxy'

/* 设备管理模块所有接口 */

let AreaInfo = {
	'region': url + '/api/region', // 获取所有区域
	'merchant': url + '/api/merchant', // 商户
	'pre': url + '/api/pre', // 前置
	'consumer': url + '/api/consumer', // 设备信息
	'getMerchantByRegion': url + '/api/merchant/region', // 根据区域id获取商户  
	'set': url + '/api/consumer/setting', // 配置参数  
	
	'child': url + '/api/region/child', // 所有区域二级级联  
}

export default AreaInfo
