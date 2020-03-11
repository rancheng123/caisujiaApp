const validate_rules = {

    //必填项
    'require': {
        "messages": function(value, element,params,validator){
            return "为必填项～"
        },
        "reg": (value, element,params,validator,currentRuleName,callback)=>{
            var res = value.trim() != ''
            callback(res,currentRuleName);
        }
    },
    //数字区间
    "range": {
        "messages": function(value, element,params,validator){
            return "请输"+ params[0] +"到"+ params[1] +"之间的数字～"
        },
        "reg": function (value, element,params,validator,currentRuleName,callback) {
            var res = Number(value)>=params[0] && Number(value)<=params[1]
            callback(res,currentRuleName);
        }
    },
    //字符区间
    "strRange": {
        "messages": function(value, element,params,validator){
            return "请输"+ params[0] +"到"+ params[1] +"位的字符～"
        },
        "reg": function (value, element,params,validator,currentRuleName,callback) {
            var length = value.trim().length;
            var res = length>=params[0] && length<=params[1]
            callback(res,currentRuleName);
        }
    },

    //字母与数字组合
    "letterAndNumber": {
        "messages": function(value, element,params,validator){
            return "请输入字母与数字组合～"
        },
        "reg": function (value, element,params,validator,currentRuleName,callback) {
            //未做完
            var value = value.trim();

            var res = /^[\d\-\sA-Za-z]*$/.test(value) && value.match(/\d/) && value.match(/[A-Za-z]/);
            callback(res,currentRuleName);
        }
    },
    //正整数
    "isIntGt0": {
        "messages": function(value, element,params,validator){
            return "请输入大于0的正整数～"
        },
        "reg": function (value, element,params,validator,currentRuleName,callback) {
            value = value.trim();
            var res = ((/^\d+$/.test(value)) && value>0);
            callback(res,currentRuleName);
        }
    },
    //是否相等
    "equal": {
        "messages": function(value, element,params,validator){
            return "与"+ params.chinese +"不一致～"
        },
        "reg": function (value, element,params,validator,currentRuleName,callback) {
            var value2 = validator.getNativeElementByName(params.name).value.trim();
            if(value2){
                value = value.trim();
                callback(value == value2,currentRuleName)
            }else{
                callback(true,currentRuleName)
            }

        }
    },
    //手机号
    "iphone": {
        "messages": function(value, element,params,validator){
            return "格式不正确！"
        },
        "reg": function (value, element,params,validator,currentRuleName,callback) {
            var res =  /^1[34578]\d{9}$/.test(value);
            callback( res,currentRuleName )
        }
    },
    //密码
    "password": {
        "messages": function(value, element,params,validator){
            return "请输入6-16位字母/数字"
        },
        "reg": function (value, element,params,validator,currentRuleName,callback) {
            var res =  /^(?![^a-zA-Z]+$)(?!\D+$)/.test(value);
            callback( res,currentRuleName )
        }
    },
    //邮箱
    "email":{
        "messages": function(value,element,params,validator){
            return "格式不正确！"
        },
        "reg": function(value, element,params,validator,currentRuleName,callback){
            var res = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/.test(value);
            callback( res , currentRuleName );
        }
    },
    //身份证验证
    "isCardNo":{
        "messages": function(value,element,params,validator){
            return "格式不正确！"
        },
        "reg": function(value, element,params,validator,currentRuleName,callback){
            var res = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(value);
            callback( res , currentRuleName );
        }
    },
    //依赖其它项
    "rely":{
        "messages": function(value, element,params,validator){
            return "请先输入"+ params.chinese
        },
        "reg": function (value, element,params,validator,currentRuleName,callback) {
            var res = validator.validateOne(params.name);
            callback( res,currentRuleName )
        }
    },
    //短信验证码
    "message_code":{
        "messages": function(value, element,params,validator){
            return "短信验证码不正确"
        },
        "reg": function (value, element,params,validator,currentRuleName,callback) {

            setTimeout(function(){

                //console.log(value, element,params,validator);
                console.log('message:::::',params.value);
                if(!validator.props.asyncData)return console.error('请填写异步加载的数据asyncData');

                //return value.trim() == validator.props.asyncData.message_code;
                return value.trim() == params.value;


                var res = (value.trim() == params.value);
                callback( res,currentRuleName )
            },3000)


        }
    },
    //用户名
    "username":{
        "messages": function(value, element,params,validator){
            return "不能包含特殊字符"
        },
        "reg": function (value, element,params,validator,currentRuleName,callback) {
            var specialStr = "[~#^$@%&!*()<>:;'\"{}]";
            var res = true;
            for(var i=0;i<value.length;i++){
                for(var j=0;j<specialStr.length;j++){
                    if(value[i]==specialStr[j]){
                        res = false;
                        break;
                    }
                }
            }
            callback( res,currentRuleName );
        }
    },
    //详细地址
    "addressDetail":{
        "messages": function(value, element,params,validator){
            return "您输入的地址太长！"
        },
        "reg": function (value, element,params,validator,currentRuleName,callback) {
            var res = '';
            if(value.length>60){
                res = true;
            }else{
                res = false;
            }
            callback( res,currentRuleName );
        }
    }
}

export default validate_rules;
