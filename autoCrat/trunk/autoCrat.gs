var scriptTitle = "autoCrat Script V2.4 (5/29/12)";
// Written by Andrew Stillman for New Visions for Public Schools
// Published under GNU General Public License, version 3 (GPL-3.0)
// See restrictions at http://www.opensource.org/licenses/gpl-3.0.html
// Support and contact at http://www.youpd.org/autocrat

var AUTOCRATIMAGEURL = 'https://c04a7a5e-a-3ab37ab8-s-sites.googlegroups.com/a/newvisions.org/data-dashboard/searchable-docs-collection/autoCrat_icon.gif?attachauth=ANoY7crV8whTTm4tyWEhFrNIM8Yt6RdYthydKlFA4gpIovpihpZdsviIZ0_D42FJXHSxpZnRFyJdSj7iCS5KMTjv9VYHGfctNojT3Tckh2zJHB5AlEwZIqj2uYdKPz8Zl6JtsUTWIYzLCoCxM-NvPWlji1fL9LGjIx1e-AKmz6qnxq2K_rC9zCiENHHaap9Lyq9W4umEoeYWtqWykApce9wtLXhFYEJ7uLN65vLGDKl5Ao5OHwyTG3COIIij-qsufuMjFr2WtHAK&attredirects=0';

var ss = SpreadsheetApp.getActive();

function onInstall() {
  onOpen();
}


//onOpen is part of the Google Apps Script library.  It runs whenever the spreadsheet is opened.  
//Adds script menu to the spreadsheet
//Sometimes this seems not to run by itself when the script is installed
//and needs to be run manually the first time to prompt script authorization.

function onOpen() {
  var menuEntries = [];
      menuEntries.push({name: "What is autoCrat?", functionName: "whatIs"});
      menuEntries.push({name: "Launch merge setup", functionName: "initialize"});
  ss.addMenu("autoCrat", menuEntries);
  if (ScriptProperties.getProperty('fileId')) {
    initialize();
  }
}


//This function is responsible for configuring the script upon first install.  
//Subsequently, adds the menu of dropdown items based on previous actions by the user, as stored in script properties.
function initialize() {
  setAutocratUid();
  var menuEntries = [];
  menuEntries.push({name: "What is autoCrat?", functionName: "whatIs"});
  menuEntries.push({name: "Step 1: Select Data Source and Template Doc", functionName: "defineSettings"});
  var sheetName = ScriptProperties.getProperty('sheetName');
  var fileId = ScriptProperties.getProperty('fileId');
  var mappingString = ScriptProperties.getProperty('mappingString');
  var fileSetting = ScriptProperties.getProperty('fileSetting');
  var emailSetting = ScriptProperties.getProperty('emailSetting');
   if ((sheetName)&&(!sheetName=="")) {
     menuEntries.push({name: "Step 2: Set Merge Conditions", functionName: "setMergeConditions"});
  }
  if ((fileId)&&(!fileId=="")) {
    menuEntries.push({name: "Step 3: Set Field Mappings", functionName: "mapFields"});
  }
  if ((fileId)&&(!fileId=="")&&(mappingString)&&(!mappingString=="")) { 
    menuEntries.push({name: "Step 4: Set Merge Type", functionName: "runMergeConsole"});
  }
  if (((fileSetting)||(emailSetting))&&(mappingString)&&(!mappingString=="")) { 
    menuEntries.push({name: "Step 5: Run Merge", functionName: "runMergePrompt"});
  }
  
  ss.addMenu("autoCrat", menuEntries);
 
  
  //ensure readme sheets exist.  If not, install it and set as active sheet.
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
   var sheet = ss.getSheetByName("Read Me");
   ss.setActiveSheet(sheet);
 }
 if (!(fileId)) {
    defineSettings();
  }
}


//Function used to create contents of "Read Me" sheet
function setReadMeText() {
 var ss = SpreadsheetApp.getActiveSpreadsheet();
 var sheet = ss.getSheetByName("Read Me");
 sheet.insertImage('http://www.youpd.org/sites/default/files/acquia_commons_logo36.png', 1, 1);
 sheet.setRowHeight(1, 100);
 sheet.setColumnWidth(1, 700);
 var readMeText = "Installation and configuration steps...looks hard, but it's really not bad, I promise.  Almost everything you need to do with this script is done through a custom GUI!";
 readMeText += "\n \n In order for the script to work, you will need to create a Document to use as a template for the merge.";
 readMeText += "\n \n First create a new collection for your templates.  I like to create a collection called \"Merge Templates\"";
 readMeText += "\n \n Next create a template Document. Include double bracketed tags for any personalized data you want to populate from the spreadsheet.  Ex) <<First Name>> .  IMPORTANT: Do not use any non-alphanumeric characters in your tags. Other than that, it doesn't matter what you call the fields, because you will map them to your spreadsheet headers in a few steps. Be sure to add your document to your Templates collection.";
 readMeText += "\n \n If you've installed and authorized the script, you should see a new menu item to the right of \"Help\", called \"Document Merge.\"  If you don't see it, try running the onOpen function from the script editor (Tools->Script Editor->Run->onOpen.";
 readMeText += "\n \n In the \"Document Merge\" menu, select \"Select data source and template doc\" and complete the settings.  If you don't have a collection that contains a template file with <<Merge tags>> in it, go back and do this first.";
 readMeText += "\n \n You will next be prompted to \"Set Merge Conditions,\" which means you have the option to require a match to a value in a particular field of your source data before a given row will be merged.  Leaving this setting blank will cause it to be ignored.";
 readMeText += "\n \n Now you will see a new \"Document Merge\" dropdown item, \"Set Field Mappings.\"  Map each <<Merge tag>> to the spreadsheet column you want to use to populate it.  Save the mappings.";
 readMeText += "\n \n Another new \"Document Merge\" dropdown item will appear: \"Test/Run Merge\".  Select it and decide what type of merge you want to try...there are a number of combos and cool possibilities.  Look to the bottom of the panel for a clue as to the $variableNames that are available for any of the fields you want to populate dynamically per row.";
 readMeText += "\n \n Here are some basic options to play with.  Checkbox allows you to test on first-row only if you like.";
 readMeText += "\n \n * ONLY saving merged Docs to a collection, either as PDF or Doc format."
 readMeText += "\n \n * Saving to a collection AND emailing PDF as attachment.";
 readMeText += "\n \n * Saving to a collection AND emailing recipient a link to individually shared Docs as View-only";
 readMeText += "\n \n * Saving to a collection AND emailing recipient a link to individually shared Doc as Editor";
 readMeText += "\n \n For date formatting to be handled in a merge field, you must use the Format->Number menu from the spreadsheet to format any dates.  Currently only three formats are supported:   \"M/d/yyyy\", \"MMMM d, yyyy\", and \"M/d/yyyy H:mm:ss\" ... i.e. 1/30/2012...January 30, 2012, and 1/30/2012 9:32:34.";
 readMeText += "\n \n The document Header and Footer can also contain merge tags!"; 
 sheet.getRange("A2").setValue(this.scriptTitle).setFontSize(18);
 sheet.getRange("A3").setValue("Support available at http://www.youpd.org/autocrat");
 sheet.getRange("A4").setValue(readMeText);
}

function setFormTrigger() {
  var ssKey = SpreadsheetApp.getActiveSpreadsheet().getId();
  ScriptApp.newTrigger('onFormSubmit').forSpreadsheet(ssKey).onFormSubmit().create();
}

//onSubmit is part of the Google Apps Script library.  It runs whenever a Google Form is submitted.  
//Checks to see if a merge method has been set and the "trigger on form submit" option has been saved in the
//and fires off the merge.  
//Note that the merge will only execute for a record if there is no value in the "Merge Status."
//Code for handling this condition is in the runMerge function

function onFormSubmit() {
  var ss = SpreadsheetApp.getActive();
  var formTrigger = ScriptProperties.getProperty('formTrigger');
  var fileSetting = ScriptProperties.getProperty('fileSetting');
  var emailSetting = ScriptProperties.getProperty('emailSetting');
  if ((formTrigger == "true")&&(fileSetting == "true") || (formTrigger == "true")&&(emailSetting == "true")) {
  runMerge();
  }
}


//Function to handle the creation of the "Test/Run Merge" GUI panel.

