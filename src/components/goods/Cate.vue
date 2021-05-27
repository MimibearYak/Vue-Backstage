<!--
 * @Description: 
 * @Version: 2.0
 * @Autor: Seven
 * @Date: 2021-04-01 12:44:20
 * @LastEditors: Seven
 * @LastEditTime: 2021-04-01 20:20:33
-->
<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row>
        <el-col>
          <el-button type='primary' @click='showAddDialog'>添加分类</el-button>
        </el-col>
      </el-row>
      <tree-table class='tree-table' :data='cateList' :columns='columns' :selection-type='false' :expand-type='false' show-index border>
        <template slot='isOk' slot-scope=scope>
          <i class='el-icon-error' style='color:red' v-if="scope.row.cat_deleted"></i>
          <i class='el-icon-success ' style='color:lightgreen' v-else></i>
        </template>
        <template slot='order' slot-scope="scope">
          <el-tag size='mini' v-if="scope.row.cat_level===0">一级</el-tag>
          <el-tag size='mini' type="success" v-else-if="scope.row.cat_level===1">二级</el-tag>
          <el-tag size='mini' type="warning" v-else>三级</el-tag>
        </template>
        <template slot='operate' slot-scope='scope'>
          <el-tooltip class="item" effect="dark" content="编辑" placement="top">
            <el-button size='mini' type='primary' class='el-icon-edit' @click="showEditDialog(scope.row.cat_id)">编辑</el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <el-button size='mini' type='danger' class='el-icon-delete' @click='removeCateByid(scope.row.cat_id)'>删除</el-button>
          </el-tooltip>
        </template>
      </tree-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 12, 16]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
    <el-dialog
      title="增加分类"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClose"
      >
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
        <el-form-item label="分类名称 " prop="cat_name">
          <el-input v-model="addForm.cat_name" placeholder="请输入分类名称"></el-input>
        </el-form-item>
        <el-form-item label='父级分类'>
          <el-cascader
            v-model="selectedKeys"
            :options="parentCateList"
            :props="cascaderProps"
            @change="handleChange"
            clearable 
            >
          </el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>

      <el-dialog
      title="编辑分类"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClose"
      >
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
        <el-form-item label="编辑名称 " prop="cat_name">
          <el-input v-model="editForm.cat_name" placeholder="请输入分类名称"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data(){
    return{
      //列表数据请求配置
      queryInfo:{
        type:3,
        pagenum:1,
        pagesize:12
      },
      //分类列表
      cateList:[],
      //总记录数
      total:0,
      //tree-table列定义
      columns:[
        {
          label:'分类名称',
          prop:'cat_name'
        },
        {
          label:'是否有效',
          /**
           * 	列类型为 'template'(自定义列模板) 时，对应的作用域插槽（它可以
           *  获取到 row, rowIndex, column, columnIndex）名称
           */
          type:'template',//类型template
          template:'isOk',//模板名称
        },
        {
          label:'排序',
          type:'template',
          template:'order',
        },
        {
          label:'操作',
          type:'template',
          template:'operate',
        },
      ],
      //表单显示隐藏标记
      addDialogVisible:false,
      //表单数据对象
      addForm:{
        //分类名称
        cat_name:'',
        //分类id
        cat_pid:0,
        //分类等级
        cat_level:0
      },
      //表单验效规则
      addFormRules:{
        cat_name: [
          { required: true, message: '请输入分类名词', trigger: 'blur' },
        ],
      },
      //父级分类的所有列表
      parentCateList:[],
      //弹框 级联选择器配置项
      cascaderProps:{
        label:'cat_name',
        value:'cat_id',
        children:'children',
        expandTrigger:'hover',
        checkStrictly:true, //子父不关联任意选择
      },
      //级联选择器 选中id数组
      selectedKeys:[],
      //编辑弹框标记
      editDialogVisible:false,
      //编辑表单对象
      editForm:{},
      //编辑表单效验规则
      editFormRules:{
        cat_name: [
          { required: true, message: '请输入分类名词', trigger: 'blur' },
        ],
      },
    }
  },
  created(){
    this.getCateList()
  },
  methods:{
    /**
     * @description: 获取商品数据 发送get请求携带配置参数 判断请求状态
     *               数据仓库存储分类数据 存储total数据
     * @param {*} queryInfo配置对象
     * @return {*}
     * @Date: 2021-04-01 12:53:20
     * @author: Seven
     */
    async getCateList(){
      const {data:res} =await this.$http.get('categories',{
        params:this.queryInfo
      })
      if(res.meta.status!==200){
        return this.$message.error('获取数据失败 !')
      }
      this.cateList=res.data.result
      this.total=res.data.total
    },
    /**
     * @description: 监听当前分页条数size大小改变函数 触发赋值 刷新列表
     * @param {*} pagesize queryInfo对象里的属性
     * @return {*}
     * @Date: 2021-04-01 14:02:51
     * @author: Seven
     */
    handleSizeChange(pagesize){
      this.queryInfo.pagesize=pagesize
      this.getCateList();
    },
    /**
     * @description: 分页当前页码改变触发 把改变的最新页码赋值给info对象里的
     *               pagenum 重新发送请求 刷新
     * @param {*} pagenum 分页码
     * @return {*}
     * @Date: 2021-04-01 13:56:37
     * @author: Seven
     */
    handleCurrentChange(pagenum){
      this.queryInfo.pagenum=pagenum
      this.getCateList()
    },
    /**
     * @description: 点击添加按钮 调用方法获取所有父级分类 显示添加分类对话框
    *                
     * @param {*}
     * @return {*}
     * @Date: 2021-04-01 14:26:03
     * @author: Seven
     */
    showAddDialog(){
      this.getParentCateList()
      this.addDialogVisible=true
    },
    /**
     * @description: 获取父级所有分类列表 发送get请求 携带级别参数 判断状态
     *               数据仓库存储数据
     * @param {*} type 分类级别2级
     * @return {*}
     * @Date: 2021-04-01 14:41:10
     * @author: Seven
     */
     async getParentCateList(){
      const {data:res} =await this.$http.get('categories',{
        params:{type:2}
      })
      if(res.meta.status!==200){
        this.$message.error('获取数据分类失败!')
      }
      this.parentCateList=res.data
      console.log(res.data)
    },
    /**
     * @description: 级联选择器 选择触发监听事件 判断用户有没有改动级联选择器
     *               如果长度大于0说明已经改动 拿到数组最后一个值赋值给
    *                addForm对象里 分类等级为数组长度 赋值给addForm对象里
     *               如果级联没有变动全为0
     * @param {*}
     * @return {*}
     * @Date: 2021-04-01 14:53:15
     * @author: Seven
     */
    handleChange(){
      console.log(this.selectedKeys)
      if(this.selectedKeys.length>0){
        this.addForm.cat_pid=this.selectedKeys[this.selectedKeys.length-1]
        this.addForm.cat_level=this.selectedKeys.length
      }else{
        this.addForm.cat_pid=0
        this.addForm.cat_level=0
      }
    },
    /**
     * @description: 添加分类确定按钮 通过ref获取表单调用validate进行验效
     *               判断值是否符合 不符合结束提示 符合 发送post请求携带
     *               addform对象(分类名称 分类id 分类等级) 判断状态 关闭窗口
     *               刷新列表 提示
     * @param {*}
     * @return {*}
     * @Date: 2021-04-01 17:14:18
     * @author: Seven
     */
    addCate(){
      this.$refs.addFormRef.validate(async valid=>{
        if(!valid){
          return this.$$message.error('效验失败!')
        }
        const{data:res} =await this.$http.post('categories',this.addForm)
        if(res.meta.status<200||res.meta.status>=300){
          return this.$$message.error("添加失败!")
        }
        this.addDialogVisible=false
        this.getCateList()
        this.$message.success('添加成功!')
      })
    },
    /**
     * @description: 监听添加框关闭事件 清除表单数据残留 重置级联数据数组为空
     *               重置addForm对象里的 id 等级为0
     * @param {*} resetFields	对整个表单进行重置，将所有字段值重置为初始值并
    *                        移除校验结果
     * @return {*}
     * @Date: 2021-04-01 17:56:24
     * @author: Seven
     */
    addDialogClose(){
      this.$refs.addFormRef.resetFields()
      this.selectedKeys=[]
      this.addForm.cat_pid=0
      this.addForm.cat_level=0
    },
    /**
     * @description: 编辑关闭事件
     * @param {*}
     * @return {*}
     * @Date: 2021-04-01 18:34:28
     * @author: Seven
     */
    editDialogClose(){
      this.$refs.editFormRef.resetFields()
    },
    /**
     * @description: 点击编辑携带cat_id 发送get请求 判断状态 赋值到数据仓库
     *               显示编辑窗口
     * @param {*} cateId scope.row.cat_id编辑id
     * @return {*}
     * @Date: 2021-04-01 18:37:39
     * @author: Seven
     */
    async showEditDialog(cateId){
      const{data:res}=await this.$http.get(`categories/${cateId}`)
      if(res.meta.status!==200){
        return this.$message.error('编辑请求失败!')
      }
      this.editForm=res.data
      console.log(this.editForm)
      this.editDialogVisible=true
    },
    /**
     * @description: 编辑确定监听函数 
     * @param {*}
     * @return {*}
     * @Date: 2021-04-01 19:11:28
     * @author: Seven
     */
    editCate(){
      this.$refs.editFormRef.validate(async valid=>{
        if(!valid){
          return this.$message.error('编辑名称失败!')
        }
        const{data:res}=await this.$http.put(`categories/${this.editForm.cat_id}`,{
          cat_name:this.editForm.cat_name
        })
        if(res.meta.status!==200){
          this.$message.error('修改请求失败!')
        }
        this.editDialogVisible=false
        this.getCateList()
        this.$message.success('修改成功!')
      })
    },
    /**
     * @description: 删除商品分类函数 
     * @param {*} cateId scope.row.cat_id删除项id
     * @return {*}
     * @Date: 2021-04-01 20:08:15
     * @author: Seven
     */
    removeCateByid(cateId){
      this.$confirm('确定删除此项吗？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const {data:res}=await this.$http.delete(`categories/${cateId}`)
        if(res.meta.status!==200){
          this.$message.error('删除请求失败!')
        }
        this.getCateList()
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
    }
  },
}
</script>

<style scope lang='stylus'>
  .el-cascader
    width 100%
  .tree-table
    margin-top 15px
</style>