var pa = require("../../../pa.js");

exports.fulfilled = function(value){
    var deferred = pa.deferred();
    deferred.resolve(value);
    return deferred.promise;
};

exports.rejected = function(reason){
    var deferred = pa.deferred();
    deferred.reject(reason);
    return deferred.promise;
};;

exports.pending = function () {
    var deferred = pa.deferred();
    deferred.fulfill = deferred.resolve;
    return deferred;
};
