<template>
    <div>

      <div class="hello">
        <el-row  class="main-title">
            <!-- 上传-创建文件夹 -->
            <el-col :span="1">
              <el-button>按钮</el-button>
              <!-- <tests></tests> -->
            </el-col>
            <el-col :span="6">
              <el-button @click="uploadall">测试全局上传按钮</el-button>
              <tests></tests>
            </el-col>
        </el-row>
    </div>
    </div>
</template>

<script>
import uploadFile from '../../request/uploadFile.js'
import Bus from '../../js/bus'
import tests from '../file/component/GlobalUploader'
// import { getFileMD5 } from '../../FileCheck/checkAndUploadFile.js'
// const SparkMD5 = require('../../../node_modules/spark-md5/spark-md5.js')
import SparkMD5 from 'spark-md5'
export default {
  data () {
    return {
      fileList: [
        { name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100' },
        { name: 'food2.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100' }
      ],
      headers: { Authorization: this.$store.state.token },
      selectFile: { directoryid: '1231223' },

      fileArr: [],

      drawer: false,
      direction: 'rtl',
      fileslist: ''
    }
  },
  // 注册可以访问父类的方法
  inject: ['saveMenuItem'],
  // 创建该页面自动执行create函数
  created () {
    console.log('分享')
    this.saveMenuItem('/usershare')
  },
  components: {
    tests: tests
  },
  methods: {
    uploadall () {
      console.log(this.$BUS)
      Bus.$emit('openUploader', {
        superiorID: 'this.superiorID',
        abc: 'abc',
        dirId: '123456'
      })
    },

    abcde () {
      // 打开文件选择框
      console.log(this)
      this.$emit('openUploader', {
        id: '1111' // 传入的参数
      })
      console.log(this)
    },

    handleRemove (file, fileList) {
      console.log(file, fileList)
    },
    handlePreview (file) {
      console.log(file)
    },
    handleExceed (files, fileList) {
      this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    beforeRemove (file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    // 文件上传部分
    // 上传前的函数(用于验证上传文件格式及大小)
    beforeUploadFile (file) {
      var chunkSize = 2097152 // Read in chunks of 2MB
      var chunks = Math.ceil(file.size / chunkSize)
      var currentChunk = 0
      var spark = new SparkMD5.ArrayBuffer()
      var fileReader = new FileReader()
      // 数据读取完成时执行的操作
      fileReader.onload = function (e) {
        // console.log('read chunk nr', currentChunk + 1, 'of', chunks);
        spark.append(e.target.result) // Append array buffer
        currentChunk++
        var md5_progress = Math.floor((currentChunk / chunks) * 100)

        console.log(file.name + '  正在处理，请稍等,' + '已完成' + md5_progress + '%')

        if (currentChunk < chunks) {
          loadNext()
        } else {
          var tmp_md5 = spark.end()
          // this.$message.error(tmp_md5)
          console.log(tmp_md5)
        }
      }
      // 读取操作发生错误时触发
      fileReader.onerror = function () {
        console.warn('oops, something went wrong.')
      }
      // 处理单片文件的上传
      function loadNext () {
        var start = currentChunk * chunkSize
        var end = ((start + chunkSize) >= file.size) ? file.size : start + chunkSize
        fileReader.readAsArrayBuffer(file.slice(start, end))
      }
      loadNext()
    },
    beforeRemoveFile (file, fileList) {
      return true
    },
    // 文件上传过程中的函数(在这里获取进度条的进度)
    uploadFileProcess (event, file, fileList) {
      console.log('-----------------------')
      console.log(event, '==', file, '===', fileList)
      console.log('-----------------------')
      this.fileArr = fileList
      this.fileArr.forEach(item => {
        console.log(item)
        console.log('percentage', item.percentage)
        if (item.percentage === 100) {
          console.log('0')
        } else {
          console.log('1')
          item.progressFlag = true
          item.progressPercent = Math.abs(item.percentage.toFixed(0))
        }
      })
    },
    // 文件上传成功的函数(用于文件上传成功之后的逻辑)
    handleFileSuccess (res, file, fileList) {
      console.log('=============')
      console.log(res)
      console.log(file)
      console.log(fileList)
      this.fileArr = fileList
      this.fileArr.forEach((item, index) => {
        item.progressFlag = false
        console.log('item', item)
        if (item.status === 'success') {
          item.successFlag = true
          if (!this.drawer) {
            this.$notify({
              title: '成功',
              message: item.name + '上传成功',
              type: 'success'
            })
          }
        } else {
          item.successFlag = false
        }
      })
    },
    // 删除文件(基于文件列表的数据进行操作)
    removeFile (item, index) {
      console.log(this.$refs, '0123456')
      console.log(this.$refs.upload.abort(item))
      this.fileArr.splice(index, 1)
    },
    // 下载文件(基于文件列表的数据进行操作)
    downLoadFile (item, index) {

    },

    handleClose (done) {
      this.$confirm('确认关闭,后台会继续上传？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    test111 (file) {
      console.log('test1111', file)
      this.getFileMD5(file.file, (filemd5) => {
        console.log('这是自己开的哈哈哈但愿能打印', filemd5)
        file.md5 = filemd5
        // // 用FormData传输文件对象
        // const fd = new FormData()
        // // 设置文件上传接口的需要的参数
        // // 设置上传的当前的文件块
        // fd.append('file', file.file)
        // fd.append('directoryid', file.data.directoryid)
        // const xhr = new XMLHttpRequest()
        // xhr.open('post', file.action, true)
        // xhr.setRequestHeader('Authorization', file.headers.Authorization)
        // xhr.onreadystatechange = function () {
        //   // 上传成功
        //   console.log('上传成功', xhr)
        //   console.log('abc')
        //   if (xhr.readyState === 4 && xhr.status === 200) {
        //     console.log('上传正式成功')
        //   }
        // }
        // // 文件上传进度条
        // xhr.upload.onprogress = function (e) {
        // // 计算上传的进度
        //   console.log('上传进度', e)
        //   console.log(Math.floor((e.loaded / e.total) * 100))
        // // 更新ui
        // }
        // xhr.onerror = xhr.upload.onerror = function () {
        // // 文件上传出错
        //   console.log('上传出错')
        // }
        // // 开始发送
        // xhr.send(fd)

        this.uploadChunk(file, 0)
        // var fileFormData = new FormData()
        // fileFormData.append('file', file.file)
        // fileFormData.append('directoryid','aaa')
        // this.$http.post({
        //   url: '/file/test11',
        //   data: file.data,
        //   headers: file.headers,
        //   fileFormData
        // }).then((result) => {
        // }).catch((err) => {
        // })
        // this.uploadChunk(file, 0, backtopage => {
        //   console.log(backtopage)
        // })
      })
      // this.$refs.upload.submit(file)
      // console.log(this.uploadFile)
      // this.uploadFile(file, (result) => {
      //       // upload-success
      //       result.getFileMD5(file)
      //       // console.log(result)
      //   })
      // console.log('aaa')
    },

    dddd (e) {
      console.log(e.target.files, '1111')
    },
    onChangeUploadFile (file, fileList) {
      console.log('onChangeUploadFile', file)
      console.log('onChangeUploadFile', fileList)
      return false
    },

    getFileMD5 (file, callback) {
      console.log('哈哈哈调用函数getFileMD5')
      // 声明必要的变量
      var fileReader = new FileReader()

      // 文件每块分割2M，计算分割详情
      var chunkSize = 2097152
      var chunks = Math.ceil(file.size / chunkSize)
      var currentChunk = 0

      // 创建md5对象（基于SparkMD5）
      var spark = new SparkMD5()

      // 每块文件读取完毕之后的处理
      fileReader.onload = function (e) {
        // 每块交由sparkMD5进行计算
        spark.appendBinary(e.target.result)
        currentChunk++
        // var readnum = Math.floor((currentChunk / chunks) * 100)
        // 如果文件处理完成计算MD5，如果还有分片继续处理
        if (currentChunk < chunks) {
          loadNext()
        } else {
          callback(spark.end())
        }
      }
      // 处理单片文件的上传
      function loadNext () {
        var start = currentChunk * chunkSize
        var end = start + chunkSize >= file.size ? file.size : start + chunkSize
        fileReader.readAsBinaryString(file.slice(start, end))
      }
      loadNext()
    },

    // currentChunk为上传文件块的索引
    uploadChunk (all, currentChunk, backtopage) {
      console.log('1213')
      var file = all.file
      var fileReader = new FileReader()
      // 上传文件块的大小，可自定义
      var chunkSize = 2097152
      // 计算改文件的可分为多少块
      var chunks = Math.ceil(file.size / chunkSize)

      // 文件切割后的回调，this.result为切割的文件块
      fileReader.onload = function (e) {
        console.log(e)
        // 用FormData传输文件对象
        let fd = new FormData()
        // 设置文件上传接口的需要的参数
        fd.append('identifier', all.md5)
        fd.append('chunks', chunks)
        fd.append('chunksize', chunkSize)
        fd.append('chunkNumber', currentChunk)
        // 设置上传的当前的文件块
        fd.append('file', new Blob([this.result]))
        fd.append('directoryid', all.data.directoryid)
        let xhr = new XMLHttpRequest()
        xhr.open('post', all.action, true)
        xhr.setRequestHeader('Authorization', all.headers.Authorization)
        xhr.onreadystatechange = function () {
        // 上传成功
          console.log('abc')
          if (xhr.readyState == 4 && xhr.status == 200) {
            console.log(currentChunk)
            currentChunk++
            if (currentChunk < chunks) {
              loadNext() // 继续切割下一块文件
            } else {
            // 文件上传成功
              console.log('上传成功了哦')
              backtopage && backtopage()
            }
            xhr = null
            return
          }
          if (xhr.readyState == 4 && xhr.status == 500) {
          // 文件上传出错
          }
        }
        // 文件上传进度条
        xhr.upload.onprogress = function (e) {
        // 计算上传的进度
          const progress = parseInt((e.loaded + currentChunk * chunkSize) / file.size * 100)
        // 更新ui
        }
        xhr.onerror = xhr.upload.onerror = function () {
        // 文件上传出错
        }
        // 开始发送
        xhr.send(fd)
        fd = null
      }

      // 处理单片文件的上传
      function loadNext () {
        console.log('调用单片文件的上传函数loadNext')
        // 查询后台判断当前块文件有没有上传，如果已经上传则不需要上传，继续读取下一块
        // that.handleAjax('api/common/file/checkChunk', { md5: upload.md5, chunk: currentChunk }, res => {
        // 后台返回没有上传过
        // if (res.data === false) {
        // 计算切割文件的开始索引和结束索引
        var start = currentChunk * chunkSize
        var end = Math.min(start + chunkSize, file.size)
        // 切割文件并触发fileReader.onload
        fileReader.readAsArrayBuffer(file.slice(start, end))
        // 后台返回此块已经上传过，递归调用loadNext，继续判断下一块文件块
        // } else {
        //   currentChunk++
        //   if (currentChunk < chunks) {
        //     loadNext()
        //   }
        // }
        // }, err => {
        // 文件上传出错
        // })
      }
      // 触发文件第一块上传
      loadNext()
    },

    abcde (e) {
      console.log(e)
      console.log(this.fileArr)
    },
    bbbbb () {
      this.$refs.upload.submit()
    }

  }
}
</script>

<style lang="less" scoped>

  .show-upload-file {
    display: flex;
    flex-flow: column;

  }
  .bg {
    width: 80%;
    display:inline-block;
    // color: red;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
  .bgg {
    position: absolute;
    right: 0;
    margin: 0 10px;
  }

// 去除drawer标题出现蓝色框
  /deep/ :focus{
    outline:0;
  }

</style>
