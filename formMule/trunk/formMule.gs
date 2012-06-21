var scriptTitle = "formMule Script V3.5 (5/30/12)";
// Written by Andrew Stillman for New Visions for Public Schools
// Published under GNU General Public License, version 3 (GPL-3.0)
// See restrictions at http://www.opensource.org/licenses/gpl-3.0.html
// Support and contact at http://www.youpd.org/formmule


var ss = SpreadsheetApp.getActiveSpreadsheet();
var MULEICONURL = 'https://c04a7a5e-a-3ab37ab8-s-sites.googlegroups.com/a/newvisions.org/data-dashboard/searchable-docs-collection/formMule_icon.gif?attachauth=ANoY7cogi4NJ2DtOXCZrLJmbtjjUM3o1iRpMv6jLJKmdD6leqNlPNqf_v25JspZaKvs3Utmn06IVx5FU-Vx7Mh7QAXLsibryzVj_3vGTRYODVYhFouJAnf-O4o4c0T9R-UsYHBt5s0BavhQQ6t4iIG1LqVXPyWAYhYOW3tFd16qkVK7LIR0jbR4hgVkC77V95ahMHCn9LbhfX1m3tkfkJeaATbI_Tvz1Yo-u6en7MSHwdYcuibIWPGdBDyoiLUybO_le1dpwd5lV&attredirects=0';

function onInstall () {
  Browser.msgBox('To complete initialization, please select \"Run initial installation\" from the formMule script menu above');
  var menuEntries = [];
      menuEntries.push({name: "What is formMule?", functionName: "whatIs"});
      menuEntries.push({name: "Run initial installation", functionName: "completeInstall"});
  onOpen();
}

function onOpen() {
  var menuEntries = [];
  var installed = ScriptProperties.getProperty('installedFlag');
  var sheetName = ScriptProperties.getProperty('sheetName');
  if (!(installed)) {
      menuEntries.push({name: "Run initial installation", functionName: "completeInstall"});
  } else {
      menuEntries.push({name: "What is formMule?", functionName: "whatIs"});
      menuEntries.push({name: "Step 1: Define source sheet settings", functionName: "defineSettings"});
    if ((sheetName) && (sheetName!='')) {
      menuEntries.push({name: "Step 2a: Set up auto-email options", functionName: "emailSettings"});
      menuEntries.push({name: "Step 2b: Set up auto-calendar options", functionName: "setCalendarSettings"});
      menuEntries.push({name: "Manually send/schedule all rows with a blank status", functionName: "manualSend"});
      menuEntries.push({name: "Package this workflow for others to copy", functionName: "extractorWindow"});
    }
  }
    
  this.ss.addMenu("formMule", menuEntries);
}

function completeInstall() {
  setFormMuleUid();
  preconfig();
  ScriptProperties.setProperty('installedFlag', 'true');
  var triggers = ScriptApp.getScriptTriggers();
  var formTriggerSetFlag = false;
  var editTriggerSetFlag = false;
  for (var i = 0; i<triggers.length; i++) {
    var eventType = triggers[i].getEventType();
    var triggerSource = triggers[i].getTriggerSource();
    var handlerFunction = triggers[i].getHandlerFunction();
    if ((handlerFunction=='onFormSubmit')&&(eventType=="ON_FORM_SUBMIT")&&(triggerSource=="SPREADSHEETS")) {
      formTriggerSetFlag = true;
    }
    if ((handlerFunction=='checkForSourceChanges')&&(eventType=="ON_EDIT")&&(triggerSource=="SPREADSHEETS")) {
      editTriggerSetFlag = true;
    }
  }
  if (formTriggerSetFlag==false) {
    setFormTrigger();
  }
  if (editTriggerSetFlag==false) {
    setEditTrigger();
  }
//ensure console and readme sheets exist
 var sheets = ss.getSheets();
 var readMeSet = false;
  for (var i=0; i<sheets.length; i++) {
 if (sheets[i].getName()=="Read Me") {
   readMeSet = true;
   break;
 }
 }
  if (readMeSet==false) {
   ss.insertSheet("Read Me");
   setReadMeText();
 }
 var sheet = ss.getSheetByName("Read Me");
 ss.setActiveSheet(sheet);
 onOpen();
}

function manualSend () {
  var manual = true;
  sendEmailsAndSetAppointments(manual);
}


function setFormTrigger() {
  var ssKey = SpreadsheetApp.getActiveSpreadsheet().getId();
  ScriptApp.newTrigger('onFormSubmit').forSpreadsheet(ssKey).onFormSubmit().create();
}

function setEditTrigger() {
  var ssKey = SpreadsheetApp.getActiveSpreadsheet().getId();
  ScriptApp.newTrigger('checkForSourceChanges').forSpreadsheet(ssKey).onEdit().create();
}

function lockFormulaRow() {
// setFrozenRows function is broken in Apps Script...uncomment once they fix it.
//var ss = SpreadsheetApp.getActiveSpreadsheet();
//var sheetName = ScriptProperties.getProperty('sheetName');
//var sheet = ss.getSheetByName(sheetName);
//sheet.setFrozenRows(2);
var ss = SpreadsheetApp.getActiveSpreadsheet();
var sheetName = ScriptProperties.getProperty('sheetName');
var sheet = ss.getSheetByName(sheetName)
ss.setActiveSheet(sheet);
  var frozenRows = sheet.getFrozenRows();
  if (frozenRows!=2) {
    Browser.msgBox("To avoid issues, it is highly recommended you freeze the first two rows of this sheet.");
  }
}


