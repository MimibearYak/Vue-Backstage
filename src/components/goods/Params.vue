<!--
 * @Description: 
 * @Version: 2.0
 * @Autor: Seven
 * @Date: 2021-04-01 20:26:47
 * @LastEditors: Seven
 * @LastEditTime: 2021-04-04 00:13:18
-->
<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert
        title="注意:只允许为第三级分类设置相关参数!"
        type="warning"
        :closable='false'
        show-icon>
      </el-alert>
      <el-row class='cat_select'>
        <el-col>
          <span>选择商品分类 : </span>
          <el-cascader
          v-model="selectedKeys"
          :options="cateList  "
          :props="cascaderProps"
          @change="handleChange"
          clearable 
          >
          </el-cascader>
        </el-col>
      </el-row>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button size='mini' type='primary' :disabled="btnDisabled" @click="addDialogVisible=true">添加参数</el-button>
          <el-table :data='paramsData' border stripe>
            <el-table-column label='明细' type='expand'>
              <template slot-scope='scope'>
                <el-tag
                  :key="i"
                  v-for="(item,i) in scope.row.attr_vals"
                  closable
                  @close="handleClose(scope.row,i)">
                  {{item}}
                </el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column label='序号' type='index'></el-table-column>
            <el-table-column label='参数名称' prop="attr_name"></el-table-column>
            <el-table-column label='操作'>
              <template slot-scope='scope'>
                <el-button type='primary' icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                <el-button type='danger' icon="el-icon-delete" size="mini" @click="removeParams(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button size='mini' type='primary' :disabled="btnDisabled" @click="addDialogVisible=true">添加属性</el-button>
          <el-table :data='paramsData' border stripe>
            <el-table-column label='明细' type='expand'>
              <template slot-scope='scope'>
                <el-tag
                  :key="i"
                  v-for="(item,i) in scope.row.attr_vals"
                  closable
                  @close="handleClose(scope.row,i)">
                  {{item}}
                </el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column label='序号' type='index'></el-table-column>
            <el-table-column label='属性名称' prop="attr_name"></el-table-column>
            <el-table-column label='操作'>
              <template slot-scope='scope'>
                <el-button type='primary' icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                <el-button type='danger' icon="el-icon-delete" size="mini" @click="removeParams(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <el-dialog
      :title='"添加"+title'
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
      >
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
        <el-form-item :label="title" prop="attr_name">
          <el-input v-model="addForm.attr_name" placeholder="请输入添加参数"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title='修改'
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
      >
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
        <el-form-item :label="title" prop="attr_name">
          <el-input v-model="editForm.attr_name" placeholder="请输入添加参数"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>  
</template>

