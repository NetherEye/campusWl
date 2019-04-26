<template>
	<div class="wrap">
		<div class="header">
			<div class="header_content">
				<div class="hc_input">
					<span style="font-size: 14px;font-family: MicrosoftYaHei;color: #333333;width: 40px;line-height: 40px">姓名</span>
					<el-input v-model="input1" placeholder="请输入姓名"></el-input>
				</div>
				<div class="hc_input">
					<span style="font-size: 14px;font-family: MicrosoftYaHei;color: #333333;width: 40px;line-height: 40px">学号</span>
					<el-input v-model="input2" placeholder="请输入学号"></el-input>
				</div>
				<div class="hc_input">
					<span style="font-size: 14px;font-family: MicrosoftYaHei;color: #333333;width: 80px;line-height: 40px">手机号码</span>
					<el-input v-model="input3" placeholder="请输入手机号码"></el-input>
				</div>
				<div class="hc_input">
					<span style="font-size: 14px;font-family: MicrosoftYaHei;color: #333333;width: 40px;line-height: 40px">年级</span>
					<el-select v-model="value1" clearable placeholder="请选择" @change="changeSelect(value1)">
						<el-option v-for="item in options1" :key="item.gradeId" :label="item.studyPhase + item.gradeName" :value="item.gradeId">
						</el-option>
					</el-select>
				</div>
				<div class="hc_input">
					<span style="font-size: 14px;font-family: MicrosoftYaHei;color: #333333;width: 40px;line-height: 40px">班级</span>
					<el-select v-model="value2" clearable placeholder="请选择">
						<el-option v-for="item in options2" :key="item.classId" :label="item.className" :value="item.classId">
						</el-option>
					</el-select>
				</div>
				<div class="hc_input">
					<span style="font-size: 14px;font-family: MicrosoftYaHei;color: #333333;width: 70px;line-height: 40px">网络状态</span>
					<el-select v-model="value22" clearable placeholder="请选择">
						<el-option label="激活中" value="0">
						</el-option>
						<el-option label="已激活" value="1">
						</el-option>
						<el-option label="激活失败" value="2">
						</el-option>
						<el-option label="暂未激活" value="3">
						</el-option>
					</el-select>
				</div>
				<div class="hc_input">
					<el-button type="success" @click="findCx">查询</el-button>
					<el-button type="success" @click="allactive">批量激活</el-button>
					<el-button type="success" @click="Options">设置</el-button>
					<el-button type="success" @click="onimport">批量导入</el-button>
				</div>

			</div>
		</div>
		<div class="tableData">
			<el-table ref="singleTable" :data="tableData" highlight-current-row style="width: 100%">
				<el-table-column type="index" :index="indexMethod" label="序号" width="100px" align="center">
				</el-table-column>
				<el-table-column property="studentName" label="姓名" align="center">
				</el-table-column>
				<el-table-column property="studentId" label="学号" align="center">
				</el-table-column>
				<el-table-column label="班级" align="center">
					<template slot-scope="scope">
						<div>{{scope.row.studyPhase + scope.row.gradeName + scope.row.className}}</div>
					</template>
				</el-table-column>
				<el-table-column property="contactNumber" align="center" label="手机号">
				</el-table-column>
				<el-table-column property="activeTime" align="center" label="激活时间">
				</el-table-column>
				<el-table-column property="contactNumber" align="center" label="网络状态">
					<template slot-scope="scope">
						{{['激活中','已激活','激活失败','未激活'][scope.row.activeStatus]}}
					</template>
				</el-table-column>
				<el-table-column property="deviceType" align="center" label="设备类型">
					<template slot-scope="scope">
						{{['无','未知','C网设备','G网设备'][scope.row.deviceType]}}
					</template>
				</el-table-column>
				<el-table-column property="operatorType" align="center" label="运营商">
					<template slot-scope="scope">
						{{['无','未知','电信','移动','联通'][scope.row.operatorType]}}
					</template>
				</el-table-column>
				<el-table-column label="操作" align="center" width="400px">
					<template slot-scope="scope">
						<span style="color:rgb(62,192,156); padding-left:5px;padding-right: 5px ;cursor:pointer;" @click="findUser(scope.$index,scope.row)" v-if="scope.row.activeStatus == 0">
							激活中
						</span>
						<div v-if="scope.row.activeStatus == 1">
							<span style="color:rgb(62,192,156); padding-left:5px;padding-right: 5px ;cursor:pointer;" id="" @click="clickUser(scope.$index,1,scope.row)">
								查看位置
							</span>
							<span style="color:rgb(62,192,156); padding-left:5px;padding-right: 5px ;cursor:pointer;" id="" @click="clickUser(scope.$index,2,scope.row)">
								查看轨迹
							</span>
							<span style="color:rgb(62,192,156); padding-left:5px;padding-right: 5px ;cursor:pointer;" id="" @click='Install(scope.$index,scope.row)'>
								设置
							</span>
							<span style="color:rgb(62,192,156); padding-left:5px;padding-right: 5px ;cursor:pointer;" id="" @click='Particulars(scope.row.smartId)'>
								详情
							</span>
							<span style="color:rgb(62,192,156); padding-left:5px;padding-right: 5px ;cursor:pointer;" id="" @click='Consequences(scope.$index,scope.row)'>
								亲情号
							</span>
						</div>
						<span style="color:rgb(62,192,156); padding-left:5px;padding-right: 5px ;cursor:pointer;" id="" @click="findUser(scope.$index,scope.row)" v-if="scope.row.activeStatus== 3 || scope.row.activeStatus== 2">
							激活
						</span>
						<span style="color:rgb(62,192,156); padding-left:5px;padding-right: 5px ;cursor:pointer;" id="" @click='Acquire(scope.$index,scope.row)' v-if="scope.row.activeStatus== 0 || scope.row.activeStatus== 1 || scope.row.activeStatus== 2">
							历史指令
						</span>
						<span style="color:rgb(62,192,156); padding-left:5px;padding-right: 5px ;cursor:pointer;" id="" @click='Acquires(scope.$index,scope.row)' v-if="scope.row.activeStatus!= 3">
							手动发送指令
						</span>
					</template>
				</el-table-column>
			</el-table>
			<div class="fenye">
				<div class="fenye_title">共 {{total}} 条数据 每页 {{pageSize}} 条数据 共 {{Math.floor(total/pageSize) + (total%pageSize != 0 ? 1 : 0)}} 页</div>
				<el-pagination :current-page.sync="pageNumber" :page-size="pageSize" @current-change="handleCurrentChange" layout="prev, pager, next, jumper" :total="total">
				</el-pagination>
			</div>
		</div>
		<div class="el-title">
			<el-dialog :title="title" :visible.sync="dialogVisible" @closed="isClosed" width="80%" center>
				<div class="tip">
					<baidu-map class="map" :center="center" :zoom="zoom" :scroll-wheel-zoom="true" @click="get">
						<bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>
						<bm-marker v-for="(item,index) in items" :key="index" :position="{lng:center.lng,lat:center.lat}" :icon="{url: require('../../../static/img/p_index/hz.png'), size: {width: 84, height: 84}}" :dragging="false" @click="getPoint(item)"></bm-marker>
						<bm-info-window :position="postionMap" :show="show" @close="infoWindowClose" @open="infoWindowOpen" style="font-size: 14px">
							<p style="text-align: center;margin-bottom: 5px;">孩子信息</p>
							<p style="padding: 5px;border-bottom: 1px solid #d7d7d7;">姓名: {{studentName1}}</p>
							<p style="padding: 5px;border-bottom: 1px solid #d7d7d7;">定位时间: {{time}}</p>
							<p style="padding: 5px">位置: {{site}}</p>
						</bm-info-window>
					</baidu-map>
				</div>
			</el-dialog>
		</div>
		<div class="el-title">
			<el-dialog :title="title1" @closed="isClosed" :visible.sync="dialogVisible1" width="80%" center>
				<div class="tip">
					<div class="title_list btn1">
						<span>时间</span>
						<el-date-picker v-model="value11" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="请选择起始时间"
       					:picker-options="pickerOptions0">
						</el-date-picker>
						<div style="display: inline-block;width:23px;height:2px;background-color: #bababa;margin:0 -15px 5px 5px;"></div>
						<span>时间</span>
						<el-date-picker v-model="value12" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="请选择结束时间"
       					:picker-options="pickerOptions1">
						</el-date-picker>
						<el-button class="cha" @click="looks">查询</el-button>
						<el-button class="cha" @click="toggle1">播放</el-button>
					</div>
					<baidu-map class="map" :center="center" :zoom="17" :scroll-wheel-zoom="true">
						<bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>
						<bm-polyline :path="path" stroke-color="blue" :stroke-opacity="0.5" :stroke-weight="2" :editing="false"></bm-polyline>
						<bml-lushu @start="changeBtnText('pause')" @stop="changeBtnText('play_arrow')" @pause="changeBtnText('play_arrow')" :path="path" :rotation="rotation" :content="content" :infoWindow="true" :speed="speed" :icon="icon" :play="play">
						</bml-lushu>
					</baidu-map>
				</div>
			</el-dialog>
		</div>
		<!--弹窗3-->
		<div class="el-title">
			<el-dialog :title="stuName" :visible.sync="dialogVisible3" width="800px" margin-top='30vh' center>
				<div class="tip1">
					<el-row>
						<el-col :span="12">
							<div class="infList">
								<span>学生名字</span>
								<el-input placeholder="请输入内容" v-model="input11" :disabled="true">
								</el-input>
							</div>
						</el-col>
						<el-col :span="12">
							<div class="infList">
								<span>手机号码</span>
								<el-input placeholder="请输入内容" v-model="input12" :disabled="true">
								</el-input>
							</div>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="12">
							<div class="infList">
								<span>学校</span>
								<el-input placeholder="请输入内容" v-model="input13" :disabled="true">
								</el-input>
							</div>
						</el-col>
						<el-col :span="12">
							<div class="infList">
								<span>班级</span>
								<el-input placeholder="请输入内容" v-model="input14" :disabled="true">
								</el-input>
							</div>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="12">
							<div class="infList">
								<span>家长名字</span>
								<el-input placeholder="请输入内容" v-model="input15" :disabled="true">
								</el-input>
							</div>
						</el-col>
						<el-col :span="12">
							<div class="infList">
								<span>是否激活</span>
								<el-input placeholder="请输入内容" v-model="input16" :disabled="true">
								</el-input>
							</div>
						</el-col>
					</el-row>
				</div>
				<div class="btn" style="text-align: center;">
					<el-button type="success" @click="active" disabled v-if="isActived==0">激活中</el-button>
					<el-button type="success" @click="active" v-else>激活</el-button>

				</div>
				<div style="height: 30px"></div>
			</el-dialog>
		</div>
		<!--弹窗4-->
		<div class="el-title">
			<el-dialog title="批量激活" :visible.sync="dialogVisible4" @closed="closeDialog" width="800px" margin-top='30vh' center>
				<div class="content1">
					<div class="tip_left">
						<div class="tip_class">选择班级</div>
						<div class="tip_bottom">
							<el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
						</div>
					</div>
					<div class="tip_right">
						<div class="tip_sel">
							<el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
							<span style="margin-left: 20pxg">未激活学生列表</span>
							<div style="margin: 15px 0;"></div>
							<el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
								<el-checkbox v-for="city in cities" :label="city.unionId" :key="city.studentId">{{city.studentName}}</el-checkbox>
							</el-checkbox-group>
						</div>
						<div style="width: 100%;text-align: center;position: absolute;bottom: 20px;">
							<el-button style="background-color: #3ec09c;color: white;" :loading="bath" @click="batch">激活</el-button>
							<el-button style="background-color: #3ec09c;color: white;" @click="quxiao">取消</el-button>
						</div>
					</div>
				</div>
			</el-dialog>
		</div>
		<div class="el-title">
			<el-dialog title="历史命令" :visible.sync="dialogFormVisible" width="1200px" margin-top='30vh' center>
				<div class="wu_main">
					<el-form :inline="true" :model="formInline" class="demo-form-inline" size="small">
						<el-form-item label="查询对象:">
							<p>{{StudentName}}</p>
						</el-form-item>
						<el-form-item label="手机号码:">
							<p>{{ContactNumber}}</p>
						</el-form-item>
						<el-form-item label="指令类型">
							<el-select v-model="formInline.commandType" placeholder="请选择" clearable>
								<el-option v-for="item in CommandType" :key="item.value" :label="item.label" :value="item.value">
								</el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="指令状态">
							<el-select v-model="formInline.commandStatus" placeholder="请选择" clearable>
								<el-option v-for="item in commandStatus" :key="item.value" :label="item.label" :value="item.value">
								</el-option>
							</el-select>
						</el-form-item>
						<el-form-item>
							<el-button type="success" @click="history" size="small ">查询</el-button>
						</el-form-item>
					</el-form>
				</div>
				<div id="">
					<el-table :data="tableData01" stripe style="width: 100%">
						<el-table-column label="序号" align="center" type="index">
						</el-table-column>
						<el-table-column prop="type" align="center" label="设备类型">
						</el-table-column>
						<el-table-column prop="contentType" align="center" label="指令类型">
						</el-table-column>
						<el-table-column prop="result" align="center" label="指令状态">
						</el-table-column>
						<el-table-column prop="content" align="center" label="指令内容">
						</el-table-column>
						<el-table-column prop="createUserId" align="center" label="创建人">
						</el-table-column>
						<el-table-column prop="createTime" align="center" label="创建时间">
						</el-table-column>
					</el-table>
				</div>
				<div class="fenye">
					<div class="fenye_title">共 {{total01}} 条数据 每页 {{pageSize01}} 条数据 共 {{Math.floor(total01/pageSize01) + (total01%pageSize01 != 0 ? 1 : 0)}} 页</div>
					<el-pagination :current-page.sync="pageNumber01" @current-change="handleCurrentChange01" :page-size="pageSize01" layout="prev, pager, next, jumper" :total="total01">
					</el-pagination>
				</div>
				<div class="btn" style="text-align: center;">
					<el-button type="success" @click="dialogFormVisible=false">关闭</el-button>

				</div>
				<div style="height: 30px"></div>
			</el-dialog>
		</div>
		<!-- 指令 -->
		<div class="el-title">
			<el-dialog title="手动发送指令" :visible.sync="dialogFormVisible1" width="1200px" margin-top='30vh' center>
				<div class="wu_main">
					<el-form :model="formInline" class="demo-form-inline" size="small" style="width: 500px;margin: 0 auto;">
						<el-form-item label="使用说明:">
							<p>使用手机发送短信，接收人与内容如下</p>
						</el-form-item>
						<el-form-item>
							<p>备注：无指令等待时，发送无效</p>
						</el-form-item>
						<el-form-item label="接收人号码:">
							<p>{{contactNumber}}</p>
						</el-form-item>
						<el-form-item label="发送内容:">
							<p style="font-size: 18px;">#CT{{contactNumber}}FFFFFE13120.27.237.27:28081</p>
						</el-form-item>
					</el-form>
				</div>
				<div class="btn" style="text-align: center;">
					<el-button type="success" @click="dialogFormVisible1=false">关闭</el-button>

				</div>
				<div style="height: 30px"></div>
			</el-dialog>
		</div>
		<!--详情-->
		<div class="el-title">
			<el-dialog :title="headline" :visible.sync="dialogFormxiangqing" width="800px" margin-top='30vh' center @closed="dialogOpen">
				<template v-if="addhidd==='set'">
					<div id="" style="padding: 20px 30px 20px; display: flex;justify-content: space-around;">
						<el-form :model="formInline" label-width="160px" size="small" center disabled>
							<el-form-item label="位置上报间隔时间" prop='reportingInterval'>
								<el-select v-model="formInline.reportingInterval" style="width: 100%;" placeholder="请选择" clearable>
									<el-option v-for="item in getTiem" :key="item.value" :label="item.label" :value="item.value">
									</el-option>
								</el-select>
							</el-form-item>
							<el-form-item label="开始时间" prop='commandTypeone'>
								<el-time-select style="width: 100%; margin-bottom: 0px;" v-model="formInline.commandTypeone" :picker-options="{
								    start: '07:30',
								    step: '00:10',
								    end: '17:00'
								  }" placeholder="选择时间">
								</el-time-select>
							</el-form-item>
							<el-form-item label="结束时间" prop='commandTypetwo'>
								<el-time-select style="width: 100%;margin-bottom: 0px;" v-model="formInline.commandTypetwo" :picker-options="{
								   start: '07:30',
								    step: '00:10',
								    end: '17:00'
								  }" placeholder="选择时间">
								</el-time-select>
							</el-form-item>
							<el-form-item label="永不休眠">
								<el-switch v-model="formset.delivery" @change="dianji(formset.delivery)"></el-switch>
							</el-form-item>
							<el-form-item label="亲情号1  父亲">

								<el-input v-model="formInline.familyNumberone" style="margin-bottom: 0px;width: 100%;"></el-input>
							</el-form-item>
							<el-form-item label="亲情号2  母亲">

								<el-input v-model="formInline.familyNumbertwo" style="margin-bottom: 0px;width: 100%;"></el-input>
							</el-form-item>
							<el-form-item label="亲情号3   其他">

								<el-input v-model="formInline.familyNumberthree" style="margin-bottom: 0px;width: 100%; "></el-input>
							</el-form-item>
							<el-form-item label="SOS号码">
								<el-input v-model="formInline.sos" style="margin-bottom: 0px; width: 100%;"></el-input>
							</el-form-item>
							<el-form-item label="可呼入号码">
								<el-input type="textarea" placeholder="多个号码请用逗号隔开" v-model="formInline.incomingCalls"></el-input>
							</el-form-item>
							<el-form-item label="设置允许接受短信号码" prop='incomingSms'>
								<el-input type="textarea" placeholder="多个号码请用逗号隔开" v-model="formInline.incomingSms"></el-input>
							</el-form-item>
						</el-form>
					</div>

				</template>
				<template v-if="addhidd==='add'||addhidd==='all'">
					<div id="" style="padding: 20px 30px 20px; display: flex;justify-content: space-around;">
						<el-form :model="formset" ref="ruleForm" label-width="140px" size="small" center>
							<el-form-item label="位置上报间隔时间" prop='reportingInterval'>
								<el-select v-model="formset.reportingInterval" style="width: 100%;" @change="allTiom" placeholder="请选择" clearable>
									<el-option v-for="item in getTiem" :key="item.value" style="width: 100%;" :label="item.label" :value="item.value">
									</el-option>
								</el-select>
							</el-form-item>
							<el-form-item label="开始时间" prop='commandTypeone'>
								<el-time-select style="width: 100%; margin-bottom: 0px;" :editable="false" @change="allsecond" v-model="formset.commandTypeone" :picker-options="{
								    start: '07:30',
								    step: '00:10',
								    end: '17:00'
								  }" placeholder="选择时间">
								</el-time-select>
							</el-form-item>
							<el-form-item label="结束时间" prop='commandTypetwo'>
								<el-time-select style="width: 100%;margin-bottom: 0px;" :editable="false" @change="allsecond" v-model="formset.commandTypetwo" :picker-options="{
								   start: '07:30',
								    step: '00:10',
								    end: '17:00'
								    
								  }" placeholder="选择时间">
								</el-time-select>
							</el-form-item>
							<el-form-item label="永不休眠">
								<el-switch v-model="formset.delivery" @change="dianji(formset.delivery)"></el-switch>
							</el-form-item>
						</el-form>
					</div>

				</template>
				<div class="btn" style="text-align: center;">
					<el-button type="success" v-if="addhidd==='set'" @click="dialogFormxiangqing=false">关闭</el-button>
					<el-button type="success" v-if="addhidd==='add'" @click="Conserve('ruleForm')">保存</el-button>
					<el-button type="success" v-if="addhidd==='all'" @click="Conserveall('ruleForm')">保存</el-button>

				</div>
				<div style="height: 30px"></div>
			</el-dialog>
		</div>
		<div class="el-title">
			<el-dialog :title="headline" :visible.sync="dialogFormxiangqing01" width="800px" margin-top='30vh' center @closed="dialogOpen01">

				<template v-if="addhidd==='family'">
					<div id="" style="padding: 20px 30px 20px; display: flex;justify-content: space-around;">
						<el-form :model="formfamily" ref="rulefamily" label-width="170px" size="small" center>
							<el-form-item label="亲情号1  父亲" prop='familyNumberone'>
								<el-input v-model="formfamily.familyNumberone" style="margin-bottom: 0px;"></el-input>
							</el-form-item>
							<el-form-item label="亲情号2   母亲" prop='familyNumbertwo'>
								<el-input v-model="formfamily.familyNumbertwo" style="margin-bottom: 0px;"></el-input>
							</el-form-item>
							<el-form-item label="亲情号3   其他" prop='familyNumberthree'>

								<el-input v-model="formfamily.familyNumberthree" style="margin-bottom: 0px;"></el-input>
							</el-form-item>
							<el-form-item label="SOS号码" prop='sos'>
								<el-input v-model="formfamily.sos" style="margin-bottom: 0px; width: 100%;"></el-input>
							</el-form-item>
							<el-form-item label="可呼入号码" prop='incomingCalls'>
								<el-input type="textarea" placeholder="多个号码请用逗号隔开" v-model="formfamily.incomingCalls"></el-input>
							</el-form-item>
							<el-form-item label="设置允许接受短信号码" prop='incomingSms'>
								<el-input type="textarea" placeholder="多个号码请用逗号隔开" v-model="formfamily.incomingSms"></el-input>
							</el-form-item>
						</el-form>
					</div>

				</template>

				<div class="btn" style="text-align: center;">
					<el-button type="success" v-if="addhidd==='family'" @click="Relatives('rulefamily')">保存</el-button>
				</div>
				<div style="height: 30px"></div>
			</el-dialog>
		</div>
		<!--导入-->
		<div class="el-title">
			<el-dialog title="导入文件" :visible.sync="Inventor" width="800px" margin-top='30vh' center @closed="dialogOpeno2">
				<div class="wu_region">
					<div class="footer">
						<div class="zly">
							<input ref="file" accept=".xls,.xlsx" style="position: absolute;cursor: pointer;z-index: 99;" class="file" type="file" name="" id="" value="" @change="handleFile" />
							<div class="ellipsis" style="position: absolute;top:5px;z-index: 1;cursor: pointer;width: 328px;">
								<p style="margin-left:10px;">{{fileName}}</p>
							</div>
						</div>
						<el-button type="success" @click="uploading" size="small ">导入文件</el-button>
						<el-button type="success" style="margin-left: 0px;" @click="download" size="small ">下载模板</el-button>
					</div>
				</div>
			</el-dialog>
		</div>

	</div>
