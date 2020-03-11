# React-isScroll(上拉刷新，下拉加载)

#### 参数

isScrollOpts  （isScroll 插件选项，必填）

customOpts （react-isScroll选项，必填）

#### 使用实例

```
<ReactIscroll $id="module3-reactIscroll"
              isScrollOpts={{
                  //支持滚轮
                  mouseWheel: true ,
                  //请用scoll事件
                  probeType: 3
              }}
              customOpts={{
                  // 滑动区域高度
                  height:300,
                  // 接口返回数据总条数
                  dataNum: 34,
                  // 一次加载的条数
                  pageSize: 10,
                  // 监测到用户想要获取数据的回调 （内部填写ajax代码）
                  getDataFn: (obj)=>{
                      that.getProgramList(obj)
                  }
              }}
>
    <ul>
        {lis}
    </ul>
</ReactIscroll>
```



