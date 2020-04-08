<template>
  <el-container class="home-container">
    <!-- 侧边栏部分 -->
    <el-aside width="185px">
      <!-- 侧边栏上半部分 -->
      <el-menu
        default-active="1"
        background-color="#f7f7f7"
        text-color="#666666"
        active-text-color="#09aaff"
        @select="searchByindex">
        <el-menu-item index="1">
          <i class="el-icon-document-copy"></i>
          <span>全部文件</span>
        </el-menu-item>
        <el-menu-item index="2"><i ></i><span class="menu-title">图片</span></el-menu-item>
        <el-menu-item index="3"><span class="menu-title">文档</span></el-menu-item>
        <el-menu-item index="4"><span class="menu-title">视频</span></el-menu-item>
        <el-menu-item index="5"><span class="menu-title">音乐</span></el-menu-item>
        <el-menu-item index="6"><span class="menu-title">其他</span></el-menu-item>
      </el-menu>
      <!-- 侧边栏下半部分 -->
      <div>
        <div class="schedule">
          <el-progress :percentage="10" color="#6f7ad3" :show-text="false"></el-progress>
          <!-- <el-progress type="dashboard" percentage="10" width="100" :show-text="false" color="#6f7ad3"></el-progress> -->
          <span>容量：10G/100G</span>
        </div>
      </div>
    </el-aside>
    <!-- 主题部分 -->
    <el-main>
      <!-- 头部上传-创建-按钮-搜索 点击显示的按钮组 -->
      <el-row type="flex" justify="space-between" class="main-title">
        <!-- 上传-创建文件夹 -->
        <el-col :span="6">
          <!-- 上传 -->
          <el-upload
            class="upload-demo"
            action="https://jsonplaceholder.typicode.com/posts/"
            :data="uploadFileinfo"
            :show-file-list="false"
            multiple
            :before-upload="beforeUploadFile"
            >
            <el-button type="primary" size="medium"><i class="el-icon-upload2 el-icon--left"></i>上传</el-button>
          </el-upload>
          <!-- 新建文件夹 -->
          <el-button plain size="medium" @click="showNewFolder"><i class="el-icon-folder-add el-icon--left"></i>新建文件夹</el-button>
        </el-col>
        <!-- 更多操作-下载-删除-重命名-移动到-复制到 -->
        <el-col :span="12" >
          <el-button-group v-if="oneOrMoreShowmore.isshow">
            <el-button size="medium" icon="el-icon-share" @click="shareOneOrMoreFile">分享</el-button>
            <el-button size="medium" icon="el-icon-edit" @click="downloadOneOrMoreFile">下载</el-button>
            <el-button size="medium" icon="el-icon-delete" @click="deleteOneOrMoreFile">删除</el-button>
            <el-button size="medium" :disabled="!oneOrMoreShowmore.isOneFile" @click="showRenameFolder">重命名</el-button>
            <el-button size="medium" @click="copyFileFolder('more')">复制到</el-button>
            <el-button size="medium" @click="moveFileFolder('more')">移动到</el-button>
          </el-button-group>
        </el-col>
        <!-- 搜索框 -->
        <el-col :span="6">
          <el-input
            placeholder="搜索文件"
            v-model="showFilesCondition.inputSearch"
            size="small"
            clearable>
            <!-- <i slot="prefix" class="el-input__icon el-icon-search"></i> -->
            <el-button slot="append" icon="el-icon-search" @click="getFilesInfo"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 文件导航面包屑 -->
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><a href="/">全部文件</a></el-breadcrumb-item>
        <el-breadcrumb-item><a href="/">目录1</a></el-breadcrumb-item>
        <el-breadcrumb-item><a href="/">目录2</a></el-breadcrumb-item>
      </el-breadcrumb>
      <!-- 文件列表显示 -->
      <el-table
        :data="tableData"
        @cell-mouse-enter="mouseInfile"
        @cell-mouse-leave="mouseOutfile"
        @selection-change="multipleChoice"
        style="width: 100%"
        max-height="480">
        <!-- 多选框 -->
        <el-table-column type="selection" width="35"></el-table-column>
        <!-- 文件名 -->
        <el-table-column  prop="filename" label="文件名" width="600">
          <template slot-scope="scope">
            <el-link :underline="false" @click="getFilesListById(scope.row)">
              <div class="file-name">
                <img :src="scope.row.imgpath" style="max-width: 30px;" />
                <span>{{scope.row.filename}}</span>
              </div>
            </el-link>
          </template>
        </el-table-column>
        <!-- 文件操作 -->
        <el-table-column  width="200">
          <!-- 文件显示操作 -->
          <template slot-scope="scope" v-if="scope.row.isshow && oneOrMoreShowmore.isOneFile">
            <!-- 分享图标 -->
            <el-tooltip content="分享" :enterable="false" effect="light">
              <el-link class="file-operating" :underline="false" @click="shareOneFile(scope.row)"><i class="el-icon-share"></i></el-link>
            </el-tooltip>
            <!--下载图标  -->
            <el-tooltip content="下载" :enterable="false" effect="light">
              <el-link class="file-operating" :underline="false" @click="downloadOneFile(scope.row)" ><i class="el-icon-download"></i></el-link>
            </el-tooltip>
            <!-- 更多图标 -->
            <el-dropdown @visible-change="mouseInfileMore(scope.row)" @command="multipleDropdown">
              <el-link class="file-operating" :underline="false"><i class="el-icon-more"></i></el-link>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="move">移动到</el-dropdown-item>
                <el-dropdown-item command="copy">复制到</el-dropdown-item>
                <el-dropdown-item command="rename">重命名</el-dropdown-item>
                <el-dropdown-item command="delete">删除</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
          <el-table-column prop="size" label="大小" ></el-table-column>
          <el-table-column prop="date" label="修改日期" width="200"></el-table-column>
      </el-table>
    </el-main>

    <!-- 新建文件对话框 -->
    <el-dialog
      title="新建文件"
      :visible.sync="dialogBox.newFolderVisible"
      :close-on-click-modal="false"
      width="50%" @close="newFolderClose">
      <el-form :model="dialogBox.newFolderFrom" :rules="dialogBox.newFolderFromRules" ref="newFolderFromRef" label-width="80px">
          <el-form-item label="文件名" prop="filename">
              <el-input v-model="dialogBox.newFolderFrom.filename"></el-input>
          </el-form-item>
      </el-form>
      <span slot="footer">
          <el-button @click="dialogBox.newFolderVisible = false">取 消</el-button>
          <el-button type="primary" @click="newFolder">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 重命名 -->
    <el-dialog
      title="重命名"
      :visible.sync="dialogBox.renameFolderVisible"
      :close-on-click-modal="false"
      width="50%" @close="renameFolderClose">
      <el-form :model="dialogBox.renameFolderFrom" :rules="dialogBox.renameFolderFromRules" ref="renameFolderFromRef" label-width="80px">
          <el-form-item label="文件名" prop="filename">
              <el-input v-model="dialogBox.renameFolderFrom.filename"></el-input>
          </el-form-item>
      </el-form>
      <span slot="footer">
          <el-button @click="dialogBox.renameFolderVisible = false">取 消</el-button>
          <el-button type="primary" @click="renameFolder">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 移动到对话框 -->
    <el-dialog
      title="移动到"
      :visible.sync="dialogBox.moveFileVisible"
      :close-on-click-modal="false"
      width="50%" @close="moveFileClose">
        <el-tree :data="dialogBox.copyandmoveData" :props="dialogBox.copyandmoveProps" @node-click="moveFileClick"></el-tree>
        <span slot="footer">
            <el-button @click="dialogBox.moveFileVisible = false">取 消</el-button>
            <el-button type="primary" @click="moveFile">确 定</el-button>
        </span>
    </el-dialog>

    <!-- 复制到对话框 -->
    <el-dialog
      title="复制到"
      :visible.sync="dialogBox.copyFileVisible"
      :close-on-click-modal="false"
      width="50%" @close="copyFileClose">
        <el-tree :data="dialogBox.copyandmoveData" :props="dialogBox.copyandmoveProps" @node-click="copyFileClick"></el-tree>
        <span slot="footer">
            <el-button @click="dialogBox.copyFileVisible = false">取 消</el-button>
            <el-button type="primary" @click="copyFile">确 定</el-button>
        </span>
    </el-dialog>
  </el-container>
