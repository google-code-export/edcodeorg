function getProperties() {
 var properties =  new Object();
 var numCols = ScriptProperties.getProperty('numCols');
 var monthToken = ScriptProperties.getProperty('monthToken');
 var minBefore = ScriptProperties.getProperty('minBefore');
 var reminderType = ScriptProperties.getProperty('reminderType');
 var allDay = ScriptProperties.getProperty('allDay');
 var yearToken = ScriptProperties.getProperty('yearToken');
 var guests = ScriptProperties.getProperty('guests');
 var caseNoSetting = ScriptProperties.getProperty('caseNoSetting');
 var startTimeToken = ScriptProperties.getProperty('startTimeToken');
 var calendarStatus = ScriptProperties.getProperty('calendarStatus');
 var emailStatus = ScriptProperties.getProperty('emailStatus');
 var dayToken = ScriptProperties.getProperty('dayToken');
 var emailInvites = ScriptProperties.getProperty('emailInvites');
 var endTimeToken = ScriptProperties.getProperty('endTimeToken');
 var eventTitleToken = ScriptProperties.getProperty('eventTitleToken');
 var descToken = ScriptProperties.getProperty('descToken');
 var numSelected = ScriptProperties.getProperty('numSelected');
 var colSettings = ScriptProperties.getProperty('colSettings');
 var sheetName = ScriptProperties.getProperty('sheetName');
 var locationToken = ScriptProperties.getProperty('locationToken');
 var emailConditions = ScriptProperties.getProperty('emailConditions');
 var calendarConditions = ScriptProperties.getProperty('calendarConditions');
  
 
 if (numCols) { properties.numCols = numCols; }
 if (monthToken) { properties.monthToken = monthToken; }
 if (minBefore) { properties.minBefore = minBefore; }
 if (reminderType) { properties.reminderType = reminderType; }
 if (allDay) {properties.allDay = allDay;}
 if (yearToken) {properties.yearToken = yearToken;}
 if (guests) {properties.guests = guests; }
 if (caseNoSetting) {properties.caseNoSetting = caseNoSetting; }
 if (startTimeToken) {properties.startTimeToken = startTimeToken; }
 if (calendarStatus) {properties.calendarStatus = calendarStatus; }
 if (emailStatus) {properties.emailStatus = emailStatus; }
 if (dayToken) { properties.dayToken = dayToken; }
 if (emailInvites) {properties.emailInvites = emailInvites; }
 if (endTimeToken) {properties.endTimeToken = endTimeToken; }
 if (eventTitleToken) {properties.eventTitleToken = eventTitleToken; }
 if (descToken) {properties.descToken = descToken; }
 if (numSelected) {properties.numSelected = numSelected; }
 if (colSettings) {properties.colSettings = colSettings; }
 if (sheetName) {properties.sheetName = sheetName; }
 if (locationToken) {properties.locationToken = locationToken; }
 if (emailConditions) {properties.emailConditions = emailConditions; }
 if (calendarConditions) {properties.calendarConditions = calendarConditions; } 
 return properties;
}


function test() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var test = ss.getFormUrl();
  debugger;
}

function extractorWindow () {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var properties = getProperties();
  var app = UiApp.createApplication().setHeight(500).setTitle("Export preconfig() settings");
  var panel = app.createVerticalPanel().setWidth("100%").setHeight("100%");
  var labelText = "Copying a Google Spreadsheet copies scripts along with it, but without any of the script settings saved.  This normally makes it hard to share full, script-enabled Spreadsheet systems. ";
  labelText += " You can solve this problem by pasting the code below into a script file called \"paste preconfig here\" (go to Script Editor and look in left sidebar) prior to publishing your Spreadsheet for others to copy. \n";
  labelText += " After a user copies your spreadsheet, they will select \"Run initial installation.\"  This will preconfigure all needed script settings.  If you got this workflow from someone as a copy of a spreadsheet, this has probably already been done for you.";
  var label = app.createLabel(labelText);
  var window = app.createTextArea();
  var codeString = "//This section sets all script properties associated with this formMule profile \n";
  for (var propertyKey in properties) {
    var propertyVal = properties[propertyKey];
    codeString += "ScriptProperties.setProperty('" + propertyKey + "', '" + propertyVal + "');\n";
  }
  
 //generate msgbox warning code if automated email or calendar is enabled in template 
  if ((properties.calendarStatus == 'true')||(properties.emailStatus == 'true')) {
    codeString += "\n \n";
    codeString += "//Custom popup and function calls to prompt user for additional settings \n";
    if (ScriptProperties.getProperty('emailStatus')=="true") {
       codeString += "Browser.msgBox(\"You will want to check the email template sheets to ensure the correct sender and recipients are listed before using.\");\n";
    }
    if (ScriptProperties.getProperty('calendarStatus')=="true") {
    codeString += "Browser.msgBox(\"You need to set a new calendarID for this script before it will work.\");\n";
    codeString += "setCalendarSettings();";
    }
  }
  window.setText(codeString).setWidth("100%").setHeight("400px");
  app.add(label);
  panel.add(window);
  app.add(panel);
  ss.show(app);
  return app;
}


