function removeTimeoutTrigger() {
  var triggers = ScriptApp.getScriptTriggers();
  if (triggers.length>0) {
  for (var i=0; i<triggers.length; i++) {
    var handlerFunction = triggers[i].getHandlerFunction();
    if (handlerFunction=='runMerge') {
      ScriptApp.deleteTrigger(triggers[i]);
    }
  }
}
}

function preemptTimeout() {
  var date = new Date();
  var newDate = new Date(date);
  newDate.setSeconds(date.getSeconds() + 60);
  ScriptApp.newTrigger('runMerge').timeBased().at(newDate).create();
  Browser.msgBox('Merge paused, restarting in one minute to avoid service timeout.');
}



// This code was borrowed and modified from the Flubaroo Script author Dave Abouav
// It anonymously tracks script usage to Google Analytics, allowing our non-profit organization to report the impact of this work to funders
// For original source see http://www.edcode.org

function createGATrackingUrl(encoded_page_name)
{
  var utmcc = createGACookie();
  
  if (utmcc == null)
    {
      return null;
    }
 
  var ga_url1 = "http://www.google-analytics.com/__utm.gif?utmwv=5.2.2&utmhn=www.autocrat-analytics.com&utmcs=-&utmul=en-us&utmje=1&utmdt&utmr=0=";
  var ga_url2 = "&utmac=UA-30983014-1&utmcc=" + utmcc + "&utmu=DI~";
  var ga_url_full = ga_url1 + encoded_page_name + "&utmp=" + encoded_page_name + ga_url2;
  
  return ga_url_full;
}

function createGACookie()
{
  var a = "";
  var b = "100000000";
  var c = "200000000";
  var d = "";

  var dt = new Date();
  var ms = dt.getTime();
  var ms_str = ms.toString();
 
  var autocrat_uid = UserProperties.getProperty("autocrat_uid");
  if ((autocrat_uid == null) || (autocrat_uid == ""))
    {
      // shouldn't happen unless user explicitly removed flubaroo_uid from properties.
      return null;
    }
  
  a = autocrat_uid.substring(0,9);
  d = autocrat_uid.substring(9);
  
  utmcc = "__utma%3D451096098." + a + "." + b + "." + c + "." + d 
          + ".1%3B%2B__utmz%3D451096098." + d + ".1.1.utmcsr%3D(direct)%7Cutmccn%3D(direct)%7Cutmcmd%3D(none)%3B";
 
  return utmcc;
}

function logDocCreation()
{
  var ga_url = createGATrackingUrl("Merged%20Doc%20Created");
  if (ga_url)
    {
      var response = UrlFetchApp.fetch(ga_url);
    }
}


function logFirstInstall()
{
  var ga_url = createGATrackingUrl("First%20Install");
  if (ga_url)
    {
      var response = UrlFetchApp.fetch(ga_url);
    }
}


function setAutocratUid()
{ 
  var autocrat_uid = UserProperties.getProperty("autocrat_uid");
  if (autocrat_uid == null || autocrat_uid == "")
    {
      // user has never installed formMule before (in any spreadsheet)
      var dt = new Date();
      var ms = dt.getTime();
      var ms_str = ms.toString();
 
      UserProperties.setProperty("autocrat_uid", ms_str);
      logFirstInstall();
    }
}


// utility function to clear all merge status messages and doc links associated with rows in the source sheet
// some may find it useful to set this on a regular time trigger (once a day, for example) within a given workflow
function clearAllFlags() {
  var sheetName = ScriptProperties.getProperty('sheetName');
  var ss = SpreadsheetApp.getActive();
  if ((sheetName)&&(sheetName!='')) {
    var sheet = ss.getSheetByName(sheetName);
    var lastCol = sheet.getLastColumn();
    var lastRow = sheet.getLastRow();
    var testVal = sheet.getRange(1, lastCol).getValue();
    if (testVal == "Merge Status") {
      var range = sheet.getRange(2, lastCol, lastRow-1, 1).clear();
    }
    testVal = sheet.getRange(1, lastCol-1).getValue();
    if (testVal == "Link to merged Doc") {
      var range = sheet.getRange(2, lastCol-1, lastRow-1, 1).clear();
    }
  }
}
