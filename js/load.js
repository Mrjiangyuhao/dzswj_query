
    // 首次获取验证码图片
    window.onload = function () {
        let Vimg = document.getElementsByTagName('img');
        let Tx_sr = document.getElementById('Tx_sr');
        let Bt_tj = document.getElementById('Bt_tj');
        let Bt_TX = document.getElementById('test_1');
        let Bt_TX1 = document.getElementById('test_2');
        let upload = document.getElementById('upload_tj');
        let upload_file = document.getElementById('upload_file');
        let url = null;
        let rABS = true;    //true为二进制, false 为ArrayBuffer
        Vimg[0].src = '/web-tycx/gzrk/builderCaptcha.do?t=' + new Date().getTime();
     
        //读取xls文件
        upload_file.addEventListener('change',function(){
            xls(upload_file,rABS)
        })

        //单独查询
        Bt_tj.addEventListener('click',function(){
            //截取t后面时间值
            url = Vimg[0].src;
            var time_id =  getString(url, 1) 
            Distion(time_id,Tx_sr.value,'only')
        })

    }








