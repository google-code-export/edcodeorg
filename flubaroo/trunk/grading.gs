// File: grading.gas
// Description: 
// This file contains all the general purpose functions for grading the assignment.

// TODO_AJR - Add headers to each file.

// TODO_AJR - Percentage in submissions not coloured on just one submissions.

// TODO_AJR - Few functions at the bottom that could do with moving.

// TODO_AJR - Create and agree on FlubarooStyle guide.

// TODO_AJR - Does menuGradeStep1() need to be seperate?

// TODO_AJR - Notification msgBoxes are half empty.

// TODO_AJR - Unit tests (QUint).

// TODO_AJR - The online editor assumes standard indentation, could we use it to?

// TODO_AJR - Double grade sheets on regrade - only if skipping ui.

// TODO_AJR - Search for each Debug.info() function opener, to make sure first thing.

// TODO_AJR - With the clearing of "gathering options", it could be worth 
// checking/initialising all of the script properties.

// TODO_AJR - Emailing creates two gws objects, couldn't the earlier one be used for 
// emailing.

// TODO_AJR - Go a search for Debug.info() and check spacing.

// TODO_AJR - Incorporating autograde has made made managing the grading a bit 
// complicated. The main submission processing loop could be moved higher up 
// so they are always processed one at a time.

// TODO_AJR - There is alot of dead code that could be removed.

// The comment below changes the permissions that Flubaroo must ask for when
// installed, limiting it from accessing all their spreadsheets to just the
// spreadsheets where this Add-on is installed (which is more accurate).
/**
 * @OnlyCurrentDoc
 */

function preGradeChecks()
{
  // Rename "Sheet1" (or equivalent) to something more friendly.
  var status = renameSubmissionsSheet();
  
  // Check submission sheet
  // ----------------------
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = getSheetWithSubmissions(ss);
  
  if (!sheet)
    {   
      Browser.msgBox(langstr("FLB_STR_NOTIFICATION"), 
                     langstr("FLB_STR_CANNOT_FIND_SUBM_MSG") + 
                       langstr("FLB_STR_SHEETNAME_STUD_SUBM"),
                     Browser.Buttons.OK);
      
      Debug.warning("preGradeChecks - cannot find submission sheet");
      return false;
    }

  var enough_subm = enoughSubmToGrade(sheet);
  
  if (!enough_subm)
    {
      Browser.msgBox(langstr("FLB_STR_NOTIFICATION"), 
                     langstr("FBL_STR_GRADE_NOT_ENOUGH_SUBMISSIONS"),
                     Browser.Buttons.OK);
      
      Debug.warning("preGradeChecks - not enough submissions");
      
      return false;
    }
  
  return true;
}

