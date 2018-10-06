$(function(){
    //1.打开商品页面,动态渲染列表
    var currentPage = 1;
    var pageSize = 2;
    var picArr = [];
    render();
    function render(){
        $.ajax({
            type: 'get',
            url: '/product/queryProductDetailList',
            data: { page: currentPage, pageSize: pageSize },
            dataType: 'json',
            success: function (info) {
                console.log(info);
                var htmlStr = template('productTpl', info);
                $('tbody').html(htmlStr);
                //1.1添加分页
                $('#paginator').bootstrapPaginator({
                    //指定bootstrap版本号
                    bootstrapMajorVersion: 3,
                    totalPages: Math.ceil(info.total / info.size),
                    currentPage: info.page,
                    onPageClicked: function (a, b, c, page) {
                        currentPage = page,
                            render()
                    }
                })
            }
        }) 
    }
    //2.设置添加商品功能:
    
    $('.addProduct').click(function(){
       //2.1点击添加商品按钮,模态框弹出
        $('#add-modal').modal('show');
        //2.2发送ajax请求,动态渲染dropdown-menu中的li
        $.ajax({
            type:'get',
            url:'/category/querySecondCategoryPaging',
            data:{page:1,pageSize:100},
            dataType:'json',
            success:function(info){
                console.log(info)
                var htmlStr = template('secondTpl',info);
                $('.dropdown-menu').html(htmlStr);
            }
        })
    })
    //3.点击dropdown-menu中的li 获取内容 赋值给dropdownText
    $('.dropdown-menu').on('click','a',function(){
        $('#dropdownText').text($(this).text());
        //将对应的id存储在隐藏域中
        $('[name="brandId"]').val($(this).data('id'))
        $('#form').data('bootstrapValidator').updateStatus('brandId','VALID')
    })
    //4. 利用文件上传插件,实现图片的本地预览  
    $("#fileupload").fileupload({
        dataType: "json",
        //e：事件对象
        //data：图片上传后的对象，通过data.result.picAddr可以获取上传后的图片地址
        done: function (e, data) {
            //获取图片地址
            var imgSrc = data.result.picAddr;
            //根据图片地址创建img并添加到imgBox最前面
            picArr.push(data.result);
            $('#imgBox').prepend('<img src="' + imgSrc + '" width = "100">');
            if(picArr.length == 3 ) {
                $('#form').data('bootstrapValidator').updateStatus('picStatus','VALID')
            }
            if(picArr.length > 3 ){
                picArr.pop();
                $('#imgBox img:last-of-type').remove();
            }
            
            
        }
    });
    //5.利用validator插件完成表单校验
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
            brandId:{
                validators:{
                    notEmpty:{
                        message:'请输入二级分类名'
                    }
                }
            },
            proName:{
                validators:{
                    notEmpty:{
                        message:'请输入商品名称'
                    }
                }
            },
            proDesc:{
                validators:{
                    notEmpty:{
                        message:'请输入商品描述'
                    }
                }
            },
            num:{
                validators:{
                    notEmpty:{
                        message:'请输入商品库存'
                    },
                    regexp:{
                        regexp:/^[0-9]\d*$/,
                        message:'商品库存必须是非零数字'
                    }
                }
            },
            size:{
                validators:{
                    notEmpty:{
                        message:'请输入尺码'
                    },
                    regexp:{
                        regexp:/^\d{2}-\d{2}$/,
                        message:'请输入正确格式35-36的尺码'
                    }
                }
            },
            oldPrice:{
                validators:{
                    notEmpty:{
                        message:'请输入原价',
                    },
                    regexp:{
                        regexp:/^[1-9]\d*$/,
                        message:'请输入格式为数字的价格'
                    }
                }
            },
            price:{
                validators:{
                    notEmpty:{
                        message:'请输入现价'
                    },
                    regexp:{
                        regexp: /^[1-9]\d*$/,
                        message: '请输入格式为数字的价格'
                    }
                }
            },

            picStatus:{
                validators:{
                    notEmpty:{
                        message:'请上传3张图片'
                    }
                }
            }
        }
    })
    //6.表单校验成功,发送ajax请求,阻止validator的默认提交
    $('#form').on('success.form.bv', function (e) {
        e.preventDefault();
        var newDataForm = '';
        var str = '';
        str += '&' + 'picName1' + '=' + picArr[0].picName + '&' + 'picAddr1' + '=' + picArr[0].picAddr;
        str += '&' + 'picName2' + '=' + picArr[1].picName + '&' + 'picAddr2' + '=' + picArr[1].picAddr;
        str += '&' + 'picName3' + '=' + picArr[2].picName + '&' + 'picAddr3' + '=' + picArr[2].picAddr;
        var dataForm = $('#form').serialize();
        newDataForm = dataForm + str;
        console.log(newDataForm)
        $.ajax({
            type: 'post',
            url: '/product/addProduct',
            data: newDataForm,
            dataType: 'json',
            success: function (info) {
                // console.log(info);
                if (info.success) {
                    currentPage = 1;
                    render();
                    $('#add-modal').modal('hide');
                }
            }
        })
    })
})