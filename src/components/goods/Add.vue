<!--
 * @Description: 
 * @Version: 2.0
 * @Autor: Seven
 * @Date: 2021-04-04 18:32:26
 * @LastEditors: Seven
 * @LastEditTime: 2021-04-06 16:28:47
-->
<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert
        title="增加商品信息"
        type="info"
        show-icon
        :closable='false'
        center 
        >
      </el-alert>

      <el-steps :active="parseInt(activeIndex)" finish-status="success" align-center :space='200' >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" label-position="top">
        <el-tabs v-model='activeIndex' tab-position="left" :before-leave='beforeTabLeave' @tab-click='tabClick'> 
          
          <el-tab-pane label="基本信息" name='0'>
            <el-form-item label="商品名称 : " prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格 : " prop="goods_price">
              <el-input v-model.number="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量 : " prop="goods_weight">
              <el-input v-model.number="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量 : " prop="goods_number">
              <el-input v-model.number="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类 : " >
              <el-cascader
                v-model="addForm.goods_cat"
                :options="cateList"
                :props="casecderProps"
                @change="handleChange">
              </el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name='1'>
            <el-form-item v-for="item in manyData" :key='item.attr_id' :label='item.attr_name'>
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox v-for="(value,i) in item.attr_vals" :key="i" :label="value" border size="mini"></el-checkbox>
              </el-checkbox-group>
            </el-form-item> 
          </el-tab-pane>
          <el-tab-pane label="商品属性" name='2'>
            <el-form-item v-for="item in onlyData" :key='item.attr_id' :label='item.attr_name'>
              <el-input v-model='item.attr_vals'></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name='3'>
            <!-- 指定上传后台地址 
                on-preview指定预览图片触发函数
                on-remove指定删除图片触发函数
                on-success上传成功回调
                list-tyoe 上传图片外观
                headers配置请求头
                由于上传并没有通过拦截器拿到token
            -->
            <el-upload
              :action="uploadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success='handleSuccess'
              :headers="headerObj"
              list-type="picture">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name='4'>
            <quill-editor
              ref="myQuillEditor"
              v-model="addForm.goods_introduce"
            />
            <el-button type='primary' @click="addGoods()">添加商品</el-button>
          </el-tab-pane>
          
        </el-tabs>
      </el-form>
    </el-card>
        
    <el-dialog
      title="预览"
      :visible.sync="previewVisible"
      width="60%"
      >
      <img :src='perviewPath' width="100%" height="100%" alt='!'>
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'

