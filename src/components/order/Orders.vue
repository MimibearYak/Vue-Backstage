<!--
 * @Description: 
 * @Version: 2.0
 * @Autor: Seven
 * @Date: 2021-04-06 16:38:06
 * @LastEditors: Seven
 * @LastEditTime: 2021-04-08 14:36:16
-->
<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row :gutter='20'>
        <el-col :span="8">
          <el-input placeholder="请输入订单编号" v-model="queryInfo.query" clearable @clear="getOrderList">
            <el-button slot="append" icon="el-icon-search" @click="getOrderList"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <el-table :data='orderList' border stripe @expand-change="getOrderDetal">
        <el-table-column label="明细" type="expand">
          <template slot-scope="scope">
            <el-table :data="scope.row.detail" border stripe >
              <el-table-column label="封面" width="100px" header-align="center" align="center">
                <template slot-scope="sc">
                  <el-popover
                    placement="top-start"
                    trigger="hover">
                      <img :src="sc.row.url" slot="reference" width="50px" height="50px" alt="!">
                      <img :src="sc.row.url"  width="200px" height="200px" alt="!">
                  </el-popover>
                </template>
              </el-table-column>
              <el-table-column label="商品名称" prop="goods_name"></el-table-column>
              <el-table-column label="商品重量" width="100px" prop="goods_weight"></el-table-column>
              <el-table-column label="商品数量" width="100px" prop="goods_number"></el-table-column>
              <el-table-column label="商品价格(元)" width="100px" prop="goods_price"></el-table-column>
              <el-table-column label="总价" width="100px" prop="goods_total_price"></el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column label="序号" type="index"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column label="订单价格(元)" prop="order_price"></el-table-column>
        <el-table-column label="是否付款"> 
          <template slot-scope="scope">
            <el-tag
              effect="dark"
              size='mini'
              type="success"
              v-if='scope.row.pay_status==="1"'
              >
              已付款
            </el-tag>
            <el-tag
              effect="dark"
              size='mini'
              type="warning"
              v-else
              >
              未付款
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send"></el-table-column>
        <el-table-column label="下单时间" prop="create_time"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="修改收货地址" placement="top" :enterable="false">
              <el-button type="primary" size="mini" icon='el-icon-edit' @click='showAddressDialog(scope.row.order_id)'></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="查看物流信息" placement="top" :enterable="false">
              <el-button type="warning" size="mini" icon='el-icon-location' @click="showProgressDialog"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
    
    <el-dialog
      title="修改收货地址"
      :visible.sync="addressVisible"
      width="50%"
      @close="addressDialogClosed"
      >
      <el-form :model="addressForm" :rules="addressFormRules" ref="ruleFormRef" label-width="100px" >
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader
          v-model="addressForm.address1"
          :options="citydata"
          :props="{ expandTrigger: 'hover' }"
          >
          </el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addressVisible = false">取 消</el-button>
        <el-button type="primary" @click="editAddress">确 定</el-button>
      </span>
    </el-dialog>
    
    <el-dialog
      title="查看物流信息"
      :visible.sync="progressVisible"
      width="50%"
      >
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in progressinfo"
          :key="index"
          :timestamp="activity.time">
          {{activity.context}}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>

  </div>
</template>

<script>
import citydata from './citydata'

export default {
  data(){
    return{
      //查询对象
      queryInfo:{
        query:'',
        pagenum:1,
        pagesize:10
      },
      //订单列表
      orderList:[],
      //订单总数
      total:0,
      addressVisible:false,
      citydata,
      addressForm:{
        address1:[],
        address2:''
      },
      addressFormRules:{
        address1: [
          { required: true, message: '请选择省市区/县', trigger: 'blur' },
        ],
        address2: [
          { required: true, message: '请输入详细地址', trigger: 'blur' },
        ],
      },
      orderId:0,
      progressVisible:false,
      progressinfo:[],
    }
  },
  created(){
    this.getOrderList()
  },
  methods:{
    async getOrderList(){
      const {data:res}=await this.$http.get('orders',{
        params:this.queryInfo
      })
      if(res.meta.status!==200){
        return this.$message.error('获取订单列表失败')
      }
      res.data.goods.forEach(item=>{
        item.create_time=this.$common.formatToTime(item.create_time)
        //为订单对象添加detail字段
        item.detail=[]
      })
      this.orderList=res.data.goods
      this.total=res.data.total
      
      console.log(this.orderList)
      
    },
    /**
     * @description: 
     * @param {*}
     * @return {*}
     * @Date: 2021-04-06 23:20:57
     * @author: Seven
     */
    handleSizeChange(pagesize){
      this.queryInf.pagesize=pagesize
      this.getOrderList()
    },
    handleCurrentChange(pagenum){
      this.queryInfo.pagenum=pagenum
      this.getOrderList()
    },
    //expand row=>expandrow
    async getOrderDetal(row){
      console.log(row)
      const{data:res} = await this.$http.get(`orders/${row.order_id}`)
      if(res.meta.status!==200){
        return this.$message.error('获取订单明细失败!')
      }
      row.detail=res.data.goods
      console.log(res.data)
      //获取更详细信息
      row.detail.forEach(async item=>{
        const {data:res}=await this.$http.get(`goods/${item.goods_id}`)
        if(res.meta.status!==200){
          return this.$message.error('获取商品详情失败!')
        }
        this.$set(item,'goods_name',res.data.goods_name)
        this.$set(item,'goods_weight',res.data.goods_weight)
        this.$set(item,'url',res.data.pics[0].pics_big_url)
        console.log(res.data)
        console.log(row)
      })

    },
    showAddressDialog(order_id){
      this.addressVisible=true
      this.orderId=order_id
    },
    addressDialogClosed(){
      this.$refs.ruleFormRef.resetFields()
    },
    
    editAddress(){
      this.$refs.ruleFormRef.validate(async valid=>{
        if(!valid){
          return this.$message.error('效验失败!')
        }
        const{data:res} = await this.$http.put(`orders/${this.orderId}/address`,{consignee_addr:this.addressForm.address1.join(',')+','+this.addressForm.address2})
        if(res.meta.status!==200){
          this.$message.error('修改收货地址失败!')
        }
        this.getOrderList()
        this.addressVisible=false
        this.$message.success('修改地址成功!')
      })
    },
    async showProgressDialog(){
      const {data:res}= await this.$http.get('/kuaidi/815294206237577')
      if(res.meta.status!==200){
        return this.$message.error('获取物流信息失败!')
      }
      this.progressVisible=true
      console.log(res.data)
      this.progressinfo=res.data

    }


  },
}
</script>

<style scoped lang='stylus'>
  .el-cascader
    width 100%
</style>