function setCalendarSettings () {
  var calendarStatus = ScriptProperties.getProperty('calendarStatus');
  var calendarToken  = ScriptProperties.getProperty('calendarToken');
  var eventTitleToken = ScriptProperties.getProperty('eventTitleToken');
  var locationToken = ScriptProperties.getProperty('locationToken');
  var guests = ScriptProperties.getProperty('guests');
  var emailInvites = ScriptProperties.getProperty('emailInvites');
  var monthToken = ScriptProperties.getProperty('monthToken');
  var dayToken = ScriptProperties.getProperty('dayToken');
  var yearToken = ScriptProperties.getProperty('yearToken');
  var allDay = ScriptProperties.getProperty('allDay');
  var startTimeToken = ScriptProperties.getProperty('startTimeToken');
  var endTimeToken = ScriptProperties.getProperty('endTimeToken');
  var descToken = ScriptProperties.getProperty('descToken');
  var reminderType = ScriptProperties.getProperty('reminderType');
  var minBefore = ScriptProperties.getProperty('minBefore');

  var app = UiApp.createApplication().setTitle('Step 2b: Set up auto-calendar options').setHeight(500).setWidth(800);
  var panel = app.createHorizontalPanel().setId('calendarPanel').setSpacing(20).setStyleAttribute('borderColor', 'grey');
  var helpLabel = app.createLabel().setText('Indicate whether a calendar event should be generated on form submission, and (optionally) set an additional condition below. Fields for calendar id, and date fields can be populated with static values or dynamically using the variables to the right.');
  var popupPanel = app.createPopupPanel();
  popupPanel.add(helpLabel);
  var scrollPanel = app.createScrollPanel().setHeight("400px");
  var verticalPanel = app.createVerticalPanel();
  var conditionsGrid = app.createGrid(1,5).setId('conditionsGrid');
  var conditionLabel = app.createLabel('Condition');
  var dropdown = app.createListBox().setId('col-0').setName('col-0').setWidth("150px");
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sourceSheetName = ScriptProperties.getProperty('sheetName');
  if ((sourceSheetName)&&(sourceSheetName!='')) {
     var sourceSheet = ss.getSheetByName(sourceSheetName);
  } else {
    Browser.msgBox('You must select a source sheet before this menu item can be selected.');
    defineSettings();
    app().close();
    return app;
  }
  var lastCol = sourceSheet.getLastColumn();
  if (lastCol > 0) {
  var headers = sourceSheet.getRange(1, 1, 1, lastCol).getValues()[0];
  } else {
    Browser.msgBox('You must have headers in your source data sheet before this menu item can be selected.');
    defineSettings();
    app().close();
    return app;
  }
  for (var i=0; i<headers.length; i++) {
    if ((headers[i]!="Status")) {
    dropdown.addItem(headers[i]);
    }
  }
  var equalsLabel = app.createLabel('equals');
  var textbox = app.createTextBox().setId('val-0').setName('val-0');
  var conditionHelp = app.createLabel('Leave blank to ignore. Use NULL for empty.  NOT NULL for not empty.').setStyleAttribute('fontSize', '8px');
  conditionsGrid.setWidget(0, 0, conditionLabel);
  conditionsGrid.setWidget(0, 1, dropdown);
  conditionsGrid.setWidget(0, 2, equalsLabel);
  conditionsGrid.setWidget(0, 3, textbox);
  conditionsGrid.setWidget(0, 4, conditionHelp);
  
  var calendarConditionString = ScriptProperties.getProperty('calendarConditions');
  if ((calendarConditionString)&&(calendarConditionString!='')) {
    var calendarConditionsObject = Utilities.jsonParse(calendarConditionString);
    var selectedHeader = calendarConditionsObject['col-0'];
    var selectedIndex = 0;
    for (var i=0; i<headers.length; i++) {
      if (headers[i]==selectedHeader) {
        selectedIndex = i;
        break;
      }
    }
    dropdown.setSelectedIndex(selectedIndex);
    var selectedValue = calendarConditionsObject['val-0'];
    textbox.setValue(selectedValue);
  }
  
  var settingsGrid = app.createGrid(15, 2).setId('settingsGrid').setWidth(520);
  var calendarLabel = app.createLabel().setText('Calendar Id (xyz@sample.org)');
  var calendarTextBox = app.createTextBox().setName('calendarToken').setWidth("100%");
  if (calendarToken) { calendarTextBox.setValue(calendarToken); }
  var eventTitleLabel = app.createLabel().setText('Event title');
  var eventTitleTextBox = app.createTextBox().setName('eventTitleToken').setWidth("100%");
  if (eventTitleToken) { eventTitleTextBox.setValue(eventTitleToken); }
  var eventLocationLabel = app.createLabel().setText('Location');
  var eventLocationTextBox = app.createTextBox().setName('locationToken').setWidth("100%");
  if (locationToken) { eventLocationTextBox.setValue(locationToken); }
  var guestsLabel = app.createLabel().setText('Guests (comma separated email addresses)');
  var guestsTextBox = app.createTextBox().setName('guests').setWidth("100%");
  if (guests) { guestsTextBox.setValue(guests);  }
  var emailInvitesCheckBox = app.createCheckBox().setText('Email invitations').setName('emailInvites');
  if (emailInvites=="true") { emailInvitesCheckBox.setValue(true); }
  var monthLabel = app.createLabel().setText('Month (m)');
  var monthTextBox = app.createTextBox().setName('monthToken').setWidth("100%");
  if (monthToken) { monthTextBox.setValue(monthToken); }
  var dayLabel = app.createLabel().setText('Day (d)');
  var dayTextBox = app.createTextBox().setName('dayToken').setWidth("100%");
  if (dayToken) { dayTextBox.setValue(dayToken); }
  var yearLabel = app.createLabel().setText('Year (yyyy)');
  var yearTextBox = app.createTextBox().setName('yearToken').setWidth("100%");
  if (yearToken) { yearTextBox.setValue(yearToken); }
  var startTimeLabel = app.createLabel().setText('Start time (must use a spreadsheet formatted datetime value)');
  var startTimeTextBox = app.createTextBox().setName('startTimeToken').setWidth("100%");
  if (startTimeToken) { startTimeTextBox.setValue(startTimeToken); }
  var endTimeLabel = app.createLabel().setText('End time (must use a spreadsheet formatted datetime value)');
  var endTimeTextBox = app.createTextBox().setName('endTimeToken').setWidth("100%");
  if (endTimeToken) { endTimeTextBox.setValue(endTimeToken); }
  var allDayCheckBox = app.createCheckBox().setText('All day event').setId('allDayTrue').setName('allDay').setVisible(false);
  var allDayCheckBoxFalse = app.createCheckBox().setText('All day event').setId('allDayFalse').setVisible(true);
  if (allDay=="true") { 
    allDayCheckBox.setValue(true).setVisible(true);
    allDayCheckBoxFalse.setVisible(false);
    startTimeLabel.setVisible(false);
    startTimeTextBox.setVisible(false);
    endTimeLabel.setVisible(false);
    endTimeTextBox.setVisible(false);
   }
  var uncheckClientHandler = app.createClientHandler().forTargets(startTimeLabel, startTimeTextBox, endTimeLabel, endTimeTextBox).setVisible(true);
                                                                                                           
  var uncheckServerHandler = app.createServerHandler('uncheck').addCallbackElement(allDayCheckBox);
  
  var checkClientHandler = app.createClientHandler().forTargets(startTimeLabel, startTimeTextBox, endTimeLabel, endTimeTextBox).setVisible(false);                                                   
 
  var checkServerHandler = app.createServerHandler('check').addCallbackElement(allDayCheckBox);
  
  allDayCheckBox.addClickHandler(uncheckClientHandler).addClickHandler(uncheckServerHandler);
  allDayCheckBoxFalse.addClickHandler(checkClientHandler).addClickHandler(checkServerHandler);

  var descLabel = app.createLabel().setText('Event description  (HTML accepted, however tags will unfortunately get stripped upon next edit of these settings.)');
  var descTextArea = app.createTextArea().setName('descToken').setWidth("100%").setHeight(75);
  if (descToken) { descTextArea.setValue(descToken); }
  var reminderLabel = app.createLabel().setText('Set reminder type');
  var reminderListBox = app.createListBox().setName('reminderType');
  reminderListBox.addItem('None');
  reminderListBox.addItem('Email reminder');
  reminderListBox.addItem('Popup reminder');
  reminderListBox.addItem('SMS reminder');
   if (reminderType) { 
    switch(reminderType) {
    case "Email reminder": 
       reminderListBox.setSelectedIndex(1);
    break;
    case "Popup reminder":
       reminderListBox.setSelectedIndex(2);
    case "SMS reminder":
       reminderListBox.setSelectedIndex(3);
    break;
    default:
        reminderListBox.setSelectedIndex(0);
    }
  }
  
  var reminderMinLabel = app.createLabel().setText('Minutes before');
  var reminderMinTextBox = app.createTextBox().setName('minBefore');
  if (minBefore) { reminderMinTextBox.setValue(minBefore); }
  settingsGrid.setWidget(0, 0, calendarLabel).setWidget(0, 1, calendarTextBox)
              .setWidget(1, 0, eventTitleLabel).setWidget(1, 1, eventTitleTextBox)
              .setWidget(2, 0, eventLocationLabel).setWidget(2, 1, eventLocationTextBox) 
              .setWidget(3, 0, guestsLabel).setWidget(3, 1, guestsTextBox) 
              .setWidget(4, 0, emailInvitesCheckBox)
              .setWidget(5, 0, monthLabel).setWidget(5, 1, monthTextBox) 
              .setWidget(6, 0, dayLabel).setWidget(6, 1, dayTextBox)
              .setWidget(7, 0, yearLabel).setWidget(7, 1, yearTextBox)
              .setWidget(8, 0, allDayCheckBox)
              .setWidget(9, 0, allDayCheckBoxFalse)
              .setWidget(10, 0, startTimeLabel).setWidget( 10, 1, startTimeTextBox)
              .setWidget(11, 0, endTimeLabel).setWidget(11, 1, endTimeTextBox)
              .setWidget(12, 0, descLabel).setWidget(12, 1, descTextArea)
              .setWidget(13, 0, reminderLabel).setWidget(13, 1, reminderListBox)
              .setWidget(14, 0, reminderMinLabel).setWidget(14, 1, reminderMinTextBox);
  settingsGrid.setStyleAttribute("backgroundColor", "whiteSmoke").setStyleAttribute('textAlign', 'right').setStyleAttribute('padding', '8px');
  settingsGrid.setStyleAttribute(0, 1, 'width', '200px');
  var checkBox = app.createCheckBox().setText("Turn on auto-calendar-event creation feature.").setId('calendarStatus').setName('calendarStatus').setStyleAttribute('color', 'blue').setStyleAttribute('fontWeight', 'bold');
  if (calendarStatus=="true") {
    checkBox.setValue(true);
    }
  var buttonHandler = app.createServerHandler('saveCalendarSettings').addCallbackElement(scrollPanel).addCallbackElement(checkBox);
  var button = app.createButton().setText('Save Calendar Settings').addClickHandler(buttonHandler);
  app.add(popupPanel);
  app.add(checkBox);
  var verticalPanel = app.createVerticalPanel();
  verticalPanel.add(conditionsGrid);
  panel.add(settingsGrid);
  var variablesPanel = app.createVerticalPanel().setStyleAttribute('backgroundColor', 'whiteSmoke').setStyleAttribute('padding', '10px');
  var variablesScrollPanel = app.createScrollPanel().setHeight(500);
  var variablesLabel = app.createLabel().setText("Choose from the following variables: ").setStyleAttribute('fontWeight', 'bold');
  var tags = getAvailableTags();
  var flexTable = app.createFlexTable()
  for (var i = 0; i<tags.length; i++) {
    var tag = app.createLabel().setText(tags[i]);
    flexTable.setWidget(i, 0, tag);
    }
  variablesPanel.add(variablesLabel);
  variablesScrollPanel.add(flexTable);
  variablesPanel.add(variablesScrollPanel);
  panel.add(variablesPanel);
  verticalPanel.add(panel);
  scrollPanel.add(verticalPanel);
  app.add(scrollPanel);
  app.add(button);
  ss.show(app);
  return app;
}


