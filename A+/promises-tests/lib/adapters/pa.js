var pa = require("../../../pa.js");

exports.resolved = function(value){
    var deferred = pa.deferred();
    deferred.resolve(value);
    return deferred.promise;
};

exports.rejected = function(reason){
    var deferred = pa.deferred();
    deferred.reject(reason);
    return deferred.promise;
};;

exports.deferred = function () {
    var deferred = pa.deferred();
    return deferred;
};
