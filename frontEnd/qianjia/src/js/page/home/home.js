import React, { Component, PropTypes } from 'react';
//导入样式 start
import './home.scss'
//导入样式 end
import TitleBar from '../../module/titleBar/titleBar';

//渲染进程 载入主进程代码  start
import electron, { ipcRenderer ,remote } from 'electron';
window.remote = remote;

var home_main = remote.require('/Users/mxj/zoom/caisujiaApp/frontEnd/qianjia/src/js/page/home/home_main.js')



//  如果bb方法执行失败， 报错Could not call remote function 'bb'
home_main.bb()
//渲染进程 载入主进程代码  end






var ipc = electron.ipcRenderer

ipc.on('error-msg', (event, msg) => {
    debugger
    let elem = document.querySelector('#app-msg')
    elem.innerText = msg
    elem.setAttribute('style', '')
    elem.setAttribute('class', 'app-error-msg')

    setTimeout(() => {
        elem.setAttribute('style', 'display:none')
    }, 3000)

    // window.alert(msg)
})


class Home extends Component{
    constructor(){
        super();
    }
    componentWillMount(){
        //在此处初始化状态
        this.state={
            devToolsStatus: false
        }
    }

    componentDidMount(){
        var that = this;
        // 存储 start
        componentStore.set(this);
        // 存储 end




        /*
        调试 和分析 webRtc
            工具：
                https://test.webrtc.org/

                chrome://webrtc-internals

                    1.RTCPeerConnection事件  失败将显示红色。
                    2.统计数据列表

                        ssrc（Stream Source）表示流源

                            绍了轨道的吞吐量，RTCP往返时间

                        bweforvideo   对等连接的带宽估计报告



                        //获取统计数据
                        pc.getStats(function(stats) {
                           debugger
                        });

    */


        /*
        自己没有实现的功能：
            1. 有人说话时，micphone 图标 变亮
                zoom 的实现方法:   socket服务端 返回音量，前端展示
                {
                   "body" : {
                      //用户1 的音量
                      "asn1" : 16778240,
                      "asn2" : 16779264
                   },
                   "evt" : 12033,
                   "seq" : 157
                }
    }

        */



        //直播中，H5实时解码音频并播放
        //https://www.jianshu.com/p/d45031b5d2c1


        /*
        目标: 自己的程序 连接现有的声网andrio

        */



        var userId = parseUrl(location.href).params.userId;

        var otherUserId = null;
        var pc;
        var ws;
        var connections;


        //本地视频流（当前用户自己的视频流）
        var localStream = null;
        //meeting 视频会议     screenShare 投屏
        var type = parseUrl(location.href).params.type;

        start()
        function start(){

            if(!userId){
                console.error('缺少参数 userId, 请输入正确的url,如屏幕类型         https://10.28.12.83:9001/meeting.html?userId=screen \\\n'+
                    '                                用户类型 视频会议 https://10.28.12.83:9001/meeting.html?userId=1&type=meeting  \\\n' +
                    '                                用户类型 投屏     https://10.28.12.83:9001/meeting.html?userId=2&type=screenShare  \\\n'

                );
                return;
            }

            //
            if(userId != 'screen'){
                if(!type){
                    console.error('缺少参数 type, 请输入正确的url,如 https://10.28.12.83:9001/meeting.html?type=meeting&userId=2');
                    return
                }
            }






            //信令
            ws = new WebSocket('wss://' + '192.168.1.2:9001');

            ws.onopen = (event)=>{
                //加入会议
                ws.send(JSON.stringify({
                    userId: userId,
                    'action' : 'join'
                }));
            }


            //此处是 调试webRtc 的一个重要区域
            ws.onmessage = function (event) {
                var data = JSON.parse(event.data);

                switch ( data.action) {
                    case 'answer' :
                        pc.setRemoteDescription(new RTCSessionDescription(data.answer))
                        break
                    case "candidate":


                        //接受远端传来的candidate
                        pc.addIceCandidate(new RTCIceCandidate(data.candidate))


                        /*
                        data.candidate.candidate 里面的type 参数

                            1.host                                   表示   与本地局域网上设备  的连接
                            2.srflx（服务器反身性Server Reflexive）    表示   通过公网Ip转换      的连接
                            3.relay                                  用于描述TURN的连接性。当双方都提供这样的数据包时，那么连接是绝对可能进行的。

                        */


                        break
                    case "create":

                        otherUserId = data.from

                        reactiveSendLocalStream(data.offer,data.from)
                        break

                    //由用户关闭
                    case "close":
                        var closedVideo = document.getElementById(data.closedUserId);
                        if(closedVideo){
                            document.body.removeChild(closedVideo)
                        }

                        break

                    case "joinSuccess":

                        // 屏幕   加入房间后，展示房间号
                        if(userId == 'screen'){



                        }
                        // 只有客户（非屏幕）才开启摄像头
                        else{

                            ws.send(JSON.stringify({
                                'action' : 'getConnections'
                            }));



                        }



                        break

                    case "getConnectionsSuccess":

                        connections = data.data


                        //测试 start
                        connections.screen = true;
                        //测试 end

                        if(!connections.screen){
                            alert('大屏幕（主持人）没有正常启动')
                        }else{




                            //视频会议
                            if(type == 'meeting'){
                                getStream()

                            }
                            //投屏
                            else{

                                window.postMessage('getScreenCaptureSourceId')


                            }









                        }



                        break
                }
            }




            window.addEventListener('message', function (event) {
                console.log(event.data.sourceId)


                if(event.data.type == 'responseSourceId'){

                    getStream(event.data.sourceId)





                }
            });


        }














        function getStream(sourceId){


            if(type == 'meeting'){
                var config = {
                    audio: true,
                    video: {
                        mandatory: {},
                        optional: [],

                        //获取一个最接近 1280x720 的相机分辨率
                        // width: 1280, height: 720,
                        //
                        // //帧率
                        // frameRate: {
                        //     ideal: 10,
                        //     max: 15
                        // },
                        //
                        // //前置或者后置摄像头  "user" : "environment"
                        // facingMode: "user"
                    }
                }
            }else{
                var config = {
                    audio: true,
                    video: {
                        mandatory: {
                            chromeMediaSource: 'desktop',
                            chromeMediaSourceId: sourceId,
                            minWidth: 1280,
                            maxWidth: 1920,
                            minHeight: 720,
                            maxHeight: 1080
                        }
                    }
                }
            }

            navigator.webkitGetUserMedia(config, (stream)=>{
                localStream = stream;

                showStream(localStream,'me')



                //除了自己，向其他人和屏幕依次发起视频会议
                var otherUsers = connections.users.concat(connections.screen).filter((ele,i)=>{
                    return ele != userId
                })

                launchVideoByQueue(otherUsers);







                return;





                //判断是否支持这种类型
                MediaRecorder.isTypeSupported('video/webm;codecs=vp9')

                //音视频采集
                var mediaRecorder = new MediaRecorder(stream, {
                    audioBitsPerSecond : 128000, // 音频码率
                    videoBitsPerSecond : 100000, // 视频码率

                    // 编码格式
                    mimeType : 'video/webm' +
                        // 编码格式
                        ';codecs=h264'

                    //codecs=h264
                    //codecs=vp8
                    //codecs=vp9


                })
                mediaRecorder.start()


                //停止录制. 同时触发dataavailable事件
                //mediaRecorder.stop()

                mediaRecorder.ondataavailable = function (e) {
                    console.log(e)
                    // 下载视频
                    var blob = new Blob([e.data], { 'type' : 'video/mp4' })
                    let a = document.createElement('a')
                    a.href = URL.createObjectURL(blob)
                    a.download = `test.mp4`
                    a.click()
                }


            }, (e)=>{
                debugger
            })





        }


        function controllStream(){
            return;




            remoteStream.onactive = ()=>{
                debugger
            }
            remoteStream.oninactive = ()=>{
                debugger
            }
            remoteStream.onaddtrack = ()=>{
                debugger
            }
            remoteStream.onremovetrack = ()=>{
                debugger
            }
            remoteStream.ondatachannel = ()=>{
                debugger
            }


            window.remoteStream = remoteStream;
            window.videoTrack = remoteStream.getVideoTracks()[0];


            //关闭视频
            //videoTrack.stop()

            localStream.getAudioTracks().forEach(function(e) {
                e.enabled = false
            })

            remoteStream.getAudioTracks().forEach(function(e) {
                e.enabled = false
            })

            videoTrack.onended = ()=>{
                debugger
            }
            videoTrack.onunmute = ()=>{
                debugger
            }
            videoTrack.onmute = ()=>{
                debugger
            }


            if(1){

                var constraints = {
                    video: true,
                    audio: {
                        "sampleSize": 16,
                        "channelCount": 2,
                        "echoCancellation": false
                    }
                }


                //测试 start
                navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {

                    localStream = stream;
                    var localAudioTrack = localStream.getAudioTracks()[0];

                    localStream.getAudioTracks()[0].enabled = false

                    //window.cloneTrack = localAudioTrack.clone();
                    //localAudioTrack.stop();



                    //window.newStream = new MediaStream()
                    //newStream.addTrack(cloneTrack)







                    let audioTracks = stream.getAudioTracks();
                    let videoTracks = stream.getVideoTracks();


                    if (audioTracks.length) {
                        audioTrack = audioTracks[0];
                        audioTrack.getSettings()


                        //动态更改限制
                        constraints.audio.echoCancellation = true;
                        audioTrack.applyConstraints({
                            "echoCancellation": true
                        }).then(() => {

                            /* do stuff if constraints applied successfully */
                        }).catch(function(reason) {
                            debugger
                            /* failed to apply constraints; reason is why */
                        });

                    }
                    if (videoTracks.length) {

                        videoTrack = videoTracks[0];

                        videoTrack.getSettings()

                        videoTrack.getConstraints();




                        videoTrack.applyConstraints({

                            //前置摄像头
                            //facingMode: 'user',

                            //后置摄像头
                            facingMode: { exact: "environment" }
                        }).then(() => {

                            /* do stuff if constraints applied successfully */
                        }).catch(function(reason) {

                            /* failed to apply constraints; reason is why */
                        });
                    }
                    return stream
                }).then(function(stream) {
                    localStream = stream;

                    showStream(localStream,'me')



                    //除了自己，向其他人和屏幕依次发起视频会议
                    var otherUsers = connections.users.concat(connections.screen).filter((ele,i)=>{
                        return ele != userId
                    })

                    launchVideoByQueue(otherUsers);
                }).then(function() {
                    getCurrentSettings();
                }).catch((err)=>{
                    console.log(err)

                });

                //测试 end
            }else{

            }






            return;
            //设备相关
            navigator.mediaDevices.enumerateDevices()
                .then(devices => {

                    console.log(devices)

                    var micPhone = devices[1];
                    var speaker = devices[3];
                    var camera = devices[2]





                    //测试 start
                    config = {
                        audio: {
                            optional: [{
                                deviceId: speaker.deviceId
                            }]
                        },
                        video: {
                            optional: [{
                                sourceId: camera.deviceId
                            }]
                        }
                    }
                    //测试 end



                });


            //获取支持的能力
            navigator.mediaDevices.getSupportedConstraints()
        }