function getAvailableTags() {
  var dataSheetName = ScriptProperties.getProperty("sheetName");
  var dataSheet = ss.getSheetByName(dataSheetName);
  if (!dataSheet) {
    Browser.msgBox('You must select a source data sheet before this menu item can be selected.');
    defineSettings();
    app().close();
    return app;
  }
  var lastCol = dataSheet.getLastColumn();
  var headerRange = dataSheet.getRange(1, 1, 1, lastCol);
  var headers = headerRange.getValues();
  var availableTags = [];
  
  for (var i=0; i<headers[0].length; i++) {
    availableTags[i] = "${\""+headers[0][i]+"\"}";
  } 
  availableTags.splice(availableTags.indexOf('${Status}'), 1);
  availableTags.splice(availableTags.indexOf('${Event Id}'), 1);
  var k = availableTags.length;
  availableTags[k] = "$currDay  (current day)";
  availableTags[k+1] = "$currMonth  (current month)";
  availableTags[k+2] = "$currYear  (current year)";
  availableTags[k+3] = "$eventId  (available in description only)";
  availableTags[k+4] = "$formUrl  (link to form)"
  return availableTags;
}


function check() {
//  Browser.msgBox("hellow");
  var app = UiApp.getActiveApplication();
  var allDayCheckBox = app.getElementById('allDayTrue');
  allDayCheckBox.setValue(true).setVisible(true);
  var allDayCheckBoxFalse = app.getElementById('allDayFalse');
  allDayCheckBoxFalse.setValue(false).setVisible(false);
  return app;
}

function uncheck() {
//  Browser.msgBox("hello");
  var app = UiApp.getActiveApplication();
  var allDayCheckBox = app.getElementById('allDayTrue');
  allDayCheckBox.setValue(false).setVisible(false);
  var allDayCheckBoxFalse = app.getElementById('allDayFalse');
  allDayCheckBoxFalse.setValue(false).setVisible(true);
  return app;
}


function saveCalendarSettings (e) {
  var app = UiApp.getActiveApplication();
  var oldCalendarStatus = ScriptProperties.getProperty('calendarStatus');
  var calendarStatus = e.parameter.calendarStatus;
  ScriptProperties.setProperty('calendarStatus', calendarStatus);
  var conditionObject = new Object();
  conditionObject['col-0'] = e.parameter['col-0'];
  conditionObject['val-0'] = e.parameter['val-0'];
  var conditionString = Utilities.jsonStringify(conditionObject);
  ScriptProperties.setProperty('calendarConditions', conditionString);
  var sheetName = ScriptProperties.getProperty('sheetName');
  var sheet = ss.getSheetByName(sheetName);
  if (calendarStatus=="true") {
    var lastCol = sheet.getLastColumn();
    var secondToLastHeader = normalizeHeader(sheet.getRange(1, lastCol-1).getValue());
    Logger.log(secondToLastHeader);
    var lastHeader = normalizeHeader(sheet.getRange(1, lastCol).getValue());
    Logger.log(lastHeader);
    if((lastHeader=="status")&&(secondToLastHeader!="eventId")) {
      sheet.insertColumnBefore(lastCol);
      sheet.getRange(1, lastCol).setValue('Event Id').setBackground("black").setFontColor("white").setComment("Don't change the name of this column. Must remain the second to last column.");
      sheet.getRange(2, lastCol).setValue('N/A: This is the formula row.').setBackground("black").setFontColor("white");
      var newLastCol = sheet.getLastColumn();
      ScriptProperties.setProperty('numCols', newLastCol);
    }
  }
    var calendarToken = e.parameter.calendarToken;
    var eventTitleToken = e.parameter.eventTitleToken;
    var locationToken = e.parameter.locationToken;
    var monthToken = e.parameter.monthToken;
    var dayToken = e.parameter.dayToken;
    var yearToken = e.parameter.yearToken;
    var allDay = e.parameter.allDay;
  Logger.log(allDay);
    var startTimeToken = e.parameter.startTimeToken;
    var endTimeToken = e.parameter.endTimeToken;
    var descToken = e.parameter.descToken;
    var guests = e.parameter.guests;
    var emailInvites = e.parameter.emailInvites;
    var reminderType = e.parameter.reminderType;
    var sendInvites = e.parameter.sendInvites;
    var minBefore = e.parameter.minBefore;
  
    ScriptProperties.setProperty('calendarToken', calendarToken);
    ScriptProperties.setProperty('eventTitleToken', eventTitleToken);
    ScriptProperties.setProperty('locationToken', locationToken);
    ScriptProperties.setProperty('guests', guests);
    ScriptProperties.setProperty('emailInvites', emailInvites);
    ScriptProperties.setProperty('monthToken', monthToken);
    ScriptProperties.setProperty('dayToken', dayToken);
    ScriptProperties.setProperty('yearToken', yearToken);
    ScriptProperties.setProperty('allDay', allDay);
    ScriptProperties.setProperty('startTimeToken', startTimeToken);
    ScriptProperties.setProperty('endTimeToken', endTimeToken);
    ScriptProperties.setProperty('descToken', descToken);
    ScriptProperties.setProperty('reminderType', reminderType);
    ScriptProperties.setProperty('minBefore', minBefore);
   
    if (calendarToken=='') { Browser.msgBox("Your forgot to enter a Calendar Id"); setCalendarSettings (); }
    if (eventTitleToken=='') { Browser.msgBox("Your forgot to enter an event title"); setCalendarSettings (); }
    if (monthToken=='') { Browser.msgBox("Your forgot to enter a month"); setCalendarSettings (); }
    if (dayToken=='') { Browser.msgBox("Your forgot to enter a day"); setCalendarSettings (); }
    if (yearToken=='') { Browser.msgBox("Your forgot to enter a year"); setCalendarSettings (); }
    if ((reminderType!="None")&&(minBefore=='')) { Browser.msgBox("Your forgot to specify the numer of minutes before the event for reminders"); setCalendarSettings (); }
    if ((allDay!='true')&&(startTimeToken=='')) { Browser.msgBox("Your forgot to enter a start time"); setCalendarSettings (); }
    if ((allDay!='true')&&(endTimeToken=='')) { Browser.msgBox("Your forgot to enter an end time"); setCalendarSettings (); }
    
   app.close();
   return app;
}
  

function onFormSubmit () {
  var sheetName = ScriptProperties.getProperty('sheetName');
  var sheet = ss.getSheetByName(sheetName);
  var colSettings = ScriptProperties.getProperty('colSettings').split(",");
  var caseNoSetting = ScriptProperties.getProperty('caseNoSetting');
  var lastRow = sheet.getLastRow();
  var lastCol = sheet.getLastColumn();
  for (var i = 0; i<colSettings.length; i++) {
    if (colSettings[i]=="true") {
      var formulaCell = sheet.getRange(2, i+1);
      var cellRange = sheet.getRange(lastRow, i+1);
      formulaCell.copyTo(cellRange);
      cellRange.setBackground("white");
      cellRange.setComment(null);
    }
  }
  if (caseNoSetting == "true") {
    var headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
    var caseNoCol = lastCol-1;
    for (var i=0; i<headers.length; i++) {
      if (headers[i]=="Case No") {
        caseNoCol=i+1;
        break
      }
    }
    var cellRange = sheet.getRange(lastRow, caseNoCol);
    var cellValue = cellRange.getValue();
    if (cellValue=="") {
    cellRange.setValue(assignCaseNo());
    }
  }
  sendEmailsAndSetAppointments();
}


