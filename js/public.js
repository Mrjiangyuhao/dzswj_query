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
        var workbook =  XLSX.read(data,{type : rABS ? 'binary' : 'array' });
        //遍历读取
         for(var first_sheet_name in workbook.Sheets){
             //检测自身是否包含特定属性
            if( workbook.Sheets.hasOwnProperty(first_sheet_name) ){
                formTo = workbook.Sheets[first_sheet_name]['!ref'];
                console.log(formTo)
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

//数据处理
function SendData(persons){
    var oImg = document.getElementsByTagName('img')[0];
    var url = oImg.src;
    var time_id =  getString(url, 1) 
    var aa = [];
    for(var arr = 0; arr < persons.length ;arr++){
        for(var varName in persons[arr]){
           aa.push(Distion(time_id,persons[arr][varName],'bacth')) 
        }
    }
    console.log(aa)
    console.log(persons)
}


//重洗数据导出文件内容
function write(){
    var newdata = [{
        '名称': ['神仙公司','成功']
    }]
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