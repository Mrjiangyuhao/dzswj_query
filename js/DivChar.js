//发送完整参数去后台取信息
function Distion(time_id, value_ls, type) {
    // 识别验证码接口
    let url = "/aa/create.json";
    let imga = document.getElementById("img");
    let tj = document.getElementById("Bt_tj");
    let VFcode;   //储存验证码返回值 obj类型
    //防止点击多次提交
    tj.setAttribute("disabled", "disabled");
    //创建image对象
    var Image_1 = new Image();
    var img = imga.src;
    //图片加载完后执行. 注意：必须在src前面
    Image_1.onload = function () {
        var basic = getBase64Image(Image_1);
        //识别验证码
        ajax("POST", url, "username=&password=5D8EB8897E0EEF4281EEDFC3560B1BF7&typeid=3060&timeout=50&softid=1&softkey=b40ffbee5c1cf4e38028c197eb2fc751&image=" + basic, function (data) {
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
                console.log(persons)
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
console.log(arr_new)