function urlencode(inNum) {
  // Function to convert non URL compatible characters to URL-encoded characters
  var outNum = 0;     // this will hold the answer
  outNum = escape(inNum); //this will URL Encode the value of inNum replacing whitespaces with %20, etc.
  return outNum;  // return the answer to the cell which has the formula
}




function assignCaseNo(resetToValue) {
  if (resetToValue) {
  var caseNo = resetToValue;
  } else { 
  var caseNo = ScriptProperties.getProperty('caseNo')
  };
  if(caseNo==null) {
      ScriptProperties.setProperty('caseNo','0');
      caseNo = 0;
   } else {
   caseNo = parseInt(caseNo) + 1;
   ScriptProperties.setProperty('caseNo', caseNo);
  }
return caseNo; 
}


function emailSettings () {
  var app = UiApp.createApplication().setTitle("Step 2a: Set up auto-email options").setHeight(500).setWidth(700);
  var panel = app.createVerticalPanel().setId("emailPanel").setStyleAttribute('backgroundColor', 'whiteSmoke').setStyleAttribute('padding', '5px').setStyleAttribute('marginTop', '5px');
  var helpLabel = app.createLabel().setText('Indicate below whether you want templated emails to be generated upon form submit, how many different emails you want to create, and (optionally) any additional conditions that must be met before sending');
  var helpPopup = app.createPopupPanel();
  helpPopup.add(helpLabel);
  app.add(helpPopup);
  var emailStatus = ScriptProperties.getProperty('emailStatus');
  var emailStatusCheckBox = app.createCheckBox().setText('Turn-on the auto-email feature').setName('emailStatus').setStyleAttribute('color', 'blue');
  if (emailStatus=="true") {
    emailStatusCheckBox.setValue(true);
  }
  var numSelectLabel = app.createLabel().setText("How many different unique, templated emails do you want to send out to different recipients when the form is submitted?");
  var grid = app.createGrid().setId('emailConditionGrid');
  setEmailConditionGrid(app);
  var numSelectChangeHandler = app.createServerHandler('refreshEmailConditions').addCallbackElement(panel);
  var numSelect = app.createListBox().setId("numSelect").setName("numSelectValue").addChangeHandler(numSelectChangeHandler);
  numSelect.addItem('1');
  numSelect.addItem('2');
  numSelect.addItem('3');
  var preSelectedNum = ScriptProperties.getProperty('numSelected');
  switch (preSelectedNum) {
    case "1":
     numSelect.setSelectedIndex(0);
    break;
    case "2":
     numSelect.setSelectedIndex(1);
    break;
    case "3":
     numSelect.setSelectedIndex(2);
    break;
    default: 
     numSelect.setSelectedIndex(0);
  }
  var submitHandler = app.createServerHandler('saveEmailSettings').addCallbackElement(panel);
  var button = app.createButton().setText("Submit settings").addClickHandler(submitHandler);
  var numSelectNote = app.createLabel().setStyleAttribute('marginTop', '20px').setText("Note: The the first time you submit this form, it will auto-generate a new sheet with a blank template for each email. You will need to go to these sheets and complete the the \"To:\", \"CC:\", \"Subject:\", and \"Body:\" sections of the template. If you return later and increase the number here, the script will generate additional sheets. Decreasing this value will delete the corresponding sheets.  Do not change the names of the template sheets.");
  panel.add(emailStatusCheckBox);
  panel.add(numSelectLabel);
  panel.add(numSelect);
  panel.add(grid);
  panel.add(numSelectNote);
  panel.add(button);
  app.add(panel);
  this.ss.show(app);
}

function setEmailConditionGrid(app) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sourceSheetName = ScriptProperties.getProperty('sheetName');
  if ((!sourceSheetName)||(sourceSheetName=='')) {
    Browser.msgBox('You must select a source data sheet before this menu item can be selected.');
    defineSettings();
    app().close();
    return app;
  } else {
    var sourceSheet = ss.getSheetByName(sourceSheetName);
  }
  var lastCol = sourceSheet.getLastColumn();
  var headers = sourceSheet.getRange(1, 1, 1, lastCol).getValues()[0];
  var numSelected = ScriptProperties.getProperty('numSelected');
  if ((!numSelected)||(numSelected=='')) {
    numSelected = 1;
  }
  numSelected = parseInt(numSelected);
  var grid = app.getElementById('emailConditionGrid');
  grid.resize(numSelected+1, 5);
  grid.setWidget(0,1,app.createLabel('Column'));
  grid.setWidget(0,3,app.createLabel('Value'));
  var dropdown = [];
  var textbox = [];
  for (var i=0; i<numSelected; i++) {
    var label = 'Condition for Email ' + (i+1);
    grid.setWidget(i+1, 0, app.createLabel(label));
    dropdown[i] = app.createListBox().setId('conditionCol-'+i).setName('conditionCol-'+i).setWidth("150px");
    for (var j=0; j<headers.length; j++) {
      if (headers[j]!="Status") {
        dropdown[i].addItem(headers[j]);
      }
    }
    textbox[i] = app.createTextBox().setId('value-'+i).setName('value-'+i);
    grid.setWidget(i+1, 1, dropdown[i]);
    grid.setWidget(i+1, 2, app.createLabel('equals'));
    grid.setWidget(i+1, 3, textbox[i]);
    grid.setWidget(i+1, 4, app.createLabel('Leave blank to ignore. Use NULL for empty.  NOT NULL for not empty.').setStyleAttribute('fontSize', '8px'));
  }
  var emailConditions = ScriptProperties.getProperty('emailConditions');
  if ((emailConditions)&&(emailConditions!='')) {
    emailConditions = Utilities.jsonParse(emailConditions);
    numSelected = parseInt(numSelected);
    for (var i=0; i<numSelected; i++) {
      var preset = 0;
      for (var j=0; j<headers.length; j++) {
        if (emailConditions["col-"+i]==headers[j]) {
          preset = j;
          break;
        }
      }
      dropdown[i].setSelectedIndex(preset);
      textbox[i].setValue(emailConditions["val-"+i]);
    }
  }
  return app; 
}


function refreshEmailConditions(e) {
  var app = UiApp.getActiveApplication();
  var grid = app.getElementById('emailConditionGrid');
  var numSelected = e.parameter.numSelectValue;
  var oldNumSelected = ScriptProperties.getProperty('numSelected');
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sourceSheetName = ScriptProperties.getProperty('sheetName');
  if ((!sourceSheetName)||(sourceSheetName=='')) {
    var sourceSheet = ss.getSheets()[0];
  } else {
    var sourceSheet = ss.getSheetByName(sourceSheetName);
  }
  var lastCol = sourceSheet.getLastColumn();
  var headers = sourceSheet.getRange(1, 1, 1, lastCol).getValues()[0];
  if ((!numSelected)||(numSelected=='')) {
    numSelected = 1;
  }
  numSelected = parseInt(numSelected);
  grid.resize(numSelected+1, 5);
  grid.setWidget(0,1,app.createLabel('Column'));
  grid.setWidget(0,3,app.createLabel('Value'));
  var dropdown = [];
  var textbox = [];
  for (var i=0; i<numSelected; i++) {
    var label = 'Condition for Email ' + (i+1);
    grid.setWidget(i+1, 0, app.createLabel(label));
    dropdown[i] = app.createListBox().setId('conditionCol-'+i).setName('conditionCol-'+i).setWidth("150px");
    for (var j=0; j<lastCol; j++) {
      if(headers[j]!="Status") {
        dropdown[i].addItem(headers[j]);
      }
    }
    textbox[i] = app.createTextBox().setId('value-'+i).setName('value-'+i);
    grid.setWidget(i+1, 1, dropdown[i]);
    grid.setWidget(i+1, 2, app.createLabel('equals'));
    grid.setWidget(i+1, 3, textbox[i]);
    grid.setWidget(i+1, 4, app.createLabel('Leave blank to ignore. Use NULL for empty.  NOT NULL for not empty.').setStyleAttribute('fontSize', '8px'));
  }
  var emailConditions = new Object();
  for (var i=0; i<numSelected; i++) {
    var condCol = e.parameter["conditionCol-"+i];
    var condVal = e.parameter["value-"+i];
    emailConditions["col-"+i] = condCol;
    emailConditions["val-"+i] = condVal;
  }
  emailConditions = Utilities.jsonStringify(emailConditions);
  if ((emailConditions)&&(emailConditions!='')) {
    emailConditions = Utilities.jsonParse(emailConditions);
    if (numSelected>=oldNumSelected) {
    for (var i=0; i<oldNumSelected; i++) {    
      var preset = 0;
      for (var j=0; j<headers.length; j++) {
        if (emailConditions["col-"+i]==headers[j]) {
          preset = j;
          break;
        }
      }
      dropdown[i].setSelectedIndex(preset);
      textbox[i].setValue(emailConditions["val-"+i]);
     }
   }
    if (numSelected<oldNumSelected) {
    for (var i=0; i<numSelected; i++) {    
      var preset = 0;
      for (var j=0; j<headers.length; j++) {
        if (emailConditions["col-"+i]==headers[j]) {
          preset = j;
          break;
        }
      }
      dropdown[i].setSelectedIndex(preset);
      textbox[i].setValue(emailConditions["val-"+i]);
     }
   }
  }
  return app; 
}