        //按循序发起视频会议
        function launchVideoByQueue(otherUsers){

            otherUserId = otherUsers.pop();
            if(otherUserId){
                poactiveSendLocalStream()



                //此处需要优化
                setTimeout(()=>{
                    launchVideoByQueue(otherUsers)
                },1000)

            }
        }


        //被动发送本地流
        function reactiveSendLocalStream(offer){
            pc = createPeerConnection();
            pc.setRemoteDescription(new RTCSessionDescription(offer));

            //用户（非屏幕）返回视频流
            if(userId != 'screen'){
                pc.addStream(localStream)
            }

            pc.createAnswer(function (answer) {
                pc.setLocalDescription(answer);
                ws.send(JSON.stringify({
                    'from': userId,
                    'to': otherUserId,
                    'action' : 'answer' ,
                    'answer' : answer
                }));
                //offerer.setRemoteDescription(answer);
            }, function() {}, {
                optional: [],
                mandatory: {
                    OfferToReceiveAudio: true,
                    OfferToReceiveVideo: true
                }
            });
        }




        function createPeerConnection(){
            /*
               webRtc(Web Real-Time Communications)
                   实时通讯
                   作用：建立点对点（Peer-to-Peer）的连接，实现视频流，音频流的传输
                   应用场景：数据分享和电话会议
                   支持： 浏览器，原生移动app(andiro,ios)
                   核心技术:
                        音视频的采集、编解码、网络传输、显示

                        视频
                            采集
                                支持多种媒体类型，比如I420、YUY2、RGB、UYUY等，
                                可以帧大小和帧率控制。
                            编解码
                                I420

                                VP8
                                    能以更少的数据提供更高质量的视频，特别适合视频会议这样的需求


                                Flv、Mp4、Mov可以理解为是容器，里面是编码的音视频数据


                            加密 (video_engine_encryption)
                                会有性能的代价
                            媒体文件
                                1.可以用本地文件作为视频源
                                2.可以录制音视频到本地文件

                            图像处理
                                针对每一帧的图像进行处理，包括明暗度检测、颜色增强、降噪处理等功能，用来提升视频质量。
                            显示

                            网络传输与流控
                                RTP
                                RTCP

                       音频
                            音频设备
                            编解码
                                iLIBC/iSAC/G722/PCM16/RED/AVT



                   webRtc 架构

                       webApi(js api):
                            Network Stream API
                                MediaStream        表示一个媒体数据流
                                MediaStreamTrack   表示一个媒体源

                            RTCPeerConnection
                                RTCPeerConnection  允许在浏览器间通讯
                                RTCIceCandidate    表示一个ICE协议的候选者
                                RTCIceServer       表示一个ICE协议 Server。


                                ICE (Interactive Connectivity Establishment,交互式连接建立)
                                    本质
                                        是一种NAT传输协议（建立在STUN协议和TURN协议之上）

                                        NAT（Network Address Translation，网络地址转换）
                                    作用
                                        用于建立多媒体会话

                                    工作流程
                                        1.每个端 有多个传输地址候选（CANDIDATE）

                                            HOST             CANDIDATE
                                            SERVER REFLEXIVE CANDIDATES
                                            RELAYED          CANDIDATES


                                        2.找出可以用的 一对候选地址（候选地址有多个，但并不是都能用）







                                //代表了一端的会话能力
                                SDP（Session Description Protocol，会话描述协议）
                                    本质
                                        是一种标准（描述信息）
                                    组成
                                        会话名称
                                        会话目的
                                        会话的激活时间
                                        会话的媒体(media)
                                        会话的带宽信息
                                        会话拥有者的联系信息

                                    Offer/Answer模型

                                        offer
                                            本质
                                                SDP报文
                                            包含
                                                多媒体流
                                                编解码方法

                                        answer
                                            本质
                                                SDP报文
                                            包含
                                                多媒体流
                                                编解码方法



                            Peer-to-peer Data API

                                DataChannel        表示一个在两个节点之间的双向的数据通道 。


                       WebRTC Native C++ API
                            浏览器厂商基于C++Api 实现Web API

                       Transport / Session

                            a. RTP Stack协议栈
                                Real Time Protocol

                            b. STUN/ICE
                                通过STUN和ICE组件 建立不同类型网络间的呼叫连接。

                            c. Session Management
                                一个抽象的会话层，提供会话建立和管理功能。该层协议留给应用开发者自定义实现。

                        VoiceEngine
                            定义：
                                是一个框架（处理音频多媒体）

                            组成：
                                1.iSAC （宽带和超宽带音频编解码器）（Internet Speech Audio Codec）

                                    采样频率：16khz，24khz，32khz；（默认为16khz）
                                    自适应速率为10kbit/s ~ 52kbit/s；
                                    自适应包大小：30~60ms；
                                    算法延时：frame + 3ms
                                2.iLBC （窄带语音编解码器）（Internet Low Bitrate Codec）
                                3.NetEQ for Voice
                                    自适应抖动控制算法
                                    语音包丢失隐藏算法
                                4.AEC (Acoustic Echo Canceler)
                                    回声消除器是一个处理信号元件（能实时的去除mic采集到的回声）。
                                5.NR (Noise Reduction)
                                    噪声抑制也是一个信号处理元件（消除背景噪声，嘶嘶声，风扇噪音等等… …）


                        VideoEngine
                            定义：
                                是一个框架（处理视频多媒体）
                            组成：
                                1.VP8 （视频图像编解码器）

                                2.Video Jitter Buffer
                                    视频抖动缓冲器（降低视频抖动和视频包丢失 影响）
                                3.Image enhancements
                                    图像质量增强模块，提升视频质量（明暗度检测、颜色增强、降噪处理）


                    影响视频流的因素
                        1. 网络抖动
                        2. 丢包
                        3. 采样频率




                   问题： 会产生噪音（啸叫）
                        产生原因： 音响放出的声音  又传给了话筒 （KTV 经常产生啸叫）。
                        解决办法： 话筒和音响 不要离得太近。




                  其他知识
                        设备要求： zoom 在windows 上运行， 不推荐使用andrio  ,对于硬件要求高
                        网络要求： 10方/2M
                        编码： 视频流压缩
                        解码： 视频流解压缩


                        摄像头分辨率：720P,1080P, 2K,4K


                        丢包



           */


            //Adapter.js 解决webRtc 的兼容性，

            //  document.createElement\("audio

            //一个WebRTC连接(本地到远端)


            var pc = new webkitRTCPeerConnection({
                iceServers: [{
                    //作用： 为打通不同局域网的链接， （数据包报头中的ip地址转换） 将本地IP地址  转成  公共IP地址
                    //，

                    /*
                        同一局域网内，两台机器本地IP地址之间    可连接

                        不同局域网内，两台机器本地IP地址之间  不可连接
                        不同局域网内，两台机器公共IP地址之间    可连接


                    */

                    url: 'stun:23.21.150.121'
                }]
            });

            window.pc = pc;
            debugger

            pc.onaddstream = function (event) {

                window.remoteStream = event.stream;
                showStream(remoteStream)
            };


            pc.onremovestream = function(ev) {
                debugger
            };

            pc.ontrack = function(event) {
                debugger
                var audio = document.createElement('audio');
                audio.srcObject = event.streams[0];
                document.body.appendChild(audio)


                // document.getElementById("received_video").srcObject = event.streams[0];
                // document.getElementById("hangup-button").disabled = false;
            };


            //当申请时
            //当 RTCIceCandidate 被添加到目标 RTCPeerConnection上时将会触发icecandidate 事件
            pc.onicecandidate = function (event) {
                if (!event || !event.candidate) return

                //发送申请给远程连接点
                ws.send(JSON.stringify({
                    'action' : 'candidate',
                    'from': userId,
                    'to': otherUserId,
                    'candidate' :event.candidate
                }));
            }



            pc.onconnectionstatechange = function (event) {

                switch(pc.connectionState) {
                    case "connected":
                        // The connection has become fully connected
                        break;
                    case "disconnected":
                    case "failed":
                        // One or more transports has terminated unexpectedly or in an error
                        break;
                    case "closed":
                        // The connection has been closed
                        break;
                }
            }






            pc.ondatachannel = function (event) {

                event.channel.onopen = function() {
                    console.log('Data channel is open and ready to be used.');
                };

            }

            var channel = pc.createDataChannel("Mydata");
            console.log(channel)
            channel.onopen = function(event) {

                channel.send('sending a message');
            }
            channel.onmessage = function(event) {
                debugger
                console.log(event.data);
            }

            channel.onbufferedamountlow = ()=>{

            }
            channel.onerror = ()=>{
                debugger
            }


            //iceServer 连接状态改变时
            pc.oniceconnectionstatechange = function(event) {
                if (pc.iceConnectionState === "failed" ||
                    pc.iceConnectionState === "disconnected" ||
                    pc.iceConnectionState === "closed") {
                    // Handle the failure
                }

                /*

                    # new — WebRTC引擎正在等待通过调用RTCPeerConnection.addIceCandidate（）来接收远程候选对象。

                    # checking – WebRTC引擎已收到远程候选，并正在比较本地和远程候选以尝试找到合适的匹配。

                    # connected – 已经确定了一对适当匹配的候选并建立了连接。根据Trickle ICE协议，候选项仍可以继续共享。

                    # completed – WebRTC引擎已经完成了收集候选项，已经检查了所有候选对，并找到了所有组件的连接。

                    # failed – WebRTC引擎查找了所有候选对，但是未能找到合适的匹配。

                    # disconnected –RTCPeerConnection中至少有一个轨道已断开连接。这可能会间歇性地触发并在不可靠的网络上自行解决。在这种情况下，连接状态可能会改回“已连接”。

                    # closed –RTCPeerConnection实例已关闭，并且不再处理请求。

                    通常，如果状态变为failed，可能需要循环两端机器上的每个通过的ICE候选包，以辨别失败发生的原因；例如，如果一方只提供host和srflx数据包，而另一方提供host和relay数据包，但双方都在不同的网络上。
               */

            };

            // ??????
            pc.onicegatheringstatechange = function() {
                let label = "Unknown";

                switch(pc.iceGatheringState) {
                    case "new":
                    case "complete":
                        label = "Idle";
                        break;
                    case "gathering":
                        label = "Determining route";
                        break;
                }

                document.getElementById("iceStatus").innerHTML = label;
            }

            //身份认证
            pc.onidentityresult = function(ev) {
                alert("onidentityresult event detected!");
            };



            //需要协商时
            pc.onnegotiationneeded = function() {

            }


            //信号状态改变时
            pc.onsignalingstatechange = function(event) {
                if (pc.signalingState === "have-local-pranswer") {
                    // setLocalDescription() has been called with an answer
                }
            };



            //身份认证
            pc.peerIdentity


            //会话描述（sessionDescription） （描述了本地端或者远程端 连接的状态）

            //localDescription
            var sd = pc.pendingLocalDescription;
            var sd = pc.pendingRemoteDescription;
            var sd = pc.remoteDescription;



            //sctp  (StreamControlTransmissionProtocol)
            pc.sctp


            pc.signalingState






            /*

            //关闭连接
            pc.close()
            */


            window.pc =pc;
            return pc;
        }


