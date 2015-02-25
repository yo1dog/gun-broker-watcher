'use strict';
var CError = require('../../../utils/CError');

var http = require('http');


var HTTPRequester = {
  get: getRequest
};
module.exports = HTTPRequester;


function getRequest(path, rootCB) {
  var options = {
    method  : 'GET',
    hostname: 'www.gunbroker.com',
    port    : 80,
    path    : path
  };
  
  try {
    var httpReq = http.request(options, function httpRequestCB(httpRes) {
      httpRes.setEncoding('utf8');
      var responseBody = '';
      
      httpRes.on('error', function httpResOnError(err) {
        return rootCB(new CError('Error while recieving HTTP response body.\n' + JSON.stringify(options, null, '  '), err));
      });
      
      httpRes.on('data', function httpResOnData(chunk) {
        responseBody += chunk;
      });
      
      httpRes.on('end', function httpResOnEnd() {
        return rootCB(null, httpRes.statusCode, responseBody);
      });
    });
    
    httpReq.on('error', function httpReqOnError(err) {
      return rootCB(new CError('Error while sending request.\n' + JSON.stringify(options, null, '  '), err));
    });
    
    httpReq.end();
  }
  catch (err) {
    return process.nextTick(function() {
      return rootCB(new CError('Error while sending request.\n' + JSON.stringify(options, null, '  '), err));
    });
  }
}