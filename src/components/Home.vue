<!--
 * @Description: 
 * @Version: 2.0
 * @Autor: Seven
 * @Date: 2021-03-27 20:36:27
 * @LastEditors: Seven
 * @LastEditTime: 2021-03-30 14:29:33
-->
<template>
  <el-container>
    <el-header>
      <div class="left">
        <img src="../assets/imgs/shop.png" alt="" />
        <span>电商后台管理系统</span>
      </div>
      <div class="right">
        <span>欢迎您 : {{ userInfo.username }}</span>
        <el-button type="danger" size="mini" @click="logout">退出</el-button>
      </div>
    </el-header>

    <el-container>
      <el-aside width="200px">
        <div :class="isCollapse?'toggle-button el-icon-s-unfold toggle-btn-unfold':'toggle-button el-icon-s-fold toggle-btn-fold'" @click="isCollapse=!isCollapse"></div>
        <el-menu
          default-active="/welcome"
          class="el-menu-vertical-demo"
          unique-opened
          router
          :collapse='isCollapse'
          :collapse-transition='false'
        >
          <el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id">
            <template slot="title">
              <i :class="iconObj[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>
            <el-menu-item :index="'/'+subItem.path" v-for="subItem in item.children" :key="subItem.id">
              <i class='el-icon-menu'></i>
              {{subItem.authName}}
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      userInfo: null,
      menuList:[],
      iconObj:{
        '201':'iconfont icon-shouye',
        '125':'iconfont icon-users',
        '103':'iconfont icon-tijikongjian',
        '101':'iconfont icon-shangpin',
        '102':'iconfont icon-danju'
      },
      isCollapse:false,
    };
  },
  //页面加载赋值userInfo为sessionStoreage值
  created() {
    this.userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
    this.getMenuList()
  },
  methods: {
    /**
     * @description: 消息提示框 如果退出删除sessionStorage用户信息跳转login
     * @param {*}
     * @return {*}
     * @Date: 2021-03-27 21:26:45
     * @author: Seven
     */
    logout() {
      this.$confirm("确定要退出登录嘛？, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
      .then(() => {
        sessionStorage.clear(); //清除sessionStorage里的用户信息
        this.$message({
          type: "success",
          message: "退出成功!",
        });
        this.$router.push("/login");
      })
      .catch(() => {
        this.$message({
          type: "info",
          message: "已取消退出!",
        });
      });
    },
  /**
   * @description: 获取菜单列表 调用axios 获取data形参res
   * @param {*}
   * @return {*}
   * @Date: 2021-03-27 21:54:26
   * @author: Seven
   */  
    async getMenuList(){
      const {data:res}= await this.$http.get('menus')
      if(res.meta.status!==200){
        return this.$message.error(res.meta.msg)
      }
      this.menuList=res.data
      console.log(this.menuList)
    }
  },
};
</script>

<style scoped lang='stylus'>
.toggle-btn-fold{
  width 200px
}
.toggle-btn-unfold{
  width 64px
}
.el-container
  height: 100%;
  .el-header 
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 50px !important;
    background: url('../assets/imgs/header_bg.gif') repeat-x center;
    color: #fff;
    .left 
      display: flex;
      align-items: center;
      img 
        width: 40px;
        margin-right: 20px;
      span 
        font-size: 20px;
    .right 
      span 
        margin-right: 10px;
  .el-aside
    user-select none
    .toggle-button
      font-size 20px
      text-align center
      line-height 24px
      background #60779d
      
      color #fff
      border-top 1px solid #F56C6C
      letter-spacing .2rem
      cursor pointer
    .el-menu
      border-rihgt 0
      .iconfont
        margin-right 10px
  .el-main
    background #eaedf1
</style>