function runMergeConsole() {
  var app = UiApp.createApplication();
  app.setTitle("Step 4: Set Merge Type");
  app.setHeight("500");
 
var fileId = ScriptProperties.getProperty('fileId');
  if (!fileId) { 
       Browser.msgBox("You must select a template file before you can run a merge.");
       defineSettings();
       return;
       }
  var mappingString = ScriptProperties.getProperty('mappingString');
  if (!mappingString) {
       Browser.msgBox("You must map document fields before you can run a merge.");
       mapFields();
       return;
       }

  var sheetName = ScriptProperties.getProperty('sheetName');
  if (!sheetName) {
       Browser.msgBox("You must select a source data sheet before you can run a merge.");
       defineSettings();
       return;
       }

 //create spinner graphic to show upon button click awaiting merge completion
  var refreshPanel = app.createFlowPanel();
  refreshPanel.setId('refreshPanel');
  refreshPanel.setStyleAttribute("width", "100%");
  refreshPanel.setStyleAttribute("height", "500px");
  refreshPanel.setVisible(false);

//Adds the graphic for the waiting period before merge completion. Set invisible until client handler
//is called by button click 
  var spinner = app.createImage('https://5079980847011989849-a-1802744773732722657-s-sites.googlegroups.com/site/scriptsexamples/ProgressSpinner.gif');
  spinner.setStyleAttribute("opacity", "1");
  spinner.setStyleAttribute("position", "absolute");
  spinner.setStyleAttribute("top", "220px");
  spinner.setStyleAttribute("left", "220px");
  spinner.setId("dialogspinner");
  refreshPanel.add(spinner);

// Build the panel
  var panel = app.createVerticalPanel().setId("fieldMappingPanel");
  var varScrollPanel = app.createScrollPanel().setHeight("150px").setStyleAttribute('backgroundColor', 'whiteSmoke');
  var scrollPanel = app.createScrollPanel().setHeight("350px");
  panel.setStyleAttribute("width", "100%");
  var folderLabel = app.createLabel().setId("folderLabel").setWidth("100%");
  folderLabel.setText("Select the destination folder for your merged documents").setStyleAttribute("clear","right");
  var folderListBox = app.createListBox().setName("destinationFolderName").setId("destFolderListBox");
  folderListBox.addItem('Select destination folder').setStyleAttribute("clear","right");

  
// Build listbox for folder destination options.  Limit to first 20 folders to avoid
// Google server errors.
  var folders = DocsList.getFolders(0,20);
  for (var i = 0; i<folders.length; i++) {
    var name = folders[i].getName();
    folderListBox.addItem(name);
  }
  
  var fileToFolderCheckBox = app.createCheckBox().setId("fileToFolderCheckBox").setName("fileToFolderCheckValue");
  fileToFolderCheckBox.setText("Save merged files to Docs").setStyleAttribute("clear","right");;

  var fileToFolderCheckBoxFalse = app.createCheckBox().setId("fileToFolderCheckBoxFalse").setName("fileToFolderCheckValueFalse").setVisible(false);
  fileToFolderCheckBoxFalse.setText("Save merged files to Docs").setVisible(false).setStyleAttribute("clear","right"); 

   
  //Preset to previously used folder value if it exists
  var destinationFolderId = ScriptProperties.getProperty('destinationFolderId');
  if (destinationFolderId) {
      //getFolderIndex is a custom built function that looks up where the saved folder is in the list
      var index = getFolderIndex(destinationFolderId)+1;
      folderListBox.setItemSelected(index, true);
      }
  
  //build the rest of the panel field and checkboxes.  
  //Checks for pre-set values in Script Properties and pre-populates fields  
  var fileNameLabel = app.createLabel().setId("fileNameLabel");
  var fileNameStringBox = app.createTextBox().setId("fileNameString").setName('fileNameString');
  fileNameStringBox.setWidth("100%");
  var fileNameStringValue = ScriptProperties.getProperty('fileNameString');
  if (fileNameStringValue) {
    fileNameStringBox.setValue(fileNameStringValue);
  }
  var fileNameHelpLabel = app.createLabel().setId("fileNameHelpLabel");
  var sheetName = ScriptProperties.getProperty('sheetName');
  var sheetFieldNames = fetchSheetHeaders(sheetName);
  var normalizedSheetFieldNames = normalizeHeaders(sheetFieldNames);
  var fileNameHelpText = "This setting determines the file name for each merged document.";
  fileNameLabel.setText("File naming convention to use:");
  fileNameHelpLabel.setText(fileNameHelpText);
  fileNameHelpLabel.setStyleAttribute("color","grey");
  var fileTypeLabel = app.createLabel().setText("Select the file type you want to create");
  var fileTypeSelectBox = app.createListBox().setId("fileTypeSelectBox").setName("fileType");
  fileTypeSelectBox.addItem("Google Doc")
                   .addItem("PDF");
  var fileType = ScriptProperties.getProperty('fileType');
  if (fileType=='Google Doc') {
     fileTypeSelectBox.setSelectedIndex(0);
  }
  if (fileType=='PDF') {
     fileTypeSelectBox.setSelectedIndex(1);
  } 
  var linkCheckBox = app.createCheckBox('Save links to merged Docs in spreadsheet').setId('linkToDoc').setName('linkToDoc');
  var linkToDoc = ScriptProperties.getProperty('linkToDoc');
  if (linkToDoc=="true") {
    linkCheckBox.setValue(true);
  }
  var fileId = ScriptProperties.getProperty("fileId");
  var sheetName = ScriptProperties.getProperty("sheetName");
  var mappingString = ScriptProperties.getProperty("mappingString");
  
  //add server and client handlers and callbacks to button
  var saveRunSettingsHandler = app.createServerHandler('saveRunSettings').addCallbackElement(panel);
  var spinnerHandler = app.createClientHandler().forTargets(refreshPanel).setVisible(true).forTargets(panel).setVisible(false);
  var button = app.createButton().setId("runMergeButton").addClickHandler(saveRunSettingsHandler);
  button.addClickHandler(spinnerHandler);
  button.setText("Save Settings");

  /*check for pre-existing values and preset checkbox and visibilities accordingly
   checkboxes fire off client handlers to make sub-panels visible when checked
   Below is a bit of ridiculous javascript trickery to work around the dire limitations
   of checkbox handlers, which don't allow for checked-unchecked 
   state to be recognized by the handler...hint, hint Googlers.
   The solution is to create two checkboxes, one for the "checked" state and one for the "unchecked"
   and fire a different handler, alternately hiding one of the two checkboxes and using
   server handlers to reset their checked status.
   The user only ever sees one checkbox
  */
  
  var fileSetting = ScriptProperties.getProperty('fileSetting');
  var fileInfoPanel = app.createVerticalPanel().setId("fileInfoPanel");
   if (fileSetting=="true") {
     fileToFolderCheckBox.setVisible(true).setValue(true);
     fileToFolderCheckBoxFalse.setVisible(false).setValue(true);
     fileInfoPanel.setVisible(true);
  } else {
    fileToFolderCheckBox.setVisible(false).setValue(false);
    fileToFolderCheckBoxFalse.setVisible(true).setValue(false);
    fileInfoPanel.setVisible(false);
  } 


  var fileToEmailCheckBox = app.createCheckBox().setId("fileToEmailCheckBox").setName("fileToEmailCheckValue");
  fileToEmailCheckBox.setText("Send merged files via Email").setEnabled(false);

  var fileToEmailCheckBoxFalse = app.createCheckBox().setId("fileToEmailCheckBoxFalse").setName("fileToEmailCheckValueFalse").setVisible(false);
  fileToEmailCheckBoxFalse.setText("Email and/or share merged documents").setVisible(false); 

  var emailLabel = app.createLabel().setId("emailRecipientsLabel");
  emailLabel.setText("Recepient email addresses:");

  var emailStringBox = app.createTextBox().setId("emailStringBox").setName('emailString');
  emailStringBox.setWidth("100%");
  var emailStringValue = ScriptProperties.getProperty('emailString');
  if (emailStringValue) {
    emailStringBox.setValue(emailStringValue);
  }

  var emailHelpLabel = app.createLabel().setId("emailHelpLabel");
  var emailHelpText = "Emails must be separated by commas.";
  emailHelpLabel.setText(emailHelpText);
  emailHelpLabel.setStyleAttribute("color","grey");

  var emailSubjectLabel = app.createLabel().setText('Email subject:');
 
  var emailSubjectBox = app.createTextBox().setId("emailSubjectBox").setName("emailSubject");
  emailSubjectBox.setWidth("100%");
  var emailSubjectPreset =ScriptProperties.getProperty('emailSubject');
  if (emailSubjectPreset) {
     emailSubjectBox.setValue(emailSubjectPreset);
  } 
  
  var bodyPrefixHelpLabel = app.createLabel().setId("bodyPrefixLabel").setText('Short note to recipients:');
  var bodyPrefixTextArea = app.createTextArea().setId("bodyPrefixTextArea").setName("bodyPrefix");
  bodyPrefixTextArea.setHeight("75px").setWidth("100%");
  
  var bodyPrefix = ScriptProperties.getProperty('bodyPrefix');
  if (bodyPrefix != null) {
  bodyPrefixTextArea.setValue(bodyPrefix);
  }
  var emailAttachmentLabel = app.createLabel().setText("Attachment type:");
  var emailAttachmentListBox = app.createListBox().setId("emailAttachmentListBox").setName("emailAttachment");
  emailAttachmentListBox.addItem("PDF")
                        .addItem("Recipient-view-only Google Doc")
                        .addItem("Recipient-editable Google Doc");
  var emailInfoPanel = app.createVerticalPanel().setId("emailInfoPanel");
  
  var attachmentPreset = ScriptProperties.getProperty('emailAttachment');

  if(attachmentPreset) {
  switch (attachmentPreset) {
    case "PDF":
      emailAttachmentListBox.setSelectedIndex(0);
      break;
    case "Recipient-view-only Google Doc":
      emailAttachmentListBox.setSelectedIndex(1);
      break;
    case "Recipient-editable Google Doc":
      emailAttachmentListBox.setSelectedIndex(2);
      break;
    default:
      emailAttachmentListBox.setSelectedIndex(0);
  }
}

//check for pre-existing value and preset checkbox and visibilities accordingly
  var emailSetting = ScriptProperties.getProperty('emailSetting');
  var emailInfoPanel = app.createVerticalPanel().setId("emailInfoPanel");
   if (emailSetting=="true") {
     fileToEmailCheckBox.setVisible(true).setValue(true);
     fileToEmailCheckBoxFalse.setVisible(false).setValue(true);
     emailInfoPanel.setVisible(true);
  } else {
    fileToEmailCheckBox.setVisible(false).setValue(false);
    fileToEmailCheckBoxFalse.setVisible(true).setValue(false);
    emailInfoPanel.setVisible(false);
  }


// more crazy trickery for checkboxes
  
 var fileUnCheckHandler = app.createClientHandler().forTargets(fileToFolderCheckBox, fileInfoPanel).setVisible(false)
                                                    .forTargets(fileToFolderCheckBoxFalse).setVisible(true)
                                                    .forTargets(fileToEmailCheckBox).setEnabled(false)
                                                    .forTargets(fileToEmailCheckBoxFalse).setEnabled(false)
  var unSetCheck = app.createServerHandler('unsetFileCheck').addCallbackElement(fileToFolderCheckBox);
  var fileCheckHandler = app.createClientHandler().forTargets(fileToFolderCheckBox, fileInfoPanel).setVisible(true)
                                                  .forTargets(fileToFolderCheckBoxFalse).setVisible(false)
                                                  .forTargets(fileToEmailCheckBoxFalse).setEnabled(true)
                                                  .forTargets(fileToEmailCheckBox).setEnabled(true);
  var setCheck = app.createServerHandler('setFileCheck').addCallbackElement(fileToFolderCheckBox);
  
  fileToFolderCheckBox.addClickHandler(unSetCheck).addClickHandler(fileUnCheckHandler);
  fileToFolderCheckBoxFalse.addClickHandler(fileCheckHandler).addClickHandler(setCheck);
  
  fileInfoPanel.setStyleAttribute("width","100%");
  fileInfoPanel.setStyleAttribute("backgroundColor","#F5F5F5");
  fileInfoPanel.setStyleAttribute("padding","5px");
  fileInfoPanel.add(folderLabel);
  fileInfoPanel.add(folderListBox);
  fileInfoPanel.add(fileNameLabel);
  fileInfoPanel.add(fileNameStringBox);
  fileInfoPanel.add(fileNameHelpLabel);
  fileInfoPanel.add(fileTypeLabel);
  fileInfoPanel.add(fileTypeSelectBox);
  fileInfoPanel.add(linkCheckBox);
  
  app.add(refreshPanel);
  panel.add(fileToFolderCheckBox); 
  panel.add(fileToFolderCheckBoxFalse);
  panel.add(fileInfoPanel);


 
  var emailUnCheckHandler = app.createClientHandler().forTargets(fileToEmailCheckBox, emailInfoPanel).setVisible(false)
                                                    .forTargets(fileToEmailCheckBoxFalse).setVisible(true);
  var emailUnSetCheck = app.createServerHandler('unSetEmailCheck').addCallbackElement(fileToEmailCheckBox);
  var emailCheckHandler = app.createClientHandler().forTargets(fileToEmailCheckBox, emailInfoPanel).setVisible(true)
                                                  .forTargets(fileToEmailCheckBoxFalse).setVisible(false);
  var emailSetCheck = app.createServerHandler('setEmailCheck').addCallbackElement(fileToEmailCheckBox);
  
  fileToEmailCheckBox.addClickHandler(emailUnSetCheck).addClickHandler(emailUnCheckHandler);
  fileToEmailCheckBoxFalse.addClickHandler(emailCheckHandler).addClickHandler(emailSetCheck);

  if ((fileSetting == "false")||(!fileSetting)) {
  fileToEmailCheckBox.setEnabled(false).setValue(false);
  fileToEmailCheckBoxFalse.setEnabled(false).setValue(false);
  }

  if (fileSetting == "true") {
  fileToEmailCheckBox.setEnabled(true);
  fileToEmailCheckBoxFalse.setEnabled(true);
  }
  
  emailInfoPanel.setStyleAttribute("width","100%");
  emailInfoPanel.setStyleAttribute("backgroundColor","#F5F5F5");
  emailInfoPanel.setStyleAttribute("padding","5px");
  emailInfoPanel.add(emailLabel);
  emailInfoPanel.add(emailStringBox);
  emailInfoPanel.add(emailHelpLabel);
  emailInfoPanel.add(emailSubjectLabel);
  emailInfoPanel.add(emailSubjectBox);
  emailInfoPanel.add(bodyPrefixHelpLabel);
  emailInfoPanel.add(bodyPrefixTextArea);
  emailInfoPanel.add(emailAttachmentLabel);
  emailInfoPanel.add(emailAttachmentListBox);

  var formTrigger = ScriptProperties.getProperty('formTrigger');
  var mergeTriggerCheckBox = app.createCheckBox().setText("Trigger merge on form submit").setName("formTrigger");
  if (formTrigger=="true") {
    mergeTriggerCheckBox.setValue(true);
  }
  var testOnly = ScriptProperties.getProperty('testOnly');
  var mergeTestCheckBox = app.createCheckBox().setText("Test merge on first data row only").setName("testOnly");
  if (testOnly=="true") {
    mergeTestCheckBox.setValue(true);
  }

  panel.add(fileToEmailCheckBox); 
  panel.add(fileToEmailCheckBoxFalse);
  panel.add(emailInfoPanel);
  panel.add(mergeTriggerCheckBox);
  panel.add(mergeTestCheckBox);

  panel.add(button);

  //Help text below dynamically loads all field names from the sheet using normalized (camelCase) sheet headers
  var fieldHelpText = "Use these variables to include values from the spreadsheet in any of the fields below.";
  var fieldHelpLabel = app.createLabel().setText(fieldHelpText);
  var fieldHelpTable = app.createFlexTable();
  fieldHelpTable.setWidget(0, 0, app.createLabel("$currDate (adds the current date in mm.dd.yy format)")).setStyleAttribute('color', 'blue');
  for (var i = 0; i<normalizedSheetFieldNames.length; i++) {
    var variable = app.createLabel("$"+normalizedSheetFieldNames[i]).setStyleAttribute('color', 'blue');
    fieldHelpTable.setWidget(i+1, 0, variable)
  }
  var instructions = app.createLabel().setText("Note: Merge will only execute for rows with no entry in the \"Merge Status\" column, and that meet any \"Merge conditions\" you may have set.");
  instructions.setStyleAttribute("font-weight", "bold");
  
  panel.add(instructions);
  app.add(fieldHelpLabel);
  varScrollPanel.add(fieldHelpTable);
  scrollPanel.add(panel);
  app.add(varScrollPanel);
  app.add(refreshPanel);
  app.add(scrollPanel);
  this.ss.show(app);
}