//returns true if testval meets the condition 
function evaluateConditions(condString, index, rowData) {
  var condObject = Utilities.jsonParse(condString);
  var i = index;
  var testHeader = normalizeHeader(condObject["col-"+i]);
  var testVal = rowData[testHeader];
  var value = condObject["val-"+i];
  var output = false;
  switch(value)
  {
  case "":
      output = true;
      break;
  case "NULL":
      if((!testVal)||(testVal=='')) {
        output = true;
      }  
    break;
  case "NOT NULL":
    if((testVal)&&(testVal!='')) {
        output = true;
      }  
    break;
  default:
    if(testVal==value) {
        output = true;
      }  
  }
  return output;
}


function saveEmailSettings(e) {
  var app = UiApp.getActiveApplication();
  var emailStatus = e.parameter.emailStatus;
  ScriptProperties.setProperty('emailStatus', emailStatus);
  var numSelected = e.parameter.numSelectValue;
  var emailConditions = new Object();
  emailConditions["max"]=numSelected;
  for (var i=0; i<numSelected; i++) {
    var condCol = e.parameter["conditionCol-"+i];
    var condVal = e.parameter["value-"+i];
    emailConditions["col-"+i] = condCol;
    emailConditions["val-"+i] = condVal;
  }
  emailConditions = Utilities.jsonStringify(emailConditions);
  ScriptProperties.setProperty('emailConditions', emailConditions);
  var oldNum = parseInt(ScriptProperties.getProperty('numSelected'));
  ScriptProperties.setProperty('numSelected', numSelected);
  var num = parseInt(numSelected);
  var diff = oldNum - num;
  if (diff>0) {
    switch (diff) {
      case 1:
       var deadSheet = ss.getSheetByName("Email"+oldNum+" Template");
       ss.setActiveSheet(deadSheet);
       ss.deleteActiveSheet();   
       break;
      case 2:
       var deadSheet = ss.getSheetByName("Email"+oldNum+" Template");
       ss.setActiveSheet(deadSheet);
       ss.deleteActiveSheet(); 
       deadSheet = ss.getSheetByName("Email"+(oldNum-1)+" Template");
       ss.setActiveSheet(deadSheet);
       ss.deleteActiveSheet();   
       break;
    }
  }

  var sheets = ss.getSheets();
  for (var i=0; i<num; i++) {
    var alreadyExists = '';
    for (var j=0; j<sheets.length; j++) {
      if (sheets[j].getName()== "Email"+(i+1)+" Template") {
        alreadyExists = true;
      }
    }
    if (!(alreadyExists==true)) {
    var newSheet = ss.insertSheet().setName("Email"+(i+1)+" Template");
    var newSheetName = newSheet.getName();
    newSheet.getRange(1, 1).setValue("Reply to:").setBackground("yellow");
    newSheet.getRange(2, 1).setValue("To:").setBackground("yellow");
    newSheet.getRange(3, 1).setValue("CC:").setBackground("yellow");
    newSheet.getRange(4, 1).setValue("Subject:").setBackground("yellow"); 
    newSheet.getRange(5, 1).setValue("Body: \n Tip: \"<br />\" creates a newline in the email. \n HTML-friendly!").setVerticalAlignment("top").setBackground("yellow");
    newSheet.setRowHeight(5, 200); 
    newSheet.getRange(6, 1).setValue("Read Me").setBackground("yellow"); 
    newSheet.getRange(6, 2).setValue("Use tags with this ${\"Column Header\"} format for dynamic values.  Separate email addresses with commas.").setBackground("yellow");
    newSheet.getRange(1, 2).setValue("Optional: Complete me with a single valid email or email token from the list below to use a different \"Reply To\" address. Even when this is set, sender address will always appear as the installer of this script.  Delete me if not used.");
    newSheet.getRange(2, 2).setValue("Complete me with valid, comma separated email addresses or email tokens from the list below! Required field.");
    newSheet.getRange(3, 2).setValue("Optional: Complete me with valid, comma separated email addresses or email tokens from the list below! Delete me if not used.");
    newSheet.getRange(4, 2).setValue("Complete me!  Use tokens below for dynamic values.").setVerticalAlignment("top");
    newSheet.getRange(5, 2).setValue("Complete me! Use tokens below for dynamic values.").setVerticalAlignment("top");


    newSheet.setColumnWidth(2, 500);
    setAvailableTags(newSheetName);
  }
  }
  app.close();
  return app;
}




function setAvailableTags(sheetName) {
  var templateSheet = ss.getSheetByName(sheetName);
  var dataSheetName = ScriptProperties.getProperty("sheetName");
  var dataSheet = ss.getSheetByName(dataSheetName);
  var lastCol = dataSheet.getLastColumn();
  if(lastCol==0){
    lastCol = 1;
    var noTags = "You have no headers in your data sheet";
  }
  var headerRange = dataSheet.getRange(1, 1, 1, lastCol);
  var headers = headerRange.getValues();
  var availableTags = [];
  for (var i=0; i<headers[0].length; i++) {
    if (headers[0][i]=='') {
      Browser.msgBox('Column ' + parseInt(i+1) + ' has a blank header. You cannot have blank headers in your source data. Please fix this before proceeding.');
    }
    availableTags[i] = "${\""+headers[0][i]+"\"}";
  }
  
 
   availableTags.splice(availableTags.indexOf('${\"Status\"}'), 1); 
   if (availableTags.indexOf('${\"Event Id\"}')!=-1) {
     availableTags.splice(availableTags.indexOf('${\"Event Id\"}'), 1);
   }
  var k = availableTags.length;
  availableTags[k] = "$currMonth";
  availableTags[k+1] = "$currDay";
  availableTags[k+2] = "$currYear";
  availableTags[k+3] = "$formUrl";
  
  availableTags = availableTags.join("\n");  
  if (noTags) {
    availableTags = noTags;
  }
  templateSheet.getRange(6, 1).setValue("Currently available tags").setBackground("yellow") .setVerticalAlignment("top");
  templateSheet.getRange(6, 2).setValue(availableTags).setBackground("yellow");
}



