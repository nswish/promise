/**
 * Deferred 的实现
 */
function Deferred(){
    var _promise_status = "pending",
        _promise_tasks = [],
        _promise_value;

    this.promise = {
        "then": function(onFulFilled, onRejected){
            var deferred = new Deferred;

            _promise_tasks.push( {deferred:deferred, onFulFilled:onFulFilled, onRejected:onRejected} );

            if(_promise_status != "pending") setTimeout(_execute);

            return deferred.promise;
        },
        "state": function(){
            return _promise_status;
        }
    };

    this.resolve = function(value){
        _resolvject.call(this, value, "fulfilled");
    };

    this.reject  = function(value){
        _resolvject.call(this, value, "rejected");
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
        var _task, _value, _then,
            _callback = { "fulfilled": "onFulFilled", "rejected" : "onRejected" }, 
            _method = { "fulfilled": "resolve", "rejected" : "reject" };

        while(_promise_tasks.length) {
            _task = _promise_tasks.shift();

            if(typeof(_task[_callback[_promise_status]]) == "function") {
                try {
                    _value = _task[_callback[_promise_status]].call(undefined, _promise_value);
                    _resolveProc(_task.deferred, _value)
                } catch(e) {
                    _task.deferred.reject(e);
                }
            } else {
                _task.deferred[_method[_promise_status]](_promise_value);
            }
        }
    }

    function _resolveProc(deferred, _value){
        var _then, _resolved=false, _rejected=false;

        if(_value == deferred.promise) throw new TypeError("Same Promise Error!");

        if(_value && typeof(_value.state) == "function") {
            _value.then.call(undefined, function(value){ _resolveProc(deferred, value); }, function(value){ deferred.reject(value); });
        }

        else if(_value && (typeof(_value) == "object" || typeof(_value) == "function")) {
            try {
                _then = _value.then;
            } catch(e) {
                deferred.reject(e);
                return;
            }

            if(typeof(_then) == "function") {
                try {
                    _then.call(_value, function(value){
                        if(!_resolved && !_rejected) 
                            _resolveProc(deferred, value); 
                        _resolved = true;
                    }, function(reason){ 
                        if(!_rejected && !_resolved)
                            deferred.reject(reason); 
                        _rejected = true;
                    });
                } catch(e) {
                    if(!(_resolved || _rejected)) {
                        deferred.reject(e);
                        return;
                    }
                }
            } else 
                deferred.resolve(_value);
        } else {
            deferred.resolve(_value);
        }
    }
}

exports.deferred = function(){
    return new Deferred();
};