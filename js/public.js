/*
 * @Author: Pierre
 * @Date: 2019-01-03 19:31:35
 * @LastEditors: Pierre
 * @LastEditTime: 2019-03-03 23:36:26
 * @Description: 数据处理
 */
var reset = '成功';   //取值状态
var i = 0;    //自增变量,主要用来取数组的值
var arr_new = [];  //储存返回查询到的值。注意如果是局部变量push的时候会覆盖原有的值
var Screening = [];  //存储解析Excle里面的原始值

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

//单一查询
function ajax_only(time_id, value_ls, VFcode) {
    let imga = document.getElementById("vfcode");
    let oDiv = document.getElementById("oDiv");
    let tj = document.getElementById("Bt_tj");
    let objArr;    //查询结果储存
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
    let imga = document.getElementById("vfcode");
    var batch_objArr;
    var dzswj_gs;
    var dzswj_ds;  
    ajax("GET", "/web-tycx/gzrk/tycxGzrkQuery.do", "t=" + time_id + "&bw=" + encodeURIComponent("{'taxML':{'head':{'gid':'311085A116185FEFE053C2000A0A5B63','sid':'gzcx.swdjxxcx','tid':'+','version':''},'body':{'nsrsbh':'','nsrmc':'" + value_ls + "','captcha':'" + VFcode.Result + "'}}}"), function (data) {

        var inf = JSON.parse(data)
        //检查返回状态码
        if( inf.code ){
            alert(inf.code + inf.message +'将跳过该条处理下一条');
            arr_new.push([inf.message])
            refre(imga)
            reset = '成功';   //主要参数，流程走完更改状态
            i = i + 1;        //主要参数，控制下一次循环
            loading_progress(i,Screening.length) 
            return
        }else{
            batch_objArr = inf.taxML.body.taxML.swdjxxList.swdjxx;
        }
        
        //检查是否有企业信息
        if (batch_objArr.length == 0) {
            arr_new.push([dzswj_gs.nsrmc,'没有该企业信息，请检查'])
            // arr_new[`${dzswj_gs.nsrmc}`] = '没有该企业信息，请检查';
            refre(imga)
            reset = '成功';   //主要参数，流程走完更改状态
            i = i + 1;        //主要参数，控制下一次循环
            loading_progress(i,Screening.length) 
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

    })
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
            arr_new = []    //删除筛选出来储存数据
            //清空储存的key值 
            Screening = [];
            i = 0;
        }
    }, 4000);

}