function sendEmailsAndSetAppointments(manual) {
  var calendarStatus = ScriptProperties.getProperty('calendarStatus');
  if ((calendarStatus == "true")||(manual==true)) {
    try
    {
    var manualCal=true;
    var calendarToken  = ScriptProperties.getProperty('calendarToken');
    var eventTitleToken = ScriptProperties.getProperty('eventTitleToken');
    var locationToken = ScriptProperties.getProperty('locationToken');
    var guestsToken = ScriptProperties.getProperty('guests');
    var emailInvites = ScriptProperties.getProperty('emailInvites');
    if (emailInvites == "true") { emailInvites = true; } else { emailInvites = false;}
    var monthToken = ScriptProperties.getProperty('monthToken');
    var dayToken = ScriptProperties.getProperty('dayToken');
    var yearToken = ScriptProperties.getProperty('yearToken');
    var allDay = ScriptProperties.getProperty('allDay');
    var startTimeToken = ScriptProperties.getProperty('startTimeToken');
    var endTimeToken = ScriptProperties.getProperty('endTimeToken');
    var descToken = ScriptProperties.getProperty('descToken');
    var reminderType = ScriptProperties.getProperty('reminderType');
    var minBefore = ScriptProperties.getProperty('minBefore');
    }
    catch(err)
    {
    var manualCal = false;
    }
  }
  var emailStatus = ScriptProperties.getProperty('emailStatus');
  var numSelected = ScriptProperties.getProperty('numSelected');
  var dataSheetName = ScriptProperties.getProperty("sheetName");
  var dataSheet = ss.getSheetByName(dataSheetName);
  var dataRange = dataSheet.getRange(2, 1, dataSheet.getMaxRows() - 1, dataSheet.getLastColumn());
  var lastHeader = dataSheet.getRange(1, dataSheet.getLastColumn());
  var lastHeaderValue = normalizeHeader(lastHeader.getValue());  
  if (lastHeaderValue != "status") {
    dataSheet.insertColumnAfter(dataSheet.getLastColumn());
    dataSheet.getRange(1,dataSheet.getLastColumn()).setBackground("black").setFontColor("white").setValue("Status").setComment("Don't change the name of this column. Must remain the last column.");
  }
  
  dataRange = dataSheet.getRange(2, 1, dataSheet.getMaxRows() - 1, dataSheet.getLastColumn());
  var test = dataRange.getValues()
  // Create one JavaScript object per row of data.
  var objects = getRowsData(dataSheet, dataRange);
  // For every row object, create a personalized email from a template and send
  // it to the appropriate person.
  for (var j = 0; j < objects.length; ++j) {
    // Get a row object
    var rowData = objects[j];
if (rowData.status==null) {
    var confirmation = '';
  
  // check for calendar status setting
  if ((calendarStatus=="true")&&(manualCal ==true)) {
  //  load up calendar conditions
  var calConditionsString = ScriptProperties.getProperty('calendarConditions');
  if ((calConditionsString)&&(calConditionsString!='')) {
  var calConditionTest = evaluateConditions(calConditionsString, 0, rowData);
    }
    if ((calConditionTest == true)||(!calConditionsString)) {
  
    var calendar  = fillInTemplateFromObject(calendarToken, rowData);
    if (calendar!='') {
    var eventTitle = fillInTemplateFromObject(eventTitleToken, rowData);
    var location = fillInTemplateFromObject(locationToken, rowData);
    var desc = fillInTemplateFromObject(descToken, rowData);
    var guests = fillInTemplateFromObject(guestsToken, rowData);
    var month = parseInt(fillInTemplateFromObject(monthToken, rowData))-1;
    var day = parseInt(fillInTemplateFromObject(dayToken, rowData));
    var year = parseInt(fillInTemplateFromObject(yearToken, rowData));
    var startTimeStamp;
    var endTimeStamp;
    var timeZone = Session.getTimeZone();
    if (!(allDay=="true")) {
      var startTime = new Date(fillInTemplateFromObject(startTimeToken, rowData));
      var startHours = Utilities.formatDate(startTime, timeZone, "HH");
      var startMinutes = Utilities.formatDate(startTime, timeZone, "mm");
      startTimeStamp = new Date(year, month, day, startHours, startMinutes);
      var endTime = new Date(fillInTemplateFromObject(endTimeToken, rowData));
      var endHours = Utilities.formatDate(endTime, timeZone, "HH");
      var endMinutes = Utilities.formatDate(endTime, timeZone, "mm");
      endTimeStamp = new Date(year, month, day, endHours, endMinutes);
    } else {
      startTimeStamp = new Date(year, month, day);
    }
  //  var reminderType = ScriptProperties.getProperty('reminderType');  need to translate this
  //  var minBefore = ScriptProperties.getProperty('minBefore');
  if (guests!='') {
  var options = {guests:guests, location:location, description:desc, sendInvites:emailInvites}; 
  } else {
  var options = {location:location, description:desc,};
  }
  var event = '';
  var eventId = '';
  var calendar = CalendarApp.getCalendarById(calendar);
    if (allDay=="true") {
     eventId = calendar.createAllDayEvent(eventTitle, startTimeStamp, options).getId();
     confirmation += "Event added to "+ calendar + " for " + startTimeStamp;
    } else {
     eventId = calendar.createEvent(eventTitle, startTimeStamp, endTimeStamp, options).getId();
     confirmation += "Event added to "+ calendar + " for " + startTimeStamp;
    }
    logCalEvent();
    dataSheet.getRange(j+2, dataSheet.getLastColumn()-1).setValue(eventId);
    desc = desc.replace("$eventId", eventId);
    event = calendar.getEventSeriesById(eventId);    
  if (reminderType) { 
    switch(reminderType) {
    case "Email reminder": 
       event = calendar.getEventSeriesById(eventId).addEmailReminder(minBefore);
    break;
    case "Popup reminder":
       event = calendar.getEventSeriesById(eventId).addPopupReminder(minBefore);
    break;
    case "SMS reminder":
       event = calendar.getEventSeriesById(eventId).addSmsReminder(minBefore);
    break;
    default:
       event = calendar.getEventSeriesById(eventId).removeAllReminders();
    }
  }
  } else { confirmation+= "No calendar listed: no event created"; }
 }
} //end calendar condition test
    
  //Load up email conditions string
  var emailCondString = ScriptProperties.getProperty('emailConditions');
  // check for email status setting 
  if ((emailStatus=="true")||(manual==true)) {
  for (var i=0; i<numSelected; i++) {
    if ((emailCondString)&&(emailCondString!='')) {
    var emailConditionTest = evaluateConditions(emailCondString, i, rowData);
    }
    if ((emailConditionTest == true)||(!emailCondString)) {
    var templateSheet = ss.getSheetByName("Email"+(i+1)+" Template");
    var sendersTemplate = templateSheet.getRange("B1").getValue();
    var recipientsTemplate = templateSheet.getRange("B2").getValue();
    var ccRecipientsTemplate = templateSheet.getRange("B3").getValue();
    var subjectTemplate = templateSheet.getRange("B4").getValue();
    var bodyTemplate = templateSheet.getRange("B5").getValue();

    // Generate a personalized email.
    // Given a template string, replace markers (for instance ${"First Name"}) with
    // the corresponding value in a row object (for instance rowData.firstName).
    var from = fillInTemplateFromObject(sendersTemplate, rowData);
    var to = fillInTemplateFromObject(recipientsTemplate, rowData);
    if (to!='') {
      var cc = fillInTemplateFromObject(ccRecipientsTemplate, rowData);
      var subject = fillInTemplateFromObject(subjectTemplate, rowData);
      var body = fillInTemplateFromObject(bodyTemplate, rowData);
    
    if (from=='') {
      MailApp.sendEmail(to, subject, '', {htmlBody: body, cc: cc});
      } else {
        MailApp.sendEmail(to, subject, '', {htmlBody: body, cc: cc, replyTo: from});
      }
      if (cc!='') { var ccMsg = ", and cc'd to "+cc; } else {ccMsg = ''}
      if ((i>0)&&(i<numSelected-1)) { var addSemiColon = "; "} else { var addSemiColon = ""; }
      confirmation += " Email"+(i+1)+" sent to "+to+ccMsg+addSemiColon;
      logEmail();
      } else { 
      confirmation += "";
      }
     } // end per email conditional check
     } // end email status check conditional
    } // end i loop through email templates
    dataSheet.getRange(j+2, dataSheet.getLastColumn()).setValue(confirmation);
    } // end conditional test for confirmation email
  } //end j loop through spreadsheet rows
} // end function



