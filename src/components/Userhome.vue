<template>
    <el-container class="home-container">
        <el-header>
            <el-row :gutter="10" class="headerSeconde">
                <el-col :span="3">
                    <router-link to="/userhome" class="title">
                        <img src="../assets/logo.png" style="width:40px;height:40px;" alt="" >
                        <span>HDFS_CC云盘</span>
                    </router-link>
                </el-col>
                <el-col :span="21">
                    <div class="headerItem">
                        <el-menu
                            :default-active="navigationbar"
                            mode="horizontal"
                            background-color="#ffffff"
                            @select="saveMenuItem"
                            text-color="#606266"
                            active-text-color="#409EFF"
                            :router="true"
                            >
                            <el-menu-item index="/userindex">首页</el-menu-item>
                            <el-menu-item index="/usershare">分享</el-menu-item>
                        </el-menu>
                        <el-dropdown @command="handleCommand">
                            <div class="userinfo">
                                <el-avatar :src="userinfo.userImg"><img src="../assets/images/user.png" /></el-avatar>
                                <span>{{userinfo.username}}</span>
                                <i class="el-icon-arrow-down el-icon--right"></i>
                            </div>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item command="changeUserinfo">修改个人信息</el-dropdown-item>
                                <el-dropdown-item command="logout">退出</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </div>
                </el-col>
            </el-row>
        </el-header>
        <el-main>
            <router-view></router-view>
        </el-main>
    </el-container>
</template>

<script>
export default {
  data () {
    return {
      // 导航栏指定
      navigationbar: '/userindex',
      // 用户信息
      userinfo: {
        username: this.$store.state.username,
        userImg: '../assets/images/user.png'
      }
    }
  },
  // 向子组件提供当前页访问的方法
  provide () {
    return {
      saveMenuItem: this.saveMenuItem
    }
  },
  created () {
    // this.userinfo.username = this.$store.state.username
    // console.log('0000000000000000000', this.userinfo.username)
  },
  methods: {
    // 导航菜单栏
    saveMenuItem (index) {
      this.navigationbar = index
    },
    // 用户显示隐藏点击回调
    handleCommand (command) {
      if (command === 'changeUserinfo') {
        this.changeUserinfo()
      }
      if (command === 'logout') {
        this.logout()
      }
    },
    changeUserinfo () {
      this.$message.info('点击修改用户信息')
    },
    // 退出
    logout () {
      window.sessionStorage.clear()
      window.localStorage.clear()
      this.$store.commit('saveToken', '')
      this.$store.commit('changeLogin', false)
      this.$router.push('/login')
    }
  }
}
</script>

<style lang="less" scoped>
.home-container{
    height: 100%;
    z-index: 999;
}
.el-header{
    background-color: #ffffff;
    display: flex;
    align-items: center;
    // justify-content: space-between;
    // margin-bottom: 4px;
    z-index: 999;
    box-shadow: 0 3px 5px rgba(0, 0, 0, 0.15) !important;
    .headerSeconde{
        width: 100%;
        display: flex;
        align-items: center;
    }
    .title {
        display: flex;
        align-items: center;
        // padding: 0 20px;
        span{
          margin-left: 15px;
          font-size: 15px;
          font-family: '黑体';
          font-weight: 600;
          color: #000;
        }
    }
    .headerItem{
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .userinfo{
        display: flex;
        align-items: center;
        > span{
            margin: 0 0.4rem;
        }
    }
}
.el-main{
    padding:0;
}
</style>