// Nutty server handler to always uncheck the ghost checkbox that shows only when true checkbox is clicked

function unSetEmailCheck () {
var app = UiApp.getActiveApplication();
var fileToEmailCheckBox = app.getElementById('fileToEmailCheckBox');
fileToEmailCheckBox.setValue(false);
var fileToEmailCheckBoxFalse = app.getElementById('fileToEmailCheckBoxFalse');
fileToEmailCheckBoxFalse.setValue(false);
return app;
}

// Nutty server handler to always uncheck the ghost checkbox that shows only when false checkbox is clicked

function setEmailCheck () {
var app = UiApp.getActiveApplication();
var fileToEmailCheckBox = app.getElementById('fileToEmailCheckBox');
fileToEmailCheckBox.setValue(true);
var fileToEmailCheckBoxFalse = app.getElementById('fileToEmailCheckBoxFalse');
fileToEmailCheckBoxFalse.setValue(false);
return app;
}

// More of the same craziness

function unsetFileCheck () {
var app = UiApp.getActiveApplication();
var fileToFolderCheckBox = app.getElementById('fileToFolderCheckBox');
fileToFolderCheckBox.setValue(false);
var fileToFolderCheckBoxFalse = app.getElementById('fileToFolderCheckBoxFalse');
fileToFolderCheckBoxFalse.setValue(false);
return app;
}

function setFileCheck () {
var app = UiApp.getActiveApplication();
var fileToFolderCheckBox = app.getElementById('fileToFolderCheckBox');
fileToFolderCheckBox.setValue(true);
var fileToFolderCheckBoxFalse = app.getElementById('fileToFolderCheckBoxFalse');
fileToFolderCheckBoxFalse.setValue(false);
return app;
}


//This function loads all Test/Run Merge settings into script properties
// and does some handling for different user error scenarios

