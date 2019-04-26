let url = '/proxy'

let parents = {
  'notice': url + '/api/notice',
  'fence': url + '/api/fence',//添加围栏
  'fenceShow': url + '/api/fence/show',//显示围栏
  'location': url + '/api/location',//查看所有孩子的位置
  'track': url + '/api/track',//查看孩子的位置轨迹
  'alarm': url + '/api/alarm',//获取报警信息列表
  'student': url + '/api/parent/student',//家长获取孩子信息
  'cnet': url + '/api/cnet',//查看C网设置列表
  'listen': url + '/api/listen',//启动监听
  'call': url + '/api/call',//反向呼叫
  'card': url + '/api/c/card',//设置孩子c网设置
}

export default parents
