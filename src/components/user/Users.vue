<!--
 * @Description: 
 * @Version: 2.0
 * @Autor: Seven
 * @Date: 2021-03-28 20:27:29
 * @LastEditors: Seven
 * @LastEditTime: 2021-04-01 20:21:57
-->
<template>
  <div class="">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter='20'>
        <el-col :span="8">
          <el-input placeholder="请输入内容" class="input-with-select" v-model="queryInfo.query" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click='getUserList'></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type='primary' @click="addDialogVisible=true">添加用户</el-button>
        </el-col>
      </el-row>
      <el-table
        :data="userList"
        border
        stripe
        >
        <el-table-column
          type='index'
          label="索引"
          >
        </el-table-column>
        <el-table-column
          prop="username"
          label="姓名"
          >
        </el-table-column>
        <el-table-column
          prop="email"
          label="邮箱"
          >
        </el-table-column>
        <el-table-column
          prop="mobile"
          label="电话"
          >
        </el-table-column>
        <el-table-column
          prop="role_name"
          label="角色"
          >
        </el-table-column>
        <el-table-column
          prop="mg_state"
          label="状态"
          >
          <!-- 自定义列模板 使用作用域插槽 通过scope.row获取当前行数据 -->
          <template slot-scope="scope">
            <el-switch 
              @change="userStateChange(scope.row)"
              v-model="scope.row.mg_state"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label='操作'>
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="修改用户" placement="top"
              :enterable='false'>
              <el-button type="primary" icon='el-icon-edit' size='mini' @click="showEditDialog(scope.row.id)"></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="删除用户" placement="top" :enterable='false'>
              <el-button type="danger" icon='el-icon-delete' size='mini' @click='removeUserByid(scope.row.id)'></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable='false'>
              <el-button type="warning" icon='el-icon-setting' size='mini' @click="showRoleDialog(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="queryInfo.pagenum"
        :page-sizes="[5, 8, 12, 14]"
        :page-size="queryInfo.pagesize"
        layout="total,sizes,prev, pager, next, jumper"
        :total="total">
      </el-pagination>

    </el-card>
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="50%"
      @close='addDialogClosed'
    >
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" class="demo-ruleForm">
        <el-form-item label="用户名:" prop="username">
          <el-input v-model="addForm.username" placeholder="新增用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码:" prop="password">
          <el-input v-model="addForm.password" show-password placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item label="邮箱:" prop="email">
          <el-input v-model="addForm.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item label="手机号码:" prop="mobile">
          <el-input v-model="addForm.mobile" placeholder="请输入手机号码"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="修改用户"
      :visible.sync="editDialogVisible"
      width="50%"
      @close='editDialogClosed'
    >
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px" class="demo-ruleForm">
        <el-form-item label="用户名:" prop="username" >
          <el-input v-model="editForm.username" placeholder="新增用户名" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱:" prop="email">
          <el-input v-model="editForm.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item label="手机号码:" prop="mobile">
          <el-input v-model="editForm.mobile" placeholder="请输入手机号码"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="分配角色"
      :visible.sync="roleDialogVisible"
      width="50%"
      @close='setDialogClosed'
    >
      <div>
        <p>当前用户: {{userInfo.username}}</p>
        <p>当前角色: {{userInfo.role_name}}</p>
        <p>分配新的角色:
          <el-select v-model="selectedRoleId" placeholder="请选择">
            <el-option
              v-for="item in rolesList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id">
            </el-option>
          </el-select>
        </p>
      </div>  
      <span slot="footer" class="dialog-footer">
        <el-button @click="roleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>       

