// ui.gas
// ------
//
// This file contains all of the functions that display a UI.
//

// UIClass
// =======
UI = new UIClass();

function UIClass()
{
  // Private members
  // ===============

  // Privileged Members
  // ==================

  // isOn()
  // ------
  
  this.isOn = function()
  {
    var dp = PropertiesService.getDocumentProperties();
    var on = (dp.getProperty(DOC_PROP_UI_OFF) === null);
    Debug.info("UIClass.isOn(): " + on);
    return on;

  } // UIClass.isOn()

  // isOff()
  // ------

  this.isOff = function()
  {
    var dp = PropertiesService.getDocumentProperties();
    var off = (dp.getProperty(DOC_PROP_UI_OFF) === "true"); 
    Debug.info("UIClass.isOff(): " + off);  
    return off;

  } // UIClass.isOff()

  // on()
  // ----

  this.on = function()
  {
    Debug.info("UIClass.on()");

    // Autograde manages the relationship between autograde and the UI.
    Autograde.uiOn();

  } // UIClass.on()

  // off()
  // -----

  this.off = function()
  {
    Debug.info("UIClass.off()");

    // Autograde manages the relationship between autograde and the UI.
    Autograde.uiOff();
    
  } // UIClass.off()

  // msgBox()
  // --------

  this.msgBox = function(title, prompt, buttons) 
  {
    // Some msg boxes only continue if yes is selected, so default
    // to that for silent operation.
    var result = "yes";
    
    if (this.isOn())
      {
        result = Browser.msgBox(title, prompt, buttons); 
      }
    
    return result;
    
  } // UIClass.msgBox()

  // pleaseWait()
  // ------------
  //
  // Create a simple UI asking the user to wait while their
  // assignment is being graded. This UI will be replaced once grading
  // completes.
  
  this.pleaseWait = function(sheet, title, msg)
  {
    Debug.info("UIClass.pleaseWait()");
  
    var app = UiApp.createApplication()
                   .setTitle(title)
                   .setWidth("500").setHeight("200");
    
    // Create the main panel to hold all content in the UI for this step.
    
    var main_panel = app.createVerticalPanel()
                        .setStyleAttribute('border-spacing', '10px');
    app.add(main_panel);
    
    var hpanel_main = app.createHorizontalPanel()
                         .setStyleAttribute('border-spacing', '10px');
    
    var vpanel1 = app.createVerticalPanel()
                     .setStyleAttribute('border-spacing', '10px');
    
    // Add a top level hpanel for instructions and picture.
    
    var vpanel1 = app.createVerticalPanel()
                     .setStyleAttribute('border-spacing', '10px')
                     .add(app.createImage(FLUBAROO_WELCOME_IMG_URL));
    
    var vpanel2 = app.createVerticalPanel()
                     .setStyleAttribute('border-spacing', '10px');
    
    var hpanel_r_top = app.createHorizontalPanel()
                          .setStyleAttribute('border-spacing', '10px')
                          .add(app.createLabel(msg));
    
    var hpanel_r_bot = app.createHorizontalPanel()
                          .setStyleAttribute('border-spacing', '10px')
                          .add(app.createImage(FLUBAROO_WORKING_IMG_URL));
    
    vpanel2.add(hpanel_r_top);
    vpanel2.add(hpanel_r_bot); 
    
    hpanel_main.add(vpanel1);
    hpanel_main.add(vpanel2);
    
    main_panel.add(hpanel_main);
    
    return app;
    
  } // UIClass.pleaseWait()

  // step1Grading()
  // --------------
  //
  // Step 1 of the UI used to set up submission grading 
  
  this.step1Grading = function(sheet)
  {
    Debug.info("UIClass.step1Grading()");
  
    // Show a UI that presents each question. Must be done in a veritically
    // scrollable window so that all questions can be listed.
    var app = UiApp.createApplication()
                   .setTitle(langstr("FLB_STR_GRADE_STEP1_WINDOW_TITLE"))
                   .setWidth("500")
                   .setHeight("465");
    
    var num_questions = getNumQuestionsFromSubmissions(sheet);
    var question_vals = singleRowToArray(sheet, 1, num_questions);
    
    // Setup the grid, which contains all UI elements.
    var grid = app.createGrid(num_questions,3).setCellSpacing(5);
    
    grid.setWidget(0, 0, app.createLabel(langstr("FLB_STR_GRADE_STEP1_LABEL_GRADING_OPTION")));
    grid.setWidget(0, 1, app.createLabel('        '));
    grid.setWidget(0, 2, app.createLabel(langstr("FLB_STR_GRADE_STEP1_LABEL_QUESTION")));
    
    // Declare the handler that will be called when the 'Cancel' button is
    // clicked. Not that the 'Continue' button is taken care of by doPost.
    var handler = app.createServerClickHandler('step1EventHandler');
    
    // TODO_AJR - Delete when sure, doesn't seem to be used.
    
    var click_handler = app.createServerClickHandler('continueButtonClickHandler');
    
    // Loop through all questions asked in the assigment. For each, present some   
    // options the instructor can set. Also try to guess the best option based
    // on the content of the question
    //     (e.g. Q: "Today's Date" -> Option: "Skip Grading").
    var i = 1;
    var question = "";
    var lbox_name = "";
    
    for (i = 2; i <= num_questions; i++)
    {
      // Setup a list box. Give the ID a name like 'Q8' (for question 8).
      // Note that the question number really refers to the column number,
      // starting from 1, where we skip Q1 (Google timestamp).
      lbox_name = "Q" + String(i);
      var lbox = app.createListBox(false).setId(lbox_name).setName(lbox_name);
      lbox.addItem(langstr("FLB_STR_GRADING_OPT_1_PT"), GRADING_OPT_1_PT); // default selection
      lbox.addItem(langstr("FLB_STR_GRADING_OPT_2_PT"), GRADING_OPT_2_PT);
      lbox.addItem(langstr("FLB_STR_GRADING_OPT_3_PT"), GRADING_OPT_3_PT);
      lbox.addItem(langstr("FLB_STR_GRADING_OPT_4_PT"), GRADING_OPT_4_PT);
      lbox.addItem(langstr("FLB_STR_GRADING_OPT_5_PT"), GRADING_OPT_5_PT);
      lbox.addItem(langstr("FLB_STR_GRADING_OPT_STUD_ID"), GRADING_OPT_STUD_ID);
      lbox.addItem(langstr("FLB_STR_GRADING_OPT_SKIP_GRADING"), GRADING_OPT_SKIP);
      
      // Place the list box into the grid.
      grid.setWidget(i-1, 0, lbox);
      
      // To ensure we can do something with the selected value when 'Continue'
      // is clicked, the list box must be registered with the callback handler.
      handler.addCallbackElement(lbox);
      
      // Display a summary of the question, so the instructor can identify it.
      question = question_vals[i-1];
      grid.setWidget(i-1, 2, app.createLabel(createQuestionSummary(question)));
      
      // Try to detect the type of question (identifies student / skip / 1 pt).
      // We'll assume that longer questions must be gradable (academic) ones.
      // note: we don't push the length check into the functions below for speed
      // (so that we don't lowercase every question, whe most are gradable anyway.)
      if (question.length < 35)
      {
        question = question.toLowerCase();
        
        if (quesIdentifiesStudent(question))
        {
          lbox.setSelectedIndex(5);
        }
        else if (quesShouldBeSkipped(question))
        {
          lbox.setSelectedIndex(6);
        }
      } 
      
    } // for each question.
    
    // Create the main panel to hold all content in the UI for this step.
    var main_panel = app.createVerticalPanel()
                        .setStyleAttribute('border-spacing', '10px');
    
    var hidden_vars = app.createVerticalPanel().setVisible(false);
    
    var form = app.createFormPanel().setId('form').setEncoding('multipart/form-data');
    form.add(main_panel);
    app.add(form);
    
    // TODO_AJR - Delete?
    
    // Hidden values must be inside of the form to be passed on.
    //hidden_vars.add(ques1_opt);
    
    // Add a top level hpanel for instructions and picture
    var hpanel = app.createHorizontalPanel()
                    .setStyleAttribute('border-spacing', '10px')
                    .add(app.createImage(FLUBAROO_WELCOME_IMG_URL))
                    .add(app.createLabel(langstr("FBL_STR_STEP1_INSTR"))
                    .setStyleAttribute('margin-top', '20px'));
    
    main_panel.add(hpanel);
    
    // Create a panel to hold all the questions. add it to the main panel.
    var qpanel = app.createSimplePanel()
                    .setStyleAttribute('border-width', '1px')
                    .setStyleAttribute('border-style', 'solid')
                    .setSize('100%', '250').setId('QUESTIONS');
    
    main_panel.add(qpanel)
    
    // Create a scrollable panel to hold the questions panel.
    var spanel = app.createScrollPanel().setHeight("100%").setWidth("100%");
    spanel.add(grid);
    qpanel.setWidget(spanel);
    
    // Add the Continue and Cancel buttons at the bottom.
    var btnGrid = app.createGrid(1, 2).setStyleAttribute('float', 'right');
    
    var btnSubmit = app.createButton(langstr("FLB_STR_BUTTON_CONTINUE"), handler)
                       .setId('CONTINUE')
                       .addClickHandler(click_handler);
    
    btnGrid.setWidget(0,1,btnSubmit);
    
    // TODO_AJR - Delete.
    //btnGrid.setWidget(0,2,app.createButton('Cancel',handler).setId('CANCEL'));
    
    btnGrid.setWidget(0,0,app.createImage(FLUBAROO_WORKING_IMG_URL)
           .setVisible(false)
           .setId('working'));
    
    main_panel.add(btnGrid);
    main_panel.add(hidden_vars);
    
    Debug.info("UIClass.step1Grading() - step1 UI created");
    
    return app;

  } // UIClass.step1Grading()
  
  // step2Grading()
  // --------------
  //
  // Step 2 of the UI used to set up submission grading.
  
  // TODO_AJR - bit long, break up. And the indentation needs updating.
  
  this.step2Grading = function(e_step1, sheet)
  {
    var dp = PropertiesService.getDocumentProperties();
    var num_rows = sheet.getLastRow();
    var num_subm = num_rows - 1;
    var num_questions = getNumQuestionsFromSubmissions(sheet);
    
    var ques_col; // spreadsheet column number, which starts from 1.
    var question = '';
    var student_id_cols = new Array();
    var question_vals = singleRowToArray(sheet, 1, num_questions);
    
    Debug.info("UIClass.step2Grading()");
    
    // Go through each question from the previous step and identify those 
    // that are student identifiers. Put these into their own array.
    for (ques_col = 2; ques_col <= num_questions; ques_col = ques_col + 1)
    { 
      q_id = "Q" + String(ques_col); // e.g. "Q3"
      
      // Create list of the questions (columns) which identify a student.
      if (e_step1.parameter[q_id] == GRADING_OPT_STUD_ID)
      {
        // Record this column number.
        student_id_cols.push(ques_col);
      }
    }
    
    // Try to accomomdate large numbers of student identifiers, which if present
    // can screw up the UI and cause the "Continue" button to be pushed out of view.
    // Add in implicit timestamp too.
    var ui_width = "800";
    
    if (student_id_cols.length + 1 > 4)
    {
      ui_width = "950";
    }
    
    var app = UiApp.createApplication()
                   .setTitle(langstr("FLB_STR_GRADE_STEP2_WINDOW_TITLE"))
                   .setWidth(ui_width)
                   .setHeight("460");
    
    // Declare a click handler that will be called when a radio button is selected
    // (clicked). This handler will enable the "Continue" button, to ensure that
    // the user selects something.
    var radio_click_handler = app.createServerClickHandler('step2RadioClickHandler');
    var button_click_handler = app.createServerClickHandler('continueButtonClickHandler');
    
    // Add the hidden option for question 1 (the timestamp).
    e_step1.parameter["Q1"] = GRADING_OPT_SKIP;
    var grading_options = gatherGradingOptions(e_step1, num_questions);
    dp.setProperty(DOC_PROP_UI_GRADING_OPT, grading_options.toString());
    
    // Create the main panel to hold all content in the UI for this step,
    var main_panel = app.createVerticalPanel()
    .setStyleAttribute('border-spacing', '10px');
    
    var hidden_vars = app.createVerticalPanel().setVisible(false);   
    
    var form = app.createFormPanel().setId('form').setEncoding('multipart/form-data');
    form.add(main_panel);   
    app.add(form);
    
    // Setup the grid with the list of submissions to pick the Answer Key from.
    // Each submission will have a radio button next to it, such that one
    // (and only one) submission can be selected as the Answer Key.
    var grid = app.createGrid(num_subm+1, student_id_cols.length + 2)
                  .setCellSpacing(15);
    
    // Start with the header row (grid row 0). This row contains a summary of
    // the questions which ID a student (e.g. "First Name", "Student ID", ....)
    grid.setWidget(0, 0, app.createLabel(langstr("FLB_STR_GRADE_STEP2_LABEL_SELECT")));
    grid.setWidget(0, 1, app.createLabel(langstr("FLB_STR_GRADE_STEP2_LABEL_SUBMISSION_TIME")));
    
    // Users have had issues with too many Student Identifiers (or rather long ones)
    // screwing up the UI, causing the Continue button to get pushed out of view.
    // To avoid, truncate all fields in this UI to a limited # of characters.
    var trunc_len = 18;
    
    for (var index = 0; index < student_id_cols.length; index++)
    {
      question = question_vals[student_id_cols[index]-1];
      var ques_trunc = question;
      if (ques_trunc.length > trunc_len)
      {
        ques_trunc = ques_trunc.substring(0,trunc_len) + "...";
      }
      
      grid.setWidget(0, 
                     index + 2,
                     app.createLabel(createQuestionSummary(ques_trunc)));
    }
    
    // Next go through each submission, and write out just the values for
    // those questions that identify a student, plus the Google timestamp.
    // To do this, we must first get each column which is associated with a
    // student identifier. We'll create an array of Ranges called
    // 'answer_key_cols'for this, where each Range is a single column.
    var answer_key_cols = new Array();
    var timestamp_column = sheet.getRange(2, 1, num_rows-1, 1);
    answer_key_cols.push(timestamp_column);
    
    // get the column associated with each student identifying question.
    var index = 0;
    for (index = 0; index < student_id_cols.length; index++)
    {
      // get 1 column containing all submissions (except spreadsheet header
      // row) for this question which identifies a student.
      var single_column = sheet.getRange(2,student_id_cols[index],
                                         num_subm, 1);
      answer_key_cols.push(single_column);
    }
    
    // With all the student identifying columns gathered (vertical step), now
    // print out their values for each submission (horizontal step).
    // Here subm_row identifies the spreadsheet row of the submission, skipping
    // the header row (so '1' is the first actual submission).
    var subm_row = 1;
    var text = "";
    var radio_value = "";
    
    // Check if a row of help tips was provided. if so, don't show it in the UI,
    // as it can't be used as an answer key.
    var help_tip_timestamp = timestamp_column.getCell(1,1).getValue();
    
    if (help_tip_timestamp == "")
    {
      // There is a help tip here (row after the header that has an empty timestamp).
      // skip it.
      subm_row = 2;
    }
    
    var grid_row = 1;
    
    for (; subm_row <= num_subm; subm_row = subm_row + 1)
    {
      // Add radio button for this submission. we'll record the actual
      // spreadsheet row containing the answer key (so starting from '2').
      radio_value = String(subm_row+1);
      var radio_button = app.createRadioButton("answer_key_select")
      .setFormValue(radio_value);
      //.setName("answer_key_select")
      //.setId("answer_key_select")
      grid.setWidget(grid_row, 0, radio_button);
      radio_button.addClickHandler(radio_click_handler);
      //handler.addCallbackElement(radio_button);
      
      // Add timestamp for this submission. format it a bit too, to take up less
      // space.
      var subm_date = String(answer_key_cols[0].getCell(subm_row, 1).getValue());
      subm_date = subm_date.split(" GMT")[0];
      grid.setWidget(grid_row, 1, // after radio button
                     app.createLabel(subm_date));
      
      // Add to the grid responses to student identifying questions.
      var ques_index;
      var subm_text;
      for (ques_index = 1; ques_index <= student_id_cols.length; ques_index++)
      {
        subm_text = String(answer_key_cols[ques_index].getCell(subm_row, 1).getValue());
        if (subm_text.length > trunc_len)
        {
          // Truncate the response and add "..." to the end.
          subm_text = subm_text.substring(0,trunc_len) + "...";
        }
        
        grid.setWidget(grid_row, ques_index+1,
                       app.createLabel(subm_text));
      }
      
      grid_row++;
      
    } // for each submission.
    
    // Add a top level hpanel for instructions and picture
    var hpanel = app.createHorizontalPanel()
    .setStyleAttribute('border-spacing', '10px')
    .add(app.createImage(FLUBAROO_WELCOME_IMG_URL))
    .add(app.createLabel(langstr("FBL_STR_STEP2_INSTR"))
         .setStyleAttribute('margin-top', '20px'));
    
    main_panel.add(hpanel);
    
    // Create a panel to hold all the submissions. add it to the main panel.
    var subm_panel = app.createSimplePanel()
    .setStyleAttribute('border-width', '1px')
    .setStyleAttribute('border-style', 'solid')
    .setSize('100%', '250').setId('SUBMISSIONS');
    main_panel.add(subm_panel)
    
    // Create a scrollable panel to hold the submissions panel.
    var spanel = app.createScrollPanel().setHeight("100%").setWidth("100%");
    spanel.add(grid);
    subm_panel.setWidget(spanel);
    
    // Set the proper handler for doPost
    var h = app.createHidden("handler", "step2").setId("handler").setName("handler");
    hidden_vars.add(h);
    
    // Add the buttons at the bottom.
    var btnGrid = app.createGrid(1, 3).setStyleAttribute('float', 'right');
    var btnSubmit = app.createSubmitButton(langstr("FLB_STR_BUTTON_CONTINUE"))
    .setId('CONTINUE').setEnabled(false)
    .addClickHandler(button_click_handler);
    
    btnGrid.setWidget(0,0,app.createImage(FLUBAROO_WORKING_IMG_URL).setVisible(false).setId('working'));
    btnGrid.setWidget(0,1,btnSubmit);
    //btnGrid.setWidget(0,2,app.createButton('Cancel',handler).setId('CANCEL'));
    
    main_panel.add(btnGrid);
    main_panel.add(hidden_vars);
    
    Debug.info("UIClass.step2Grading() - step2 UI created");
    
    return app;
    
    // Given the form submissions from Step 2,
    // go through each question and extracts the grading option for it.
    // Returns an array of these where the first question (actually the
    // Google timestamp) will be at index 0.
    function gatherGradingOptions(e, num_questions)
    {
      var grading_options = [];
      var ques_col;
      var q_id;
      
      for (ques_col = 1; ques_col <= num_questions; ques_col++)
        {
          // e.g. "Q3"
          q_id = "Q" + String(ques_col); 
          grading_options.push(e.parameter[q_id]);        
        }
      
      return grading_options;
      
    } // gatherGradingOptions()
        
  } // UIClass.step2Grading()
  
  // gradingResults()
  // ----------------
  
  this.gradingResults = function()
  {
    Debug.info("UIClass.gradingResults()");
  
    var app = UiApp.createApplication()
                   .setTitle(langstr("FLB_STR_GRADING_COMPLETE_TITLE"))
                   .setWidth("500").setHeight("300");
    
    var handler = app.createServerClickHandler('gradingResultsEventHandler');
    
    // create the main panel to hold all content in the UI for this step,
    var main_panel = app.createVerticalPanel()
                        .setStyleAttribute('border-spacing', '10px');
    
    var form = app.createFormPanel()
                  .setId('form')
                  .setEncoding('multipart/form-data');
                  
    form.add(main_panel);   
    
    app.add(form);
    
    // add a top level hpanel for instructions and picture
    var hpanel = app.createHorizontalPanel()
                    .setStyleAttribute('border-spacing', '10px')
                    .add(app.createImage(FLUBAROO_WELCOME_IMG_URL))
                    .add(app.createLabel(langstr("FLB_STR_RESULTS_MSG1"))
                    .setStyleAttribute('margin-top', '10px'));
                    
    var hpanel2 = app.createHorizontalPanel()
                     .add(app.createLabel(langstr("FLB_STR_RESULTS_MSG2"))
                     .setStyleAttribute('margin-left', '10px'));
    
    main_panel.add(hpanel);
    main_panel.add(hpanel2);
    
    // add the button at the bottom.
    var btnGrid = app.createGrid(1, 1).setStyleAttribute('float', 'right');
    var btnSubmit = app.createButton(langstr("FLB_STR_GRADE_BUTTON_VIEW_GRADES"), handler)
                       .setId('VIEW GRADES');
    
    btnGrid.setWidget(0,0,btnSubmit);
    
    main_panel.add(btnGrid);
    
    // Refresh the menu to make sure that the 'Email Grades' option is shown.
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    createFlubarooMenu();
    
    return app;
    
  } // UIClass.gradingResults()
  
  // emailGrades()
  // -------------
  //
  // Display the UI used for emailing the grades.
  
  this.emailGrades = function(sheet)
  {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var dp = PropertiesService.getDocumentProperties();
    Debug.info("UIClass.emailGrades");
  
    var app = UiApp.createApplication().setTitle(langstr("FLB_STR_EMAIL_GRADES_WINDOW_TITLE"))
                                       .setWidth("400")
                                       .setHeight("520");

    var gws;
    
    // Declare the handler that will be called when the 'Continue' or 'Cancel'
    // buttons are clicked.
    var handler = app.createServerClickHandler('emailGradesHandler');
    var click_handler = app.createServerClickHandler('continueButtonClickHandler');
    var show_questions_value_change_handler = app.createServerChangeHandler('showQuestionsValueChangeHandler');
    
    var email_addr = Session.getEffectiveUser().getEmail();
    var email_addr_field = app.createHidden("email_addr", email_addr)
                              .setId("email_addr")
                              .setName("email_addr");
    
    var hidden_vars = app.createVerticalPanel().setVisible(false);
    hidden_vars.add(email_addr_field);
    handler.addCallbackElement(email_addr_field);
    
    // Create the main panel to hold all content in the UI for this step.
    var main_panel = app.createVerticalPanel()
                        .setStyleAttribute('border-spacing', '10px');
    
    // Add a top level hpanel for instructions and picture.
    var hpanel = app.createHorizontalPanel()
                    .setStyleAttribute('border-spacing', '10px')
                    .add(app.createImage(FLUBAROO_WELCOME_IMG_URL))
                    .add(app.createLabel(langstr("FLB_STR_EMAIL_GRADES_INSTR"))
                    .setStyleAttribute('margin-top', '5px'));
    
    main_panel.add(hpanel);
    
    // Create a pull-down box containing all the questions which identify a
    // student. 
    var lbox_name = "email_ques_index";
    var lbox = app.createListBox(false).setId(lbox_name).setName(lbox_name);
    var position = -1;
    
    var sheet = getSheetWithSubmissions(ss);

    // Grab the list of questions, so the user can select which contains
    // the email. Note: we don't use a GradesWorksheet object as this
    // function could be getting invoked from AutoGrade setup, where
    // no submissions or grades yet exist.
    var questions_full_text = getQuestionValsFromSubmissions(sheet);

    // grading options guaranteed to be set at this point.    
    var grade_opt_str = dp.getProperty(DOC_PROP_UI_GRADING_OPT);
    var grading_options = grade_opt_str.split(",");
    
    for (var q_index = 0; q_index < questions_full_text.length; q_index++)
      {
        var ques_val = questions_full_text[q_index];
        //q = gs.getFirstQuestion(); q != null; q = gs.getNextQuestion(q))
       // var gopt = q.getGradingOption();
        //var ques_val = q.getFullQuestionText();
        var gopt = grading_options[q_index];
        
        if (gopt === GRADING_OPT_STUD_ID)
          {
            var ques_val_orig = ques_val;

            if (ques_val.length > 40)
              {
                ques_val = ques_val.substring(0, 35) + "..."; 
              } 
          
            lbox.addItem(ques_val, ques_val_orig);
            position++;
                    
            if (quesContainsEmail(ques_val_orig))
              {       
                lbox.setSelectedIndex(position); 
              }
          }
      }
    
    var hpanel2 = app.createHorizontalPanel()
                     .setStyleAttribute('border-spacing', '6px')
                     .add(app.createLabel(langstr("FLB_STR_EMAIL_GRADES_IDENTIFY_EMAIL")))
                     .add(lbox);

    main_panel.add(hpanel2);
    
    var cbox_name = "show_questions";
    var cbox = app.createCheckBox()
                  .setId(cbox_name)
                  .setName(cbox_name)
                  .setValue(true)
                  .addValueChangeHandler(show_questions_value_change_handler);
                  
    var hpanel3 = app.createHorizontalPanel()
                     .setStyleAttribute('border-spacing', '6px')
                     .add(app.createLabel(langstr("FLB_STR_EMAIL_GRADES_QUESTIONS_AND_SCORES")))
                     .add(cbox);
                     
    main_panel.add(hpanel3);
    
    // Depends on above being checked.
    var cbox2_name = "show_answers";
    var cbox2 = app.createCheckBox().setId(cbox2_name).setName(cbox2_name);
    var hpanel4 = app.createHorizontalPanel()
                     .setStyleAttribute('border-spacing', '6px')
                     .add(app.createLabel(langstr("FLB_STR_EMAIL_GRADES_ANSWER_KEY")))
                     .add(cbox2);
                     
    main_panel.add(hpanel4);
    
    var textbox_name = "instructor_message";
    var tbox = app.createTextArea()
                  .setId(textbox_name)
                  .setName(textbox_name)
                  .setWidth('350')
                  .setHeight('100');
                  
    var hpanel4 = app.createHorizontalPanel()
                     .setStyleAttribute('border-spacing', '6px')
                     .add(app.createLabel(langstr("FLB_STR_EMAIL_GRADES_INSTRUCTOR_MESSAGE")))
    
    main_panel.add(hpanel4);
    
    var hpanel5 = app.createHorizontalPanel()
                     .setStyleAttribute('border-spacing', '6px')
                     .add(tbox);
    
    main_panel.add(hpanel5);
    
    // Make selections available in handler.
    handler.addCallbackElement(lbox);
    handler.addCallbackElement(cbox);
    handler.addCallbackElement(cbox2);
    handler.addCallbackElement(tbox);
    
    // Add the Continue and Cancel buttons at the bottom.
    var btnGrid = app.createGrid(1, 3).setStyleAttribute('float', 'right');
    var btnSubmit = app.createButton(langstr("FLB_STR_BUTTON_CONTINUE"),handler)
                       .setId('CONTINUE')
                       .addClickHandler(click_handler);
    
    btnGrid.setWidget(0,1,btnSubmit);
    //btnGrid.setWidget(0,2,app.createButton('Cancel',handler).setId('CANCEL'));
    btnGrid.setWidget(0,0,app.createImage(FLUBAROO_WORKING_IMG_URL).setVisible(false).setId('working'));
    
    main_panel.add(btnGrid);
    app.add(main_panel);    

    return app;
    
    // Private functions.
    
    function quesContainsEmail(ques_txt)
    {
      ques_txt = ques_txt.toLowerCase();
      
      if (ques_txt.indexOf('email') != -1 ||
          ques_txt.indexOf('e-mail') != -1 ||
          ques_txt.indexOf('correo') != -1)
        {
          return true;
        }
      
      return false;
      
    } // UIClass.emailGrades.quesContainsEmail()
    
  } // UIClass.emailGrades()
      
  // advancedOptions()
  // -------------
  //
  // Create the UI used for advanced options.
  
  this.advancedOptions = function()
  {
    var dp = PropertiesService.getDocumentProperties();
    var up = PropertiesService.getUserProperties();
    
    // grab the current saved values for the options.
    var edit_link = dp.getProperty(DOC_PROP_ADV_OPTION_EMAIL_EDIT_LINK);
    var no_noreply = up.getProperty(USER_PROP_ADV_OPTION_NO_NOREPLY);
    var use_docs = up.getProperty(USER_PROP_ADV_OPTION_USE_DOCS_FOR_GRADES);
    var checked;
    
    var html = HtmlService.createHtmlOutput().setWidth(650);

    html.setTitle(langstr("FLB_STR_ADV_OPTIONS_WINDOW_TITLE"))
    
    var h = "<html><body>";
    h += '<div style="font-family:Sans-Serif;font-size:14px;">';
    h += '<b>' + langstr("FLB_STR_ADV_OPTIONS_NOTICE") + ' (<a href="http://flubaroo.com/hc">flubaroo.com/hc</a>).</b><br><br>';
    
    h += '<form id ="adv_options_form" action="">';
    h += '<br>Options for this spreadsheet only:<br>';
    
    h += '<p style="padding-left:25px;">'
    
    // removing for now until I work out how to do it
    /*
    checked = edit_link ? "checked" : "";
    h += '<input type="checkbox" name="edit_link" ' + checked + '>' + langstr("FLB_STR_ADV_OPTIONS_EMAIL_EDIT_LINK") + '<br><br>';
    */
 
    var rates = new Array("50.0", "55.0", "60.0", "65.0", "70.0", "75.0", "80.0", "85.0", "90.0", "95.5");
    var selected = [];
    for (var i=0; i < rates.length; i++)
      {
        selected.push("");
      }
    
    var opt_pass_rate = dp.getProperty(DOC_PROP_ADV_OPTION_PASS_RATE);
    if (!opt_pass_rate)
      {
        opt_pass_rate = LOWSCORE_STUDENT_PERCENTAGE.toString();
      }
    
    for (var i=0; i < selected.length; i++)
      {
        Debug.info("comparing '" + Number(rates[i]) + ", '" + Number(opt_pass_rate) + "'");
        if (Number(rates[i]) == Number(opt_pass_rate))
          {
            selected[i] = "selected";
            break;
          } 
      }
    
    h += langstr("FLB_STR_ADV_OPTIONS_PASS_RATE") + '<select name="pass_rate">';
    for (var i=0; i < rates.length; i++)
      {
        h += '<option value="' + rates[i] + '" ' + selected[i] + '>' + rates[i] + "%" + '</option>';
      }
    h += '</select>';
    
    h += '</p>';
    
    h += "<hr><br>";
    h += 'Options for all spreadsheets where Flubaroo is installed:<br>';

    h += '<p style="padding-left:25px;">'
    checked = no_noreply ? "checked" : "";
    h += '<input type="checkbox" name="no_noreply" ' + checked + '>' + langstr("FLB_STR_ADV_OPTIONS_NO_NOREPLY") + '<br><br>';
    
    // removing for now, until I have time to fully test it
    /*
    checked = use_docs ? "checked" : "";
    h += '<input type="checkbox" name="google_doc" ' + checked + '>' + langstr("FLB_STR_ADV_OPTIONS_GOOGLE_DOCS") + '<br>';
    */

    h += '</p>';
    
    var onclick="google.script.run.withSuccessHandler(aoCloseWindow).processAdvOptionsForm(this.parentNode)";
    
    h += '<br><input type="button" value="Submit" onclick="' + onclick + '" />';
   
    h += '</form>';
    h += '</div>';
    
    h += "<script>function aoCloseWindow() { google.script.host.close(); }</script>";
    
    h += "</body></html>";
    
    html.append(h);
    
    return html;
  }
  
} // UIClass

