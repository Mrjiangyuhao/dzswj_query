/* Ajax封装  */
//传输方式，地址，值，回调函数
function ajax(http,url,data,caa){
	var oHttpRequest = null;
	var dta = new Date();
	//检测兼容，不兼容弹出错误码
	try{
		oHttpRequest = new XMLHttpRequest();
	}catch(erre){
		alert("错误码："+erre+"；已自动转兼容IE模式");
		oHttpRequest = new ActiveXObject(Microsoft.XMLHTTP);
	}
	oHttpRequest.withCredentials = true;
	//根据不同传输方式来设置
	if( http == "POST" && data){
		var k = url+="?";
		oHttpRequest.open(http,k,true);
		oHttpRequest.setRequestHeader("Content-type","application/x-www-form-urlencoded"); //设置http请求头部必须在调用的后面
		oHttpRequest.send(data);
	}else{
		// if(data){
			url = url+"?"+data+"&"+dta.getTime();
			// url = url+"?"+data;
		// }else{
		// 	alert("没有获取接口的条件值！请检查！");
		// 	return;
		// }
		oHttpRequest.open(http,url,true);
	 	oHttpRequest.send();	
	}
	
	oHttpRequest.onreadystatechange = function(){
		//状态返回已完成后执行
		if( oHttpRequest.readyState == 4 ){
		//服务器返回200状态码后执行	
			if( oHttpRequest.status == 200){
				caa(oHttpRequest.responseText);
			}else{
				alert("接口异常："+ oHttpRequest.status);
				
			}
			
		}
		
	}
	
	
}