function saveRunSettings(e) {
  var app = UiApp.getActiveApplication();
  var destinationFolderName = e.parameter.destinationFolderName;
  var fileSetting = e.parameter.fileToFolderCheckValue;
  var emailSetting = e.parameter.fileToEmailCheckValue;
  var fileNameString = e.parameter.fileNameString;
  var linkToDoc = e.parameter.linkToDoc;
  var emailString = e.parameter.emailString;
  var fileType = e.parameter.fileType;
  var emailSubject = e.parameter.emailSubject;
  var bodyPrefix = e.parameter.bodyPrefix;
  var emailAttachment = e.parameter.emailAttachment;
  var formTrigger = e.parameter.formTrigger;
  var testOnly = e.parameter.testOnly;
   
  if (linkToDoc=="true") {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sourceSheetName = ScriptProperties.getProperty('sheetName');
    var sheet = ss.getSheetByName(sourceSheetName);
    var lastCol = sheet.getLastColumn();
    var secondToLastHeader = sheet.getRange(1, lastCol-1).getValue();
    if (secondToLastHeader != "Link to merged Doc") {
      sheet.insertColumnAfter(lastCol-1);
      sheet.getRange(1, lastCol).setValue("Link to merged Doc").setBackgroundColor("black").setFontColor("white");
    }
  } 
  
  if (formTrigger=="true") {
  var triggers = ScriptApp.getScriptTriggers();
  var triggerSetFlag = false;
  for (var i = 0; i<triggers.length; i++) {
    var eventType = triggers[i].getEventType();
    var triggerSource = triggers[i].getTriggerSource();
    var handlerFunction = triggers[i].getHandlerFunction();
    if ((handlerFunction=='onFormSubmit')&&(eventType=="ON_FORM_SUBMIT")&&(triggerSource=="SPREADSHEETS")) {
      triggerSetFlag = true;
      break;
    }
  }
  if (triggerSetFlag==false) {
    setFormTrigger();
  }
  }

//Do a bunch of error handling stuff for all permutations of settings values that don't make sense

  if ((fileSetting=="false")&&(emailSetting=="false")) {
      Browser.msgBox("You must select a merge type before you can run a merge job.");
      runMergeConsole();
      return;
  }

  if ((fileSetting=="true")&&(!fileNameString)) {
       Browser.msgBox("If you are saving your merge job to Docs, you must set a file naming convention.");
       runMergeConsole();
       return;
       }
  
  if ((emailSetting=="true")&&(!emailString)) {
       Browser.msgBox("If you want to email this merge job, you must set at least one recipient email address.");
       runMergeConsole();
       return;
      }
 
  ScriptProperties.setProperty('fileSetting',fileSetting);
  ScriptProperties.setProperty('fileNameString', fileNameString);
  ScriptProperties.setProperty('fileType', fileType);
  ScriptProperties.setProperty('linkToDoc', linkToDoc);
  ScriptProperties.setProperty('emailSetting',emailSetting);
  ScriptProperties.setProperty('emailString', emailString);
  ScriptProperties.setProperty('emailSubject', emailSubject);
  ScriptProperties.setProperty('bodyPrefix', bodyPrefix);
  ScriptProperties.setProperty('emailAttachment', emailAttachment);
  ScriptProperties.setProperty('formTrigger', formTrigger);
  ScriptProperties.setProperty('testOnly', testOnly);

 //Another strange annoyance. The ListBox UI element doesn't allow for the selected 
 //index to be passed as a parameter, which means that we have to go look it up
 //again in the folders using the folder Name the user submitted
 //What happens when there are duplicate folder names in DocsList?  Crazy limitation.
  
  var folders = DocsList.getFolders(0,20);
  var indexFlag = 1;
  for (i=0; i < folders.length; i++) {
    if (folders[i].getName()==destinationFolderName) {
      indexFlag = i;
      break;
    }
  }  
  var destinationFolderId = folders[indexFlag].getId();
  ScriptProperties.setProperty('destinationFolderId', destinationFolderId);
  initialize();
  runMergePrompt();
  app.close();
  return app; 
}


function runMergePrompt() {
  var app = UiApp.createApplication().setTitle('Step 5: Run Merge');
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var panel = app.createVerticalPanel();
  var label = app.createLabel("Note that the Google Docs service can cause this script to execute slowly, and there are quotas for the total number of script-generated Docs you can create in a day.  Visit https://docs.google.com/macros/dashboard to learn about your quotas. For large merge jobs, the autoCrat will pause and then automatically restart to avoid a service timeout.");
  panel.add(label);
  //create spinner graphic to show upon button click awaiting merge completion
  var refreshPanel = app.createFlowPanel();
  refreshPanel.setId('refreshPanel');
  refreshPanel.setStyleAttribute("width", "100%");
  refreshPanel.setVisible(false);

//Adds the graphic for the waiting period before merge completion. Set invisible until client handler
//is called by button click 
  var spinner = app.createImage(this.AUTOCRATIMAGEURL).setHeight("220px");
  spinner.setStyleAttribute("opacity", "1");
  spinner.setStyleAttribute("position", "absolute");
  spinner.setStyleAttribute("top", "50px");
  spinner.setStyleAttribute("left", "100px");
  spinner.setId("dialogspinner");
  var waitingLabel = app.createLabel("Performing merge...").setStyleAttribute('textAlign', 'center');
  refreshPanel.add(spinner);
  refreshPanel.add(waitingLabel);
  app.add(refreshPanel);
  
  var horiz = app.createHorizontalPanel();
  var handler1 = app.createServerHandler('runMerge').addCallbackElement(panel);
  var spinnerHandler = app.createClientHandler().forTargets(refreshPanel).setVisible(true).forTargets(panel).setVisible(false);
  var button1 = app.createButton('Run merge now').addClickHandler(handler1).addClickHandler(spinnerHandler);
  var handler2 = app.createServerHandler('exit').addCallbackElement(panel);
  var button2 = app.createButton('Not now, just keep my settings').addClickHandler(handler2);
  horiz.add(button1);
  horiz.add(button2);
  panel.add(horiz);
  app.add(panel);
  ss.show(app);
  return app;
}


function exit(e) {
  var app = UiApp.getActiveApplication();
  app.close();
  return app;
}

// This function is where the actual merge is executed, entirely from values stored in 
// Script Properties.  This is the function that the Google Form submit trigger calls 

