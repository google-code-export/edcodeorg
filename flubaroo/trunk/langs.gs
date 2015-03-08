// lang.gas
// Contains definitions for all localized strings in Flubaroo.
// Any language specific string or message should be placed in this file in the format shown.

// ** For instructions on how to add your own translation, see here: 
//         http://www.edcode.org/kb/flubaroo/translation-instructions

// To do (June 7, 13): Strings in histogram are not translated. need to url encode translated versions in the code, first.

gbl_lang_id = ""; // identifies the language if the UI.

function setLanguage()
{   
   var ss = SpreadsheetApp.getActiveSpreadsheet();
   var app = UiApp.createApplication()
                      .setTitle(langstr("FLB_STR_MENU_SET_LANGUAGE"))
                      .setWidth("230").setHeight("100");

   var handler = app.createServerClickHandler('setLanguageHandler');
  
   // create the main panel to hold all content in the UI for this step,
   var main_panel = app.createVerticalPanel()
                       .setStyleAttribute('border-spacing', '10px');
   app.add(main_panel);
  
   ss.show(app);
 
   // create a pull-down box containing all the questions which identify a
   // student. 
   var lbox_name = "language_select";
   var lbox = app.createListBox(false).setId(lbox_name).setName(lbox_name);
   var position = -1;
   
   for (var item in langs)
     {
       lbox.addItem(langs[item]["FLB_LANG_IDENTIFIER"], item);
     }
   
   lbox.setSelectedIndex(0);    
   handler.addCallbackElement(lbox);  
  
    var hpanel = app.createHorizontalPanel()
       .setStyleAttribute('border-spacing', '6px')
    .add(app.createLabel(langstr("FLB_STR_MENU_SET_LANGUAGE") + ":"))
       .add(lbox);
   main_panel.add(hpanel);

   var btnSubmit = app.createButton(langstr("FLB_STR_BUTTON_CONTINUE"),handler).setId('CONTINUE');
  
   main_panel.add(btnSubmit);
 
   ss.show(app);   
 }

function setLanguageHandler(e)
 {
   var ss = SpreadsheetApp.getActiveSpreadsheet();
   var app = UiApp.getActiveApplication();

   var up = PropertiesService.getUserProperties();
   
   var language_id = e.parameter.language_select;
 
   up.setProperty(USER_PROP_LANGUAGE_ID, language_id);
   
   // reload menu
   createFlubarooMenu();
   
   // rename Student Submissions sheet, if it was already set to an English name.
   //renameSubmissionsSheet();
   
   app.close()
   return app;
 }


// langstr: Given a string id, returns the localized version of that string, based on the global gbl_lang_id.
function langstr(id)
{
  var up = PropertiesService.getUserProperties();
  
  if (gbl_lang_id == "")
    {
      // not yet defined. look it up!
      gbl_lang_id = up.getProperty(USER_PROP_LANGUAGE_ID);
      
      if (gbl_lang_id == "" || gbl_lang_id == null || gbl_lang_id === undefined)
        {
          // never explicitly set by user (via menu). set to default.
          gbl_lang_id = "en-us"; // default
        }
    }
  
  // Return the specified string in the language selected. if not defined, return the English version.
  if (langs[gbl_lang_id][id])
    {
      return langs[gbl_lang_id][id];
    }
  else
    {
      return langs['en-us'][id];
    }
}
// Special version of langstr that returns the string in English-US.
// Used in the rare & special case when we can't lookup the user's preferred language.
function langstr_en(id)
{
  return langs["en-us"][id];
}

// checkForMissingTranslations: Used for testing purposes only, before publishing a 
// new Add-on when a new language has been added.
function checkForMissingTranslations()
{    
  var en_translations = langs['en-us']; // dont' change
  
  for (var lang_to_check in langs)
    {
      Debug.info("checking " + lang_to_check);
      for (var en_str_to_check in en_translations)
        {
          //Logger.log("checking: " + en_str_to_check);
          if (!(en_str_to_check in langs[lang_to_check]))
            {
              Debug.info(lang_to_check + " is missing: " + en_str_to_check);
            }
        }
    }
}

