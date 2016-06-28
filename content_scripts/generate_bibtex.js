//returned array is guaranteed to not contain null values
function queryStuff(selectors){

  var result = [];
    
  selectors.forEach(function(currentValue, index, array){
    if(currentValue.constructor === Array){
      var tag = document.querySelector(currentValue[0]);
      if(tag != null){
        var attr = tag.getAttribute(currentValue[1]);
        if(attr != null)
          result.push(attr);
      }
    }else {
      var tag = document.querySelector(currentValue);
      if(tag != null){
        if(tag.innerHTML !== "")
          result.push(tag.innerHTML);
      }
    }
  });

  return result;

}

function getAuthor(){

  var selectors = [
    ['meta[name=author]', 'content'],
    '[rel=author] > [itemprop=name]',
    '[itemprop=author] > *',
    '[itemprop=author]'
  ];

  var result = queryStuff(selectors);

  if(result.length != 0)
    return result;
  else
    return [""];

}

function getTitle(){

  var selectors = [
    ['meta[name="DC.Title"', 'content'],
    'h1[class*=headline] > *', 
    'h1[class*=headline]', 
    'h2[class*=headline] > *', 
    'h2[class*=headline]', 
    'h3[class*=headline] > *', 
    'h3[class*=headline]', 
    'h1[class*=title] > *', 
    'h1[class*=title]', 
    'h2[class*=title] > *', 
    'h2[class*=title]', 
    'h3[class*=title] > *', 
    'h3[class*=title]', 
    '[itemtype="http://schema.org/CreativeWork"] [itemprop=headline]',
    '[itemtype="http://schema.org/NewsArticle"] [itemprop=headline]',
    'main [itemtype="http://schema.org/Article"] [itemprop=headline]',
    '[itemtype="http://schema.org/BlogPosting"] [itemprop=name] > *', 
    '[itemtype="http://schema.org/BlogPosting"] [itemprop=name]', 
    '[itemtype="http://schema.org/Question"] [itemprop=name] > *', 
    '[itemtype="http://schema.org/Question"] [itemprop=name]', 
    'title'
  ];

  var result = queryStuff(selectors);

  if(result.length != 0)
    return result;
  else
    return [""];
  
}

function getYear(){

  var selectors = [
    '[itemprop=dateModified]',
    '[itemprop=datePublished]',
    ['[itemprop=dateModified]', 'content'],
    ['[itemprop=datePublished]', 'content'],
    '[id*=updated]',
    ['time[pubdate]','pubdate'],
    'time'
  ];

  var query = queryStuff(selectors);

  if(query.length != 0){
    var result = [];
    query.forEach(function(currentValue, index, array){
      currentValue.match(/(\D|^)(\d\d\d\d)(\D|$)/g);
      if(RegExp.$2 != null && RegExp.$2 !== "")
        result.push(RegExp.$2); 
    });
    return result;
  }
  else
    return [""];
}

function getURL(){

  return [window.location]

}

function getURLDate(){

  var now = new Date();
  var mon = now.getMonth()+1;

  return [now.getFullYear() + "-" + mon + "-" + now.getDate()];

}

function generateBibtex(request, sender, sendResponse){
  
  var bibtex = "@online{cite_key, <br>" +
    "$indent$author = {$author$},<br>" + 
    "$indent$title = {$title$},<br>" + 
    "$indent$year = $year$,<br>" + 
    "$indent$url = {$url$},<br>" +
    "$indent$urldate = {$urldate$}<br>" +
    "}";

  bibtex = bibtex.replace("$author$", getAuthor()[0]);
  bibtex = bibtex.replace("$title$", getTitle()[0]);
  bibtex = bibtex.replace("$year$", getYear()[0]);
  bibtex = bibtex.replace("$url$", getURL()[0]);
  bibtex = bibtex.replace("$urldate$", getURLDate()[0]);

  bibtex = bibtex.replace(/\$indent\$/g, "&nbsp;&nbsp");

  sendResponse(bibtex);
  chrome.runtime.onMessage.removeListener(generateBibtex);

  return true;
}

chrome.runtime.onMessage.addListener(generateBibtex);
