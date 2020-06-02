<template>
<!-- <div><el-button @click="testa">按钮</el-button> -->
    <div id="global-uploader">
        <!-- 上传 -->
        <uploader
                ref="uploader"
                :options="options"
                :autoStart="false"
                @file-added="onFileAdded"
                @file-success="onFileSuccess"
                @file-progress="onFileProgress"
                @file-error="onFileError"
                class="uploader-app">
            <uploader-unsupport></uploader-unsupport>

            <uploader-btn id="global-uploader-btn" :attrs="attrs" ref="uploadBtn">选择文件</uploader-btn>

            <uploader-list v-show="panelShow">
                <div class="file-panel" slot-scope="props" :class="{'collapse': collapse}">
                    <div class="file-title">
                        <h2>文件列表</h2>
                        <div class="operate">
                            <el-button @click="fileListShow" type="text" :title="collapse ? '展开':'折叠' ">
                                <i :class="collapse ? 'el-icon-arrow-up': 'el-icon-arrow-down'"></i>
                            </el-button>
                            <el-button @click="close" type="text" title="关闭">
                                <i class="el-icon-close"></i>
                            </el-button>
                        </div>
                    </div>

                    <ul class="file-list">
                        <li v-for="file in props.fileList" :key="file.id">
                            <uploader-file :class="'file_' + file.id" ref="files" :file="file" :list="true"></uploader-file>
                        </li>
                        <div class="no-file" v-if="!props.fileList.length"><i class="iconfont icon-empty-file"></i> 暂无待上传文件</div>
                    </ul>
                </div>
            </uploader-list>

        </uploader>

    </div>
