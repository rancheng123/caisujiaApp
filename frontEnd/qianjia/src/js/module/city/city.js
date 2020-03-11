import React, { Component, PropTypes } from 'react';

class City extends Component{
    constructor(){
        super();
    }
    componentWillMount(){
        //在此处初始化状态
        this.state={
            currentCity: this.getDisplayCityName(Utils.Storage.get('currentCity')),
            originCurrentCity: Utils.Storage.get('currentCity')
        }
    }

    componentDidMount(){
        var that  = this;
        // 存储 start
        componentStore.set(this);
        // 存储 end


        //没有保存过城市，自动定位
        if(!that.state.currentCity){
            var map = new BMap.Map("allmap");
            var myCity = new BMap.LocalCity();
            myCity.get(function myFun(result){
                var cityName = result.name;



                Utils.Storage.set('currentCity',cityName);
                that.state.currentCity = that.getDisplayCityName(Utils.Storage.get('currentCity'));
                componentStore.update(that,that.state);

                that.props.positionCityCallback && that.props.positionCityCallback();

            });
        }
        //
        else{
            that.props.positionCityCallback && that.props.positionCityCallback();
        }
    };
    componentWillUnmount(){
        // 清除 start
        componentStore.clear(this);
        // 清除 end
    };

    getDisplayCityName(originalCityName) {
        return originalCityName.replace("市","")
            .replace("地区","").replace("林区","").replace("特别行政区","")
            .replace("自治州","").replace("自治县","").replace("蒙古族","")
            .replace("蒙古","").replace("苗族","").replace("藏族","")
            .replace("羌族","").replace("黎族","").replace("回族","")
            .replace("傣族","").replace("景颇族","").replace("白族","")
            .replace("土家族","").replace("哈尼族","").replace("彝族","")
            .replace("柯尔克孜","").replace("傈僳族","").replace("布依族","")
            .replace("侗族","").replace("朝鲜族","").replace("哈萨克","")
            .replace("壮族","");
    };

    render(){
        var that = this;

        return (
            <div onClick={()=>{
                    Utils.switchRoute('/cityList?'+'backroute='+ that.props.jumpTo)
                }}
            >{this.state.currentCity}</div>
        )
    }

}

export default City;