// Replaces markers in a template string with values define in a JavaScript data object.
// Arguments:
//   - template: string containing markers, for instance ${"Column name"}
//   - data: JavaScript object with values to that will replace markers. For instance
//           data.columnName will replace marker ${"Column name"}
// Returns a string without markers. If no data is found to replace a marker, it is
// simply removed.
function fillInTemplateFromObject(template, data) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var newString = template;
  // Search for all the variables to be replaced, for instance ${"Column name"}
  
  var templateVars = template.match(/\$\{\"[^\"]+\"\}/g);

  // Replace variables from the template with the actual values from the data object.
  // If no value is available, replace with the empty string.
  if (templateVars) {
  for (var i = 0; i < templateVars.length; ++i) {
    // normalizeHeader ignores ${"} so we can call it directly here.
    var variableData = data[normalizeHeader(templateVars[i])];
    newString = newString.replace(templateVars[i], variableData || "");
  }
  }
  var currentTime = new Date();
  var month = currentTime.getMonth().toString();
  var day = currentTime.getDate().toString();
  var year = currentTime.getFullYear().toString();
  var formUrl = ss.getFormUrl();
  newString = newString.replace("$currMonth", month);
  newString = newString.replace("$currDay", day);
  newString = newString.replace("$currYear", year);
  newString = newString.replace("$formUrl", formUrl);
  
  return newString;
}





//////////////////////////////////////////////////////////////////////////////////////////
//
// The code below is reused from the 'Reading Spreadsheet data using JavaScript Objects'
// tutorial.
//
//////////////////////////////////////////////////////////////////////////////////////////

// getRowsData iterates row by row in the input range and returns an array of objects.
// Each object contains all the data for a given row, indexed by its normalized column name.
// Arguments:
//   - sheet: the sheet object that contains the data to be processed
//   - range: the exact range of cells where the data is stored
//   - columnHeadersRowIndex: specifies the row number where the column names are stored.
//       This argument is optional and it defaults to the row immediately above range; 
// Returns an Array of objects.
function getRowsData(sheet, range, columnHeadersRowIndex) {
  columnHeadersRowIndex = columnHeadersRowIndex || range.getRowIndex() - 1;
  var numColumns = range.getEndColumn() - range.getColumn() + 1;
  var headersRange = sheet.getRange(columnHeadersRowIndex, range.getColumn(), 1, numColumns);
  var headers = headersRange.getValues()[0];
  return getObjects(range.getValues(), normalizeHeaders(headers));
}

// For every row of data in data, generates an object that contains the data. Names of
// object fields are defined in keys.
// Arguments:
//   - data: JavaScript 2d array
//   - keys: Array of Strings that define the property names for the objects to create
function getObjects(data, keys) {
  var objects = [];
  for (var i = 0; i < data.length; ++i) {
    var object = {};
    var hasData = false;
    for (var j = 0; j < data[i].length; ++j) {
      var cellData = data[i][j];
      if (isCellEmpty(cellData)) {
        continue;
      }
      object[keys[j]] = cellData;
      hasData = true;
    }
    if (hasData) {
      objects.push(object);
    }
  }
  return objects;
}

// Returns an Array of normalized Strings.
// Arguments:
//   - headers: Array of Strings to normalize
function normalizeHeaders(headers) {
  var keys = [];
  for (var i = 0; i < headers.length; ++i) {
    var key = normalizeHeader(headers[i]);
    if (key.length > 0) {
      keys.push(key);
    }
  }
  return keys;
}

// Normalizes a string, by removing all alphanumeric characters and using mixed case
// to separate words. The output will always start with a lower case letter.
// This function is designed to produce JavaScript object property names.
// Arguments:
//   - header: string to normalize
// Examples:
//   "First Name" -> "firstName"
//   "Market Cap (millions) -> "marketCapMillions
//   "1 number at the beginning is ignored" -> "numberAtTheBeginningIsIgnored"
function normalizeHeader(header) {
  var key = "";
  var upperCase = false;
  for (var i = 0; i < header.length; ++i) {
    var letter = header[i];
    if (letter == " " && key.length > 0) {
      upperCase = true;
      continue;
    }
    if (!isAlnum(letter)) {
      continue;
    }
    if (key.length == 0 && isDigit(letter)) {
      continue; // first character must be a letter
    }
    if (upperCase) {
      upperCase = false;
      key += letter.toUpperCase();
    } else {
      key += letter.toLowerCase();
    }
  }
  return key;
}

// Returns true if the cell where cellData was read from is empty.
// Arguments:
//   - cellData: string
function isCellEmpty(cellData) {
  return typeof(cellData) == "string" && cellData == "";
}

// Returns true if the character char is alphabetical, false otherwise.
function isAlnum(char) {
  return char >= 'A' && char <= 'Z' ||
    char >= 'a' && char <= 'z' ||
    isDigit(char);
}

// Returns true if the character char is a digit, false otherwise.
function isDigit(char) {
  return char >= '0' && char <= '9';
}



function defineSettings() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheets = ss.getSheets();
  var app = UiApp.createApplication().setTitle("Step 1: Define Source Sheet Settings").setHeight(600);
  var panel = app.createVerticalPanel().setId("settingsPanel");
  var gridPanel = app.createScrollPanel().setHeight("220px").setWidth("100%").setStyleAttribute("overflow", "scroll");
  var grid = app.createGrid(1,1).setId("checkBoxGrid");
  var sheetLabel = app.createLabel().setText("Choose the sheet that you want the script to use as a data source for merged emails and/or calendar events.");
  sheetLabel.setStyleAttribute("background", "#E5E5E5").setStyleAttribute("marginTop", "20px").setStyleAttribute("padding", "5px");
  var sheetChooser = app.createListBox().setId("sheetChooser").setName("sheet");
    for (var i=0; i<sheets.length; i++) {
      if ((!sheets[i].getName().match("Template"))&&(!sheets[i].getName().match("Read Me"))) {
      sheetChooser.addItem(sheets[i].getSheetName());   
      }
    }
   if (ScriptProperties.getProperty('sheetName')) {
   var sheetName = ScriptProperties.getProperty('sheetName');
   }
  if (sheetName) {
    var sheetIndex = getSheetIndex(sheetName);
    sheetChooser.setSelectedIndex(sheetIndex);
  }
  
  var caseNoSetting = ScriptProperties.getProperty('caseNoSetting'); 
  var caseNoCheckBox = app.createCheckBox().setId("caseNoCheckBox").setName("caseNoSetting").setText("Auto-create a unique case number for each form submission (optional)")
  if (caseNoSetting=="true") {
   caseNoCheckBox.setValue(true);
  }
  var helpPopup = app.createDecoratedPopupPanel();
  var fieldsLabel = app.createLabel().setText("Note: This script is typically installed on a sheet already containing headers for a Google Form.  See the \"Read Me\" tab in this spreadsheet or visit http://www.youpd.org/formmule for more information about how to use it.  Come back to this step and re-save your settings once you have finalized your Google Form.");                                             

                                              
  setGrid(app);
  var sheetChooserServerHandler = app.createServerHandler('refreshGrid').addCallbackElement(panel);
  var sheetChooserClientHandler = app.createClientHandler().forTargets(grid)
  sheetChooser.addChangeHandler(sheetChooserServerHandler).addChangeHandler(sheetChooserClientHandler);
  
  helpPopup.add(fieldsLabel);
  panel.add(helpPopup);
  panel.add(sheetLabel);
  panel.add(sheetChooser);
  panel.add(caseNoCheckBox);
  
  var label = app.createLabel("Optional: Select any columns that contain formulas you want copied down when new form submissions come in. Only columns not associated with Google Form fields should show up below. Once selected columns have saved, the master formula cells will have a yellow backgound and a note to remind you not to delete them.  Use test data in row 2 to tweak your master formulas. Adding questions to your Google Form is not recommended once this script is set up. When deleting a custom column, de-select it here and save before deleting it in the sheet.  If \"Dummy Headers\" show up below, it\'s because the script was unable to find any headers in the top sheet.");
  label.setStyleAttribute("background", "#E5E5E5").setStyleAttribute("marginTop", "20px").setStyleAttribute("padding", "5px");
  panel.add(label);
  gridPanel.add(grid);
  panel.add(gridPanel);
  app.add(panel);
  this.ss.show(app);
}

