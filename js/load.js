/*
 * @Author: Pierre
 * @Date: 2019-01-03 19:31:35
 * @LastEditors: Pierre
 * @LastEditTime: 2019-03-04 22:13:11
 * @Description: 入口
 */
// 首次获取验证码图片
window.onload = function() {
  alert("批量导出暂时只支持100条数据的查询导出，多的会报错。建议30条查询");
  let Vimg = document.getElementById("vfcode");
  let Tx_sr = document.getElementById("Tx_sr");
  let Bt_tj = document.getElementById("Bt_tj");
  let Bt_TX = document.getElementById("test_1");
  let Bt_TX1 = document.getElementById("test_2");
  let upload = document.getElementById("upload_tj");
  let upload_file = document.getElementById("upload_file");
  let btn_password = document.getElementById("btn_password");
  let password_box = document.getElementById("password_box");
  let btn_value = document.getElementById("btn_value");
  let logo = document.getElementById("logo");
  let url = null;
  let rABS = true; //true为二进制, false 为ArrayBuffer
  Vimg.src = "/web-tycx/gzrk/builderCaptcha.do?t=" + new Date().getTime();

  //读取xls文件
  upload_file.addEventListener("change", function(e) {
    xls(upload_file, rABS, e); //读Excle内容
  });

  //单独查询    isNan  检测是否是数字
  Bt_tj.addEventListener("click", function() {
    if (Tx_sr.value != "" && isNaN(Tx_sr.value)) {
      //截取t后面时间值
      url = Vimg.src;
      var time_id = getString(url, 1);
      Distion(time_id, Tx_sr.value, "only");
    }else{
        alert('请输入公司名称！')
        return
    }
  });
  //解锁页
  btn_password.addEventListener('click',function(){
    var password = 'aisino2871668';//    恭喜你~破解了密码哦
    
    if( btn_value.value === 'aisino2871668' ){
      var H_bg;  //背景图
      var T_l;    //log图
      var T_v;    //密码框
      var T_pass;  //提交按钮
      H_bg = document.defaultView.getComputedStyle(password_box,null).height;
      T_l = document.defaultView.getComputedStyle(logo,null).top;
      T_v = document.defaultView.getComputedStyle(btn_value,null).top;
      T_pass = document.defaultView.getComputedStyle(btn_password,null).top;
      var upTime = setInterval(()=>{
        //非IE下  -300
        if(parseInt(H_bg) >= 0 && parseInt(T_l) >= -300 && parseInt(T_v) >= -300 &&  parseInt(T_pass) >= -300){
          H_bg  = parseInt(H_bg) - 12;
          password_box.style.height = H_bg + 'px';
          T_l  = parseInt(T_l)  - 7 ;
          logo.style.top = T_l + 'px';
          T_v  = parseInt(T_v)  - 7 ;
          btn_value.style.top = T_v + 'px';
          T_pass  = parseInt(T_pass)  - 7 ;
          btn_password.style.top = T_pass + 'px';
        }else{
          window.clearInterval(upTime)
        }
       
      },100)
    }
  })

};
