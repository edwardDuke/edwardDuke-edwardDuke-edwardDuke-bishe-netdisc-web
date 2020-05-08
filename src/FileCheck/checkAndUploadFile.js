import Vue from 'vue'
import SparkMD5 from 'spark-md5'

// 获得文件md5
export function getFileMD5 (file, callback) {
  console.log('调用函数getFileMD5')
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
    var readnum = Math.floor((currentChunk / chunks) * 100)
    callback(readnum)
    // 如果文件处理完成计算MD5，如果还有分片继续处理
    if (currentChunk < chunks) {
      loadNext()
    } else {
      callback(spark.end(),readnum)
    }
  }

  // 处理单片文件的上传
  function loadNext () {
    var start = currentChunk * chunkSize
    var end = start + chunkSize >= file.size ? file.size : start + chunkSize

    fileReader.readAsBinaryString(file.slice(start, end))
  }

  loadNext()
}