</template>

<script>
	const cityOptions = ['上海', '北京', '广州', '深圳'];
	import parents from "@/assets/api/parents"
	import fetch from '@/assets/tools/fetch'
	import allApi from "@/assets/api/teacher"
	import XLSX from 'xlsx'
	import {
		BmlLushu
	} from 'vue-baidu-map'
	export default {
		name: "t_anquan",
		components: {
			BmlLushu
		},
		data() {
			return {
				pickerOptions0: {
					disabledDate: (time) => {
						if (this.value12 != "" && this.value12 != null) {
							return time.getTime() > Date.now() || time.getTime() > new Date(this.value12).getTime();
						} else {
							return time.getTime() > Date.now();
						}
					}
				},
				pickerOptions1: {
					disabledDate: (time) => {
						return time.getTime() < new Date(this.value11).getTime() || time.getTime() > Date.now();
					}
				},
				bath:false,
				fileName: '点击此处选择文件',
				addhidd: '',
				//详情
				details: {
					user: "",
				},
				headline: '',
				//设置时间
				formset: {
					commandTypeone: '',
					commandTypetwo: '',
					reportingInterval: '',
					sleepTime: '',
					delivery: false,

				},
				//亲友
				formfamily: {
					familyNumberone: '',
					familyNumbertwo: '',
					familyNumberthree: '',
					incomingCalls: '',
					sos: '',
					incomingSms: '',
				},
				//历史
				formInline: {
					commandStatus: '',
					commandType: '',
					incomingCalls: '',
					isS: false,
					sos: '',
					familyNumberthree: '',
					familyNumbertwo: '',
					familyNumberone: '',
					commandTypetwo: '',
					reportingInterval: '',
					reportingInterva: '',
				},
				//				亲友号
				Friends: [{
					value: '1',
					label: '父亲'
				}, {
					value: '2',
					label: '母亲'
				}, {
					value: '3',
					label: '其他'
				}, ],
				commandStatus: [{
					value: '1',
					label: '等待'
				}, {
					value: '2',
					label: '发送成功'
				}, {
					value: '3',
					label: '发送失败'
				}, ],
				CommandType: [{
						value: '1',
						label: '设置位置上报间隔时间'
					}, {
						value: '2',
						label: '设置休眠时间'
					}, {
						value: '3',
						label: '设置亲情号码'
					}, {
						value: '4',
						label: '设置SOS绑定号码'
					}, {
						value: '5',
						label: '设置允许呼入号码'
					},
					{
						value: '6',
						label: '设置允许接收的短信号码'
					}, {
						value: '7',
						label: '立即呼叫指定的号码'
					}, {
						value: '8',
						label: '开启监听'
					},
					{
						value: '9',
						label: '链接短信'
					},
				],
				tableData01: [],
				options: [],
				value22: '',
				checkAll: false,
				dialogFormVisible: false, //指令弹窗
				dialogFormVisible1: false, //指令弹窗
				dialogFormxiangqing: false, //详情弹窗
				dialogFormxiangqing01: false, //亲友
				checkedCities: [],
				cities: [],
				isIndeterminate: false,
				data: [],
				defaultProps: {
					children: 'children',
					label: 'label'
				},
				dialogVisible4: false,
				value0: '',
				value11: '',
				value12: '',
				stuID: '',
				stuName: '',
				dialogVisible3: false,
				options1: '',
				options2: '',
				value1: '',
				value2: '',
				input1: '',
				input11: '',
				input12: '',
				input13: '',
				input14: '',
				input15: '',
				input16: '',
				input2: '',
				input3: '',
				input4: '',
				tableData: [],

				belongId: '',
				zoom: 15,
				studentName: '',
				time: '',
				site: '',
				items: [],
				title: "查看位置",
				name: "显示围栏",
				title1: "查看轨迹",
				btnText: 'play_arrow',
				path: [],
				rotation: false,
				play: false,
				content: '',
				speed: 400,
				icon: {
					url: '../../../static/img/p_index/hz.png',
					size: {
						width: 84,
						height: 84
					},
					opts: {
						anchor: {
							width: 27,
							height: 13
						}
					}
				},
				polygonPath: [{
						lng: 116.412732,
						lat: 39.911707
					},
					{
						lng: 116.39455,
						lat: 39.910932
					},
					{
						lng: 116.403461,
						lat: 39.921336
					}
				],
				center: {
					lat: '26.62990674',
					lng: '106.70917710'
				},
				show: false,
				showWeilan: false,
				postionMap: {
					lng: 0,
					lat: 0
				},
				//				导入
				Inventor: false,
				dialogVisible: false,
				dialogVisible1: false,

				pageNumber: 1,
				pageSize: 10,
				total: 0,
				total01: 0,
				pageNumber01: 1,
				pageSize01: 8,
				classId: '',
				studentName1: '',
				childId: '',
				isActived: "",
				UnionId: '', //学生id
				StudentName: '', //学生姓名
				ContactNumber: '', //手机号码
				contactNumber: '', //手机号码
				getTiem: [{
						value: '1',
						label: '1'
					},
					{
						value: '2',
						label: '2'
					},
					{
						value: '3',
						label: '3'
					},
					{
						value: '4',
						label: '4'
					},
					{
						value: '5',
						label: '5',
					},
					{
						value: '6',
						label: '6'
					},
					{
						value: '7',
						label: '7'
					},
					{
						value: '8',
						label: '8'
					}, {
						value: '9',
						label: '9'
					},

					{
						value: '10',
						label: '10'
					},
					{
						value: '11',
						label: '11'
					},
					{
						value: '12',
						label: '12'
					},
					{
						value: '13',
						label: '13'
					},
					{
						value: '14',
						label: '14'
					},

					{
						value: '15',
						label: '15'
					},
					{
						value: '16',
						label: '16'
					},
					{
						value: '17',
						label: '17'
					},
					{
						value: '18',
						label: '18'
					}, {
						value: '19',
						label: '19'
					},
					{
						value: '20',
						label: '20'
					},
					{
						value: '25',
						label: '25'
					},
					{
						value: '30',
						label: '30'
					},
					{
						value: '45',
						label: '45'
					},
					{
						value: '60',
						label: '60'
					},
				],
				SmartID: '',
				Banduan: '',
			}
		},
		created() {
			this.gerGrade();
			this.getData();
		},
		methods: {
			//			下载
			download() {
				fetch.get(allApi.template, '', res => {
					if(res.code === 200) {
						this.$message({
							type: 'success',
							duration: '1000',
							message: '导出成功'
						})
						window.location = res.data
					}
					if(res.data.code == 201) {
						this.$message({
							type: 'warning',
							message: res.message
						})
					}
				})
			},
			//			上传
			uploading() {
				var file = this.$refs['file'].files[0];
				if(file == undefined) {
					this.$message({
						type: 'warning',
						message: '请选择导入文件！'
					})
					return
				};
				
				fetch.export1(allApi.import, file, res => {
					console.log(res);
					if (res.code === 200) {
						this.$message({
							type: 'warning',
							message: '请导入正确的模板数据'
						})
					}else{
						this.$message({
							type: 'success',
							message: '导入成功'
						})
						this.Inventor = false
					}
					
				})
			},
			//导入
			onimport() {
				this.Inventor = true
			},
			// 文件
			handleFile() {
				var file = this.$refs['file'].files[0];
				this.readExcel(file)
				if(file == undefined) {
					this.fileName = '点击此处选择文件'
					return
				}
				if(file.type != "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" && file.type != 'application/vnd.ms-excel') {
					this.$message({
						type: 'warning',
						message: '文件格式错误！'
					})
					this.$refs['file'].value = '';
					this.fileName = '点击此处选择文件';
					return
				}
				this.fileName = file.name
			},
			readExcel(files) {//表格导入
				var that = this;
				if(files.length<=0){//如果没有文件名
					return false;
				}else if(!/\.(xls|xlsx)$/.test(files.name.toLowerCase())){
					this.$message.error('上传格式不正确，请上传xls或者xlsx格式');
					return false;
				}
			
				const fileReader = new FileReader();
				fileReader.onload = (ev) => {
				try {
					const data = ev.target.result;
					const workbook = XLSX.read(data, {
					type: 'binary'
					});
					const wsname = workbook.SheetNames[0];//取第一张表
					const ws = XLSX.utils.sheet_to_json(workbook.Sheets[wsname]);//生成json表格内容
					
					let a = ws[0]
					let b = {'亲情号设置':"学生手机号"}
					
					if (a['亲情号设置'] != b['亲情号设置']) {
						this.$message({
							type: 'warning',
							message: '请导入正确的模板数据'
						})
						this.$refs['file'].value = '';
						this.fileName = '点击此处选择文件';
						return false;
					}
			
				} catch (files) {
			
					return false;
				}
				};
				fileReader.readAsBinaryString(files);
			},
			//			点击
			dianji(delivery) {
				this.Banduan = delivery
				this.formset.commandTypeone = ''
				this.formset.commandTypetwo = ''
				//				this.formset.reportingInterval = ''
			},
			//
			allTiom() {

			},
			allsecond() {
				//				this.formset.reportingInterval = ''
			},
			Strok(value) {
				this.formset.commandTypeone = ''
				this.formset.commandTypetwo = ''
				this.formset.reportingInterval = ''
			},
			//			全部设置
			Conserveall(ruleForm) {
				var fale = true
				this.$refs[ruleForm].validate((valid) => {
					if(valid) {
						if(this.formset.commandTypeone == undefined || this.formset.commandTypeone == '') {
							this.falg = true
							let par = {
								reportingInterval: this.formset.reportingInterval,
								sleepTime: "",
							}
							fetch.post(allApi.cardAll, par, res => {
								this.$message({
									type: 'warning',
									message: res.message
								})
								this.dialogFormxiangqing = false

							})
							return
						} else {
							var Time = this.formset.commandTypeone.slice(0, 2) + this.formset.commandTypeone.slice(3, 5) + this.formset.commandTypetwo.slice(0, 2) + this.formset.commandTypetwo.slice(3, 5)
							let par = {
								reportingInterval: this.formset.reportingInterval,
								sleepTime: Time,
							}
							fetch.post(allApi.cardAll, par, res => {
								this.$message({
									type: 'warning',
									message: res.message
								})
								this.dialogFormxiangqing = false

							})
						}

					} else {

						return false;
					}

				});
			},
			//保存设置
			Conserve(ruleForm) {
				var fale = true
				this.$refs[ruleForm].validate((valid) => {
					if(valid) {
						if(this.formset.commandTypeone == undefined || this.formset.commandTypeone == '') {
							this.falg = true
							let par = {
								id: this.SmartID,
								reportingInterval: this.formset.reportingInterval,
								sleepTime: "",
							}
							fetch.post(allApi.dormancy, par, res => {
								this.$message({
									type: 'warning',
									message: res.message
								})
								this.dialogFormxiangqing = false

							})
							return
						} else {

							var Time = this.formset.commandTypeone.slice(0, 2) + this.formset.commandTypeone.slice(3, 5) + this.formset.commandTypetwo.slice(0, 2) + this.formset.commandTypetwo.slice(3, 5)
							let par = {
								id: this.SmartID,
								reportingInterval: this.formset.reportingInterval,
								sleepTime: Time,
							}
							fetch.post(allApi.dormancy, par, res => {
								this.$message({
									type: 'warning',
									message: res.message
								})
								this.dialogFormxiangqing = false

							})
						}
					} else {

						return false;
					}
				});
			},
			//	亲友保存
			Relatives(rulefamily) {
				var regEn = /^(1[3456789][0-9]{9})$/;
				var reg = /^[0-9]*$/;
				var fale = false
				if(this.formfamily.familyNumberone == '') {
					this.fale = true
				} else {
					if(!regEn.test(this.formfamily.familyNumberone)) {
						this.$message({
							type: 'warning',
							message: '格式不正确！'
						})
						this.fale = false
						return false;
					}
				}
				if(this.formfamily.familyNumbertwo == '') {
					this.fale = true
				} else {
					if(!regEn.test(this.formfamily.familyNumbertwo)) {
						this.$message({
							type: 'warning',
							message: '格式不正确！'
						})
						this.fale = false
						return false;
					}
				}
				if(this.formfamily.familyNumberthree == '') {
					this.flag = true
				} else {
					if(!regEn.test(this.formfamily.familyNumberthree)) {
						this.$message({
							type: 'warning',
							message: '格式不正确！'
						})
						this.flag = false
						return false;
					}
				}
				if(this.formfamily.familyNumberone == '' && this.formfamily.familyNumbertwo == '' && this.formfamily.familyNumberthree == '') {
					this.$message({
						duration: '1000',
						showClose: true,
						message: '请填入一个亲友号！',
						type: "warning"
					})
					this.fale = false
					return false;
				} else {
					this.fale = true
				}
				this.$refs[rulefamily].validate((valid) => {
					if(valid) {
						if(this.formfamily.familyNumberone == undefined) {
							this.formfamily.familyNumberone == ''
						}
						if(this.formfamily.familyNumbertwo == undefined) {
							this.formfamily.familyNumbertwo == ''
						}
						if(this.formfamily.familyNumberthree == undefined) {
							this.formfamily.familyNumberthree == ''
						}
						var rulefamily = this.formfamily.familyNumberone + ',' + this.formfamily.familyNumbertwo + ',' + this.formfamily.familyNumberthree
						let par = {
							id: this.SmartID,
							familyNumber: rulefamily,
							sos: this.formfamily.sos,
							incomingCalls: this.formfamily.incomingCalls,
							incomingSms: this.formfamily.incomingSms,
						}
						if(par.sos == ''){
							this.$message({
								duration: '1000',
								showClose: true,
								message: 'SOS号码不能为空！',
								type: "warning"
							})
							return
						}
						if(!regEn.test(par.sos)) {
							this.$message({
								type: 'warning',
								message: 'SOS号码格式不正确！'
							})
							return
						}
						let a = par.incomingCalls.split(",")
						let b = par.incomingSms.split(",")
						for (let i = 0; i < a.length; i++) {
						if (a[i] === '') {}
							else if (!regEn.test(a[i])) {
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
							else if (!regEn.test(b[i])) {
								this.$message({
								type: 'warning',
								message: '接收短信号码格式不正确！'
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
						fetch.put(allApi.ccnet, par, res => {

							if(res.code == 200) {
								this.$message({
									duration: '1000',
									showClose: true,
									message: res.message,
									type: "success"
								})
								this.getData()
								this.dialogFormxiangqing01 = false
							} else {
								this.$message({
									duration: '1000',
									showClose: true,
									message: res.message,
									type: "success"
								})
							}

						})
					} else {

						return false;
					}
				});
			},
			dialogOpen() {
				this.formInline.reportingInterval = ''
				this.formInline.reportingInterval = ''
				this.formInline.reportingInterval = ''
				this.formset.reportingInterval = ''
				this.formset.commandTypeone = ''
				this.formset.commandTypetwo = ''
			},
			dialogOpeno2() {
				this.$refs['file'].value = '';
				this.fileName = '点击此处选择文件';
			},
			dialogOpen01() {
				this.formfamily.familyNumber = ''
				this.formfamily.familyNumbertwo = ''
				this.formfamily.familyNumberthree = ''
				this.$refs['rulefamily'].resetFields()
			},
			Consequences(index, row) {
				this.SmartID = row.smartId
				this.addhidd = 'family'
				this.headline = '添加亲友号'
				fetch.get(allApi.cnet + '/' + this.SmartID, '', res => {console.log(res,'dddddd');

					if(res.code == 200) {
						this.formfamily.sos = res.data.sos || ''
						this.formfamily.incomingSms = res.data.incomingSms || ''
						this.formfamily.incomingCalls = res.data.incomingCalls || ''
						if (res.data.familyNumber == '' || res.data.familyNumber == undefined) {
							this.formfamily.familyNumberone = ''
							this.formfamily.familyNumbertwo = ''
							this.formfamily.familyNumberthree = ''
						} else {
							this.formfamily.familyNumberone = res.data.familyNumber.split(',')[0]
							this.formfamily.familyNumbertwo = res.data.familyNumber.split(',')[1]
							this.formfamily.familyNumberthree = res.data.familyNumber.split(',')[2]
						}

					}else {
						this.$message({
							type: 'warning',
							message: res.message
						})
					}

				})
				this.dialogFormxiangqing01 = true
			},
			//			设置全部时间
			Options() {
				this.addhidd = 'all'
				this.headline = '设置'
				this.dialogFormxiangqing = true
			},

			//设置个人时间
			Install(index, row) {
				this.SmartID = row.smartId
				this.addhidd = 'add'
				this.headline = '设置'
				this.dialogFormxiangqing = true
				fetch.get(allApi.cnet + '/' + this.SmartID, '', res => {

					if(res.code == 200) {
						let datas = res.data.reportingInterval;
						datas = datas.replace("*","");
						datas = datas.replace("/","");
						datas = datas.replace("*","");
						this.formset.reportingInterval = datas
						if(res.data.sleepTime == "") {
							this.formset.commandTypeone = ''
							this.formset.commandTypetwo = ''
						} else if(res.data.sleepTime == '*/*') {
							this.formset.commandTypeone = ''
							this.formset.commandTypetwo = ''
						} else {
							let datas = res.data.sleepTime;
							datas = datas.replace("*","");
							datas = datas.replace("/","");
							datas = datas.replace("*","");
							this.formset.commandTypeone = datas.slice(0, 2) + ':' + datas.slice(2, 4)
							this.formset.commandTypetwo = datas.slice(4, 6) + ':' + datas.slice(6, 8)
						}
						if(res.data.sleepTime == "" || res.data.sleepTime == '*/') {
							this.formset.delivery = true
						} else {
							this.formset.delivery = false
						}

					} else {
						this.$message({
							type: 'warning',
							message: res.message
						})
					}
				})
			},
			//获取详情
			Particulars(smartId) {
				this.headline = '详情'
				this.addhidd = 'set'
				this.dialogFormxiangqing = true
				fetch.get(allApi.cnet + '/' + smartId, '', res => {

					if(res.code === 200) {
						let datas = res.data.reportingInterval;
						datas = datas.replace("*","");
						datas = datas.replace("/","");
						datas = datas.replace("*","");
						this.formInline.reportingInterval = datas
						if(res.data.sleepTime == '') {
							this.formInline.commandTypeone = ''
							this.formInline.commandTypetwoo = ''
						} else if(res.data.sleepTime == '*/*') {
							this.formInline.commandTypeone = ''
							this.formInline.commandTypetwo = ''
						} else {
							let datas = res.data.sleepTime;
							datas = datas.replace("*","");
							datas = datas.replace("/","");
							datas = datas.replace("*","");
							this.formInline.commandTypeone = datas.slice(0, 2) + ':' + datas.slice(2, 4)
							this.formInline.commandTypetwo = datas.slice(4, 6) + ':' + datas.slice(6, 8)
						}

						if(res.data.sleepTime == "" || res.data.sleepTime == '*/') {
							this.formset.delivery = true
						} else {
							this.formset.delivery = false
						}
						this.formInline.sos = res.data.sos
						this.formInline.incomingSms = res.data.incomingSms
						this.formInline.incomingCalls = res.data.incomingCalls
						this.formInline.familyNumberone = res.data.familyNumber.split(',')[0]
						this.formInline.familyNumbertwo = res.data.familyNumber.split(',')[1]
						this.formInline.familyNumberthree = res.data.familyNumber.split(',')[2]

					} else {
						this.$message({
							type: 'warning',
							message: res.message
						})
					}

				})
			},
			handleCurrentChange01() {
				this.history();
			},
			//获取旧历史
			history() {

				let a = {
					unionId: this.UnionId,
					commandType: this.formInline.commandType,
					commandStatus: this.formInline.commandStatus,
					pageNumber: this.pageNumber01,
					pageSize: this.pageSize01,
				}

				fetch.get(allApi.command, a, res => {

					if(res.code == 200) {
						this.tableData01 = res.data
						this.total01 = res.total
					} else {
						this.tableData01 = []
						this.total01 = 0
					}

				}, {
					target: '.el-table__body-wrapper'
				})
			},
			//指令
			Acquire(index, row) {
				this.StudentName = row.studentName
				this.ContactNumber = row.contactNumber
				this.UnionId = row.unionId
				this.history();
				this.dialogFormVisible = true;
			},
			Acquires(index, row) {
				console.log(row);
				this.contactNumber = row.contactNumber
				this.dialogFormVisible1 = true;
			},
			isClosed() {
				this.show = false
				this.center.lat = 26.62990674
				this.center.lng = 106.7091771
				this.postionMap.lng = 0
				this.postionMap.lat = 0
				this.studentName1 = ''
				this.time = ''
				this.site = ''
				this.path = []
				this.value11 = ''
				this.value12 = ''
			},
			handleCheckAllChange(val) {
				if(val) {
					this.cities.forEach(a => {
						this.checkedCities.push(a.unionId)
					})
				} else {
					this.checkedCities = []
				}
				this.isIndeterminate = false;
			},
			handleCheckedCitiesChange(value) {
				this.checkedCities = value
				let checkedCount = value.length;
				this.checkAll = checkedCount === this.cities.length;
				this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length;
			},
			allactive() {
				this.dialogVisible4 = true
				this.cities = []
			},
			quxiao() {
				this.dialogVisible4 = false
				this.cities = []
			},
			closeDialog() {
				this.bath = false
				this.isIndeterminate = false
				this.checkedCities = []
			},
			batch() {
				this.bath = true
				const data = []
				this.checkedCities.forEach(v => {
					data.push({
						"studentId": v
					})
				})
				let a = {
					studentCards: JSON.stringify(data)
				}

				fetch.post(allApi.batch, a, res => {
					if(res.code == 200) {
						this.$message({
							message: res.message,
							type: 'success'
						});
						setTimeout(() => {
							this.dialogVisible4 = false
						}, 1000)
					}else{
						this.$message({
							message: res.message,
							type: 'warning'
						});
						this.bath = false
					}

				})
			},
			active() {
				let a = {
					studentId: this.stuID
				}

				fetch.post(allApi.jh, a, res => {
					if(res.code == 200) {
						this.$message({
							message: res.message,
							type: 'success'
						});
						this.getData()
						this.dialogVisible3 = false
					}else{
						this.$message({
							message: res.message,
							type: 'warning'
						});
					}

				})
			},
			findUser(index, row) {
				this.isActived = row.activeStatus
				let a = {
					id: row.unionId
				}
				fetch.get(allApi.student + "/" + row.unionId, a, res => {
					this.stuName = res.data.studentName
					this.input11 = res.data.studentName
					this.input12 = res.data.contactNumber
					this.input13 = res.data.schoolName
					this.input14 = res.data.gradeName + res.data.className
					this.input15 = res.data.parentName
					this.stuID = res.data.unionId
					if(res.data.activeStatus == 1) {
						this.input16 = '已激活'
					} else if(res.data.activeStatus == 0) {
						this.input16 = '激活中'
					} else if(res.data.activeStatus == 2) {
						this.input16 = '激活失败'
					} else {
						this.input16 = '未激活'
					}
				})
				this.dialogVisible3 = true
			},
			indexMethod(index) {
				return index + 1 + (this.pageNumber - 1) * this.pageSize;
			},
			changeSelect(val) {
				this.options2 = []
				this.getClass(val)
				this.value2 = ''
			},
			handleNodeClick(s, d, n) {

				if(s.children) {
					let a = {
						gradeId: s.id
					}
					const b = []
					fetch.get(allApi.class, a, res => {
						res.data.forEach(v => {
							b.push({
								id: v.classId,
								label: v.className
							})
						})
						s.children = b
					})
				} else {
					//班级列表
					let a = {
						classId: s.id,
						activeType: 1
					}
					fetch.get(allApi.student, a, res => {
						this.cities = res.data
					})
				}
			},
			getClass(val) {
				let a = {
					gradeId: val
				}
				fetch.get(allApi.class, a, res => {
					this.options2 = res.data
				})
			},
			gerGrade() {
				fetch.get(allApi.grade, '', res => {
					this.options1 = res.data
					res.data.forEach(v => {
						this.data.push({
							id: v.gradeId,
							label: v.studyPhase+v.gradeName,
							children: [{}]
						})
					})
				})
			},
			findCx() {
				var regEn = /[`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘’，。、]/im;
				var str = /[\u4e00-\u9fa5]$/;
				var regEn01 = /^(1[3456789][0-9]{9})$/;
				var falg = false
				if(this.input1 == '') {
					this.falg = true
				} else {
					if(regEn.test(this.input1)) {
						this.$message({
							type: 'warning',
							message: '姓名不能为特殊符号！'
						})
						this.falg = false
						return false;
					} else {
						this.falg = true

					}
				}
				if(this.input2 == '') {
					this.falg = true
				} else {
					if(str.test(this.input2)) {
						this.$message({
							type: 'warning',
							message: '学号不能是中文！'
						})
						this.falg = false
						return false;
					} else {
						this.falg = true

					}
				}
				if(this.input2 == '') {
					this.falg = true
				} else {
					if(regEn.test(this.input2)) {
						this.$message({
							type: 'warning',
							message: '学号不能为特殊符号！'
						})
						this.falg = false
						return false;
					} else {
						this.falg = true

					}
				}

				if(this.input3 == '' || this.input3 == undefined) {
					this.falg = true
				} else {
					if(!regEn01.test(this.input3)) {
						this.$message({
							type: 'warning',
							message: '电话号码格式不正确！'
						})
						this.falg = false
						return false;
					} else {
						this.falg = true

					}
				}
				this.pageNumber = 1
				this.getData()

			},
			getData() {
				let a = {
					studentName: this.input1,
					studentId: this.input2,
					contactNumber: this.input3,
					gradeId: this.value1,
					classId: this.value2,
					activeStatus: this.value22,
					pageNumber: this.pageNumber,
					pageSize: this.pageSize
				}
				fetch.get(allApi.student, a, res => {
					if(res.code == 200) {
						this.tableData = res.data
						this.total = res.total
					} else {
						this.tableData = []
						this.total = 0
					}

				}, {
					target: '.el-table__body-wrapper'
				})
			},
			look() {
				let par = {
					alarmTime: this.value,
					studentName: this.input,
					belongId: this.input1,
					fenceName: this.input2
				}
				fetch.get(parents.alarm, par, res => {
					if(res.code === 200) {
						this.$message({
							duration: "2000",
							showClose: true,
							message: "更新成功",
							type: "success"
						});
						this.getData()
					} else {
						this.$message({
							type: "warning",
							message: res.message
						})
					}
				})
			},
			changeBtnText(val) {
				this.btnText = val
				if(val === 'play_arrow') {
					this.play = false
				}
			},
			toggle1() {
				if(this.path.length == 0) {
					this.$message({
						duration: "2000",
						message: "请先选择查询！",
						type: "warning"
					});
					return
				}
				this.play = !this.play
			},
			handleCurrentChange() {
				this.getData()
			},
			clickUser(index, id, row) {
				if(id == '1') {
					this.weizhi(row.contactNumber)
					setTimeout(() => {
						this.dialogVisible = true
					},200)
				} else {
					this.guiji(row.contactNumber)
					setTimeout(() => {
						this.dialogVisible1 = true
					},200)
				}
			},
			weizhi(tel) {
				let a = {
					belongId: tel
				}
				fetch.get(parents.location + '/' + tel, a, res => {

					if(res.code === 200) {
						this.items = res.data
						this.belongId = res.data.belongId
						this.center.lng = res.data.longitude
						this.center.lat = res.data.latitude
						this.zoom = 15
						this.$message({
							type: "success",
							message: '更新成功'
						})
					} else {
						this.$message({
							type: "warning",
							message: res.message
						})
					}
				})
			},
			guiji(tel) {
				let a = {
					belongId: tel
				}
				this.childId = tel
				fetch.get(parents.location + '/' + tel, a, res => {
					if(res.code === 200) {
						this.items = res.data
						this.center.lng = res.data.longitude
						this.center.lat = res.data.latitude
					} else {
						this.$message({
							type: "warning",
							message: res.message
						})
					}
				})
			},
			looks() {
				this.path = []
				this.play = false
				if(this.value11 == '') {
					this.$message({
						duration: "2000",
						message: "请选择起始时间",
						type: "warning"
					});
					return
				}
				if(this.value12 == '') {
					this.$message({
						duration: "2000",
						message: "请选择结束时间",
						type: "warning"
					});
					return
				}
				let par = {
					belongId: this.childId,
					startTime: this.value11,
					endTime: this.value12
				}
				fetch.get(parents.track + '/' + this.childId, par, res => {

					if(res.code === 200) {
						res.data.forEach(v => {
							this.path.push({
								lat: v.latitude * 1,
								lng: v.longitude * 1
							})
						});
						this.$message({
							type: "success",
							message: '查询成功'
						})
					} else {
						this.$message({
							type: "warning",
							message: res.message
						})
					}
				})
			},
			get(e) {
				let geocoder = new BMap.Geocoder(); //创建地址解析器的实例
				geocoder.getLocation(e.point, rs => {
					this.site = rs.address;
				});
			},
			getPoint(item) { //点击地图获取一些信息，
				let par = {
					belongId: item.belongId
				}
				fetch.get(parents.location + '/' + this.belongId, par, res => {
					if(res.code === 200) {
						this.postionMap.lng = res.data.longitude
						this.postionMap.lat = res.data.latitude
						this.studentName1 = res.data.studentName
						this.time = res.data.time
					}  else {
						this.$message({
							type: "warning",
							message: res.message
						})
					}
				})
				setTimeout(() => {
					this.show = true
				}, 500)
			},
			infoWindowClose() {
				this.show = false
			},
			infoWindowOpen() {
				this.show = true
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
	.tip_sel {
		margin-left: 20px;
		margin-top: 20px;
		margin-bottom: 20px;
	}
	
	.tip_class {
		margin-left: 20px;
		font-size: 16px;
		margin-top: 20px;
		margin-bottom: 20px;
	}
	
	.tip_bottom {
		margin-left: 20px;
		overflow: auto;
	}
	
	.el-checkbox {
		width: 66px;
		margin-left: 0;
		margin-right: 40px;
	}
	
	.content1 {
		display: flex;
		overflow: hidden;
		height: 500px;
	}
	
	.tip_left {
		width: 200px;
		border-right: 1px solid rgb(240, 240, 240);
		overflow: auto;
	}
	
	.tip_right {
		flex: 1;
		position: relative;
	}
	
	.el-title1 {
		height: 600px;
	}
	
	.infList {
		margin-top: 30px;
		display: flex;
	}
	
	.infList span {
		text-align: center;
		line-height: 40px;
		width: 100px;
	}
	
	.hc_input {
		margin-top: 20px;
		float: left;
		display: flex;
		margin-left: 15px;
	}
	
	.tip {
		height: 650px;
		position: relative;
	}
	
	.title_list span {
		margin-left: 20px;
		margin-right: 5px;
		font-family: MicrosoftYaHei;
		font-size: 14px;
		color: #333333;
	}
	
	.el-title .cha {
		margin-left: 20px;
	}
	
	.el-title .tip1 {
		height: 240px;
		position: relative;
	}
	
	.el-title .tip .btn {
		position: absolute;
		top: 27px;
		left: 31px;
		width: 112px;
		height: 40px;
		line-height: 40px;
		background-color: #08b065;
		border-radius: 4px;
		z-index: 1000;
		color: #fff;
		text-align: center;
		cursor: pointer;
	}
	
	.el-title .title_list {
		padding-top: 20px;
		text-align: left;
		box-shadow: 0px 3px 8px 0px rgba(41, 48, 56, 0.18);
		margin-right: 20px;
	}
	
	.el-title .el-input {
		width: auto;
		margin-bottom: 20px;
	}
	
	.tip .btn1 {
		position: absolute;
		top: 20px;
		left: 20px;
		z-index: 1000;
		background: #fff;
		padding-right: 20px;
	}
	
	.tip .btn {
		position: absolute;
		top: 27px;
		left: 31px;
		width: 112px;
		height: 40px;
		line-height: 40px;
		background-color: #08b065;
		border-radius: 4px;
		z-index: 1000;
		color: #fff;
		text-align: center;
		cursor: pointer;
	}
	
	.header {
		width: 97%;
		background-color: #fff;
		margin: 0 auto;
		margin-top: 21px;
		padding-top: 20px;
		padding-bottom: 20px;
	}
	
	.wrap {
		width: 97%;
		background-color: #fff;
		margin: 0 auto;
	}
	
	.header_content {
		overflow: hidden;
		width: 98%;
		background-color: #ffffff;
		box-shadow: 0px 3px 8px 0px rgba(41, 48, 56, 0.18);
		margin: 0 auto;
		padding-bottom: 20px;
	}
	
	.title {
		width: 15px;
		height: 15px;
		background: url(../../../static/img/p_index/xz01.png) no-repeat center center;
		border-radius: 50%;
	}
	
	.on {
		background: url(../../../static/img/p_index/xz01.png) no-repeat center center;
	}
	
	.off {
		background: url(../../../static/img/p_index/xz02.png) no-repeat center center;
	}
	
	.wu_region {
		padding: 50px 100px 50px;
	}
	
	.wu_region .footer {
		display: flex;
		justify-content: space-around;
	}
	
	.wu_region .zly {
		width: 330px;
		height: 30px;
		background-color: #ffffff;
		border-radius: 4px;
		border: solid 1px #eeeeee;
		position: relative;
		cursor: pointer;
	}
	
	.wu_region .zly .file {
		width: 100%;
		height: 100%;
		border: none;
		/* outline: none; */
		opacity: 0;
		cursor: pointer;
		float: right;
	}
	
	.wu_region .wu_bt4 {
		width: 100px;
		height: 44px;
		background-color: #128fe3;
		border-radius: 4px;
		border: solid 1px #128fe3;
		color: #ffffff;
		cursor: pointer;
	}
</style>