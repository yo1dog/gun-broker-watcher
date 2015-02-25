'use strict';

var ConditionFlags = {
  FactoryNew : 1 << 0,
  NewOldStock: 1 << 1,
  Used       : 1 << 2,
  
  getGunBrokerID: getGunBrokerID
};
module.exports = ConditionFlags;


function getGunBrokerID(condition) {
  switch (condition) {
    case ConditionFlags.FactoryNew                             : return 1;
    case ConditionFlags.FactoryNew | ConditionFlags.NewOldStock: return 2;
    case ConditionFlags.NewOldStock | ConditionFlags.Used      : return 3;
    case ConditionFlags.Used                                   : return 4;
    case ConditionFlags.NewOldStock                            : return 5;
    case ConditionFlags.FactoryNew | ConditionFlags.Used       : return 6;
  }
  
  return null;
}