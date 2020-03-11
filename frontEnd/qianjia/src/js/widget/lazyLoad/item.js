/**
 * Created by 唐丹 on 2017/3/31.
 */
import React, { Component, PropTypes } from 'react';
import { Router, Route, Link ,hashHistory} from 'react-router';

//导入样式 start
import './lazyload.scss'
//导入样式 end

let arrImg = [
    {
        url : 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1490961164626&di=c765c8ca5dea9078fcd7583a82907485&imgtype=0&src=http%3A%2F%2Fimage96.360doc.com%2FDownloadImg%2F2016%2F05%2F0704%2F71225622_6.jpg'
    },
    {
        url : 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1490961164997&di=c624a2921ec2fe7a5bdfe1eff94069b2&imgtype=0&src=http%3A%2F%2Fpic1.win4000.com%2Fwallpaper%2F3%2F57c69ab43eba9.jpg'
    },
    {
        url : 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1490961164997&di=d7121b1b9cb7df750aa579d888e47d2f&imgtype=0&src=http%3A%2F%2Fimg5.duitang.com%2Fuploads%2Fitem%2F201510%2F22%2F20151022141314_R2mCG.jpeg'
    },
    {
        url : 'https://gss0.baidu.com/7Po3dSag_xI4khGko9WTAnF6hhy/zhidao/pic/item/b219ebc4b74543a9adf1026f1c178a82b80114ae.jpg'
    },
    {
        url : 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1490961338160&di=89ecef73215f482d56f491a6e9b89ece&imgtype=0&src=http%3A%2F%2Fimages.ali213.net%2Fpicfile%2Fpic%2F2014%2F03%2F27%2F927_20140327175625955.jpg'
    },
    {
        url : 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1490961338160&di=56be803b369de17dc6ee815976db232d&imgtype=0&src=http%3A%2F%2Fpic.90sjimg.com%2Fback_pic%2F00%2F04%2F13%2F75%2Fee5b0572b99b40dbe468d92ece7326d1.jpg'
    },
    {
        url : 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1490961338160&di=53ad3e70cf2b61ede51376aa917db9d4&imgtype=0&src=http%3A%2F%2Ffile06.16sucai.com%2F2016%2F0315%2Fe6cd8baf701ca2172e884d1efcb4dde0.jpg'
    },
    {
        url : 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1490961338160&di=97ad7e76afb0b2f2af59ac3ae38634ba&imgtype=0&src=http%3A%2F%2Ffile06.16sucai.com%2F2016%2F0315%2Fdca2a26c81ebb1275bacf3bec20bddec.jpg'
    }
];

class Item extends Component{
    constructor(){
        super();
    }
    componentWillMount(){

        //在此处初始化状态
        this.state={
            link:"1"
        }
    }

    componentDidMount(){
        // 存储 start
        componentStore.set(this);
        // 存储 end
    };
    componentWillUnmount(){
        // 清除 start
        componentStore.clear(this);
        // 清除 end
    };

    render(){
        return (
            <div className="lazyload">
                <ul className="img-list">
                    <Item $id="lazyloadItem" imgObj={this.state.imgObj} />
                </ul>
            </div>
        )
    }
}



export default Item;
