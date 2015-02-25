'use strict';

var ParsingUtil = {
  findSection   : findSection,
  extractSection: extractSection,
  decodeHTML    : decodeHTML
};
module.exports = ParsingUtil;


function findSection(str, startStr, endStr, subSection) {
  subSection = subSection || {start: 0, end: str.length};
  
  var startIndex = str.indexOf(startStr, subSection.start);
  if (startIndex === -1) {
    return null;
  }
  
  startIndex += startStr.length;
  
  var endIndex = str.indexOf(endStr, startIndex);
  if (endIndex === -1) {
    return null;
  }
  
  var after = endIndex + endStr.length;
  if (after > subSection.end) {
    return null;
  }
  
  return {
    start: startIndex,
    end  : endIndex,
    after: after
  };
}


function extractSection(str, section) {
  return str.substring(section.start, section.end);
}


function decodeHTML(html) {
  return html;
  /*var e = document.createElement('div');
  e.innerHTML = input;
  
  return e.childNodes.length === 0 ? '' : e.childNodes[0].nodeValue.trim();*/
}