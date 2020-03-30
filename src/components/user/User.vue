<template>
    <div>
        <!-- 导航栏 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片显示内容 -->
        <el-card class="box-card">
            <!-- 搜索区域 -->
            <el-row :gutter="20">
                <el-col :span="7">
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserInfo">
                        <el-button slot="append" icon="el-icon-search" @click="getUserInfo"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="showAddUser">添加</el-button>
                    <el-button type="danger" >删除</el-button>
                </el-col>
            </el-row>

            <!-- 用户列表区域 -->
            <el-table :data="tableData" border height='350'  @selection-change="selectAll">
                <el-table-column type="selection" width="55" ></el-table-column>
                <el-table-column type="index" label="序号" ></el-table-column>
                <el-table-column label="账号" prop="account"></el-table-column>
                <el-table-column label="姓名" prop="name" ></el-table-column>
                <el-table-column label="角色" prop="rolename" ></el-table-column>
                <el-table-column label="状态" prop="user_status" >
                    <template slot-scope="scope">
                        {{scope.row.user_status}}
                        <el-switch v-model="scope.row.user_status" @change="userStatusChanged(scope.row)"></el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作"  fixed="right" width="180" >
                    <template slot-scope="scope">
                        <!-- 修改 -->
                        <el-button type="primary" size="mini" icon="el-icon-edit" @click="showEditUser(scope.row.id)" ></el-button>
                        <!-- 删除 -->
                        <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeUserById(scope.row.id)"></el-button>
                        <!-- 角色分配 -->
                        <el-tooltip  effect="dark" content="角色分配" placement="top-end" :enterable="false">
                            <el-button type="warning" size="mini" icon="el-icon-s-check"></el-button>
                        </el-tooltip>
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

        <!-- 添加用户对话框 -->
        <el-dialog
          title="添加用户"
          :visible.sync="addUserVisible"
          :close-on-click-modal="false"
          width="50%" @close="addUserClose">
            <el-form :model="newUserFrom" :rules="newUserFromRules" ref="newUserFromRef" label-width="100px" class="demo-ruleForm">
                <el-form-item label="用户账号" prop="account">
                    <el-input v-model="newUserFrom.account"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addUserVisible = false">取 消</el-button>
                <el-button type="primary" @click="addUser">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 修改用户对话框 -->
        <el-dialog
          title="修改用户"
          :visible.sync="editUserVisible"
          :close-on-click-modal="false"
          width="50%" @close="editUserClose">
          <el-form :model="editUserInfo" :rules="editUserFromRules" ref="editUserFromRef" label-width="100px" >
            <el-form-item label="用户账号" prop="account">
              <el-input v-model="editUserInfo.account"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="editUserVisible = false">取 消</el-button>
            <el-button type="primary" @click="editUser">确 定</el-button>
          </span>
        </el-dialog>

    </div>