function runMerge() {  
 removeTimeoutTrigger();
//Do some more error handling just in case
 var fileId = ScriptProperties.getProperty('fileId');
  if (!fileId) { 
       Browser.msgBox("You must select a template file before you can run a merge.");
       defineSettings();
       return;
       }
  var mappingString = ScriptProperties.getProperty('mappingString');
  if (!mappingString) {
       Browser.msgBox("You must map document fields before you can run a merge.");
       defineSettings();
       return;
       }
  var sheetName = ScriptProperties.getProperty('sheetName');
  if (!sheetName) {
       Browser.msgBox("You must select a source data sheet before you can run a merge.");
       defineSettings();
       return;
       }

  var now = new Date();
  
  //status message will get concatenated as the logic tree progresses through the merge
  var mergeStatusMessage = "";

  var fileSetting = ScriptProperties.getProperty('fileSetting');
  var fileNameString = ScriptProperties.getProperty('fileNameString');
  
  var linkToDoc = ScriptProperties.getProperty('linkToDoc');
  
  
  // error handling
  if ((!fileNameString)&&(fileSetting==true)) {
       Browser.msgBox("You must set a file naming convention before you can run a merge.");
       runMergeConsole();
       return;
       }

  var testOnly = ScriptProperties.getProperty('testOnly');

  // avoids loading any stale settings from old file or email merges
  if (fileSetting == "true") {
  var fileTypeSetting = ScriptProperties.getProperty('fileType');
  var destFolderId = ScriptProperties.getProperty('destinationFolderId');
  }
   
  var emailSetting = ScriptProperties.getProperty('emailSetting');
  if (emailSetting == "true") {
  var emailString = ScriptProperties.getProperty('emailString'); 
  var emailSubject = ScriptProperties.getProperty('emailSubject');
  var emailAttachment = ScriptProperties.getProperty('emailAttachment');
  }

  var sheet = ss.getSheetByName(sheetName);
  var headers = fetchSheetHeaders(sheetName);
  var normalizedHeaders = normalizeHeaders(headers);
  var mergeTags = "$"+normalizedHeaders.join(",$");
  
  //this array will be used to do replacements in all file name, subject, and email body settings
  mergeTags = mergeTags.split(",");
  var fullRange = sheet.getDataRange();
  var lastCol = fullRange.getLastColumn();
  var lastRow = fullRange.getLastRow();
  
  // copyId will be used to pass the Doc Id of the merged copy through different branches of the merge logic
  var copyId = "0";
  
  // Load the merge fields from the template
  var mergeFields = fetchDocFields(fileId);
  
  //Create a temporary folder in the case that the user doesn't have
  //the "Save merged files to Docs" option checked.
  //This folder will be kept if they select the shared Google Docs method
  if ((emailSetting == "true") && (fileSetting == "false")) {
    var tempFolderId = DocsList.createFolder('Merged Docs from' + now).getId();
   }
  var count = 0;
  
  //Load any merge conditions
  var conditionString = ScriptProperties.getProperty('mergeConditions');
  
  //Load in the range
  var range = sheet.getDataRange();
  var rowValueArray = range.getValues();
  var rowFormatArray = range.getNumberFormats();
  
 
  
  //Commence the merge loop, run through sheet
  for (var i=1; i<lastRow; i++) {
   var loopTime = new Date();
   var timeElapsed = parseInt(loopTime - now);
    if (i==90) {
   debugger;
    }
    if (timeElapsed > 295000) {
      preemptTimeout();
      return;
    }
   var rowValues = rowValueArray[i];
   var rowFormats = rowFormatArray[i];
 
  // Test conditions on this row
   var conditionTest = evaluateConditions(conditionString, 0, rowValues, normalizedHeaders);
  //Only run a merge for records that have no existing value in the last column ("Merge Status"), and that passes condition test
    if ((rowValues[lastCol-1]=="")&&(conditionTest==true)) {
  
    //First big branch in the merge logic: If file setting is true, do all necessary things 
   if (fileSetting == "true") {
     // custom function replaces "$variables" with values in a string
     var fileName = replaceStringFields(fileNameString, rowValues, rowFormats, headers, mergeTags);
     
     //Google Doc created by default.  Custom function to replace all <<merge tags>> with mapped fields
     var copyId = makeMergeDoc(rowValues, rowFormats, destFolderId, fileName, mergeFields);
     logDocCreation();

     //PDF created only if set
     if (fileTypeSetting == "PDF") {  
       var pdfId = convertToPdf(copyId, destFolderId); 
       mergeStatusMessage += "PDF successfully created,"; 
       trashDoc(copyId);
       copyId = '';
     } else {
       mergeStatusMessage += "Google Doc successfully created,"; 
     }
   }

//handle the case where the email option is chosen without the save in docs option
//set temporary file name and create the merged file in the temporary folder
  if ((emailSetting == "true") && (fileSetting == "false")) {
    var tempFileName = "Merged File #" + (i-1);
    var copyId = makeMergeDoc(rowValues, rowFormats, tempFolderId, tempFileName, mergeFields);
  }
  
// 2nd major logic branch in merge
  if (emailSetting == "true") {
    // replace $variables in strings
     var recipients = replaceStringFields(emailString, rowValues, rowFormats, headers, mergeTags);
    //remove whitespaces from email strings 
    recipients = recipients.replace(/\s+/g, '');
    //remove trailing commas from email strings
    recipients = recipients.replace(/,$/,'');
     var subject = replaceStringFields(emailSubject, rowValues, rowFormats, headers, mergeTags);
     var bodyPrefix = ScriptProperties.getProperty('bodyPrefix');
     var user = Session.getActiveUser().getUserLoginId();
     bodyPrefix = replaceStringFields(bodyPrefix, rowValues, rowFormats, headers, mergeTags);
    //Time to use a switch case. Woot!
     switch (emailAttachment){    
      case "PDF":
         //Hard to grasp, but look to see if PDF already exists from file merge and use it if so
         //attach the file and set email properties
         if (pdfId) {
            var attachment = DocsList.getFileById(pdfId);
            var body = '<table style="border:1px; padding:15px; background-color:#DDDDDD"><tr><td>' + user + ' has attached a PDF file to this email.</td><tr></table><br /><br />';
            body += bodyPrefix;
            MailApp.sendEmail(recipients, subject, body, {htmlBody: body, attachments: attachment});
            mergeStatusMessage += "PDF attached in email to " + recipients;
         }
         // copyId should only exist if PDF option isn't selected in the file method
         //attach the file and set email properties
         if (copyId) {
            var attachment = DocsList.getFileById(copyId).getAs("application/pdf");
            var body = '<table style="border:1px; padding:15px; background-color:#DDDDDD"><tr><td>' + user + ' has attached a PDF file to this email.</td><tr></table><br /><br />';
            body += bodyPrefix;
            MailApp.sendEmail(recipients, subject, body, {htmlBody: body, attachments: attachment});
            mergeStatusMessage += "PDF attached in email to " + recipients;
         }
        break;
         
      case "Recipient-view-only Google Doc":
           var file = DocsList.getFileById(copyId);
         //add email recipients as doc viewers
           file.addViewers(recipients.split(","));
           var docUrl = file.getUrl();
           var docTitle = file.getName();
         // Add a little note on sharing as caring
           var body = '<table style="border:1px; padding:15px; background-color:#DDDDDD"><tr><td>' + user + ' has just shared this view-only Google Doc with you:</td><td><a href = "' + docUrl + '">' + docTitle + '</a></td></tr></table><br /><br />';
           body += bodyPrefix;
           MailApp.sendEmail(recipients, subject, body, {htmlBody: body});
           mergeStatusMessage += " View-only Doc shared with " + recipients + " ";
        break;
         
      case "Recipient-editable Google Doc":
           var file = DocsList.getFileById(copyId);
         //add email recipients as doc editors
           file.addEditors(recipients.split(","));
           var docUrl = file.getUrl();
           var docTitle = file.getName();
           var user = Session.getActiveUser().getUserLoginId();
           var body = '<table style="border:1px; padding:15px; background-color:#DDDDDD"><tr><td>' + user + ' has just shared this editable Google Doc with you:</td><td><a href = "' + docUrl + '">' +  docTitle + '</a></td></tr></table><br /><br />';
           body += bodyPrefix;
           MailApp.sendEmail(recipients, subject, body, {htmlBody: body});
           mergeStatusMessage += " Editable Doc shared with " + recipients + " ";
        break;
      }
    }

 //Purge the file if user doesn't want it saved.
 //Leaves files that have been shared as docs in the temporary folder, unless
 //the user has specified the folder
 if ((emailSetting == "true") && (fileSetting == "false") && (emailAttachment=="PDF")){
    mergeStatusMessage += ", file not saved in Docs."
    trashDoc(copyId);
  }
      
      

   
  mergeStatusMessage += now;
  var sheet = this.ss.getSheetByName(sheetName);
  var lastCol = sheet.getLastColumn();
  
  if ((linkToDoc=="true")&&((copyId)||(pdfId))) {
    var range = sheet.getRange(i+1, lastCol-1, 1, 2);
    if (pdfId!='') {
      var mergeFileId = pdfId;
    }
    if (copyId!='') {
      var mergeFileId = copyId;
    }
    var mergeFile = DocsList.getFileById(mergeFileId)
    var url = mergeFile.getUrl();
    var mergeTitle = mergeFile.getName();
    var values = [['=hyperlink("' + url + '", "' + mergeTitle + '")', mergeStatusMessage]];
    range.setValues(values);
  } else {
    var range = sheet.getRange(i+1, lastCol);
    range.setValue(mergeStatusMessage);
  }    
  mergeStatusMessage = "";
  count = count+1;
}
  if ((emailSetting == "true") && (fileSetting == "false") && (emailAttachment=="PDF")){
var folder = DocsList.getFolderById(tempFolderId);
    folder.setTrashed(true);
}
    
    if (testOnly=="true") { break; }
}
  //Extra fancy merge completion confirmation
  //Even fancier: What would it take to have a progress bar embedded in the loop?
  if (count!=0) {
    Browser.msgBox("Merge successfully completed for " + count + " record(s).");
  } else { 
    Browser.msgBox("For some reason, no record(s) were successfully merged.  If you haven't cleared the merge-status messages, that could be the issue.");
  }
}

// This function subs in row values for $variables
function replaceStringFields(string, rowValues, rowFormats, headers, mergeTags) {
  var newString = string;
  var timeZone = Session.getTimeZone();
  Logger.log(timeZone);
  for (var i=0; i<headers.length; i++) {
    var thisHeader = headers[i];
    var colNum = getColumnNumberFromHeader(thisHeader);
 if ((rowFormats[colNum-1]=="M/d/yyyy")||(rowFormats[colNum-1]=="MMMM d, yyyy")||(rowFormats[colNum-1]=="M/d/yyyy H:mm:ss")) {
   try {
      var replacementValue = Utilities.formatDate(rowValues[colNum-1], timeZone, rowFormats[colNum-1]);
      }
   catch(err) {
      var date = new Date(rowValues[colNum-1]);
      var colVal = Utilities.formatDate(date, timeZone, rowFormats[colNum-1]);
      }
    } else {
     var replacementValue = rowValues[colNum-1];
    }
    var replaceTag = mergeTags[i];
    newString = newString.replace(replaceTag,replacementValue);
  }
  var currentTime = new Date()
  var month = currentTime.getMonth() + 1;
  var day = currentTime.getDate();
  var year = currentTime.getFullYear();
  newString = newString.replace("$currDate", month+"/"+day+"/"+year);
  return newString;
}



//Creates PDF in a designated folder and returns Id
function convertToPdf (copyId, folderId) {
   var folder = DocsList.getFolderById(folderId);
   var pdfBlob = DocsList.getFileById(copyId).getAs("application/pdf"); 
   var pdfFile = DocsList.createFile(pdfBlob);
   pdfFile.addToFolder(folder);
   var pdfId = pdfFile.getId();
   return pdfId;
   }

//Trashes given docId
function trashDoc (docId) {
   DocsList.getFileById(docId).setTrashed(true);
}