// langs:
// Global collection of localized strings used in Flubaroo. 
langs = { 

    // START ENGLISH ////////////////////////////////////////////////////////////////////////////////
  
    "en-us": {
        // Name to identify language in language selector
        "FLB_LANG_IDENTIFIER": "English",

        // Grading option which identifies a student
        "FLB_STR_GRADING_OPT_STUD_ID" : "Identifies Student",

        // Grading option which tells Flubaroo to skip grading on a question
        "FLB_STR_GRADING_OPT_SKIP_GRADING" : "Skip Grading",

        // Grading option for 1 point
        "FLB_STR_GRADING_OPT_1_PT" : "1 Point",

        // Grading option for 2 points
        "FLB_STR_GRADING_OPT_2_PT" : "2 Points",

        // Grading option for 3 points
        "FLB_STR_GRADING_OPT_3_PT" : "3 Points",

        // Grading option for 4 points
        "FLB_STR_GRADING_OPT_4_PT" : "4 Points",

        // Grading option for 5 points
        "FLB_STR_GRADING_OPT_5_PT" : "5 Points",

        // Message shown when grading is complete (1 of 2).
        "FLB_STR_RESULTS_MSG1" : "Grading has completed! A new worksheet called 'Grades' has been created. This worksheet contains a grade for each submission, and a summary of all grades at the top. ** Note: The 'Grades' sheet is not meant to be modified in any way, as this can interfere with emailing grades. If you need to modify this sheet, copy it and modify the copy.",

        // Message shown when grading is complete (2 of 2).
        "FLB_STR_RESULTS_MSG2" : "Tips: The very last row shows the percent of students who got each question correct, with overall low-scoring questions highlighted in orange. Also, individual students who scored below 70% will appear in red font.",

        // Instructions shown on Step 1 of grading.
        "FBL_STR_STEP1_INSTR" : "Please select a grading option for each of the questions in the assignment. Flubaroo has done its best to guess the best option for you, but you should check the option for each question yourself.",

        // Instructions shown on Step 2 of grading.
        "FBL_STR_STEP2_INSTR" : "Please select which submission should be used as the Answer Key. Typically this will be a submission made by you. All other submissions will be graded against the Answer Key, so take care to ensure that you select the right one.",

        // Message shown if not enough submissions to perform grading.
        "FBL_STR_GRADE_NOT_ENOUGH_SUBMISSIONS" : "There must are not enough submissions to perform grading. Ensure you've submitted an answer key, and/or try again when more students have submitted their answers.",

        // Please wait" message first shown when Flubaroo is first examining assignment.
        "FLB_STR_WAIT_INSTR1" : "Flubaroo is examining your assignment. Please wait...",

        // Please wait" message shown after Step 1 and Step 2, while grading is happening.
        "FLB_STR_WAIT_INSTR2" :  "Please wait while your assignment is graded. This may take a minute or two to complete.",

        // Asks user if they are sure they want to re-grade, if Grades sheet exists.
        "FLB_STR_REPLACE_GRADES_PROMPT" : "This will replace your existing grades. Are you sure you want to continue?",

        // Window title for "Preparing to grade" window
        "FLB_STR_PREPARING_TO_GRADE_WINDOW_TITLE" : "Flubaroo - Preparing to Grade",

        // Window title for "Please wait" window while grading occurs
        "FLB_STR_GRADING_WINDOW_TITLE" : "Flubaroo - Grading Your Assignment",

        // Window title for "Grading Complete" window after grading occurs
        "FLB_STR_GRADING_COMPLETE_TITLE" : "Flubaroo - Grading Complete",

        // Window title for grading Step 1
        "FLB_STR_GRADE_STEP1_WINDOW_TITLE" : "Flubaroo - Grading Step 1",

        // Window title for grading Step 2
        "FLB_STR_GRADE_STEP2_WINDOW_TITLE" : "Flubaroo - Grading Step 2",

        // "Grading Option" label that appears over first column in Step 1 of grading.
        "FLB_STR_GRADE_STEP1_LABEL_GRADING_OPTION" : "Grading Option",

        // "Question" label that appears over second column in Step 1 of grading.
        "FLB_STR_GRADE_STEP1_LABEL_QUESTION" : "Question",

        // "Select" label that appears over radio button in first column of Step 2 of grading.
        "FLB_STR_GRADE_STEP2_LABEL_SELECT" : "Select",

        // "Submission Time" label that appears over second column in Step 2 of grading.
        "FLB_STR_GRADE_STEP2_LABEL_SUBMISSION_TIME" : "Submission Time",

        // Label for "View Grades" button shown when grading completes.
        "FLB_STR_GRADE_BUTTON_VIEW_GRADES" : "View Grades",

        // Used for "summary" text shown at top of Grades sheet, and in report. 
        "FLB_STR_GRADE_SUMMARY_TEXT_SUMMARY" : "Summary",

        // Used for report and report email. Ex: "Report for 'My Test'" 
        "FLB_STR_GRADE_SUMMARY_TEXT_REPORT_FOR" : "Report for",

        // Points Possible. Used for text shown at top of Grades sheet, and in report.
        "FLB_STR_GRADE_SUMMARY_TEXT_POINTS_POSSIBLE" : "Points Possible",

        // Average Points. Used for text shown at top of Grades sheet, and in report.
        "FLB_STR_GRADE_SUMMARY_TEXT_AVERAGE_POINTS" : "Average Points",

        // Counted Submissions. Used for text shown at top of Grades sheet, and in report.
        "FLB_STR_GRADE_SUMMARY_TEXT_COUNTED_SUBMISSIONS" : "Counted Submissions",

        // Number of Low Scoring Questions. Used for text shown at top of Grades sheet, and in report.
        "FLB_STR_GRADE_SUMMARY_TEXT_NUM_LOW_SCORING" : "Number of Low Scoring Questions",

        // Name of column in Grades sheet that has total points scored.
        "FLB_STR_GRADES_SHEET_COLUMN_NAME_TOTAL_POINTS" : "Total Points",

        // Name of column in Grades sheet that has score as percent.
        "FLB_STR_GRADES_SHEET_COLUMN_NAME_PERCENT" : "Percent",

        // Name of column in Grades sheet that has number of times student made a submission.
        "FLB_STR_GRADES_SHEET_COLUMN_NAME_TIMES_SUBMITTED" : "Times Submitted",

        // Name of column in Grades sheet that indicates if grade was already emailed out.
        "FLB_STR_GRADES_SHEET_COLUMN_NAME_EMAILED_GRADE" : "Emailed Grade?",

        // Name of column in Grades sheet that allows teacher to enter optional student feedback
        "FLB_STR_GRADES_SHEET_COLUMN_NAME_STUDENT_FEEDBACK" : "Feedback for Student (Optional)",

        // Window title for emailing grades
        "FLB_STR_EMAIL_GRADES_WINDOW_TITLE" : "Flubaroo - Email Grades",

        // Instructions on how to email grades
        "FLB_STR_EMAIL_GRADES_INSTR" : "Flubaroo can email each student their grade, as well as the correct answers. Use the pull-down menu to select the question that asked students for their email address. If email addresses were not collected, then you will not be able to email grades.",

        // Notice that grades cannot be emailed because the user has exceeded their daily quota.
        "FLB_STR_EMAIL_DAILY_QUOTA_EXCEEDED" : "Flubaroo cannot email grades at this time because you have exceeded your daily quota of emails per day. This quota is set by Google for all Add-ons. Please try again later.",
      
        // Message about how many grade emails *have* been sent. This message is preceeded by a number.
        // Example: "5 grades were successfully emailed"
        "FLB_STR_VIEW_EMAIL_GRADES_NUMBER_SENT" : "grades were successfully emailed",

        // Message about how many grade emails *have NOT* been sent. This message is preceeded by a number.
        "FLB_STR_VIEW_EMAIL_GRADES_NUMBER_UNSENT" : "grades were not sent due to invalid or blank email addresses, because they have already been emailed their grades, or because you have exceeded your daily email quota.",

        // Message about how many grade emails *have NOT* been sent.
        "FLB_STR_VIEW_EMAIL_GRADES_NO_EMAILS_SENT" : "No grades were emailed because no valid email addresses were found, because all students have already been emailed their grades, or because you have exceeded your daily email quota.",     
      
        // Subject of the email students receive. Followed by assignment name. 
        // Example: Here is your grade for "Algebra Quiz #6"
        "FLB_STR_EMAIL_GRADES_EMAIL_SUBJECT" : "Here is your grade for",

        // First line of email sent to students
        // Example: This email contains your grade for "Algebra Quiz #6"
        "FLB_STR_EMAIL_GRADES_EMAIL_BODY_START" : "This email contains your grade for",

        // Message telling students not to reply to the email with their grades
        "FLB_STR_EMAIL_GRADES_DO_NOT_REPLY_MSG" : "Do not reply to this email",

        // Message that preceedes the student's grade
        "FLB_STR_EMAIL_GRADES_YOUR_GRADE" : "Your grade",

        // Message that preceedes the instructor's (optional) message in the email
        "FLB_STR_EMAIL_GRADES_INSTRUCTOR_MSG_BELOW" : "Below is a message from your instructor, sent to the entire class",

        // Message that preceedes the instructor's (optional) feedback for the student in the email
        "FLB_STR_EMAIL_GRADES_STUDENT_FEEDBACK_BELOW" : "Your instructor has this feedback just for you",

        // Message that preceedes the summary of the student's information (name, date, etc)
        "FLB_STR_EMAIL_GRADES_SUBMISSION_SUMMARY" : "Summary of your submission",

        // Message that preceedes the table of the students scores (no answer key sent)
        "FLB_STR_EMAIL_GRADES_BELOW_IS_YOUR_SCORE" : "Below is your score for each question",

        // Message that preceedes the table of the students scores, and answer key
        "FLB_STR_EMAIL_GRADES_BELOW_IS_YOUR_SCORE_AND_THE_ANSWER" : "Below is your score for each question, along with the correct answer",

        // Header for the  column in the table of scores in the email which lists the question asked.
        "FLB_STR_EMAIL_GRADES_SCORE_TABLE_QUESTION_HEADER" : "Question",

        // Header for the  column in the table of scores in the email which lists the student's answer.
        "FLB_STR_EMAIL_GRADES_SCORE_TABLE_YOUR_ANSWER_HEADER" : "Your Answer",

        // Header for the  column in the table of scores in the email which lists the correct answer.
        "FLB_STR_EMAIL_GRADES_SCORE_TABLE_CORRECT_ANSWER_HEADER" : "Correct Answer",

        // Header for the column in the table of scores in the email which lists the student's score (0, 1, 2...)
        "FLB_STR_EMAIL_GRADES_SCORE_TABLE_YOUR_SCORE_HEADER" : "Your Score",

        // Header for the  column in the table of scores in the email which lists the points possible (e.g. 5).
        "FLB_STR_EMAIL_GRADES_SCORE_TABLE_POINTS_POSSIBLE_HEADER" : "Points Possible",

        // Header for the  column in the table of scores in the email which lists the Help Tip (if provided)
        "FLB_STR_EMAIL_GRADES_SCORE_TABLE_HELP_TIP_HEADER" : "Help for this Question",

        // Label for "points" used in the new style email summary of grades
        "FLB_STR_EMAIL_GRADES_SCORE_TABLE_POINTS" : "point(s)",

        // Label for "Correct" questions in new style email summary of grades
        "FLB_STR_EMAIL_GRADES_SCORE_TABLE_CORRECT" : "Correct",

        // Label for "Incorrect" questions in new style email summary of grades
        "FLB_STR_EMAIL_GRADES_SCORE_TABLE_INCORRECT" : "Incorrect",

        // Footer for the email sent to students, advertising Flubaroo.
        "FLB_STR_EMAIL_GRADES_EMAIL_FOOTER" : "This email was generated by Flubaroo, a free tool for grading and assessments",

        // Link at the end of the footer. Leads to www.flubaroo.com
        "FLB_STR_EMAIL_GRADES_VISIT_FLUBAROO" : "Visit flubaroo.com",

        // Subject of the record email sent to the instructor, when grades are emailed to the class.
        // Followed by the assignment name.
        // e.g. Record of grades emailed for Algebra Quiz #6
        "FLB_STR_EMAIL_RECORD_EMAIL_SUBJECT": "Record of grades emailed for",

        // Used in the record email sent to the instructor after she emails grades.
        // Labels the name of the assignment, in the summary table.
        "FLB_STR_EMAIL_RECORD_ASSIGNMENT_NAME": "Assignment Name",

        // Used in the record email sent to the instructor after she emails grades.
        // Labels the number of emails sent, in the summary table.
        "FLB_STR_EMAIL_RECORD_NUM_EMAILS_SENT": "Number of Emails Sent",

        // Used in the record email sent to the instructor after she emails grades.
        // Labels the number of graded submissions, in the summary table
        "FLB_STR_EMAIL_RECORD_NUM_GRADED_SUBM": "Number of Graded Submissions",

        // Used in the record email sent to the instructor after she emails grades.
        // Labels the average score in points (vs percent), in the summary table
        "FLB_STR_EMAIL_RECORD_AVERAGE_SCORE": "Average Score (points)",

        // Used in the record email sent to the instructor after she emails grades.
        // Labels the points possible, in the summary table
        "FLB_STR_EMAIL_RECORD_POINTS_POSSIBLE": "Points Possible",

        // Used in the record email sent to the instructor after she emails grades.
        // Indicated if an answer key was provided to the students, in the summary table
        "FLB_STR_EMAIL_RECORD_ANSWER_KEY_PROVIDED": "Answer Key Provided?",

        // Used in the record email sent to the instructor after she emails grades.
        // Value in summary table if answer key was NOT sent to students by instructor
        "FLB_STR_EMAIL_RECORD_ANSWER_KEY_NO": "No",

        // Used in the record email sent to the instructor after she emails grades.
        // Value in summary table if answer key WAS sent to students by instructor
        "FLB_STR_EMAIL_RECORD_ANSWER_KEY_YES": "Yes",

        // Used in the record email sent to the instructor after she emails grades.
        // Message that preceeds what message the instructor email to her students.
        "FLB_STR_EMAIL_RECORD_INSTRUCTOR_MESSAGE": "You also included this message",

        // About Flubaroo message (1 of 2)
        "FLB_STR_ABOUT_FLUBAROO_MSG1" : "Flubaroo is a free, time-saving tool that allows teachers to quickly grade multiple choice assignments and analyze the results",

        // About Flubaroo message (2 of 2)
        "FLB_STR_ABOUT_FLUBAROO_MSG2" : "To learn more, visit www.flubaroo.com. Also send feedback or ideas to dave@edcode.org.",

        // Message that appears when "Student Submissions" sheet cannot be located.
        "FLB_STR_CANNOT_FIND_SUBM_MSG" : "Flubaroo could not determine which sheet contains the student submissions. Please locate this sheet, and rename it to: ",

        // Message that appears when "Grades" sheet cannot be located.
        "FLB_STR_CANNOT_FIND_GRADES_MSG" : "Flubaroo could not determine which sheet contains the grades. Please grade the assignment, or locate this sheet, and rename it to: ",

        // Menu option to grade assignment.
        "FLB_STR_MENU_GRADE_ASSIGNMENT" : "Grade Assignment",

        // Menu option to re-grade assignment.
        "FLB_STR_MENU_REGRADE_ASSIGNMENT" : "Regrade Assignment",

        // Menu option to email grades.
        "FLB_STR_MENU_EMAIL_GRADES" : "Email Grades",

        // Menu option to hide student feedback (hides the column)
        "FLB_STR_MENU_HIDE_FEEDBACK" : "Hide Student Feedback",

        // Menu option to edit student feedback (unhides the column)
        "FLB_STR_MENU_EDIT_FEEDBACK" : "Edit Student Feedback",

        // Menu option to hide help tips
        "FLB_STR_MENU_HIDE_HELP_TIPS" : "Hide Help Tips",

        // Menu option to edit help tips
        "FLB_STR_MENU_EDIT_HELP_TIPS" : "Edit Help Tips",

        // Menu option to view report.
        "FLB_STR_MENU_VIEW_REPORT" : "View Report",

        // Menu option to learn About Flubaroo.
        "FLB_STR_MENU_ABOUT" : "About Flubaroo",

        // Menu title for "Advanced" sub-menu
        "FLB_STR_MENU_ADVANCED" : "Advanced",
      
        // Menu title for Advanced > Options
        "FLB_STR_MENU_ADV_OPTIONS" : "Advanced Options",
      
        // Menu option to choose the language.
        "FLB_STR_MENU_SET_LANGUAGE" : "Set Language",

        // Menu option to enable autograde.
        "FLB_STR_MENU_ENABLE_AUTO_GRADE" : "Enable Autograde",
  
        // Menu option to disable autograde.
        "FLB_STR_MENU_DISABLE_AUTO_GRADE" : "Disable Autograde",
      
        // Menu option to see reamining daily email quota
        "FLB_STR_MENU_SHOW_EMAIL_QUOTA" : "Check Email Quota",
      
        // Menu option shown to enable Flubaroo in a sheet where it's never been used before
        "FLB_STR_MENU_ENABLE" : "Enable Flubaroo in this sheet",
      
        // Message to show when menu option for FLB_STR_MENU_ENABLE is chosen
        "FLB_STR_FLUBAROO_NOW_ENABLED" : "Flubaroo has been enabled for this sheet. You may now access it from the menu.",
      
        // Word that appears on the "Continue" button in grading and emailing grades.
        "FLB_STR_BUTTON_CONTINUE" : "Continue",

        // Name of "Student Submissions" sheet
        "FLB_STR_SHEETNAME_STUD_SUBM" : gbl_subm_sheet_name,     

        // Name of "Grades" sheet
        "FLB_STR_SHEETNAME_GRADES" : gbl_grades_sheet_name,

        // Text put in Grades sheet when a question isnt graded.
        "FLB_STR_NOT_GRADED" : "Not Graded",

        // Message that is displayed when a new version of Flubaroo is installed.
        "FLB_STR_NEW_VERSION_NOTICE" : "You've installed a new version Flubaroo! Visit flubaroo.com/blog to see what's new.",

        // Headline for notifications / alerts.
        "FLB_STR_NOTIFICATION" : "Flubaroo Notification",

        // For emailing grades, question which asks user to identify email question.
        "FLB_STR_EMAIL_GRADES_IDENTIFY_EMAIL" : "Email Address Question: ", // note the space after ":"

        // For emailing grades, asks user if list of questions and scores should be sent.
        "FLB_STR_EMAIL_GRADES_QUESTIONS_AND_SCORES" : "Include List of Questions and Scores: ", // note the space after ":"

        // For emailing grades, asks user if answer key should be sent...
        "FLB_STR_EMAIL_GRADES_ANSWER_KEY" : "Include Answer Key: ", // note the space after ":"
        
        // For emailing grades, appears before text box for optional instructor message.
        "FLB_STR_EMAIL_GRADES_INSTRUCTOR_MESSAGE" : "Message To Include in Email (optional):",

        // Window title for View Report window
        "FLB_STR_VIEW_REPORT_WINDOW_TITLE" : "Flubaroo - Grading Report",

        // Title of historgram chart in report
        "FLB_STR_VIEW_REPORT_HISTOGRAM_CHART_TITLE" : "Histogram of Grades",

        // Y-Axis (vertical) title of historgram chart in report
        "FLB_STR_VIEW_REPORT_HISTOGRAM_Y-AXIS_TITLE" : "Submissions",

        // X-Axis (horizontal) title of historgram chart in report
        "FLB_STR_VIEW_REPORT_HISTOGRAM_X-AXIS_TITLE" : "Points Scored",

        // Label of "Email Me Report" button in View Report window
        "FLB_STR_VIEW_REPORT_BUTTON_EMAIL_ME" : "Email Me Report",

        // Notification that tells who the report was emailed to (example: "The report has been emailed to: bob@hi.com")
        "FLB_STR_VIEW_REPORT_EMAIL_NOTIFICATION" : "The report has been emailed to",
      
        // Message to show the user in the top-left cell of the Grading sheet when grading starts. 
        "FLB_STR_GRADING_CELL_MESSAGE" : "Grading latest submissions...",
      
        // Message that pops up to notify the user that autograde is on.
        "FLB_STR_AUTOGRADE_IS_ON" : "Autograde is enabled. Flubaroo is waiting for new submissions to grade. Don't make changes to any sheets until autograde is turned off.",

        // Message that pops up to notify the user that autograde is on.
        "FLB_STR_AUTOGRADE_IS_OFF" : "Autograde has been turned off.",
      
        // Message to ask the user if they want to grade recent, ungraded submissions, before autograde is enabled.
        "FLB_STR_AUTOGRADE_GRADE_RECENT" : "Some recent submissions have yet to be graded. Would you like Flubaroo to grade them first, before autograde is enabled?",

        // Message to tell the user that autograde must gather grading and email settings before being turned on.      
        "FLB_STR_AUTOGRADE_SETUP" : "Before enabling autograde you must first setup your grading and email settings. Click 'OK' to proceed.",
 
        // Message asking user if they'd like to update their grading and email settings before turning on autograde.
        "FLB_STR_AUTOGRADE_UPDATE" : "Before enabling autograde, would you like to update your grading and email settings?",
      
        // Title of Advanced Options window
        "FLB_STR_ADV_OPTIONS_WINDOW_TITLE" : "Advanced Options",

        // Advanced Options notice that appears at the top of the window, telling the user to read the help center articles.
        "FLB_STR_ADV_OPTIONS_NOTICE" : "Only change these settings if you have read the correponding help articles",
      
        // Text for Advanced Options, describing option to not use noreply@ email address when sending grades.      
        "FLB_STR_ADV_OPTIONS_NO_NOREPLY" : "Use my return address when emailing grades, rather than the noreply@ address.",
     
        // Text for Advanced Options, describing option to send grades via Google Docs, instead of email.
        "FLB_STR_ADV_OPTIONS_GOOGLE_DOCS" : "Instead of email, send grades via a Google Doc shared with each student. (EXPERIMENTAL!)",
      
        // Text for Advanced Options, describing option to send each student a link to edit their response.
        "FLB_STR_ADV_OPTIONS_EMAIL_EDIT_LINK" : "Upon submission, auto-email the student a link to quickly edit their response.",
      
        // Text for Advanced Options, describing option to change the 70% pass rate.
        "FLB_STR_ADV_OPTIONS_PASS_RATE" : "Percentage below which student info is highlighted in red: ",

        // Message about how many more emails user can send that day. Shown from the Advanced > Check Email Quota menu.  
        "FLB_STR_EMAIL_QUOTA_MSG" : "You have this many emails left in your daily quota: ",
    },
    // END ENGLISH //////////////////////////////////////////////////////////////////////////////////

    // START SPANISH ////////////////////////////////////////////////////////////////////////////////
    // Thanks to these contributors for the Spanish translation: Felipe Calvo, Gabriel Crivelli, Luis Escolar, Iñaki Fernández, Manuel Fernández, Gatech López.
    "es-es": {
        "FLB_LANG_IDENTIFIER": "Español (Spanish)",

        "FLB_STR_GRADING_OPT_STUD_ID" : "Identifica alumno",

        "FLB_STR_GRADING_OPT_SKIP_GRADING" : "No evaluar",

        "FLB_STR_GRADING_OPT_1_PT" : "1 Punto",

        "FLB_STR_GRADING_OPT_2_PT" : "2 Puntos",

        "FLB_STR_GRADING_OPT_3_PT" : "3 Puntos",

        "FLB_STR_GRADING_OPT_4_PT" : "4 Puntos",

        "FLB_STR_GRADING_OPT_5_PT" : "5 Puntos",

        "FLB_STR_RESULTS_MSG1" : "¡La calificación ha finalizado! Se ha creado una nueva hoja de cálculo    llamada 'Calificaciones'.    Esta hoja de cálculo contiene una calificación por cada envío y un resumen de todas    las calificaciones en la parte superior. ** Nota: La hoja de cálculo 'Calificaciones'    no debe ser modificada, ya que puede interferir en el envío de las calificaciones por   correo electrónico. Si necesita modificar esta hoja, por favor, haga una copia    y modifique dicha copia.",

        "FLB_STR_RESULTS_MSG2" : "Aviso: La última fila muestra el porcentaje de respuestas correctas.  Las preguntas con aciertos inferiores al 70 % se destacan con fondo de color naranja.  También se destaca con texto en rojo a los estudiantes que obtuvieron  una calificación inferior al 70%.",

        "FBL_STR_STEP1_INSTR" : "Por favor, seleccione una opción de calificación para cada una de las preguntas. Flubaroo se ha diseñado para tratar de identificar la opción adecuada, pero usted debe comprobar si la opción escogida para cada cuestión es la correcta.",

        "FBL_STR_STEP2_INSTR" : "Por favor, seleccione la fila que se utilizará como Clave de Respuestas. Normalmente, debería ser la primera enviada por usted. El resto de respuestas serán evaluadas comparando con la Fila Clave. Preste atención para asegurarse de seleccionar la correcta.",

        "FBL_STR_GRADE_NOT_ENOUGH_SUBMISSIONS" : "Importante: Debe haber al menos 2 respuestas para poder Calificar. Inténtelo de nuevo cuando al menos haya 2 filas con respuestas.",

        "FLB_STR_WAIT_INSTR1" : "Flubaroo está comprobando sus asignaciones. Por favor, espere...",

        "FLB_STR_WAIT_INSTR2" : "Por favor, espere mientras se procede a la calificación. Puede tardar entre uno y dos minutos en terminar.",

        "FLB_STR_REPLACE_GRADES_PROMPT" : "Se reemplazarán las calificaciones existentes. ¿Quieres continuar? ",

        "FLB_STR_PREPARING_TO_GRADE_WINDOW_TITLE" : "Flubaroo - Preparando para Calificar",

        "FLB_STR_GRADING_WINDOW_TITLE" : "Flubaroo - Calificando Su Examen",

        "FLB_STR_GRADING_COMPLETE_TITLE" : "¡Flubaroo - Clasificación ha Finalizado!",

        "FLB_STR_GRADE_STEP1_WINDOW_TITLE" : "Flubaroo - Calificación PASO 1",

        "FLB_STR_GRADE_STEP2_WINDOW_TITLE" : "Flubaroo - Calificación PASO 2",

        "FLB_STR_GRADE_STEP1_LABEL_GRADING_OPTION" : "Opciones de Calificación",

        "FLB_STR_GRADE_STEP1_LABEL_QUESTION" : "Cuestión",

        "FLB_STR_GRADE_STEP2_LABEL_SELECT" : "Seleccione",

        "FLB_STR_GRADE_STEP2_LABEL_SUBMISSION_TIME" : "Fecha de Envío",

        "FLB_STR_GRADE_BUTTON_VIEW_GRADES" : "Ver calificaciones",

        "FLB_STR_GRADE_SUMMARY_TEXT_SUMMARY" : "Resultados",

        "FLB_STR_GRADE_SUMMARY_TEXT_REPORT_FOR" : "Informe para",

        "FLB_STR_GRADE_SUMMARY_TEXT_POINTS_POSSIBLE" : "Puntos Posibles",

        "FLB_STR_GRADE_SUMMARY_TEXT_AVERAGE_POINTS" : "Promedio de Puntos",

        "FLB_STR_GRADE_SUMMARY_TEXT_COUNTED_SUBMISSIONS" : "Número de Envíos",

        "FLB_STR_GRADE_SUMMARY_TEXT_NUM_LOW_SCORING" : "Preguntas con Calificación inferior al 70%",

        "FLB_STR_GRADES_SHEET_COLUMN_NAME_TOTAL_POINTS" : "Total Puntos",

        "FLB_STR_GRADES_SHEET_COLUMN_NAME_PERCENT" : "Porcentaje",

        "FLB_STR_GRADES_SHEET_COLUMN_NAME_TIMES_SUBMITTED" : "Número de Envíos",

        "FLB_STR_GRADES_SHEET_COLUMN_NAME_EMAILED_GRADE" : "¿Calificaciones enviadas?", 

        "FLB_STR_GRADES_SHEET_COLUMN_NAME_STUDENT_FEEDBACK" : "Comentario para el alumno (Opcional)",

        "FLB_STR_EMAIL_GRADES_WINDOW_TITLE" : "Flubaroo - Envío de Calificaciones",

        "FLB_STR_EMAIL_GRADES_INSTR" : "Flubaroo puede enviar por correo a cada alumno su calificación, así como las respuestas correctas. Use el menú desplegable para seleccionar la pregunta que contiene la dirección de correo electrónico. Si las direcciones de correo electrónico no fueron enviadas por los alumnos, no será posible enviar las calificaciones.",

        "FLB_STR_EMAIL_DAILY_QUOTA_EXCEEDED" : "Flubaroo no puede enviar por correo electrónico los grados en este momento, ya que ha superado su cuota diaria de correos electrónicos por día. Esta cuota es fijada por Google. Por favor, inténtelo de nuevo más tarde.",
      
        "FLB_STR_VIEW_EMAIL_GRADES_NUMBER_SENT" : " informes de Calificaciones se enviaron corectamente",

        "FLB_STR_VIEW_EMAIL_GRADES_NUMBER_UNSENT" : "envíos no se han realizado - dirección incorrecta,en blanco o ya fueron efectuados con anterioridad.",

        "FLB_STR_VIEW_EMAIL_GRADES_NO_EMAILS_SENT" : "No se ha efectuado el envío - No se encontraron direcciones válidaso el envío ya se ha realizado.",

        "FLB_STR_EMAIL_GRADES_EMAIL_SUBJECT" : "Te enviamos tus resultados del examen:",

        "FLB_STR_EMAIL_GRADES_EMAIL_BODY_START" : "Este correo contiene tus calificaciones para",

        "FLB_STR_EMAIL_GRADES_DO_NOT_REPLY_MSG" : "Por favor no responda a este correo",

        "FLB_STR_EMAIL_GRADES_YOUR_GRADE" : "Calificación",

        "FLB_STR_EMAIL_GRADES_INSTRUCTOR_MSG_BELOW" : "Debajo verás un mensaje de tu Profesor/a, envió a toda la clase",

        "FLB_STR_EMAIL_GRADES_STUDENT_FEEDBACK_BELOW" : "Comentario de tu profesor/a, sólo para ti",

        "FLB_STR_EMAIL_GRADES_SUBMISSION_SUMMARY" : "Resumen de tu examen",

        "FLB_STR_EMAIL_GRADES_BELOW_IS_YOUR_SCORE" : "Debajo está tu puntuación para cada pregunta",

        "FLB_STR_EMAIL_GRADES_BELOW_IS_YOUR_SCORE_AND_THE_ANSWER" : "Debajo está tu puntuación para cada pregunta junto a la respuesta correcta",

        "FLB_STR_EMAIL_GRADES_SCORE_TABLE_QUESTION_HEADER" : "Pregunta",

        "FLB_STR_EMAIL_GRADES_SCORE_TABLE_YOUR_ANSWER_HEADER" : "Su Respuesta",

        "FLB_STR_EMAIL_GRADES_SCORE_TABLE_CORRECT_ANSWER_HEADER" : "Respuesta Correcta",

        "FLB_STR_EMAIL_GRADES_SCORE_TABLE_YOUR_SCORE_HEADER" : "Tu Puntuación",

        "FLB_STR_EMAIL_GRADES_SCORE_TABLE_POINTS_POSSIBLE_HEADER" : "Puntos Posibles",

        "FLB_STR_EMAIL_GRADES_SCORE_TABLE_HELP_TIP_HEADER" : "Ayuda para esta Pregunta/Ítem",

        "FLB_STR_EMAIL_GRADES_SCORE_TABLE_POINTS" : "punto(s)",

        "FLB_STR_EMAIL_GRADES_SCORE_TABLE_CORRECT" : "Correcta",

        "FLB_STR_EMAIL_GRADES_SCORE_TABLE_INCORRECT" : "Incorrecta",

        "FLB_STR_EMAIL_GRADES_EMAIL_FOOTER" : "Este correo fue generado por Flubaroo, una aplicación de uso gratuito para evaluar y enviar calificaciones",

        "FLB_STR_EMAIL_GRADES_VISIT_FLUBAROO" : "Visita flubaroo.com",

        "FLB_STR_EMAIL_RECORD_EMAIL_SUBJECT": "Informe sobre tu envío de calificaciones en",

        "FLB_STR_EMAIL_RECORD_ASSIGNMENT_NAME": "Nombre del Examen",

        "FLB_STR_EMAIL_RECORD_NUM_EMAILS_SENT": "Cantidad de Correos Electrónicos Enviados",

        "FLB_STR_EMAIL_RECORD_NUM_GRADED_SUBM": "Cantidad de Envíos Calificados",

        "FLB_STR_EMAIL_RECORD_AVERAGE_SCORE": "Puntuación Promedio (puntos)",

        "FLB_STR_EMAIL_RECORD_POINTS_POSSIBLE": "Máxima Calificación Posible",

        "FLB_STR_EMAIL_RECORD_ANSWER_KEY_PROVIDED": "¿Lista de Respuestas Enviada? ",

        "FLB_STR_EMAIL_RECORD_ANSWER_KEY_NO": "No",

        "FLB_STR_EMAIL_RECORD_ANSWER_KEY_YES": "Si",

        "FLB_STR_EMAIL_RECORD_INSTRUCTOR_MESSAGE": "Usted incluyó este mensaje",

        "FLB_STR_ABOUT_FLUBAROO_MSG1" : "Flubaroo es una herramienta libre, que permite ahorrar tiempo a los profesores, ya que califica rápidamente pruebas de selección múltiple y analiza los resultados de forma automatizada.",

        "FLB_STR_ABOUT_FLUBAROO_MSG2" : "Para aprender más visite www.flubaroo.com. También puede enviar sus comentarios o ideas a dave@edcode.org.",

        "FLB_STR_CANNOT_FIND_SUBM_MSG" : "Flubaroo no puede determinar la hoja de cálculo que contiene los envíos de los estudiantes. Por favor localice esta hoja y renómbrela como: ",

        "FLB_STR_CANNOT_FIND_GRADES_MSG" : "Flubaroo no puede determinar la hoja de cálculo que contiene los calificaciones. Por favor, volver a calificar, o localice esta hoja y renómbrela como: ",

        "FLB_STR_MENU_GRADE_ASSIGNMENT" : "Calificar Tarea",

        "FLB_STR_MENU_REGRADE_ASSIGNMENT" : "Volver a Calificar",

        "FLB_STR_MENU_EMAIL_GRADES" : "Enviar Calificaciones",

        "FLB_STR_MENU_HIDE_FEEDBACK" : "Ocultar Comentarios Para Los Alumnos",

        "FLB_STR_MENU_EDIT_FEEDBACK" : "Mostrar Comentarios Para Los Alumnos",

        "FLB_STR_MENU_HIDE_HELP_TIPS" : "Ocultar Ayuda Para Preguntas",

        "FLB_STR_MENU_EDIT_HELP_TIPS" : "Mostrar Ayuda Para Preguntas",

        "FLB_STR_MENU_VIEW_REPORT" : "Ver Informe",

        "FLB_STR_MENU_ABOUT" : "Acerca de Flubaroo",

        "FLB_STR_MENU_SET_LANGUAGE" : "Seleccionar Idioma",

        "FLB_STR_BUTTON_CONTINUE" : "Continuar",

        "FLB_STR_SHEETNAME_STUD_SUBM" : "Respuestas",

        "FLB_STR_SHEETNAME_GRADES" : "Calificaciones",

        "FLB_STR_NOT_GRADED" : "No calificada",

        "FLB_STR_NEW_VERSION_NOTICE" : "¡Has instalado una nueva versión de Flubaroo! Visita flubaroo.com/blog para ver las novedades.",

        "FLB_STR_NOTIFICATION" : "Notificación de Flubaroo",

        "FLB_STR_EMAIL_GRADES_IDENTIFY_EMAIL" : "Asunto del Email: ",

        "FLB_STR_EMAIL_GRADES_QUESTIONS_AND_SCORES" : "Incluir la lista de preguntas y puntuaciones: ",

        "FLB_STR_EMAIL_GRADES_ANSWER_KEY" : "Incluir las claves de respuestas correctas: ",

        "FLB_STR_EMAIL_GRADES_INSTRUCTOR_MESSAGE" : "Mensaje para incluir en el correo electrónico (opcional):",

        "FLB_STR_VIEW_REPORT_WINDOW_TITLE" : "Flubaroo - Informe de Calificaciones",

        "FLB_STR_VIEW_REPORT_HISTOGRAM_CHART_TITLE" : "Histograma de Calificaciones",

        "FLB_STR_VIEW_REPORT_HISTOGRAM_Y-AXIS_TITLE" : "Envíos",

        "FLB_STR_VIEW_REPORT_HISTOGRAM_X-AXIS_TITLE" : "Respuestas Correctas",

        "FLB_STR_VIEW_REPORT_BUTTON_EMAIL_ME" : "Enviarme el informe por correo",

        "FLB_STR_VIEW_REPORT_EMAIL_NOTIFICATION" : "El informe ha sido enviado a"
    },
    // END SPANISH ////////////////////////////////////////////////////////////////////////////////
  
    // START SWEDISH ////////////////////////////////////////////////////////////////////////////// 
    // Thanks to these contributors for the Swedish translation: Carl Holmberg
    "sv-se": {
        "FLB_LANG_IDENTIFIER": "Svenska (Swedish)",

        "FLB_STR_GRADING_OPT_STUD_ID" : "Identifierar elev",

        "FLB_STR_GRADING_OPT_SKIP_GRADING" : "Poängsätt inte",

        "FLB_STR_GRADING_OPT_1_PT" : "1 poäng",

        "FLB_STR_GRADING_OPT_2_PT" : "2 poäng",

        "FLB_STR_GRADING_OPT_3_PT" : "3 poäng",

        "FLB_STR_GRADING_OPT_4_PT" : "4 poäng",

        "FLB_STR_GRADING_OPT_5_PT" : "5 poäng",

        "FLB_STR_RESULTS_MSG1" : "Poängsättning har avslutats! Ett nytt blad med namnet 'Poäng' har skapats. Detta blad innehåller poängen för varje elev och en sammanfattning av alla poäng överst. ** Observera: Det är inte tänkt att bladet 'Poäng' ska ändras på något sätt då detta kan störa epostandet av poängen. Om du behöver ändra i bladet så kan du kopiera bladet och ändra i kopian.",
      
        "FLB_STR_RESULTS_MSG2" : "Tips: Sista raden visar hur många procent av eleverna som hade rätt svar och med frågor med generellt låga poäng markerade i orange. Dessutom markeras elever med mindre än 70% av poängen i rött.",

        "FBL_STR_STEP1_INSTR" : "Vänligen välj ett poängsättningsalternativ för varje fråga i uppgiften. Flubaroo har försökt gissa det bästa alternativet, men du bör själv kontrollera varje val.",

        "FBL_STR_STEP2_INSTR" : "Vänligen välj vilken svarsrad som ska användas som svarsnyckel. Vanligen är detta en svarsrad som du bidragit med. Alla andra rader kommer att poängsättas mot svarsnyckeln, så se till att välja rätt rad.",

        "FBL_STR_GRADE_NOT_ENOUGH_SUBMISSIONS" : "För att kunna poängsätta måste det finnas minst 2 svarsrader. Vänligen försök igen när fler elever svarat.",

        "FLB_STR_WAIT_INSTR1" : "Flubaroo undersöker uppgiften. Vänligen vänta...",

        "FLB_STR_WAIT_INSTR2" :  "Vänligen vänta medan uppgiften poängsätts. Detta kan ta ett par minuter att slutföra.",

        "FLB_STR_REPLACE_GRADES_PROMPT" : "Detta kommer att ersätta din poäng. Är du säker på att du vill fortsätta?",

        "FLB_STR_PREPARING_TO_GRADE_WINDOW_TITLE" : "Flubaroo - Förbereder poängsättning",

        "FLB_STR_GRADING_WINDOW_TITLE" : "Flubaroo - Poängsätter uppgiften",

        "FLB_STR_GRADING_COMPLETE_TITLE" : "Flubaroo - Poängsättning klar",

        "FLB_STR_GRADE_STEP1_WINDOW_TITLE" : "Flubaroo - Poängsättning steg 1",

        "FLB_STR_GRADE_STEP2_WINDOW_TITLE" : "Flubaroo - Poängsättning steg 2",

        "FLB_STR_GRADE_STEP1_LABEL_GRADING_OPTION" : "Poängsättningsval",

        "FLB_STR_GRADE_STEP1_LABEL_QUESTION" : "Fråga",

        "FLB_STR_GRADE_STEP2_LABEL_SELECT" : "Val",

        "FLB_STR_GRADE_STEP2_LABEL_SUBMISSION_TIME" : "Inskickat",

        "FLB_STR_GRADE_BUTTON_VIEW_GRADES" : "Visa poäng",

        "FLB_STR_GRADE_SUMMARY_TEXT_SUMMARY" : "Sammanfattning",

        "FLB_STR_GRADE_SUMMARY_TEXT_REPORT_FOR" : "Rapport för",

        "FLB_STR_GRADE_SUMMARY_TEXT_POINTS_POSSIBLE" : "Möjliga poäng",

        "FLB_STR_GRADE_SUMMARY_TEXT_AVERAGE_POINTS" : "Medelpoäng",

        "FLB_STR_GRADE_SUMMARY_TEXT_COUNTED_SUBMISSIONS" : "Antal svarsrader",

        "FLB_STR_GRADE_SUMMARY_TEXT_NUM_LOW_SCORING" : "Antal frågor med låga svarspoäng",

        "FLB_STR_GRADES_SHEET_COLUMN_NAME_TOTAL_POINTS" : "Totalpoäng",

        "FLB_STR_GRADES_SHEET_COLUMN_NAME_PERCENT" : "Procent",

        "FLB_STR_GRADES_SHEET_COLUMN_NAME_TIMES_SUBMITTED" : "Antal inskick",

        "FLB_STR_GRADES_SHEET_COLUMN_NAME_EMAILED_GRADE" : "Epostat poäng?",

        "FLB_STR_GRADES_SHEET_COLUMN_NAME_STUDENT_FEEDBACK" : "Elevfeedback (valfri)",

        "FLB_STR_EMAIL_GRADES_WINDOW_TITLE" : "Flubaroo - Eposta poäng",

        "FLB_STR_EMAIL_GRADES_INSTR" : "Flubaroo kan eposta poängen till varje elev inklusive rätta svaren. Använd menyn för att välja frågan som motsvarar elevernas epostadress. Om epostadresser inte samlades in så kommer du inte kunna eposta poängen.",

        "FLB_STR_EMAIL_DAILY_QUOTA_EXCEEDED" : "Flubaroo kan inte maila betyg just nu eftersom den har överskridit sin dagliga kvot på e-postmeddelanden per dag. Denna kvot är satt av Google. Försök igen senare.",
      
        "FLB_STR_VIEW_EMAIL_GRADES_NUMBER_SENT" : "poäng epostades",

        "FLB_STR_VIEW_EMAIL_GRADES_NUMBER_UNSENT" : "poäng epostades inte på grund av ogiltiga/saknade epostadresser eller att de redan fått sina poäng skickade.",

        "FLB_STR_VIEW_EMAIL_GRADES_NO_EMAILS_SENT" : "Inga poäng skickades då giltiga epostadresser saknades eller för att eleverna redan fått sina poäng skickade.",     

        "FLB_STR_EMAIL_GRADES_EMAIL_SUBJECT" : "Här är dina poäng för",

        "FLB_STR_EMAIL_GRADES_EMAIL_BODY_START" : "Detta brev innehåller dina poäng för",

        "FLB_STR_EMAIL_GRADES_DO_NOT_REPLY_MSG" : "Svara inte på detta brev",

        "FLB_STR_EMAIL_GRADES_YOUR_GRADE" : "Dina poäng",

        "FLB_STR_EMAIL_GRADES_INSTRUCTOR_MSG_BELOW" : "Nedan kommer ett meddelande från din lärare som skickats till hela gruppen",

        "FLB_STR_EMAIL_GRADES_STUDENT_FEEDBACK_BELOW" : "Din lärare hare feedback till dig",

        "FLB_STR_EMAIL_GRADES_SUBMISSION_SUMMARY" : "Sammanfattning av ditt svar",

        "FLB_STR_EMAIL_GRADES_BELOW_IS_YOUR_SCORE" : "Nedan kommer dina poäng för varje fråga",

        "FLB_STR_EMAIL_GRADES_BELOW_IS_YOUR_SCORE_AND_THE_ANSWER" : "Nedan kommer dina poäng för varje frånga tillsammans med det rätta svaret",

        "FLB_STR_EMAIL_GRADES_SCORE_TABLE_QUESTION_HEADER" : "Fråga",

        "FLB_STR_EMAIL_GRADES_SCORE_TABLE_YOUR_ANSWER_HEADER" : "Ditt svar",

        "FLB_STR_EMAIL_GRADES_SCORE_TABLE_CORRECT_ANSWER_HEADER" : "Rätt svar",

        "FLB_STR_EMAIL_GRADES_SCORE_TABLE_YOUR_SCORE_HEADER" : "Dina poäng",

        "FLB_STR_EMAIL_GRADES_SCORE_TABLE_POINTS_POSSIBLE_HEADER" : "Möjliga poäng",

        "FLB_STR_EMAIL_GRADES_SCORE_TABLE_HELP_TIP_HEADER" : "Hjälp för den här frågan",

        "FLB_STR_EMAIL_GRADES_SCORE_TABLE_POINTS" : "poäng",

        "FLB_STR_EMAIL_GRADES_SCORE_TABLE_CORRECT" : "Rätt",

        "FLB_STR_EMAIL_GRADES_SCORE_TABLE_INCORRECT" : "Fel",

        "FLB_STR_EMAIL_GRADES_EMAIL_FOOTER" : "Detta meddelande har skapats av Flubaroo – ett gratisverktyg för poängsättning och bedömning",

        "FLB_STR_EMAIL_GRADES_VISIT_FLUBAROO" : "Besök flubaroo.com",

        "FLB_STR_EMAIL_RECORD_EMAIL_SUBJECT": "Poängregister epostat för",

        "FLB_STR_EMAIL_RECORD_ASSIGNMENT_NAME": "Namn på uppgiften",

        "FLB_STR_EMAIL_RECORD_NUM_EMAILS_SENT": "Antal skickade epostmeddelanden",

        "FLB_STR_EMAIL_RECORD_NUM_GRADED_SUBM": "Antal poängsatta svarsrader",

        "FLB_STR_EMAIL_RECORD_AVERAGE_SCORE": "Medelpoäng",

        "FLB_STR_EMAIL_RECORD_POINTS_POSSIBLE": "Möjliga poäng",

        "FLB_STR_EMAIL_RECORD_ANSWER_KEY_PROVIDED": "Svarsnyckel finns?",

        "FLB_STR_EMAIL_RECORD_ANSWER_KEY_NO": "Nej",

        "FLB_STR_EMAIL_RECORD_ANSWER_KEY_YES": "Ja",

        "FLB_STR_EMAIL_RECORD_INSTRUCTOR_MESSAGE": "Du bifogade även detta meddelande",

        "FLB_STR_ABOUT_FLUBAROO_MSG1" : "Flubaroo är ett verktyg som är gratis, sparar tid och låter lärare snabbt poängsätta flervalsuppgifter och analysera resultatet",

        "FLB_STR_ABOUT_FLUBAROO_MSG2" : "Besök www.flubaroo.com för att lära dig mer. Skicka även feedback eller idéer till dave@edcode.org.",

        "FLB_STR_CANNOT_FIND_SUBM_MSG" : "Flubaroo kunde inte avgöra vilket blad som innehåller elevsvaren. Vänligen döp om den till: ",

        "FLB_STR_CANNOT_FIND_GRADES_MSG" : "Flubaroo kunde inte avgöra vilket blad som inehåller poängen. Vänligen poängsätt uppgiften eller döp om den till: ",

        "FLB_STR_MENU_GRADE_ASSIGNMENT" : "Poängsätt uppgift",

        "FLB_STR_MENU_REGRADE_ASSIGNMENT" : "Poängsätt uppgift på nytt",

        "FLB_STR_MENU_EMAIL_GRADES" : "Eposta poäng",

        "FLB_STR_MENU_HIDE_FEEDBACK" : "Dölj elevfeedback",

        "FLB_STR_MENU_EDIT_FEEDBACK" : "Ändra elevfeedback",

        "FLB_STR_MENU_HIDE_HELP_TIPS" : "Dölj hjälptips",

        "FLB_STR_MENU_EDIT_HELP_TIPS" : "Ändra hjälptips",

        "FLB_STR_MENU_VIEW_REPORT" : "Visa rapport",

        "FLB_STR_MENU_ABOUT" : "Om Flubaroo",

        "FLB_STR_MENU_SET_LANGUAGE" : "Välj språk",

        "FLB_STR_BUTTON_CONTINUE" : "Fortsätt",

        "FLB_STR_SHEETNAME_STUD_SUBM" : "Elevsvar", 

        "FLB_STR_SHEETNAME_GRADES" : "Poäng",

        "FLB_STR_NOT_GRADED" : "Inte poängsatt",

        "FLB_STR_NEW_VERSION_NOTICE" : "Du har installerat en ny version av Flubaroo! Besök flubaroo.com/blog för att se nyheterna.",

        "FLB_STR_NOTIFICATION" : "Flubaroo-meddelande",

        "FLB_STR_EMAIL_GRADES_IDENTIFY_EMAIL" : "Fråga med epostadress: ",

        "FLB_STR_EMAIL_GRADES_QUESTIONS_AND_SCORES" : "Bifoga lista med frågor och poäng: ", 

        "FLB_STR_EMAIL_GRADES_ANSWER_KEY" : "Bifoga svarsnyckel: ",

        "FLB_STR_EMAIL_GRADES_INSTRUCTOR_MESSAGE" : "Meddelande att bifoga epost (valfri):",

        "FLB_STR_VIEW_REPORT_WINDOW_TITLE" : "Flubaroo - Poängrapport",

        "FLB_STR_VIEW_REPORT_HISTOGRAM_CHART_TITLE" : "Histogram över poäng",

        "FLB_STR_VIEW_REPORT_HISTOGRAM_Y-AXIS_TITLE" : "Antal svar",

        "FLB_STR_VIEW_REPORT_HISTOGRAM_X-AXIS_TITLE" : "Antal poäng",

        "FLB_STR_VIEW_REPORT_BUTTON_EMAIL_ME" : "Eposta rapporten till mig",

        "FLB_STR_VIEW_REPORT_EMAIL_NOTIFICATION" : "Rapporten har inte epostats till"
    },
    // END SWEDISH ////////////////////////////////////////////////////////////////////////////// 

    // START RUSSIAN //////////////////////////////////////////////////////////////////////////// 
    // Thanks to these contributors for the Russian translation: Lyudmila Rozhdestvenskaya, Alexandra Barysheva and Boris Yarmakhov
    "ru-ru": {
        "FLB_LANG_IDENTIFIER": "русский (Russian)",
      
        "FLB_STR_GRADING_OPT_STUD_ID" : "Имя учащегося",
 
        "FLB_STR_GRADING_OPT_SKIP_GRADING" : "Не оценивать",
 
        "FLB_STR_GRADING_OPT_1_PT" : "1 балл",
 
        "FLB_STR_GRADING_OPT_2_PT" : "2 балла",
 
        "FLB_STR_GRADING_OPT_3_PT" : "3 балла",
 
        "FLB_STR_GRADING_OPT_4_PT" : "4 балла",
 
        "FLB_STR_GRADING_OPT_5_PT" : "5 баллов",
 
        "FLB_STR_RESULTS_MSG1" : "Оценивание завершено! В таблице был создан новый лист “Оценки”. В этом листе находятся оценки всех ответов, а также статистика по всем оценкам. ** Внимание: Лист 'Оценки' нельзя изменять, поскольку это может повлиять на отчеты, рассылаемые по e-mail Если вы хотите внести в него изменения, скопируйте его и работайте с копией",
 
        "FLB_STR_RESULTS_MSG2" : "Обратите внимание: В последней строке указан процент учащихся, ответивших на каждый вопрос правильно, Оранжевым цветом выделяются вопросы, на которые было получено более всего неправильных оценок. Имена учащихся, набравших менее 70% правильных ответов, выделяются красным шрифтом.",
 
        "FBL_STR_STEP1_INSTR" : "Пожалуйста, выберите вариант ответа для каждого вопроса в задании. Flobaroo разработан таким образом, чтобы работа с ним была бы максимально удобной, Однако, для каждого из заданий вам следует проверить настройки самостоятельно.",
 
        "FBL_STR_STEP2_INSTR" : "Пожалуйста, выберите те ответы в форме, которые должны использоваться, как ключи к ответам. Как правило, это будут ответы, предоставленные вами. Все остальные ответы будут оцениваться в соответствии с ключами, поэтому убедитесь, что вы выбрали правильный вариант.",
 
        "FBL_STR_GRADE_NOT_ENOUGH_SUBMISSIONS" : "В форме должно быть не менее 2-х ответов для выполнения процедуры оценивания. Пожалуйста, повторяйте процедуру каждый раз, когда новые ученики отправляют свои ответы в форму.",
 
        "FLB_STR_WAIT_INSTR1" : "Flubaroo оценивает ваше задание. Пожалуйста, подождите...",
 
        "FLB_STR_WAIT_INSTR2" : "Подождите, ваше задание оценивается. Это может занять минуту или две",
 
        "FLB_STR_REPLACE_GRADES_PROMPT" : "Это приведет к замене существующих оценок. Уверены, что хотите продолжить?",
 
        "FLB_STR_PREPARING_TO_GRADE_WINDOW_TITLE" : "Flubaroo - Подготовка к оцениванию",
 
        "FLB_STR_GRADING_WINDOW_TITLE" : "Flubaroo - задание оценивается",
 
        "FLB_STR_GRADING_COMPLETE_TITLE" : "Flubaroo - Оценивание выполнено!",
 
        "FLB_STR_GRADE_STEP1_WINDOW_TITLE" : "Flubaroo - Оценивание. Шаг 1. ",
 
        "FLB_STR_GRADE_STEP2_WINDOW_TITLE" : "Flubaroo - Оценивание. Шаг 2. ",
 
        "FLB_STR_GRADE_STEP1_LABEL_GRADING_OPTION" : "Настройки оценивания",
 
        "FLB_STR_GRADE_STEP1_LABEL_QUESTION" : "Вопросы",
 
        "FLB_STR_GRADE_STEP2_LABEL_SELECT" : "Выбрать",
 
        "FLB_STR_GRADE_STEP2_LABEL_SUBMISSION_TIME" : "Время отправки",
 
        "FLB_STR_GRADE_BUTTON_VIEW_GRADES" : "Посмотреть результаты",
 
        "FLB_STR_GRADE_SUMMARY_TEXT_SUMMARY" : "Результаты",
 
        "FLB_STR_GRADE_SUMMARY_TEXT_REPORT_FOR" : "Отчет по",
 
        "FLB_STR_GRADE_SUMMARY_TEXT_POINTS_POSSIBLE" : "Максимальный балл",
 
        "FLB_STR_GRADE_SUMMARY_TEXT_AVERAGE_POINTS" : "Средний балл",
 
        "FLB_STR_GRADE_SUMMARY_TEXT_COUNTED_SUBMISSIONS" : "Количество ответов",
 
        "FLB_STR_GRADE_SUMMARY_TEXT_NUM_LOW_SCORING" : "Количество ответов с низким результатом",
 
        "FLB_STR_GRADES_SHEET_COLUMN_NAME_TOTAL_POINTS" : "Баллы",
 
        "FLB_STR_GRADES_SHEET_COLUMN_NAME_PERCENT" : "Проценты",
 
        "FLB_STR_GRADES_SHEET_COLUMN_NAME_TIMES_SUBMITTED" : "Количество попыток",
 
        "FLB_STR_GRADES_SHEET_COLUMN_NAME_EMAILED_GRADE" : "Письмо отправлено?",
 
        "FLB_STR_GRADES_SHEET_COLUMN_NAME_STUDENT_FEEDBACK" : "Обратная связь (по выбору)",
 
        "FLB_STR_EMAIL_GRADES_WINDOW_TITLE" : "Flubaroo - Послать результаты по e-mail",
 
        "FLB_STR_EMAIL_GRADES_INSTR" : "Flubaroo может отправить каждому учащемуся его баллы, а также правильные ответы. Используйте выпадающее меню для выбора вопроса, запрашивающего электронные адреса учеников. Если адреса электронной почты не были собраны, то вы не сможете отправить оценки по электронной почте. ",

        "FLB_STR_EMAIL_DAILY_QUOTA_EXCEEDED" : "Flubaroo не может сорта по электронной почте в это время, потому что он превысил свои ежедневные квоты писем в день. Эта квота устанавливается Google. Пожалуйста, повторите попытку позже.",
      
        "FLB_STR_VIEW_EMAIL_GRADES_NUMBER_SENT" : "оценок  успешно отправлены",
 
        "FLB_STR_VIEW_EMAIL_GRADES_NUMBER_UNSENT" : "оценки не были отправлены из-за недействительных или пропущенных адресов электронной почты, или т.к. ученики уже получили свои результаты по электронной почте. ",
 
        "FLB_STR_VIEW_EMAIL_GRADES_NO_EMAILS_SENT" : "Результаты не были отправлены по электронной почте, т.к. не были найдены действительные адреса электронной почты или т.к. ученики уже получили свои результаты по электронной почте.",
 
        "FLB_STR_EMAIL_GRADES_EMAIL_SUBJECT" : "Вот ваша оценка за",
 
        "FLB_STR_EMAIL_GRADES_EMAIL_BODY_START" : "Это письмо содержит ваши результаты за",
 
        "FLB_STR_EMAIL_GRADES_DO_NOT_REPLY_MSG" : "Не отвечайте на это письмо.",
 
        "FLB_STR_EMAIL_GRADES_YOUR_GRADE" : "Ваша оценка",
 
        "FLB_STR_EMAIL_GRADES_INSTRUCTOR_MSG_BELOW" : "Ниже находится сообщение от вашего преподавателя, отправленное всему классу",
 
        "FLB_STR_EMAIL_GRADES_STUDENT_FEEDBACK_BELOW" : "Комментарий преподавателя лично для вас",
 
        "FLB_STR_EMAIL_GRADES_SUBMISSION_SUMMARY" : "Сводка результатов по выполненному заданию",
 
        "FLB_STR_EMAIL_GRADES_BELOW_IS_YOUR_SCORE" : "Ниже ваш балл за каждый вопрос",
 
        "FLB_STR_EMAIL_GRADES_BELOW_IS_YOUR_SCORE_AND_THE_ANSWER" : "Ниже ваш балл за каждый вопрос вместе с правильными ответами",
 
        "FLB_STR_EMAIL_GRADES_SCORE_TABLE_QUESTION_HEADER" : "Вопросы",
 
        "FLB_STR_EMAIL_GRADES_SCORE_TABLE_YOUR_ANSWER_HEADER" : "Ваш ответ",
 
        "FLB_STR_EMAIL_GRADES_SCORE_TABLE_CORRECT_ANSWER_HEADER" : "Правильный ответ",
 
        "FLB_STR_EMAIL_GRADES_SCORE_TABLE_YOUR_SCORE_HEADER" : "Ваш результат",
 
        "FLB_STR_EMAIL_GRADES_SCORE_TABLE_POINTS_POSSIBLE_HEADER" : "Максимально возможный балл",
 
        "FLB_STR_EMAIL_GRADES_SCORE_TABLE_HELP_TIP_HEADER" : "Подсказка для вопроса ",
 
        "FLB_STR_EMAIL_GRADES_SCORE_TABLE_POINTS" : "балл(ы) ",
 
        "FLB_STR_EMAIL_GRADES_SCORE_TABLE_CORRECT" : "Верно",
 
        "FLB_STR_EMAIL_GRADES_SCORE_TABLE_INCORRECT" : "Неверно",
 
        "FLB_STR_EMAIL_GRADES_EMAIL_FOOTER" : "Это письмо сгенерировано с помощью приложения Flubaroo, бесплатного инструмента для оценивания.",
 
        "FLB_STR_EMAIL_GRADES_VISIT_FLUBAROO" : "Посетите www.flubaroo.com.",
 
        "FLB_STR_EMAIL_RECORD_EMAIL_SUBJECT" : "Сообщение об отправке результатов за",
 
        "FLB_STR_EMAIL_RECORD_ASSIGNMENT_NAME" : "Название задания",
 
        "FLB_STR_EMAIL_RECORD_NUM_EMAILS_SENT" : "Количество отправленных писем",
 
        "FLB_STR_EMAIL_RECORD_NUM_GRADED_SUBM" : "Количество оцененных заданий",
 
        "FLB_STR_EMAIL_RECORD_AVERAGE_SCORE" : "Средний результат (балл)",
 
        "FLB_STR_EMAIL_RECORD_POINTS_POSSIBLE" : "Максимально возможный результат (балл)",
 
        "FLB_STR_EMAIL_RECORD_ANSWER_KEY_PROVIDED" : "Предоставлен ли ключ с правильными ответами?",
 
        "FLB_STR_EMAIL_RECORD_ANSWER_KEY_NO" : "Нет",
 
        "FLB_STR_EMAIL_RECORD_ANSWER_KEY_YES" : "Да",
 
        "FLB_STR_EMAIL_RECORD_INSTRUCTOR_MESSAGE" : "Вы также  включили это сообщение",
 
        "FLB_STR_ABOUT_FLUBAROO_MSG1" : "Flubaroo - бесплатный  инструмент, позволяющий учителю быстро оценить ответы	учеников и проанализировать результаты",
 
        "FLB_STR_ABOUT_FLUBAROO_MSG2" : "Чтобы узнать больше, посетите наш сайт www.flubaroo.com. Для обратной связи и новых идей dave@edcode.org.",
 
        "FLB_STR_CANNOT_FIND_SUBM_MSG" : "Flubaroo не может определить, какой лист содержит ответы учеников. Выберите этот лист и переименуйте его в:",
 
        "FLB_STR_CANNOT_FIND_GRADES_MSG" : "Flubaroo не может определить, какой лист содержит результаты оценивания. Выполните процедуру оценивания  или выберите этот лист и переименуйте его в: ",
 
        "FLB_STR_MENU_GRADE_ASSIGNMENT" : "Произвести оценивание",
 
        "FLB_STR_MENU_REGRADE_ASSIGNMENT" : "Повторить оценивание",
 
        "FLB_STR_MENU_EMAIL_GRADES" : "Отправить результаты по e-mail",
 
        "FLB_STR_MENU_HIDE_FEEDBACK" : "Скрыть комментарии учащихся",
 
        "FLB_STR_MENU_EDIT_FEEDBACK" : "Редактировать комментарии учащихся",
 
        "FLB_STR_MENU_HIDE_HELP_TIPS" : "Скрыть подсказки",
 
        "FLB_STR_MENU_EDIT_HELP_TIPS" : "Редактировать подсказки",
 
        "FLB_STR_MENU_VIEW_REPORT" : "Посмотреть результаты",
 
        "FLB_STR_MENU_ABOUT" : "О программе Flubaroo",
 
        "FLB_STR_MENU_SET_LANGUAGE" : "Выбрать язык",
 
        "FLB_STR_BUTTON_CONTINUE" : "Продолжить",
 
        "FLB_STR_SHEETNAME_STUD_SUBM" : "Ответы",
 
        "FLB_STR_SHEETNAME_GRADES" : "Оценки",
 
        "FLB_STR_NOT_GRADED" : "Не оценено",
 
        "FLB_STR_NEW_VERSION_NOTICE" : "Вы установили новую версию Flubaroo! Посетите flubaroo.com/blog и познакомьтесь с последними новостями.",
 
        "FLB_STR_NOTIFICATION" : "Оповещение Flubaroo: ",
 
        "FLB_STR_EMAIL_GRADES_IDENTIFY_EMAIL" : "Ваш адрес e-mail: ",
 
        "FLB_STR_EMAIL_GRADES_QUESTIONS_AND_SCORES" : "Добавить список вопросов и результатов: ",
 
        "FLB_STR_EMAIL_GRADES_ANSWER_KEY" : "Добавить ключи ответов: ",
 
        "FLB_STR_EMAIL_GRADES_INSTRUCTOR_MESSAGE" : "Добавить сообщение (по выбору)",
 
        "FLB_STR_VIEW_REPORT_WINDOW_TITLE" : "Flubaroo - Отчет",
 
        "FLB_STR_VIEW_REPORT_HISTOGRAM_CHART_TITLE" : "Гистограмма оценок",
 
        "FLB_STR_VIEW_REPORT_HISTOGRAM_Y-AXIS_TITLE" : "Ответы учеников",
 
        "FLB_STR_VIEW_REPORT_HISTOGRAM_X-AXIS_TITLE" : "Набранные баллы",
 
        "FLB_STR_VIEW_REPORT_BUTTON_EMAIL_ME" : "Отправить мне Отчет",
 
        "FLB_STR_VIEW_REPORT_EMAIL_NOTIFICATION" : "Отчет был отправлен на адрес",
    },
    // END RUSSIAN //////////////////////////////////////////////////////////////////////////////   

    // START DUTCH ////////////////////////////////////////////////////////////////////////////// 
    // Thanks to these contributors for the Dutch translation: Ingmar Remmelzwaal
    "nl-nl": {
        "FLB_LANG_IDENTIFIER": "Nederlands (Dutch)",
      
        "FLB_STR_GRADING_OPT_STUD_ID" : "Identificeert student",
 
        "FLB_STR_GRADING_OPT_SKIP_GRADING" : "Beoordeling overslaan",
 
        "FLB_STR_GRADING_OPT_1_PT" : "1 Punt",
 
        "FLB_STR_GRADING_OPT_2_PT" : "2 Punten",
 
        "FLB_STR_GRADING_OPT_3_PT" : "3 Punten",
 
        "FLB_STR_GRADING_OPT_4_PT" : "4 Punten",
 
        "FLB_STR_GRADING_OPT_5_PT" : "5 Punten",
 
        "FLB_STR_RESULTS_MSG1" : "Het beoordelen is afgerond! Een nieuw werkblad met de naam 'Beoordelingen' is gemaakt. Dit werkblad bevat de beoordeling van iedere inzending en bovenaan staat een samenvatting van alle beoordelingen. ** Opmerking: Het is niet de bedoeling dat het blad 'Beoordelingen' handmatig gewijzigd wordt. Dit kan het e-mailen van de beoordelingen verstoren. Als je het blad wilt wijzigen, maak een kopie en wijzig deze.",
 
        "FLB_STR_RESULTS_MSG2" : "Tips: De allerlaatste rij laat het percentage zien van studenten die iedere vraag goed hebben, vragen die over de gehele linie laag scoren zijn oranje. Individuele studenten die lager dan 70% scoren worden in een rood lettertype weergegeven.",
 
        "FBL_STR_STEP1_INSTR" : "Selecteer een beoordelingsoptie voor iedere vraag in de toets. Flubaroo heeft geprobeerd om de beste optie voor jou te raden, maar je moet dit voor iedere optie zelf nagaan.",
 
        "FBL_STR_STEP2_INSTR" : "Selecteer welke inzending gebruikt moet worden als de oplossing. Meestal is dit de inzending die door jou gemaakt is. Alle andere inzendingen zullen beoordeeld worden aan de hand van deze oplossing. Dus let op dat je de juiste selecteert.",
 
        "FBL_STR_GRADE_NOT_ENOUGH_SUBMISSIONS" : "Er moeten op zijn minst 2 inzendingen zijn om een beoordeling te maken. Probeer het opnieuw als er meer studenten hun antwoorden hebben verstuurd.",
 
        "FLB_STR_WAIT_INSTR1" : "Flubaroo voert je opdracht uit. Even geduld...",
 
        "FLB_STR_WAIT_INSTR2" : "Wacht even totdat je toets is beoordeeld. Dit kan één tot twee minuten duren.",
 
        "FLB_STR_REPLACE_GRADES_PROMPT" : "Dit zal je bestaande beoordelingen vervangen. Weet je zeker dat je door wilt gaan?",
 
        "FLB_STR_PREPARING_TO_GRADE_WINDOW_TITLE" : "Flubaroo - Beoordeling voorbereiden",
 
        "FLB_STR_GRADING_WINDOW_TITLE" : "Flubaroo - Toets beoordelen",
 
        "FLB_STR_GRADING_COMPLETE_TITLE" : "Flubaroo - Beoordeling afgerond",
 
        "FLB_STR_GRADE_STEP1_WINDOW_TITLE" : "Flubaroo - Beoordeling STAP 1",
 
        "FLB_STR_GRADE_STEP2_WINDOW_TITLE" : "Flubaroo - Beoordeling STAP 2",
 
        "FLB_STR_GRADE_STEP1_LABEL_GRADING_OPTION" : "Beoordelingsoptie",
 
        "FLB_STR_GRADE_STEP1_LABEL_QUESTION" : "Vraag",
 
        "FLB_STR_GRADE_STEP2_LABEL_SELECT" : "Selecteer",
 
        "FLB_STR_GRADE_STEP2_LABEL_SUBMISSION_TIME" : "Inzendtijd",
 
        "FLB_STR_GRADE_BUTTON_VIEW_GRADES" : "Bekijk beoordelingen",
 
        "FLB_STR_GRADE_SUMMARY_TEXT_SUMMARY" : "Resultaten",
 
        "FLB_STR_GRADE_SUMMARY_TEXT_REPORT_FOR" : "Rapportage voor",
 
        "FLB_STR_GRADE_SUMMARY_TEXT_POINTS_POSSIBLE" : "Maximum te behalen punten",
 
        "FLB_STR_GRADE_SUMMARY_TEXT_AVERAGE_POINTS" : "Gemiddeld aantal punten",
 
        "FLB_STR_GRADE_SUMMARY_TEXT_COUNTED_SUBMISSIONS" : "Aantal inzendingen",
 
        "FLB_STR_GRADE_SUMMARY_TEXT_NUM_LOW_SCORING" : "Aantal laag scorende vragen",
 
        "FLB_STR_GRADES_SHEET_COLUMN_NAME_TOTAL_POINTS" : "Puntentotaal",
 
        "FLB_STR_GRADES_SHEET_COLUMN_NAME_PERCENT" : "Percentage",
 
        "FLB_STR_GRADES_SHEET_COLUMN_NAME_TIMES_SUBMITTED" : "Aantal keer verstuurd",
 
        "FLB_STR_GRADES_SHEET_COLUMN_NAME_EMAILED_GRADE" : "Beoordeling verstuurd",
 
        "FLB_STR_GRADES_SHEET_COLUMN_NAME_STUDENT_FEEDBACK" : "Feedback voor student (Optioneel)",
 
        "FLB_STR_EMAIL_GRADES_WINDOW_TITLE" : "Flubaroo - Verstuur beoordelingen",
 
        "FLB_STR_EMAIL_GRADES_INSTR" : "Flubaroo kan iedere student een e-mail sturen met de beoordeling en eventueel met de goede antwoorden. Gebruik het keuzemenu om de vraag te selecteren dat de studenten naar hun e-mailadres vroeg. Als er geen e-mailadressen zijn verzameld, kun je geen beoordelingen versturen.",
      
        "FLB_STR_EMAIL_DAILY_QUOTA_EXCEEDED" : "Flubaroo kan niet rangen e-mail op dit moment omdat het zijn dagelijkse quotum van e-mails per dag is overschreden. Dit contingent wordt door Google ingesteld. Probeer het later opnieuw.",
      
        "FLB_STR_VIEW_EMAIL_GRADES_NUMBER_SENT" : " beoordelingen werden succesvol verstuurd",
 
        "FLB_STR_VIEW_EMAIL_GRADES_NUMBER_UNSENT" : " beoordelingen zijn niet verstuurd omdat het geen of een ongeldig e-mailadres bevat",
 
        "FLB_STR_VIEW_EMAIL_GRADES_NO_EMAILS_SENT" : "Er zijn geen beoordelingen verstuurd omdat er geen geldig e-mailadres werd gevonden of omdat alle studenten al hun beoordeling hebben ontvangen.",
 
        "FLB_STR_EMAIL_GRADES_EMAIL_SUBJECT" : "Dit is je beoordeling voor",
 
        "FLB_STR_EMAIL_GRADES_EMAIL_BODY_START" : "Deze e-mail bevat je beoordeling voor",
 
        "FLB_STR_EMAIL_GRADES_DO_NOT_REPLY_MSG" : "Beantwoord deze e-mail niet!",
 
        "FLB_STR_EMAIL_GRADES_YOUR_GRADE" : "Je beoordeling",
 
        "FLB_STR_EMAIL_GRADES_INSTRUCTOR_MSG_BELOW" : "Hieronder staat een bericht dat je docent naar de hele klas heeft gestuurd",
 
        "FLB_STR_EMAIL_GRADES_STUDENT_FEEDBACK_BELOW" : "Jouw docent heeft de volgende feedback voor jou",
 
        "FLB_STR_EMAIL_GRADES_SUBMISSION_SUMMARY" : "Samenvatting van je inzending",
 
        "FLB_STR_EMAIL_GRADES_BELOW_IS_YOUR_SCORE" : "Hieronder staat voor iedere vraag je score",
 
        "FLB_STR_EMAIL_GRADES_BELOW_IS_YOUR_SCORE_AND_THE_ANSWER" : "Hieronder staat je score voor iedere vraag met daarbij het goede antwoord",
 
        "FLB_STR_EMAIL_GRADES_SCORE_TABLE_QUESTION_HEADER" : "Vraag",
 
        "FLB_STR_EMAIL_GRADES_SCORE_TABLE_YOUR_ANSWER_HEADER" : "Jouw antwoord",
 
        "FLB_STR_EMAIL_GRADES_SCORE_TABLE_CORRECT_ANSWER_HEADER" : "Het juiste antwoord",
 
        "FLB_STR_EMAIL_GRADES_SCORE_TABLE_YOUR_SCORE_HEADER" : "Jouw score",
 
        "FLB_STR_EMAIL_GRADES_SCORE_TABLE_POINTS_POSSIBLE_HEADER" : "Maximum te behalen punten",
 
        "FLB_STR_EMAIL_GRADES_SCORE_TABLE_HELP_TIP_HEADER" : "Hulp bij deze vraag",
 
        "FLB_STR_EMAIL_GRADES_SCORE_TABLE_POINTS" : "punt(en)",
 
        "FLB_STR_EMAIL_GRADES_SCORE_TABLE_CORRECT" : "Goed",
 
        "FLB_STR_EMAIL_GRADES_SCORE_TABLE_INCORRECT" : "Fout",
 
        "FLB_STR_EMAIL_GRADES_EMAIL_FOOTER" : "Deze e-mail werd samengesteld door Flubaroo, een gratis hulpmiddel voor het automatisch nakijken en beoordelen van toetsen",
 
        "FLB_STR_EMAIL_GRADES_VISIT_FLUBAROO" : "Bezoek flubaroo.com",
 
        "FLB_STR_EMAIL_RECORD_EMAIL_SUBJECT" : "Overzicht van verstuurde beoordelingen voor",
 
        "FLB_STR_EMAIL_RECORD_ASSIGNMENT_NAME" : "Naam van toets",
 
        "FLB_STR_EMAIL_RECORD_NUM_EMAILS_SENT" : "Aantal verzonden e-mails",
 
        "FLB_STR_EMAIL_RECORD_NUM_GRADED_SUBM" : "Aantal beoordeelde inzendingen",
 
        "FLB_STR_EMAIL_RECORD_AVERAGE_SCORE" : "Gemiddelde score (punten)",
 
        "FLB_STR_EMAIL_RECORD_POINTS_POSSIBLE" : "Maximum te behalen punten",
 
        "FLB_STR_EMAIL_RECORD_ANSWER_KEY_PROVIDED" : "Antwoorden verstrekt",
 
        "FLB_STR_EMAIL_RECORD_ANSWER_KEY_NO" : "Nee",
 
        "FLB_STR_EMAIL_RECORD_ANSWER_KEY_YES" : "Ja",
 
        "FLB_STR_EMAIL_RECORD_INSTRUCTOR_MESSAGE" : "Je hebt ook dit bericht bijgevoegd",
 
        "FLB_STR_ABOUT_FLUBAROO_MSG1" : "Flubaroo is een gratis en tijdbesparend hulpmiddel dat docenten in staat stelt om snel meerkeuzetoetsen te beoordelen en te analyseren.",
 
        "FLB_STR_ABOUT_FLUBAROO_MSG2" : "Wil je meer weten, bezoek www.flubaroo.com. Stuur je feedback of ideeën naar dave@edcode.org",
 
        "FLB_STR_CANNOT_FIND_SUBM_MSG" : "Flubaroo kon niet vaststellen welk blad de inzendingen van de studenten bevat. Zoek het blad op en hernoem dit naar: ",
 
        "FLB_STR_CANNOT_FIND_GRADES_MSG" : "Flubaroo kon niet vaststellen welk blad de beoordelingen bevat. Beoordeel eerst de toets of zoek het blad op en hernoem dit naar: ",
 
        "FLB_STR_MENU_GRADE_ASSIGNMENT" : "Beoordeel toets",
 
        "FLB_STR_MENU_REGRADE_ASSIGNMENT" : "Beoordeel toets opnieuw",
 
        "FLB_STR_MENU_EMAIL_GRADES" : "E-mail de beoordelingen",
 
        "FLB_STR_MENU_HIDE_FEEDBACK" : "Verberg feedback voor student",
 
        "FLB_STR_MENU_EDIT_FEEDBACK" : "Bewerk feedback voor student",

        "FLB_STR_MENU_HIDE_HELP_TIPS" : "Verberg helptips",

        "FLB_STR_MENU_EDIT_HELP_TIPS" : "Bewerk helptips",         
      
        "FLB_STR_MENU_VIEW_REPORT" : "Bekijk overzicht",
 
        "FLB_STR_MENU_ABOUT" : "Over Flubaroo",
 
        "FLB_STR_MENU_SET_LANGUAGE" : "Selecteer taal",
 
        "FLB_STR_BUTTON_CONTINUE" : "Ga verder",
 
        "FLB_STR_SHEETNAME_STUD_SUBM" : "Antwoorden",
 
        "FLB_STR_SHEETNAME_GRADES" : "Beoordelingen",
 
        "FLB_STR_NOT_GRADED" : "Niet beoordeeld",
 
        "FLB_STR_NEW_VERSION_NOTICE" : "Je hebt een nieuwe versie van Flubaroo geïnstalleerd! Lees op flubaroo.com/blog wat nieuw is.",
 
        "FLB_STR_NOTIFICATION" : "Flubaroo melding",
 
        "FLB_STR_EMAIL_GRADES_IDENTIFY_EMAIL" : "Vraag naar e-mailadres: ",
 
        "FLB_STR_EMAIL_GRADES_QUESTIONS_AND_SCORES" : "Voeg lijst toe van vragen en scores: ",
 
        "FLB_STR_EMAIL_GRADES_ANSWER_KEY" : "Voeg juiste antwoorden toe: ",
 
        "FLB_STR_EMAIL_GRADES_INSTRUCTOR_MESSAGE" : "Voeg bericht aan e-mail toe (optioneel): ",
 
        "FLB_STR_VIEW_REPORT_WINDOW_TITLE" : "Flubaroo - Beoordelingsoverzicht",
 
        "FLB_STR_VIEW_REPORT_HISTOGRAM_CHART_TITLE" : "Grafiek met verdeling van scores",
 
        "FLB_STR_VIEW_REPORT_HISTOGRAM_Y-AXIS_TITLE" : "Inzendingen",
 
        "FLB_STR_VIEW_REPORT_HISTOGRAM_X-AXIS_TITLE" : "Behaalde punten",
 
        "FLB_STR_VIEW_REPORT_BUTTON_EMAIL_ME" : "Stuur mij het overzicht",
 
        "FLB_STR_VIEW_REPORT_EMAIL_NOTIFICATION" : "Het overzicht is gestuurd naar",
    },
    // END DUTCH //////////////////////////////////////////////////////////////////////////////  
 
    // START FRENCH (FRANCE) //////////////////////////////////////////////////////////////////
    // Thanks to these contributors for the French translation: Sylvain de France
   "fr-fr": {
       // Name to identify language in language selector
       "FLB_LANG_IDENTIFIER": "Français (French)",

       // Grading option which identifies a student
       "FLB_STR_GRADING_OPT_STUD_ID" : "Identification de l'élève",

       // Grading option which tells Flubaroo to skip grading on a question
       "FLB_STR_GRADING_OPT_SKIP_GRADING" : "Non évalué",

       // Grading option for 1 point
       "FLB_STR_GRADING_OPT_1_PT" : "1 Point",

       // Grading option for 2 points
       "FLB_STR_GRADING_OPT_2_PT" : "2 Points",

       // Grading option for 3 points
       "FLB_STR_GRADING_OPT_3_PT" : "3 Points",

       // Grading option for 4 points
       "FLB_STR_GRADING_OPT_4_PT" : "4 Points",

       // Grading option for 5 points
       "FLB_STR_GRADING_OPT_5_PT" : "5 Points",

       // Message shown when grading is complete (1 of 2).
       "FLB_STR_RESULTS_MSG1" : "Notation terminée! Une nouvelle feuille de calcul appelée « Notation » a été créée. Cette feuille de calcul contient une note pour chaque formulaire reçuet résume l'ensemble des résultats.** Note: la fiche Notation n'est pas destinée à être modifiée en aucune façon, cela pourrait interférer sur le contenu des mails. Si vous avez besoin de modifier la fiche, la copier et modifier la copie.",

       // Message shown when grading is complete (2 of 2).
       "FLB_STR_RESULTS_MSG2" : "Information: La dernière ligne montre le pourcentage de bonnes réponses obtenu par chaque étudiant, les questions ayant obtenus un faible score sont en surbrillance orange. Aussi, les étudiants qui on en dessous de 70% apparaissent en rouge",

       // Instructions shown on Step 1 of grading.
       "FBL_STR_STEP1_INSTR" : "S'il vous plaît, sélectionner une option de classement pour chacune des question. Flubaroo à fait de son mieux pour deviner la meilleure option, mais vous devez vérifier vous-même ",

       // Instructions shown on Step 2 of grading.
       "FBL_STR_STEP2_INSTR" : "Merci de sélectionner le réponse qui sera utilisée comme corrigé. Généralement il s'agit d'un formulaire envoyé par vous même avec les réponses attendus. L'ensemble des réponses seront corrigées par rapport à celui-ci, assurez-vous de choisir celui qui convient.",

       // Message shown if not enough submissions to perform grading.
       "FBL_STR_GRADE_NOT_ENOUGH_SUBMISSIONS" : "Important: il doit y avoir au moins 2 soumissions pour effectuer un classement. S'il vous plaît essayer de nouveau quand plus d'élèves  auront soumis leurs réponses.",

       // Please wait" message first shown when Flubaroo is first examining assignment.
       "FLB_STR_WAIT_INSTR1" : "Flubaroo examine votre soumission. Merci de patienter ...",

       // Please wait" message shown after Step 1 and Step 2, while grading is happening.
       "FLB_STR_WAIT_INSTR2" :  "S'il vous plaît patienter pendant que votre soumission est noté. Cela peut prendre quelques minutes pour terminer.",

       // Asks user if they are sure they want to re-grade, if Grades sheet exists.
       "FLB_STR_REPLACE_GRADES_PROMPT" : "La notation existante va être remplacée. Etes-vous sûr vouloir continuer?",

       // Window title for "Preparing to grade" window
       "FLB_STR_PREPARING_TO_GRADE_WINDOW_TITLE" : "Flubaroo - Préparation de la Notation",

       // Window title for "Please wait" window while grading occurs
       "FLB_STR_GRADING_WINDOW_TITLE" : "Flubaroo - Notation de votre soumission",

       // Window title for "Grading Complete" window after grading occurs
       "FLB_STR_GRADING_COMPLETE_TITLE" : "Flubaroo - Notation terminée!",

       // Window title for grading Step 1
       "FLB_STR_GRADE_STEP1_WINDOW_TITLE" : "Notation étape 1",

       // Window title for grading Step 2
       "FLB_STR_GRADE_STEP2_WINDOW_TITLE" : "Notation étape 2",

       // "Grading Option" label that appears over first column in Step 1 of grading.
       "FLB_STR_GRADE_STEP1_LABEL_GRADING_OPTION" : "Options de Notation",

       // "Question" label that appears over second column in Step 1 of grading.
       "FLB_STR_GRADE_STEP1_LABEL_QUESTION" : "Question",

       // "Select" label that appears over radio button in first column of Step 2 of grading.
       "FLB_STR_GRADE_STEP2_LABEL_SELECT" : "Sélectionner",

       // "Submission Time" label that appears over second column in Step 2 of grading.
       "FLB_STR_GRADE_STEP2_LABEL_SUBMISSION_TIME" : "Date d'envoi",

       // Label for "View Grades" button shown when grading completes.
       "FLB_STR_GRADE_BUTTON_VIEW_GRADES" : "Voir la Notation",

       // Used for "summary" text shown at top of Grades sheet, and in report.
       "FLB_STR_GRADE_SUMMARY_TEXT_SUMMARY" : "Résulats",

       // Used for report and report email. Ex: "Report for 'My Test'"
       "FLB_STR_GRADE_SUMMARY_TEXT_REPORT_FOR" : "Rapport pour",

       // Points Possible. Used for text shown at top of Grades sheet, and in report.
       "FLB_STR_GRADE_SUMMARY_TEXT_POINTS_POSSIBLE" : "Points possibles",

       // Average Points. Used for text shown at top of Grades sheet, and in report.
       "FLB_STR_GRADE_SUMMARY_TEXT_AVERAGE_POINTS" : "Moyenne",

       // Counted Submissions. Used for text shown at top of Grades sheet, and in report.
       "FLB_STR_GRADE_SUMMARY_TEXT_COUNTED_SUBMISSIONS" : "Nombre de soumission",

       // Number of Low Scoring Questions. Used for text shown at top of Grades sheet, and in report.
       "FLB_STR_GRADE_SUMMARY_TEXT_NUM_LOW_SCORING" : "Question avec une notation infèrieure à 70%",

       // Name of column in Grades sheet that has total points scored.
       "FLB_STR_GRADES_SHEET_COLUMN_NAME_TOTAL_POINTS" : "Total Points",

       // Name of column in Grades sheet that has score as percent.
       "FLB_STR_GRADES_SHEET_COLUMN_NAME_PERCENT" : "Pourcentage",

       // Name of column in Grades sheet that has number of times student made a submission.
       "FLB_STR_GRADES_SHEET_COLUMN_NAME_TIMES_SUBMITTED" : "Nombre de soumission",

       // Name of column in Grades sheet that indicates if grade was already emailed out.
       "FLB_STR_GRADES_SHEET_COLUMN_NAME_EMAILED_GRADE" : "Notations envoyées",

       // Name of column in Grades sheet that allows teacher to enter optional student feedback
       "FLB_STR_GRADES_SHEET_COLUMN_NAME_STUDENT_FEEDBACK" : "Commentaire pour les élèves (optionnel)",

       // Window title for emailing grades
       "FLB_STR_EMAIL_GRADES_WINDOW_TITLE" : "Flubaroo - Courriel de Notation",

       // Instructions on how to email grades
       "FLB_STR_EMAIL_GRADES_INSTR" : "Flubaroo peut envoye rà chaque élèves de la classe les réponses correctes. Utilisez le menu déroulant pour sélectionner la question à envoyer aux élèves par Courriel. Si les adresses n'ont pas été recueillis, alors vous ne serez pas en mesure d'envoyer correctement les courriels.",

       // Notice that grades cannot be emailed because the user has exceeded their daily quota.
       "FLB_STR_EMAIL_DAILY_QUOTA_EXCEEDED" : "Flubaro ne peut pas envoyer par courriell les scores en ce moment parce que vous avez dépassé votre quota quotidien de courriels par jour. Ce quota est fixé par Google  pour tous les Add -ons. Merci d’essayer ultérieurement.",
    
       // Message about how many grade emails *have* been sent. This message is preceeded by a number.
       // Example: "5 grades were successfully emailed"
       "FLB_STR_VIEW_EMAIL_GRADES_NUMBER_SENT" : "Les Notations ont été envoyées correctements",

       // Message about how many grade emails *have NOT* been sent. This message is preceeded by a number.
       "FLB_STR_VIEW_EMAIL_GRADES_NUMBER_UNSENT" : "Les Notations n'ont pas été envoyées en raison d'adresses courriel non valides ou inexistantes, ou parce qu'ils ont déjà été envoyées.",

       // Message about how many grade emails *have NOT* been sent.
       "FLB_STR_VIEW_EMAIL_GRADES_NO_EMAILS_SENT" : "Aucune note ont été envoyés par courriel, car aucune des adresses courriels valides ont été trouvés, ou parce que tous les élèves ont déjà reçus leur résultat.",    
    
       // Subject of the email students receive. Followed by assignment name.
       // Example: Here is your grade for "Algebra Quiz #6"
       "FLB_STR_EMAIL_GRADES_EMAIL_SUBJECT" : "Résultats du devoir :",

       // First line of email sent to students
       // Example: This email contains your grade for "Algebra Quiz #6"
       "FLB_STR_EMAIL_GRADES_EMAIL_BODY_START" : "Ce courriel contient votre note pour",

       // Message telling students not to reply to the email with their grades
       "FLB_STR_EMAIL_GRADES_DO_NOT_REPLY_MSG" : "Ne pas répondre à ce message",

       // Message that preceedes the student's grade
       "FLB_STR_EMAIL_GRADES_YOUR_GRADE" : "Notation",

       // Message that preceedes the instructor's (optional) message in the email
       "FLB_STR_EMAIL_GRADES_INSTRUCTOR_MSG_BELOW" : "Message de professeur pour l'ensemble de la classe",

       // Message that preceedes the instructor's (optional) feedback for the student in the email
       "FLB_STR_EMAIL_GRADES_STUDENT_FEEDBACK_BELOW" : "Commentaire personnel de votre professeur",

       // Message that preceedes the summary of the student's information (name, date, etc)
       "FLB_STR_EMAIL_GRADES_SUBMISSION_SUMMARY" : "Résumé du devoir",

       // Message that preceedes the table of the students scores (no answer key sent)
       "FLB_STR_EMAIL_GRADES_BELOW_IS_YOUR_SCORE" : "Ci-dessous votre résultat pour chaque question, avec la réponse correcte",

       // Message that preceedes the table of the students scores, and answer key
       "FLB_STR_EMAIL_GRADES_BELOW_IS_YOUR_SCORE_AND_THE_ANSWER" : "Ci-dessous la note pour chaque question, avec la réponse correcte",

       // Header for the  column in the table of scores in the email which lists the question asked.
       "FLB_STR_EMAIL_GRADES_SCORE_TABLE_QUESTION_HEADER" : "Question",

       // Header for the  column in the table of scores in the email which lists the student's answer.
       "FLB_STR_EMAIL_GRADES_SCORE_TABLE_YOUR_ANSWER_HEADER" : "Votre réponse",

       // Header for the  column in the table of scores in the email which lists the correct answer.
       "FLB_STR_EMAIL_GRADES_SCORE_TABLE_CORRECT_ANSWER_HEADER" : "Réponse correcte",

       // Header for the column in the table of scores in the email which lists the student's score (0, 1, 2...)
       "FLB_STR_EMAIL_GRADES_SCORE_TABLE_YOUR_SCORE_HEADER" : "Votre résultat",

       // Header for the  column in the table of scores in the email which lists the points possible (e.g. 5).
       "FLB_STR_EMAIL_GRADES_SCORE_TABLE_POINTS_POSSIBLE_HEADER" : "Points Possibles",

       // Header for the  column in the table of scores in the email which lists the Help Tip (if provided)
       "FLB_STR_EMAIL_GRADES_SCORE_TABLE_HELP_TIP_HEADER" : "Aide pour cette question",

       // Label for "points" used in the new style email summary of grades
       "FLB_STR_EMAIL_GRADES_SCORE_TABLE_POINTS" : "point(s)",

       // Label for "Correct" questions in new style email summary of grades
       "FLB_STR_EMAIL_GRADES_SCORE_TABLE_CORRECT" : "Correct",

       // Label for "Incorrect" questions in new style email summary of grades
       "FLB_STR_EMAIL_GRADES_SCORE_TABLE_INCORRECT" : "Incorrect",

       // Footer for the email sent to students, advertising Flubaroo.
       "FLB_STR_EMAIL_GRADES_EMAIL_FOOTER" : "Ce courrier à été envoyé par Flubaroo, c'est une application gratuite d'envoi de notation",

       // Link at the end of the footer. Leads to www.flubaroo.com
       "FLB_STR_EMAIL_GRADES_VISIT_FLUBAROO" : "Visite flubaroo.com",

       // Subject of the record email sent to the instructor, when grades are emailed to the class.
       // Followed by the assignment name.
       // e.g. Record of grades emailed for Algebra Quiz #6
       "FLB_STR_EMAIL_RECORD_EMAIL_SUBJECT": "Enregistrement pour l'envoi de notation de",

       // Used in the record email sent to the instructor after she emails grades.
       // Labels the name of the assignment, in the summary table.
       "FLB_STR_EMAIL_RECORD_ASSIGNMENT_NAME": "Nom du devoir",

       // Used in the record email sent to the instructor after she emails grades.
       // Labels the number of emails sent, in the summary table.
       "FLB_STR_EMAIL_RECORD_NUM_EMAILS_SENT": "Quantité de courriels envoyés",

       // Used in the record email sent to the instructor after she emails grades.
       // Labels the number of graded submissions, in the summary table
       "FLB_STR_EMAIL_RECORD_NUM_GRADED_SUBM": "Quantité d'envoi de Notation",

       // Used in the record email sent to the instructor after she emails grades.
       // Labels the average score in points (vs percent), in the summary table
       "FLB_STR_EMAIL_RECORD_AVERAGE_SCORE": "Moyenne (points)",

       // Used in the record email sent to the instructor after she emails grades.
       // Labels the points possible, in the summary table
       "FLB_STR_EMAIL_RECORD_POINTS_POSSIBLE": "Nbr de points possibles",

       // Used in the record email sent to the instructor after she emails grades.
       // Indicated if an answer key was provided to the students, in the summary table
       "FLB_STR_EMAIL_RECORD_ANSWER_KEY_PROVIDED": "liste des questions envoyées",

       // Used in the record email sent to the instructor after she emails grades.
       // Value in summary table if answer key was NOT sent to students by instructor
       "FLB_STR_EMAIL_RECORD_ANSWER_KEY_NO": "Non",

       // Used in the record email sent to the instructor after she emails grades.
       // Value in summary table if answer key WAS sent to students by instructor
       "FLB_STR_EMAIL_RECORD_ANSWER_KEY_YES": "Oui",

       // Used in the record email sent to the instructor after she emails grades.
       // Message that preceeds what message the instructor email to her students.
       "FLB_STR_EMAIL_RECORD_INSTRUCTOR_MESSAGE": "Vous avez également inclus ce message",

       // About Flubaroo message (1 of 2)
       "FLB_STR_ABOUT_FLUBAROO_MSG1" : "Flubaroo est un outil gratuit, qui permet au enseignants de gagné du temps. Il permet de corriger, noter des QCM de façon automatique et en permettant  une analyse des résultats",

       // About Flubaroo message (2 of 2)
       "FLB_STR_ABOUT_FLUBAROO_MSG2" : "Pour en savoir plus, visitez www.flubaroo.com. Vous pouvez aussi envoyez vos commentaires ou idées à feedback@flubaroo.com",

       // Message that appears when "Student Submissions" sheet cannot be located.
       "FLB_STR_CANNOT_FIND_SUBM_MSG" : "Flubaroo n'a pas pu déterminer la feuille qui contient les soumissions. localiser cette fiche,et renommez-la:",

       // Message that appears when "Grades" sheet cannot be located.
       "FLB_STR_CANNOT_FIND_GRADES_MSG" : "Flubaroo n'a pas pu déterminer la feuille qui contient la notation. S'il vous plaît re-noter le devoir, ou localiser cette fiche,et renommez-la:",

       // Menu option to grade assignment.
       "FLB_STR_MENU_GRADE_ASSIGNMENT" : "Lancer la notation",

       // Menu option to re-grade assignment.
       "FLB_STR_MENU_REGRADE_ASSIGNMENT" : "Re-noter la soumission",

       // Menu option to email grades.
       "FLB_STR_MENU_EMAIL_GRADES" : "Envoyer les Notations",

       // Menu option to hide student feedback (hides the column)
       "FLB_STR_MENU_HIDE_FEEDBACK" : "Cacher les commentaires pour les élèves",

       // Menu option to edit student feedback (unhides the column)
       "FLB_STR_MENU_EDIT_FEEDBACK" : "Montrer les commentaires pour les élèves",

       // Menu option to hide help tips
       "FLB_STR_MENU_HIDE_HELP_TIPS" : "Cacher l'aide aux questions",

       // Menu option to edit help tips
       "FLB_STR_MENU_EDIT_HELP_TIPS" : "Montrer l'aide aux questions",

       // Menu option to view report.
       "FLB_STR_MENU_VIEW_REPORT" : "Voir le rapport",

       // Menu option to learn About Flubaroo.
       "FLB_STR_MENU_ABOUT" : "A propos de Flubaroo",

       // Menu option to choose the language.
       "FLB_STR_MENU_SET_LANGUAGE" : "Séléctionner la langue",

       // Word that appears on the "Continue" button in grading and emailing grades.
       "FLB_STR_BUTTON_CONTINUE" : "Continuer",

       // Name of "Student Submissions" sheet
       "FLB_STR_SHEETNAME_STUD_SUBM" :"Réponses élèves",  // gbl_subm_sheet_name

       // Name of "Grades" sheet
       "FLB_STR_SHEETNAME_GRADES" :"Notations", //gbl_grades_sheet_name

       // Text put in Grades sheet when a question isnt graded.
       "FLB_STR_NOT_GRADED" : "Non noté",

       // Message that is displayed when a new version of Flubaroo is installed.
       "FLB_STR_NEW_VERSION_NOTICE" : "Vous avez installé une nouvelle version Flubaroo! Visitez flubaroo.com blog pour voir ce qui est nouveau.",

       // Headline for notifications / alerts.
       "FLB_STR_NOTIFICATION" : "Notification de Fubaroo",

       // For emailing grades, question which asks user to identify email question.
       "FLB_STR_EMAIL_GRADES_IDENTIFY_EMAIL" : "Sujet du courriel :  ", // note the space after ":"

       // For emailing grades, asks user if list of questions and scores should be sent.
       "FLB_STR_EMAIL_GRADES_QUESTIONS_AND_SCORES" : "Inclure la liste des questions et le barême :  ", // note the space after ":"

       // For emailing grades, asks user if answer key should be sent...
       "FLB_STR_EMAIL_GRADES_ANSWER_KEY" : "Inclure les réponses correctes: ", // note the space after ":"
      
       // For emailing grades, appears before text box for optional instructor message.
       "FLB_STR_EMAIL_GRADES_INSTRUCTOR_MESSAGE" : "Message à inclure dans Email (facultatif) :",

       // Window title for View Report window
       "FLB_STR_VIEW_REPORT_WINDOW_TITLE" : "Flubaroo - Rapport de Notation",

       // Title of historgram chart in report
       "FLB_STR_VIEW_REPORT_HISTOGRAM_CHART_TITLE" : "Histogramme de Notations",

       // Y-Axis (vertical) title of historgram chart in report
       "FLB_STR_VIEW_REPORT_HISTOGRAM_Y-AXIS_TITLE" : "Envoyer",

       // X-Axis (horizontal) title of historgram chart in report
       "FLB_STR_VIEW_REPORT_HISTOGRAM_X-AXIS_TITLE" : "Réponses correctes",

       // Label of "Email Me Report" button in View Report window
       "FLB_STR_VIEW_REPORT_BUTTON_EMAIL_ME" : "Envoyer le rapport par courriel",

       // Notification that tells who the report was emailed to (example: "The report has been emailed to: bob@hi.com")
       "FLB_STR_VIEW_REPORT_EMAIL_NOTIFICATION" : "Le rapport à été envoyé à"
   },
   // END FRENCH //////////////////////////////////////////////////////////////////////////////////
    
   // START FRENCH CANADIAN //////////////////////////////////////////////////////////////////
   // Vous pouvez traduire tout ce qui n'est pas en majuscule. 
   // Tous les textes précédés par // sont des commentaires. Ils ne sont pas prioritaires.
   // Merci de nous aidez à traduire ce script. 
   //
   // Traducteurs : Pascal Lapalme, Jean Desjardins, Roxanne Roy, Guylaine Duranceau
   //
   // Version française (Canada)
   //
   ///////////////////////////////////////////////////////////////////////////////////////////
    "fr-CA": {
        // Name to identify language in language selector
        "FLB_LANG_IDENTIFIER": "Français (Canada)",

        // Grading option which identifies a student
        "FLB_STR_GRADING_OPT_STUD_ID" : "Identification de l’élève",

        // Grading option which tells Flubaroo to skip grading on a question
        "FLB_STR_GRADING_OPT_SKIP_GRADING" : "Ne pas noter",

        // Grading option for 1 point
        "FLB_STR_GRADING_OPT_1_PT" : "1 Point",

        // Grading option for 2 points
        "FLB_STR_GRADING_OPT_2_PT" : "2 Points",

        // Grading option for 3 points
        "FLB_STR_GRADING_OPT_3_PT" : "3 Points",

        // Grading option for 4 points
        "FLB_STR_GRADING_OPT_4_PT" : "4 Points",

        // Grading option for 5 points
        "FLB_STR_GRADING_OPT_5_PT" : "5 Points",

        // Message shown when grading is complete (1 of 2).
        "FLB_STR_RESULTS_MSG1" : "Correction terminée! Une nouvelle feuille appelée « Résultats » a été créée plus bas. Cette feuille contient les résultats de chaque élève ainsi qu'un sommaire. ** Note: La feuille 'Résultats' ne devrait pas être modifiée. Cela pourrait interférer avec l'envoi par courriel des résultats. Si vous avez besoin de le faire, copiez la feuille et modifiez la copie.",

        // Message shown when grading is complete (2 of 2).
        "FLB_STR_RESULTS_MSG2" : "Conseils : La dernière ligne montre le pourcentage des élèves qui ont réussi chaque question. Les questions les plus ratées sont en surbrillance orange. De plus, les noms des élèves qui ont eu moins de 70% sont en rouge",

        // Instructions shown on Step 1 of grading.
        "FBL_STR_STEP1_INSTR" : "Veuillez choisir l’option de notation la meilleure pour chaque question de votre test. Flubaroo a essayé de le déterminer pour vous, mais vous êtes l’humain derrière la machine!",

        // Instructions shown on Step 2 of grading.
        "FBL_STR_STEP2_INSTR" : "Veuillez choisir quelle entrée au formulaire servira de clé de correction. Habituellement, cela sera une réponse que vous aurez soumise vous-même. Flubaroo fonctionne en comparant les cases avec la clé.",

        // Message shown if not enough submissions to perform grading.
        "FBL_STR_GRADE_NOT_ENOUGH_SUBMISSIONS" : "Il doit y avoir au minimum deux entrées pour effectuer la correction. Essayez plus tard lorsque d'autres élèves auront envoyé leurs réponses.",

        // Please wait" message first shown when Flubaroo is first examining assignment.
        "FLB_STR_WAIT_INSTR1" : "Flubaroo examine votre test. Veuillez patienter...",

        // Please wait" message shown after Step 1 and Step 2, while grading is happening.
        "FLB_STR_WAIT_INSTR2" :  "Merci de patienter pendant que votre test se corrige. Ceci peut prendre quelques instants.",

        // Asks user if they are sure they want to re-grade, if Grades sheet exists.
        "FLB_STR_REPLACE_GRADES_PROMPT" : "Ceci va remplacer vos notes existantes. Est-ce bien ce que vous voulez?",

        // Window title for "Preparing to grade" window
        "FLB_STR_PREPARING_TO_GRADE_WINDOW_TITLE" : "Flubaroo - En préparation pour la correction",

        // Window title for "Please wait" window while grading occurs
        "FLB_STR_GRADING_WINDOW_TITLE" : "Flubaroo - Correction de votre test",

        // Window title for "Grading Complete" window after grading occurs
        "FLB_STR_GRADING_COMPLETE_TITLE" : "Flubaroo - Correction complétée",

        // Window title for grading Step 1
        "FLB_STR_GRADE_STEP1_WINDOW_TITLE" : "Flubaroo - Classement Étape 1",

        // Window title for grading Step 2
        "FLB_STR_GRADE_STEP2_WINDOW_TITLE" : "Flubaroo - Classement Étape 2",

        // "Grading Option" label that appears over first column in Step 1 of grading.
        "FLB_STR_GRADE_STEP1_LABEL_GRADING_OPTION" : "Option de classement",

        // "Question" label that appears over second column in Step 1 of grading.
        "FLB_STR_GRADE_STEP1_LABEL_QUESTION" : "Question",

        // "Select" label that appears over radio button in first column of Step 2 of grading.
        "FLB_STR_GRADE_STEP2_LABEL_SELECT" : "Choisir",

        // "Submission Time" label that appears over second column in Step 2 of grading.
        "FLB_STR_GRADE_STEP2_LABEL_SUBMISSION_TIME" : "Horodateur",

        // Label for "View Grades" button shown when grading completes.
        "FLB_STR_GRADE_BUTTON_VIEW_GRADES" : "Voir les résultats",

        // Used for "summary" text shown at top of Grades sheet, and in report.
        "FLB_STR_GRADE_SUMMARY_TEXT_SUMMARY" : "Sommaire",

        // Used for report and report email. Ex: "Report for 'My Test'"
        "FLB_STR_GRADE_SUMMARY_TEXT_REPORT_FOR" : "Résultat pour",

        // Points Possible. Used for text shown at top of Grades sheet, and in report.
        "FLB_STR_GRADE_SUMMARY_TEXT_POINTS_POSSIBLE" : "Points maximum",

        // Average Points. Used for text shown at top of Grades sheet, and in report.
        "FLB_STR_GRADE_SUMMARY_TEXT_AVERAGE_POINTS" : "Moyenne",

        // Counted Submissions. Used for text shown at top of Grades sheet, and in report.
        "FLB_STR_GRADE_SUMMARY_TEXT_COUNTED_SUBMISSIONS" : "Nombre de formulaires reçus corrigés",

        // Number of Low Scoring Questions. Used for text shown at top of Grades sheet, and in report.
        "FLB_STR_GRADE_SUMMARY_TEXT_NUM_LOW_SCORING" : "Nombre de questions à faible pointage",

        // Name of column in Grades sheet that has total points scored.
        "FLB_STR_GRADES_SHEET_COLUMN_NAME_TOTAL_POINTS" : "Résultat",

        // Name of column in Grades sheet that has score as percent.
        "FLB_STR_GRADES_SHEET_COLUMN_NAME_PERCENT" : "Pourcentage",

        // Name of column in Grades sheet that has number of times student made a submission.
        "FLB_STR_GRADES_SHEET_COLUMN_NAME_TIMES_SUBMITTED" : "Nombre de soumissions",

        // Name of column in Grades sheet that indicates if grade was already emailed out.
        "FLB_STR_GRADES_SHEET_COLUMN_NAME_EMAILED_GRADE" : "Courriel envoyé?",

        // Name of column in Grades sheet that allows teacher to enter optional student feedback
        "FLB_STR_GRADES_SHEET_COLUMN_NAME_STUDENT_FEEDBACK" : "Rétroaction à l’élève (optionel)",

        // Window title for emailing grades
        "FLB_STR_EMAIL_GRADES_WINDOW_TITLE" : "Flubaroo - Envoyer les résultats par courriel",

        // Instructions on how to email grades
        "FLB_STR_EMAIL_GRADES_INSTR" : "Flubaroo peut envoyer un courriel à chaque élève, de même que les réponses. Identifiez la question pour laquelle vous avez demandé les courriels. Si l’adresse est incomplète ou invalide, les envois ne fonctionneront pas.",

        // Notice that grades cannot be emailed because the user has exceeded their daily quota.
        "FLB_STR_EMAIL_DAILY_QUOTA_EXCEEDED" : "Flubaroo ne peut envoyer les courriels parce que vous avez dépassé la limite de par jour que fixe Google aux modules externes comme Flubaroo. Merci de réessayer demain.",
      
        // Message about how many grade emails *have* been sent. This message is preceeded by a number.
        // Example: "5 grades were successfully emailed"
        "FLB_STR_VIEW_EMAIL_GRADES_NUMBER_SENT" : "Les notes et rétroactions ont été acheminées correctement",

        // Message about how many grade emails *have NOT* been sent. This message is preceeded by a number.
        "FLB_STR_VIEW_EMAIL_GRADES_NUMBER_UNSENT" : "Les notes n’ont pas été envoyées car l’adresse de courriel est absente ou invalide, ou parce que les notes ont déjà été envoyées.",

        // Message about how many grade emails *have NOT* been sent.
        "FLB_STR_VIEW_EMAIL_GRADES_NO_EMAILS_SENT" : "Aucun envoi effectué parce que Flubaroo n’a pas trouvé d’adresse courriel là où vous l’aviez indiqué ou parce que les élèves l’avaient déjà reçu. Si vous voulez les renvoyer, effacez le x dans la case de la feuille des résultats",     
      
        // Subject of the email students receive. Followed by assignment name.
        // Example: Here is your grade for "Algebra Quiz #6"
        "FLB_STR_EMAIL_GRADES_EMAIL_SUBJECT" : "Voici votre résultat pour",

        // First line of email sent to students
        // Example: This email contains your grade for "Algebra Quiz #6"
        "FLB_STR_EMAIL_GRADES_EMAIL_BODY_START" : "Ce courriel contient votre résultat pour",

        // Message telling students not to reply to the email with their grades
        "FLB_STR_EMAIL_GRADES_DO_NOT_REPLY_MSG" : "Ne répondez pas à ce courriel",

        // Message that preceedes the student's grade
        "FLB_STR_EMAIL_GRADES_YOUR_GRADE" : "Votre résultat",

        // Message that preceedes the instructor's (optional) message in the email
        "FLB_STR_EMAIL_GRADES_INSTRUCTOR_MSG_BELOW" : "Voici un message de l'enseignant(e), envoyé à tous",

        // Message that preceedes the instructor's (optional) feedback for the student in the email
        "FLB_STR_EMAIL_GRADES_STUDENT_FEEDBACK_BELOW" : "Votre enseignant(e) vous destine ce message à vous en particulier",

        // Message that preceedes the summary of the student's information (name, date, etc)
        "FLB_STR_EMAIL_GRADES_SUBMISSION_SUMMARY" : "Sommaire de votre soumission",

        // Message that preceedes the table of the students scores (no answer key sent)
        "FLB_STR_EMAIL_GRADES_BELOW_IS_YOUR_SCORE" : "Vous trouverez ci-dessous, vos notes pour chaque question",

        // Message that preceedes the table of the students scores, and answer key
        "FLB_STR_EMAIL_GRADES_BELOW_IS_YOUR_SCORE_AND_THE_ANSWER" : "En plus de la bonne réponse, vous trouverez votre résultat pour chacune des questions", 

        // Header for the  column in the table of scores in the email which lists the question asked.
        "FLB_STR_EMAIL_GRADES_SCORE_TABLE_QUESTION_HEADER" : "Question",

        // Header for the  column in the table of scores in the email which lists the student's answer.
        "FLB_STR_EMAIL_GRADES_SCORE_TABLE_YOUR_ANSWER_HEADER" : "Votre réponse",

        // Header for the  column in the table of scores in the email which lists the correct answer.
        "FLB_STR_EMAIL_GRADES_SCORE_TABLE_CORRECT_ANSWER_HEADER" : "Bonne réponse",

        // Header for the column in the table of scores in the email which lists the student's score (0, 1, 2...)
        "FLB_STR_EMAIL_GRADES_SCORE_TABLE_YOUR_SCORE_HEADER" : "Votre résultat",

        // Header for the  column in the table of scores in the email which lists the points possible (e.g. 5).
        "FLB_STR_EMAIL_GRADES_SCORE_TABLE_POINTS_POSSIBLE_HEADER" : "Résultat maximal",

        // Header for the  column in the table of scores in the email which lists the Help Tip (if provided)
        "FLB_STR_EMAIL_GRADES_SCORE_TABLE_HELP_TIP_HEADER" : "Aide pour cette question",

        // Label for "points" used in the new style email summary of grades
        "FLB_STR_EMAIL_GRADES_SCORE_TABLE_POINTS" : "point(s)",

        // Label for "Correct" questions in new style email summary of grades
        "FLB_STR_EMAIL_GRADES_SCORE_TABLE_CORRECT" : "Bonne réponse",

        // Label for "Incorrect" questions in new style email summary of grades
        "FLB_STR_EMAIL_GRADES_SCORE_TABLE_INCORRECT" : "Mauvaise réponse",

        // Footer for the email sent to students, advertising Flubaroo.
        "FLB_STR_EMAIL_GRADES_EMAIL_FOOTER" : "Ce courriel a été généré par Flubaroo pour les formulaires Google, un outil gratuit de correction et de rétroaction.",

        // Link at the end of the footer. Leads to www.flubaroo.com
        "FLB_STR_EMAIL_GRADES_VISIT_FLUBAROO" : "Visitez flubaroo.com",

        // Subject of the record email sent to the instructor, when grades are emailed to the class.
        // Followed by the assignment name.
        // e.g. Record of grades emailed for Algebra Quiz #6
        "FLB_STR_EMAIL_RECORD_EMAIL_SUBJECT": "Résultats envoyés par courriel pour",

        // Used in the record email sent to the instructor after she emails grades.
        // Labels the name of the assignment, in the summary table.
        "FLB_STR_EMAIL_RECORD_ASSIGNMENT_NAME": "Nom du devoir ou du travail",

        // Used in the record email sent to the instructor after she emails grades.
        // Labels the number of emails sent, in the summary table.
        "FLB_STR_EMAIL_RECORD_NUM_EMAILS_SENT": "Nombre de courriels envoyés",

        // Used in the record email sent to the instructor after she emails grades.
        // Labels the number of graded submissions, in the summary table
        "FLB_STR_EMAIL_RECORD_NUM_GRADED_SUBM": "Nombre de copies notées soumises",

        // Used in the record email sent to the instructor after she emails grades.
        // Labels the average score in points (vs percent), in the summary table
        "FLB_STR_EMAIL_RECORD_AVERAGE_SCORE": "Résultat moyen (points)",

        // Used in the record email sent to the instructor after she emails grades.
        // Labels the points possible, in the summary table
        "FLB_STR_EMAIL_RECORD_POINTS_POSSIBLE": "Note maximale",//à revoir selon le contexte

        // Used in the record email sent to the instructor after she emails grades.
        // Indicated if an answer key was provided to the students, in the summary table
        "FLB_STR_EMAIL_RECORD_ANSWER_KEY_PROVIDED": "Avez-vous  fourni les réponses?",

        // Used in the record email sent to the instructor after she emails grades.
        // Value in summary table if answer key was NOT sent to students by instructor
        "FLB_STR_EMAIL_RECORD_ANSWER_KEY_NO": "Non",

        // Used in the record email sent to the instructor after she emails grades.
        // Value in summary table if answer key WAS sent to students by instructor
        "FLB_STR_EMAIL_RECORD_ANSWER_KEY_YES": "Oui",

        // Used in the record email sent to the instructor after she emails grades.
        // Message that preceeds what message the instructor email to her students.
        "FLB_STR_EMAIL_RECORD_INSTRUCTOR_MESSAGE": "Vous avez aussi inclus ce message",

        // About Flubaroo message (1 of 2)
        "FLB_STR_ABOUT_FLUBAROO_MSG1" : "Flubaroo est gratuit et vous permet de gagner du temps. Il corrige des questions simples, analyse les résultats et donne une rétroaction aux élèves",

        // About Flubaroo message (2 of 2)
        "FLB_STR_ABOUT_FLUBAROO_MSG2" : "Pour en apprendre plus, il y a www.flubaroo.com. Adressez vos commentaires et vos suggestions à dave@edcode.org.",

        // Message that appears when "Student Submissions" sheet cannot be located.
        "FLB_STR_CANNOT_FIND_SUBM_MSG" : "Flubaroo ne peut déterminer quelle feuille contient les soumissions des élèves.  Veuillez trouvez cette feuille et la renommer: ",

        // Message that appears when "Grades" sheet cannot be located.
        "FLB_STR_CANNOT_FIND_GRADES_MSG" : "Flubaroo ne peut déterminer quelle feuille contient les notes.  Veuillez noter le travail, ou trouver cette feuille et la renommer: ",

        // Menu option to grade assignment.
        "FLB_STR_MENU_GRADE_ASSIGNMENT" : "Corriger le formulaire",

        // Menu option to re-grade assignment.
        "FLB_STR_MENU_REGRADE_ASSIGNMENT" : "Corriger le formulaire à nouveau",

        // Menu option to email grades.
        "FLB_STR_MENU_EMAIL_GRADES" : "Envoyer le courriel des résulats",

        // Menu option to hide student feedback (hides the column)
        "FLB_STR_MENU_HIDE_FEEDBACK" : "Cacher les rétroactions individuelles",

        // Menu option to edit student feedback (unhides the column)
        "FLB_STR_MENU_EDIT_FEEDBACK" : "Colonne des rétroactions individuelles",

        // Menu option to hide help tips
        "FLB_STR_MENU_HIDE_HELP_TIPS" : "Cacher les rétroactions des questions",

        // Menu option to edit help tips
        "FLB_STR_MENU_EDIT_HELP_TIPS" : "Ligne des rétroactions pour les questions ratées",

        // Menu option to view report.
        "FLB_STR_MENU_VIEW_REPORT" : "Consulter le rapport",

        // Menu option to learn About Flubaroo.
        "FLB_STR_MENU_ABOUT" : "À propos Flubaroo",

        // Menu option to choose the language.
        "FLB_STR_MENU_SET_LANGUAGE" : "Choisir la langue",

        // Word that appears on the "Continue" button in grading and emailing grades.
        "FLB_STR_BUTTON_CONTINUE" : "Continuer",

        // Name of "Student Submissions" sheet
        "FLB_STR_SHEETNAME_STUD_SUBM" :"Réponses élèves",  // gbl_subm_sheet_name

        // Name of "Grades" sheet
        "FLB_STR_SHEETNAME_GRADES" :"Notations", //gbl_grades_sheet_name

        // Text put in Grades sheet when a question isnt graded.
        "FLB_STR_NOT_GRADED" : "Non évalué",

        // Message that is displayed when a new version of Flubaroo is installed.
        "FLB_STR_NEW_VERSION_NOTICE" : "Vous avez installé une nouvelle version de Flubaroo! Visitez flubaroo.com/blog pour plus de détails.",

        // Headline for notifications / alerts.
        "FLB_STR_NOTIFICATION" : "Notification de Flubaroo",

        // For emailing grades, question which asks user to identify email question.
        "FLB_STR_EMAIL_GRADES_IDENTIFY_EMAIL" : "Question d’adresse de courriel ", // note the space after ":"

        // For emailing grades, asks user if list of questions and scores should be sent.
        "FLB_STR_EMAIL_GRADES_QUESTIONS_AND_SCORES" : "Inclure la liste des questions et des résultats: ", // note the space after ":"

        // For emailing grades, asks user if answer key should be sent...
        "FLB_STR_EMAIL_GRADES_ANSWER_KEY" : "Inclure la clé de correction: ", // note the space after ":"
        
        // For emailing grades, appears before text box for optional instructor message.
        "FLB_STR_EMAIL_GRADES_INSTRUCTOR_MESSAGE" : "Rétroaction au groupe (optionel):",

        // Window title for View Report window
        "FLB_STR_VIEW_REPORT_WINDOW_TITLE" : "Flubaroo - Résultats",

        // Title of historgram chart in report
        "FLB_STR_VIEW_REPORT_HISTOGRAM_CHART_TITLE" : "Histogramme des résultats",

        // Y-Axis (vertical) title of historgram chart in report
        "FLB_STR_VIEW_REPORT_HISTOGRAM_Y-AXIS_TITLE" : "Effectif",

        // X-Axis (horizontal) title of historgram chart in report
        "FLB_STR_VIEW_REPORT_HISTOGRAM_X-AXIS_TITLE" : "Points obtenus",

        // Label of "Email Me Report" button in View Report window
        "FLB_STR_VIEW_REPORT_BUTTON_EMAIL_ME" : "Envoyez-moi les résultats",

        // Notification that tells who the report was emailed to (example: "The report has been emailed to: bob@hi.com")
        "FLB_STR_VIEW_REPORT_EMAIL_NOTIFICATION" : "Les résultats ont été envoyés à"
    },
    // END FRENCH CANADIAN ////////////////////////////////////////////////////////////////////////////
	

	// START HEBREW////////////////////////////////////////////////////////////////////////////////
	"he-il": {
	  // Name to identify language in language selector
	  "FLB_LANG_IDENTIFIER": "עברית (Hebrew)",

	  // Grading option which identifies a student
	  "FLB_STR_GRADING_OPT_STUD_ID" : "מזהה תלמיד",

	  // Grading option which tells Flubaroo to skip grading on a question
	  "FLB_STR_GRADING_OPT_SKIP_GRADING" : "ללא ניקוד",

	  // Grading option for 1 point
	  "FLB_STR_GRADING_OPT_1_PT" : "נקודה אחת",

	  // Grading option for 2 points
	  "FLB_STR_GRADING_OPT_2_PT" : "שתי נקודות",

	  // Grading option for 3 points
	  "FLB_STR_GRADING_OPT_3_PT" : "שלוש נקודות",

	  // Grading option for 4 points
	  "FLB_STR_GRADING_OPT_4_PT" : "ארבע נקודות",

	  // Grading option for 5 points
	  "FLB_STR_GRADING_OPT_5_PT" : "חמש נקודות",

	  // Message shown when grading is complete (1 of 2).
	  "FLB_STR_RESULTS_MSG1" : "הבדיקה הושלמה בהצלחה! נוצר גיליון נתונים חדש בשם ‘ציונים’. גיליון זה כולל בתוכו ציון לכל מענה שנשלח לבחינה, וסיכום של כל הציונים בראשית הגיליון. **הערה: הגיליון ‘ציונים’ אינו מיועד לעריכה בשום אופן, משום שזו עלולה לפגום ביכולתך לשלוח ציונים בדוא’’ל. אם ברצונך לשנות גיליון זה, אנא צור העתק וערוך את ההעתק שיצרת.",

	  // Message shown when grading is complete (2 of 2).
	  "FLB_STR_RESULTS_MSG2" : "טיפ: השורה האחרונה בתחתית הגיליון מציגה את אחוז התלמידים שענו נכונה בכל שאלה ושאלה, כשהשאלות שבהן טעו רבים מהתלמידים מסומנות בכתום. בנוסף, תלמידים שקיבלו ציון כללי הנמוך מ70% יסומנו בגופן בצבע אדום.",

	  // Instructions shown on Step 1 of grading.
	  "FBL_STR_STEP1_INSTR" : "אנא בחר אפשרות לציון עבור כל שאלה במטלת הביצוע. פלובארו עשה את המיטב כדי לנחש את האפשרות המתאימה ביותר עבורך, אך מומלץ שתבדוק את האפשרויות שנבחרו עבור כל שאלה בעצמך.",

	  // Instructions shown on Step 2 of grading.
	  "FBL_STR_STEP2_INSTR" : "אנא בחר איזו מטלת ביצוע תשמש כמפתח התשובות. בדרך-כלל, זו תהיה מטלה שהוגשה על-ידיך. כל המטלות האחרות שהוגשו ייבחנו בהשוואה אל מפתח התשובות, כך שמומלץ לשים לב ולבחור את המטלה הנכונה.",

	  // Message shown if not enough submissions to perform grading.
	  "FBL_STR_GRADE_NOT_ENOUGH_SUBMISSIONS" : "חובה להגיש לפחות שתי מטלות ביצוע כדי לבצע את תהליך הבחינה. אנא נסה שוב לאחר שתלמידים נוספים יגישו את מטלותיהם.",

	  // Please wait" message first shown when Flubaroo is first examining assignment.
	  "FLB_STR_WAIT_INSTR1" : "פלובארו סורק את מטלת הביצוע שלך. אנא המתן...",

	  // Please wait" message shown after Step 1 and Step 2, while grading is happening.
	  "FLB_STR_WAIT_INSTR2" : "אנא המתן בזמן שתשובות התלמידים נבדקות. תהליך זה עשוי להימשך כמה דקות.",

	  // Asks user if they are sure they want to re-grade, if Grades sheet exists.
	  "FLB_STR_REPLACE_GRADES_PROMPT" : "הערכה מחדש תחליף את הציונים הקיימים במערכת כעת. האם אתה בטוח שברצונך להמשיך?",

	  // Window title for "Preparing to grade" window
	  "FLB_STR_PREPARING_TO_GRADE_WINDOW_TITLE" : "פלובארו - מתכונן להערכה",

	  // Window title for "Please wait" window while grading occurs
	  "FLB_STR_GRADING_WINDOW_TITLE" : "פלובארו - מדרג את מטלת הביצוע",

	  // Window title for "Grading Complete" window after grading occurs
	  "FLB_STR_GRADING_COMPLETE_TITLE" : "פלובארו - התהליך הושלם בהצלחה",

	  // Window title for grading Step 1
	  "FLB_STR_GRADE_STEP1_WINDOW_TITLE" : "פלובארו - תהליך הערכה שלב 1",

	  // Window title for grading Step 2
	  "FLB_STR_GRADE_STEP2_WINDOW_TITLE" : "פלובארו - תהליך הערכה שלב 2",

	  // "Grading Option" label that appears over first column in Step 1 of grading.
	  "FLB_STR_GRADE_STEP1_LABEL_GRADING_OPTION" : "אפשרות הערכה",

	  // "Question" label that appears over second column in Step 1 of grading.
	  "FLB_STR_GRADE_STEP1_LABEL_QUESTION" : "שאלה",

	  // "Select" label that appears over radio button in first column of Step 2 of grading.
	  "FLB_STR_GRADE_STEP2_LABEL_SELECT" : "בחר כפתור",

	  // "Submission Time" label that appears over second column in Step 2 of grading.
	  "FLB_STR_GRADE_STEP2_LABEL_SUBMISSION_TIME" : "מועד ההגשה",

	  // Label for "View Grades" button shown when grading completes.
	  "FLB_STR_GRADE_BUTTON_VIEW_GRADES" : "צפה בציונים",

	  // Used for "summary" text shown at top of Grades sheet, and in report.
	  "FLB_STR_GRADE_SUMMARY_TEXT_SUMMARY" : "סיכום",

	  // Used for report and report email. Ex: "Report for 'My Test'"
	  "FLB_STR_GRADE_SUMMARY_TEXT_REPORT_FOR" : "דיווח תוצאות עבור",

	  // Points Possible. Used for text shown at top of Grades sheet, and in report.
	  "FLB_STR_GRADE_SUMMARY_TEXT_POINTS_POSSIBLE" : "ניקוד אפשרי",

	  // Average Points. Used for text shown at top of Grades sheet, and in report.
	  "FLB_STR_GRADE_SUMMARY_TEXT_AVERAGE_POINTS" : "ניקוד ממוצע",

	  // Counted Submissions. Used for text shown at top of Grades sheet, and in report.
	  "FLB_STR_GRADE_SUMMARY_TEXT_COUNTED_SUBMISSIONS" : "מספר המטלות שהוגשו",

	  // Number of Low Scoring Questions. Used for text shown at top of Grades sheet, and in report.
	  "FLB_STR_GRADE_SUMMARY_TEXT_NUM_LOW_SCORING" : "מספר השאלות בעלות ממוצע נמוך",

	  // Name of column in Grades sheet that has total points scored.
	  "FLB_STR_GRADES_SHEET_COLUMN_NAME_TOTAL_POINTS" : "ניקוד סופי",

	  // Name of column in Grades sheet that has score as percent.
	  "FLB_STR_GRADES_SHEET_COLUMN_NAME_PERCENT" : "ציון באחוזים",

	  // Name of column in Grades sheet that has number of times student made a submission.
	  "FLB_STR_GRADES_SHEET_COLUMN_NAME_TIMES_SUBMITTED" : "מספר הפעמים שהגיש",

	  // Name of column in Grades sheet that indicates if grade was already emailed out.
	  "FLB_STR_GRADES_SHEET_COLUMN_NAME_EMAILED_GRADE" : "נשלח דיווח בדוא’’ל?",

	  // Name of column in Grades sheet that allows teacher to enter optional student feedback
	  "FLB_STR_GRADES_SHEET_COLUMN_NAME_STUDENT_FEEDBACK" : "(לא חובה) משוב אישי לתלמיד",

	  // Window title for emailing grades
	  "FLB_STR_EMAIL_GRADES_WINDOW_TITLE" : "פלובארו - שליחת ציונים בדוא’’ל",

	  // Instructions on how to email grades
	  "FLB_STR_EMAIL_GRADES_INSTR" : "פלובארו יכול לשלוח ציונים בדואר האלקטרוני לכל תלמיד שנבחן במטלת הביצוע, וכן להציג בפניהם את התשובות הנכונות. השתמש בתפריט הנגלל כדי לבחור את השאלה שבה ביקשת מהתלמידים להזין את כתובת הדואר האלקטרוני שלהם. אם כתובת הדואר האלקטרוני לא הוזנה במבחן, אין באפשרותך לשלוח ציונים בדואר האלקטרוני.",

	  // Notice that grades cannot be emailed because the user has exceeded their daily quota.
	  "FLB_STR_EMAIL_DAILY_QUOTA_EXCEEDED" : "פלובארו אינו יכול לשלוח את הציונים בדואר האלקטרוני משום שחצית את המגבלה היומית שלך של הודעות דואר יוצא ביום. המגבלה הזו נקבעת על-ידי גוגל עבור כל התוספים. אנא נסה שנית במועד מאוחר יותר.",

	  // Message about how many grade emails *have* been sent. This message is preceeded by a number.
	  // Example: "5 grades were successfully emailed"
	  "FLB_STR_VIEW_EMAIL_GRADES_NUMBER_SENT" : "ציונים נשלחו בהצלחה",

	  // Message about how many grade emails *have NOT* been sent. This message is preceeded by a number.
	  "FLB_STR_VIEW_EMAIL_GRADES_NUMBER_UNSENT" : "ציונים אינם נשלחו בהצלחה משום שכתובת הדואר האלקטרוני אינה תקינה או שלא הוזנה, או משום שהציונים כבר נשלחו לפני כן.",

	  // Message about how many grade emails *have NOT* been sent.
	  "FLB_STR_VIEW_EMAIL_GRADES_NO_EMAILS_SENT" : "אף ציון אינו נשלח בדואר האלקטרוני משום שלא נמצאה כתובת דואר תקינה בתשובות התלמידים, או משום שכל התלמידים כבר קיבלו את הציונים שלהם בדואר האלקטרוני לפני כן.",

	  // Subject of the email students receive. Followed by assignment name.
	  // Example: Here is your grade for "Algebra Quiz #6"
	  "FLB_STR_EMAIL_GRADES_EMAIL_SUBJECT" : "להלן ציונך עבור",

	  // First line of email sent to students
	  // Example: This email contains your grade for "Algebra Quiz #6"
	  "FLB_STR_EMAIL_GRADES_EMAIL_BODY_START" : "הודעה זו כוללת את ציונך עבור",

	  // Message telling students not to reply to the email with their grades
	  "FLB_STR_EMAIL_GRADES_DO_NOT_REPLY_MSG" : "נא לא להשיב להודעה זו",

	  // Message that preceedes the student's grade
	  "FLB_STR_EMAIL_GRADES_YOUR_GRADE" : "ציונך",

	  // Message that preceedes the instructor's (optional) message in the email
	  "FLB_STR_EMAIL_GRADES_INSTRUCTOR_MSG_BELOW" : "להלן הודעה מהמדריך או המרצה שלך, שנשלחה לכלל תלמידי הכיתה",

	  // Message that preceedes the instructor's (optional) feedback for the student in the email
	  "FLB_STR_EMAIL_GRADES_STUDENT_FEEDBACK_BELOW" : "המדריך שלך צירף את המשוב האישי הבא להודעה שנשלחה אלייך בלבד",

	  // Message that preceedes the summary of the student's information (name, date, etc)
	  "FLB_STR_EMAIL_GRADES_SUBMISSION_SUMMARY" : "סיכום מטלת הביצוע שלך",

	  // Message that preceedes the table of the students scores (no answer key sent)
	  "FLB_STR_EMAIL_GRADES_BELOW_IS_YOUR_SCORE" : "להלן הניקוד שקיבלת עבור כל שאלה",

	  // Message that preceedes the table of the students scores, and answer key
	  "FLB_STR_EMAIL_GRADES_BELOW_IS_YOUR_SCORE_AND_THE_ANSWER" : "להלן הניקוד שקיבלת עבור כל שאלה, יחד עם התשובה הנכונה",

	  // Header for the column in the table of scores in the email which lists the question asked.
	  "FLB_STR_EMAIL_GRADES_SCORE_TABLE_QUESTION_HEADER" : "שאלה",

	  // Header for the column in the table of scores in the email which lists the student's answer.
	  "FLB_STR_EMAIL_GRADES_SCORE_TABLE_YOUR_ANSWER_HEADER" : "תשובתך",

	  // Header for the column in the table of scores in the email which lists the correct answer.
	  "FLB_STR_EMAIL_GRADES_SCORE_TABLE_CORRECT_ANSWER_HEADER" : "התשובה הנכונה",

	  // Header for the column in the table of scores in the email which lists the student's score (0, 1, 2...)
	  "FLB_STR_EMAIL_GRADES_SCORE_TABLE_YOUR_SCORE_HEADER" : "הניקוד שצברת",

	  // Header for the column in the table of scores in the email which lists the points possible (e.g. 5).
	  "FLB_STR_EMAIL_GRADES_SCORE_TABLE_POINTS_POSSIBLE_HEADER" : "ניקוד אפשרי",

	  // Header for the column in the table of scores in the email which lists the Help Tip (if provided)
	  "FLB_STR_EMAIL_GRADES_SCORE_TABLE_HELP_TIP_HEADER" : "הכוונה לשאלה זו",

	  // Label for "points" used in the new style email summary of grades
	  "FLB_STR_EMAIL_GRADES_SCORE_TABLE_POINTS" : "ניקוד",

	  // Label for "Correct" questions in new style email summary of grades
	  "FLB_STR_EMAIL_GRADES_SCORE_TABLE_CORRECT" : "נכון",

	  // Label for "Incorrect" questions in new style email summary of grades
	  "FLB_STR_EMAIL_GRADES_SCORE_TABLE_INCORRECT" : "לא נכון",

	  // Footer for the email sent to students, advertising Flubaroo.
	  "FLB_STR_EMAIL_GRADES_EMAIL_FOOTER" : "הודעה זו נוצרה על-ידי פלובארו, כלי חינמי לניקוד והערכה של מטלות ביצוע",

	  // Link at the end of the footer. Leads to www.flubaroo.com
	  "FLB_STR_EMAIL_GRADES_VISIT_FLUBAROO" : "בקר באתר flubaroo.com",

	  // Subject of the record email sent to the instructor, when grades are emailed to the class.
	  // Followed by the assignment name.
	  // e.g. Record of grades emailed for Algebra Quiz #6
	  "FLB_STR_EMAIL_RECORD_EMAIL_SUBJECT": "רשומת ציונים שנשלחו עבור",

	  // Used in the record email sent to the instructor after she emails grades.
	  // Labels the name of the assignment, in the summary table.
	  "FLB_STR_EMAIL_RECORD_ASSIGNMENT_NAME": "שם המטלה",

	  // Used in the record email sent to the instructor after she emails grades.
	  // Labels the number of emails sent, in the summary table.
	  "FLB_STR_EMAIL_RECORD_NUM_EMAILS_SENT": "מספר ההודעות שנשלחו",

	  // Used in the record email sent to the instructor after she emails grades.
	  // Labels the number of graded submissions, in the summary table
	  "FLB_STR_EMAIL_RECORD_NUM_GRADED_SUBM": "מספר הציונים שנבדקו",

	  // Used in the record email sent to the instructor after she emails grades.
	  // Labels the average score in points (vs percent), in the summary table
	  "FLB_STR_EMAIL_RECORD_AVERAGE_SCORE": "ציון ממוצע, בנקודות",

	  // Used in the record email sent to the instructor after she emails grades.
	  // Labels the points possible, in the summary table
	  "FLB_STR_EMAIL_RECORD_POINTS_POSSIBLE": "ניקוד אפשרי",

	  // Used in the record email sent to the instructor after she emails grades.
	  // Indicated if an answer key was provided to the students, in the summary table
	  "FLB_STR_EMAIL_RECORD_ANSWER_KEY_PROVIDED": "האם נשלחו תשובות נכונות?",

	  // Used in the record email sent to the instructor after she emails grades.
	  // Value in summary table if answer key was NOT sent to students by instructor
	  "FLB_STR_EMAIL_RECORD_ANSWER_KEY_NO": "לא",

	  // Used in the record email sent to the instructor after she emails grades.
	  // Value in summary table if answer key WAS sent to students by instructor
	  "FLB_STR_EMAIL_RECORD_ANSWER_KEY_YES": "כן",

	  // Used in the record email sent to the instructor after she emails grades.
	  // Message that preceeds what message the instructor email to her students.
	  "FLB_STR_EMAIL_RECORD_INSTRUCTOR_MESSAGE": "בנוסף שלחת את ההודעה הבאה",

	  // About Flubaroo message (1 of 2)
	  "FLB_STR_ABOUT_FLUBAROO_MSG1" : "פלובארו הוא כלי חינמי ופשוט לתפעול המאפשר למורים לדרג מטלות ביצוע המכילות שאלות בחירה-מרובה, ולנתח את התשובות שהתקבלו, בקלות ובמהירות",

	  // About Flubaroo message (2 of 2)
	  "FLB_STR_ABOUT_FLUBAROO_MSG2" : "כדי ללמוד עוד, בקרו באתר www.flubaroo.com או שלחו משוב והצעות לשיפור בכתובת dave@edcode.org.",

	  // Message that appears when "Student Submissions" sheet cannot be located.
	  "FLB_STR_CANNOT_FIND_SUBM_MSG" : ".פלובארו לא הצליח למצוא את גיליון הנתונים שבו הוזנו מטלות הביצוע של התלמידים. אנא אתר את גיליון זה, ושנה את שמו לשם: ",

	  // Message that appears when "Grades" sheet cannot be located.
	  "FLB_STR_CANNOT_FIND_GRADES_MSG" : "פלובארו לא הצליח למצוא את גיליון הנתונים שבו הוזנו מטלות הביצוע של התלמידים. אנא אתר את גיליון זה, ושנה את שמו לשם: ",

	  // Menu option to grade assignment.
	  "FLB_STR_MENU_GRADE_ASSIGNMENT" : "הערכת ציוני תלמידים",

	  // Menu option to re-grade assignment.
	  "FLB_STR_MENU_REGRADE_ASSIGNMENT" : "הערכה חוזרת",

	  // Menu option to email grades.
	  "FLB_STR_MENU_EMAIL_GRADES" : "שלח ציונים בדוא’’ל",

	  // Menu option to hide student feedback (hides the column)
	  "FLB_STR_MENU_HIDE_FEEDBACK" : "הסתר משוב אישי לתלמיד",

	  // Menu option to edit student feedback (unhides the column)
	  "FLB_STR_MENU_EDIT_FEEDBACK" : "ערוך משוב אישי לתלמיד",

	  // Menu option to hide help tips
	  "FLB_STR_MENU_HIDE_HELP_TIPS" : "הסתר הכוונה",

	  // Menu option to edit help tips
	  "FLB_STR_MENU_EDIT_HELP_TIPS" : "ערוך הכוונה",

	  // Menu option to view report.
	  "FLB_STR_MENU_VIEW_REPORT" : "צפה בדיווח",

	  // Menu option to learn About Flubaroo.
	  "FLB_STR_MENU_ABOUT" : "אודות פלובארו",

	  // Menu option to choose the language.
	  "FLB_STR_MENU_SET_LANGUAGE" : "קבע שפה",

	  // Word that appears on the "Continue" button in grading and emailing grades.
	  "FLB_STR_BUTTON_CONTINUE" : "המשך",

	  // Name of "Student Submissions" sheet
	  "FLB_STR_SHEETNAME_STUD_SUBM" : "תגובות התלמידים",

	  // Name of "Grades" sheet
	  "FLB_STR_SHEETNAME_GRADES" : "ציונים",

	  // Text put in Grades sheet when a question isnt graded.
	  "FLB_STR_NOT_GRADED" : "לא הוערכה",

	  // Message that is displayed when a new version of Flubaroo is installed.
	  "FLB_STR_NEW_VERSION_NOTICE" : "התקנת גרסה חדשה של פלובארו! כדי לראות מה השתנה, בקר באתר flubaroo.com/blog.",

	  // Headline for notifications / alerts.
	  "FLB_STR_NOTIFICATION" : "פלובארו - התראה",

	  // For emailing grades, question which asks user to identify email question.
	  "FLB_STR_EMAIL_GRADES_IDENTIFY_EMAIL" : "שאלה לקבלת דוא’’ל: ", // note the space after ":"

	  // For emailing grades, asks user if list of questions and scores should be sent.
	  "FLB_STR_EMAIL_GRADES_QUESTIONS_AND_SCORES" : "כלול רשימה של שאלות וניקוד לכל שאלה: ", // note the space after ":"

	  // For emailing grades, asks user if answer key should be sent...
	  "FLB_STR_EMAIL_GRADES_ANSWER_KEY" : "כלול מפתח תשובות: ", // note the space after ":"

	  // For emailing grades, appears before text box for optional instructor message.
	  "FLB_STR_EMAIL_GRADES_INSTRUCTOR_MESSAGE" : "הודעה שתיכלל בדוא’’ל (לא חובה): ",

	  // Window title for View Report window
	  "FLB_STR_VIEW_REPORT_WINDOW_TITLE" : "פלובארו - דיווח תוצאות",

	  // Title of historgram chart in report
	  "FLB_STR_VIEW_REPORT_HISTOGRAM_CHART_TITLE" : "גרף ציונים",

	  // Y-Axis (vertical) title of historgram chart in report
	  "FLB_STR_VIEW_REPORT_HISTOGRAM_Y-AXIS_TITLE" : "מטלות שהוגשו",

	  // X-Axis (horizontal) title of historgram chart in report
	  "FLB_STR_VIEW_REPORT_HISTOGRAM_X-AXIS_TITLE" : "ניקוד שנצבר",

	  // Label of "Email Me Report" button in View Report window
	  "FLB_STR_VIEW_REPORT_BUTTON_EMAIL_ME" : "שלח לי דיווח בדוא’’ל",

	  // Notification that tells who the report was emailed to (example: "The report has been emailed to: bob@hi.com")
	  "FLB_STR_VIEW_REPORT_EMAIL_NOTIFICATION" : "הדיווח נשלח בדואר לכתובת",
    },
    // END HEBREW//////////////////////////////////////////////////////////////////////////////////

} // end langs

////////////////////////////////////////////////////////////////////////////////////////////////////////////

