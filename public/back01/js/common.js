$(function(){

    //1.设置进度条功能,
    //1.1禁用小圆环
    NProgress.configure({ showSpinner: false });
    //1.2当第1个ajax发送请求时开启
   
    $(document).ajaxStart(function() {
        NProgress.start();
      });
      
    // 1.3当所有ajax请求结束后完成(即最后一个ajax请求完成)
    $(document).ajaxStop(function(){
        NProgress.done()
    })

    //2.点击分类菜单,二级菜单显示
    $('.lt_aside .nav .category').click(function(){

        $('.lt_aside .child').stop().slideToggle();
    })
    //3.点击top_option中的menu按钮,aside左移,top_option和lt_main的padding为0
    // 通过添加类来实现
    $('.lt_main .top_menu').click(function(){
        $('.lt_main').toggleClass('hideMenu');
        $('.lt_main .top_option').toggleClass('hideMenu');
        $('.lt_aside').toggleClass('hideMenu');
    })
    //4.点击top_option中的logOut按钮,弹出模态框
    $('.top_option .logOut').click(function(){
        $('#logout-modal').modal('show')
    })
    // 点击模态框中的退出按钮 发送Ajax请求,让后台销毁sessionId
    $('#logoutBtn').click(function(){
        $.ajax({
            type:'get',
            url:'/employee/employeeLogout',
            dataType:'json',
            success:function(info){
                if(info.success){
                    location.href = 'login.html'
                }
            }
        })
    })
})
 