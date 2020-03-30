<template>
<el-container class="home-container">
    <!-- 头部 -->
    <el-header>
        <div>
            <img src="../assets/logo.png" style="width:40px;height:40px;" alt="">
            <span>网盘后台管理系统</span>
        </div>
        <el-link icon="el-icon-switch-button" :underline="false" @click="logout">退出</el-link>
        <!-- <el-button type="info" >退出a </el-button> -->
    </el-header>
    <!-- 页面主题区域 -->
    <el-container>
        <!-- 侧边部 -->
        <el-aside width="200px">
            <el-menu
            :default-active="activePath"
            class="el-menu-vertical-demo"
            @select="saveMenuItem"
            background-color="#f7f7f7"
            text-color="#666666"
            active-text-color="#09aaff"
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
      menulist: [
        { id: 1001, path: '/', name: '用户管理', children: [{ id: 2001, path: '/user', name: '用户列表' }] },
        { id: 1002, path: '/', name: '权限管理', children: [{ id: 2002, path: '/roles', name: '角色列表' }] },
        { id: 1003, path: '/', name: '网盘管理', children: [{ id: 2003, path: '/files', name: '文件列表' }] }
      ],
      menuiconlist: {
        1001: 'el-icon-s-custom',
        1002: 'el-icon-s-management',
        1003: 'el-icon-folder-opened'
      }
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
      this.$router.push('/login')
    },
    // 侧边栏展开点击一级时相应,解决首页不能定位问题
    saveMenuItem (index, indexPath) {
      console.log(index, indexPath, 1)
      //
      window.sessionStorage.setItem('activePath', index)
    }
    // saveMenuItem (activePath) {
    //   // window.sessionStorage.setItem('activePath', activePath)
    // }
  }
}
</script>

<style lang="less" scoped>
.el-header{
    background-color: #ffffff;
    color: #09aaff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: solid 1px #e6e6e6;
    margin-bottom: 1px;
    box-shadow: 0 3px 3px rgba(0, 0, 0, 0.15) !important;
    > div {
        // width: 200px;
        display: flex;
        align-items: center;
        span{
            margin-left: 15px;
            font-size: 15px;
            font-family: '黑体';
            color: #000;
        }
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
