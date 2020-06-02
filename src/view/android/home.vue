<template>
    <div>
      <!-- 头部 -->
      <div class="systop">
          <div class="systop_img" @click="isShowSelect"><el-avatar src="../assets/images/user.png"><img src="../../assets/images/user.png" /></el-avatar></div>
          <h3>HDFS_CC云盘</h3>
      </div>
      <van-popup
        v-model="showSelect"
        position="left"
        :style="{ height: '100%',width: '70%' }">
        <van-cell title="跳转至PC端" icon="desktop-o" is-link value="" @click="toPC"/>
      </van-popup>
        <!-- 内容显示部分 -->
      <div>
        <div class="sysconter_breadcrumb">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <template v-for=" site in getdirc.allPath">
              <el-breadcrumb-item :key="site.id" >
                <a v-if="getdirc.id !=site.id" @click="getFilesListById(site)">{{site.name}}</a>
                <a v-else >{{site.name}}</a>
                </el-breadcrumb-item>
            </template>
          </el-breadcrumb>
        </div>
        <van-list
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="onLoad"
            >
            <div class="itemlist111" v-for="item in tableData" :key="item.id">
              <van-row gutter="20" type="flex" align="center" v-if="item.type == 'dir'" @click="getOnelist(item)">
                <van-col span="3" >
                  <van-image width="40" height="40" :src="item.imgpath" />
                </van-col>
                <van-col span="20">
                  <div class="">
                    <h3>{{item.name}}</h3>
                    <p>{{item.lastmodifytime}}</p>
                  </div>
                </van-col>
              </van-row>
              <!-- 文件不能操作 -->
              <van-row gutter="20" type="flex" align="center" v-else>
                <van-col span="3" >
                  <van-image width="40" height="40" :src="item.imgpath" />
                </van-col>
                <van-col span="20">
                  <div class="">
                    <h3>{{item.name}}</h3>
                    <p>{{item.lastmodifytime}}</p>
                  </div>
                </van-col>
              </van-row>
            </div>
        </van-list>
      </div>
    </div>
</template>

<script>
export default {
  data () {
    return {
      // 文件列表展示
      tableData: [],
      loading: false,
      finished: false,
      // 获取全部信息
      getdirc: {},
      // 点击头像展示
      showSelect: false,
      // 获取目录查询条件
      directory: {
        pid: ''
      }
    }
  },
  methods: {
    isShowSelect () {
      this.showSelect = true
    },
    onLoad () {
      // 异步更新数据
      // setTimeout 仅做示例，真实场景中一般为 ajax 请求
      // 获取目录和文件
      this.$get('/dircetory/getdirc', this.directory).then(result => {
        console.log('=======>', result)
        if (result.code === 200) {
          this.getdirc = result.data
          this.finished = true
        }
        console.log(this.getdirc)

        // 处理目录数据和文件数据
        const direcProcess = this.getdirc.dirc
        console.log('===>', direcProcess)
        // 2、处理文件
        const fileProcess = this.getdirc.file
        this.dataProcessing(direcProcess, fileProcess)
        console.log('获取文件列表为', this.tableData)
      }).catch((err) => {
        this.$message.error(err.message)
      })
    },
    // 处理文件目录
    dataProcessing (direcProcess, fileProcess) {
      // 1、处理目录
      if (direcProcess != null) {
        for (var i = 0; i < direcProcess.length; i++) {
          // 添加显示图片路径
          var direImgpath = this.getFileImagePath('dir')
          this.$set(direcProcess[i], 'imgpath', direImgpath)
          // 添加显示隐藏条件
          this.$set(direcProcess[i], 'isshow', false)
          this.$set(direcProcess[i], 'ismore', false)

          // 添加到显示板上
          this.tableData.push(direcProcess[i])
        }
      }
      // 2、处理文件
      if (fileProcess != null) {
        for (var num = 0; num < fileProcess.length; num++) {
          var fileImgpath = ''
          var type = fileProcess[num].type
          // 判断类型，查找不出来暂用目录代替
          if (type) {
            if (fileProcess[num].typename === 'picture') {
              fileImgpath = this.getFileImagePath('jpg')
            } else if (fileProcess[num].typename === 'document') {
              fileImgpath = this.getFileImagePath('document')
            } else if (fileProcess[num].typename === 'video') {
              fileImgpath = this.getFileImagePath('video')
            } else if (fileProcess[num].typename === 'music') {
              fileImgpath = this.getFileImagePath('music')
            } else {
              fileImgpath = this.getFileImagePath('unknown')
            }
            //   重置是文件的名字
            fileProcess[num].name = fileProcess[num].name + '.' + type
          } else {
            fileImgpath = this.getFileImagePath('unknown')
          }
          // 添加显示图片路径
          this.$set(fileProcess[num], 'imgpath', fileImgpath)
          // 添加显示隐藏条件
          this.$set(fileProcess[num], 'isshow', false)
          this.$set(fileProcess[num], 'ismore', false)

          // 处理文件大小
          if (fileProcess[num].size / 1024 < 1) {
            fileProcess[num].size = fileProcess[num].size + 'Byte'
          }
          if (fileProcess[num].size / 1024 >= 1 && fileProcess[num].size / 1024 < 1024) {
            fileProcess[num].size = (fileProcess[num].size / 1024).toFixed(2) + 'KB'
          }
          if (fileProcess[num].size / (1024 * 1024) >= 1 && fileProcess[num].size / (1024 * 1024) < 1024) {
            fileProcess[num].size = (fileProcess[num].size / (1024 * 1024)).toFixed(2) + 'MB'
          }
          if (fileProcess[num].size / (1024 * 1024) >= 1024) {
            fileProcess[num].size = (fileProcess[num].size / (1024 * 1024 * 1024)).toFixed(2) + 'GB'
          }
          // 添加到显示板上
          this.tableData.push(fileProcess[num])
        }
      }
    },
    // 处理文件列表图片显示问题
    getFileImagePath (type) {
      const url = ''
      require(['@/assets/images/file/file_' + type + '.png'], function (result) {
        if (result === '') {
          console.log('aaa')
        } else {
          console.log('bbb', result)
        }
      })
      console.log('****************', url)
      return require('@/assets/images/file/file_' + type + '.png')
    },
    // 点击某个目录
    getOnelist (row) {
      console.log(row)
      this.directory.pid = row.id
      this.tableData = []
      this.finished = false
      this.onLoad()
    },
    // 导航栏
    getFilesListById (site) {
      this.directory.pid = site.id
      this.tableData = []
      this.finished = false
      this.onLoad()
    },
    toPC () {
      this.$router.push('/userindex')
    }
  }
}
</script>
<style lang="less" scoped>
.systop{
  height: 60px;
  width: 100%;
  background-color: #F2F6FC;
  display: flex;
  justify-content: center;
  align-items: center;
  .systop_img{
    position: absolute;
    left: 10px;
    top: 10px;
  }
}
.itemlist111 {
   margin:2%;
}
.sysconter_breadcrumb{
  height: 30px;
  margin: 5px 10px;
  display: flex;
  align-items: center;
}
.el-breadcrumb{
  font-size: 14px;
  margin: 0;
  .el-breadcrumb__inner a{
    font-weight: 600;
  }
}
</style>