        //主动发送本地流
        function poactiveSendLocalStream(){
            pc = createPeerConnection()



            //添加视频流
            // 如果本地端与远端协调已经发生了，那么需要一个新的媒体流，这样远端才可以使用它。 ??????
            pc.addStream(localStream)
            pc.createOffer(function (offer/*寻找远端匹配机器（peer）的请求（带有特定的配置信息）*/) {

                debugger
                pc.setLocalDescription(offer)

                ws.send(JSON.stringify({
                    'action' : 'create',
                    'from': userId,
                    'to': otherUserId,
                    'offer':offer
                }));
            }, function() {}, {
                optional: [],
                mandatory: {
                    OfferToReceiveAudio: false,
                    OfferToReceiveVideo: true
                }
            })
        }






        //展示视频流
        function showStream(stream,who){

            var wrap = document.createElement('div');

            var video = document.createElement('video');

            video.srcObject = stream;

            //通过此方法，获取video标签的视频流
            // var captrueStream = video.captureStream()

            video.oncanplay = (ev)=>{

            }
            video.oncanplaythrough = ()=>{

            }

            video.onanimationstart = ()=>{

            }
            video.ongotpointercapture =()=>{

            }

            video.onloadedmetadata = function(e) {
                // 解决报错问题： Uncaught (in promise) DOMException: play() failed because the user didn't interact
                // 参考  https://blog.csdn.net/yhblog/article/details/83183687
                video.muted = true;

                if(type == 'meeting'){
                    if(who && who == 'me'){
                        video.className='video '+ 'me ' + 'meeting'
                        video.id = userId
                    }else{
                        video.className='video '+ 'other ' + 'meeting'
                        video.id = otherUserId
                    }
                }else{

                    if(who && who == 'me'){
                        video.className='video '+ 'me ' + 'screenShare'
                        video.id = userId
                    }else{
                        video.className='video '+ 'other ' + 'screenShare'
                        video.id = otherUserId
                    }
                }

                document.body.appendChild(wrap)
                video.play();
            };
            wrap.appendChild(video)


            var toggleAudio = document.createElement('div');
            toggleAudio.innerHTML = '关闭声音';
            toggleAudio.onclick=()=>{
                if(toggleAudio.innerHTML == '打开声音'){
                    stream.getAudioTracks().forEach((audioTrack)=>{
                        audioTrack.enabled = true;
                    })
                    toggleAudio.innerHTML = '关闭声音';
                }else{
                    stream.getAudioTracks().forEach((audioTrack)=>{
                        audioTrack.enabled = false;
                    })
                    toggleAudio.innerHTML = '打开声音';
                }


            }
            wrap.appendChild(toggleAudio)


            var toggleVideo = document.createElement('div');
            toggleVideo.innerHTML = '关闭视频';
            toggleVideo.onclick=()=>{
                if(toggleVideo.innerHTML == '打开视频'){
                    stream.getVideoTracks().forEach((videoTrack)=>{
                        videoTrack.enabled = true;
                    })
                    toggleVideo.innerHTML = '关闭视频';
                }else{
                    stream.getVideoTracks().forEach((videoTrack)=>{
                        videoTrack.enabled = false;
                    })
                    toggleVideo.innerHTML = '打开视频';
                }


            }
            wrap.appendChild(toggleVideo)







            if(1){



                //声音控制相关  start
                //问题： 还是有啸叫   回声消除，降噪



                //可以创建节点，处理音频、解码

                var audioCtx = new AudioContext({
                    sampleRate:16000  //设置采样率
                });

                window.audioCtx =audioCtx;

                //创建一个 来源节点（用来关联音频流）.
                var source = audioCtx.createMediaStreamSource(stream);


                //构造参数依次为缓冲区大小，输入通道数，输出通道数
                var scriptNode = audioCtx.createScriptProcessor(
                    4096/*bufferSize*/,
                    1/*numberOfInputChannels*/,
                    1/*numberOfOutputChannels*/
                );

                //此事件可以对声音进行处理
                scriptNode.onaudioprocess = function (audioProcessingEvent) {

                    var inputBuffer = audioProcessingEvent.inputBuffer;

                    // The output buffer contains the samples that will be modified and played
                    var outputBuffer = audioProcessingEvent.outputBuffer;




                    // Loop through the output channels (in this case there is only one)
                    for (var channel = 0; channel < outputBuffer.numberOfChannels; channel++) {
                        var inputData = inputBuffer.getChannelData(channel);
                        var outputData = outputBuffer.getChannelData(channel);

                        // Loop through the 4096 samples
                        for (var sample = 0; sample < inputBuffer.length; sample++) {
                            // make output equal to the same as the input
                            outputData[sample] = inputData[sample];

                            // add noise to each output sample
                            //outputData[sample] += ((Math.random() * 2) - 1) * 0.2;
                        }
                    }


                }




                // 立体声
                // debugger
                // var channels = 1;
                // // 创建一个 采样率与音频环境(AudioContext)相同的 时长2秒的 音频片段。
                // var frameCount = audioCtx.sampleRate * 2.0;
                //
                // var myArrayBuffer = audioCtx.createBuffer(
                //     channels  /*Number numOfChannels*/,
                //     frameCount  /* frameCount */,
                //     audioCtx.sampleRate /*Number sampleRate*/
                // )
                //
                //
                //
                //
                // var buffer = new Float32Array(frameCount);
                //
                //
                //
                //
                // for (var channel = 0; channel < channels; channel++) {
                //     // 这允许我们读取实际音频片段(AudioBuffer)中包含的数据
                //     var nowBuffering = myArrayBuffer.getChannelData(channel);
                //     for (var i = 0; i < frameCount; i++) {
                //         // Math.random() is in [0; 1.0]
                //         // audio needs to be in [-1.0; 1.0]
                //         nowBuffering[i] = Math.random() * 2 - 1;
                //
                //         //nowBuffering[i] = buffer[i * (channel + 1)];
                //     }
                // }
                //
                // // 获取一个 音频片段源节点(AudioBufferSourceNode)。
                // // 当我们想播放音频片段时，我们会用到这个源节点。
                // var source = audioCtx.createBufferSource();
                // // 把刚才生成的片段加入到 音频片段源节点(AudioBufferSourceNode)。
                // source.buffer = myArrayBuffer;
                // // 把 音频片段源节点(AudioBufferSourceNode) 连接到
                // // 音频环境(AudioContext) 的终节点，这样我们就能听到声音了。
                // source.connect(audioCtx.destination);
                // // 开始播放声源
                // source.start();



















                //异步解码音频文件.
                //AudioContext.decodeAudioData

                //显示音频时间和频率的数据
                //audioCtx.createAnalyser()


                //从多个音频流信道结合成一个单一的音频流
                //audioCtx.createChannelMerger()

                //用于访问的音频流的单独的通道并分别对他们进行处理。
                // audioCtx.createChannelSplitter()

                //创建一个 双二阶滤波器
                var biquadFilter = audioCtx.createBiquadFilter();
                //滤波器类型：高通、低通、带通
                biquadFilter.type = "lowshelf";
                biquadFilter.frequency.value = 1;
                //音量控制
                biquadFilter.gain.value = 0;


                var myFrequencyArray = new Float32Array(5);
                myFrequencyArray[0] = 1000;
                myFrequencyArray[1] = 2000;
                myFrequencyArray[2] = 3000;
                myFrequencyArray[3] = 4000;
                myFrequencyArray[4] = 5000;
                var magResponseOutput = new Float32Array(5);
                var phaseResponseOutput = new Float32Array(5);

                biquadFilter.getFrequencyResponse(myFrequencyArray, magResponseOutput, phaseResponseOutput);





                //声音来源节点 连接 过滤器
                // source.connect(biquadFilter);
                // //过滤器      连接 声音输出节点
                // biquadFilter.connect(audioCtx.destination);



                source.connect(scriptNode);
                //过滤器      连接 声音输出节点
                scriptNode.connect(audioCtx.destination);

                //声音控制相关  end

                //window.a = true
            }










        }












