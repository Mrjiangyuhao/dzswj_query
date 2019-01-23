
    // 首次获取验证码图片
    window.onload = function () {
        let Vimg = document.getElementsByTagName('img');
        let Tx_sr = document.getElementById('Tx_sr');
        let Bt_tj = document.getElementById('Bt_tj');
        let Bt_TX = document.getElementById('test_1');
        let Bt_TX1 = document.getElementById('test_2');
        let char = null;
        Vimg[0].src = '/web-tycx/gzrk/builderCaptcha.do?t=' + new Date().getTime();
     
        //发送值去后台获取json数据
        Bt_tj.addEventListener('click',function(){
            //截取t后面时间值
            char = Vimg[0].src;
            var time_id =  getString(char, 1) 
            Distion(time_id,Tx_sr.value)
        })
        // 点击图片刷新验证码
        // Vimg[0].addEventListener('click',function(){
        //     refre(Vimg[0])
        // })
   
    }








