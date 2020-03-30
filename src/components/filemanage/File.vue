<template>
    <div>
         <!-- 导航栏 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>网盘管理</el-breadcrumb-item>
            <el-breadcrumb-item>文件列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片显示内容 -->
        <el-card class="box-card">
             <!-- 搜索区域 -->
            <el-row :gutter="20">
                <el-col :span="9">
                    <el-row>
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" class="input-with-select" clearable>
                        <el-select v-model="queryInfo.filetype" slot="prepend" :clearable="true" placeholder="请选择">
                        <el-option label="图片" value="1"></el-option>
                        <el-option label="文档" value="2"></el-option>
                        <el-option label="视频" value="3"></el-option>
                        <el-option label="音乐" value="4"></el-option>
                        <el-option label="其他" value="5"></el-option>
                        </el-select>
                        <el-button slot="append" icon="el-icon-search" @click="getFilesInfo"></el-button>
                    </el-input>
                    </el-row>
                </el-col>
                <el-col :span="15">
                    <el-button type="primary" @click="batchFileStatusEnable">通过</el-button>
                    <el-button type="danger" @click="batchFileStatusDelete">删除</el-button>
                </el-col>
            </el-row>

            <!-- 文件列表区域 -->
             <el-table :data="tableData" border height='350'  @selection-change="selectAll">
                <el-table-column type="selection" width="40" fixed="left"  ></el-table-column>
                <el-table-column type="index" label="序号" fixed="left" ></el-table-column>
                <el-table-column label="文件id" width="140" prop="fileid" ></el-table-column>
                <el-table-column label="文件名称" width="130" :show-overflow-tooltip="true" prop="filename"></el-table-column>
                <el-table-column label="文件类型" width="100" prop="filetype" ></el-table-column>
                <el-table-column label="原始文件名" width="130" :show-overflow-tooltip="true" prop="originfilename" ></el-table-column>
                <el-table-column label="存放路径" width="150" :show-overflow-tooltip="true" prop="filepath" ></el-table-column>
                <el-table-column label="文件大小" width="100" prop="filesize" ></el-table-column>
                <el-table-column label="所属用户" width="130" prop="account" ></el-table-column>
                <el-table-column label="上传时间" width="150" prop="createtime" ></el-table-column>
                <el-table-column label="下载次数" width="80" prop="downloadnum" ></el-table-column>
                <el-table-column label="是否通过" width="80" prop="filestatus" fixed="right" >
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.filestatus" @change="fileStatusChanged(scope.row)"></el-switch>
                    </template>
                </el-table-column>
                 <el-table-column label="操作"  fixed="right" width="130" >
                     <template slot-scope="scope">
                        <!-- 修改 -->
                        <el-button type="primary" size="mini" icon="el-icon-edit"  ></el-button>
                        <!-- 删除 -->
                        <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeFileById(scope.row.fileid)"></el-button>
                     </template>
                 </el-table-column>
             </el-table>

             <!-- 分页区域 -->
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="queryInfo.pagenum"
              :page-sizes="[1, 2, 5, 10]"
              :page-size="queryInfo.pagesize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total">
            </el-pagination>
        </el-card>
    </div>
</template>

<script>
export default {
  data () {
    return {
      // 获取文件列表参数
      queryInfo: {
        // 搜索文件类型
        filetype: '',
        //   搜索关键字信息
        query: '',
        //   当前页数
        pagenum: 1,
        // 当前每页显示多少条数据
        pagesize: 2
      },
      // 文件信息列表
      tableData: [
        { fileid: 10001, filename: 'java学习', filetype: 'docx', originfilename: 'java开发应用', filepath: '/admin/java开发应用.docx', filesize: 1024, account: 15766936118, createtime: '2020-03-26 12:00:00', downloadnum: 10, filestatus: true },
        { fileid: 10002, filename: 'Vue学习', filetype: 'docx', originfilename: 'Vue开发应用', filepath: '/admin/Vue开发应用.docx', filesize: 1024, account: 15766936118, createtime: '2020-03-26 12:00:00', downloadnum: 9, filestatus: true },
        { fileid: 10003, filename: 'springboot学习', filetype: 'docx', originfilename: 'springboot入门到精通', filepath: '/admin/springboot入门到精通.docx', filesize: 1024, account: 15766936118, createtime: '2020-03-26 12:00:00', downloadnum: 9, filestatus: true }
      ],
      //  总页数
      total: 10,
      //  勾选文件批量操作
      selectionFileInfo: []
    }
  },
  created () {
    this.getFilesInfo()
  },
  methods: {
    // 获取文件信息
    getFilesInfo () {
      console.log('获取文件信息')
      console.log('请求的参数对象', this.queryInfo)
    },
    //   全选触发事件
    selectAll (val) {
      this.selectionFileInfo = val
      console.log(val.length)
    },
    //   监听每页显示多少条的改变事件
    handleSizeChange (newpagesize) {
      console.log(newpagesize)
      this.queryInfo.pagesize = newpagesize
      // 重新获取用户信息
      this.getFilesInfo()
    },
    // 监听页码值的改变事件
    handleCurrentChange (newpagenum) {
      console.log('当前为第', newpagenum, '页')
      this.queryInfo.pagenum = newpagenum
      // 重新获取用户信息
      this.getFilesInfo()
    },
    // 文件审核状态修改
    fileStatusChanged (fileinfo) {
      console.log('当前文件的信息为', fileinfo)
      // 发送请求修改数据
      console.log('发送修改文件审核信息请求')
      // eslint-disable-next-line no-constant-condition
      if (!true) {
        return this.$message.error('更新文件审核状态失败')
      }
      this.$message.success('更新文件审核状态成功')
    },
    // 文件批量审核通过处理
    batchFileStatusEnable () {
      console.log(this.selectionFileInfo)
      if (this.selectionFileInfo.length === 0) {
        return this.$message.info('请选择要通过的文件')
      }
      // 发起批量审核通过的请求
      console.log('发起批量审核通过文件的请求')
      this.$message.success('操作成功')
      //   重新获取文件列表
      this.getFilesInfo()
    },
    // 文件批量审核通删除处理
    batchFileStatusDelete () {
      console.log(this.selectionFileInfo)
      if (this.selectionFileInfo.length === 0) {
        return this.$message.info('请选择要删除的文件')
      }
      // 发起批量审核删除的请求
      console.log('发起批量删除文件的请求')
      this.$message.success('操作成功')
      //   重新获取文件列表
      this.getFilesInfo()
    },
    // 通过id删除文件
    removeFileById (id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        closeOnClickModal: false
      }).then(() => {
        // 调用删除接口
        console.log('调用删除接口，删除参数id为', id)
        // 重新获取用户列表
        console.log('重新获取文件列表')
        this.$message.success('删除成功')
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    }
  }
}
</script>

<style lang="less" scoped>
 .el-select {
    width: 90px;
  }
</style>