function saveSettings(e) {
  var app = UiApp.getActiveApplication();
  var oldSheetName = ScriptProperties.getProperty('sheetName');
  var sheetName = e.parameter.sheet;
  ScriptProperties.setProperty('sheetName', sheetName);
  var sheet = ss.getSheetByName(sheetName);
  var lastCol = sheet.getLastColumn();
  ScriptProperties.setProperty('numCols', lastCol);
  if (lastCol==0) { 
    Browser.msgBox("You have no headers in your data sheet. Please fix this and come back."); 
    defineSettings();
    app.close();
    return app; 
  }
  
  var caseNoSetting = e.parameter.caseNoSetting;
  ScriptProperties.setProperty('caseNoSetting', caseNoSetting);
  
  var caseNo = ScriptProperties.getProperty('caseNo');
  
  var sheet = ss.getSheetByName(sheetName);
  var dataSheet = ss.getSheetByName(sheetName);
  
  var dataRange = dataSheet.getRange(2, 1, dataSheet.getMaxRows() - 1, 4);
  var lastHeader = dataSheet.getRange(1, dataSheet.getLastColumn());
  var lastHeaderValue = normalizeHeader(lastHeader.getValue());  
  var secondToLastHeader = dataSheet.getRange(1, dataSheet.getLastColumn()-1);
  var secondToLasCol = dataSheet.getLastColumn()-1;
  var secondToLastHeaderValue = normalizeHeader(secondToLastHeader.getValue());  
  
  if (caseNoSetting=="true") {
  if ((secondToLastHeaderValue != "caseNo")&&(lastHeaderValue != "status")) {
    dataSheet.insertColumnAfter(dataSheet.getLastColumn());
    dataSheet.getRange(1,dataSheet.getLastColumn()+1).setBackground("orange").setFontColor("black").setValue("Case No").setComment("Don't change the name of this column. Must remain the 2nd to last column.");
    dataSheet.getRange(2,dataSheet.getLastColumn()).setBackground("orange").setFontColor("black").setValue(assignCaseNo("0"));
    var newLastCol = sheet.getLastColumn();
    ScriptProperties.setProperty('numCols', newLastCol);
  }
  
  if ((secondToLastHeaderValue != "caseNo")&&(lastHeaderValue = "status")) {
    dataSheet.insertColumnAfter(dataSheet.getLastColumn());
    dataSheet.getRange(1,dataSheet.getLastColumn()).setBackground("orange").setFontColor("black").setValue("Case No").setComment("Don't change the name of this column. Must remain the 2nd to last column.");
    dataSheet.getRange(2,dataSheet.getLastColumn()).setBackground("orange").setFontColor("black").setValue(assignCaseNo());
    var newLastCol = sheet.getLastColumn();
    ScriptProperties.setProperty('numCols', newLastCol);
  }
  }
  
  if ((caseNoSetting=="false")&&(lastHeaderValue = "status")) {
    if ((secondToLastHeaderValue == "caseNo")) {
    dataSheet.deleteColumn(dataSheet.getLastColumn()-1);
    var newLastCol = sheet.getLastColumn();
    ScriptProperties.setProperty('numCols', newLastCol);
    }
  }
  
  var oldSheet = ss.getSheetByName(oldSheetName);
  var lastCol = sheet.getLastColumn();
  var range = sheet.getRange(1, 1, 1, lastCol);
  var headers = range.getValues();
  if ((oldSheetName)&&(oldSheetName!=sheetName)) {
    var unsetFlag = true;
  }
  var colSettings = [];
  if ((unsetFlag==true)&&(oldSheet)) {
    var oldLastCol = oldSheet.getLastColumn();
    var oldRange = oldSheet.getRange(2, 1, 1, oldLastCol).setBackgroundColor("white").setComment('');
  }
  
  dataRange = dataSheet.getRange(2, 1, dataSheet.getMaxRows() - 1, 4);
  lastHeader = dataSheet.getRange(1, dataSheet.getLastColumn());
  lastHeaderValue = normalizeHeader(lastHeader.getValue());  
  if (lastHeaderValue != "status") {
    dataSheet.insertColumnAfter(dataSheet.getLastColumn());
    dataSheet.getRange(1,dataSheet.getLastColumn()+1).setBackground("black").setFontColor("white").setValue("Status").setComment("Don't change the name of this column. Must remain the last column.");
    dataSheet.getRange(2,dataSheet.getLastColumn()).setBackground("black").setFontColor("white").setValue("N/A: This is the formula row.");
    var newLastCol = sheet.getLastColumn();
    ScriptProperties.setProperty('numCols', newLastCol);
  }
  
  for (var i=0; i<headers[0].length; i++) {
    colSettings[i] = e.parameter["checkBoxValue-"+i];
    if (e.parameter["checkBoxValue-"+i]=="true") {
      var cellRange = sheet.getRange(2, i+1);
      cellRange.setBackground("yellow");
      cellRange.setComment("This cell's value or formula will be copied into any new rows that are added by a form.");
    }
    if ((e.parameter["checkBoxValue-"+i]=="false")&&(i!=headers[0].length-1)) {
      var cellRange = sheet.getRange(2, i+1);
      cellRange.setBackground("white").setComment('');
    }
   }
  lockFormulaRow();
  ScriptProperties.setProperty('colSettings', colSettings.join());
  var sheetName = ScriptProperties.getProperty('sheetName');
  if ((sheetName)&&(!(oldSheetName))) {
    Browser.msgBox('Auto-email and auto-calendar-event options are now available in the formMule menu');
  }
  onOpen();
  app.close()
  return app;
}

function setGrid(app) {
  var grid = app.getElementById("checkBoxGrid");  
  var panel = app.getElementById("settingsPanel");
  var sheetName = ScriptProperties.getProperty("sheetName");
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.getSheets()[0];
  }
  var lastCol = sheet.getLastColumn();
  if (lastCol==0) { 
    var dummyheaders = [["Dummy Header 1", "Dummy Header 2", "Dummy Header 3"]];
    var range = sheet.getRange(1, 1, 1, 3).setValues(dummyheaders);
    lastCol = sheet.getLastColumn();
  }
  var range = sheet.getRange(1, 1, 1, lastCol);
  var headers = range.getValues();
  grid.resize(headers[0].length+1, 1);
  var colSettings = ScriptProperties.getProperty('colSettings');
  if ((colSettings)&&(colSettings!='')) {
  colSettings = colSettings.split(",");
  }
  for (var i=0; i<headers[0].length; i++) {
    var checkBox = app.createCheckBox().setText(headers[0][i]).setName("checkBoxValue-"+i).setId("checkBox-"+i);
    var cell = sheet.getRange(1, i+1);
    if (colSettings) {
      if (colSettings[i]=="true") {
        checkBox.setValue(true);
      }
    }
    if ((cell.getBackground()=="#DDDDDD")||(cell.getBackground()=="black")||(cell.getBackground()=="orange")) { checkBox.setVisible(false).setValue(false); }
    grid.setWidget(i,0, checkBox); 
  }
  var buttonHandler = app.createServerClickHandler('saveSettings').addCallbackElement(panel);
  var button = app.createButton("Save settings", buttonHandler).setId('saveButton');
  grid.setWidget(headers[0].length, 0, button);
  return app;
}

function getSheetIndex(sheetName) {
  var app = UiApp.getActiveApplication();
  var sheets = ss.getSheets();
  var bump = 0;
  for (var i=0; i<sheets.length; i++) {
    if (sheets[i].getName()==sheetName) {
     var index = i;
     break;
    }
     if ((sheets[i].getName()== "Read Me")||(sheets[i].getName()=="Email1 Template")||(sheets[i].getName()== "Email2 Template")||(sheets[i].getName()=="Email3 Template"))  {
        bump = bump-1;
     }
    index = 0;
  }
index = index+bump;
return index;
}

function refreshGrid (e) {
  var app = UiApp.getActiveApplication();
  var panel = app.getElementById('settingsPanel');
  var button = app.getElementById('saveButton')
  var grid = app.getElementById("checkBoxGrid");
  var sheetName = e.parameter.sheet;
  var sheet = ss.getSheetByName(sheetName);
  var lastCol = sheet.getLastColumn();
  var range = sheet.getRange(1, 1, 1, lastCol);
  var headers = range.getValues();
  grid.resize(headers[0].length+1, 1);
  for (var i=0; i<headers[0].length; i++) {
    var checkBox = app.createCheckBox().setText(headers[0][i]).setName("checkBoxValue-"+i).setId("checkBox-"+i);
    var cell = sheet.getRange(1, i+1);
    if ((cell.getBackground()=="#DDDDDD")||(cell.getBackground()=="black")||(cell.getBackground()=="orange")) { checkBox.setVisible(false); }
    grid.setWidget(i,0, checkBox); 
   }
  grid.setWidget(headers[0].length, 0, button);
  return app;
}