function makeMergeDoc(rowValues, rowFormats, folderId, fileName, mergeFields) {
   // Get document template, copy it as a new temp doc, and save the Doc’s id
   var fileId = ScriptProperties.getProperty('fileId');
   var template = DocsList.getFileById(fileId);
   var copyId = template.makeCopy(fileName).getId();
   // Open the temporary document
   var copyDoc = DocumentApp.openById(copyId);
   // Get the document’s body section
   var copyHeader = copyDoc.getHeader();
   var copyBody = copyDoc.getActiveSection();
   var copyFooter = copyDoc.getFooter();
   // Get the mappingString
   var mappingString = ScriptProperties.getProperty('mappingString');
   var mappingObject = Utilities.jsonParse(mappingString);
   for (i in mappingObject) {
   };
  for (i=0; i< mergeFields.length; i++) {
     var normalizedFieldName = normalizeHeader(mergeFields[i]);
     var colNum = mappingObject[normalizedFieldName];
     var timeZone = Session.getTimeZone();
    if ((rowFormats[colNum-1]=="M/d/yyyy")||(rowFormats[colNum-1]=="MMMM d, yyyy")||(rowFormats[colNum-1]=="M/d/yyyy H:mm:ss")) {
      try {
     var colVal = Utilities.formatDate(rowValues[colNum-1], timeZone, rowFormats[colNum-1]);
      }
      catch(err) {
      var date = new Date(rowValues[colNum-1]);
      var colVal = Utilities.formatDate(date, timeZone, rowFormats[colNum-1]);
      }
    } else {
     var colVal = rowValues[colNum-1];
    }
   if (copyHeader) {
     copyHeader.replaceText(mergeFields[i], colVal);
     }
   if (copyBody) {
     copyBody.replaceText(mergeFields[i], colVal);
     }
   if (copyFooter) {
     copyFooter.replaceText(mergeFields[i], colVal);
     }
    }
  
// Save and close the temporary document
   copyDoc.saveAndClose();

// move to folder
   var folder = DocsList.getFolderById(folderId);
   DocsList.getFileById(copyId).addToFolder(folder);  
   return copyId;
}


// This function creates the field mapping UI, called from the spreadsheet menu
function mapFields() {
  var app = UiApp.createApplication();
  app.setTitle("Step 3: Set Field Mappings");
  app.setHeight("430");
  var panel = app.createScrollPanel().setId("fieldMappingPanel");
  var helpPopup = app.createDecoratedPopupPanel();
  var helpLabel = app.createLabel().setText("If all is working properly, Every <<Merge Tag>> in your document template should be listed on the left. Each tag needs to be \"mapped\" onto a corresponding column in your source data sheet.  IMPORTANT: using non-alpha-numeric characters {(),&%#etc} in tags will cause the merge to fail.");
  helpPopup.add(helpLabel);
  //create grid but without a size, for now
  var tagHeaderLabel = app.createLabel().setText("<<Tag From Doc Template>>");
  var fieldHeaderLabel = app.createLabel().setText("Sheet Header");
  var topGrid = app.createGrid(1,2);
  topGrid.setWidth("100%");
  topGrid.setWidget(0, 0, tagHeaderLabel);
  topGrid.setStyleAttribute(0,0,"backgroundColor", "#cfcfcf");
  topGrid.setStyleAttribute(0,0,"textAlign", "center");
  tagHeaderLabel.setStyleAttribute("fontSize", "16px");
  topGrid.setStyleAttribute(0,0,"width", "48%");
  topGrid.setWidget(0, 1, fieldHeaderLabel);
  topGrid.setStyleAttribute(0,1,"backgroundColor", "#cfcfcf");
  var grid = app.createGrid().setId("fieldMappingGrid");
  topGrid.setStyleAttribute(0,1,"textAlign", "center");
  fieldHeaderLabel.setStyleAttribute("fontSize", "16px");
  topGrid.setStyleAttribute(0,1,"width", "52%");
  grid.setWidth("100%")
  // grab the file id
  var fileId = ScriptProperties.getProperty('fileId');
  // If no template has been set, jump straight to settings UI
  if(!fileId) { 
    Browser.msgBox("You need to choose a template file before you can run a merge!");
    defineSettings(); 
  }
  // go to file to look for all unique <<mergefields>>
  var docFieldNames = fetchDocFields(fileId);
  if (!docFieldNames) { 
     Browser.msgBox('The selected template contains no merge field tags..eg. <<merge field>>');
     app.close();
     defineSettings();
  }
  //fetch data sheet from user-determined property
  var sheetName = ScriptProperties.getProperty('sheetName');
    //If not set send user straight to settings UI
    if (!sheetName) {
    Browser.msgBox("You need to choose a template file before you can run a merge!");
    app.close();
    defineSettings(); 
   }
  //go to data sheet and return all header names
  var sheetFieldNames = fetchSheetHeaders(sheetName);

  if ((docFieldNames)&&(sheetFieldNames)) {
  //resize grid to fit number of unique fields in template
  grid.resize(docFieldNames.length+1, 2);
  //grab already-saved mappings, if they exist.  This is saved as a JSON-like string
  var mappingString = ScriptProperties.getProperty("mappingString");
  var mappingObject = Utilities.jsonParse(mappingString);
  //build Ui elements and assign indexed IDs and names
  // this technique allow the UI to expand to fit the number of tags in the template
  for (i=0; i<docFieldNames.length; i++) {
    var label = app.createLabel().setId("mergefield-" + i).setText(docFieldNames[i]);
    var listBox = app.createListBox().setId("header-" + i).setName("header-" + i);
    listBox.addItem("Choose column");
    for (j=0; j<sheetFieldNames.length; j++) {
      listBox.addItem(sheetFieldNames[j]);
    }
    var fieldName = normalizeHeader(docFieldNames[i]);
    if (mappingObject) {
        for (var k in mappingObject) {
          //this line handles the case where the template has been edited and a previously mapped field is now missing
          //erases existing mappings and forces the user to re-do them
          if (!mappingObject[fieldName]) { ScriptProperties.setProperty('mappingString',''); ScriptProperties.setProperty('fileNameString','');break;}
          var itemNo = parseInt(mappingObject[fieldName]);
        } 
        if (!mappingObject[fieldName]) { ScriptProperties.setProperty('mappingString',''); break;}  
    } else {
      var itemNo = 0;
      for (var m=0; m<sheetFieldNames.length; m++) {
        var sheetFieldName = normalizeHeader(sheetFieldNames[m]);
        if (fieldName==sheetFieldName) {
          itemNo = m+1;
          break;
        }
      }
    }
    listBox.setSelectedIndex(itemNo); 
    grid.setWidget(i,0,label);
    grid.setStyleAttribute(i, 0, "background", "#F5F5F5");
    grid.setStyleAttribute(i, 0, "width", "50%");
    grid.setStyleAttribute(i, 0, "textAlign", "right");
    grid.setWidget(i,1,listBox);
    grid.setStyleAttribute(i, 1, "background", "#F5F5F5");
    grid.setStyleAttribute(i, 0, "width", "50%");
  }
  var sendHandler = app.createServerHandler('saveMappings').addCallbackElement(grid);
  var button = app.createButton().setId("mappingSubmitButton").addClickHandler(sendHandler);
  button.setText("Save mappings");
  grid.setWidget(i, 0, app.createLabel().setText("Important: These mappings will hold true only if you don't modify the order of columns in the sheet. \n Dates must be formatted as \"M/d/yyyy\", \"MMMM d, yyyy\", or \"M/d/yyyy H:mm:ss\" using number formats in the spreadsheet").setStyleAttribute("fontSize","9px"));
  grid.setWidget(i, 1, button);
  panel.setStyleAttribute('overflow', 'scroll');
  panel.setHeight("360px");
  panel.add(grid);
  app.add(helpPopup);
  app.add(topGrid);
  app.add(panel);
  this.ss.show(app);
}
}

// saves Field mappings to script properties
// as a JSON-like string
function saveMappings(e) {
  var app = UiApp.getActiveApplication();
  var fileId = ScriptProperties.getProperty('fileId');
  var docFieldNames = fetchDocFields(fileId);
  var normalizedFieldNames = normalizeHeaders(docFieldNames);
  var mappingString = "{";
  var header;
  var column;
  for (i=0; i<docFieldNames.length; i++) {
    header = e.parameter["header-" + i];
    //Handle errors
    if (header=="Choose column") { Browser.msgBox("You forgot to assign a column to one or more of your mergefields."); mapFields(); return;}    
    if (header) {
    column = getColumnNumberFromHeader(header);
    var fieldName = docFieldNames[i];
      if (fieldName) {
         var fieldName = normalizeHeader(fieldName);
      }
    mappingString += '"' + fieldName + '" : "' + column + '", '; 
    }
}
  mappingString += "}";
  var mappingObject = Utilities.jsonParse(mappingString);
  for (var i in mappingObject) {
  }
  
  ScriptProperties.setProperty('mappingString', mappingString);
   initialize();
  if (!(ScriptProperties.getProperty('fileSetting'))||!(ScriptProperties.getProperty('emailSetting'))) {
   runMergeConsole();
  }
   app.close();
   return app;
}


//Plucks the column numbers for the mapping string
//Implication: If a user changes the order of columns in the spreadsheet, 
//the mappings will get screwed up.
//Is there a way to erase the mappings or warn the user when column order is changed?

function getColumnNumberFromHeader(header) {
  var sheetName = ScriptProperties.getProperty("sheetName");
  var sheet = ss.getSheetByName(sheetName);
  var cols = sheet.getLastColumn();
  var range = sheet.getRange(1,1,1,cols);
  var data = range.getValues();
  var colFlag = -1;
  for (i=0; i<data[0].length; i++) {
    if(data[0][i]==header) {
      colFlag = i+1;
      break;
    }
  }
  return colFlag;
}



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