</template>
<script>
export default {
  data () {
    return {
      // 获取用户列表的参数
      queryInfo: {
        //   搜索关键字信息
        query: '',
        //   当前页数
        pagenum: 1,
        // 当前每页显示多少条数据
        pagesize: 2
      },
      // 用户信息
      tableData: [
        { id: '0001', account: '160344', name: '王小虎0', rolename: '普通用户', user_status: true },
        { id: '0002', account: '160345', name: '王小虎2', rolename: '普通用户', user_status: false },
        { id: '0003', account: '160346', name: '王小虎3', rolename: '普通用户', user_status: true },
        { id: '0004', account: '160347', name: '王小虎4', rolename: '普通用户', user_status: false },
        { id: '0005', account: '160348', name: '王小虎5', rolename: '普通用户', user_status: true },
        { id: '0006', account: '160349', name: '王小虎6', rolename: '普通用户', user_status: false },
        { id: '0007', account: '160350', name: '王小虎7', rolename: '普通用户', user_status: true },
        { id: '0008', account: '160351', name: '王小虎8', rolename: '普通用户', user_status: false }
      ],
      // 总共多少条用户数据
      total: 10,

      // 添加用户对话框显示
      addUserVisible: false,
      // 添加用户信息
      newUserFrom: {
        account: ''
      },
      // 添加用户表单的验证规则
      newUserFromRules: {
        account: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ]
      },

      // 编辑用户对话框显示
      editUserVisible: false,
      // 获取用户编辑的信息
      editUserInfo: {
        id: '0001',
        account: '15766936118',
        name: '王小虎',
        rolename: '普通用户'
      },
      // 编辑用户表单的验证规则
      editUserFromRules: {
        account: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    // 获取用户信息
  },
  methods: {
    // 获取用户信息
    async getUserInfo () {
      console.log('发起请求获取对应的用户数据')
    //   const { data: result } = await this.$http.get('/user',requestData)
    },

    //   监听每页显示多少条的改变事件
    handleSizeChange (newpagesize) {
      console.log(newpagesize)
      this.queryInfo.pagesize = newpagesize
      // 重新获取用户信息
      this.getUserInfo()
    },
    // 监听页码值的改变事件
    handleCurrentChange (newpagenum) {
      console.log('当前为第', newpagenum, '页')
      this.queryInfo.pagenum = newpagenum
      // 重新获取用户信息
      this.getUserInfo()
    },
    // 用户状态修改
    userStatusChanged (userinfo) {
      console.log('当前用户的信息为', userinfo)
      // 发送请求修改数据
      console.log('发送修改用户信息请求')
      // eslint-disable-next-line no-constant-condition
      if (!true) {
        return this.$message.error('更新用户状态失败')
      }
      this.$message.success('更新用户状态成功')
    },
    // 点击添加按钮，显示添加对话框
    showAddUser () {
      this.addUserVisible = true
    },
    // 监听添加用户关闭，并重置当前表单
    addUserClose () {
      this.$refs.newUserFromRef.resetFields()
    },
    // 在添加用户对话框中点击确定添加用户
    addUser () {
      // 表单预校验
      this.$refs.newUserFromRef.validate(async valid => {
        console.log(valid)
        if (!valid) { return }
        // const { data: result } = await this.$http.post('/user/adduser', this.newUserFrom)
        // if (result !== 200) {
        //   return this.$message.error('添加用户失败')
        // }
        this.$message.success('添加用户成功')
        // 隐藏对话框
        this.addUserVisible = false
        // 重新获取用户信息列表
        this.getUserInfo()
      })
    },
    // 展示用戶编辑对话框
    async showEditUser (id) {
      console.log('点击了id为', id, '的编辑信息')
      console.log('通过id获取要编辑的用户信息')
      // this.$http.get('/user/getUserByid', id).then((result) => {
      //   console.log(result)
      //   this.editUserInfo = result.data
      // }).catch((err) => {
      //   console.log(err)
      // })
      this.editUserVisible = true
    },
    // 监听编辑用户关闭，并重置当前表单
    editUserClose () {
      this.$refs.editUserFromRef.resetFields()
    },
    // 修改用户信息提交
    editUser () {
      this.$refs.editUserFromRef.validate(async valid => {
        console.log(valid)
        if (!valid) return
        // 调用修改接口
        console.log('调用修改用户接口')
        // 隐藏对话框
        this.editUserVisible = false
        // 重新刷新用户列表
        console.log('重新获取用户列表')
        // 弹窗修改成功
        this.$message.success('修改用户成功')
      })
    },
    // 删除用户信息
    async removeUserById (id) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 调用删除接口
        console.log('调用删除接口')
        // 重新获取用户列表
        console.log('重新获取用户列表')
        this.$message.success('删除成功')
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    },
    // 用戶列表全选或多选
    selectAll (val) {
      console.log(val)
      // console.log(row)
    }
  },
  // 过滤器
  filters: {
    //   过滤用户列表中的状态，把enable修改为true
    tableDatafilter: function (tableDate) {
      for (const item in tableDate) {
        console.log(tableDate[item].user_status)
        if (tableDate[item].user_status === 'enable') {
          tableDate[item].user_status = true
        } else {
          tableDate[item].user_status = false
        }
      }
      return tableDate
    }
  }
}
</script>

<style lang="less" scoped>

</style>
