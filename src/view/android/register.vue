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
                v-model="registeredFrom.username"
                name="账号"
                label="账号"
                placeholder="输入账号"
                :rules="[{ required: true, message: '请填写账号' }]"
            />
            <van-field
                v-model="registeredFrom.password"
                type="password"
                name="密码"
                label="新密码"
                placeholder="输入密码"
                :rules="[{ required: true, message: '请填写密码' }]"
            />
             <van-field
                v-model="registeredFrom.checkPass"
                type="password"
                name="validator"
                label="确认密码"
                placeholder="再次输入密码"
                :rules="[{ validator, message: '两次密码输入不一致' }]"
            />
            <div style="margin: 16px;">
                <van-button round block type="info" native-type="submit">注册</van-button>
            </div>
             <div style="margin: 16px;">
                <van-button round block type="default" @click="login">返回登录</van-button>
            </div>
        </van-form>
    </div>
</div>
</template>

<script>
export default {
  data () {
    return {
      registeredFrom: {
        username: '',
        password: '',
        checkPass: ''
      }
    }
  },
  methods: {
    validator (val) {
      console.log(val)
      if (this.registeredFrom.checkPass === '') return false
      if (this.registeredFrom.password === this.registeredFrom.checkPass) {
        return true
      } else {
        return false
      }
    },
    // 登录
    onSubmit (values) {
      console.log('submit', values)
      // 向后端请求验证并把返回的数据中data数据转为result
      var username = this.registeredFrom.account
      var password = this.registeredFrom.password
      this.$post('/user/register', { username: username, password: password }).then((result) => {
        console.log(result)
        if (result.code === 200) {
          this.$notify({ type: 'success', message: '注册成功' })
          // 跳转界面
          //   this.saveMenuItem('/login')
          window.sessionStorage.clear()
          this.$router.push('/mobile/login')
        }
      }).catch((err) => {
        console.log('请求错误111', err)
        this.$message.error(err.message)
      })
    },
    // 登录
    login () {
      this.$router.push('/mobile/login')
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
