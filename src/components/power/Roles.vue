<!--
 * @Description: 
 * @Version: 2.0
 * @Autor: Seven
 * @Date: 2021-03-30 15:56:32
 * @LastEditors: Seven
 * @LastEditTime: 2021-03-31 19:45:02
-->
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
          <el-button type='primary' @click='addDialogVisible=true'>添加角色</el-button>
        </el-col>
      </el-row>
      <el-table :data="rolesList" border stripe >
        <el-table-column label="明细" type="expand">
          <template slot-scope="scope">
            <el-row :class='{bdbottom:true,dbtop:i1==0,vcenter:true}' v-for="(item1,i1) in scope.row.children" :key='item1.id'>
              <el-col :span="5">
                <el-tag closable @close="removeRightByid(scope.row,item1.id)">
                  {{item1.authName}}
                </el-tag>
                <i class='el-icon-caret-right'></i>
              </el-col>
              <el-col :span="19">
                <el-row v-for="(item2,i2) in item1.children" :key="item2.id" :class="{dbtop:i2!=0,vcenter:true}">
                  <el-col :span='6'>
                    <el-tag closable type='success' @close="removeRightByid(scope.row,item2.id)">
                      {{item2.authName}}
                    </el-tag>
                    <i class='el-icon-caret-right'></i>
                  </el-col>
                  <el-col :span='18'>
                    <el-tag type='warning' closable v-for="(item3,i3) in item2.children" :key=item3.id @close="removeRightByid(scope.row,item3.id)">
                      {{item3.authName}}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column label="序号" type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" >
          <template slot-scope="scope">
            <el-tooltip effect='dark' content="编辑" placement='top'>
              <el-button size='mini' type='primary' icon='el-icon-edit' @click="showEditDialog(scope.row.id)">编辑</el-button>
            </el-tooltip>
            <el-tooltip effect='dark' content="删除" placement='top'>
              <el-button size='mini' type='danger' icon='el-icon-delete' @click='removeRoleById(scope.row.id)'>删除</el-button>
            </el-tooltip>
            <el-tooltip effect='dark' content="分配权限" placement='top'>
              <el-button size='mini' type='warning' icon='el-icon-setting' @click="showRightDialog(scope.row)">分配权限</el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog
      title="添加角色"
      :visible.sync="addDialogVisible"
      width="50%"
      @close='addRoleClosed'
      >
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addForm.roleName" placeholder="请添加角色"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addForm.roleDesc" placeholder="角色描述:"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false" >取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>
    
    <el-dialog
      title="编辑角色"
      :visible.sync="editDialogVisible"
      width="50%"
      @close='editRoleClosed'
      >
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editForm.roleName" placeholder="请添加角色"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editForm.roleDesc" placeholder="角色描述:"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false" >取 消</el-button>
        <el-button type="primary" @click="editRole">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="角色分配"
      :visible.sync="rightDialogVisible"
      width="50%"
      @close='rightDialogClosed'
      >
      <el-tree ref="treeRef" :data="rightsList" :props="treeProps" node-key='id' show-checkbox default-expand-all :default-checked-keys='defaultKeys'></el-tree>

      <span slot="footer" class="dialog-footer">
        <el-button @click="rightDialogVisible = false" >取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data(){
    return{
      //角色数据
      rolesList:[],
      //添加角色显示框
      addDialogVisible:false,
      addForm:{
        roleName:'',
        roleDesc:''
      },
      //表单效验规则
      addFormRules:{
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
        ],
        roleDesc:[
          { required: true, message: '请输入角色描述', trigger: 'blur' },
        ],
      },
      //编辑显示标记
      editDialogVisible:false,
      //edit 数据
      editForm:{},
      //edit 表单验效
      editFormRules:{
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
        ],
        roleDesc:[
          { required: true, message: '请输入角色描述', trigger: 'blur' },
        ],
      },
      //分配权限弹框
      rightDialogVisible:false,
      //分配权限所有数据列表
      rightsList:[],
      //树组件属性绑定对象显示
      treeProps:{
        label:'authName',
        children:'children'
      },
      //树组件属性默认选中值
      defaultKeys:[],
      //分配权限的角色id
      roleId:''
    }
  },
  created(){
    this.getRolesList()
  },
  methods:{
    /**
     * @description: 获取角色列表 请求 判断 存储数据
     * @param {*}
     * @return {*}
     * @Date: 2021-03-30 16:13:11
     * @author: Seven
     */
    async getRolesList(){
      const {data:res}=await this.$http.get('roles')
      if(res.meta.status!==200){
        return this.$message.error('获取用户列表失败!')
      }
      this.rolesList=res.data
      console.log(this.rolesList)
    },
    /**
     * @description: 添加角色 ref判断表单效验validate方法 发送添加请求
     *               判断请求状态 关闭窗口标记 刷新列表 重置信息清理残余
     *               提示用户
     * @param {*}
     * @return {*}
     * @Date: 2021-03-30 18:48:13
     * @author: Seven
     */
    addRole(){
      console.log(1)
      this.$refs.addFormRef.validate(async valid=>{
        if(!valid){
          return this.$message.error('添加角色失败!')
        }
      const{data:res} =await this.$http.post('roles',this.addForm)
        if(res.meta.status<200||res.meta.status>300){
          return this.$message.error('请求失败!')
        }
        this.addDialogVisible=false
        this.getRolesList()
        this.$refs.addFormRef.resetFields()
        this.$message.success('添加角色成功!')
      })
    },
    /**
     * @description: 数据残留处理
     * @param {*}
     * @return {*}
     * @Date: 2021-03-30 19:11:21
     * @author: Seven
     */
    addRoleClosed(){
      this.$refs.addFormRef.resetFields()
      this.$message({
        message: '取消添加!',
        type: 'warning'
      })
    },
    /**
     * @description: 编辑角色函数 根据id发送查询请求 判断状态
     *               存储数据 显示窗口
     * @param {*}
     * @return {*}
     * @Date: 2021-03-30 19:38:16
     * @author: Seven
     */
    async showEditDialog(id){
      const{data:res}= await this.$http.get(`roles/${id}`)
      if(res.meta.status!==200){
        return this.$message.error('编辑请求失败!')
      }
      this.editForm=res.data
      this.editDialogVisible=true
    },
    /**
     * @description: 编辑确定执行函数 验效表单 发送修改请求传入id名字 描述
     *               判断请求状态码 关闭窗口 刷新 提示修改完成
     * @param {*}
     * @return {*}
     * @Date: 2021-03-30 20:15:40
     * @author: Seven
     */
    editRole(){
      this.$refs.editFormRef.validate(async valid=>{
        if(!valid){
          return this.$message.error('验效失败!')
        }
        const{data:res} = await this.$http.put(`roles/${this.editForm.roleId}`,{
          roleName:this.editForm.roleName,
          roleDesc:this.editForm.roleDesc
        })
        if(res.meta.status!==200){
          return this.$message.error('修改角色失败!')
        }
        this.editDialogVisible=false
        this.getRolesList()
        this.$message.success('修改角色成功!')
      })
    },
    /**
     * @description: 清除数据残留 警告消息
     * @param {*}
     * @return {*}
     * @Date: 2021-03-30 20:27:17
     * @author: Seven
     */
    editRoleClosed(){
      this.$refs.editFormRef.resetFields()
      this.$message({
        message: '取消修改!',
        type: 'warning'
      })
    },
    /**
     * @description: 点击删除发送id 删除对应id角色 如果确定发送delete请求
     *               判断状态 执行刷新列表方法 提示删除成功与取消
     * @param {*} id
     * @return {*}
     * @Date: 2021-03-31 13:14:53
     * @author: Seven
     */
    removeRoleById(id){
      this.$confirm('确定要删除该角色吗?, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const {data:res}= await this.$http.delete(`roles/${id}`)
        if(res.meta.status!==200){
          return this.$message.error('删除角色失败!')
        }
        this.getRolesList()
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      });
    },
    
    /**
     * @description: 根据角色id删除角色权限 发送delete请求 携带角色对象 
     *               权限id 判断状态 刷新列表 提示
     * @param {*} role 角色对象 
     * @param {*} rightId 权限id
     * @return {*}
     * @Date: 2021-03-31 14:22:43
     * @author: Seven
     */
    removeRightByid(role,rightId){
      this.$confirm('确定要删除该权限吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const {data:res}= await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
        if(res.meta.status!==200){
          return this.$message.error('删除权限失败!')
        }
        //重新设置当前角色下的权限数据 不建议重新获取列表
        role.children= res.data 
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      });
    },
    /**
     * @description: 显示分配权限的弹框  获取所有权限列表请求type:tree
    *                判断状态 赋值数据仓库 
     * @param {*}
     * @return {*}
     * @Date: 2021-03-31 14:57:53
     * @author: Seven
     */
    async showRightDialog(role){
      const {data:res}= await this.$http.get('rights/tree')
      if(res.meta.status!==200){
        this.$message.error('获取列表失败!')
      }
      this.rightsList=res.data
      console.log(this.rightsList)

      this.getLeafKeys(role)
      //数据仓库存储当前分配角色id
      this.roleId=role.id
      console.log(this.defaultKeys)
      this.rightDialogVisible=true
    },
    /**
     * @description: 获取角色所有三级权限函数  判断是否是三级权限判断有没有
     *               children没有说明是最底层的返回对象id push进数据仓库
     *               如果有children递归判断
     * @param {*} node 节点 角色对象
     * @return {*}
     * @Date: 2021-03-31 16:03:31
     * @author: Seven
     */
    getLeafKeys(node){
      if(!node.children){
        return this.defaultKeys.push(node.id)
      }
      node.children.forEach(item=>{
        this.getLeafKeys(item)
      })
    },
    /**
     * @description:关闭分配权限弹框事件 清除默认权限选中数组 提示
     * @param {*}
     * @return {*}
     * @Date: 2021-03-31 15:01:16
     * @author: Seven
     */
    rightDialogClosed(){
      this.defaultKeys=[]
    },

    /**
     * @description: 分配角色权限确认按钮 通过ref获取到组件调用
     *               getCheckedKeys方法返回目前被选中的节点的 key 所组成的
     *               数组 getHalfCheckedNodes返回目前半选中的节点所组成的
     *               数组	keys为两个数组合并 idStr每个id已,分格 发送请求
     *               携带分配角色id和分配权限id 判断状态 关闭窗口
     * @param {*}
     * @return {*}
     * @Date: 2021-03-31 14:56:00
     * @author: Seven
     */
    async allotRights(){
      const keys= this.$refs.treeRef.getCheckedKeys().concat(this.$refs.treeRef.getHalfCheckedNodes())
      const idStr=keys.join(',')
      console.log(keys)
      const{data:res}=await this.$http.post(`roles/${this.roleId}/rights`,{
        rids:idStr
      })
      if(res.meta.status!==200){
        this.$message.error("分配权限失败!")
      }
      this.rightDialogVisible=false
      this.getRolesList()
      this.$message.success("分配权限成功!")
    },
  },
};
</script>

<style scope lang='stylus'>
  .el-tag
    margin 6px
  .bdbottom
    border-bottom 1px solid #eee   
  .dbtop
    border-top 1px solid #eee
  .vcenter
    display flex
    align-items center
</style>