</template>
<script>
import Bus from '../../../js/bus'
import SparkMD5 from 'spark-md5'
import $ from 'jquery'
export default {
  data () {
    return {
      options: {
        target: 'http://localhost:8088/upload/chunkupload',
        chunkSize: '2097152',
        fileParameterName: 'file',
        maxChunkRetries: 3,
        testChunks: true, // 是否开启服务器分片校验
        // 服务器分片校验函数，秒传及断点续传基础
        checkChunkUploadedByResponse: function (chunk, message) {
          console.log('秒传呢', chunk, message)
          const objMessage = JSON.parse(message)
          if (objMessage.data.skipUpload) {
            return true
          }
          return (objMessage.data.uploaded || []).indexOf(chunk.offset + 1) >= 0
        },
        headers: {
          Authorization: this.$store.state.token
        },
        query () {}
      },
      attrs: {
        // accept: ACCEPT_CONFIG.getAll()
      },
      panelShow: false, // 选择文件后，展示上传panel
      collapse: false
    }
  },
  // 注册可以访问父类的方法
  inject: ['getFilesList', 'getStorageSize'],
  mounted () {
    Bus.$on('openUploader', query => {
      this.params = query || {}
      if (this.$refs.uploadBtn) {
        console.log(this.params)
        $('#global-uploader-btn').click()
      }
    })
  },
  computed: {
    // Uploader实例
    uploader () {
      return this.$refs.uploader.uploader
    }
  },

  methods: {
    testa () {
      console.log(this)
      console.log(this.$store.state.uploadInfo)
      this.saveMenuItem('/userindex')
      $('#global-uploader-btn').click()
    },
    // 文件添加时回调
    onFileAdded (file) {
      this.panelShow = true
      this.computeMD5(file)
      Bus.$emit('fileAdded')
    },
    // 上传时回调
    onFileProgress (rootFile, file, chunk) {
      console.log(`上传中 ${file.name}，chunk：${chunk.startByte / 1024 / 1024} ~ ${chunk.endByte / 1024 / 1024}`)
    },
    // 上传成功回调
    onFileSuccess (rootFile, file, response, chunk) {
      console.log('=====================', response)
      const res = JSON.parse(response)
      // 服务器自定义的错误（即虽返回200，但是是错误的情况），这种错误是Uploader无法拦截的
      if (!res.success) {
        this.$message({ message: res.message, type: 'error' })
        // 文件状态设为“失败”
        this.statusSet(file.id, 'failed')
        return
      }
      // 如果服务端返回需要合并
      if (res.data.needMerge) {
        // 文件状态设为“合并中”
        console.log('~~~~~~~~~~~~~~~~', file)
        // 设置传递参数
        this.params.fileName = file.name
        this.params.md5 = file.uniqueIdentifier
        this.params.totalSize = file.size
        console.log(this.params)
        this.statusSet(file.id, 'merging')
        this.$post('/upload/mergefile', this.params).then((result) => {
          // 文件合并成功
          Bus.$emit('fileSuccess')
          this.statusRemove(file.id)
          // 刷新文件列表
          this.getFilesList()
          this.getStorageSize()
        }).catch((err) => {
          this.$message.error(err.message)
        })
      } else {
        // 刷新文件列表
        this.getFilesList()
        this.getStorageSize()
      }
    },
    // 文件上传失败
    onFileError (rootFile, file, response, chunk) {
      console.log('--------------------', response)
      this.$message({
        message: response,
        type: 'error'
      })
    },
    /**
     * 计算md5，实现断点续传及秒传
     * @param file
     */
    computeMD5 (file) {
      const fileReader = new FileReader()
      const time = new Date().getTime()
      const blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice
      let currentChunk = 0
      const chunkSize = 10 * 1024 * 1000
      const chunks = Math.ceil(file.size / chunkSize)
      const spark = new SparkMD5.ArrayBuffer()
      // 文件状态设为"计算MD5"
      this.statusSet(file.id, 'md5')
      file.pause()
      loadNext()
      fileReader.onload = e => {
        spark.append(e.target.result)
        if (currentChunk < chunks) {
          currentChunk++
          loadNext()
          // 实时展示MD5的计算进度
          this.$nextTick(() => {
            $(`.myStatus_${file.id}`).text('校验MD5 ' + ((currentChunk / chunks) * 100).toFixed(0) + '%')
          })
        } else {
          const md5 = spark.end()
          this.computeMD5Success(md5, file)
          console.log(`MD5计算完毕：${file.name} \nMD5：${md5} \n分片：${chunks} 大小:${file.size} 用时：${new Date().getTime() - time} ms`)
        }
      }
      fileReader.onerror = function () {
        this.error(`文件${file.name}读取出错，请检查该文件`)
        file.cancel()
      }
      function loadNext () {
        const start = currentChunk * chunkSize
        const end = ((start + chunkSize) >= file.size) ? file.size : start + chunkSize
        fileReader.readAsArrayBuffer(blobSlice.call(file.file, start, end))
      }
    },
    computeMD5Success (md5, file) {
      // 将自定义参数直接加载uploader实例的opts上
      Object.assign(this.uploader.opts, {
        query: {
          ...this.params
        }
      })
      file.uniqueIdentifier = md5
      file.resume()
      this.statusRemove(file.id)
    },
    fileListShow () {
      const $list = $('#global-uploader .file-list')
      if ($list.is(':visible')) {
        $list.slideUp()
        this.collapse = true
      } else {
        $list.slideDown()
        this.collapse = false
      }
    },
    close () {
      this.uploader.cancel()
      this.panelShow = false
    },
    /**
     * 新增的自定义的状态: 'md5'、'transcoding'、'failed'
     * @param id
     * @param status
     */
    statusSet (id, status) {
      const statusMap = {
        md5: {
          text: '校验MD5',
          bgc: '#fff'
        },
        merging: {
          text: '合并中',
          bgc: '#e2eeff'
        },
        transcoding: {
          text: '转码中',
          bgc: '#e2eeff'
        },
        failed: {
          text: '上传失败',
          bgc: '#e2eeff'
        }
      }
      this.$nextTick(() => {
        $(`<p class="myStatus_${id}"></p>`).appendTo(`.file_${id} .uploader-file-status`).css({
          position: 'absolute',
          top: '0',
          left: '0',
          right: '0',
          bottom: '0',
          zIndex: '1',
          backgroundColor: statusMap[status].bgc
        }).text(statusMap[status].text)
      })
    },
    statusRemove (id) {
      this.$nextTick(() => {
        $(`.myStatus_${id}`).remove()
      })
    },
    error (msg) {
      this.$notify({
        title: '错误',
        message: msg,
        type: 'error',
        duration: 2000
      })
    }
  },
  watch: {},
  destroyed () {
    Bus.$off('openUploader')
  },
  components: {}

}
</script>
<style lang="less" scoped>
// .uploader-example {
//     width: 880px;
//     padding: 15px;
//     margin: 40px auto 0;
//     font-size: 12px;
//     box-shadow: 0 0 10px rgba(0, 0, 0, .4);
//   }
//   .uploader-example .uploader-btn {
//     margin-right: 4px;
//   }
//   .uploader-example .uploader-list {
//     max-height: 440px;
//     overflow: auto;
//     overflow-x: hidden;
//     overflow-y: auto;
//   }

#global-uploader {
        position: fixed;
        z-index: 20;
        right: 15px;
        bottom: 15px;

        .uploader-app {
            width: 540px;
        }
        .file-panel {
            background-color: #fff;
            border: 1px solid #e2e2e2;
            border-radius: 7px 7px 0 0;
            box-shadow: 0 0 10px rgba(0, 0, 0, .2);
            .file-title {
                display: flex;
                height: 40px;
                line-height: 40px;
                padding: 0 15px;
                border-bottom: 1px solid #ddd;
                .operate {
                    flex: 1;
                    text-align: right;
                }
            }
            .file-list {
                position: relative;
                height: 240px;
                overflow-x: hidden;
                overflow-y: auto;
                background-color: #fff;
                > li {
                    background-color: #fff;
                }
            }
            &.collapse {
                .file-title {
                    background-color: #E7ECF2;
                }
            }
        }
        .no-file {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 16px;
        }
        // /deep/.uploader-file-icon {
            // &:before {
            //     content: '' !important;
            // }
            // &[icon=image] {
            //     background: url(../../../assets/images/file/file_jpg.png);
            //     width: 24px;
            // }
            // &[icon=video] {
            //     background: url(../../../assets/images/file/file_video.png);
            // }
            // &[icon=document] {
            //     background: url(../../../assets/images/file/file_txt.png);
            // }
        // }
        /deep/.uploader-file-actions > span {
            margin-right: 6px;
        }
    }
    /* 隐藏上传按钮 */
    #global-uploader-btn {
        position: absolute;
        clip: rect(0, 0, 0, 0);
    }

</style>
