<template>
    <el-container class="home-container">
        <!-- 头部 -->
        <el-header>
            <div>
                <img src="../assets/logo.png" style="width:40px;height:40px;" alt="" >
                <span>HDFS_CC云盘</span>
            </div>
            <div>
                <el-menu
                    :default-active="navigationbar"
                    mode="horizontal"
                    background-color="#ffffff"
                    @select="saveMenuItem"
                    text-color="#606266"
                    active-text-color="#409EFF"
                    :router="true"
                    >
                    <el-menu-item index="/login">登录</el-menu-item>
                    <el-menu-item index="/registered">注册</el-menu-item>
                </el-menu>
            </div>
        </el-header>
        <!-- 显示的内容 -->
        <el-main>
            <vue-particles color="#dedede" :particleOpacity="0.7" :particlesNumber="80" shapeType="circle"
                :particleSize="4" linesColor="#dedede" :linesWidth="1" :lineLinked="true" :lineOpacity="0.4"
                :linesDistance="150" :moveSpeed="3" :hoverEffect="true" hoverMode="grab" :clickEffect="true" clickMode="push">
            </vue-particles>
            <router-view></router-view>
        </el-main>
    </el-container>
</template>

<script>

export default {
  data () {
    return {
      navigationbar: '/login'
    }
  },
  created () {
    if (window.sessionStorage.getItem('navigationbarPath')) {
      this.navigationbar = window.sessionStorage.getItem('navigationbarPath')
    }
  },
  methods: {
    saveMenuItem (index, indexPath) {
      this.navigationbar = index
      window.sessionStorage.setItem('navigationbarPath', index)
    }
  }
}
</script>

<style lang="less" scoped>
.el-header{
    background-color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 4px;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.15) !important;
    > div {
        display: flex;
        align-items: center;
        padding: 0 20px;
        span{
          margin-left: 15px;
          font-size: 15px;
          font-family: '黑体';
          font-weight: 600;
          color: #000;
        }
    }
}
.el-main{
    //  background-color: #2b4b6b;
    // height: 100%;
    overflow-y: hidden;
    padding: 0;
    margin: 0;
}
.home-container{
    height: 100%;
    z-index: 999;
}
// .vue-particles{
//     z-index: -1;
// }
</style>
