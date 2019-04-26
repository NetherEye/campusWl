let url = '/proxy'

let teacher = {
	'command': url + '/api/c/command',
    'notice': url + '/api/notice',
    'noticeList' : url + '/api/notice/publish',
    'class': url + '/api/class',
    'grade': url + '/api/grade',
    'studentList' : url + '/api/student',
    'person' : url +'/api/class/teacher/student',
    'student' : url + '/api/student',
    'cNet' : url + '/api/c/card/default',
    'jh' : url + '/api/c/card',
    'batch' : url + '/api/c/card/batch',

    'cnet' : url + '/api/cnet', //查看C网设置详情
    'ccnet' : url + '/api/c/card', //设置孩子c网设置
    'dormancy' : url + '/api/c/interval/dormancy', //设置孩子c网设置
    'cardAll' : url + '/api/c/cardAll', //学校全部设置 

	'dept': url + '/api/dept',
	'template' : url + '/api/c/card/template', //获取亲情号导入模板
	'import' : url + '/api/import/c/card', //亲情号批量导入

}

export default teacher
