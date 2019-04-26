<template>
    <div style="height:667px;margin: 100px auto;position: relative;">
        <img style="width: 60%;margin: 0 auto;display: block;" src="../../../static/img/cg/title.png" alt="">
        <img style="position: absolute;top: 10px;right: 31%;width: 4%;cursor: pointer;" src="../../../static/img/cg/logout.png" alt="" @click="quit">
    </div>
</template>

<script>
  import fetch from '@/assets/tools/fetch'
  import allApi from "@/assets/api/login"
    export default {
        data(){
            return {

            }
        },
        methods:{
            
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
        }
    }
</script>

<style scoped>

</style>