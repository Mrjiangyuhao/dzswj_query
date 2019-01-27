
//发送完整参数去后台取信息
function Distion(time_id, value_ls, type) {

    // 识别验证码接口
    let url = "/aa/create.json";
    let imga = document.getElementById("img");
    let tj = document.getElementById("Bt_tj");
    let VFcode ;   //储存验证码返回值 obj类型

    //防止点击多次提交
    tj.setAttribute("disabled", "disabled");
    //创建image对象
    var Image_1 = new Image();
    var img = imga.src;
    //图片加载完后执行. 注意：必须在src前面
    Image_1.onload = function () {
        var basic = getBase64Image(Image_1);

        //识别验证码
        ajax("POST", url, "username=pierrea&password=5D8EB8897E0EEF4281EEDFC3560B1BF7&typeid=3060&timeout=10&softid=1&softkey=b40ffbee5c1cf4e38028c197eb2fc751&image=" + basic, function (data) {
            VFcode  = JSON.parse(data);    //将JSON字符串转为JSON对象

            if (VFcode.Result != null) {
                switch (type) {
                    //单一查询
                    case 'only':
                        ajax_only(time_id, value_ls,VFcode)     //图片ID   名称   验证码
                        break;
                    //批量查询
                    case 'batch':
                        ajax_only(time_id, value_ls,VFcode)
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

//单一查询
function ajax_only(time_id, value_ls,VFcode) {
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
function ajax_batch(time_id, value_ls,VFcode) {
    let imga = document.getElementById("img");
    ajax("GET", "/web-tycx/gzrk/tycxGzrkQuery.do", "t=" + time_id + "&bw=" + encodeURIComponent("{'taxML':{'head':{'gid':'311085A116185FEFE053C2000A0A5B63','sid':'gzcx.swdjxxcx','tid':'+','version':''},'body':{'nsrsbh':'','nsrmc':'" + value_ls + "','captcha':'" + VFcode.Result + "'}}}"), function (data) {

        var inf = JSON.parse(data)
        let objArr = inf.taxML.body.taxML.swdjxxList.swdjxx;
        //检查是否有企业信息
        if (objArr.length == 0) {
            alert("没有该企业信息，请检查！")
            refre(imga)
            return
        }
        //将国地分别储存
        var dzswj_gs = objArr[0];
        var dzswj_ds = objArr[1];
        refre(imga)
        return [dzswj_gs[3],dzswj_gs[5]];
    })
}