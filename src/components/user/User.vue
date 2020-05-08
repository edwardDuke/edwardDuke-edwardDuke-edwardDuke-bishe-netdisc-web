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
                    <el-button type="danger" @click="removeUser">删除</el-button>
                </el-col>
            </el-row>

            <!-- 用户列表区域 -->
            <el-table :data="tableData" border height='350'  @selection-change="selectAll">
                <el-table-column type="selection" width="55" ></el-table-column>
                <el-table-column type="index" label="序号" ></el-table-column>
                <el-table-column label="账号" prop="account"></el-table-column>
                <el-table-column label="姓名" prop="name" ></el-table-column>
                <el-table-column label="性别" prop="sex" ></el-table-column>
                <el-table-column label="角色" prop="rolename" ></el-table-column>
                <el-table-column label="已用存储空间" prop="usestoragesize" ></el-table-column>
                <el-table-column label="创建时间" width="150" prop="createtime" ></el-table-column>
                <el-table-column label="状态" prop="status" >
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.status" @change="userStatusChanged(scope.row)"></el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作"  fixed="right" width="180" >
                    <template slot-scope="scope">
                        <!-- 修改 -->
                        <el-button type="primary" size="mini" icon="el-icon-edit" @click="showEditUser(scope.row.id)" ></el-button>
                        <!-- 删除 -->
                        <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeUserById(scope.row)"></el-button>
                        <!-- 角色分配 -->
                        <el-tooltip  effect="dark" content="角色分配" placement="top-end" :enterable="false">
                            <el-button type="warning" size="mini" icon="el-icon-s-check" @click="changeUserRole(scope.row)"></el-button>
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
          width="40%" @close="addUserClose">
            <el-form :model="newUserFrom" :rules="newUserFromRules" ref="newUserFromRef" label-width="100px" size="mini">
                <el-form-item label="用户账号" prop="account">
                    <el-input v-model="newUserFrom.account"></el-input>
                </el-form-item>
                <el-form-item label="姓名" prop="name">
                    <el-input v-model="newUserFrom.name"></el-input>
                </el-form-item>
                <el-form-item label="性别" prop="sex">
                    <el-select v-model="newUserFrom.sex" placeholder="请选择性别">
                      <el-option label="男" value="男"></el-option>
                      <el-option label="女" value="女"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input type="password" v-model="newUserFrom.password" show-password></el-input>
                </el-form-item>
                <el-form-item label="角色" prop="roleid">
                     <el-select v-model="newUserFrom.roleid" placeholder="请选择角色">
                      <el-option
                        v-for="item in roleInfo"
                        :key="item.value"
                        :label="item.name"
                        :value="item.id">
                      </el-option>
                      <!-- <el-option label="男" value="男"></el-option>
                      <el-option label="女" value="女"></el-option> -->
                    </el-select>
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
          width="40%" @close="editUserClose">
          <el-form :model="editUserInfo" :rules="editUserFromRules" ref="editUserFromRef" label-width="100px" size="mini">
            <el-form-item label="用户账号" prop="account">
              <el-input v-model="editUserInfo.account" disabled></el-input>
            </el-form-item>
            <el-form-item label="姓名" prop="name">
              <el-input v-model="editUserInfo.name"></el-input>
            </el-form-item>
            <el-form-item label="性别" prop="sex">
              <el-select v-model="editUserInfo.sex" placeholder="请选择性别">
                <el-option label="男" value="男"></el-option>
                <el-option label="女" value="女"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="创建时间" prop="account">
              <el-input v-model="editUserInfo.createtime" disabled></el-input>
            </el-form-item>
            <el-form-item label="新密码" prop="password">
              <el-input type="password" v-model="editUserInfo.password" autocomplete="off" show-password></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="editUserVisible = false">取 消</el-button>
            <el-button type="primary" @click="editUser">确 定</el-button>
          </span>
        </el-dialog>

        <!-- 修改用户角色对话框 -->
        <el-dialog
          title="修改用户角色"
          :visible.sync="changeUserRoleVisible"
          :close-on-click-modal="false"
          width="40%" @close="changeUserRoleClose">
            <el-tree
              :data="roleTree"
              show-checkbox
              node-key="id"
              default-expand-all
              ref="roletree"
              :default-checked-keys="defaultRoleId"
              :props="defaultProps"
              @check-change="handleCheckChange"
              @node-click="nodeClick">
            </el-tree>
          <span slot="footer" class="dialog-footer">
            <el-button @click="changeUserRoleVisible = false">取 消</el-button>
            <el-button type="primary" @click="changeUser">确 定</el-button>
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
        { id: '0001', account: '160344', name: '王小虎0', rolename: '普通用户', status: true },
        { id: '0002', account: '160345', name: '王小虎2', rolename: '普通用户', status: false },
        { id: '0003', account: '160346', name: '王小虎3', rolename: '普通用户', status: true },
        { id: '0004', account: '160347', name: '王小虎4', rolename: '普通用户', status: false },
        { id: '0005', account: '160348', name: '王小虎5', rolename: '普通用户', status: true },
        { id: '0006', account: '160349', name: '王小虎6', rolename: '普通用户', status: false },
        { id: '0007', account: '160350', name: '王小虎7', rolename: '普通用户', status: true },
        { id: '0008', account: '160351', name: '王小虎8', rolename: '普通用户', status: false }
      ],
      // 总共多少条用户数据
      total: 10,
      //  勾选用户批量操作
      selectionUserInfo: [],
      // 角色列表
      roleInfo: [
        { id: '1', name: '管理员' },
        { id: '2', name: '普通用户' },
        { id: '3', name: '付费用户' }
      ],
      // 添加用户对话框显示
      addUserVisible: false,
      // 添加用户信息
      newUserFrom: {
        account: '',
        name: '',
        sex: '',
        password: '',
        roleid: ''
      },
      // 添加用户表单的验证规则
      newUserFromRules: {
        account: [
          { required: true, message: '请输入账号', trigger: 'blur' }
          // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        sex: [
          { required: true, message: '请选择性别', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 25, message: '长度在 6 到 25 个字符', trigger: 'blur' }
        ],
        roleid: [
          { required: true, message: '请选择角色', trigger: 'blur' }
        ]
      },

      // 编辑用户对话框显示
      editUserVisible: false,
      // 获取用户编辑的信息
      editUserInfo: {
        id: '0001',
        account: '15766936118',
        name: '王小虎',
        sex: 'n男',
        status: true,
        createtime: '',
        password: ''
      },
      // 编辑用户表单的验证规则
      editUserFromRules: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        password: [
          { min: 6, max: 25, message: '长度不小于6位', trigger: 'blur' }
        ],
        sex: [
          { required: true, message: '请选择性别', trigger: 'blur' }
        ]
      },

      // 编辑用户角色对话框显示
      changeUserRoleVisible: false,
      // 默认选择的角色
      defaultRoleId: [],
      isselectRole: true,
      // 修改的用户角色提交数据表单
      changUserRoleFrom: {

      },
      selectRoleId: '',
      // 显示数据
      roleTree: [
        {
          // id: 1,
          name: '全部',
          children: [
            { id: 11, name: '管理员' },
            { id: 12, name: '管理员' },
            { id: 13, name: '管理员' }
          ],
          disabled: true
        }
      ],
      defaultProps: {
        children: 'children',
        label: 'name',
        isLeaf: 'leaf'
      }
    }
  },
  // 注册可以访问父类的方法
  inject: ['saveMenuItem'],
  created () {
    this.saveMenuItem('/user')
    // 获取用户信息
    this.getUserInfo()
    this.getRoleInfo()
  },
  methods: {
    // 获取用户信息
    async getUserInfo () {
      console.log('发起请求获取对应的用户数据')
      //   const { data: result } = await this.$http.get('/user',requestData)
      this.$get('/user/queryusers', this.queryInfo).then((result) => {
        console.log(result)
        var alluser = []
        if (result.code === 200) {
          alluser = result.data.users
          this.total = result.data.total
        }
        // 处理数据
        for (var index in alluser) {
          if (alluser[index].status === 'enable') {
            alluser[index].status = true
          } else {
            alluser[index].status = false
          }
          if (alluser[index].usestoragesize / 1024 < 1) {
            alluser[index].usestoragesize = alluser[index].usestoragesize + 'Byte'
          } else if (alluser[index].usestoragesize / 1024 >= 1 && alluser[index].usestoragesize / 1024 < 1024) {
            alluser[index].usestoragesize = (alluser[index].usestoragesize / 1024).toFixed(2) + 'KB'
          } else if (alluser[index].usestoragesize / (1024 * 1024) >= 1 && alluser[index].usestoragesize / (1024 * 1024) < 1024) {
            alluser[index].usestoragesize = (alluser[index].usestoragesize / (1024 * 1024)).toFixed(2) + 'MB'
          } else {
            alluser[index].usestoragesize = (alluser[index].usestoragesize / (1024 * 1024 * 1024)).toFixed(2) + 'GB'
          }
        }
        // 赋值到显示板
        this.tableData = alluser
      }).catch((err) => {
        console.log('请求失败', err)
      })
    },
    getRoleInfo () {
      this.$get('/role/all').then((result) => {
        if (result.code === 200) {
          console.log(result.data)
          this.roleInfo = result.data
          this.roleTree[0].children = result.data
        }
      }).catch((err) => {
        console.log('请求失败', err)
        this.$message.error(err.message)
      })
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
      var data = {}
      data.id = userinfo.id
      if (userinfo.status) {
        data.status = 'enable'
      } else {
        data.status = 'disable'
      }
      this.$get('/user/admin/changstatus', data).then((result) => {
        if (result.code === 200) {
          this.$message.success('更新用户状态成功')
        }
      }).catch((err) => {
        console.log('请求失败', err)
        this.$message.error(err.message)
      })
    },
    // 点击添加按钮，显示添加对话框
    showAddUser () {
      // 获取角色列表
      // this.$get('/role/all').then((result) => {
      //   if (result.code === 200) {
      //     this.roleInfo = result.data
      //     this.addUserVisible = true
      //   }
      // }).catch((err) => {
      //   console.log('请求失败', err)
      //   this.$message.error(err.message)
      // })
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
        console.log(this.newUserFrom)
        this.$post('/user/admin/add', this.newUserFrom).then((result) => {
          if (result.code === 200) {
            this.$message.success('添加用户成功')
            // 隐藏对话框
            this.addUserVisible = false
            // 重新获取用户信息列表
            this.getUserInfo()
          }
        }).catch((err) => {
          console.log('请求失败', err)
          this.$message.error(err.message)
        })
      })
    },
    // 展示用戶编辑对话框
    async showEditUser (id) {
      console.log('点击了id为', id, '的编辑信息')
      console.log('通过id获取要编辑的用户信息')
      this.$get('/user/admin/' + id).then((result) => {
        console.log('请求成功', result)
        if (result.code === 200) {
          this.editUserInfo = result.data
          this.editUserVisible = true
        }
      }).catch((err) => {
        console.log('请求失败', err)
      })
    },
    // 监听编辑用户关闭，并重置当前表单
    editUserClose () {
      this.$refs.editUserFromRef.resetFields()
      this.editUserInfo = {}
    },
    // 修改用户信息提交
    editUser () {
      this.$refs.editUserFromRef.validate(async valid => {
        console.log(valid)
        if (!valid) return
        // 调用修改接口
        console.log('调用修改用户接口', this.editUserInfo)
        this.$post('/user/admin/edit', this.editUserInfo).then((result) => {
          if (result.code === 200) {
            // 隐藏对话框
            this.editUserVisible = false
            // 重新刷新用户列表
            console.log('重新获取用户列表')
            this.getUserInfo()
            // 弹窗修改成功
            this.$message.success('修改用户成功')
          }
        }).catch((err) => {
          console.log('请求失败', err)
          this.$message.error(err.message)
        })
      })
    },
    // 删除单个用户信息
    async removeUserById (deleteUser) {
      var id = deleteUser.id
      var account = deleteUser.account
      this.$confirm('此操作将永久删除用户为:' + account + ', 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 调用删除接口
        console.log('调用删除接口')
        this.$get('/user/admin/delete', { id: id }).then((result) => {
          if (result.code === 200) {
            // 重新获取用户列表
            this.$message.success('删除成功')
            console.log('重新获取用户列表')
            this.getUserInfo()
          }
        }).catch((err) => {
          console.log('请求失败', err)
          this.$message.error(err.message)
        })
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    },
    // 用戶列表全选或多选
    selectAll (val) {
      console.log(val)
      // 赋值到选择的数据
      this.selectionUserInfo = val
      // console.log(row)
    },
    // 删除多个用户
    removeUser () {
      if (this.selectionUserInfo.length === 0) {
        this.$message.info('请选择要删除的用户')
        return
      }
      // 发起批量审核通过的请求
      var data = {}
      var idList = []
      var account = []
      for (var index in this.selectionUserInfo) {
        idList.push(this.selectionUserInfo[index].id)
        account.push(this.selectionUserInfo[index].account)
      }
      data.id = idList.join(',')

      this.$confirm('此操作将永久删除用户：' + account.join(',') + '，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        closeOnClickModal: false
      }).then(() => {
        // 调用删除接口
        console.log('调用删除接口，删除参数id为', data)
        this.$get('/user/admin/delete', data).then((result) => {
          if (result.code === 200) {
            // 重新获取用户列表
            this.$message.success('删除成功')
            console.log('重新获取用户列表')
            this.getUserInfo()
          }
        }).catch((err) => {
          console.log('请求失败', err)
          this.$message.error(err.message)
        })
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    },
    // 修改用户角色对话框显示
    changeUserRole (userInfo) {
      console.log('123456', userInfo)
      this.defaultRoleId = [userInfo.roleid]
      this.changUserRoleFrom.id = userInfo.id
      this.changUserRoleFrom.roleid = userInfo.roleid
      console.log(this.defaultRoleId)
      // 显示对话框
      this.changeUserRoleVisible = true
    },
    // 监听修改用户角色关闭，
    changeUserRoleClose () {
      this.defaultRoleId = []
      this.changUserRoleFrom = {}
    },

    // 修改用户角色确定
    changeUser () {
      console.log(this.changUserRoleFrom)
      this.$post('/user/admin/edit', this.changUserRoleFrom).then((result) => {
        if (result.code === 200) {
          this.$message.success('修改成功')
          // 隐藏对话框
          this.changeUserRoleVisible = false
          // 刷新数据
          this.getUserInfo()
        }
      }).catch((err) => {
        console.log('请求失败', err)
        this.$message.error(err.message)
      })
    },
    // 树形单选
    handleCheckChange (data, checked, indeterminate) {
      /* 主要通过checked进行判断 */
      console.log(checked)
      if (checked) {
        var arr = [data.id]
        this.defaultRoleId = arr
        this.$refs.roletree.setCheckedKeys(arr)
        this.changUserRoleFrom.roleid = data.id
        console.log('选中', this.changUserRoleFrom)
        // console.log('单选', data.name)
        /* 右侧列表相关的代码 */
        /* this.temp3Msg.currentSelectCourseList = []; */
        /* this.temp3Msg.currentSelectCourseList.push(data); */
      } else {
        console.log('未选中', data)
      }
    },
    nodeClick (data, checked, node) {
      this.checkedId = data.comcode
      this.$refs.roletree.setCheckedNodes([data])
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