// doPost()
// ========

function doPost(e)
{
  Debug.info("doPost()");
  
  Debug.assert(e.parameter.handler === "step2", "doPost() - should always be step2");  
  
  var app = step2EventHandler(e);
  return app;
    
} // doPost()

// Event handlers
// ==============

// TODO_AJR - I've tried these as private but doesn't work, they could be inside the 
// privileged methods somehow???

// step1EventHandler()
// -------------------
//
// Event handler for step 1 of the grading UI.

function step1EventHandler(e_step1)
{
  Debug.info("step1EventHandler()");
  
  source = e_step1.parameter.source;
  Debug.info("step1EventHandler() - source = " + source);
  
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = getSheetWithSubmissions(ss);
  
  // Close current window.
  var app = UiApp.getActiveApplication();
  app.close();
  Debug.info("step1EventHandler() - step1 UI closed");
  
  // If continuing, setup and display next UI window.
  // Given the input made by the instructor in the Step 1 UI, construct
  // a Step2 UI to allow them to select the Answer Key row.
  app2 = UI.step2Grading(e_step1, sheet);
  ss.show(app2);
  //return app2;  // causing an error sometimes
  
} // step1EventHandler()

// continueButtonClickHandler()
// ----------------------------
//
// Button handler for several UIs.

function continueButtonClickHandler(e)
{
  var app = UiApp.getActiveApplication();
  
  var working_img = app.getElementById('working');
  var continue_button = app.getElementById('CONTINUE');
  var cancel_button = app.getElementById('CANCEL');
  
  Debug.info("continueButtonClickHandler()");
  
  if (continue_button)
  {
    // Disable the continue button.
    continue_button.setEnabled(false);
  }
  
  // Display the "working" image.
  working_img.setVisible(true);
  
  return app;
  
} // continueButtonClickHandler()   

