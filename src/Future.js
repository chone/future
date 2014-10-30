(function() {

	/**
	 * @constructor
	 * @param {Function} Optional, opt_computation.
	 * @param {Number} Optional, opt_duration.
	 */
	function Future(opt_computation, opt_duration) {
		if (opt_computation) {
			var self = this;
			setTimeout(function() {
				try {
					self._setValue(computation());
				} catch(e) {
					self._setError(e);
				}
			}, duration || 0);
		}
	}

	/**
	 * @factory
	 * @param {Error} error.
	 */
	Future.error = function(error) {
		var future = new Future();
		future._setError(error);
		return future;
	};

	/**
	 * @factory
	 * @param {Function} computation.
	 */
	Future.sync = function(computation) {
		var future = new Future();
		try {
			future._setValue(computation());
		} catch(e) {
			future._setError(e);
		}
		return future;
	};

	/**
	 * @factory
	 * @param {*} value.
	 */
	Future.value = function(value) {
		var future = new Future();
		future._setValue(value);
		return future;
	};

	/**
	 * Register callbacks to the future.
	 * @param {Function} onValue.
	 * @param {Function} Optional, opt_onError.
	 * @return {Future}
	 */
	Future.prototype.then = function(onValue, opt_onError) {
		if (this._hasValue) {
			
		} else {
		}
	};

	/**
	 * Handles error emitted by the future.
	 * @param {Function} onError
	 * @param {Function} opt_test
	 * @return {Future}
	 */
	Future.prototype.catchError = function(onError, opt_test) {
	};

	/**
	 * Timeout the future after time has passed.
	 * @param {Number} time.
	 * @param {Function} opt_onTime
	 * @return {Future}
	 */
	Future.prototype.timeout = function(time, opt_onTime) {
	};

	/**
	 * Register a function to be called when the future completes.
	 * @param {Function} action.
	 * @return {Future}
	 */
	Future.prototype.whenComplete = function(action) {
	};

	/**
	 * Add value callback.
	 * @param {Function} onValue.
	 */
	Future.prototype._addValueCallback = function(onValue) {
		if (!this._valueCallbacks) {
			this._valueCallbacks = [];
		}
		this._valueCallbacks.push(onValue);
	};

	/**
	 * Fire value callback.
	 * @param {*} value.
	 */
	Future.prototype._fireValueCallback = function(value) {
		if (this._valueCallbacks) {
			var len = this._valueCallbacks.length;
			for(var i = 0; i < len; i++) {
				setTimeout(function() {
					this._valueCallbacks[i](value);
				}, 0);
			}
		}
	};

	/**
	 * Add error callback.
	 * @param {Function} onError.
	 */
	Future.prototype._addErrorCallback = function(onError) {
		if (!this._errorCallbacks) {
			this._errorCallbacks = [];
		}
		this._errorCallbacks.push(onError);
	};

	/**
	 * Complete the future with value.
	 * @param {*} value.
	 */
	Future.prototype._setValue = function(value) {
	};

	/**
	 * Complete the future as error.
	 * @param {Error} error.
	 */
	Future.prototype._setError = function(error) {
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
