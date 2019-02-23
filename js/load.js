/*
 * @Author: Pierre
 * @Date: 2019-01-03 19:31:35
 * @LastEditors: Pierre
 * @LastEditTime: 2019-02-23 17:29:51
 * @Description: 入口
 */

    // 首次获取验证码图片
    window.onload = function () {
        let Vimg = document.getElementsByTagName('img');
        let Tx_sr = document.getElementById('Tx_sr');
        let Bt_tj = document.getElementById('Bt_tj');
        let Bt_TX = document.getElementById('test_1');
        let Bt_TX1 = document.getElementById('test_2');
        let upload = document.getElementById('upload_tj');
        let upload_file = document.getElementById('upload_file');
        let unload_progress_bar = document.getElementById('bar');
        let url = null;
        let rABS = true;    //true为二进制, false 为ArrayBuffer
        Vimg[0].src = '/web-tycx/gzrk/builderCaptcha.do?t=' + new Date().getTime();
     
        //读取xls文件
        upload_file.addEventListener('change',function(e){
            xls(upload_file,rABS,e)   //读Excle内容
        })

        //单独查询
        Bt_tj.addEventListener('click',function(){
            //截取t后面时间值
            url = Vimg[0].src;
            var time_id =  getString(url, 1) 
            Distion(time_id,Tx_sr.value,'only')
        })

        //退出进度条
        unload_progress_bar.addEventListener('click',unload_progress)
    }