// step2RadioClickHandler()
// ------------------------

function step2RadioClickHandler(e_step2)
{
  Debug.info("step2RadioClickHandler()");

  // Enable this radio button.
  var app = UiApp.getActiveApplication();
  var continue_button = app.getElementById('CONTINUE');
  continue_button.setEnabled(true);
  return app;
  
} // step2RadioClickHandler()

// step2EventHandler()
// -------------------
//
// Process the user selections in step 2 of grading setup.  

// TODO_AJR - Couldn't we move the decisions about the UI skip
// into the UI module??

function step2EventHandler(e_step2)
{  
  Debug.info("step2EventHandler()");
  
  var dp = PropertiesService.getDocumentProperties(); 
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = getSheetWithSubmissions(ss);
  var app;
  //var emailApp;
  var already_emailed_info = null;
  var student_feedback_info = null;
  var gws_graded;
  var gws;
  var subm_read_index;
  var repeat_subm;
  var just_write_latest_subm;
  
  if (e_step2)
    {  
      Debug.info("step2EventHandler() - got event");
    
      Debug.assert(e_step2.parameter.answer_key_select !== undefined,
                   "step2EventHandler() - no answer key selected.");

      Debug.assert(UI.isOn(), "step2EventHandler() - UI should be on");

      // Store the answer key row that was passed in the event.
      dp.setProperty(DOC_PROP_ANSWER_KEY_ROW_NUM, 
                                   e_step2.parameter.answer_key_select);      

      // Close the present UI - Step 2 UI.
      app = UiApp.getActiveApplication();
      app.close();
      
      // We might be here to collect grading options for autograde. If so, we need to
      // move on to collecting email options. Not typical.
      if (Autograde.isGatheringOptions())
        {
          Debug.info("step2EventHandler() - gathering autograde info");
      
          // TODO_AJR - This will re-create the gws object, couldn't we preserve it??
      
          // Display the email UI.
          //emailApp = UI.emailGrades(ss);
          //ss.show(emailApp);
          //return emailApp;

          app = UI.emailGrades(ss);
          ss.show(app);
          return;
        }
        
      // Give the instructor some notice that we're 
      // grading their assignment.
      app = UI.pleaseWait(sheet,
                          langstr("FLB_STR_GRADING_WINDOW_TITLE"),
                          langstr("FLB_STR_WAIT_INSTR2"));
      ss.show(app);
    }
  else
    {    
      Debug.info("step2EventHandler() - no event");
      Debug.assert(UI.isOff(), "step2EventHandler() - UI should be off");
      Debug.assert(gotGradingInfo(), "step2EventHandler() - should have grading info by now")
    }
    
  Debug.info("invalidate grades sheet on update: " + invalidateGradesOnUpdate());
  
  var grades_sheet = getSheetWithGrades(ss);
  
  if (grades_sheet && gradesSheetIsValid(grades_sheet) && !invalidateGradesOnUpdate())
  {
    // Read in a copy of the grades sheet. 
    // We need to do this so we can retain the values of 
    // "Already Emailed" when generating a new Grades 
    // sheet, as well as the values in the "Student 
    // Feedback" columns. Note: We don't do this if we've 
    // just upgraded though, since possibly the expected
    // format of Grades may have changed with the new 
    // version. The user will instead re-grade
    // first.
    
    Debug.info("step2EventHandler() - collecting info on " + 
              "grades already emailed and student feedback");
    
    gws_graded = new GradesWorksheet(ss, INIT_TYPE_GRADED_PARTIAL);

    if (gws_graded)
      {
        already_emailed_info = gws_graded.getAlreadyEmailedInfo();
        student_feedback_info = gws_graded.getStudentFeedbackInfo();
      }
    
    // DAA_TODO: This is not a nice way to show a debug message (using runtime conditions).
    // But I need it to investigate a field issue.
    if (already_emailed_info)
      {
        Debug.info("already_emailed_info.length: " + already_emailed_info.length);
      }
    else
      {
         Debug.info("already_emailed_info is null");
      }
  }
  
  // TODO_AJR - Would be good if we didn't have to do create a new 
  // gws object everytime.
  
  // Create a new gws object from the submissions sheet.
  gws = new GradesWorksheet(ss, INIT_TYPE_SUBM);
    
  // Write the submissions to the new grades sheet. Whether we're 
  // just writing the last submission or all of them depends on 
  // whether autograde is enabled and whether there has been a submission 
  // from this student before.
  
  // TODO_AJR - Rather than re-write all the submissions in the grades sheet 
  // when we have a repeat, it would be possible to just replace the one.
  // This could also be applied to manual re-grading, although there could be 
  // advantages to re-creating the whole grade sheet, although this can 
  // easily be done by deleting it and refreshing.
  
  // TODO_DAA: Explore the use of just_write_latest_subm (from AJR) in
  // main Flubaroo code to speed up Autograde. Turning off for now due to
  // concerns about a bug, and also b/c it makes for an inconsistent
  // experience in the Grades sheet (headers not updated, etc).
  
  /* just_write_latest_subm = Autograde.isOn() && !gbl_repeat_subm; */
  just_write_latest_subm = false;
  
  // Finished with this now.
  gbl_repeat_subm = false;
  
  gws.writeGradesSheet(already_emailed_info, 
                       student_feedback_info, 
                       just_write_latest_subm);
    
  Debug.info("step2EventHandler() - grades sheet written");
  
  // Regenerate the menu, so it's consistent with any UI changes
  // that took place during grading (i.e. rehiding of student feedback).
  createFlubarooMenu();
 
  // With first grading complete, take note of the current 
  // version this user has installed in this sheet. can't do 
  // this in onOpen or onInstall.
  setCurrentVersionInfo();
  
  if (UI.isOn())
  {
    // Close the waiting UI.
    app.close();
    
    // Display grading complete.    
    app = UI.gradingResults();
    ss.show(app);
  }
  
  Debug.info("step2EventHandler() - returning");
  
  Debug.writeToFieldLogSheet();
  
  return app;
  
} // step2EventHandler()

