'use strict';

var Listing          = require('../models/Listing');
var ListingTypeFlags = require('../ListingTypeFlags');
var ConditionFlags   = require('../ConditionFlags');
var SortEnums        = require('../SortEnums');
var HTTPRequester    = require('../utils/HTTPRequester');
var ParsingUtil      = require('../utils/ParsingUtil');
var LogUtil          = require('../../../utils/LogUtil');
var CError           = require('../../../utils/CError');


module.exports = search;

function search(options, rootCB) {
  var path = buildPath(options);
  
  HTTPRequester.get(path, function(err, status, body) {
    if (err) return rootCB(new CError('Error making HTTP request.', err));
    
    if (status !== 200) {
      var msg =
        'Non-200 status code returned from HTTP request.\n' +
        'Status Code: ' + status + '\n' +
        'Body: ' + LogUtil.getInfoString(body);
      
      return rootCB(new CError(msg, err));
    }
    
    var warnings = [];
    var listings = parseListingsFromBody(body, warnings);
    
    return rootCB(null, listings, warnings);
  });
}


function buildPath(options) {
  var path = '/All/BI.aspx?';
  
  // add keywords
  path += 'Keywords=' + encodeURIComponent(options.keywords);
  
  // add listing type
  switch (options.listingType) {
    case ListingTypeFlags.Auction:
      path += '&MinStartingBid=0.01';
      break;
    
    case ListingTypeFlags.BuyNow:
      path += '&BuyNowOnly=1';
      break;
  }
  
  // add condition
  var conditionID = ConditionFlags.getGunBrokerID(options.condition);
  if (conditionID) {
    path += '&Condition=' + conditionID;
  }
  
  // add sort
  var sortID = SortEnums.getGunBrokerID(options.sort, options.sortOrder);
  if (sortID) {
    path += '&Sort=' + sortID;
  }
  
  return path;
}


function parseListingsFromBody(body, warnings) {
  warnings = warnings || [];
  var listings = [];
  
  var listingsTableSection = ParsingUtil.findSection(body, '<!-- Start table Content-->', '<!-- End table content-->');
  if (!listingsTableSection) {
    return listings;
  }
  
  var listingRowSection;
  while (listingRowSection = ParsingUtil.findSection(body, '<tr>', '</tr>', listingsTableSection)) {
    var result = parseListingRow(body, listingRowSection);
    
    if (result instanceof Listing) {
      listings.push(result);
    }
    else {
      warnings.push(result);
    }
    
    listingsTableSection.start = listingRowSection.after;
  }
  
  return listings;
}


function parseListingRow(body, listingRowSection) {
  // ------------
  // URL Path & Item ID
  // ------------
  var linkSection = ParsingUtil.findSection(body, '<a class="ItmTLnk"', '</a>', listingRowSection);
  if (!linkSection) return 'No link.';
  
  // linkPath
  var hrefSection = ParsingUtil.findSection(body, 'href="', '"', linkSection);
  if (!hrefSection) return 'No href in link.';
  
  var urlPath = ParsingUtil.decodeHTML(ParsingUtil.extractSection(body, hrefSection));
  
  // item ID
  var index = body.lastIndexOf('>', linkSection.end);
  if (index === -1 || index < linkSection.start) {
    return 'No item ID in link.';
  }
  
  var itemID = ParsingUtil.decodeHTML(body.substring(index + 1, linkSection.end));
  
  
  // ------------
  // Image URL
  // ------------
  var imageSection = ParsingUtil.findSection(body, 'src="', '"', listingRowSection);
  if (!imageSection) return 'No image.';
  
  var imageURL = ParsingUtil.decodeHTML(ParsingUtil.extractSection(body, imageSection));
  
  
  // ------------
  // Title
  // ------------
  var titleLinkSection = ParsingUtil.findSection(body, 'class="BItmTLnk">', '</a>', listingRowSection);
  if (!titleLinkSection) return 'No title link.';
  
  var title = ParsingUtil.decodeHTML(ParsingUtil.extractSection(body, titleLinkSection));
  
  
  // ------------
  // Price
  // ------------
  var priceCellSection = ParsingUtil.findSection(body, '<td class="lrt">', '</td>', listingRowSection);
  if (!priceCellSection) return 'No price cell.';
  
  var price = ParsingUtil.decodeHTML(ParsingUtil.extractSection(body, priceCellSection));
  
  
  // ------------
  // Time Left
  // ------------
  var timeLeftCellSection = ParsingUtil.findSection(body, '<td class="lrt nw">', '</td>', listingRowSection);
  if (!timeLeftCellSection) return 'No time left cell.';
  
  var timeLeft = ParsingUtil.decodeHTML(ParsingUtil.extractSection(body, timeLeftCellSection));
  
  
  return new Listing(itemID, title, price, timeLeft, urlPath, imageURL);
}