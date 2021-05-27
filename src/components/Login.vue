<!--
 * @Description: 
 * @Version: 2.0
 * @Autor: Seven
 * @Date: 2021-03-25 20:15:31
 * @LastEditors: Seven
 * @LastEditTime: 2021-03-29 10:32:51
-->
<template>
  <div class="login-container">
    <div class="login-left">
      <img src="../assets/imgs/login_img.png" alt="" />
    </div>
    <div class="login-box">
      <div class="avatar-box">
        <img src="../assets/imgs/login_logo.png" alt="" />
      </div>
      <div class="title">
        电商后台管理系统
      </div>
      <el-form ref="loginFormRef" class='login-form' :model='loginForm' :rules='loginFormRules'>
        <el-form-item prop="username">
          <el-input placeholder="请输入用户名" 
            prefix-icon="iconfont icon-user"
            v-model="loginForm.username"
          >
          
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input placeholder="请输入密码" 
            prefix-icon="iconfont icon-lock_fill"
            v-model="loginForm.password"
            show-password
          >
          </el-input>
        </el-form-item>
        <el-form-item >
          <el-button type="primary" class='login-btn' @click='login'>登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginForm:{
        username:'',
        password:''
      },
      loginFormRules:{
        username:[
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          {min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: 'blur'}
        ],
        password:[
          { required: true, message: '请输入密码', trigger: 'blur' },
          {min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur'}
        ]
      },
    }
  },
  methods:{
    /**
     * @description: 通过ref拿到表单对象 validate对整个表单进行验证 回调
     * if valid 如果验证失败 结束 element失败提示 结束 element成功提示 
     * this.$router.push 编程式导航跳转 保存用户信息
     * @param {*}
     * @return {*}
     * @Date: 2021-03-27 20:23:50
     * @author: Seven
     */
    login(){
      //Form 验证
      this.$refs.loginFormRef.validate(async valid=>{
        if(!valid){
          return
        }
        console.log('send out message')
        const {data:res}= await this.$http.post('login',this.loginForm)
        console.log(res)
        
        if(res.meta.status!=200){
          return this.$message.error('登录失败');
        }
        this.$message.success('登录成功')
        sessionStorage.setItem('userInfo',JSON.stringify(res.data))
        this.$router.push('/home')
      })
    }
  }
};
</script>

<style scoped lang='stylus'>
.login-container
  img 
    user-select none
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #93defe;
  height: 100%;
  .login-left 
    margin-left: 100px;
  .login-box 
    position: relative;
    width: 400px;
    height: 350px;
    background: #fff;
    margin-left 100px
    padding: 50px;
    border-radius: 6px;
    box-sizing: border-box;
    .avatar-box 
      position: absolute;
      top: -60px;
      right: 140px;
      width: 120px;
      height: 120px;
      border: 5px solid #93defe;
      border-radius: 100px;
      text-align: center;
      line-height: 120px;
      background #fff
    .title 
      position: absolute;
      top: 100px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 18px;
      color: #444;
    .login-form
      position absolute
      bottom 0
      left 50%
      width 80%
      transform  translate(-50%)
      padding 0 20px
      box-sizing border-box
      .login-btn
        width 100%
</style>