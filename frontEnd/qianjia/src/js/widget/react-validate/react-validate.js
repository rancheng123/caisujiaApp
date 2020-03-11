import React, { Component, PropTypes } from 'react';
import validate_rules from './rules.js'
import _ from 'underscore';



class Validate extends Component{
    constructor(){
        super();

        //搜索的元素
        this.searchElements = {};
        //缓存的元素
        this.cacheElements = {};
        //存储待验证元素（ 由searchElements 与 cacheElements 比对得出 ）
        this.elements = {};
        this.id = "validateWrap" + Date.now();

        //name标识
        this.nameFlag = 'data-validName';
        //rules标识
        this.rulesFlag = 'data-validRules';
        //前缀标识
        this.msgPrefixFlag = 'data-validMsgPrefix';
        //取值标识
        this.setValueFlag = 'data-valid-setValue';

    }

    componentWillMount(){
        this.state={

        }
    }
    componentDidMount(){
        var that = this;
        // 存储 start
        componentStore.set(this);
        // 存储 end

        that.scan();


    };
    componentWillUnmount(){
        // 存储 start
        componentStore.clear(this);
        // 存储 end
    };

    //扫描
    scan(){
        var that = this;
        //查找校验元素
        that.findValidateElements(this.props.children);

        //新老对比计算 最终的元素
        that.computeElements();



    }

    //新老对比计算 最终的元素
    computeElements(){
        var that = this;
        //新老比对
        var searchElementsLength = _.keys(that.searchElements).length;
        var cacheElementsLength = _.keys(that.cacheElements).length;

        if(searchElementsLength >= cacheElementsLength){
            var json = that.searchElements;
        }else{
            var json = that.cacheElements;
        }
        _.each(json, function(reactEle, name) {
            var nativeEle = that.getNativeElementByName(name);

            //无规则  有元素， 加规则
            if(!that.elements[name] && nativeEle){
                that.elements[name] = reactEle;
            }
            //有规则  无元素， 去规则
            else if(that.elements[name] && !nativeEle){
                that.elements[name] = null;
                delete that.elements[name];
            }

        })

        that.cacheElements = _.extend({},that.elements);
    }

    findValidateElements(reactEles){
        var that = this;

        if( Object.prototype.toString.call(reactEles) != "[object Array]" ){
            reactEles = [reactEles];
        }

        for( var reactEle of reactEles ){

            if(typeof reactEle != 'undefined'){
                //是不是验证元素
                if(reactEle.props && reactEle.props[that.rulesFlag]){
                    var name = reactEle.props[that.nameFlag];
                    if(!this.searchElements[name]){
                        this.searchElements[name] = reactEle;
                    }
                }

                //是不是有子集
                if(reactEle.props && reactEle.props.children){
                    //查找校验元素
                    that.findValidateElements(reactEle.props.children);
                }
            }
        };


    };

    //验证单个
    validateOne(name){
        var that = this;
        var ele = that.elements[name];
        if( Object.prototype.toString.call(ele) == "[object Object]" && ele.hasOwnProperty('$$typeof') ){


            var reactEle = ele;

            var rules = reactEle.props[that.rulesFlag];

            var msgPrefix = reactEle.props[that.msgPrefixFlag];

            var nativeEle = that.getNativeElementByName(name);


            if(rules){



                for(var rule of rules){

                    var ruleName = rule.name;
                    var ruleParams = rule.params;

                    var value = that.getValue(name);


                    if(validate_rules.hasOwnProperty(ruleName)){
                        var currentRuleName = name+'_'+ruleName;
                        validate_rules[ruleName].reg(value,reactEle,ruleParams,that,currentRuleName,function(res,currentRuleName){
                            that.count++;
                            that.validateCircle[currentRuleName] = true;





                            //非必填，无值（默认通过校验）
                            var name= currentRuleName.split('_')[0];
                            var value = that.getValue(name);
                            if( !that.isRequired( that.elements[name] ) && value.trim() == '' ){
                                res = true;
                            }




                            if(!res){
                                //单个元素多个错误，只报一个错误
                                if(that.isOK){
                                    that.showError({
                                        errorMsg: msgPrefix + validate_rules[ruleName].messages(value,reactEle,ruleParams,that),
                                        errorRule:ruleName,
                                        nativeEle,
                                        reactEle
                                    })

                                    that.isOK = false;

                                }
                            };



                            if(that.timer){
                                clearInterval(that.timer);
                            }






                            if(that.isValidateCompelete()){
                                that.callback(that.isOK);
                                return;
                            }


                            that.timer = setTimeout(function(){
                                console.error('rule.js的callback必须调用')
                            },3000);
                        });

                    }else{
                        console.error(ruleName+ '规则未定义')
                    }
                }
            }
        }
    }

    //是否必填
    isRequired(reactEle){
        var that = this;
        for(var rule of reactEle.props[that.rulesFlag]){
            if(rule.name == 'require'){
                return true;
            }
        }
        return false;
    }

    //是否所有校驗完成
    isValidateCompelete(){
        var that = this;
        var res = true;
        for(var key in that.validateCircle){
            if(that.validateCircle[key] == false){
                res = false;
            }
        }
        return res;
    };

    //收集一輪的校验规则
    collectValidateRules(json){
        var that = this;
        that.validateCircle = {};
        for(var name in json){
            var rules = json[name].props['data-validRules'];
            var value = that.getValue(name)
            //非必填，无值（跳过）
            /*if( !that.isRequired( that.elements[name] ) && value.trim() == '' ){
                continue;
            }*/
            for(var rule of rules){
                that.validateCircle[name+'_'+rule.name] = false;
            }
        }
    };


    //验证全部
    validate(opts){

        var that = this;


        //统计验证
        that.count = 0;
        //是否验证通过（默认通过）
        that.isOK = true;

        var eleNames = opts.eleNames;
        that.callback = opts.callback;





        if(eleNames){
            var json = {};
            for(var eleName of eleNames){
                json[eleName] = that.elements[eleName];
            }


        }else{
            var json = that.elements
        }




        that.collectValidateRules(json)






        for(var name in json){
            var value = that.getValue(name)

            //非必填，无值（跳过）
            /*if( !that.isRequired( that.elements[name] ) && value.trim() == '' ){
                continue;
            }*/

            that.validateOne(name);
        };
    };

    showError(obj){
        if(this.props.onError){
            this.props.onError(obj)
        }else{
            alert(obj.errorMsg);
        }
    };

    getNativeElementByName(name){
        var that = this;
        var match = [];
        var validateWrap = document.getElementById(this.id);

        var eles = validateWrap.getElementsByTagName('*');
        for(var i=0;i<eles.length;i++ ){
            var ele = eles[i];
            // this.nameFlag = 'data-validName';
            if(ele.getAttribute(that.nameFlag) && ele.getAttribute(that.nameFlag)==name){
                match.push(ele);
            }
        }


        //组件内 name属性不允许重复
        if(match.length>1){
            console.error('验证组件内的name属性不能重复')
        }
        return match[0]?match[0]:null;
    }

    getValue(name){

        var that = this;
        var reactEle = that.elements[name];

        if(reactEle.props && reactEle.props[that.setValueFlag]){
            var value = reactEle.props[that.setValueFlag]();
        }else{
            var nativeEle = that.getNativeElementByName(name);
            //输入框值
            var value = nativeEle.value;
        };
        return value;
    }


    render(){

        var that = this;
        return (
            <div id={this.id}>
                {that.props.children}
            </div>
        )
    }
}

export default Validate;