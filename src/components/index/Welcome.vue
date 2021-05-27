<!--
 * @Description: 
 * @Version: 2.0
 * @Autor: Seven
 * @Date: 2021-03-28 19:25:11
 * @LastEditors: Seven
 * @LastEditTime: 2021-04-13 17:15:34
-->
<template>
  <div class="div">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>欢迎页</el-breadcrumb-item>
    </el-breadcrumb>
    
    <el-row :gutter="10">
      <el-col :span='6'>
        <div class="statistics" style="background:#409eff">
          <div class="title">
            <p>用户统计</p>
            <el-tag size="mini" type="success">实时</el-tag>
          </div>
          <div class="num">{{totalUsers}}</div>
          <div class="tip">当前用户总数量:{{totalUsers}}</div>
        </div>
      </el-col>
      <el-col :span='6'>
        <div class="statistics" style="background:#e6a23c">
          <div class="title" >
            <p>商品统计</p>
            <el-tag size="mini" type="info">实时</el-tag>
          </div>
          <div class="num">{{totalGoods}}</div>
          <div class="tip">当前商品总数量:{{totalGoods}}</div>
        </div>
      </el-col>
      <el-col :span='6'>
        <div class="statistics" style="background:#47c23a">
          <div class="title">
            <p>订单统计</p>
            <el-tag size="mini" type="warning">实时</el-tag>
          </div>
          <div class="num">{{Orders}}</div>
          <div class="tip">当前订单总数量:{{Orders}}</div>
        </div>
      </el-col>
      <el-col :span='6'>
        <div class="statistics" style="background:#909399">
          <div class="title">
            <p>销售</p>
            <el-tag size="mini" type="danger">实时</el-tag>
          </div>
          <div class="num">{{totalSales}}</div>
          <div class="tip">当前总销售额:{{totalSales}}(元)</div>
        </div>
      </el-col>
    </el-row>
    <div class="echarts-container">
      <el-card id='chart1'>

      </el-card>
      <el-card id='chart2'>
        
      </el-card>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts'

export default {
  data(){
    return{
      totalUsers:0,
      totalGoods:0,
      Orders:0,
      totalSales:0,
      orderList:[],
    }
  },
  created(){
    this.getUserList()
    this.getGoodsList()
    this.getOrders()
  },
  methods:{
    async getUserList(){
      const{data:res}= await this.$http.get('users',{
        params:{
          pagenum:1,
          pagesize:1,
        }
      })
      if(res.meta.status!==200){
        return this.$message.error('获取用户数据失败!')
      }
      this.totalUsers=res.data.total
    },
    async getGoodsList(){
      const{data:res}= await this.$http.get('goods',{
        params:{
          pagenum:1,
          pagesize:1,
        }
      })
      if(res.meta.status!==200){
        return this.$message.error('获取商品数据失败!')
      }
      this.totalGoods=res.data.total
    },
    async getOrders(){
      const{data:res}= await this.$http.get('orders',)
      if(res.meta.status!==200){
        return this.$message.error('获取商品数据失败!')
      }
      console.log(res.data)
      this.Orders=res.data.total
      this.orderList=res.data.goods
      this.orderList.forEach(item=>{
        if(item.pay_status==='1'){
          this.totalSales+=item.order_price
        }
      })
      this.initChart1()
      this.initchart2()
    },
    /**
     * @description: echats图标 调用init初始化方法传入绘制位置 获取到标签
     * @param {*}
     * @return {*}
     * @Date: 2021-04-08 15:14:52
     * @author: Seven
     */
    initChart1(){
      var chart1=echarts.init(document.querySelector('#chart1'))
      var option = {
        title: {
          text: '订单趋势',
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'line',
          },
        },
        xAxis: {
          type: 'category',
          data: ["3.20",'03.21'], // ['03.20', '03.21'],
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            type: 'line',
            smooth: true,
            data: [260,406], // [260, 406]
          },
        ],
      }
       //处理数据 对orderlist里的createtime进行排序
      this.orderList.sort(function(a,b){
        return a.create_time-b.create_time
      })
      let data=[]
      this.orderList.forEach(item=>{
        if(item.pay_status==='1'){
          let key=this.$common.formatToDate(item.create_time)
          if(!data[key]){
            data[key]=item.order_price
          }else{
            data[key]+=item.order_price
          }
        }
      })
      for(let key in data){
        option.xAxis.data.push(key)
        option.series[0].data.push(data[key])
      }
      console.log(data)
      chart1.setOption(option)
    },
    initchart2(){
      let chart2=echarts.init(document.querySelector('#chart2'))
      var option2 = {
        title: {
          text: '订单状态',
        },
        tooltip: {
          trigger: 'item',
          formatter: '{b} : {c} ({d}%)',
        },
        legend: {
          orient: 'vertical',
          left: 'right',
          data: [],
        },
        series: [
          {
            name: '订单状态',
            type: 'pie',
            radius: '60%',
            center: ['50%', '60%'],
            data: [],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
              },
            },
          },
        ],
      }
      let data=[
        { 
          name:'已付款',
          value:0
        },
        {
          name:'未付款',
          value:0
        }
      ]
      this.orderList.forEach(item=>{
        if(item.pay_status==='1'){
          data[0].value++
        }else{
          data[1].value++
        }
      })
      console.log(data)
      for(var item of data){
        option2.legend.data.push(item.name)
        console.log(option2.legend)
        option2.series[0].data.push(item)
        console.log(option2.series)
      }
      chart2.setOption(option2)
    },
  }
};
</script>

<style scoped lang='stylus'>
  .echarts-container
    display flex 
    justify-content space-between
    margin-top 10px
    .el-card
      width 50%
      height 400px
      padding 20px
      margin 0 8px 
  .el-row
    padding 0 10px
    .statistics
      height 100px
      border-radius 4px
      padding 0 8px
      
      box-shadow 1px 1px 10px pink 
      color #fff
      .title
        display flex
        justify-content space-between
        align-items center
        p
          font-size 14px
          font-weight bold
      .num
        font-size 20px
        font-weight bold
        text-align center 
      .tip
        font-size 12px
</style>