<script>
export default {
  data(){
    return{
      //所有分类
      cateList:[],
      //级联选择器属性配置
      cascaderProps:{
        label:'cat_name', //指定选项标签为选项对象的某个属性值	
        value:'cat_id', //指定选项的值为选项对象的某个属性值	
        children:'children',  //指定选项的子选项为选项对象的某个属性值
        expandTrigger:'hover'
      },
      //级联选择器选中id数组
      selectedKeys:[],
      //tabs当前激活项name
      activeName:'many',
      //分类参数数据
      paramsData:[],
      //添加弹框显示标记
      addDialogVisible:false,
      //add表单对象
      addForm:{},
      //add表单效验
      addFormRules:{
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' },
        ],
      },
      editDialogVisible:false,
      //edit表单对象
      editForm:{},
      //edit表单效验
      editFormRules:{
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' },
        ],
      },
      //detailed tag input flag
    }
  },
  created(){
    this.getCateList()
  },
  computed:{
    //当前选择的三级分类的id
    catId(){
      return this.selectedKeys.length===3? this.selectedKeys[2]:null
    },
    //控制添加属性标记
    btnDisabled(){
      return this.selectedKeys.length===3? false:true
    },
    //添加弹框的title
    title(){
      return this.activeName==='many'?'动态参数':'静态属性'
    }
  },
  methods:{
    /**
     * @description: 获取列表分类 判断状态 数据仓库存储
     * @param {*}
     * @return {*}
     * @Date: 2021-04-01 21:20:27
     * @author: Seven
     */
    async getCateList(){
      const {data:res}=await this.$http.get('categories')
      if(res.meta.status!==200){
        return this.$message.error('获取商品分类失败!')
      }
      this.cateList=res.data
      console.log(this.cateList)
    },
    /**
     * @description: 监听级联选择改变事件 调用获取参数函数getParamsData
     *               
     * @param {*}
     * @return {*}
     * @Date: 2021-04-02 13:18:53
     * @author: Seven
     */
    handleChange(){
      this.getParamsData()
    },
    /**
     * @description: 获取分类参数函数 判断是否是三级分类 如果不是重置
     *               根据所选 发送请求携带判断catid计算属性判断是否三级id
     *               判断所选标签类activename 判断状态 数据参考存储数据
     * @param {*}
     * @return {*}
     * @Date: 2021-04-02 21:54:22
     * @author: Seven
     */
    async getParamsData(){
      if(this.selectedKeys.length!==3){
        this.selectedKeys=[]
        this.paramsData=[]
        return this.$message.info('请选择三级分类')
      }
      const{data:res} =await this.$http.get(`categories/${this.catId}/attributes`,{
        params:{
          sel:this.activeName
        }
      })
      if(res.meta.status!==200){
        return this.$message.error('获取参数失败!')
      }
      //对此参数明细进行处理
      res.data.forEach(item=>{
        item.attr_vals=item.attr_vals?item.attr_vals.split(' '):[]
        item.inputVisible=false// detail input sign
        item.inputValue=''//detail input value
      })
      this.paramsData=res.data
      console.log(res.data)
    },
    /**
     * @description: tabs点击事件 标签也改变重新获取
     * @param {*}
     * @return {*}
     * @Date: 2021-04-02 21:40:46
     * @author: Seven
     */
    handleClick(){
      this.getParamsData()
    },
    /**
     * @description:添加弹框关闭事件 清除表单未添加数据残留
     * @param {*}
     * @return {*}
     * @Date: 2021-04-02 23:54:53
     * @author: Seven
     */
    addDialogClosed(){
      this.$refs.addFormRef.resetFields()
    },
    /**
     * @description: 添加弹框确认监听 效验表单 发送post请求写到id name 分类
     *               
     * @param {*}
     * @return {*}
     * @Date: 2021-04-03 00:14:19
     * @author: Seven
     */
    addParams(){
      this.$refs.addFormRef.validate(async valid=>{
        if(!valid){
          return this.$message.error('表单效验失败!')
        }
      
        const{data:res} = await this.$http.post(`categories/${this.catId}/attributes`,{
          attr_name:this.addForm.attr_name,
          attr_sel:this.activeName
        })
        if(res.meta.status!==201){
          this.$message.error('添加请求失败!')
        }
        this.addDialogVisible=false
        this.getParamsData()
        this.$message.success('添加参数成功!')
      })
    },
    /**
     * @description: 
     * @param {*} id scope.row.attr_id 
     * @return {*}
     * @Date: 2021-04-03 13:03:37
     * @author: Seven
     */
    removeParams(id){
      this.$confirm('确定要删除该参数吗', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const{data:res} = await this.$http.delete(`categories/${this.catId}/attributes/${id}`)
        if(res.meta.status!==200){
          return this.$message.error('删除请求失败!')
        }
        console.log(111112)
        this.getParamsData()
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除!'
        });          
      });
    },
    /**
     * @description: 显示编辑对话框
     * @param {*}id 编辑id
     * @return {*}
     * @Date: 2021-04-03 13:31:31
     * @author: Seven
     */
    async showEditDialog(id){
      this.editid=id
      const{data:res} = await this.$http.get(`/categories/${this.catId}/attributes/${id}`,{
        params:{attr_sel:this.activeName}
      })
      if(res.meta.status!==200){
        return this.$message.error('修改请求失败!')
      }
      this.editForm=res.data
      this.editDialogVisible=true

    },
    editDialogClosed(){
      this.$refs.editFormRef.resetFields()
    },
    
    editParams(){
      this.$refs.editFormRef.validate(async valid=>{
        if(!valid){
          return this.$message.error('修改验效失败!')
        }
        const{data:res}=await this.$http.put(`categories/${this.catId}/attributes/${this.editForm.attr_id}`,{
          attr_name:this.editForm.attr_name,
          attr_sel:this.activeName,
          attr_vals:this.editForm.attr_vals
        })
        if(res.meta.status!==200){
          return this.$message.error('修改参数名称失败!')
        }
        this.getParamsData()
        this.editDialogVisible=false
        this.$message.success('修改参数名称成功!')
      })
    },
    /**
     * @description: 明细 tag new tag input点击 状态打开 焦点定位
     * @param {*}
     * @return {*}
     * @Date: 2021-04-03 16:50:32
     * @author: Seven
     */
    showInput(row){
      row.inputVisible=true
      this.$nextTick(() =>{
        //获取输入框
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    /**
     * @description: detail input enter blur 判断去空格后有没有值
     *               添加进接口数据数组 调用updateParamsDetail更新数据
     * @param {*}row scope.row
     * @return {*}
     * @Date: 2021-04-03 17:06:53
     * @author: Seven
     */
    handleInputConfirm(row){
      if(row.inputValue.trim()){
        row.attr_vals.push(row.inputValue.trim()) 
        this.updateParamsDetail(row)
      }
      row.inputVisible=false
      row.inputValue=''
    },
    /**
     * @description: 更新数据
     * @param {*} row scope.row 
     * @param {*} this.catId 级联三级
     * @param {*} row.attr_id 接口数据数组tag项
     * @return {*}
     * @Date: 2021-04-03 23:48:22
     * @author: Seven
     */
    async updateParamsDetail(row){
      const{data:res}= await this.$http.put(`categories/${this.catId}/attributes/${row.attr_id}`,{
        attr_name:row.attr_name,
        attr_sel:row.attr_sel,
        attr_vals:row.attr_vals.join(' ')
      })
      if(res.meta.status!==200){
        return this.status.error('更新失败!')
      }
      this.$message.success('更新成功!')
    },
    /**
     * @description: detail tag delet splice key删除一位 重新获取
     * @param {*} row scope.row
     * @param {*} key for i
     * @return {*}
     * @Date: 2021-04-04 00:02:39
     * @author: Seven
     */
    async handleClose(row,key){
      row.attr_vals.splice(key,1)
      const{data:res}=await this.$http.put(`categories/${this.catId}/attributes/${row.attr_id}`,{
        attr_name:row.attr_name,
        attr_sel:row.attr_sel,
        attr_vals:row.attr_vals.join(' ')
      })
      if(res.meta.status!==200){
        return this.$message.error('删除失败!')
      }
      this.$message.success('删除成功!')
    }
  }
}
</script>

<style scope lang='stylus'>
  .cat_select
    margin 15px 0
  .el-tag
    margin 0 16px 16px 0
  .input-new-tag
    width 120px
</style>