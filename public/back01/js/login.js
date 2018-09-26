//利用bootstrapValidator实现前端校验功能
$(function(){
    //1.表单基本验证
    $('#form').bootstrapValidator({
        //1.1指定校验时图标显示
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
          },
        //1.2.指定校验的字段
        fields:{
            username:{
                validators:{
                    notEmpty:{
                        message:'同户名不能为空'
                    },
                    stringLength:{
                        min:2,
                        max:6,
                        message:'用户名长度为2-6位'
                    },
                    callback:{
                        message:'用户名错误'
                    }
                }
            },
            password:{
                validators:{
                    notEmpty:{
                        message:'密码不能为空'
                    },
                    stringLength:{
                        min:6,
                        max:12,
                        message:'密码长度为6-12位'
                    },
                    callback:{
                        message:'密码错误'
                    }
                }
            }
        }
    })
    //2.通过ajax提交表单验证用户名密码是否正确,表单验证成功时会触发
    $('#form').on('success.form.bv',function(e){
        //2.1阻止表单默认提交,用ajax进行提交
        e.preventDefault();
        //2.1使用ajax提交
        $.ajax({
            type:'post',
            url:'/employee/employeeLogin',
            data:$('#form').serialize(),
            dataType:'json',
            success:function(info){
                console.log(info);
                if(info.success){
                    location.href = 'index.html'
                }
                if(info.error == 1000){
                    //用户名错误
                    console.log(info.message)
                    $('#form').data('bootstrapValidator')
                    .updateStatus('username','INVALID','callback')
                }
                if(info.error == 1001){
                    //密码错误
                    console.log(info.message)
                    $('#form').data('bootstrapValidator')
                    .updateStatus('password','INVALID','callback')
                }
            }
        })
    })
    //3.重置表单功能设置
    $('[type = reset]').click(function(){
        $('#form').data('bootstrapValidator').resetForm();
    })
})