// Given a JavaScript 2d Array, this function returns the transposed table.
// Arguments:
//   - data: JavaScript 2d Array
// Returns a JavaScript 2d Array
// Example: arrayTranspose([[1,2,3],[4,5,6]]) returns [[1,4],[2,5],[3,6]].
function arrayTranspose(data) {
  if (data.length == 0 || data[0].length == 0) {
    return null;
  }

  var ret = [];
  for (var i = 0; i < data[0].length; ++i) {
    ret.push([]);
  }

  for (var i = 0; i < data.length; ++i) {
    for (var j = 0; j < data[i].length; ++j) {
      ret[j][i] = data[i][j];
    }
  }

  return ret;
}


// Grabs the headers from a sheet
function fetchSheetHeaders(sheetName) {
  var sheet = ss.getSheetByName(sheetName);
  var cols = sheet.getLastColumn();
  var range = sheet.getRange(1,1,1,cols);
  var data = range.getValues();
  var headers = new Array();
  for (i = 0; i<data[0].length; i++) {
    headers[i] = data[0][i];
  }
  return headers;
}
 
//Grabs any <<Merge Tags>> from a document 
function fetchDocFields(fileId) {
  var template = DocumentApp.openById(fileId);
  var title = template.getName();
  var fieldExp = "[<]{2,}\\S[^,]*?[>]{2,}";
  var result;
  var matchResults = new Array();
  var headerFieldNames = new Array();
  var bodyFieldNames = new Array();
  var footerFieldNames = new Array();
  
  //get all tags in doc header
  var header = template.getHeader();
  if (header!=null) { matchResults[0] = header.findText(fieldExp);}
  if (matchResults[0]!=null){
  var element = matchResults[0].getElement().asText().getText();
  var start = matchResults[0].getStartOffset()
  var end = matchResults[0].getEndOffsetInclusive()+1;
  var length = end-start;
  headerFieldNames[0] = element.substr(start,length)
    var i = 0;
    while (headerFieldNames[i]) {
      matchResults[i+1] = template.getHeader().findText(fieldExp, matchResults[i]);
      if (matchResults[i+1]) {
      var element = matchResults[i+1].getElement().asText().getText();
      var start = matchResults[i+1].getStartOffset()
      var end = matchResults[i+1].getEndOffsetInclusive()+1;
      var length = end-start;
      headerFieldNames[i+1] = element.substr(start,length);
      }
      i++;
    }
    }
    
   //get all tags in doc body
  matchResults = [];
  var body = template.getActiveSection();
  if (body!=null) { matchResults[0] = body.findText(fieldExp);}
  if (matchResults[0]!=null){
  var element = matchResults[0].getElement().asText().getText();
  var start = matchResults[0].getStartOffset()
  var end = matchResults[0].getEndOffsetInclusive()+1;
  var length = end-start;
  bodyFieldNames[0] = element.substr(start,length)
   var i = 0;
    while (bodyFieldNames[i]) {
      matchResults[i+1] = template.getActiveSection().findText(fieldExp, matchResults[i]);
      if (matchResults[i+1]) {
      var element = matchResults[i+1].getElement().asText().getText();
      var start = matchResults[i+1].getStartOffset()
      var end = matchResults[i+1].getEndOffsetInclusive()+1;
      var length = end-start;
      bodyFieldNames[i+1] = element.substr(start,length);
      }
      i++;
     }
    }
    
   //get all tags in doc footer
  var matchResults = [];
  var footer = template.getFooter();
  if (footer!=null) { matchResults[0] = footer.findText(fieldExp);}
  if (matchResults[0]!=null){
  var element = matchResults[0].getElement().asText().getText();
  var start = matchResults[0].getStartOffset()
  var end = matchResults[0].getEndOffsetInclusive()+1;
  var length = end-start;
  footerFieldNames[0] = element.substr(start,length)
    var i = 0;
    while (footerFieldNames[i]) {
      matchResults[i+1] = template.getFooter().findText(fieldExp, matchResults[i]);
      if (matchResults[i+1]) {
      var element = matchResults[i+1].getElement().asText().getText();
      var start = matchResults[i+1].getStartOffset()
      var end = matchResults[i+1].getEndOffsetInclusive()+1;
      var length = end-start;
      footerFieldNames[i+1] = element.substr(start,length);
      }
      i++;
     }
    }
  var fieldNames = headerFieldNames.concat(bodyFieldNames, footerFieldNames);
  fieldNames = removeDuplicateElement(fieldNames);
 return fieldNames; 
}
  

//Takes out any duplicates from an array of values
function removeDuplicateElement(arrayName)
  {
  var newArray=new Array();
  label:for(var i=0; i<arrayName.length;i++ )
  {  
  for(var j=0; j<newArray.length;j++ )
  {
  if(newArray[j]==arrayName[i]) 
  continue label;
  }
  newArray[newArray.length] = arrayName[i];
  }
  return newArray;
  }


//Set merge conditions
function setMergeConditions() {
  var app = UiApp.createApplication().setTitle("Step 2: Set Merge Conditions (optional)");
  var panel = app.createVerticalPanel();
  var helppanel = app.createDecoratedPopupPanel();
  var label = app.createLabel('Use the widget below to set a field value condition that must be met for records to be merged to Docs.  Rows that do not meet the condition will be skipped and given a blank status message.  Leave the condition field blank to ignore.');
  helppanel.add(label);
  panel.add(helppanel);
  var conditionsGrid = app.createGrid(1,5).setId('conditionsGrid');
  var conditionLabel = app.createLabel('Field value');
  var dropdown = app.createListBox().setId('col-0').setName('col-0').setWidth("150px");
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sourceSheetName = ScriptProperties.getProperty('sheetName');
  if ((sourceSheetName)&&(sourceSheetName!='')) {
     var sourceSheet = ss.getSheetByName(sourceSheetName);
  } else {
     var sourceSheet = ss.getSheets()[0];
  }
  var lastCol = sourceSheet.getLastColumn();
  var headers = sourceSheet.getRange(1, 1, 1, lastCol).getValues()[0];
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
  
  var conditionString = ScriptProperties.getProperty('mergeConditions');
  if ((conditionString)&&(conditionString!='')) {
    var conditionObject = Utilities.jsonParse(conditionString);
    var selectedHeader = conditionObject['col-0'];
    var selectedIndex = 0;
    for (var i=0; i<headers.length; i++) {
      if (headers[i]==selectedHeader) {
        selectedIndex = i;
        break;
      }
    }
    dropdown.setSelectedIndex(selectedIndex);
    var selectedValue = conditionObject['val-0'];
    textbox.setValue(selectedValue);
  }
  var handler = app.createServerHandler('saveCondition').addCallbackElement(panel);
  var button = app.createButton('Submit').addClickHandler(handler);
  panel.add(conditionsGrid);
  panel.add(button);
  app.add(panel);
  ss.show(app);
}


function saveCondition(e) {
  var app = UiApp.getActiveApplication();
  var conditionObject = new Object();
  conditionObject['col-0'] = e.parameter['col-0'];
  conditionObject['val-0'] = e.parameter['val-0'];
  var conditionString = Utilities.jsonStringify(conditionObject);
  ScriptProperties.setProperty('mergeConditions', conditionString);
  if(!(ScriptProperties.getProperty("mappingString"))||(ScriptProperties.getProperty("mappingString")=="")) {
     mapFields();
  }
  app.close();
  return app;
}


//returns true if testval meets the condition 
function evaluateConditions(condString, index, rowData, normalizedHeaders) {
  if ((condString)&&(condString!='')) {
  var condObject = Utilities.jsonParse(condString);
  var i = index;
  var testHeader = normalizeHeader(condObject["col-"+i]);
   var colNum = -1;
  for (var j=0; normalizedHeaders.length; j++) {
    if (normalizedHeaders[j]==testHeader) {
      colNum = j;
      break;
    }
  }
  if (colNum == -1) {
    Browser.msgBox("Something is wrong with the merge conditions. Try resetting.");
    return;
  }
  var testVal = rowData[colNum];
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
} else {
  return true;
}
}


//responsible for Settings UI
//lots of trickery with client and server change handlers to reload conditional field values
function defineSettings() {
  var app = UiApp.createApplication();
  app.setTitle("Step 1: Select Data Source and Template Doc").setHeight(450);
  var panel = app.createVerticalPanel().setId("settingsPanel");
  var sheetLabel = app.createLabel().setId("sheetLabel");
  sheetLabel.setText("Select the sheet in this spreadsheet that contains your merge data");
  
  var sheetListBox = app.createListBox().setName("sheetName").setId("sheetListBox");
  var sheets = ss.getSheets();
  for (i=0; i<sheets.length; i++) {
    var sheetName = sheets[i].getName();
    sheetListBox.addItem(sheetName);
  }
  

  var folderLabel = app.createLabel().setId("folderLabel");
  folderLabel.setText("Select the collection that contains your Document template. Due to server limitations, only your 20 most recently edited collections will show here.  Hint: If this causes you a problem, refresh your collection\'s name to get it to rise back to the top.");
  
  var folderListBox = app.createListBox().setName("folderName").setId("folderListBox").setWidth("300px");
  folderListBox.addItem('Select folder');
  var folderSendHandler = app.createServerChangeHandler('getFiles').addCallbackElement(panel);
  folderListBox.addChangeHandler(folderSendHandler);
  var folders = DocsList.getFolders(0,20);
  for (i = 0; i<folders.length; i++) {
    var name = folders[i].getName();
    folderListBox.addItem(name);
  }
  
  panel.add(sheetLabel);
  panel.add(sheetListBox); 
  panel.add(folderLabel);
  panel.add(folderListBox);
  
  //handle the case where items have been previously selected
  var folderId = ScriptProperties.getProperty("folderId");
  var sheetName = ScriptProperties.getProperty("sheetName");
  var fileId = ScriptProperties.getProperty("fileId");
  if((folderId)&&(sheetName)&&(fileId)) {
    var index = getSheetIndex(sheetName);
    sheetListBox.setItemSelected(index, true);
    index = getFolderIndex(folderId)+1;
    folderListBox.setItemSelected(index, true);
    try
    {
    presetFile();
    }
    catch(err)
    {
    folderListBox.setItemSelected(0, true);
    }
  }
  app.add(panel);
  this.ss.show(app);
}