export default {
  data(){
    return{
      //Steps active
      activeIndex:'0',
      //表单对象
      addForm:{
        goods_name:'',
        goods_price:null,
        goods_weight:null,
        goods_number:null,
        //商品所属分类数组
        goods_cat:[],
        //图片数组
        pics:[],       
        //富文本编辑器内容
        goods_introduce:'',
        //many only
        attrs:[],
      },
      //表单效验规则
      addFormRules:{
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' },
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' },
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' },
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' },
        ],
      },
      //级联列表数据
      cateList:[],
      //配置选项，
      casecderProps:{
        label:'cat_name',//指定选项标签为选项对象的某个属性值
        value:'cat_id', //	指定选项的值为选项对象的某个属性
        children:'children',//指定选项的子选项为选项对象的某个属性值
        expandTrigger:'hover' //次级菜单的展开方式click / hover
      },
      //参数明细数据
      manyData:[],
      //属性数据
      onlyData:[],
      //图片上传地址
      uploadURL:'http://www.tangxiaoyang.vip:8888/api/v2/upload',
      //图片上传请求头
      headerObj:{
        Authorization:JSON.parse(sessionStorage.getItem('userInfo')).token
      },
      //预览loading状态
      previewVisible:false,
      //图片地址
      perviewPath:'',

    }
  },
  created(){
    this.getCateList()
  },
  methods:{
    /**
     * @description: 级联获取分类列表
     * @param {*}
     * @return {*}
     * @Date: 2021-04-04 20:49:01
     * @author: Seven
     */
    async getCateList(){
      const{data:res} =await this.$http.get('categories')
      if(res.meta.status!==200){
        return this.$message.error('获取分类失败!')
      }
      this.cateList=res.data
    },
    /**
     * @description: 监听级联改变
     * @param {*}
     * @return {*}
     * @Date: 2021-04-04 21:11:11
     * @author: Seven
     */
    handleChange(){
      if(this.addForm.goods_cat.length!==3){
        this.addForm.goods_cat=[]
        this.activeIndex='0'
        this.$message.error('请选择三级分类!')
      }
    },
    /**
     * @description: 钩子函数 
     * @param {*} activeName 去往
     * @param {*} oldactiveName 之前
     * @return {*}
     * @Date: 2021-04-04 21:12:11
     * @author: Seven
     */
    beforeTabLeave(activeName,oldactiveName){
      if(this.addForm.goods_cat.length!==3){
        this.$message.error('请先选择商品分类')
        return false
      }
    },
    /**
     * @description: 标签切换监听  判断是不是点击了参数和属性
     * @param {*}
     * @return {*}
     * @Date: 2021-04-04 21:31:34
     * @author: Seven
     */
    async tabClick(){
      if(this.activeIndex==='1'){
        const{data:res}=await this.$http.get(`categories/${this.cateId}/attributes`,{
          params:{sel:'many'}
        })
        if(res.meta.status!==200){
          return this.$message.error('获取参数失败!')
        }
        res.data.forEach(item=>{
          item.attr_vals=item.attr_vals?item.attr_vals.split(','):[]
        })
        this.manyData=res.data
      }else if(this.activeIndex==='2'){
        const{data:res}=await this.$http.get(`categories/${this.cateId}/attributes`,{
          params:{sel:'only'}
        })
        if(res.meta.status!==200){
          return this.$message.error('获取属性失败!')
        }
        this.onlyData=res.data
        console.log(this.onlyData)
      }
    },
    /**
     * @description: 预览图片触发函数
     * @param {file} on-preview钩子函数拿到点击图片详细
     * @return {*}
     * @Date: 2021-04-05 15:09:24
     * @author: Seven
     */
    handlePreview(file){
      this.previewVisible=true
      this.perviewPath=file.url
      console.log(file,'file')
    },
    /**
     * @description: 移除图片触发函数 拿到点击删除图片临时地址 
     *               调用findIndex循环搜索与数据仓库相符的地址 返回数据仓库
     *               点击图片所在下标 调用splice从该下标删除一个
     * @param {file} response
     * @return {*}
     * @Date: 2021-04-05 15:09:17
     * @author: Seven
     */
    handleRemove(file,fileList){
      const filePath=file.response.data.tmp_path
      const idx= this.addForm.pics.findIndex(item=>{
        item.pic===filePath
      })
      this.addForm.pics.splice(idx,1)
      console.log(this.addForm)
    },
    /**
     * @description: 图片上传成功
     * @param {*} response 返回图片信息地址
     * @param {*} file
     * @param {*} fileList
     * @return {*}
     * @Date: 2021-04-05 15:41:42
     * @author: Seven
     */
    handleSuccess(response, file, fileList){
      this.addForm.pics.push({
        pic:response.data.tmp_path
      })
      console.log(this.addForm)
    },
    /**
     * @description: 添加商品 效验表单 使用lodash深拷贝 将拷贝对象cat项
     *               转成字符串 处理静态动态参数 从数据仓库取出放到form对象
     *               里去 发送请求 携带from对象 路由跳转到商品页 
     * @param {*}
     * @return {*}
     * @Date: 2021-04-05 18:41:53
     * @author: Seven
     */
    addGoods(){
      this.$refs.addFormRef.validate(async valid=>{
        if(!valid){
          return this.$message.error('效验失败')
        }
        //导致数据关联异常
        // this.addForm.goods_cat=this.addForm.goods_cat.join(',')
        // const form=addForm 浅拷贝
        const form=_.cloneDeep(this.addForm)//深拷贝 lodash
        form.goods_cat=form.goods_cat.join(',')
        
        this.manyData.forEach(item=>{
          form.attrs.push({
            attr_id:item.attr_id,
            attr_value:item.attr_vals.join(' ')
          })
        })
        this.onlyData.forEach(item=>{
          form.attrs.push({
            attr_id:item.attr_id,
            attr_value:item.attr_value
          })
        })
        const {data:res} = await this.$http.post('goods',form)
        if(res.meta.status!==201){
          this.$message.error('添加失败!')
        }
        this.$message.success('添加成功!')
        this.$router.push('/goods')
      })
    },
  },
  computed:{
    cateId(){
      return this.addForm.goods_cat.length===3?this.addForm.goods_cat[2]:null
    }
  },
  
  
}
</script>

<style scoped lang='stylus'>
  .el-checkbox
    margin 0 auto
    margin-left 10px
  .el-button
    margin-top 16px
</style>