$(function(){
    //1.发送ajax请求,请求后台数据,再通过模板引擎渲染
    var currentPage = 1;
    var pageSize = 5;
    render();
    function render(){
        $.ajax({
            type:'get',
            url:'/user/queryUser',
            data:{page:currentPage || 1,pageSize:pageSize},
            dataType:'json',
            success:function(info){
                console.log(info);
                //通过模板引擎动态渲染
                var str = template('tmp',info)
                $('tbody').html(str);
                //根据返回的总数据,计算数据的页数
                var total = info.total;
                $('.paginator').bootstrapPaginator({
                    bootstrapMajorVersion:3,//默认是2，如果是bootstrap3版本，这个参数必填
                    currentPage:currentPage,//当前页
                    totalPages:Math.ceil(total/pageSize),//总页数
                    onPageClicked:function(a,b,c,page){
                      //为按钮绑定点击事件 page:当前点击的按钮值
                      currentPage = page;
                      render(currentPage);
                    }
                  });
                  
            }
        })
    }
    //点击按钮弹出模态框
    $('tbody').on('click','button',function(){
        $('#logout-modal').modal('show');
        var id = $(this).data('id');
        var status = $(this).data('status')

        $('#changeBtn').click(function(){
            $('#logout-modal').modal('hide')
            $.ajax({
                type:'post',
                url:'/user/updateUser',
                data:{id:id,isDelete:status},
                dataType:'json',
                success:function(info){
    
                    render();
                }
            })
        })
    })

})