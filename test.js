var GunBrokerAPI     = require('./services/gunBrokerAPI/GunBrokerAPI');
var ListingTypeFlags = require('./services/gunBrokerAPI/ListingTypeFlags');
var ConditionFlags   = require('./services/gunBrokerAPI/ConditionFlags');
var SortEnums        = require('./services/gunBrokerAPI/SortEnums');
var SortOrderEnums   = require('./services/gunBrokerAPI/SortOrderEnums');

// http://www.gunbroker.com/All/BI.aspx?Keywords=PC9107LP&BuyNowOnly=1&Condition=2&Sort=4&PageSize=200&Tab=2
var options = {
  keywords   : 'PC9107LP',
  listingType: ListingTypeFlags.BuyNow,
  condition  : ConditionFlags.FactoryNew | ConditionFlags.NewOldStock,
  sort       : SortEnums.Price,
  sortOrder  : SortOrderEnums.Asc
};

GunBrokerAPI.search(options, function(err, listings, warnings) {
  if (err) {
    console.error(err);
    return process.exit(1);
  }
  
  console.log(warnings);
  console.log(listings);
  console.log('Done.');
  
  return process.exit(0);
});