function gradeStep1()
{ 
  Debug.info("gradeStep1()");
 
  var wait_app;
  var ss;
  var sheet;
  var num_rows;
  var help_tips_row;
  var result;
  var app;
  
  // Initialize grading
  // ------------------
  
  // Before doing anything related to grading, take care of some 
  // housekeeping that can't be done in onInstall (unfortuntately)
  // because it involves setting properties, which isn't allowed there.
  
  // Used for anonymous analytics.
  setFlubarooUid(); 
  
  if (!preGradeChecks())
    {
      return;
    }
  
  
  // Check submission sheet
  // ----------------------
  
  ss = SpreadsheetApp.getActiveSpreadsheet();
  sheet = getSheetWithSubmissions(ss);
  
  // In case the menu is being accessed from a different sheet, make the sheet
  // with the submissions the active one.
  ss.setActiveSheet(sheet);
  
  // If there are already grades, make sure the instructor knows that
  // re-grading will overwrite them, unless the UI is off.
  if (gotSheetWithGrades(ss) && UI.isOn())
    {
      result = UI.msgBox(langstr("FLB_STR_NOTIFICATION"),
                         langstr("FLB_STR_REPLACE_GRADES_PROMPT"),
                         Browser.Buttons.YES_NO);
      
      if (result !== "yes")
        {
          Debug.info("gradeStep1() - instructor choose not to " + 
                     "overwrite grades sheet");        
          return;
        }
      else
        {
          Debug.info("gradeStep1() - instructor choose to " + 
                     "overwrite grades sheet");
        }
    }
  
  // Start the grading
  // -----------------
  if (UI.isOff())
    {
      if (gotGradingInfo())
        {
          Debug.info("gradeStep1() - skipping UI, going straight " + 
                      "to step2EventHandler()");
                      
          app = step2EventHandler(null);
        }
      else
        {
          Debug.error("gradeStep1() - missing grading info, unable to skip UI");
        }
    }
  else
    {
      // Create and display the Step 1 UI window.
      app = UI.step1Grading(sheet);
      ss.show(app);
    }
    
  return app;
  
} // gradeStep1()

 function formHistogramURL(histogram_buckets)
 {
   var max_val = 0;
   for (var i = 0; i < histogram_buckets.length; i++)
     {
       if (histogram_buckets[i] > max_val)
         {
           max_val = histogram_buckets[i];
         }
     }
   
   var url = "http://chart.apis.google.com/chart?chxt=x,y,x,y&chbh=a,0,0&chs=650x280";
   url += "&cht=bvg&chco=6699ff&chtt=Histogram%20of%20Grades";
   
   url += "&chds=0," + max_val + "&chxr=1,0," + max_val + ",1";
   url += "&chxl=0:";
 
   var points_possible = histogram_buckets.length - 1;
   for (var i=0; i <= points_possible; i++)
     {
       url += "%7C" + String(i);
     }
 
   //url+= "|2:|Points%20Scored|3:|Submissions&chxp=2,50|3,50";
   url+= "%7C2:%7CPoints%20Scored%7C3:%7CSubmissions&chxp=2,50%7C3,50";
 
 
   url += "&chd=t:";
   
   for (var i=0; i <= points_possible; i++)
     {
       url += histogram_buckets[i];
       if (i < (points_possible))
         {
           url += ",";
         }
      
     }
   
   return url;
   
 }
   
 // createQuestionSummary
 // Returns the text of the question from the header row for the question. 
 //  If too long, truncates the question text and adds "...".
 function createQuestionSummary(question)
 {
   if (question.length > 40)
     {
       // truncate the question and add "..." to the end.
       question = question.substring(0,40) + " ...";
     }
 
   return question;
 }
 
 // quesShouldBeSkipped:
 // Takes the full text of a question (should be lowercased first),
 // and returns if this question should not be graded (e.g. "Today's Date:")  
 function quesShouldBeSkipped(ques)
 {  
   if (ques.indexOf('date') != -1)
     {
       return true;
     }
 
   return false;
 }  
                     
 // quesIdentifiesStudent:
 // Takes the full text of a question (should be lowercased first),
 // and examines the content to guess if this question is a means of
 // identifying a student (e.g. "First Name")                 
 function quesIdentifiesStudent(ques)  
 {      
   if (ques.indexOf('first') != -1)
     {
       return true;
     }
   else if (ques.indexOf('last') != -1)
     {
       return true;
     }
   else if (ques.indexOf('name') != -1)
     {
       return true;
     }
 
   else if (ques == 'id')
     {
       return true;
     }
 
   var id_index = ques.indexOf('id');
   if (id_index != -1)
     {
       if (id_index > 0)
         {
           if (ques[id_index-1] == ' ')
             {
               // e.g. "student id"
               return true;
             }
         }
     }                 
   else if (ques.indexOf('id:') != -1)
     {
       // e.g. student id:
       return true;
     }
   else if (ques.indexOf('identity') != -1)
     {
       return true;
     }
   else if (ques.indexOf('identifier') != -1)
     {
       return true;
     }
   else if (ques.indexOf('class') != -1)
     {
       return true;
     }
   else if (ques.indexOf('section') != -1)
     {
       return true;
     }
   else if (ques.indexOf('period') != -1)
     {
       return true;
     }
   else if (ques.indexOf('room') != -1)
     {
       return true;
     }
   else if (ques.indexOf('student') != -1)
     {
       return true;
     }
   else if (ques.indexOf('teacher') != -1)
     {
       return true;
     }
   else if (ques.indexOf('email') != -1)
     {
       return true;
     }
   else if (ques.indexOf('e-mail') != -1)
     {
       return true;
     }
   
   // spanish
   else if (ques.indexOf('correo') != -1)
     {
       return true;
     }
   
   return false;
 }

// isWorthPoints:
// Given a grading option, returns true if the grading option indicates
// that this question is worth points, and so can be graded. Returns
// false otherwise.
function isWorthPoints(grade_opt)
{
  if (grade_opt == GRADING_OPT_1_PT)
    {
      return true;
    }
  else if (grade_opt == GRADING_OPT_2_PT)
    {
      return true;
    }
  else if (grade_opt == GRADING_OPT_3_PT)
    {
      return true;
    }
  else if (grade_opt == GRADING_OPT_4_PT)
    {
      return true;
    }
  else if (grade_opt == GRADING_OPT_5_PT)
    {
      return true;
    }
  else
    {
      return false;
    }
}

