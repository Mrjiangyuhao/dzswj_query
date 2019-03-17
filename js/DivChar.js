/*
 * @Author: Pierre
 * @LastEditors: Pierre
 * @Description: 逻辑处理层
 * @Date: 2019-01-03 19:31:35
 * @LastEditTime: 2019-03-17 13:32:48
 */
let reset = '成功';   //取值状态
let i = 0;    //自增变量,主要用来取数组的值
let arr_new = [];  //储存返回查询到的值。注意如果是局部变量push的时候会覆盖原有的值
let Screening = [];  //存储解析Excle里面的原始值


//第三方接口参数
function User() {
  return {
    pd_id: 110269, // 用户中心页可以查询到pd信息
    pd_key: "zkt1MicwfZMNpoWHcYlXrdjUsjwnRF0J",
    app_id: 310269, // 开发者分成用的账号，在开发者中心可以查询到
    app_key: "zD9HYH3Beh3ltphn23Z1hsuJaiScGvlK",
    // 具体类型可以查看官方网站的价格页选择具体的类型，不清楚类型的，可以咨询客服
    pred_type: 30600
  };
}

//发送完整参数去后台取信息
function Distion(time_id, value_ls, type) {
  let url = "/api/capreg";
  let imga = document.getElementById("vfcode");
  let tj = document.getElementById("Bt_tj");
  let oDiv = document.getElementById("oDiv");
  //单独查询变量
  let objArr; //查询结果储存
  let dzswj_gs_arr = new Array(); //国税信息储存
  let dzswj_ds_arr = new Array(); //地税信息储存
  //批量查询变量
  let batch_objArr;
  let dzswj_gs;
  let dzswj_ds;  

  if (type == "only") {
    //防止点击多次提交
    tj.setAttribute("disabled", "disabled");
  }

  //创建image对象
  var Image_1 = new Image();
  var img = imga.src;
  //图片加载完后执行. 注意：必须在src前面
  Image_1.onload = function() {
    var basic = getBase64Image(Image_1);
    var pd = User();
    var pd_id = pd.pd_id;
    var pd_key = pd.pd_key;
    var app_id = pd.app_id;
    var app_key = pd.app_key;
    var pred_type = pd.pred_type;
   
    Predict(basic, app_id, app_key, pd_id, pd_key, pred_type, function(ret_code,pred_data,result) {
      if (ret_code == 0) {
        switch (type) {
          //单一查询
          case "only":
            //图片ID   名称   验证码    回调函数
            ajax_only(time_id, value_ls,result, function(data) {
              var inf = JSON.parse(data);
           
              if (inf.code === "90") {
                alert("code:90，验证码错误");
                refre(imga);
                //识别的结果如果与预期不符，可以调用这个接口将预期不符的订单退款
                //退款仅在正常识别出结果后，无法通过网站验证的情况，请勿非法或者滥用，否则可能进行封号处理
                Justice(pd_id, pd_key, rsp_data.RequestId, function(jret_code) {
                   alert("退款结果: " + jret_code);
                });
                return 
              }

              objArr = inf.taxML.body.taxML.swdjxxList.swdjxx;

              //检查是否有企业信息
              if (batch_objArr == "" || batch_objArr == null || batch_objArr == undefined) {
                alert(`没有查询到${value_ls}的企业信息，请去公示网核实！`);
                refre(imga);
                tj.removeAttribute("disabled");
                return 
              }
                
              //将国地分别储存
              var dzswj_gs = objArr[0];
              var dzswj_ds = objArr[1];
              for (var p in dzswj_gs) {
                dzswj_gs_arr.push(dzswj_gs[p]); //对象key值如果是变量可以这样写，如果key值是双引号括起来就用点的方式
              }

              oDiv.innerHTML = ` <div class="sizeDiv">名称：${
                dzswj_gs_arr[3]
              }</div> \
                          <div class="sizeDiv">税号：${dzswj_gs_arr[4]}</div> \
                          <div class="sizeDiv">电话：${
                            dzswj_gs_arr[2]
                          }</div> \  
                           <div class="sizeDiv">企业状态：${
                             dzswj_gs_arr[5]
                           }</div> \  
                           <div class="sizeDiv">地址：${
                             dzswj_gs_arr[6]
                           }</div> \  
                          <div class="sizeDiv">所属税局：${
                            dzswj_gs_arr[8]
                          }</div> \  
                          `;
              refre(imga);
              tj.removeAttribute("disabled");
            });  
            break;
          //批量查询
          case "batch":
            ajax_batch(time_id, value_ls, result,function(data){
                var inf = JSON.parse(data)
                
                 if( inf.code === '90' ){
                    Justice(pd_id, pd_key, rsp_data.RequestId, function(jret_code) {
                       console.log("退款结果: " + jret_code);
                    });
                    refre(imga);
                    reset = '成功';   //流程走完更改状态
                    i = i + 1;
                    arr_new.push([value_ls,'识别验证码错误，重新操作'])
                    loading_progress(i,Screening.length)  //弹出进度条.注意value是从1开始
                    return 
                 }
    
                  batch_objArr = inf.taxML.body.taxML.swdjxxList.swdjxx;

              //检查是否有企业信息
              if (batch_objArr == "" || batch_objArr == null || batch_objArr == undefined) {
                  arr_new.push([value_ls,'没有该企业信息，请检查'])
                  refre(imga)
                  loading_progress(i,Screening.length) 
                  reset = '成功';   //主要参数，流程走完更改状态
                  i = i + 1;        //主要参数，控制下一次循环
                  loading_progress(i,Screening.length)  //弹出进度条.注意value是从1开始
                  return 
              } else {
                  //将国地分别储存
                  dzswj_gs = batch_objArr[0];
                  dzswj_ds = batch_objArr[1];
                  arr_new.push([dzswj_gs.nsrmc,dzswj_gs.nsrsbh, dzswj_gs.nsrztmc,dzswj_gs.lxdh])//获得的结果
                  refre(imga)
                  reset = '成功';   //流程走完更改状态
                  i = i + 1;
                  loading_progress(i,Screening.length)  //弹出进度条.注意value是从1开始
              }
            });
            break;
        }
      } else {
        //识别报错提示
        alert(ret_code);
        tj.removeAttribute("disabled");
      }
     
    });
  };
  Image_1.src = img;
}

//中间层
//控制数据的发送
function SendData(persons) {
    var oImg = document.getElementsByTagName('img')[0];
    var url = oImg.src;
    var time_id = getString(url, 1)

    for (var arr = 0; arr < persons.length; arr++) {
        for (var varName in persons[arr]) {
            Screening.push(persons[arr][varName])
        }
    }
    loading_progress(i,Screening.length)
    //等待返回值后在循环处理内容
    var a = setInterval(() => {
        if (i < Screening.length) {
            if (reset == '成功') {
                reset = '不成功';   //阻塞定时器执行，等待完成再进入
                Distion(time_id, Screening[i], 'batch')
            }
        } else {
            _write_(arr_new)    //组合数据导出Excle
            clearInterval(a)    //停止定时器
            arr_new = [];    //删除筛选出来储存数据
            //清空储存的key值 
            Screening = [];
            i = 0;
        }
    }, 2000);

}
//出现异常后点击强制导出
function export_erre(){
  if(arr_new.length === 0  ){
    alert("没有数据导出，请上传数据")
  }else{
    _write_(arr_new)
    arr_new = [];    //删除筛选出来储存数据
    //清空储存的key值 
    Screening = [];
    i = 0;
  }
 
}

