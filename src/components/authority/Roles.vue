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
                <el-table-column label="角色名称" width="90" prop="name"></el-table-column>
                <el-table-column label="角色描述" prop="description"></el-table-column>
                <el-table-column label="上一级角色" width="100" prop="pranrole"></el-table-column>
                <el-table-column label="总存储大小" width="100" prop="storagesize"></el-table-column>
                <el-table-column label="下载速度" width="100" prop="downloadspeed"></el-table-column>
                <el-table-column label="创建时间" width="120" prop="createtime"></el-table-column>
                <el-table-column label="操作"  fixed="right" width="300" >
                    <template slot-scope="scope">
                        <!-- 修改 -->
                        <el-button type="primary" size="mini" icon="el-icon-edit" @click="showEditRole(scope.row.id)">编辑</el-button>
                        <!-- 删除 -->
                        <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteRoleById(scope.row)">删除</el-button>
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
                <el-form-item label="角色名称" prop="name">
                    <el-input v-model="newRolesFrom.name"></el-input>
                </el-form-item>
                <el-form-item label="角色描述">
                    <el-input v-model="newRolesFrom.description"></el-input>
                </el-form-item>
                <el-form-item label="上一级角色" prop="roleid">
                    <el-select v-model="newRolesFrom.roleid" placeholder="请选择角色">
                      <el-option
                        v-for="item in roleInfo"
                        :key="item.value"
                        :label="item.name"
                        :value="item.id">
                      </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="总存储大小"  prop="storagesize">
                    <el-input v-model="newRolesFrom.storagesize"  placeholder="请输入存储大小" style="width:300px">
                      <el-select v-model="newRolesFrom.storagesizeselect" prop="storagesizeselect" slot="append" placeholder="单位" style="width:90px">
                        <el-option label="KB" value="1"></el-option>
                        <el-option label="MB" value="1024"></el-option>
                        <el-option label="GB" value="1048576"></el-option>
                      </el-select>
                    </el-input>
                </el-form-item>
                <el-form-item label="下载速度" prop="downloadspeed">
                    <el-input v-model="newRolesFrom.downloadspeed" placeholder="请输入存储大小" style="width:300px">
                      <el-select v-model="newRolesFrom.downloadspeedselect" prop="downloadspeedselect" slot="append" placeholder="单位" style="width:90px">
                        <el-option label="KB" value="1"></el-option>
                        <el-option label="MB" value="1024"></el-option>
                        <el-option label="GB" value="1048576"></el-option>
                      </el-select>
                    </el-input>
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
                <el-form-item label="角色名称" prop="name">
                    <el-input v-model="editRolesFrom.name"></el-input>
                </el-form-item>
                <el-form-item label="角色描述">
                    <el-input v-model="editRolesFrom.description"></el-input>
                </el-form-item>
                <el-form-item label="上一级角色" prop="roleid">
                     <el-select v-model="editRolesFrom.roleid" placeholder="请选择角色">
                      <el-option
                        v-for="item in roleInfo"
                        :key="item.value"
                        :label="item.name"
                        :value="item.id">
                      </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="总存储大小">
                    <el-input v-model="editRolesFrom.storagesize" style="width:300px">
                       <el-select v-model="editRolesFrom.storagesizeselect" prop="storagesizeselect" slot="append" placeholder="单位" style="width:90px">
                        <el-option label="KB" value="1"></el-option>
                        <el-option label="MB" value="1024"></el-option>
                        <el-option label="GB" value="1048576"></el-option>
                      </el-select>
                    </el-input>
                </el-form-item>
                <el-form-item label="下载速度">
                    <el-input v-model="editRolesFrom.downloadspeed" style="width:300px">
                      <el-select v-model="editRolesFrom.downloadspeedselect" prop="downloadspeedselect" slot="append" placeholder="单位" style="width:90px">
                        <el-option label="KB" value="1"></el-option>
                        <el-option label="MB" value="1024"></el-option>
                        <el-option label="GB" value="1048576"></el-option>
                      </el-select>
                    </el-input>
                    </el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editRolesVisible = false">取 消</el-button>
                <el-button type="primary" @click="editRoles">确 定</el-button>
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
        { id: '0001', name: '超级管理员', description: '这是超级管理员的描述' },
        { id: '0002', name: '普通用户', description: '这是普通用户的描述' },
        { id: '0003', name: '付费用户', description: '这是付费用户的描述' }
      ],
      // 总共多少条用户数据
      total: 10,
      // 角色列表
      roleInfo: [
        { id: '1', name: '管理员' },
        { id: '2', name: '普通用户' },
        { id: '3', name: '付费用户' }
      ],
      //   控制展示添加角色对话框
      showAddRolesVisible: false,
      //   添加角色表单
      newRolesFrom: {
        name: '',
        description: '',
        roleid: '',
        storagesize: '',
        downloadspeed: '',
        storagesizeselect: '',
        downloadspeedselect: ''
      },
      //   添加角色表单的验证规则
      newRolesFromRules: {
        name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
        storagesize: [{ required: true, message: '请输入存储大小', trigger: 'blur' }],
        storagesizeselect: [{ required: true, message: '请选择存储单位', trigger: 'blur' }],
        downloadspeed: [{ required: true, message: '请输入下载速度', trigger: 'blur' }],
        downloadspeedselect: [{ required: true, message: '请选择下载速度单位', trigger: 'blur' }]
      },
      //   控制展示编辑角色对话框
      editRolesVisible: false,
      //   编辑角色表单
      editRolesFrom: {
        id: '',
        name: '',
        description: '',
        roleid: '',
        storagesize: '',
        downloadspeed: '',
        storagesizeselect: '',
        downloadspeedselect: ''
      },
      //   编辑角色表单验证规则
      editRolesFromRules: {
        name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }]
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

    this.getRole()
  },
  methods: {
    // 获取角色列表
    getRolesInfo () {
      console.log('获取角色列表')
      this.$get('/role/admin/queryroles', this.queryInfo).then((result) => {
        if (result.code === 200) {
          var data = []
          data = result.data.roles
          // 对数据进行处理
          for (var index in data) {
            if (data[index].storagesize / 1024 < 1) {
              data[index].storagesize = data[index].storagesize + 'BYte'
            } else if (data[index].storagesize / 1024 >= 1 && data[index].storagesize / 1024 < 1024) {
              data[index].storagesize = (data[index].storagesize / 1024).toFixed(2) + 'KB'
            } else if (data[index].storagesize / (1024 * 1024) >= 1 && data[index].storagesize / (1024 * 1024) < 1024) {
              data[index].storagesize = (data[index].storagesize / (1024 * 1024)).toFixed(2) + 'MB'
            } else {
              data[index].storagesize = (data[index].storagesize / (1024 * 1024 * 1024)).toFixed(2) + 'GB'
            }

            if (data[index].downloadspeed / 1024 < 1) {
              data[index].downloadspeed = data[index].downloadspeed + 'KB'
            } else if (data[index].downloadspeed / 1024 >= 1 && data[index].downloadspeed / 1024 < 1024) {
              data[index].downloadspeed = (data[index].downloadspeed / 1024).toFixed(2) + 'MB'
            } else {
              data[index].downloadspeed = (data[index].downloadspeed / (1024 * 1024)).toFixed(2) + 'GB'
            }
          }
          this.tableData = data
        }
      }).catch((err) => {
        console.log('请求失败', err)
        this.$message.error(err.message)
      })
    },
    // 获取可选角色
    getRole () {
      this.$get('/role/all').then((result) => {
        if (result.code === 200) {
          console.log(result.data)
          this.roleInfo = result.data
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
        if (this.newRolesFrom.storagesizeselect === '' || this.newRolesFrom.downloadspeedselect === '') { return }
        var data = {}
        data.name = this.newRolesFrom.name
        data.description = this.newRolesFrom.description
        data.pid = this.newRolesFrom.roleid
        data.storagesize = this.newRolesFrom.storagesize * this.newRolesFrom.storagesizeselect
        data.downloadspeed = this.newRolesFrom.downloadspeed * this.newRolesFrom.downloadspeedselect
        this.$post('/role/admin/add', data).then((result) => {
          if (result.code === 200) {
            this.$message.success('添加角色成功')
            // 隐藏对话框
            this.showAddRolesVisible = false
            // 重新获取用户信息列表
            this.getRolesInfo()
            this.getRole()
          }
        }).catch((err) => {
          this.$message.error(err.message)
        })
      })
    },
    // 展示编辑角色对话框
    async showEditRole (id) {
      console.log('点击了id为', id, '的角色编辑')
      console.log('发起请求，获取该用户')
      this.$get('/role/admin/' + id).then((result) => {
        if (result.code === 200) {
          this.editRolesFrom.id = result.data.id
          this.editRolesFrom.name = result.data.name
          this.editRolesFrom.description = result.data.description
          this.editRolesFrom.roleid = result.data.roleid

          if (result.data.storagesize / 1024 < 1) {
            this.editRolesFrom.storagesize = result.data.storagesize
            this.editRolesFrom.storagesizeselect = '1'
          } else if (result.data.storagesize / 1024 >= 1 && result.data.storagesize / 1024 < 1024) {
            this.editRolesFrom.storagesize = (result.data.storagesize / 1024).toFixed(2)
            this.editRolesFrom.storagesizeselect = '1024'
          } else {
            this.editRolesFrom.storagesize = (result.data.storagesize / (1024 * 1024)).toFixed(2)
            this.editRolesFrom.storagesizeselect = '1048576'
          }

          if (result.data.downloadspeed / 1024 < 1) {
            this.editRolesFrom.downloadspeed = result.data.downloadspeed
            this.editRolesFrom.storagesizeselect = '1'
          } else if (result.data.downloadspeed / 1024 >= 1 && result.data.downloadspeed / 1024 < 1024) {
            this.editRolesFrom.downloadspeed = (result.data.downloadspeed / 1024).toFixed(2)
            this.editRolesFrom.downloadspeedselect = '1024'
          } else {
            this.editRolesFrom.downloadspeed = (result.data.downloadspeed / (1024 * 1024)).toFixed(2)
            this.editRolesFrom.downloadspeedselect = '1048576'
          }
          this.editRolesVisible = true
        }
      }).catch((err) => {
        this.$message.error(err.message)
      })
    },
    // 编辑角色确定
    editRoles () {
      // 表单的预校验
      this.$refs.editRolesFromRef.validate(async valid => {
        console.log(valid)
        if (!valid) { return }
        if (this.editRolesFrom.storagesizeselect === '' || this.editRolesFrom.downloadspeedselect === '') { return }
        var data = {}
        data.id = this.editRolesFrom.id
        data.name = this.editRolesFrom.name
        data.description = this.editRolesFrom.description
        data.pid = this.editRolesFrom.roleid
        data.storagesize = this.editRolesFrom.storagesize * this.editRolesFrom.storagesizeselect
        data.downloadspeed = this.editRolesFrom.downloadspeed * this.editRolesFrom.downloadspeedselect
        this.$post('/role/admin/edit', data).then((result) => {
          if (result.code === 200) {
            this.$message.success('修改成功')
            // 隐藏对话框
            this.editRolesVisible = false
            // 重新获取用户信息列表
            this.getRolesInfo()
          }
        }).catch((err) => {
          this.$message.error(err.message)
        })
      })
    },
    // 监听编辑角色关闭，并重置当前表单
    editRolesClose () {
      this.$refs.editRolesFromRef.resetFields()
    },
    //  删除角色信息
    async deleteRoleById (roleinfo) {
      this.$confirm('此操作将永久删除角色：' + roleinfo.name + ', 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 调用删除接口
        console.log('调用删除角色接口')
        this.$get('/role/admin/delete/' + roleinfo.id).then((result) => {
          if (result.code === 200) {
            // 重新获取用户列表
            console.log('重新获取角色列表')
            this.$message.success('删除成功')
            this.getRole()
            this.getRolesInfo()
          }
        }).catch((err) => {
          this.$message.error(err.message)
        })
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
