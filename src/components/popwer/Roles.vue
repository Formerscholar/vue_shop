<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="addRoles =true">添加角色</el-button>
        </el-col>
      </el-row>

      <el-table :data="rolelist" border stripe>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row :class="['bdbottom',index ===0 ?'bdtop':'','vcenter']" v-for="(item,index) in scope.row.children"
                    :key="item.id">
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row,item.id)">
                  {{item.authName}}
                </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <el-row v-for="(item1,index1) in item.children" :key="item1.id"
                        :class="[index1 ===0 ?'':'bdtop','vcenter']">
                  <el-col :span="6">
                    <el-tag type="success" closable
                            @close="removeRightById(scope.row,item1.id)">
                      {{item1.authName}}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag v-for="item2 in item1.children" :key="item2.children" type="warning" closable
                            @close="removeRightById(scope.row,item2.id)">
                      {{item2.authName}}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"/>
        <el-table-column label="角色名称" prop="roleName"/>
        <el-table-column label="角色描述" prop="roleDesc"/>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit">
              编辑
            </el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
            <el-button size="mini" type="warning" icon="el-icon-setting" @click="showSetRightDialog(scope.row)">分配权限
            </el-button>
          </template>
        </el-table-column>
      </el-table>


    </el-card>

    <el-dialog
      title="分配权限"
      :visible.sync="SetRightDialogVisble"
      width="50%"
      @close="setRightDialogClosed">
      <el-tree :data="rightList" :props="treeProps" show-checkbox node-key="id" default-expand-all
               :default-checked-keys="defKeys" ref="treeRef"></el-tree>
      <span slot="footer" class="dialog-footer">
            <el-button @click="SetRightDialogVisble = false">取 消</el-button>
             <el-button type="primary" @click="allotRights">确 定</el-button>
          </span>
    </el-dialog>

  </div>
</template>

<script>
  export default {
    name: "Roles",
    data() {
      return {
        rolelist: [],
        addRoles: false,
        addRolesForm: {
          roleId: null,
          roleName: '',
          roleDesc: ''
        },
        addRolesRules: {
          roleName: [
            {required: true, message: '请输入角色名称', trigger: 'blur'},
            {min: 3, max: 10, message: '用户名长度在3-10之间', trigger: 'blur'}
          ],
          roleDesc: [
            {required: true, message: '请输入角色描述', trigger: 'blur'},
            {min: 3, max: 35, message: '密码长度在3-35之间', trigger: 'blur'}
          ]
        },
        SetRightDialogVisble: false,
        rightList: [],
        treeProps: {
          label: 'authName',
          children: "children"
        },
        defKeys: [],
        roleId: '',
      }
    }
    ,
    created() {
      this.getRolesList()
    }
    ,
    methods: {
      async getRolesList() {
        const {data: res} = await this.$http.get('roles')
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        this.rolelist = res.data
      },
      addRolesClosed() {
        this.$refs.addRolesRef.resetFields()
      },
      // addRolesUser(id) {
      //   console.log(id);
      //   this.$refs.addRolesRef.validate(async valid => {
      //     if (!valid) return
      //     const {data: res} = await this.$http.put('roles/' + id, {roleName: this.addRolesForm.roleName})
      //     if (res.meta.status !== 200) {
      //       return this.$message.error(res.meta.msg)
      //     }
      //     this.$message.success(res.meta.msg)
      //     this.addRoles = false
      //     this.getRolesList()
      //   })
      // },
      // async showEditRoles(id) {
      //   console.log(id);
      //   const {data: res} = await this.$http.get('roles/' + id)
      //   if (res.meta.status !== 200) {
      //     return this.$message.error(res.meta.msg)
      //   }
      //   this.addRolesForm = res.data
      //   this.addRoles = true
      //   console.log(this.addRolesForm);
      // },
      async removeRightById(role, rightId) {
        const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        if (confirmResult !== 'confirm') {
          return this.$message.info('取消了删除！')
        }
        const {data: res} = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        role.children = res.data
      },
      async showSetRightDialog(role) {
        this.roleId = role.id
        const {data: res} = await this.$http.get('rights/tree')

        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        this.rightList = res.data
        this.getLeafKeys(role, this.defKeys)
        this.SetRightDialogVisble = true
      },
      getLeafKeys(node, arr) {
        if (!node.children) {
          return arr.push(node.id)
        }
        node.children.forEach(item => this.getLeafKeys(item, arr))
      },
      setRightDialogClosed() {
        this.defKeys = []
      },
      async allotRights() {
        const keys = [
          ...this.$refs.treeRef.getCheckedKeys(),
          ...this.$refs.treeRef.getHalfCheckedKeys()
        ]
        const idStr = keys.join(',')
        console.log(idStr);
        const {data: res} = await this.$http.post(`roles/${this.roleId}/rights`, {rids: idStr})

        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success(res.meta.msg)
        this.getRolesList()
        this.SetRightDialogVisble = false
      }
    }
  }
</script>

<style lang="less" scoped>
  .el-tag {
    margin: 7px;
  }

  .bdtop {
    border-top: 1px solid #eee;
  }

  .bdbottom {
    border-bottom: 1px solid #eee;
  }

  .vcenter {
    display: flex;
    align-items: center;
  }
</style>