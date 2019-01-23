
//发送完整参数去后台取信息
function Distion(time_id, value_ls) {
    // 识别验证码接口
    let url = "/aa/create.json";
    //重新获取DOM元素，不然会导致未加载完获取不到url
    let imga = document.getElementById("img");
    let oDiv = document.getElementById("oDiv");
    let objArr;
    let ObjJson = null;
    let dzswj_gs_arr = new Array();
    let dzswj_ds_arr;
    //创建image对象
    var Image_1 = new Image();
    var img = imga.src;
    //图片加载完后执行. 注意：必须在src前面
    Image_1.onload = function () {
        var basic = getBase64Image(Image_1);
    
        //识别验证码
        ajax("POST", url, "username=#&password=5D8EB8897E0EEF4281EEDFC3560B1BF7&typeid=3060&timeout=10&softid=1&softkey=b40ffbee5c1cf4e38028c197eb2fc751&image=" + basic, function (data) {
            ObjJson = JSON.parse(data);    //将JSON字符串转为JSON对象
            if (ObjJson.Result != null) {
                ajax("GET", "/web-tycx/gzrk/tycxGzrkQuery.do", "t=" + time_id + "&bw=" + encodeURIComponent("{'taxML':{'head':{'gid':'311085A116185FEFE053C2000A0A5B63','sid':'gzcx.swdjxxcx','tid':'+','version':''},'body':{'nsrsbh':'','nsrmc':'" + value_ls + "','captcha':'" + ObjJson.Result + "'}}}"), function (data) {
                                
                    // ....   取到数后整理导出Excle
                    var inf = JSON.parse(data)
                    objArr = inf.taxML.body.taxML.swdjxxList.swdjxx;
             
                    //检查是否有企业信息
                    if( objArr.length == 0 ){
                       alert("没有该企业信息，请检查！")
                       refre(imga)   
                       return
                    }
                    //将国地分别储存
                   var dzswj_gs = objArr[0];
                   var dzswj_ds = objArr[1];
                    for (var p in dzswj_gs) {  
                        dzswj_gs_arr.push(dzswj_gs[p]);//对象key值如果是变量可以这样写，如果key值是双引号括起来就用点的方式
                    }
             
                    oDiv.innerHTML = ` <div class="sizeDiv">名称：${dzswj_gs_arr[3]}</div> \
                    <div class="sizeDiv">税号：${dzswj_gs_arr[4]}</div> \
                    <div class="sizeDiv">电话：${dzswj_gs_arr[2]}</div> \  
                    <div class="sizeDiv">企业状态：${dzswj_gs_arr[5]}</div> \  
                    <div class="sizeDiv">地址：${dzswj_gs_arr[6]}</div> \  
                    <div class="sizeDiv">所属税局：${dzswj_gs_arr[8]}</div> \  
                    `;
                    refre(imga)
                })
            } else {
                //识别报错提示
                alert(ObjJson.Error)
            }
        })
    }
    Image_1.src = img;

}

//点击获取验证码
function refre(obj) {
    obj.src = '/web-tycx/gzrk/builderCaptcha.do?t=' + new Date().getTime();

}

//查询界面
function query() {
    ajax("GET", "/web-tycx/sscx/gzcx/swdjxxcx/swdjxxcx.jsp", "", function (data) {
        console.log(data + '测试')
    })
}
