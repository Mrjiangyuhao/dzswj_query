//发送完整参数去后台取信息
function Distion(time_id, value_ls, type) {
    // 识别验证码接口
    let url = "/aa/create.json";
    let imga = document.getElementById("img");
    let tj = document.getElementById("Bt_tj");
    let VFcode;   //储存验证码返回值 obj类型
    if( type == 'only' ){
        //防止点击多次提交
         tj.setAttribute("disabled", "disabled");
    }
    
    //创建image对象
    var Image_1 = new Image();
    var img = imga.src;
    //图片加载完后执行. 注意：必须在src前面
    Image_1.onload = function () {
        var basic = getBase64Image(Image_1);
        //识别验证码
        ajax("POST", url, "username=pierrea&password=@#&typeid=3060&timeout=60&softid=1&softkey=b40ffbee5c1cf4e38028c197eb2fc751&image=" + basic, function (data) {
            VFcode = JSON.parse(data);    //将JSON字符串转为JSON对象

            if (VFcode.Result != null) {
                switch (type) {
                    //单一查询
                    case 'only':
                        ajax_only(time_id, value_ls, VFcode)     //图片ID   名称   验证码
                        break;
                    //批量查询
                    case 'batch':
                        ajax_batch(time_id, value_ls, VFcode)
                        break;
                }
            } else {
                //识别报错提示
                alert(VFcode.Error)
                tj.removeAttribute("disabled");
            }
        })
    }
    Image_1.src = img;

}

    
//重洗数据导出文件内容
function _write_(value) {
    
    var sheet = XLSX.utils.aoa_to_sheet(value);
    var wb = XLSX.utils.book_new({ cellStyles: true });      //创建新工作簿
    XLSX.utils.book_append_sheet(wb, sheet, "SheetJS");
    var wbout = XLSX.write(wb, { type: "binary", bookType: "xlsx" });    //渲染
    saveAs(new Blob([s2ab(wbout)], { type: "application/octet-stream" }), Date.now() + ".xlsx");   //保存下载
}
// -------------------下面的代码借用github里面的项目--------------------------------
// 把 string 转为 ArrayBuffer
function s2ab(str) {
    var buf = new ArrayBuffer(str.length);
    var _view = new Uint8Array(buf);
    for (var i = 0, len = str.length; i < len; i++) {
        _view[i] = str.charCodeAt(i) & 0xFF;
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
            arr = char.split("data:image/png;base64,");  //去除头部信息
            break;
        default:
            alert('请传选项');

    }

    return arr[1]
}
//点击获取验证码
function refre(obj) {
    obj.src = '/web-tycx/gzrk/builderCaptcha.do?t=' + new Date().getTime();

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
    var ls = getString(dataURL, 2)
    return encodeURIComponent(ls)
}
