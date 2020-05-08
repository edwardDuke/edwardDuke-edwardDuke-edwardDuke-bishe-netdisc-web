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
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" class="input-with-select" clearable @clear="getFilesInfo">
                        <el-select v-model="queryInfo.filetype" slot="prepend" :clearable="true" @change="getFilesInfo" placeholder="请选择">
                        <el-option label="图片" value="picture"></el-option>
                        <el-option label="文档" value="document"></el-option>
                        <el-option label="视频" value="video"></el-option>
                        <el-option label="音乐" value="music"></el-option>
                        <el-option label="其他" value="other"></el-option>
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
            <el-row :gutter="10">
              <el-col :span="3" >
                  <el-input class="treeinput"
                    placeholder="用户过滤"
                    v-model="filterText" :clearable="true">
                  </el-input>
                  <el-scrollbar style="height: 100%;" >
                    <div class="test1">
                      <el-tree
                        :data="treeData.userList"
                        :props="treeData.defaultProps"
                        default-expand-all
                        :filter-node-method="filterNode"
                        :accordion= "true"
                        :highlight-current= "true"
                        @node-click="treeClick"
                        @node-expand="treeNodeOpen"
                        @node-collapse="treeNodeClose"
                        ref="tree">
                      </el-tree>
                    </div>
                  </el-scrollbar>
              </el-col>

              <!-- 文件列表区域 -->
              <el-col :span="21">
                <el-table :data="tableData" border height='350'  @selection-change="selectAll">
                    <el-table-column type="selection" width="40" fixed="left"  ></el-table-column>
                    <el-table-column type="index" label="序号" fixed="left" ></el-table-column>
                    <!-- <el-table-column label="文件id" width="140" prop="id" ></el-table-column> -->
                    <el-table-column label="文件名称" width="130" :show-overflow-tooltip="true" prop="filename"></el-table-column>
                    <el-table-column label="文件类型" width="100" prop="type" ></el-table-column>
                    <!-- <el-table-column label="原始文件名" width="130" :show-overflow-tooltip="true" prop="originfilename" ></el-table-column> -->
                    <el-table-column label="存放路径" width="150" :show-overflow-tooltip="true" prop="filepath" ></el-table-column>
                    <el-table-column label="文件大小" width="100" prop="filesize" ></el-table-column>
                    <el-table-column label="所属用户" width="130" prop="user" ></el-table-column>
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
                            <el-button type="primary" size="mini" icon="el-icon-edit" @click="showEditFile(scope.row.id)"  ></el-button>
                            <!-- 删除 -->
                            <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeFileById(scope.row)"></el-button>
                        </template>
                    </el-table-column>
                </el-table>
              </el-col>
            </el-row>

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

        <!-- 修改文件对话框 -->
        <el-dialog
          title="修改文件"
          :visible.sync="editFileVisible"
          :close-on-click-modal="false"
          width="40%" @close="editFileClose">
          <el-form :model="editFileInfo" :rules="editFileFromRules" ref="editFileFromRef" label-width="100px" size="mini">
            <el-form-item label="文件名" prop="filename">
              <el-input v-model="editFileInfo.filename"></el-input>
            </el-form-item>
            <el-form-item label="下载次数" prop="downloadnum">
              <el-input v-model="editFileInfo.downloadnum"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="editFileVisible = false">取 消</el-button>
            <el-button type="primary" @click="editFile">确 定</el-button>
          </span>
        </el-dialog>
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
        pagesize: 2,
        // 当前选择的用户id
        userid: ''

      },
      // 文件信息列表
      tableData: [
        { fileid: 10001, filename: 'java学习', filetype: 'docx', originfilename: 'java开发应用', filepath: '/admin/java开发应用.docx', filesize: 1024, account: 15766936118, createtime: '2020-03-26 12:00:00', downloadnum: 10, filestatus: true },
        { fileid: 10002, filename: 'Vue学习', filetype: 'docx', originfilename: 'Vue开发应用', filepath: '/admin/Vue开发应用.docx', filesize: 1024, account: 15766936118, createtime: '2020-03-26 12:00:00', downloadnum: 9, filestatus: true },
        { fileid: 10003, filename: 'springboot学习', filetype: 'docx', originfilename: 'springboot入门到精通', filepath: '/admin/springboot入门到精通.docx', filesize: 1024, account: 15766936118, createtime: '2020-03-26 12:00:00', downloadnum: 9, filestatus: true },
        { fileid: 10001, filename: 'java学习', filetype: 'docx', originfilename: 'java开发应用', filepath: '/admin/java开发应用.docx', filesize: 1024, account: 15766936118, createtime: '2020-03-26 12:00:00', downloadnum: 10, filestatus: true },
        { fileid: 10002, filename: 'Vue学习', filetype: 'docx', originfilename: 'Vue开发应用', filepath: '/admin/Vue开发应用.docx', filesize: 1024, account: 15766936118, createtime: '2020-03-26 12:00:00', downloadnum: 9, filestatus: true },
        { fileid: 10003, filename: 'springboot学习', filetype: 'docx', originfilename: 'springboot入门到精通', filepath: '/admin/springboot入门到精通.docx', filesize: 1024, account: 15766936118, createtime: '2020-03-26 12:00:00', downloadnum: 9, filestatus: true },
        { fileid: 10001, filename: 'java学习', filetype: 'docx', originfilename: 'java开发应用', filepath: '/admin/java开发应用.docx', filesize: 1024, account: 15766936118, createtime: '2020-03-26 12:00:00', downloadnum: 10, filestatus: true },
        { fileid: 10002, filename: 'Vue学习', filetype: 'docx', originfilename: 'Vue开发应用', filepath: '/admin/Vue开发应用.docx', filesize: 1024, account: 15766936118, createtime: '2020-03-26 12:00:00', downloadnum: 9, filestatus: true },
        { fileid: 10003, filename: 'springboot学习', filetype: 'docx', originfilename: 'springboot入门到精通', filepath: '/admin/springboot入门到精通.docx', filesize: 1024, account: 15766936118, createtime: '2020-03-26 12:00:00', downloadnum: 9, filestatus: true },
        { fileid: 10001, filename: 'java学习', filetype: 'docx', originfilename: 'java开发应用', filepath: '/admin/java开发应用.docx', filesize: 1024, account: 15766936118, createtime: '2020-03-26 12:00:00', downloadnum: 10, filestatus: true },
        { fileid: 10002, filename: 'Vue学习', filetype: 'docx', originfilename: 'Vue开发应用', filepath: '/admin/Vue开发应用.docx', filesize: 1024, account: 15766936118, createtime: '2020-03-26 12:00:00', downloadnum: 9, filestatus: true },
        { fileid: 10003, filename: 'springboot学习', filetype: 'docx', originfilename: 'springboot入门到精通', filepath: '/admin/springboot入门到精通.docx', filesize: 1024, account: 15766936118, createtime: '2020-03-26 12:00:00', downloadnum: 9, filestatus: true },
        { fileid: 10001, filename: 'java学习', filetype: 'docx', originfilename: 'java开发应用', filepath: '/admin/java开发应用.docx', filesize: 1024, account: 15766936118, createtime: '2020-03-26 12:00:00', downloadnum: 10, filestatus: true },
        { fileid: 10002, filename: 'Vue学习', filetype: 'docx', originfilename: 'Vue开发应用', filepath: '/admin/Vue开发应用.docx', filesize: 1024, account: 15766936118, createtime: '2020-03-26 12:00:00', downloadnum: 9, filestatus: true },
        { fileid: 10003, filename: 'springboot学习', filetype: 'docx', originfilename: 'springboot入门到精通', filepath: '/admin/springboot入门到精通.docx', filesize: 1024, account: 15766936118, createtime: '2020-03-26 12:00:00', downloadnum: 9, filestatus: true }
      ],
      //  总页数
      total: 10,
      //  勾选文件批量操作
      selectionFileInfo: [],
      // 树形测试
      filterText: '',
      treeData: {
        isUserType: '',
        userList: [
          {
            id: '',
            name: '全部用户',
            children: [
              {
                id: 4,
                name: '普通用户',
                children: [
                  {
                    id: 9,
                    name: '普通 1-1-'
                  },
                  {
                    id: 10,
                    name: '普通 1-1-111111'
                  }
                ]
              },
              {
                id: 10,
                name: '付费用户',
                children: [
                  {
                    id: 9,
                    name: '付费 1-1-100'
                  },
                  {
                    id: 10,
                    name: '付费 1-1-111'
                  }
                ]
              }
            ]
          }
        ],
        defaultProps: {
          children: 'children',
          label: 'name'
        }
      },

      // 编辑文件对话框显示
      editFileVisible: false,
      // 获取文件编辑的信息
      editFileInfo: {
        id: '0001',
        filename: '15766936118',
        downloadnum: 0
      },
      // 编辑文件表单的验证规则
      editFileFromRules: {
        filename: [
          { required: true, message: '请输入文件名', trigger: 'blur' }
        ]
      }

    }
  },
  // 注册可以访问父类的方法
  inject: ['saveMenuItem'],
  created () {
    this.saveMenuItem('/files')
    this.getFilesInfo()
    this.getAllUser()
  },
  watch: {
    filterText (val) {
      console.log(val, 'aaaa')
      this.$refs.tree.filter(val)
    }
  },
  methods: {
    // 获取文件信息
    getFilesInfo () {
      console.log('获取文件信息')
      console.log('请求的参数对象', this.queryInfo)
      // 发起请求
      this.$post('/file/queryfiles', this.queryInfo).then((result) => {
        console.log('发起获取文件列表，返回值', result)
        if (result.code === 200) {
          // 获取总条数
          this.total = result.data.total
          // 对获取的文件进行处理
          var fileList = result.data.file
          for (var index in fileList) {
            if (fileList[index].filesize / 1024 < 1) {
              fileList[index].filesize = fileList[index].filesize + 'Byte'
            } else if (fileList[index].filesize / 1024 >= 1 && fileList[index].filesize / 1024 < 1024) {
              fileList[index].filesize = (fileList[index].filesize / 1024).toFixed(2) + 'KB'
            } else if (fileList[index].filesize / (1024 * 1024) >= 1 && fileList[index].filesize / (1024 * 1024) < 1024) {
              fileList[index].filesize = (fileList[index].filesize / (1024 * 1024)).toFixed(2) + 'MB'
            } else {
              fileList[index].filesize = (fileList[index].filesize / (1024 * 1024)).toFixed(2) + 'GB'
            }
            if (fileList[index].filestatus === 'enable') {
              fileList[index].filestatus = true
            } else {
              fileList[index].filestatus = false
            }
          }
          console.log('处理后的', fileList)
          this.tableData = fileList
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    // 获取全部用户列表
    getAllUser () {
      this.$get('/user/all').then((result) => {
        console.log('获取全部用户列表', result)
        if (result.code === 200) {
          this.treeData.userList = result.data
        }
      }).catch((err) => {
        console.log('获取全部用户列表请求失败', err)
      })
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
      var data = {}
      data.id = fileinfo.id
      if (fileinfo.filestatus) {
        data.filestatus = 'enable'
      } else {
        data.filestatus = 'disable'
      }
      console.log('发送修改文件审核信息请求')
      this.$post('/file/reviewfile', data).then((result) => {
        if (result.code === 200) {
          this.$message.success('更新文件审核状态成功')
        }
      }).catch((err) => {
        console.log('请求失败', err)
        return this.$message.error(err.message)
      })
    },
    // 文件批量审核通过处理
    batchFileStatusEnable () {
      console.log(this.selectionFileInfo)
      if (this.selectionFileInfo.length === 0) {
        return this.$message.info('请选择要通过的文件')
      }
      // 发起批量审核通过的请求
      var data = {}
      var idList = []
      for (var index in this.selectionFileInfo) {
        idList.push(this.selectionFileInfo[index].id)
      }
      data.id = idList.join(',')
      data.filestatus = 'enable'
      console.log('发起批量审核通过文件的请求')
      this.$post('/file/reviewfile', data).then((result) => {
        if (result.code === 200) {
          this.$message.success('更新文件审核状态成功')
          //   重新获取文件列表
          this.getFilesInfo()
        }
      }).catch((err) => {
        console.log('请求失败', err)
        return this.$message.error(err.message)
      })
    },
    // 文件批量审核通删除处理
    batchFileStatusDelete () {
      console.log(this.selectionFileInfo)
      if (this.selectionFileInfo.length === 0) {
        return this.$message.info('请选择要删除的文件')
      }
      // 发起批量审核通过的请求
      var data = {}
      var idList = []
      var name = []
      for (var index in this.selectionFileInfo) {
        idList.push(this.selectionFileInfo[index].id)
        name.push(this.selectionFileInfo[index].filename)
      }
      data.id = idList.join(',')

      this.$confirm('此操作将永久删除文件：' + name.join(',') + '，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        closeOnClickModal: false
      }).then(() => {
        // 调用删除接口
        console.log('调用删除接口，删除参数id为', data)
        this.$get('/file/deletefile', data).then((result) => {
          if (result.code === 200) {
            // 重新获取用户列表
            this.$message.success('删除成功')
            console.log('重新获取文件列表')
            this.getFilesInfo()
          }
        }).catch((err) => {
          console.log('请求失败', err)
          this.$message.error(err.message)
        })
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    },
    // 通过id删除文件
    removeFileById (file) {
      this.$confirm('此操作将永久删除文件：' + file.filename + '，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        closeOnClickModal: false
      }).then(() => {
        // 调用删除接口
        console.log('调用删除接口，删除参数id为', file)
        this.$get('file/deletefile', { id: file.id }).then((result) => {
          if (result.code === 200) {
            // 重新获取用户列表
            this.$message.success('删除成功')
            console.log('重新获取文件列表')
            this.getFilesInfo()
          }
        }).catch((err) => {
          console.log('请求失败', err)
          this.$message.error(err.message)
        })
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    },

    // 用户过滤
    filterNode (value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },

    // 点击树节触发事件
    treeClick (data, node) {
      if (this.treeData.isUserType) {
        this.treeData.isUserType = false
        return
      }
      this.queryInfo.userid = data.id
      console.log(data, 'aaaaaa', node)
      // 获取文件列表
      this.getFilesInfo()
    },
    // 打开节点树触发事件
    treeNodeOpen (data, node) {
      this.treeData.isUserType = true
      var userid = []
      if (data.id === '') {
        this.queryInfo.userid = ''
      } else {
        for (var index in data.children) {
          userid.push(data.children[index].id)
        }
        this.queryInfo.userid = userid.join(',')
      }
      console.log(data, 'bbbbbb', node)
      this.getFilesInfo()
    },
    // 关闭节点树触发事件
    treeNodeClose (data, node) {
      this.treeData.isUserType = true
      var userid = []
      if (data.id === '') {
        this.queryInfo.userid = ''
      } else {
        for (var index in data.children) {
          userid.push(data.children[index].id)
        }
        this.queryInfo.userid = userid.join(',')
      }

      console.log(data, 'cccccc', node)
      this.getFilesInfo()
    },
    // 展示文件编辑对话框
    async showEditFile (id) {
      console.log('点击了id为', id, '的编辑信息')
      console.log('通过id获取要编辑的文件信息')
      this.$get('/file/getfileone/' + id).then((result) => {
        console.log('请求成功', result)
        if (result.code === 200) {
          this.editFileInfo = result.data
          this.editFileVisible = true
        }
      }).catch((err) => {
        console.log('请求失败', err)
      })
    },
    // 监听编辑用户关闭，并重置当前表单
    editFileClose () {
      this.$refs.editFileFromRef.resetFields()
      this.editFileInfo = {}
    },
    // 修改用户信息提交
    editFile () {
      this.$refs.editFileFromRef.validate(async valid => {
        console.log(valid)
        if (!valid) return
        // 调用修改接口
        console.log('调用修改用户接口', this.editFileInfo)
        this.$post('/file/admin/edit', this.editFileInfo).then((result) => {
          if (result.code === 200) {
            // 隐藏对话框
            this.editFileVisible = false
            // 重新刷新用户列表
            console.log('重新获取用户列表')
            this.getFilesInfo()
            // 弹窗修改成功
            this.$message.success('修改用户成功')
          }
        }).catch((err) => {
          console.log('请求失败', err)
          this.$message.error(err.message)
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
 .el-select {
    width: 90px;
  }
  .treeinput {
    margin: 15px 0;
  }
  .test1 {
      height: 280px;
  }
  .el-tree {
    // height: 280px;
    display: inline-block;
  }
  // .el-scrollbar .el-scrollbar__wrap {overflow-x: hidden;}

</style>