// getPointsWorth:
// Given a grading option that indicates a number of points (e.g. GRADING_OPT_2_PT)
// returns a corresponding integer for the number of points it's worth
// (2, in this example).
function getPointsWorth(grade_opt)
{
  if (grade_opt == GRADING_OPT_1_PT)
    {
      return 1;
    }
  else if (grade_opt == GRADING_OPT_2_PT)
    {
      return 2;
    }
  else if (grade_opt == GRADING_OPT_3_PT)
    {
      return 3;
    }
  else if (grade_opt == GRADING_OPT_4_PT)
    {
      return 4;
    }
  else if (grade_opt == GRADING_OPT_5_PT)
    {
      return 5;
    }
  else
    {
      return 0; // invalid grading option
    } 
}

// isGradeableQuestion
// Given a grading option, returns true if this question is gradeable 
// (e.g. is worth point, or "Skip Grading" was chosen).
// These are the questions that will be written out in the columns 
// (of the Grades sheet) after all the student identifiers, and
// extra columns like points scores, times submitted, etc.
function isGradeableQuestion(grade_opt)
{
  return (grade_opt === GRADING_OPT_STUD_ID);
}

// isStudentIdentifier:
// Returns true if grading option for this question is one that identifies a student
function isStudentIdentifier(grade_opt)
{
  return (grade_opt === GRADING_OPT_STUD_ID);
}

function gotGradingInfo()
{
  var dp = PropertiesService.getDocumentProperties();
    
  // These script properties need to be set up before the 
  // grading process can begin.

  Debug.info("gotGradingInfo() - ui grading opt: " +
             dp.getProperty(DOC_PROP_UI_GRADING_OPT));
  
  Debug.info("gotGradingInfo() - ans key row num: " +
             dp.getProperty(DOC_PROP_ANSWER_KEY_ROW_NUM));
  
  if (dp.getProperty(DOC_PROP_UI_GRADING_OPT) &&
      dp.getProperty(DOC_PROP_ANSWER_KEY_ROW_NUM))
    {
      return true;
    }
    
  return false;
  
} // gotGradingInfo()
      
function gotGradingAndEmailInfo()
{
  var dp = PropertiesService.getDocumentProperties();
  
  // These script properties need to be set up before the 
  // grading process can begin.

  Debug.info("gotGradingAndEmailInfo() - email address question: " +
             dp.getProperty(DOC_PROP_EMAIL_ADDRESS_QUESTION));

  if (gotGradingInfo() &&
      dp.getProperty(DOC_PROP_EMAIL_ADDRESS_QUESTION))
    {
      return true;
    }
    
  return false;
  
} // gotGradingAndEmailInfo()


function enoughSubmToGrade(subm_sheet)
{
  var dp = PropertiesService.getDocumentProperties();
  
  // Make sure there are enough rows in this sheet to do grading. 
  var num_rows = subm_sheet.getLastRow();
  var help_tips_row = getTipsRow(subm_sheet);
  
  var enough_subm = true;
  
  // we must ensure there is an answer key row, which is not
  // to be confused with an optional Help Tips row.
  if ((num_rows == 0) || (num_rows == 1) || ((num_rows == 2) && (help_tips_row != null)))
    {
      // either only one row (header only), or ...
      // only 2 rows, and one of them is help tips (other is header).
      //    either way ==> no answer key!
      enough_subm = false;
    }

  var last_row_count = dp.getProperty(DOC_PROP_LAST_GRADED_ROW_COUNT);
  if (last_row_count == null)
    {
      last_row_count = 0;
    }
  
  // at this point we're guaranteed there is answer key row, which is sufficient for
  // autograde, but not for manual grading. 
  
  // DAA_TODO: post launch of v18. logic below works for most case, but is confusing. I should clean it up. 
  // correct logic: If this is a manual grading of either type (menu based, or prompted during ag setup), then
  //                check for 3-4 rows.
  // existing logic: If this is a manual grading from the menu, or if ag is on and we've never graded before. 
  //                 The latter says that if we have graded before, then we must have enough rows already. But if not,
  //                 then we don't know, so check.
  // * Perhaps pass into this function a "start_condition" which is either: manual grade, ag_setup, or ag_triggered.
  
  if (!Autograde.isGatheringOptions()
         || (Autograde.isOn() && (last_row_count == 0)))
    {
      var min_rows_needed = 3; // for manual grading: header, ans key, & one submission.

      // manual grading
      if (help_tips_row != null)
        {
          // account for the help tips row, if there.
          min_rows_needed += 1;
        }
  
      if (num_rows < min_rows_needed)
        {
          enough_subm = false;  
        }
    }
  
  return enough_subm;
}