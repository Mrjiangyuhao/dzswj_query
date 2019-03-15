/*
 * @Author: Pierre
 * @Date: 2019-01-03 19:31:35
 * @LastEditors: Pierre
 * @LastEditTime: 2019-03-14 22:05:36
 * @Description: 数据处理
 */


//读xls文件内容(xlsx.full.min.js)
function xls(obj, rABS, e) {
    var e = e || window.event;
    var files = e.target.files;    //获取目标文件
    var f = files[0];
    var formTo = '';
    var persons = [];    //储存获取到的数据
    var reader = new FileReader();   //H5新api

    reader.onload = function (e) {
        var e = e || window.event;
        //readAsBinaryString或者readAsArrayBuffer读取成功后会把数据储存在result
        var data = e.target.result;
        if (!rABS) {
            //如果是readAsArrayBuffer需要转换
            data = new Uint8Array(data);
        }
        var workbook = XLSX.read(data, { type: rABS ? 'binary' : 'array' });
        //遍历读取
        for (var first_sheet_name in workbook.Sheets) {
            //检测自身是否包含特定属性
            if (workbook.Sheets.hasOwnProperty(first_sheet_name)) {
                formTo = workbook.Sheets[first_sheet_name]['!ref'];
                //concat 用于连接两个或者多个数组
                persons = XLSX.utils.sheet_to_json(workbook.Sheets[first_sheet_name]);
                //看下是否有表头，否则过滤数据
                var headStr = '公司名称';
                for (var i = 0; i < persons.length; i++) {
                    if (Object.keys(persons[i]).join(',') !== headStr) {
                        persons.splice(i, 1);
                    }
                }
            }
        }
        SendData(persons)
    }
    //将上传的文件转换
    if (rABS) {
        //二进制流
        reader.readAsBinaryString(f);
    }
    else {
        //数组缓冲区
        reader.readAsArrayBuffer(f);
    }
}

//重洗数据导出文件内容
function _write_(value) {
    var sheet = XLSX.utils.aoa_to_sheet(value);
    var wb = XLSX.utils.book_new({ cellStyles: true }); //创建新工作簿
    XLSX.utils.book_append_sheet(wb, sheet, "SheetJS");
    var wbout = XLSX.write(wb, { type: "binary", bookType: "xlsx" }); //渲染
    saveAs(
      new Blob([s2ab(wbout)], { type: "application/octet-stream" }),
      Date.now() + ".xlsx"
    ); //保存下载
  }
  // -------------------下面的代码借用github里面的项目--------------------------------
  // 把 string 转为 ArrayBuffer
  function s2ab(str) {
    var buf = new ArrayBuffer(str.length);
    var _view = new Uint8Array(buf);
    for (var i = 0, len = str.length; i < len; i++) {
      _view[i] = str.charCodeAt(i) & 0xff;
    }
    return buf;
  }
  
  function getString(char, value) {
    var arr;
    switch (value) {
      case 1:
        arr = char.split("=");
        break;
      case 2:
        arr = char.split("data:image/png;base64,"); //去除头部信息
        break;
      default:
        alert("请传选项");
    }
  
    return arr[1];
  }
  //点击获取验证码
  function refre(obj) {
    obj.src = "/web-tycx/gzrk/builderCaptcha.do?t=" + new Date().getTime();
  }
  
  //图片转Base64编码
  function getBase64Image(url) {
    var canvas = document.createElement("canvas");
    canvas.width = url.width;
    canvas.height = url.height;
  
    var ctx = canvas.getContext("2d");
    ctx.drawImage(url, 0, 0, url.width, url.height);
    //截取base64 部分数据
    var ext = url.src.substring(url.src.lastIndexOf(".") + 1).toLowerCase();
    var dataURL = canvas.toDataURL("image/" + ext);
    var ls = getString(dataURL, 2);
  
    // return encodeURIComponent(ls)    //该加密支持更广义的符号加密
    return encodeURI(ls); //斐斐打码只支持该加密
  }
  
  //密钥MD5加密
  function CalcSign(pd_id, pd_key, timestamp) {
    var md5_chk = hex_md5(timestamp + pd_key);
    var sign_chk = hex_md5(pd_id + timestamp + md5_chk);
    return sign_chk;
  }



//单一查询
function ajax_only(time_id, value_ls, result,success) {
    ajax("GET", "/web-tycx/gzrk/tycxGzrkQuery.do", "t=" + time_id + "&bw=" + encodeURIComponent("{'taxML':{'head':{'gid':'311085A116185FEFE053C2000A0A5B63','sid':'gzcx.swdjxxcx','tid':'+','version':''},'body':{'nsrsbh':'','nsrmc':'" + value_ls + "','captcha':'" + result["result"] + "'}}}"),success)
}
//批量查询
function ajax_batch(time_id, value_ls, result,success) {
   ajax("GET", "/web-tycx/gzrk/tycxGzrkQuery.do", "t=" + time_id + "&bw=" + encodeURIComponent("{'taxML':{'head':{'gid':'311085A116185FEFE053C2000A0A5B63','sid':'gzcx.swdjxxcx','tid':'+','version':''},'body':{'nsrsbh':'','nsrmc':'" + value_ls + "','captcha':'" + result["result"] + "'}}}"),success)
}