//function called if a folder, sheetname, and fileId are already set in the script properties
//responsible for pre-populating form values if this is the case AND if the try->catch doesn't fail
//try->catch (above) implemented to handle the case where the template file isn't accessible to the currently logged in user
function presetFile(e) {
  var app = UiApp.getActiveApplication();
  var folderId = ScriptProperties.getProperty('folderId');
  var fileId = ScriptProperties.getProperty('fileId');
  var fileLabel = app.createLabel().setId("fileLabel");
  fileLabel.setText("Select the template file you want to use");
  var fileListBox = app.createListBox().setName("fileName").setId("fileListBox").setWidth("300px");
  fileListBox.addItem('Select template file');
  var fileNote = app.createLabel().setText("Template file must be a Google Document and must contain <<Merge Tags>> for replacement fields. <<Text of merge tags>> does not need to match column headers.");
  var folder = DocsList.getFolderById(folderId);
  var files = folder.getFilesByType("document");
  for (i = 0; i<files.length; i++) {
    var fileName = files[i].getName();
    fileListBox.addItem(fileName);
  }  
  var fileIndex = getFileIndex(fileId, folderId);
  fileListBox.setItemSelected(fileIndex+1, true);
  app.getElementById('folderListBox').addChangeHandler(app.createServerClickHandler('reset'));
  var panel = app.getElementById("settingsPanel");
  var panel2 = app.createVerticalPanel().setId("clearPanel");
 var priorDeleteSetting = ScriptProperties.getProperty("deleteStatus");
  var deleteStatusCheckBox = app.createCheckBox().setId("deleteStatusCheckBox").setName("clearStatus").setText("Clear all existing status messages");
  if (priorDeleteSetting=="true") {
    deleteStatusCheckBox.setValue(true);
  }
  var settingsPopup = app.createDecoratedPopupPanel();
  var settingsNote  = app.createLabel().setText("Saving these settings the first time will add a column called \"Merge Status\" after your last data column, where a detailed status message will appear after you successfully run a merge.  Once a status message exists next to a row, the autoCrat ignores it the next time it runs.  Checking the box below and re-saving the settings on the same sheet will clear out any existing merge status messages.");
  settingsPopup.add(settingsNote);
  panel2.add(settingsPopup);
  panel2.add(deleteStatusCheckBox);  
  app.add(panel2);
  var settingsSendHandler = app.createServerHandler('saveSettings').addCallbackElement(panel).addCallbackElement(panel2);
  var button = app.createButton("Save settings", settingsSendHandler).setId("settingsButton");
  panel.add(fileLabel);
  panel.add(fileListBox);
  panel.add(fileNote);
  panel.add(button);
  return app;  
}

//utility function for listboxes that require index be looked up for preselection of already-saved files
function getFileIndex(fileId, folderId) {
  var folder = DocsList.getFolderById(folderId);
  var files = folder.getFilesByType("document");
  var indexFlag = 1;
  for (i=0; i<files.length; i++) {
    if (fileId == files[i].getId()) {
      indexFlag = i;
      break;
    }
  }
  return indexFlag;
}

//utility function for listboxes that require index be looked up for preselection of already-saved folders
function getFolderIndex(folderId) {
  var folders = DocsList.getFolders(0,20);
  var indexFlag = 1;
  for (i=0; i<folders.length; i++) {
    if (folderId == folders[i].getId()) {
      indexFlag = i;
      break;
     }
   }
  return indexFlag; 
}

//utility function for listboxes that require index be looked up for preselection of already-saved source sheet
function getSheetIndex(sheetName) {
  var sheets = ss.getSheets();
  var indexFlag = 1;
  for (i=0; i<sheets.length; i++) {
    if (sheetName ==sheets[i].getName()) {
      indexFlag = i;
      break;
     }
   }
  return indexFlag; 
}

//saves the settings from defineSettings function
function saveSettings(e) {
  var app = UiApp.getActiveApplication();
  var sheetName = e.parameter.sheetName;
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  var data = sheet.getDataRange().getValues();
  Logger.log(data);
  if (data=='') {
    Browser.msgBox('Source sheet contains no data');
    defineSettings();
    return;
  }
   // Clear the mapping string property if the sheet name has been changed
   if (!(ScriptProperties.getProperty('sheetName')==sheetName)) {
     ScriptProperties.setProperty('mappingString','');
  }
  ScriptProperties.setProperty('sheetName', sheetName);
  var folderName = e.parameter.folderName;
  var folders = DocsList.getFolders(0,20);
  var indexFlag = 1;
  for (i=0; i < folders.length; i++) {
    if (folders[i].getName()==folderName) {
      indexFlag = i;
      break;
    }
  }  
  var folderId = folders[indexFlag].getId();
  ScriptProperties.setProperty('folderId', folderId);
  
  var fileName = e.parameter.fileName;
  var files = folders[indexFlag].getFiles()
  var indexFlag = 1;
  for (i=0; i < files.length; i++) {
    if (files[i].getName()==fileName) {
      indexFlag = i;
      break;
    }
  }  
  var fileId = files[indexFlag].getId();
  // Clear the mapping string property if the file has been changed
  if (!(ScriptProperties.getProperty('fileId')==fileId)) {
      ScriptProperties.setProperty('mappingString',''); 
      ScriptProperties.setProperty('fileNameString','');
  }
  ScriptProperties.setProperty('fileId', fileId);
  var sheet = this.ss.getSheetByName(sheetName);
  var lastCol = sheet.getLastColumn();
  var lastRow = sheet.getLastRow();
  var checkLastCol = normalizeHeader(sheet.getRange(1, lastCol).getValue());
  var clearStatus = e.parameter.clearStatus;
  ScriptProperties.setProperty('clearStatus', true);
  if ((checkLastCol == "mergeStatus")&&(clearStatus=="true")) {
    var range = sheet.getRange(2, lastCol, lastRow, 1);
    range.clear();
  }
  if (checkLastCol != "mergeStatus") {
    var range = sheet.getRange(1, lastCol+1);
    range.setValue("Merge Status");
    range.setFontColor("white");
    range.setBackgroundColor("black");
  }
  initialize();
  if (!(ScriptProperties.getProperty('mappingString'))||(ScriptProperties.getProperty('mappingString'==''))) {
  setMergeConditions();
  }
  app.close();
  return app; 
}


//Used to clear the fields below the folder listbox if the value is changed.  Prevents the duplication of field elements in the form.
function reset(){
  var app = UiApp.getActiveApplication();
  app.getElementById('fileListBox').setVisible(false);
  app.getElementById('fileLabel').setVisible(false);
  app.getElementById('settingsButton').setVisible(false);
  return app;
}

//Completes the dropdown for files under the folder dropdown based on the folder selected
function getFiles(e) {
  var app = UiApp.getActiveApplication();
  var panel = app.getElementById("settingsPanel");
  var fileLabel = app.createLabel().setId("fileLabel");
  fileLabel.setText("Select the template file you want to use");
  var fileListBox = app.createListBox().setName("fileName").setId("fileListBox").setWidth("300px");
  fileListBox.addItem('Select template file');
  var folderName = e.parameter.folderName;
  if (!folderName) {
    var tempFolderId = ScriptProperties.getProperty('folderId');
    folderName = DocsList.getFolderById(tempFolderId);
        }
        
    var folders = DocsList.getFolders(0,20);
    var indexFlag = 1;
    for (i=0; i < folders.length; i++) {
    if (folders[i].getName()==folderName) {
      indexFlag = i;
      break;
      }
    }  
   var folderId = folders[indexFlag].getId();
  
  var folder = DocsList.getFolderById(folderId);
  var files = folder.getFilesByType("document");
  for (i = 0; i < files.length; i++) {
    var fileName = files[i].getName();
    fileListBox.addItem(fileName);
  }
  app.getElementById('folderListBox').addChangeHandler(app.createServerClickHandler('reset'));
  var settingsSendHandler = app.createServerHandler('saveSettings').addCallbackElement(panel);
  var button = app.createButton("Save settings", settingsSendHandler).setId('settingsButton');
  panel.add(fileLabel);
  panel.add(fileListBox);
  panel.add(button);
  return app;
}