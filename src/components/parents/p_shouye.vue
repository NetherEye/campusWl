<template>
  <div class="wrap">
    <div class="title">
      <img width="22px" height="19px" src="../../../static/img/p_index/tl.png" alt="">
      <span>通知公告</span>
    </div>
    <ul>
      <li v-for="(item,index) in dataList" :key="index" @click="getDatalist(item)">
        <div class="line"></div>
        <div class="lt ellipsis">{{item.noticeContent}}</div>
        <div class="rt"><img src="../../../static/img/p_index/time.png" alt="">{{item.publishTime}}</div>
      </li>
    </ul>
    <div class="el-title">
      <el-dialog :title="noticeName" :visible.sync="dialogVisible" @closed="close" width="800px" center>
      <div class="tip">
          <div class="tip_time">
            <span style="margin-right:40px">发布人：{{publisherName}}</span>
            <span>发布时间：{{publishTime}}</span>
          </div>
          <div class="tip_conter">{{noticeContent}}</div>
      </div>
    </el-dialog>
    </div>
  </div>
</template>

<script>
import fetch from "@/assets/tools/fetch"
import parents from "@/assets/api/parents"
  export default {
    name: "p_shouye",
    data() {
      return {
        noticeName:'通知',
        publisherName:'',
        publishTime:'',
        noticeContent:'',
        dialogVisible: false,
        dataList: []
      }
    },
    created() {
      this.getData()
    },
    mounted(){
      setTimeout(() => {
        let a = document.querySelectorAll(".line")
          for (let i = 0; i < a.length; i++) {
            a[i].style.background = '#'+Math.floor(Math.random()*16777215).toString(16)
          }
      },500)
    },
    methods: {
      getData(){
        fetch.get(parents.notice, '', res => {
          if (res.code === 200) {
            this.dataList = res.data;
          }else{
            this.dataList = [];
          }
        })
      },
      close(){
        this.noticeName = ''
        this.publisherName = ''
        this.publishTime = ''
        this.noticeContent = ''
      },
      getDatalist(item){
        fetch.get(parents.notice+'/'+item.id, {id:item.id}, res => {
          if (res.code === 200) {
            this.noticeName = res.data.noticeName
            this.publisherName = res.data.publisherName
            this.publishTime = res.data.publishTime
            this.noticeContent = res.data.noticeContent
          }
        })
        this.dialogVisible = true
      }
    }
  }

</script>
<style scoped>
  .wrap {
    padding: 20px;
  }

  .title {
    font-family: MicrosoftYaHei;
    font-size: 16px;
    color: #6a6c6f;
    margin-bottom: 20px;
  }

  ul li {
    display: flex;
    height: 84px;
    line-height: 84px;
    background-color: #ffffff;
    box-shadow: 0px 2px 9px 0px rgba(105, 105, 105, 0.07);
    border-radius: 8px;
    margin-bottom: 20px;
    font-family: MicrosoftYaHei;
    font-size: 16px;
    font-weight: normal;
    font-stretch: normal;
    color: #6a6c6f;
    cursor: pointer;
  }

  ul li .line {
    width: 5px;
    height: 100%;
    /* background-color: #ffbb28; */
    border-radius: 8px;
  }

  ul li .lt {
    flex: 1;
    padding-left: 20px;
  }

  ul li .rt {
    padding-right: 20px;
  }

  ul li .rt img {
    width: 22px;
    height: 22px;
    margin-right: 10px;
  }
.tip {
    height: 404px;
    overflow: auto;
}

.tip_conter{
	font-family: MicrosoftYaHei;
	font-size: 18px;
	line-height: 2;
	letter-spacing: 2px;
    color: #999999;
    padding: 20px;
}
.tip_time {
    height: 60px;
    line-height: 60px;
    padding: 0 20px;
	font-family: MicrosoftYaHei;
	font-size: 18px;
	letter-spacing: 2px;
    color: #666666;
    border-bottom: 1px solid #d7d7d7;
}
</style>