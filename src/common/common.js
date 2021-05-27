/*
 * @Description: 
 * @Version: 2.0
 * @Autor: Seven
 * @Date: 2021-04-04 17:06:25
 * @LastEditors: Seven
 * @LastEditTime: 2021-04-08 15:57:38
 */
/*
 * @Description: 
 * @Version: 2.0
 * @Autor: Seven
 * @Date: 2021-01-15 15:28:52
 * @LastEditors: Seven
 * @LastEditTime: 2021-02-17 15:24:14
 */
/**
 * @description: 处理时间年月日分秒 将传入时间转换成毫秒 然后分别计算
 * @param {*} tiem 传入时间
 * @return {*}
 * @Date: 2021-04-04 17:22:05
 * @author: Seven
 */
function formatToTime(time){
  let date=new Date(time*1000) //传入的时间单位秒转毫秒
  const year=date.getFullYear()//获取年
  //获取月如果不足2位在前面补一个0
  const month=(date.getMonth()+1).toString().padStart(2,'0')
  //获取天
  const day=date.getDate().toString().padStart(2,'0')
  const hour=date.getHours().toString().padStart(2,'0')
  const minute=date.getMinutes().toString().padStart(2,'0')
  const second=date.getSeconds().toString().padStart(2,'0')
  return `${year}-${month}-${day} ${hour}:${minute}:${second}`
}

function formatToDate(time){
  let date=new Date(time*1000) //传入的时间单位秒转毫秒
  const year=date.getFullYear()//获取年
  //获取月如果不足2位在前面补一个0
  const month=(date.getMonth()+1).toString().padStart(2,'0')
  //获取天
  const day=date.getDate().toString().padStart(2,'0')
  return `${year}-${month}-${day}`
}
export default{
  formatToTime,
  formatToDate
}