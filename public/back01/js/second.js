$(function(){
    //定义变量,存储当前页,和条数
    //1.打开页面时,发送ajax请求,渲染页面
    var currentPage = 1;
    var pageSize = 5;
    render();
    function render(){
        $.ajax({
            type:'get',
            url:'/category/querySecondCategoryPaging',
            data:{page:currentPage,pageSize:pageSize},
            dataType:'json',
            success:function(info){
                console.log(info);
                var htmlStr = template('secondList',info);
                $('tbody').html(htmlStr);
                //添加分页功能
                $('#paginator').bootstrapPaginator({
                    bootstrapMajorVersion:3,
                    currentPage:currentPage,
                    totalPages:Math.ceil(info.total/info.size),
                    onPageClicked: function (event, originalEvent, type, page){
                        currentPage = page;
                        render();
                    }
                })
            }
        })
    }
    //2.添加分类按钮功能
    //2.1点击分类按钮,模态框显示,动态创建li并添加到ul中
    $('.addCategory').click(function(){
        $('#add-modal').modal('show');
        $.ajax({
            type:'get',
            url:'/category/queryTopCategoryPaging',
            data:{page:1,pageSize:100},
            dataType:'json',
            success:function(info){
                console.log(info);
                var htmlStr = template('firstList',info);
                $('#dropdownList').html(htmlStr);

            }
        })
    })
    //2.2点击动态创建好的li元素,
    $('#dropdownList').on('click','a',function(){
        // 使button按钮的内容 == li元素中的内容
        $('.dropdownTxt').text($(this).text());
        //设置下方输入框的内容
        $('[name = categoryId]').val($(this).data('id'))

        $('#form').data('bootstrapValidator').updateStatus('categoryId', 'VALID')
        
    })
    //2.3引入uploadfile插件,获取图片地址,实现本地预览
    $("#fileupload").fileupload({
        dataType: "json",
        //e：事件对象
        //data：图片上传后的对象，通过data.result.picAddr可以获取上传后的图片地址
        done: function (e, data) {
            $('#upImg').attr('src', data.result.picAddr);
            $('#imgSrc').val(data.result.picAddr);
            $('#form').data('bootstrapValidator').updateStatus('brandLogo', 'VALID')
        }
    });

    //2.4 添加表单校验
    $('#form').bootstrapValidator({
         //1. 指定不校验的类型，默认为[':disabled', ':hidden', ':not(:visible)'],可以不设置
        excluded: [],
        //2. 指定校验时的图标显示，默认是bootstrap风格
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields:{
            categoryId:{
                validators:{
                    notEmpty:{
                        message:'请选择一级分类'
                    }
                }
            },
            brandName:{
                validators:{
                    notEmpty:{
                        message:'请输入二级分类'
                    }
                }
            },
            brandLogo:{
                validators:{
                    notEmpty:{
                        message:'请上传图片'
                    }
                }
            }
        }
    })
    //2.5发送请求
    $('#form').on('success.form.bv',function(e){
        e.preventDefault();
        $.ajax({
            type:'post',
            url:'/category/addSecondCategory',
            data:$('#form').serialize(),
            dataType:'json',
            success:function(info){
                if(info.success){
                    currentPage = 1;
                    render()
                    $('#add-modal').modal('hide')
                    $('#form').data('bootstrapValidator').resetForm(true);
                    $('.dropdownTxt').text('请输入一级分类');
                    $('#upImg').attr("src", "images/none.png");
                }
               
            }
        })
    })

//         | brandName | 是 | 品牌名称 |
// | categoryId | 是 | 所属分类id |
// | brandLogo | 是 | 品牌logo图片地址 |
// | hot | 是 | 火热的品牌 |
})