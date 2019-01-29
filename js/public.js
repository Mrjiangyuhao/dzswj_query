var reset = '成功';   //取值状态
var i = 0;    //自增变量,主要用来取数组的值
var arr_new = [];  //储存返回查询到的值。注意如果是局部变量push的时候会覆盖原有的值
//取Src地址内容
let value_ls = null;
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


//单一查询
function ajax_only(time_id, value_ls, VFcode) {
    let imga = document.getElementById("img");
    let oDiv = document.getElementById("oDiv");
    let tj = document.getElementById("Bt_tj");
    let objArr = null;    //查询结果储存
    let dzswj_gs_arr = new Array();   //国税信息储存
    let dzswj_ds_arr = new Array();   //地税信息储存
    ajax("GET", "/web-tycx/gzrk/tycxGzrkQuery.do", "t=" + time_id + "&bw=" + encodeURIComponent("{'taxML':{'head':{'gid':'311085A116185FEFE053C2000A0A5B63','sid':'gzcx.swdjxxcx','tid':'+','version':''},'body':{'nsrsbh':'','nsrmc':'" + value_ls + "','captcha':'" + VFcode.Result + "'}}}"), function (data) {

        var inf = JSON.parse(data)
        objArr = inf.taxML.body.taxML.swdjxxList.swdjxx;

        //检查是否有企业信息
        if (objArr.length == 0) {
            alert("没有该企业信息，请检查！")
            refre(imga)
            tj.removeAttribute("disabled");
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
        tj.removeAttribute("disabled");
    })
}
//批量查询
function ajax_batch(time_id, value_ls, VFcode) {
    let imga = document.getElementById("img");

    ajax("GET", "/web-tycx/gzrk/tycxGzrkQuery.do", "t=" + time_id + "&bw=" + encodeURIComponent("{'taxML':{'head':{'gid':'311085A116185FEFE053C2000A0A5B63','sid':'gzcx.swdjxxcx','tid':'+','version':''},'body':{'nsrsbh':'','nsrmc':'" + value_ls + "','captcha':'" + VFcode.Result + "'}}}"), function (data) {

        var inf = JSON.parse(data)
        let objArr = inf.taxML.body.taxML.swdjxxList.swdjxx;
        //检查是否有企业信息
        if (objArr.length == 0) {
            alert("没有该企业信息，请检查！")
            refre(imga)
            return
        } else {
            //将国地分别储存
            var dzswj_gs = objArr[0];
            var dzswj_ds = objArr[1];
            arr_new.push([dzswj_gs.nsrmc, dzswj_gs.nsrztmc])//获得的结果
            refre(imga)
            reset = '成功';
            i = i + 1;
        }

    })
}
//中间层
//控制数据的发送
function SendData(persons) {
    var oImg = document.getElementsByTagName('img')[0];
    var url = oImg.src;
    var Screening = [];
    var time_id = getString(url, 1)

    for (var arr = 0; arr < persons.length; arr++) {
        for (var varName in persons[arr]) {
            Screening.push(persons[arr][varName])
        }
    }
    //等待返回值后在循环处理内容
    var a = setInterval(() => {
        if (i < Screening.length) {
            if (reset == '成功') {
                reset = '不成功';   //阻止定时器执行
                Distion(time_id, Screening[i], 'batch')
            }
        } else {
            clearInterval(a)    //停止定时器
            _write_(arr_new)      //组合数据导出Excle
            i = 0;
        }
    }, 5000);

}

//canvas 画验证码
// function test1(imga) {
//     var canvas = document.createElement("canvas");
//     var ctx = canvas.getContext('2d');
//     canvas.width = imga.width;
//     canvas.height = imga.height;
//     ctx.drawImage(imga, 0, 0, canvas.width, canvas.height);
//     var dataURL = canvas.toDataURL()
//     document.body.appendChild(canvas)
//     console.log(dataURL)
//     // getBase64Image(canvas)
//     return canvas;
// }