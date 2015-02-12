exports.deferred = function(){
    /**
     * Promise 的实现
     */
    var _promise_status = "pending",
        _promise_tasks = [],
        _promise_value;

    function Promise(){ }

    Promise.prototype.then = function(onFulFilled, onRejected) {
        var deferred = exports.deferred();

        _promise_tasks.push( {deferred:deferred, onFulFilled:onFulFilled, onRejected:onRejected} );

        if(_promise_status != "pending") setTimeout(_execute);

        return deferred.promise;
    };

    /**
     * Deferred 的实现
     */
    function Deferred(){
        this.promise = new Promise();
    }

    Deferred.prototype.resolve = function(value){
        _resolvject(value, "fulfilled");
    };

    Deferred.prototype.reject = function(value){
        _resolvject(value, "rejected");
    };

    function _resolvject(value, status) {
        if(_promise_status != "pending") return;

        _promise_value = value;
        _promise_status = status;

        setTimeout(_execute);
    }

    /**
     * 执行栈的实现
     */
    function _execute() {
        var _task, _value,
            _callback = { "fulfilled": "onFulFilled", "rejected" : "onRejected" }, 
            _method = { "fulfilled": "resolve", "rejected" : "reject" };

        while(_promise_tasks.length) {
            _task = _promise_tasks.shift();

            if(typeof(_task[_callback[_promise_status]]) == "function") {
                try {
                    _value = _task[_callback[_promise_status]].call(undefined, _promise_value);

                    if(_value && typeof(_value.then) == 'function') {
                        if(_value == _task.deferred.promise) throw new TypeError("Same Promise Error!");

                        _value.then.call(undefined, function(value){ _task.deferred.resolve(value); }, function(value){ _task.deferred.reject(value); });
                    }
                    else
                        _task.deferred.resolve(_value);
                } catch(e) {
                    _task.deferred.reject(e);
                }
            } else {
                _task.deferred[_method[_promise_status]](_promise_value);
            }
        }
    }

    return new Deferred();
};