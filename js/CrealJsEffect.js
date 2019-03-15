/*
 * @Author: Pierre
 * @Date: 2019-02-09 16:10:43
 * @LastEditors: Pierre
 * @LastEditTime: 2019-03-14 23:34:32
 * @Description:  Progress bar
 */
var lan = 0;
function loading_progress(smallNumber,maxNumber){
     let bar = document.getElementById("bar");
     //进度条
     if( bar === null ){
          //动态生成节点
          var oDiv_bar = document.createElement("div");
          oDiv_bar.setAttribute('id','bar');
          oDiv_bar.innerHTML = `<div id='bar_title'><p>loadding... </p>\
          <progress value='${smallNumber}'  max='${maxNumber}'></progress><span id='loadding'>0%</span>`;
          document.body.appendChild(oDiv_bar);

     //  loading_progress(smallNumber,maxNumber)   //测试
     }else{
          var loadding = document.getElementById("loadding");
          var bar_progress = bar.getElementsByTagName("progress")[0];
          var loadding_bar = document.getElementById("bar");
          bar_progress.setAttribute('value',smallNumber)
          lan =  (smallNumber / maxNumber) * 100;   //加 0 - 就为负数不加为正
          loadding.innerText = Math.floor(lan) + '%';
          if(  Math.floor(lan) === 100 ){
               unload_progress()     
          }
          return
     }

}
//退出进度条
function unload_progress(){
     var unload_bar = document.getElementById("bar");
     unload_bar.style.cssText = 'display: none';
     lan = 0;
}
//  loading_progress(15,500)  //测试