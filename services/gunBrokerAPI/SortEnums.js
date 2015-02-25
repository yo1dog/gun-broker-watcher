'use strict';
var SortOrderEnums = require('./SortOrderEnums');


var SortEnums = {
  Price   : 0,
  TimeLeft: 1,
  
  getGunBrokerID: getGunBrokerID
};
module.exports = SortEnums;


function getGunBrokerID(sort, sortOrder) {
  var asc = sortOrder === SortOrderEnums.Asc;
  
  switch (sort) {
    case SortEnums.Price   : return asc? 5 : 4;
    case SortEnums.TimeLeft: return asc? null : 1;
  }
}