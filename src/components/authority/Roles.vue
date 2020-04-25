<template>
    <div>
        <!-- 导航栏 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片显示内容 -->
        <el-card class="box-card">
             <!-- 搜索区域 -->
            <el-row :gutter="20">
                <el-col :span="7">
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getRolesInfo">
                        <el-button slot="append" icon="el-icon-search" @click="getRolesInfo"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button @click="showAddRole">添加</el-button>
                </el-col>
            </el-row>
            <!-- 角色列表区域 -->
            <el-table :data="tableData" border height='350' >
                <el-table-column type="index" label="序号"></el-table-column>
                <el-table-column label="角色名称" prop="rolename"></el-table-column>
                <el-table-column label="角色描述" prop="description"></el-table-column>
                <el-table-column label="操作"  fixed="right" width="300" >
                    <template slot-scope="scope">
                        <!-- 修改 -->
                        <el-button type="primary" size="mini" icon="el-icon-edit" @click="showEditRole(scope.row.id)">编辑</el-button>
                        <!-- 删除 -->
                        <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteRoleById(scope.row.id)">删除</el-button>
                        <!-- 分配权限 -->
                        <el-button type="warning" size="mini" icon="el-icon-s-check" @click="showSetRightDialog(scope.row.id)">分配权限</el-button>
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

        <!-- 添加角色对话框 -->
        <el-dialog
            title="角色添加"
            :close-on-click-modal="false"
            :visible.sync="showAddRolesVisible"
            width="50%" @close="addRolesClose">
            <el-form :model="newRolesFrom" :rules="newRolesFromRules" ref="newRolesFromRef" label-width="100px" class="demo-ruleForm">
                <el-form-item label="角色名称" prop="rolename">
                    <el-input v-model="newRolesFrom.rolename"></el-input>
                </el-form-item>
                <el-form-item label="角色描述">
                    <el-input v-model="newRolesFrom.description"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="showAddRolesVisible = false">取 消</el-button>
                <el-button type="primary" @click="addRoles">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 编辑角色对话框 -->
        <el-dialog
            title="角色修改"
            :close-on-click-modal="false"
            :visible.sync="editRolesVisible"
            width="50%" @close="editRolesClose">
            <el-form :model="editRolesFrom" :rules="editRolesFromRules" ref="editRolesFromRef" label-width="100px" class="demo-ruleForm">
                <el-form-item label="角色名称" prop="rolename">
                    <el-input v-model="editRolesFrom.rolename"></el-input>
                </el-form-item>
                <el-form-item label="角色描述">
                    <el-input v-model="editRolesFrom.description"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editRolesVisible = false">取 消</el-button>
                <el-button type="primary" @click="editRolesVisible = false">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 分配权限对话框 -->
        <el-dialog
            title="权限分配"
            :close-on-click-modal="false"
            :visible.sync="showSetRightDialogVisible"
            width="50%">
            <span>这是权限分配对话框</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="showSetRightDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="showSetRightDialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
  data () {
    return {
      // 获取角色列表的参数
      queryInfo: {
        //   搜索关键字信息
        query: '',
        //   当前页数
        pagenum: 1,
        // 当前每页显示多少条数据
        pagesize: 2
      },
      // 角色信息
      tableData: [
        { id: '0001', rolename: '超级管理员', description: '这是超级管理员的描述' },
        { id: '0002', rolename: '普通用户', description: '这是普通用户的描述' },
        { id: '0003', rolename: '付费用户', description: '这是付费用户的描述' }
      ],
      // 总共多少条用户数据
      total: 10,
      //   控制展示添加角色对话框
      showAddRolesVisible: false,
      //   添加角色表单
      newRolesFrom: {
        rolename: '',
        description: ''
      },
      //   添加角色表单的验证规则
      newRolesFromRules: {
        rolename: [{ required: true, message: '请输入角色名称', trigger: 'blur' }]
      },
      //   控制展示编辑角色对话框
      editRolesVisible: false,
      //   编辑角色表单
      editRolesFrom: {
        rolename: '',
        description: ''
      },
      //   编辑角色表单验证规则
      editRolesFromRules: {
        rolename: [{ required: true, message: '请输入角色名称', trigger: 'blur' }]
      },
      //   控制展示分配权限对话框
      showSetRightDialogVisible: false
    }
  },
  inject: ['saveMenuItem'],
  created () {
    this.saveMenuItem('/roles')
    //   获取角色信息
    this.getRolesInfo()
  },
  methods: {
    // 获取角色列表
    getRolesInfo () {
      console.log('获取角色列表')
    },
    //   监听每页显示多少条的改变事件
    handleSizeChange (newpagesize) {
      console.log(newpagesize)
      this.queryInfo.pagesize = newpagesize
      // 重新获取用户信息
      this.getRolesInfo()
    },
    // 监听页码值的改变事件
    handleCurrentChange (newpagenum) {
      console.log('当前为第', newpagenum, '页')
      this.queryInfo.pagenum = newpagenum
      // 重新获取用户信息
      this.getRolesInfo()
    },
    // 展示添加角色的对话框
    showAddRole () {
      this.showAddRolesVisible = true
    },
    // 监听添加角色关闭，并重置当前表单
    addRolesClose () {
      this.$refs.newRolesFromRef.resetFields()
    },
    // 再添加角色对话框点击确定添加角色
    addRoles () {
      // 表单的预校验
      this.$refs.newRolesFromRef.validate(async valid => {
        console.log(valid)
        if (!valid) { return }
        // const { data: result } = await this.$http.post('/user/adduser', this.newUserFrom)
        // if (result !== 200) {
        //   return this.$message.error('添加角色失败')
        // }
        this.$message.success('添加角色成功')
        // 隐藏对话框
        this.showAddRolesVisible = false
        // 重新获取用户信息列表
        this.getRolesInfo()
      })
    },
    // 展示编辑角色对话框
    async showEditRole (id) {
      console.log('点击了id为', id, '的角色编辑')
      console.log('发起请求，获取该用户')
      //   const { data: result } = await this.$http.get('/role/getroleByid', id)
      //   if (result !== 200) { return this.$message.error('请求失败') }
      //   this.editRolesFrom = result
      this.editRolesVisible = true
    },
    // 监听编辑角色关闭，并重置当前表单
    editRolesClose () {
      this.$refs.editRolesFromRef.resetFields()
    },
    //  删除角色信息
    async deleteRoleById (id) {
      this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 调用删除接口
        console.log('调用删除角色接口')
        // 重新获取用户列表
        console.log('重新获取角色列表')
        this.$message.success('删除成功')
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    },
    //   展示分配权限的对话框
    showSetRightDialog (id) {
      this.showSetRightDialogVisible = true
    }
  }

}
</script>

<style lang="less" scoped>

</style>
