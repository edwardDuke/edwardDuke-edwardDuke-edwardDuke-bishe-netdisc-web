<template>
    <div>
        <h2>欢迎界面</h2>
    </div>
</template>

<script>
export default {
  data () {
    return {

    }
  },
  // 注册可以访问父类的方法
  inject: ['saveMenuItem'],
  created () {
    this.saveMenuItem('/welcome')
  }
}
</script>

<style lang="less" scoped>
</style>
