$(function(){
    //1判断是否登录

    $.ajax({
    type:'get',
    url:'/employee/checkRootLogin',
    dataType:'json',
    success:function(info){
        // console.log(info)
        if(info.error === 400 ){
            location.href = 'login.html'
        }
    }
})
})