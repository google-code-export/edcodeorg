function preconfig() {
// if you are interested in sharing your complete workflow system for others to copy (with script settings)
// Select the "Generate preconfig()" option in the menu and
//#######Paste preconfiguration code below before sharing your system for copy#######

  
  
  
  
//#######End preconfiguration code#######
// Note: By design, calendarID's will not be copied along with script settings.
}


//Function used to create contents of "Read Me" sheet
function setReadMeText() {
 var ss = SpreadsheetApp.getActiveSpreadsheet();
 var sheet = ss.getSheetByName("Read Me");
 sheet.insertImage('http://www.youpd.org/sites/default/files/acquia_commons_logo36.png', 1, 1);
 var readMeText = "The formMule script installed on this spreadsheet allows for Google-Form-submitted data to trigger the send of emails and or the auto-creation of calendar events.  \n \n";
 readMeText = "The formMule script installed on this spreadsheet is a powerful workflow building block that enables";
 readMeText += " the automation of structured, repetitive communications tasks that are often mission-critical to the work of teams or small organizations.";
 readMeText += " This script has generated enormous time savings in some of New York City's most innovative yet resource-";
 readMeText += " strapped high schools, and represents the work of a collaboration amongst educators supported by New ";
 readMeText += "Visions for Public Schools.  If you are a for-profit entity making good use of this script, consider making";
 readMeText += " a donation to underwrite our open source development work.";
 readMeText += "\n \n";
 readMeText += "Out of the box, formMule requires a moment to understand.  Here are the basics, with screenshots below: \n \n";
 readMeText += "1) Google-Form-submitted data can auto-trigger the send of up to three separate, templated, merged emails and or the auto-creation of a single calendar event with specified guests.";
 readMeText += "\n \n";
 readMeText += "2) Because, in many cases, it would be too demanding or annoying to expect users to remember all the email addresses of the recipients of auto-triggered emails and calendar events, ";
 readMeText += "this script also handles the copying-down of formulas running in columns to the right of form entry data, which may often include a VLOOKUP function to fetch the contact email addresses";
 readMeText += "of various relevant parties within a workflow or communications loop.   If you don't know what a VLOOKUP is and would like a quick tutorial geared towards educators, visit: http://www.youpd.org/node/1801";
 readMeText += "\n \n";
 readMeText += "3) Email and calendar event functionality can be switched on and off, and set to trigger based on conditional values in the source data from the form.  For example, I might choose to send a different email ";
 readMeText += "depending on the values submitted by the user, or calculated in a calculated column.";
 readMeText += "\n \n";
 readMeText += "4) This script is built to enabled non-coders to create and share custom workflow solutions.  If you are an educator and have built a solution using this script that is likely to be useful to other schools, ";
 readMeText += "select the \"Package workflow for others to copy\" option in the formMule script menu and follow the instructions.  Other users will then be able to copy your entire system, including all script settings, ";
 readMeText += "and begin using it immediate in their own school.  Show your appreciation for this script by posting a screencast showing off your workflow at http://www.youpd.org";
 readMeText += "\n \n";
 readMeText += "Examples of formMule in use:";
 readMeText += "\n \n";
 readMeText += "Successful small schools often manage students in advisory caseloads, where a single adult is expected to serve as the first point of contact between the school and the home around issues from behavior to attendance";
 readMeText += " and academic performance/needs.  Logs of events corresponding to each of the areas on the part of any teacher in the school can be submitted in Google Forms and set up to automatically trigger communications with advisors, ";
 readMeText += "who are then empowered to serve as point person for communicating with the home. In this example, a VLOOKUP might be used to reference master lists of student email addresses and advisor email addresseses against unique field ";
 readMeText += "(student name or ID#) in the form data.   With the use of email conditions, different kinds of incidents might trigger additional emails to various members of a school team.";
 readMeText += "\n \n";
 readMeText += "A best practice for developmental supervision of teachers is providing regular feedback.  Many of our school leaders have adopted Google Forms based \"mini-observation\" trackers.  formMule can easily be installed on these trackers ";
 readMeText += "to enable the option to instantly email feedback or an email requesting an appointment for discussion following an observation.";
  
 sheet.setColumnWidth(1, 800);
 sheet.setRowHeight(1, 100);
 sheet.getRange("A2").setValue(this.scriptTitle).setFontSize(18)
   sheet.getRange("A3").setValue("support available at http://www.youpd.org/formmule");
 sheet.getRange("A4").setValue(readMeText);
 sheet.insertImage("http://www.youpd.org/sites/default/files/formmule3_001.png", 1, 5);
 sheet.setRowHeight(5, 600);
 sheet.insertImage("http://www.youpd.org/sites/default/files/formmule2_001.png", 1, 6);
 sheet.setRowHeight(6, 600);
 sheet.insertImage("http://www.youpd.org/sites/default/files/formmule_conditions.png", 1, 7);
 sheet.setRowHeight(7, 600);
}



