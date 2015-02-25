module.exports = Listing;

function Listing(itemID, title, price, timeLeft, urlPath, imageURL) {
  this.itemID   = itemID;
  this.title    = title;
  this.price    = price;
  this.timeLeft = timeLeft;
  this.urlPath  = urlPath;
  this.imageURL = imageURL;
}