<script>
export default {
  data(){
    return{
      //用户对象
      queryInfo:{
        query:'',
        pagenum:1,
        pagesize:12,
      },
      //用户数据
      userList:[],
      //总数据
      total:0,
      //对话框显示隐藏
      addDialogVisible:false,
      //添加用户的表单数据对象
      addForm:{
        username:'',
        password:'',
        email:'',
        phone:'',
      },
      //添加用户的效验规则
      addFormRules:{
        username:[
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          {min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: 'blur'}
        ],
        password:[
          { required: true, message: '请输入密码', trigger: 'blur' },
          {min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur'}
        ],
        email:[
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          {pattern:/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/,message:'邮箱格式不正确',trigger:'blur'}
        ],
        mobile:[
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          {pattern:/^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/,message:' 手机号格式不正确',trigger:'blur'}
        ],
      },
      //修改用户框的显示隐藏
      editDialogVisible:false,
      editForm:{

      },
      //修改用户验效
      editFormRules:{
        email:[
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          {pattern:/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/,message:'邮箱格式不正确',trigger:'blur'}
        ],
        mobile:[
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          {pattern:/^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/,message:' 手机号格式不正确',trigger:'blur'}
        ],
      },
      //分配窗口显示状态
      roleDialogVisible:false,
      //分配窗口用户信息
      userInfo:{},
      //角色数据
      rolesList:[],
      //已选择角色id
      selectedRoleId:null

    }
  },
  created(){
    this.getUserList()
  },
  methods:{
    /**
     * @description: 请求用户数据 判断状态码是否200 赋值给userList 
     * @param {*}
     * @return {*} 
     * @Date: 2021-03-28 23:13:39
     * @author: Seven
     */
    async getUserList(){
      const {data:res}= await this.$http.get('users',{
        params:this.queryInfo
      })
      if(res.meta.status!==200){
        return this.$message.error('获取用户列表失败')
      }
      this.userList=res.data.users
      this.total=res.data.total
    },
    /**
     * @description: 监听pagesize改变 数据里的pagesize=用户选择的 再调用
     *               重新获取数据
     * @param {*} pagesize 用户选择pagesize
     * @return {*}
     * @Date: 2021-03-29 10:36:03
     * @author: Seven
     */
    handleSizeChange(pagesize) {
      this.queryInfo.pagesize=pagesize
      this.getUserList()
    },
    /**
     * @description: 监听当前页码改变 改变对象里的数据 重新请求
     * @param {*} pagenum 用户选择页码
     * @return {*}
     * @Date: 2021-03-29 10:36:07
     * @author: Seven
     */
    handleCurrentChange(pagenum) {
      this.queryInfo.pagenum=pagenum
      this.getUserList()
    },
    /**
     * @description: 监听switch用户状态更新 如果状态不是200更新无效
     * @param {*} userinfo 用户对象
     * @return {*}
     * @Date: 2021-03-29 11:20:33
     * @author: Seven
     */
    async userStateChange(userinfo){
      const{data:res}= await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
      if(res.meta.status!==200){
        userinfo.mg_state=!userinfo.mg_state
        return this.$message.error('更新用户状态失败!')
      }
      this.$message.success('更新用户状态成功!')
    },
    /**
     * @description: 监听添加用户框的关闭事件 是哟nrefs拿到Form 调用
    *                resetFields重置表单
     * @param {*}
     * @return {*}
     * @Date: 2021-03-29 15:56:55
     * @author: Seven
     */
    addDialogClosed(){
      this.$refs.addFormRef.resetFields()
    },
    /**
     * @description: 用户添加提示框添加用户
     *               拿到Form表单 使用validate验效 如果失败 结束
     *               成功 发送请求添加 状态码异常提示失败 关闭窗口 刷新
     * @param {*}
     * @return {*}
     * @Date: 2021-03-29 16:16:21
     * @author: Seven
     */
    addUser(){
      this.$refs.addFormRef.validate(async valid=>{
        if(!valid){
          this.$message.error('效验失败!')
          return
        }
        const{data:res}=await this.$http.post('users',this.addForm)
        if(res.meta.status<200||res.meta.status>300){
          return this.$message.error('添加用户失败!')
        }
        this.addDialogVisible=false
        this.getUserList()
        this.$message.success('添加用户成功!')
      })
    },
    /**
     * @description: 显示编辑用户对话框 发送请求 如果状态异常结束 赋值查询到
     *               的id的用户到editForm对象里 改变窗口为显示
     * @param {*} id 点击修改的用户的id
     * @return {*}
     * @Date: 2021-03-29 18:00:49
     * @author: Seven
     */
    async showEditDialog(id){
      const {data:res}=await this.$http.get(`users/${id}`)
      if(res.meta.status!==200){
        return this.$message.error('查询用户失败!')
      }
      this.editForm=res.data
      this.editDialogVisible=true
    },
    /**
     * @description: 修改用户数据  拿到表单对象 效验数据 查询被修改数据判断状              态码 成功关闭窗口 刷新数据 提示
     * @param {*}
     * @return {*}
     * @Date: 2021-03-29 18:14:45
     * @author: Seven
     */
    editUser(){
      this.$refs.editFormRef.validate(async valid=>{
        if(!valid){
          return this.$message.error('效验失败!')
        }
        const {data:res} =await this.$http.put(`users/${this.editForm.id}`,{
          email:this.editForm.email,
          mobile:this.editForm.mobile
        })
        if(res.meta.status!==200){
          return this.$message.error('修改用户失败!')
        }
        this.editDialogVisible=false
        this.getUserList()
        this.success.$messag.success('修改成功!')
      })
    },
    /**
     * @description: edit修改用户关闭重置
     * @param {*}
     * @return {*}
     * @Date: 2021-03-29 18:32:05
     * @author: Seven
     */
    editDialogClosed(){
      this.$refs.editFormRef.resetFields()
    },
    /**
     * @description: 根据用户id来删除用户 发送delete请求 判断提示 刷新列表
     * @param {*} id 
     * @return {*} meassge
     * @Date: 2021-03-29 18:44:03
     * @author: Seven
     */
    removeUserByid(id){
      this.$confirm('确定要删除该用户嘛?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const{data:res}=await this.$http.delete(`users/${id}`)
        if(res.meta.status!==200){
          return this.$http.error('删除错误!')
        }
        this.getUserList()
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        }); 
      })
    },
    /**
     * @description: 分配角色对话框 把userInfo存到数据层里 发送请求角色类型
     *               判断状态 拿到存储角色 显示窗口
     * @param {*} userInfo 用户信息
     * @return {*}
     * @Date: 2021-03-30 13:28:06
     * @author: Seven
     */
    async showRoleDialog(userInfo){
      this.userInfo=userInfo
      const {data:res}=await this.$http.get('roles')
      if(res.meta.status!==200){
        return this.$message.error('请求失败')
      }
      this.rolesList=res.data
      console.log(this.rolesList)
      this.roleDialogVisible=true
      
    },
    /**
     * @description: 监听分配窗口关闭事件 清空选择残留
     * @param {*}
     * @return {*}
     * @Date: 2021-03-30 13:35:46
     * @author: Seven
     */
    setDialogClosed(){
      this.selectedRoleId=null
      this.userinfo={}
    },
    /**
     * @description: 分配角色 确定按钮 判断是否选择角色 发送修改请求 判断状态
     *               是否成功 提示用户 刷新用户列表 关闭窗口
     * @param {*}
     * @return {*}
     * @Date: 2021-03-30 13:36:33
     * @author: Seven
     */
    async allotRole(){  
      if(!this.selectedRoleId){
        this.$message.error('请选择一个角色,或者关闭窗口!')
      }
      const {data:res}= await this.$http.put(`users/${this.userInfo.id}/role`,{rid:this.selectedRoleId})
      if(res.meta.status!==200){
        return this.$message.error('更新角色失败!')
      }
      this.$message.success('更新角色完成!')
      this.getUserList()
      this.roleDialogVisible=false
    }
  },
};
</script>

<style scoped lang='stylus'>

</style>