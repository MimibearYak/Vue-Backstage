<!--
 * @Description: 
 * @Version: 2.0
 * @Autor: Seven
 * @Date: 2021-04-04 00:29:30
 * @LastEditors: Seven
 * @LastEditTime: 2021-04-06 14:30:02
-->
<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row :gutter='20'>
        <el-col :span="8">
          <el-input placeholder="请输入内容" class="input-with-select" v-model="queryInfo.query" clearable @clear='getGoodsList'>
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList" ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type='primary' @click="goAddpage"> 添加商品</el-button>
        </el-col>
      </el-row>
      <el-table :data='goodsList' border stripe >
        <el-table-column label="序号" type="index"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column label="商品价格" prop="goods_price" width="100px"></el-table-column>
        <el-table-column label="商品重量" prop="goods_weight" width="70px"></el-table-column>
        <el-table-column label="创建时间" prop="add_time" width="150px"></el-table-column>
        <el-table-column label="操作" width="130px">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit" @click="goEditpage(scope.row.goods_id)"></el-button>
            <el-button size="mini" type="warning" icon="el-icon-delete" @click="removeById(scope.row.goods_id)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5,10,15,20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
  </div>  
</template>

<script>
export default {
  data(){
    return{
      //表单查询对象
      queryInfo:{
        query:'',
        pagenum:1,
        pagesize:10
      },
      //列表数据
      goodsList:[],
      //列表总数
      total:0
    }
  },
  created(){
    this.getGoodsList()
  },
  methods:{
    /**
     * @description: 获取商品列表 获取query携带信息内容
     * @param {*}
     * @return {*}
     * @Date: 2021-04-04 00:39:31
     * @author: Seven
     */
    async getGoodsList(){
      const{data:res}= await this.$http.get('goods',{
        params:this.queryInfo
      })
      if(res.meta.status!==200){
        return this.$message.error('列表获取失败!')
      }
      for(let item of res.data.goods){
        item.add_time=this.$common.formatToTime(item.add_time)
      }
      this.goodsList=res.data.goods
      this.total=res.data.total
      console.log(this.goodsList)
    },
    /**
     * @description: 分页大小改变 重新获取
     * @param {*}
     * @return {*}
     * @Date: 2021-04-04 18:06:57
     * @author: Seven
     */
    handleSizeChange(pagesize){
      this.queryInfo.pagesize=pagesize
      this.getGoodsList()
    },
    /**
     * @description: 监听页码改变 重新获取
     * @param {*}
     * @return {*}
     * @Date: 2021-04-04 18:09:04
     * @author: Seven
     */
    handleCurrentChange(pagenum){
      this.queryInfo.pagenum=pagenum
      this.getGoodsList()
    },
    /**
     * @description: 
     * @param {*} Gid scope.row.goods_id
     * @return {*}
     * @Date: 2021-04-04 18:18:50
     * @author: Seven
     */
    removeById(Gid){
      this.$confirm('确定要删除该商品嘛?','提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const {data:res} =await this.$http.delete(`goods/${Gid}`)
        if(res.meta.status!==200){
          return this.$message.error('删除失败!')
        }
        this.getGoodsList()
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
     * @description: 添加商品 编程导航
     * @param {*}
     * @return {*}
     * @Date: 2021-04-04 18:33:26
     * @author: Seven
     */
    goAddpage(){
      this.$router.push('/goods/Add')
    },
    /**
     * @description: 编辑按钮监听 路由跳转编辑页
     * @param {id} scope.row.goods_id
     * @return {*}
     * @Date: 2021-04-05 19:59:43
     * @author: Seven
     */
    goEditpage(id){
      this.$router.push(`/goods/edit?id=${id}`)
    }
  },
}
</script>

<style>

</style>