        function parseUrl(url){
            var a = document.createElement('a');
            a.href = url;
            return {
                host: a.hostname,
                query: a.search,
                params: (function () {
                    var ret = {},
                        seg = a.search.replace(/^\?/, '').split('&'),
                        len = seg.length,
                        i = 0,
                        s;
                    for (; i < len; i++) {
                        if (!seg[i]) {
                            continue;
                        }
                        s = seg[i].split('=');
                        //ret[s[0]] = s[1];
                        ret[s[0]] = decodeURIComponent(s[1]);


                    }
                    return ret;
                })(),
                hash: a.hash.replace('#', '')
            };
        }










        navigator.mediaDevices.addEventListener('devicechange', event => {

            console.log(event)
        });


        /*

        MediaStream
            包含多个 MediaStreamTrack（声轨和视频轨）
                包含多个通道 （代表着媒体流的最小单元，比如一个音频信号对应着一个对应的扬声器）

        */
        var newStream = new MediaStream();













        // var msg = '["call2",["voip_invite",8,{"line":"9909719045","channelName":"274541","peer":"sipgw_mxj13671398016","extra":"{\\"destMediaUid\\":12447133}"}]]'
        //
        // websocket11.send(msg)








    };
    componentWillUnmount(){
        // 清除 start
        componentStore.clear(this);
        // 清除 end
    };
    render(){
        var that = this;

        return (
            <div className="homeModule">
                <TitleBar $id="titleBar">


                   
                    <div className="flex-child1 title">冉成的店铺</div>


                    <div onClick={()=>{
                        componentStore.update(that,{
                            devToolsStatus: !that.state.devToolsStatus
                        })




                        ipcRenderer.send('switchDevToolsStatus', that.state.devToolsStatus)
                    }}
                        style={{color:that.state.devToolsStatus?'green':'red'}}
                    >
                        调试工具{that.state.devToolsStatus}
                    </div>


                    <div onClick={()=>{
                        ipcRenderer.send('test-sign', 1)
                    }}>
                        测试 按钮
                    </div>

                </TitleBar>


                <div>
                    渲染进程 可以使用nodeJS 的任何api
                </div>

                <div id={'wrap'} style={{marginTop: 100}}>
                    <div>
                        node 版本：   {process.versions.node}
                    </div>
                    <div>
                        electron 版本：   {process.versions.electron}
                    </div>
                    <div>
                        NODE_MODULE_VERSION 版本：   {process.versions.modules}
                    </div>
                    <div>
                        chrome 版本：   {process.versions.chrome}
                    </div>
                </div>



                <br/><br/>

                <div>
                    获取package.json:
                    {(()=>{
                        //获取package.json
                        var packageJson = remote.require("./package.json");
                        return packageJson.name
                    })()}
                </div>


                <div>
                    获取process:
                    {(()=>{

                        return process.cwd()
                    })()}
                </div>


                <div>
                    可以使用nodeJS 中的任何模块
                    {(()=>{

                        var cluster = require('cluster');
                        console.log(cluster)

                    })()}
                </div>






                

            </div>
        )
    }

}

export default Home;
