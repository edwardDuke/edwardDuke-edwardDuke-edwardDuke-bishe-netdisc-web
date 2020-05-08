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
            <!-- <globaluploader></globaluploader> -->
        </el-main>

        <!-- 修改用户对话框 -->
        <el-dialog
          title="修改用户"
          :visible.sync="editUserVisible"
          :close-on-click-modal="false"
          width="40%" @close="editUserClose">
          <el-form :model="editUserInfo" :rules="editUserFromRules" ref="editUserFromRef" label-width="100px" size="mini">
            <el-form-item label="用户账号" prop="account">
              <el-input v-model="editUserInfo.account" disabled></el-input>
            </el-form-item>
            <el-form-item label="姓名" prop="name">
              <el-input v-model="editUserInfo.name"></el-input>
            </el-form-item>
            <el-form-item label="性别" prop="sex">
              <el-select v-model="editUserInfo.sex" placeholder="请选择性别">
                <el-option label="男" value="男"></el-option>
                <el-option label="女" value="女"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="editUserVisible = false">取 消</el-button>
            <el-button type="primary" @click="editUser">确 定</el-button>
          </span>
        </el-dialog>
    </el-container>
</template>

<script>
// import globaluploader from './file/component/GlobalUploader'
export default {
  data () {
    return {
      // 导航栏指定
      navigationbar: '/userindex',
      // 用户信息
      userinfo: {
        username: this.$store.state.username,
        userImg: '../assets/images/user.png'
      },

      // 编辑用户对话框显示
      editUserVisible: false,
      // 获取用户编辑的信息
      editUserInfo: {
        account: '15766936118',
        name: '王小虎',
        sex: 'n男'
      },
      // 编辑用户表单的验证规则
      editUserFromRules: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        sex: [
          { required: true, message: '请选择性别', trigger: 'blur' }
        ]
      }
    }
  },
  // components: {
  //   globaluploader: globaluploader
  // },
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
    // changeUserinfo () {
    //   this.$message.info('点击修改用户信息')
    // },
    // 退出
    logout () {
      this.$message.success('退出成功')
      window.sessionStorage.clear()
      window.localStorage.clear()
      this.$store.commit('saveToken', '')
      this.$store.commit('changeLogin', false)
      this.$router.push('/login')
    },
    // 展示用戶编辑对话框
    changeUserinfo () {
      this.editUserInfo = this.$store.state.userInfoObj
      console.log('ccccc', this.editUserInfo)
      this.editUserVisible = true
    },
    // 监听编辑用户关闭，并重置当前表单
    editUserClose () {
      this.$refs.editUserFromRef.resetFields()
      this.editUserInfo = {}
    },
    // 修改用户信息提交
    editUser () {
      this.$refs.editUserFromRef.validate(async valid => {
        console.log(valid)
        if (!valid) return
        // 调用修改接口
        console.log('调用修改用户接口', this.editUserInfo)
        this.$post('/user/edit', this.editUserInfo).then((result) => {
          if (result.code === 200) {
            // 隐藏对话框
            this.editUserVisible = false
            // 重新刷新用户信息
            console.log('重新刷新用户信息')
            this.$store.commit('saveUserInfo', result.data)
            this.userinfo.username = result.data.name
            // 弹窗修改成功
            this.$message.success('修改信息成功')
          }
        }).catch((err) => {
          console.log('请求失败', err)
          this.$message.error(err.message)
        })
      })
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
