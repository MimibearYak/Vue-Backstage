<!--
 * @Description: 
 * @Version: 2.0
 * @Autor: Seven
 * @Date: 2021-03-30 14:32:15
 * @LastEditors: Seven
 * @LastEditTime: 2021-03-30 15:56:00
-->
<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-table :data='rightsList' border stripe>
        <el-table-column label="序号" type='index'></el-table-column>
        <el-table-column label="权限名称" prop="authName"></el-table-column>
        <el-table-column label="路径" prop="path"></el-table-column>
        <el-table-column label="权限等级">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level==='0'">一级</el-tag>
            <el-tag v-else-if="scope.row.level==='1'" type="success">二级</el-tag>
            <el-tag v-else type="warning">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data(){
    return{
      rightsList:[]
    }
  },
  created(){
    this.getRightsList()
  },
  methods:{
    /**
     * @description: 获取权限列表 判断状态提示 存储数据
     * @param {*} get list列表 tree树结构数据
     * @return {*}
     * @Date: 2021-03-30 15:09:06
     * @author: Seven
     */
    async getRightsList(){
      const {data:res}= await this.$http.get('rights/list')
      if(res.meta.status !==200){
        return this.$message.error('请求权限列表失败!')
      }
      this.rightsList=res.data
      console.log(this.rightsList)
      
    }
  }
};
</script>

<style>
</style>