// gradingResultsEventHandler()
// ----------------------------

function gradingResultsEventHandler(e)
{
  Debug.info("gradingResultsEventHandler()");

  // Grading complete - do nothing (for now anyway)
  
  var app = UiApp.getActiveApplication();
  app.close();
  
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var grades_sheet = getSheetWithGrades(ss);
  if (grades_sheet !== null)
    {
      ss.setActiveSheet(grades_sheet);  
    }
  else
    {
      Debug.error("gradingResultsEventHandler() - no grades sheet");
    }  
  
  return app;
  
} // gradingResultsEventHandler()

// showQuestionsValueChangeHandler()
// ---------------------------------

function showQuestionsValueChangeHandler(e)
{
  var app = UiApp.getActiveApplication();  
  var sa_cbox = app.getElementById('show_answers');
  var new_value = e.parameter.show_questions;
  
  if (new_value === 'true')
  {
    sa_cbox.setEnabled(true);
  }
  else
  {
    sa_cbox.setValue(false);
    sa_cbox.setEnabled(false);
  }
  
  return app;
  
} // showQuestionsValueChangeHandler()

// emailGradesHandler()
// --------------------

function emailGradesHandler(e)
{
  var dp = PropertiesService.getDocumentProperties();
  Debug.info("emailGradesHandler()");

  // TODO_AJR - I don't think cancel is used.
  
  var dp = PropertiesService.getDocumentProperties();
   
  var app = UiApp.getActiveApplication();
  var source = e.parameter.source;
  
  if (source === 'CANCEL')
  {
    app.close();
    return app;
  }
  
  // Get the user's selections from the event and and store them.
  
  dp.setProperty(DOC_PROP_EMAIL_ADDRESS_QUESTION, 
                               e.parameter.email_ques_index);
  
  dp.setProperty(DOC_PROP_EMAIL_INCLUDE_QUESTIONS_SCORES, 
                               e.parameter.show_questions);
  
  dp.setProperty(DOC_PROP_EMAIL_INCLUDE_ANSWER_KEY, 
                               e.parameter.show_answers);
  
  dp.setProperty(DOC_PROP_EMAIL_INSTRUCTOR_MESSAGE, 
                               e.parameter.instructor_message);
  
  dp.setProperty(DOC_PROP_EMAIL_INSTRUCTOR_ADDRESS, 
                               e.parameter.email_addr);
  
  // If we're just gathering or updating options for autograde 
  // then don't actually send any emails.
  if (Autograde.isGatheringOptions())
  {
    Autograde.finalizeOn();
    Autograde.clearGatheringOptions();
    app.close();
    return app;
  }
  
  sendEmailGrades();
  
  return app;
  
} // emailGradesHandler()


