'use strict';

var LogUtil = {
  getInfoString: getInfoString
};
module.exports = LogUtil;


function getInfoString(obj, forceJSON) {
  var objStr;
  
  // get the type and class of the obj
  var type = typeof obj;
  var klass;
  
  // special cases for undefined and null
  if (type === 'undefined') {
    objStr = '<undefined>';
  }
  else if (obj === null) {
    objStr = '<null>';
  }
  else {
    if (obj.constructor && obj.constructor.name) {
      klass = obj.constructor.name;
    }
    
    // use the toString function if available
    if (obj.toString && !forceJSON) {
      objStr = obj.toString();
    }
    
    // convert to JSON if the obj did not have a toString or if it resulted in a useless string
    if (typeof objStr === 'undefined' || objStr === '[object Object]') {
      try {
        objStr = JSON.stringify(obj, null, '  ');
      }
      catch (err) {
        // ignore err, but record one happened with 'etj' (error to JSON)
        objStr = '(etj) ' + objStr || ('' + obj); // use existing objStr value or turn object into string by concating
      }
    }
  }
  
  // check for empty strings
  if (objStr === '') {
    objStr = '<empty string>';
  }
  
  return '(type: ' + type + (klass? ', superclass: ' + klass : '') + ')' + (objStr.indexOf('\n') > -1? '\n' : ' ') + objStr;
};