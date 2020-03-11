


class Dome extends Component{

    render(){

        return (
            <div>

                <Validate $id="module3_validate"
                          //校验报错回调
                          onError={(obj)=>{
                                Modal.alert('提示',obj.errorMsg, [
                                    { text: '取消', onPress: () => console.log('cancel') },
                                    { text: '确定', onPress: () => console.log('ok'), style: { fontWeight: 'bold' } },
                                ])
                          }}
                >


                    {/* 实例1 （非输入框）*/}
                            <div
                                 //校验名称
                                 data-validName="brands"
                                 //校验规则
                                 data-validRules={[{
                                     name: 'require'
                                 },{
                                     //规则名称
                                     name: 'range',
                                     //规则参数
                                     params: [0,3]
                                 }]}
                                 //校验信息前缀
                                 data-validMsgPrefix={'品牌：'}
                                //校验值指定（若无，默认取value,  如 输入框）
                                 data-valid-setValue={()=>{
                                     return that.state.form.brand? '1': ''
                                 }}
                            >
                                <Brands $id="module3-brands"
                                        defaultBrand={that.state.form.brand}
                                        onChange={(current)=>{
                                            that.state.form.brand = current.name;
                                            componentStore.update(that,that.state)
                                        }}
                                >

                                </Brands>
                            </div>


                    {/*实例2 （输入框）*/}

                            <div>
                                姓名： <input type="text" value={that.state.form.name}
                                           onChange={(obj)=>{
                                               that.state.form.name = obj.target.value;

                                               componentStore.update(that,that.state)

                                           }}

                                           data-validName="name"
                                           data-validRules={[{
                                               name: 'require'
                                           },{
                                               name: 'isIntGt0'
                                           },{
                                               name: 'range',
                                               params: [0,3]
                                           }]}
                                           data-validMsgPrefix={'姓名：'}/>

                            </div>

                            <div>
                                密码： <input type="text" value={that.state.form.password}
                                           onChange={(obj)=>{
                                               that.state.form.password = obj.target.value;
                                               componentStore.update(that,that.state)
                                           }}

                                           data-validName="password"
                                           data-validRules={[{
                                               name: 'require'
                                           },{
                                               name: 'equal',
                                               params: {
                                                   name: 'confirmPassword',
                                                   chinese: '确认密码'
                                               }
                                           }]}
                                           data-validMsgPrefix={'密码：'}/>

                            </div>
                            <div>
                                确认密码： <input type="text"  value={that.state.form.confirmPassword}
                                             onChange={(obj)=>{
                                                 that.state.form.confirmPassword = obj.target.value;
                                                 componentStore.update(that,that.state)
                                             }}

                                             data-validName="confirmPassword"
                                             data-validRules={[{
                                                 name: 'require'
                                             }]}
                                             data-validMsgPrefix={'确认密码：'}/>

                            </div>


                    <div>
                        <input type="button" value="下一步" onClick={()=>{

                            //校验全部
                            var res = that.refs.validator.validateAll();
                            //校验单个（参数是 data-validName的值）
                            var res = that.refs.validator.validateOne('images');

                            if(res){
                                console.log('通过')
                            }

                        }}/>


                    </div>

                </Validate>
            </div>
        )
    }

}

export default Dome;
