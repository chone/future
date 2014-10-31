(function() {

  var INCOMPLETE = 0;
  var VALUE = 4;
  var ERROR = 8;

  function Future() {
    this._callbacks = [];
  };

  Future.wait = function() {
    var future = new Future();
    var len = arguments.length;
    var finCount = 0;
    var results = [];
    for (var i = 0; i < len; i++) {
      arguments[i].then(function(value) {
	finCount++;
	results[index] = value;
	if (finCount == len) {
	  //results.push(new FutureSink(future));
	  future._setValue(results);
	}
      }).catchError(function(e) {
	future._setError(e);
      });
    }
    return future;
  };

  Future.prototype._state = INCOMPLETE;

  Future.prototype._result;

  Future.prototype._isComplete = function() {
    return this._state >= VALUE;
  };

  Future.prototype._hasValue = function() {
    return this._state == VALUE;
  };

  Future.prototype._hasError = function() {
    return this._state == ERROR;
  };

  Future.prototype.then = function(fn) {
    var future = new Future();
    var callback = function(type, result) {
      if (type == ERROR) {
	future._setError(result);
      } else {
	try {
	  var res = fn(result);
	  if (res instanceof Future) {
	    res.then(function(value) {
	      future._setValue(value);
	    }).catchError(function(e) {
	      future._setError(e);
	    });
	  } else {
	    if (typeof res == 'undefined') {
	      res = result;
	    }
	    future._setValue(res);
	  }
	} catch(e) {
	  future._setError(e);
	}
      }
    };
    this._addCallback(callback); 
    return future;
  };

  Future.prototype.catchError = function(fn, thisObject) {
    var future = new Future();
    var callback = function(type, result) {
      if (type == VALUE) {
	future._setValue(result);
      } else {
	try {
	  var res = fn(result);
	  if(typeof res != 'undefined') {
	    if (res instanceof Future) {
	      res.then(function(value) {
		future._setValue(value);
	      }).catchError(function(e) {
		future._setError(e);
	      });
	    } else {
	      future._setValue(res);
	    }
	  } 
	} catch(e) {
	  future._setError(e);
	}
	
      }
    };
    this._addCallback(callback); 
    return future;
  };

  Future.prototype._addCallback = function(callback) {
    var state = this._state;
    var result = this._result;
    if (state == VALUE) {
      callback(VALUE, result);
    } else if (state == ERROR) {
      calllback(ERROR, result);  
    } else {
      this._callbacks.push(callback);
    }
  };

  Future.prototype._setResult = function(type, result) {
    if (this._isComplete()) throw Error('The future is complete.')
    var callbacks = this._callbacks;
    var len = callbacks.length;
    for (var i = 0; i < len; i++) {
      callbacks[i](type, result);
    }
    this._state = type;
    this._result = result;
    this._callbacks = null;
  };

  Future.prototype._setValue = function(value) {
    this._setResult(VALUE, value);
  };

  Future.prototype._setError = function(error) {
    this._setResult(ERROR, error);
  };

  // export
  if (typeof define == 'function' && define.amd) {
    define(function() {
      return Future;
    });
  } else {
    window.Future = Future;	
  }

})();
