<template>
    <div>分享页面</div>
</template>

<script>
export default {
  data () {
    return {

    }
  },
  // 注册可以访问父类的方法
  inject: ['saveMenuItem'],
  // 创建该页面自动执行create函数
  created () {
    console.log('分享')
    this.saveMenuItem('/usershare')
  },
  methods: {
  }
}
</script>

<style lang="less" scoped>

</style>
