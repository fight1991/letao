$(function(){
   
    var currentPage = 1; //存储当前页面
    var pageSize = 5; //设置请求条数
    //1.打开first页面发送ajax请求,动态渲染页面
    render()
    function render(){
        $.ajax({
            type: 'get',
            url: '/category/queryTopCategoryPaging',
            data: { page: currentPage, pageSize: pageSize },
            dataType: 'json',
            success: function (info) {
                // console.log(info);
                var htmlStr = template('addList', info);
                $('tbody').html(htmlStr);
                //初始化分页插件
                $("#paginator").bootstrapPaginator({
                    bootstrapMajorVersion: 3,//默认是2，如果是bootstrap3版本，这个参数必填
                    currentPage: currentPage,//当前页
                    totalPages: Math.ceil(info.total / info.size),//总页数
                    onPageClicked: function (event, originalEvent, type, page) {
                        //为按钮绑定点击事件 page:当前点击的按钮值
                        currentPage = page;
                        render()
                    }
                });

            }
        })
    }
    //2.设置添加分类按钮功能
    //2.1点击分类按钮弹出模态框
    $('.addCategory').click(function(){
        $('#add-modal').modal('show')
    })
    //2.2添加表单验证功能
    $('#form').bootstrapValidator({
        //2. 指定校验时的图标显示，默认是bootstrap风格
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        //3.指定校验字段
        fields:{
            categoryName:{
                validators:{
                    notEmpty:{
                        message:'请输入一级分类名称'
                    }
                }
            }
        }
    })
    //2.3阻止默认提交,改用ajax提交
    $('#form').on('success.form.bv',function(e){
        //阻止默认提交
        e.preventDefault();
        $.ajax({
            type:'post',
            url:'/category/addTopCategory',
            data:$('#form').serialize(),
            dataType:'json',
            success:function(info){
                console.log(info);
                if(info.success){
                    //渲染第一页
                    currentPage = 1;
                    render()
                    //隐藏模态框
                    $('#add-modal').modal('hide');
                    //重置表单
                    $('#form').data('bootstrapValidator').resetForm(true);
                }
            }
        })
    })
})