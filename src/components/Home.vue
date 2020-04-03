<template>
<el-container class="home-container">
    <!-- 头部 -->
    <el-header>
      <div class="mena-shrink">
        <el-link :icon="ismenashow? 'el-icon-s-unfold':'el-icon-s-fold'" :underline="false" @click="mena"></el-link>
      </div>
      <div>
        <div>
          <img src="../assets/logo.png" style="width:40px;height:40px;" alt="" >
          <span>网盘后台管理系统</span>
        </div>
        <el-link icon="el-icon-switch-button" :underline="false" @click="logout">退出</el-link>
      </div>
        <!-- <el-button type="info" >退出a </el-button> -->
    </el-header>
    <!-- 页面主题区域 -->
    <el-container>
      <!-- 侧边部 -->
      <el-aside :width="ismenashow ? '64px': '200px'">
          <el-menu
          :default-active="activePath"
          :collapse="ismenashow"
          class="el-menu-vertical-demo"
          @select="saveMenuItem"
          background-color="#f7f7f7"
          text-color="#666666"
          active-text-color="#09aaff"
          :collapse-transition="false"
          :unique-opened="true"
          :router="true">
          <el-menu-item index="/welcome">
              <i class="el-icon-s-home"></i>
              <span slot="title">首页</span>
          </el-menu-item>
          <!-- 一级菜单 -->
          <el-submenu :index="item.id +''" v-for="item in menulist" :key="item.id">
              <!-- 菜单模板 -->
              <template slot="title">
                  <!-- 菜单图标 -->
                  <i :class="menuiconlist[item.id]"></i>
                  <!-- 文本 -->
                  <span>{{item.name}}</span>
              </template>
              <!-- 二级菜单 -->
              <!-- <el-menu-item-group> -->
              <el-menu-item :index="secitem.path" v-for="secitem in item.children" :key="secitem.id" @click="saveMenuItem(secitem.path)">
                  <template slot="title">
                      <!-- 菜单图标 -->
                      <i class="el-icon-menu"></i>
                      <!-- 文本 -->
                      <span>{{secitem.name}}</span>
                  </template>
              </el-menu-item>
              <!-- </el-menu-item-group> -->
          </el-submenu>
          </el-menu>
      </el-aside>
      <!-- 主体显示部 -->
      <el-main>
          <router-view></router-view>
      </el-main>
    </el-container>
</el-container>
</template>

<script>
export default {
  data () {
    return {
      // 被激活的链接地址
      activePath: '/welcome',
      // 菜单列表
      menulist: [
        { id: 1001, path: '/', name: '用户管理', children: [{ id: 2001, path: '/user', name: '用户列表' }] },
        { id: 1002, path: '/', name: '权限管理', children: [{ id: 2002, path: '/roles', name: '角色列表' }] },
        { id: 1003, path: '/', name: '网盘管理', children: [{ id: 2003, path: '/files', name: '文件列表' }] }
      ],
      // 一级菜单对应的图标
      menuiconlist: {
        1001: 'el-icon-s-custom',
        1002: 'el-icon-s-management',
        1003: 'el-icon-folder-opened'
      },
      // 菜单是否伸缩
      ismenashow: false
    }
  },
  // 创建该页面自动执行create函数
  created () {
    if (window.sessionStorage.getItem('activePath')) {
      this.activePath = window.sessionStorage.getItem('activePath')
    }
  },
  methods: {
    // 退出
    logout () {
      window.sessionStorage.clear()
      window.localStorage.clear()
      this.$store.commit('saveToken', '')
      this.$store.commit('changeLogin', false)
      this.$router.push('/login')
    },
    // 侧边栏展开点击跳转
    saveMenuItem (index, indexPath) {
      console.log(index, indexPath, 1)
      //
      window.sessionStorage.setItem('activePath', index)
    },
    // 菜单栏伸缩
    mena () {
      this.ismenashow = !this.ismenashow
    }
  }
}
</script>

<style lang="less" scoped>
.el-header{
    background-color: #ffffff;
    color: #09aaff;
    display: flex;
    // justify-content: space-between;
    align-items: center;
    padding: 0;
    margin-bottom: 4px;
    box-shadow: 0 3px 3px rgba(0, 0, 0, 0.15) !important;
    > div {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 20px;
        > div {
           display: flex;
        align-items: center;
        }
        span{
          margin-left: 15px;
          font-size: 15px;
          font-family: '黑体';
          color: #000;
        }
    }
    .mena-shrink{
      display: flex;
      justify-content: center;
      align-items: center;
      // left: 0;
      width: 4rem;

    }
}
.el-aside{
    background-color: #f7f7f7;
    .el-menu{
        border-right: none;
    }
}
.el-main{
    background-color: #ffffff;
}
.home-container{
    height: 100%;
}
</style>