</template>

<script>
export default {
  data () {
    return {
      // 上传文件携带的参数
      uploadFileinfo: {
        id: '111'
      },
      // 对话框数据
      dialogBox: {
        // 对话框是否展示
        // isdialogBox: false,

        // 对话框来自单个文件还是多个文件
        fromSingleOrMul: '',

        // 新建文件对话框显示
        newFolderVisible: false,
        // 新建文件表单数据
        newFolderFrom: {
          filename: ''
        },
        // 新建文件表单的验证规则
        newFolderFromRules: {
          filename: [
            { required: true, message: '请输入文件名称', trigger: 'blur' }
          ]
        },

        // 重命名对话框显示
        renameFolderVisible: false,
        // 重命名表单数据
        renameFolderFrom: {
          filename: ''
        },
        // 重命名表单的验证规则
        renameFolderFromRules: {
          filename: [
            { required: true, message: '请输入文件名称', trigger: 'blur' }
          ]
        },

        // 显示复制到和移动到共同的数据
        copyandmoveData: [
          {
            id: '111111',
            foldername: '一级 1',
            children: [{
              foldername: '二级 1-1',
              children: [{
                foldername: '三级 1-1-1',
                children: [{
                  foldername: '四级 1-1-1'
                }]
              }]
            }]
          }
        ],
        // 显示复制到和移动到共同的下标
        copyandmoveProps: {
          children: 'children',
          label: 'foldername'
        },
        // 选中的当前目录数据
        selectedDirecData: [],

        // 移动到对话框显示
        moveFileVisible: false,
        // 复制到对话框显示
        copyFileVisible: false
      },
      // 这个是查询文件条件信息
      showFilesCondition: {
        inputSearch: ''
      },
      // 这是演示最初的文件列表信息
      endFileLists: [
        { filename: '目录1', size: '-', date: '2020-4-4 12:00:00' },
        { filename: '目录2', size: '-', date: '2020-4-4 12:00:00' },
        { filename: '目录3', size: '-', date: '2020-4-4 12:00:00' },
        { filename: '目录4', size: '-', date: '2020-4-4 12:00:00' },
        { filename: '目录5', size: '-', date: '2020-4-4 12:00:00' },
        { filename: '目录6', size: '-', date: '2020-4-4 12:00:00' },
        { filename: '目录7', size: '-', date: '2020-4-4 12:00:00' },
        { filename: '目录8', size: '-', date: '2020-4-4 12:00:00' },
        { filename: '文件1', filetype: 'zip', size: '4.8KB', date: '2020-4-4 12:00:00' },
        { filename: '文件2', filetype: 'txt', size: '54.9M', date: '2020-4-4 12:00:00' }
      ],
      // 这是处理过后的文件列表信息
      tableData: [],
      oneShowmore: [],
      // 单个或者多=>下载-删除-重命名-复制到..
      oneOrMoreShowmore: {
        isshow: false,
        isOneFile: true,
        data: []
      }
    }
  },
  // 注册可以访问父类的方法
  inject: ['saveMenuItem'],
  // 创建该页面自动执行create函数
  created () {
    this.saveMenuItem('/userindex')
    // 从后台获取文件列表信息
    this.getFilesList()
  },
  methods: {

    // 获取文件信息
    getFilesList () {
      // 1、发送请求获取后端数据
      // 2、处理数据
      const temData = this.endFileLists

      // var newFileListInfo = []
      for (var i = 0; i < temData.length; i++) {
        var imgpath = ''
        var type = temData[i].filetype
        // 判断类型
        if (type) {
          imgpath = this.getFileImagePath(type)
          //   重置是文件的名字
          temData[i].filename = temData[i].filename + '.' + type
        } else {
          imgpath = this.getFileImagePath('dir')
        }
        // var dataMap = temData[i]
        this.$set(temData[i], 'imgpath', imgpath)
        // temData[i].imgpath = imgpath
        // 添加显示条件
        this.$set(temData[i], 'isshow', false)
        this.$set(temData[i], 'ismore', false)
        temData[i].isshow = false
        temData[i].ismore = false
        // newFileListInfo.push(dataMap)
      }

      this.tableData = temData
      console.log('获取文件列表为', this.tableData)
    },
    // 获取某个文件列表
    getFilesListById (filesInfo) {
      console.log('点击了某个文件，文件名为', filesInfo.filename)
    },
    // 处理文件列表图片显示问题
    getFileImagePath (type) {
      return require('@/assets/images/file/file_' + type + '.png')
    },
    // 左边菜单栏按类型搜索文件
    searchByindex (index) {
      this.$message.info(index)
    },
    // 按内容搜索文件
    getFilesInfo () {
      console.log('点击了搜索')
      // this.$message.info(this.showFilesCondition)
      this.getFilesList()
    },
    // 当鼠标移入一个文件的时候触发显示操作
    mouseInfile (row, column, cell, event) {
      row.isshow = true
      // console.log('鼠标移入isshow', row, '1')
    },
    // 当鼠标移出一个文件的时候触发隐藏操作
    mouseOutfile (row, column, cell, event) {
      //   判断对操作是某移入到更多操作，是则显示操作
      // console.log('鼠标移出isshow：', row.isshow, 'ismore:', row.ismore)
      if (!row.ismore) {
        row.isshow = false
      }
    },
    // 当鼠标移入或移出到更多操作时触发事件，用于控制显示操作
    mouseInfileMore (row) {
      // 鼠标进入更多操作则显示，否则不显示
      if (!row.ismore) {
        row.isshow = true
        row.ismore = true
        this.oneShowmore = row
        console.log('鼠标在更多操作，进入', this.oneShowmore)
      } else {
        row.isshow = false
        row.ismore = false
        // this.oneShowmore = []
        console.log('鼠标在更多操作，出去', this.oneShowmore)
      }
      // row.ismore = !row.ismore
    },
    // 点击文件进行单选多选或取消单选多选时触发的事件
    multipleChoice (selection) {
      // this.showmore.isshow = !this.showmore.isshow
      if (selection.length === 0) {
        console.log('0')
        this.oneOrMoreShowmore.isshow = false
        this.oneOrMoreShowmore.isOneFile = true
        // this.showmore.data = []
      } else if (selection.length === 1) {
        console.log('1')
        this.oneOrMoreShowmore.isshow = true
        this.oneOrMoreShowmore.isOneFile = true
        // this.showmore.data = selection
      } else {
        console.log('more')
        this.oneOrMoreShowmore.isshow = true
        this.oneOrMoreShowmore.isOneFile = false
        // this.showmore.data = selection
      }

      this.oneOrMoreShowmore.data = selection
      console.log('all:', selection)
      console.log('oneOrMoreShowmore:', this.oneOrMoreShowmore.data)
    },
    // 单个文件更多操作；点击内容时事件
    multipleDropdown (select) {
      if (select === 'move') {
        this.moveFileFolder('one')
      }
      if (select === 'copy') {
        this.copyFileFolder('one')
      }
      if (select === 'rename') {
        this.showRenameFolder('one')
      }
      if (select === 'delete') {
        this.deleteOneFile()
      }
      console.log(select)
    },
    // 上传文件之前先给文件进行hash判断
    beforeUploadFile (file) {
      console.log(file)
      return false
    },
    // 点击新建文件夹
    showNewFolder () {
      console.log('点击了新建文件夹')
      // 显示对话框
      this.dialogBox.newFolderVisible = true
      // this.dialogBox.isdialogBox = true
    },
    // 监听新建文件夹关闭，并重置当前表单
    newFolderClose () {
      this.$refs.newFolderFromRef.resetFields()
      // this.dialogBox.isdialogBox = false
    },
    // 在创建文件对话框点击确定
    newFolder () {
      // 表单预校验
      this.$refs.newFolderFromRef.validate(async valid => {
        console.log(valid)
        if (!valid) { return }
        // const { data: result } = await this.$http.post('/user/adduser', this.newUserFrom)
        // if (result !== 200) {
        //   return this.$message.error('添加用户失败')
        // }
        this.$message.success('创建文件成功')
        // 隐藏对话框
        this.dialogBox.newFolderVisible = false
        // this.dialogBox.isdialogBox = false
        // 重新获取文件信息列表
        this.getFilesList()
      })
    },
    // 点击重命名
    showRenameFolder (fromSingleOrMul) {
      console.log('点击了重命名')
      // 显示对话框
      this.dialogBox.renameFolderVisible = true
      this.dialogBox.fromSingleOrMul = fromSingleOrMul
    },
    // 监听新建文件夹关闭，并重置当前表单
    renameFolderClose () {
      this.$refs.renameFolderFromRef.resetFields()
      this.dialogBox.fromSingleOrMul = ''
    },
    // 在创建文件对话框点击确定
    renameFolder () {
      // 表单预校验
      this.$refs.renameFolderFromRef.validate(async valid => {
        console.log(valid)
        if (!valid) { return }
        // const { data: result } = await this.$http.post('/user/adduser', this.newUserFrom)
        // if (result !== 200) {
        //   return this.$message.error('添加用户失败')
        // }
        this.$message.success('重命名成功')
        // 隐藏对话框
        this.dialogBox.renameFolderVisible = false
        this.dialogBox.fromSingleOrMul = false
        // 重新获取文件信息列表
        this.getFilesList()
      })
    },
    // 点击单个文件分享
    shareOneFile (scope) {
      this.oneShowmore = scope
      console.log('点击单个文件分享', this.oneShowmore)
      // this.showmore.data.forEach(element => {
      //   console.log(3, element)
      // })
    },
    // 点击单个或者多个文件分享
    shareOneOrMoreFile () {
      this.oneOrMoreShowmore.data.forEach(element => {
        console.log(3, element)
      })
      console.log('点击单个或者多个文件分享', this.oneOrMoreShowmore.data)
    },
    // 点击单个文件下载
    downloadOneFile (scope) {
      this.oneShowmore = scope
      console.log('点击单个文件下载', this.oneShowmore)
      // this.showmore.data.forEach(element => {
      //   console.log(3, element)
      // })
    },
    // 点击单个或者多个文件下载
    downloadOneOrMoreFile () {
      this.oneOrMoreShowmore.data.forEach(element => {
        console.log(3, element)
      })
      console.log('点击单个或者多个文件下载', this.oneOrMoreShowmore.data)
    },
    // 点击单个文件删除
    deleteOneFile () {
      // 拿取当前要删除的数据
      var temdata = this.oneShowmore
      console.log('点击单个文件删除', temdata)
      // 弹出弹窗
      this.$confirm('此操作将永久删除' + temdata.filename + ', 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 调用删除接口
        console.log('调用删除接口')
        // 重新获取用户列表
        console.log('重新获取文件列表')
        this.$message.success('删除成功')
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    },
    // 点击单个或者多个文件删除
    deleteOneOrMoreFile () {
      console.log('点击单个或者多个文件删除', this.oneOrMoreShowmore.data)
      var alldeletefilename = ''
      var filename = []
      this.oneOrMoreShowmore.data.forEach(item => {
        filename.push(item.filename)
      })
      alldeletefilename = filename.join(' ')
      console.log(alldeletefilename)
      // 弹出弹窗
      this.$confirm('此操作将永久删除' + alldeletefilename + ', 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 调用删除接口
        console.log('调用删除接口')
        // 重新获取用户列表
        console.log('重新获取文件列表')
        this.$message.success('删除成功')
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    },
    // 点击移动到显示对话框
    moveFileFolder (fromSingleOrMul) {
      console.log('点击了移动到', this.oneShowmore)
      // 显示对话框
      this.dialogBox.moveFileVisible = true
      this.dialogBox.fromSingleOrMul = fromSingleOrMul
    },
    // 关闭移动到显示对话框
    moveFileClose () {
      console.log('点击了移动到关闭')
      // 将选中的目录置空
      this.dialogBox.selectedDirecData = []
      // 将对话框来源置空
      this.dialogBox.fromSingleOrMul = ''
    },
    // 点击了对话框中的目录，并赋值
    moveFileClick (data) {
      console.log('移动到点击了目录数据为', data)
      this.dialogBox.selectedDirecData = data
    },
    // 点击移动到对话框中的确定
    moveFile () {
      // 判断当前确定对话框来自单个文件还是多个文件
      if (this.dialogBox.fromSingleOrMul === 'one') {
        console.log('当前移动到对话框是点击单个文件打开的')
        console.log('单个', this.oneShowmore)
        console.log('单个或多个', this.oneOrMoreShowmore)
      } else {
        console.log('当前移动到对话框是点击单个和多个文件打开的')
        console.log('单个', this.oneShowmore)
        console.log('单个或多个', this.oneOrMoreShowmore)
      }
      console.log('选中的目录数据为', this.dialogBox.selectedDirecData)
      // 隐藏移动到对话框
      this.dialogBox.moveFileVisible = false
      // 将选中的目录置空
      this.dialogBox.selectedDirecData = []
      // 将对话框来源置空
      this.dialogBox.fromSingleOrMul = ''
    },

    // 点击复制到显示对话框
    copyFileFolder (fromSingleOrMul) {
      console.log('点击了展示复制到', this.oneShowmore)
      // 显示对话框
      this.dialogBox.copyFileVisible = true
      this.dialogBox.fromSingleOrMul = fromSingleOrMul
    },
    // 关闭移动到显示对话框
    copyFileClose () {
      console.log('点击了复制到关闭')
      // 将选中的目录置空
      this.dialogBox.selectedDirecData = []
      // 将对话框来源置空
      this.dialogBox.fromSingleOrMul = ''
    },
    // 点击了对话框中的目录，并赋值
    copyFileClick (data) {
      console.log('复制到点击了目录数据为', data)
      this.dialogBox.selectedDirecData = data
    },
    // 点击移动到对话框中的确定
    copyFile () {
      // 判断当前确定对话框来自单个文件还是多个文件
      if (this.dialogBox.fromSingleOrMul === 'one') {
        console.log('当前复制到对话框是点击单个文件打开的')
        console.log('单个', this.oneShowmore)
        console.log('单个或多个', this.oneOrMoreShowmore)
      } else {
        console.log('当前复制到对话框是点击单个和多个文件打开的')
        console.log('单个', this.oneShowmore)
        console.log('单个或多个', this.oneOrMoreShowmore)
      }
      console.log('选中的目录数据为', this.dialogBox.selectedDirecData)
      // 隐藏移动到对话框
      this.dialogBox.copyFileVisible = false
      // 将选中的目录置空
      this.dialogBox.selectedDirecData = []
      // 将对话框来源置空
      this.dialogBox.fromSingleOrMul = ''
    }
  }
}
</script>

<style lang="less" scoped>
.home-container{
    height: 100%;
}
.el-aside{
    background-color: #f7f7f7;
    .el-menu{
        border-right: none;
    }
    .el-submenu .el-menu-item{
        min-width: 180px;
        padding: 0 40px;
    }
    .menu-title{
        padding:0 30px;
    }
    > div{
        width: 185px;
        position: absolute;
        bottom: 0;
        padding: 20px;
        box-sizing: border-box;
        .schedule{
            display: flex;
            flex-flow: column;
        }
        span{
            padding: 10px 0;
        }
    }
}
.el-main{
    padding: 0px;
    .main-title{
        padding: 10px 20px;
    }
    .el-breadcrumb{
        margin: 10px 0 0px 20px;
    }
    .file-name{
        display: flex;
        align-items: center;
        span{
            margin: 0 10px;
        }
    }
    .file-operating{
        padding: 0 5px;
    }
    .upload-demo {
      display: inline-block;
    }
    .el-button--medium {
      margin-left: 10px;
    }
}

</style>
