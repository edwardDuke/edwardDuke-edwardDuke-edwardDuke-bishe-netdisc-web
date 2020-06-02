<template>
<div>
    <vue-particles color="#dedede" :particleOpacity="0.7" :particlesNumber="80" shapeType="circle"
        :particleSize="4" linesColor="#dedede" :linesWidth="1" :lineLinked="true" :lineOpacity="0.4"
        :linesDistance="150" :moveSpeed="3" :hoverEffect="true" hoverMode="grab" :clickEffect="true" clickMode="push">
    </vue-particles>
    <h2 class="title">HDFS_CC云盘</h2>
    <div class="login_box">
        <van-form @submit="onSubmit">
            <van-field
                v-model="loginFrom.username"
                name="账号"
                label="账号"
                placeholder="账号"
                :rules="[{ required: true, message: '请填写账号' }]"
            />
            <van-field
                v-model="loginFrom.password"
                type="password"
                name="密码"
                label="密码"
                placeholder="密码"
                :rules="[{ required: true, message: '请填写密码' }]"
            />
            <div style="margin: 16px;">
                <van-button round block type="info" native-type="submit">登录</van-button>
            </div>
            <div style="margin: 16px;">
                <van-button round block type="default" @click="register">注册</van-button>
            </div>
        </van-form>
    </div>
</div>
</template>

<script>
export default {
  data () {
    return {
      loginFrom: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    // 登录
    onSubmit (values) {
      console.log('submit', values)
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
          this.$router.push('/mobile/index')
          this.$notify({ type: 'success', message: '登录成功' })
        //   this.$message.success('登录成功')
        }
      }).catch((err) => {
        console.log('请求错误111', err)
        this.$message.error(err.message)
      })
    },
    // 注册
    register () {
      this.$router.push('/mobile/registered')
    }
  }
}
</script>
<style lang="less" scoped>
.title{
    position: absolute;
    width: 100%;
    top: 10%;
    text-align:center;
}
.login_box{
//   width: 450px;
//   height: 300px;
//   border-radius: 3px;
  position: absolute;
  top: 30%;
//   left: auto;
  left: 10%;
//   transform: translate(-50%,-50%);
}

</style>