function processAdvOptionsForm(formObject)
{
  Debug.info("in the advanced options form handler");
  var up = PropertiesService.getUserProperties(); 
  var dp = PropertiesService.getDocumentProperties();

  // process all of the true/false options
  
  /* works, but removing for now.
  if (!formObject.edit_link)
    {
      removeFormSubmitTrigger();
      dp.deleteProperty(DOC_PROP_ADV_OPTION_EMAIL_EDIT_LINK);
    }
  else
    {
      setupFormSubmitTrigger();
      dp.setProperty(DOC_PROP_ADV_OPTION_EMAIL_EDIT_LINK, "true");
    }
   */
  
  if (!formObject.no_noreply)
    {
      up.deleteProperty(USER_PROP_ADV_OPTION_NO_NOREPLY);
    }
  else
    {
      up.setProperty(USER_PROP_ADV_OPTION_NO_NOREPLY, "true");
    }
  
  if (!formObject.google_doc)
    {
      up.deleteProperty(USER_PROP_ADV_OPTION_USE_DOCS_FOR_GRADES);
    }
  else
    {
      up.setProperty(USER_PROP_ADV_OPTION_USE_DOCS_FOR_GRADES, "true");
    }
  
  var pass_rate = formObject.pass_rate;

  if (pass_rate && !isNaN(pass_rate))
    {
      dp.setProperty(DOC_PROP_ADV_OPTION_PASS_RATE, pass_rate);
    }
}
