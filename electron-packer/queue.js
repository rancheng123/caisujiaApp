class Queue {
    constructor() {
        this.tasks = {};
        this.taskIndex = 0
    }

    push(taskName,taskFn){
        this.tasks[taskName] = taskFn;

        // promise.then(()=>{
        //     debugger
        // })
    }
    runJob(callback){
        this.taskIndex ++;
        var that = this;
        var keys = Object.keys(this.tasks);
        if(keys.length){
            var promise = this.tasks[keys[0]](keys[0])
            promise.then(()=>{
                delete this.tasks[keys[0]]
                that.runJob(callback)
            })
        }else{
            callback()
        }
    }

    init(opts){
        var that = this;
        return new Promise(function (outResolve) {
            opts.data.forEach((item)=>{
                var key = opts.key(item);
                that.push(key,(key)=>{
                    return (function (key) {
                        return new Promise(function (resolve, reject) {
                            opts.taskFn(key,resolve, reject)
                        })
                    })(key)


                })
            })
            that.runJob(()=>{
                console.log('all done')
                outResolve()
            })
        })




    }
}

if(!global.queueCase){
    global.queueCase = new Queue()
}



module.exports = global.queueCase;
