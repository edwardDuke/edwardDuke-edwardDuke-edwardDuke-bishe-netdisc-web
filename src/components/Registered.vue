<template>
    <div class="registered_box">
      <div>
        <h2 class="title">注册</h2>
        <el-form :model="registeredFrom" :rules="registeredRules" ref="registeredRef" label-width="auto" class="registered_from">
          <el-form-item label="账号" prop="account">
            <el-input v-model="registeredFrom.account"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input type="password" v-model="registeredFrom.password" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="checkPass">
            <el-input type="password" v-model="registeredFrom.checkPass" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item  class="btns">
            <el-button type="primary" @click="registered">注册</el-button>
            <el-button type="info" @click="resetRegisteredFrom">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
</template>

<script>
export default {
  data () {
    // 二次密码矫正
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.registeredFrom.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      // 注册表单数据
      registeredFrom: {
        account: '',
        password: '',
        checkPass: ''
      },
      // 表单验证
      registeredRules: {
        account: [
          { required: true, message: '请输入账号', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, message: '长度不少于6位', trigger: 'blur' }
        ],
        checkPass: [
          { validator: validatePass2, trigger: 'blur' }
        ]
      }
    }
  },
  // 注册可以访问父类的方法
  inject: ['saveMenuItem'],
  methods: {
    //   点击重置按钮
    resetRegisteredFrom () {
    //   console.log(this)
      this.$refs.registeredRef.resetFields()
    },
    // 注册
    registered () {
      this.$refs.registeredRef.validate(async valid => {
        if (!valid) { return }
        // 向后端请求验证并把返回的数据中data数据转为result
        // const { data: result } = await this.$http.post('/login', this.loginFrom)
        // console.log(result)
        // 判断请求是否成功
        // eslint-disable-next-line no-constant-condition
        if (false) {
          return this.$message.error('注册失败')
        }
        this.$message.success('注册成功')
        // 跳转界面
        this.saveMenuItem('/login')
        window.sessionStorage.clear()
        this.$router.push('/login')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.registered_box{
  width: 450px;
    // height: 300px;
  background-color: #F2F6FC;
  border-radius: 3px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
  > div{
    display: flex;
    height: 100%;
    width: 100%;
    flex-direction: column ;
    justify-content: center;
    align-items: center;
  }
}
.title{
  margin: 20px 0;
  font-size: 30px;
  color: #2b4b6b;
  font-family: "微软雅黑";
      }
.registered_from{
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}

.btns{
    display: flex;
    justify-content: flex-end;
}
</style>
