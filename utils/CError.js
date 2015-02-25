'use strict';
var LogUtil = require('./LogUtil');

var util = require('util');


module.exports = CError;

// error with a cause
function CError(error, cause, keepErrorString) {
  Error.captureStackTrace(this, CError);
  this.name = 'CError';
  
  // set the error
  if (typeof error === 'string' && !keepErrorString) {
    // if the error is a string, wrap it in an error
    this.error = new Error(error);
    Error.captureStackTrace(this.error, CError); // start the stack trace outside this class
  }
  else {
    this.error = error;
  }
  
  
  // set the cause
  this.cause = cause;
  
  
  // set the root cause
  var rootCause;
  if (this.cause && this.cause instanceof CError) {
    rootCause = this.cause.rootCause;
  }
  
  this.rootCause = rootCause || this.cause;
  
  
  // set the message
  this.message = null;
  
  // use the error's message
  if (this.error) {
    this.message = this.error.message;
  }
  if (!this.message) {
    this.message = LogUtil.getInfoString(this.error);
  }
  
  // add the root cause
  if (this.rootCause) {
    this.message += ' - Root Cause - ' + (this.rootCause.message || LogUtil.getInfoString(this.rootCause));
  }
  
  
  // set the stack
  this.stack = '';
  
  // show the error
  // if the error is a CError, we have two chains going
  if (this.error instanceof CError) {
    // show the first CError
    this.stack += this.error.toString();
    
    // put a divider between the two CErrors so it is clear they are two different chains
    if (this.cause) {
      this.stack += '\n\n=====================\n=====================';
    }
  }
  else {
    // convert the error to a string
    var errorStr;
    
    // use the error's stack
    if (this.error) {
      errorStr = this.error.stack;
    }
    if (!errorStr) {
      errorStr = LogUtil.getInfoString(this.error);
    }
    
    this.stack += errorStr;
  }
  
  // show the cause
  this.stack += '\n\n----- Caused By -----\n\n';
  
  // convert cause to string
  var causeStr;
  
  // use the cause's stack
  if (this.cause) {
    causeStr = this.cause.stack;
  }
  if (!causeStr) {
    causeStr = LogUtil.getInfoString(this.cause);
  }
  
  this.stack += causeStr;
}

util.inherits(CError, Error);



CError.prototype.toString = function() {
  return this.stack;
};

CError.getFristInstanceOfClassFromChain = function(cErr, klass) {
  var err = cErr;
  while (err) {
    if (err instanceof klass) {
      return err;
    }
    
    err = err.cause;
  }
  
  return null;
};