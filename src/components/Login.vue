<template>
  <div class="login_box">
    <h2 class="title">登录</h2>
    <el-form ref="loginFromRef" :model="loginFrom" :rules="loginFromRules"  class="login_from">
      <!-- 账号 -->
      <el-form-item prop="username">
        <el-input v-model="loginFrom.username" prefix-icon="el-icon-user-solid" ></el-input>
      </el-form-item>
      <!-- 密码 -->
      <el-form-item prop="password">
        <el-input v-model="loginFrom.password" prefix-icon="el-icon-lock" type="password"></el-input>
      </el-form-item>
      <!-- 按钮 -->
      <el-form-item  class="btns">
        <el-button type="primary" @click="login">登录</el-button>
        <el-button type="info" @click="resetLoginFrom">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data () {
    return {
      loginFrom: {
        username: '',
        password: ''
      },
      //   表单验证
      loginFromRules: {
        username: [
          { required: true, message: '请输入账号', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, message: '长度不少于6位', trigger: 'blur' }
        ]
      }
    }
  },
  // 注册可以访问父类的方法
  inject: ['saveMenuItem'],
  created () {
    this.saveMenuItem('/login')
  },
  methods: {
    //   点击重置按钮
    resetLoginFrom () {
    //   console.log(this)
      this.$refs.loginFromRef.resetFields()
    },
    login () {
      this.$refs.loginFromRef.validate(async valid => {
        if (!valid) { return }
        // 向后端请求验证并把返回的数据中data数据转为result
        this.$post('/user/login', this.loginFrom).then((result) => {
        // this.$http.post('/login', this.$qs.stringify(this.loginFrom)).then((result) => {
          if (result.code === 200) {
            console.log('aaaaaaaa', result)
            // 存储token
            this.$store.commit('saveToken', result.data.Token)
            window.sessionStorage.setItem('token', result.data.Token)
            window.localStorage.setItem('token', result.data.Token)
            // 储存用户信息
            this.$store.commit('saveUserInfo', result.data.userInfo)
            window.localStorage.setItem('userInfo', JSON.stringify(result.data.userInfo))
            this.$router.push('/userindex')
            this.$message.success('登录成功')
          }
        }).catch((err) => {
          console.log('请求错误111', err)
          this.$message.error(err.message)
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>

.login_box{
  width: 450px;
  height: 300px;
  background-color: #F2F6FC;
  border-radius: 3px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
}

.login_from{
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}

.title{
  position: absolute;
  width: 100%;
  font-size: 30px;
  color: #2b4b6b;
  font-family: "微软雅黑";
  // font-weight: 600;
  top: 0;
  text-align: center;
  padding: 30px 20px;
  box-sizing: border-box;
}

.btns{
    display: flex;
    justify-content: flex-end;
}
</style>
