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
