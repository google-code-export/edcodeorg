
function checkForSourceChanges() {
var activeSheet = ss.getActiveSheet();
var activeSheetName = activeSheet.getName();
var oldNumCols = ScriptProperties.getProperty('numCols');
var dataSheetName = ScriptProperties.getProperty('sheetName');  
  if (activeSheetName == dataSheetName) {
    var lastCol = activeSheet.getLastColumn();
    if (!(oldNumCols)) {
     ScriptProperties.setProperty('numCols', lastCol);
     }
    var newNumCols = lastCol;
    if (oldNumCols!=newNumCols) {
      Browser.msgBox("The formMule script has detected a change in the number of columns in your source data sheet. Please check and re-save your source sheet settings.");
      defineSettings();               
    }
    var activeRange = activeSheet.getActiveCell();
    var activeRow = activeRange.getRow();
    if (activeRow == 1) {
      var numSelected = ScriptProperties.getProperty("numSelected");
      for (var i = 0; i<numSelected; i++) {
        var sheetName = "Email"+(i+1)+" Template";
        setAvailableTags(sheetName);
      }
    }
  }
}






// This code was borrowed and modified from the Flubaroo Script author Dave Abouav
// It anonymously tracks script usage to Google Analytics, allowing our non-profit to report our impact to funders
// For original source see http://www.edcode.org

function createGATrackingUrl(encoded_page_name)
{
  var utmcc = createGACookie();
  
  if (utmcc == null)
    {
      return null;
    }
 
  var ga_url1 = "http://www.google-analytics.com/__utm.gif?utmwv=5.2.2&utmhn=www.formmule-analytics.com&utmcs=-&utmul=en-us&utmje=1&utmdt&utmr=0=";
  var ga_url2 = "&utmac=UA-30976195-1&utmcc=" + utmcc + "&utmu=DI~";
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
 
  var formmule_uid = UserProperties.getProperty("formmule_uid");
  if ((formmule_uid == null) || (formmule_uid == ""))
    {
      // shouldn't happen unless user explicitly removed flubaroo_uid from properties.
      return null;
    }
  
  a = formmule_uid.substring(0,9);
  d = formmule_uid.substring(9);
  
  utmcc = "__utma%3D451096098." + a + "." + b + "." + c + "." + d 
          + ".1%3B%2B__utmz%3D451096098." + d + ".1.1.utmcsr%3D(direct)%7Cutmccn%3D(direct)%7Cutmcmd%3D(none)%3B";
 
  return utmcc;
}

function logCalEvent()
{
  var ga_url = createGATrackingUrl("Auto-Created%20Calendar%20Event");
  if (ga_url)
    {
      var response = UrlFetchApp.fetch(ga_url);
    }
}


function logEmail()
{
  var ga_url = createGATrackingUrl("Mailed%20Templated%20Email");
  if (ga_url)
    {
      var response = UrlFetchApp.fetch(ga_url);
    }
}


function logRepeatInstall()
{
  var ga_url = createGATrackingUrl("Repeat%20Install");
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


function setFormMuleUid()
{ 
  var formmule_uid = UserProperties.getProperty("formmule_uid");
  if (formmule_uid == null || formmule_uid == "")
    {
      // user has never installed formMule before (in any spreadsheet)
      var dt = new Date();
      var ms = dt.getTime();
      var ms_str = ms.toString();
 
      UserProperties.setProperty("formmule_uid", ms_str);
      logFirstInstall();
    }
}


function clearAllFlags() {
  var sheetName = ScriptProperties.getProperty('sheetName');
  var ss = SpreadsheetApp.getActive();
  if ((sheetName)&&(sheetName!='')) {
    var sheet = ss.getSheetByName(sheetName);
    var lastCol = sheet.getLastColumn();
    var lastRow = sheet.getLastRow();
    var testVal = sheet.getRange(1, lastCol).getValue();
    if (testVal == "Status") {
      var range = sheet.getRange(3, lastCol, lastRow-2, 1).clear();
    }
    testVal = sheet.getRange(1, lastCol-1).getValue();
    if (testVal == "Event Id") {
      var range = sheet.getRange(3, lastCol-1, lastRow-2, 1).clear();
    }
    testVal = sheet.getRange(1, lastCol-2).getValue();
    if (testVal == "Case No") {
      var range = sheet.getRange(3, lastCol-2, lastRow-2, 1).clear();
    }
  }
}