// autograde.gas
// =============
//
// This file contains all the code related to the Autograde function.
//
// All access to the autograde script properties should be within 
// the autograde object.

// TODO_AJR - assert on edits when Autograde on (?).

// TODO_AJR - Decide on consistent function description styles.

// TODO_AJR - Should we be checking explicitly or just using falsey/truthy
// type conversion. if (!a) {...} or if (a === null) {...}. I probably
// prefer the later as it's stronger typing, the other could fall through
// with unexpected values. 

// TODO_AJR - Is deleting a property each time going to be slower than setting it?

// The global Autograde object
// ---------------------------

// TODO_AJR - Should we just have an instance of this when we need it?
Autograde = new AutogradeClass();

// Autograde class
// ---------------

function AutogradeClass()
{
  // Private properties
  // ==================
  
  // Autograde/UI Events - offsets into the State/Event Table.
  var agUIEvents = 
    {
      AUTOGRADE_ON: 0,
      AUTOGRADE_OFF: 1,
      UI_ON: 2,
      UI_OFF: 3,
      LENGTH: 4
    };
  
  // setAgUiState()
  // ----------------
  //
  // This is a state machine that ensures that only legal combinations of 
  // autograde and UI (present and previous) states.
  //
  // There is a very tight relationship between the UI and autograde.
  // When autograde is on, UI must be off. But when autograde is turned off
  // the UI is usually turned back on, unless it was originally off in which
  // case it is left off.
  // 
  // So the autograde/UI state can be described by three flags:
  //
  // Each of these states are stored in a Document Property to ensure they are
  // persistent for the life of the script, not just a particular execution.
  //
  // To check that only the correct states are being used each flag is stored 
  // in a bitmask and on an event (autograde or the UI being turned on or off) 
  // the subsequent state is derived from the State/Event Table.
  // 
  //   bit 0 - autograde: on (1) or off (0)
  //   bit 1 - UI: on (1) or off (0)
  //   bit 2 - UI state before the autograde was toggled: on (1) or off (0)
  //   bit 3 - Whether this state is allowed: ok (0) or illegal (1)
    
  function setAgUiState(event)
  {    
    Debug.info("AutogradeClass.setAgUiState() - event: " + event);
  
    Debug.assert(typeof event === "number" && event < agUIEvents.LENGTH, 
                 "AutogradeClass.setAgUiState() - Illegal event");
  
    // Autograde/UI bitmasks of their possible states.
    var UIWASOFF_UIOFF_AGOFF = 0;  // 0000
    var UIWASOFF_UIOFF_AGON  = 1;  // 0001
    var UIWASOFF_UION__AGOFF = 2;  // 0010
    var UIWASOFF_UION__AGON  = 3;  // 0011
    var UIWASON__UIOFF_AGOFF = 4;  // 0100
    var UIWASON__UIOFF_AGON  = 5;  // 0101
    var UIWASON__UION__AGOFF = 6;  // 0110
    var UIWASON__UION__AGON  = 7;  // 0111
    var ILLEGAL_STATE        = 15; // 1111
  
    var AG_MASK = 1;
    var UI_MASK = 2;
    var UIWASON_MASK = 4;
  
    var stateEventTable = 
      [
        // AUTOGRADE_ON       AUTOGRADE_OFF         UI_ON                 UI_OFF
        // ------------       -------------         -----                 ------ 
        [UIWASOFF_UIOFF_AGON, ILLEGAL_STATE,        UIWASOFF_UION__AGOFF, ILLEGAL_STATE],        // UIWASOFF_UIOFF_AGOFF
        [ILLEGAL_STATE,       UIWASOFF_UIOFF_AGOFF, ILLEGAL_STATE,        ILLEGAL_STATE],        // UIWASOFF_UIOFF_AGON
        [UIWASON__UIOFF_AGON, ILLEGAL_STATE,        ILLEGAL_STATE,        UIWASON__UIOFF_AGOFF], // UIWASOFF_UION__AGOFF
        [ILLEGAL_STATE,       ILLEGAL_STATE,        ILLEGAL_STATE,        ILLEGAL_STATE],        // UIWASOFF_UION__AGON
        [UIWASOFF_UIOFF_AGON, ILLEGAL_STATE,        UIWASOFF_UION__AGOFF, ILLEGAL_STATE],        // UIWASON__UIOFF_AGOFF
        [ILLEGAL_STATE,       UIWASOFF_UION__AGOFF, ILLEGAL_STATE,        ILLEGAL_STATE],        // UIWASON__UIOFF_AGON
        [UIWASON__UIOFF_AGON, ILLEGAL_STATE,        UIWASON__UION__AGOFF, UIWASON__UIOFF_AGOFF], // UIWASON__UION__AGOFF
        [ILLEGAL_STATE,       ILLEGAL_STATE,        ILLEGAL_STATE,        ILLEGAL_STATE]         // UIWASON__UION__AGON
      ];
  
    // Get the present state
    // ---------------------
    
    // Cast the propertie's value as a Boolean and then a number.
    // So e.g. if the property is "true" this is cast to true and then 1.
    var dp = PropertiesService.getDocumentProperties();
    var v = dp.getProperty(DOC_PROP_AUTOGRADE_ENABLED);
    var b = !!v;
    var autogradeOn = +b;
    
    var v1 = dp.getProperty(DOC_PROP_UI_OFF);
    var b1 = !v1;
    var uiOn = +b1;
    
    var v2 = dp.getProperty(DOC_PROP_UI_WAS_OFF);
    var b2 = !v2;
    var uiWasOn = +b2;
    
    // Set up a three digit bitmask to represent the state of 
    // the autograde, UI and the UI state before the last event.
    var presentState = (uiWasOn << 2) | (uiOn << 1) | autogradeOn;
    
    Debug.info("AutogradeClass.setAgUiState() - present state: " + presentState);
    
    // Get the new state
    // -----------------
    
    var newState = stateEventTable[presentState][event];
    
    Debug.info("AutogradeClass.setAgUiState() - new state: " + newState);  
    
    Debug.assert(newState !== ILLEGAL_STATE, "AutogradeClass.setAgUiState() - illegal state");
    
    // Set the script properties
    // -------------------------
    
    if (!!(newState & AG_MASK))
      {
        dp.setProperty(DOC_PROP_AUTOGRADE_ENABLED, "true");
        Debug.info("AutogradeClass.setAgUiState() - autograde on");      
      }
    else
      {
        dp.deleteProperty(DOC_PROP_AUTOGRADE_ENABLED);
        Debug.info("AutogradeClass.setAgUiState() - autograde off");            
      }
  
    if (!!(newState & UI_MASK))
      {
        dp.deleteProperty(DOC_PROP_UI_OFF);
        Debug.info("AutogradeClass.setAgUiState() - UI on");      
      }
    else
      {
        dp.setProperty(DOC_PROP_UI_OFF, "true");
        Debug.info("AutogradeClass.setAgUiState() - UI off");            
      }
  
    if (!!(newState & UIWASON_MASK))
      {
        dp.deleteProperty(DOC_PROP_UI_WAS_OFF);
        Debug.info("AutogradeClass.setAgUiState() - UI was on");      
      }
    else
      {
        dp.setProperty(DOC_PROP_UI_WAS_OFF, "true");
        Debug.info("AutogradeClass.setAgUiState() - UI was off");            
      }
      
  }; // AutogradeClass.setAgUiState()
    
  // Privileged methods
  // ==================
  //
  // Methods that are public but have access to local properties.
  
  // on()
  // ----
  //
  // Enable autograding. In order to perform autograding all grading 
  // and email options need to have been setup. If they have give the 
  // user the option to change them.

  this.on = function()
  {
    Debug.info("AutogradeClass.on()");
  
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var gather_app = null;
    var result;
    var gather_options = false;

    // TODO_AJR - There are bugs in getting autograde to initialise
    // the grading and email options, so force the user to do this
    // with a manual grade for now.

    if (!gotGradingAndEmailInfo())
      {
        result = UI.msgBox(langstr("FLB_STR_NOTIFICATION"), 
                                langstr("FLB_STR_AUTOGRADE_SETUP"),
                                Browser.Buttons.OK_CANCEL);
      
        if (result != "ok")
          {
            // user chose not to setup autograde.
            return;
          }
        
        gather_options = true;
      }
    else 
      {
        // at this point, we have grading & email options stored. but see if the user
        // wants to update them before we proceed.
      
        // grading options set, but find out if user wants to update them.
        result = Browser.msgBox(langstr("FLB_STR_NOTIFICATION"), 
                                langstr("FLB_STR_AUTOGRADE_UPDATE"),
                                Browser.Buttons.YES_NO);
      
        if (result === "yes")
          {
            gather_options = true;
          }
        else if (result === "cancel")
          {
            return;
          }
      }     

    // What's the user decided?
    if (gather_options)
      {
        gather_app = launchOptionsUpdate();
      }
    else
      {
        this.finalizeOn();
      }

    return gather_app;
    
    // launchOptionsUpdate()
    // ---------------------
    
    function launchOptionsUpdate()
    {
      Debug.info("AutogradeClass.on.launchOptionsUpdate()");
      var dp = PropertiesService.getDocumentProperties();
      dp.setProperty(DOC_PROP_AUTOGRADE_GATHERING_OPTIONS, "true");
      
      if (!preGradeChecks())
        {
          return;
        }
      
      // Gather or update grading options via UI.
      var sheet = getSheetWithSubmissions(ss);
      var app = UI.step1Grading(sheet); 
      ss.show(app); 
      return app;
      
    } // launchOptionsUpdate()
    
  } // AutogradeClass.on()
  
  // off()
  // -----
  //
  // Disable autograding.
  
  this.off = function()
  {
    Debug.info("AutogradeClass.off()");  
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var dp = PropertiesService.getDocumentProperties();
    var trigger_id = dp.getProperty(DOC_PROP_AUTOGRADE_SUBMIT_TRIGGER_ID);
  
    if (trigger_id)
      {
        // Delete actual trigger.
        deleteTrigger(trigger_id);
      
        // Clear the stored trigger ID.
        dp.deleteProperty(DOC_PROP_AUTOGRADE_SUBMIT_TRIGGER_ID);
      }
    else
      {
        Debug.error("Autograde.off() - submit trigger not set.");
      }

    // Set autograding and ui flags.
    setAgUiState(agUIEvents.AUTOGRADE_OFF);
    
    // Cleanup the "running" flag, incase it was left set somehow.
    dp.deleteProperty(DOC_PROP_AUTOGRADE_RUNNING);
    
    // Rebuild the menu.
    createFlubarooMenu(ss);
    
    this.trackUse(false);
    
    // Tell the user.
    setNotification(ss, langstr("FLB_STR_NOTIFICATION"),
                    langstr("FLB_STR_AUTOGRADE_IS_OFF"));
    
  } // AutogradeClass.off()
  
  // finalizeOn()
  // ------------
  //
  // Finalize the process of enabling autograde.
  
  this.finalizeOn = function()
  {  
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var dp = PropertiesService.getDocumentProperties();
    var sheet = getSheetWithSubmissions(ss);
    
    var trigger = ScriptApp.newTrigger("onAutogradeSubmission")
                           .forSpreadsheet(ss)
                           .onFormSubmit()
                           .create();
    
    dp.setProperty(DOC_PROP_AUTOGRADE_SUBMIT_TRIGGER_ID, 
                                 trigger.getUniqueId());

    setAgUiState(agUIEvents.AUTOGRADE_ON);
    
    createFlubarooMenu(ss);
    
    // If some new submissions since last time, or if first time auto-grade
    // is turned on, kick off an autograde (fake a submit trigger).
    // Only bother if enough rows to grade though (3).
    if (enoughSubmToGrade(sheet))
      {
        if (this.recentUngradedSubmissions())
          {
            var result = Browser.msgBox(langstr("FLB_STR_NOTIFICATION"), 
                                       langstr("FLB_STR_AUTOGRADE_GRADE_RECENT"),
                                       Browser.Buttons.YES_NO);
            
            if (result == "yes")
              {
                onAutogradeSubmission();
              }
          }
      }
    
    // track usage of autograde.
    this.trackUse(true);
    
    setNotification(ss, langstr("FLB_STR_NOTIFICATION"),
                    langstr("FLB_STR_AUTOGRADE_IS_ON"));
                             
  } // AutogradeClass.finalizeOn()

  // isOn()
  // ------
  //
  // Check whether Autograde is enabled.
  
  this.isOn = function()
  {
    var dp = PropertiesService.getDocumentProperties();
    
    // Cast the script property as a Boolean.
    var isOn = !!dp.getProperty(DOC_PROP_AUTOGRADE_ENABLED);
    Debug.info("AutogradeClass.isOn(): " + isOn); 
    return isOn;
    
  } // AutogradeClass.isOn()

  // isOff()
  // -------
  //
  // Check whether Autograde is disabled.
  
  this.isOff = function()
  {
    var dp = PropertiesService.getDocumentProperties();
    
    // Cast the script property as a Boolean.
    var isOff = !dp.getProperty(DOC_PROP_AUTOGRADE_ENABLED);
    Debug.info("AutogradeClass.isOff(): " + isOff);
    return isOff;
    
  } // AutogradeClass.isOff()
    
  // TODO_AJR - Should get cleared earlier, at the moment only menuGradeStep1
  
  // isGatheringOptions()
  // --------------------
  
  this.isGatheringOptions = function()
  {
    var dp = PropertiesService.getDocumentProperties();
    return dp.getProperty(DOC_PROP_AUTOGRADE_GATHERING_OPTIONS) === "true";
    
  } // AutogradeClass.isGatheringOptions()
  
  // clearGatheringOptions()
  // -----------------------
  
  this.clearGatheringOptions = function()
  {
    var dp = PropertiesService.getDocumentProperties();
    dp.deleteProperty(DOC_PROP_AUTOGRADE_GATHERING_OPTIONS);
    
  } // AutogradeClass.clearGatheringOptions()
  
  this.isRunning = function()
  {
    var dp = PropertiesService.getDocumentProperties();
    return dp.getProperty(DOC_PROP_AUTOGRADE_RUNNING) === "true";
    
  } // AutogradeClass.isRunning()
  
  
  this.uiOn = function ()
  {
    setAgUiState(agUIEvents.UI_ON);
    
  } // AutogradeClass.uiOn()

  this.uiOff = function ()
  {
    setAgUiState(agUIEvents.UI_OFF);
    
  } // AutogradeClass.uiOff()
  
  this.trackUse = function (is_on)
  {
    var up = PropertiesService.getUserProperties();
    var active_uses = up.getProperty(USER_PROP_AUTOGRADE_ACTIVE_USES);
    if (active_uses == null)
      {
        active_uses = 0;
      }
    else
      {
        active_uses = Number(active_uses);
      }

    if (is_on)
      {
        active_uses += 1;
      }
    else // is_off
      {
        active_uses = Math.max(0, active_uses - 1);
      }

    up.setProperty(USER_PROP_AUTOGRADE_ACTIVE_USES, active_uses.toString()); 
  } // AutogradeClass.trackUse()
  
 
  this.recentUngradedSubmissions = function ()
  {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var dp = PropertiesService.getDocumentProperties();
    var sheet = getSheetWithSubmissions(ss);
    
    var num_rows = sheet.getLastRow();
    var last_row_count = dp.getProperty(DOC_PROP_LAST_GRADED_ROW_COUNT);
    if (last_row_count == null)
      {
        // grading has never been done before, so we definitely need to grade initially.
        last_row_count = 0;
      }
    
    Debug.info("AutogradeClass.recentUngradedSubmissions() - " + last_row_count + "," + num_rows);
    
    if (last_row_count != num_rows)
      {        
        // there has been a change (likely an increase) in the number
        // of rows in the submissions sheet since we last ran autograde.
        return true;
      }
    
    // the number of rows in the submissions sheet is the same now as it
    // was when we last completed autograding. so nothing recent/new to grade.
    return false;
    
  } // AutogradeClass.recentUngradedSubmissions()          
 
} // AutogradeClass()

// Autograde event handlers
// ========================

// toggleAutograde()
// -----------------

// "toggle Autograde" menu event handler.
function toggleAutograde()
{
  Autograde.isOn() ? Autograde.off() : Autograde.on();

} // toggleAutograde()

// onAutogradeSubmission()
// -----------------------
//
// A form submission was made whilst autograde was enabled.

function onAutogradeSubmission()
{ 
  Debug.info("onAutogradeSubmission() - entering");

  // Initial checks
  // --------------

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = getSheetWithSubmissions(ss);
  var dp = PropertiesService.getDocumentProperties();
  
  var grading_lock;

  Debug.assert(Autograde.isOn(), 
         "onAutogradeSubmission() - Autograde off, not expecting trigger");
     
  if (!sheet)
    {
      Debug.warning("onAutogradeSubmission() - no submission sheet.");
      return;
    }
  
  // Grade Submissions
  // -----------------
  //
  // While there are more submissions in the submissions sheet than 
  // have been graded keep on processing them. 

  // This could be "triggered" whilst another submission is being 
  // processed, so get an exclusive, public lock.
  grading_lock = LockService.getPublicLock();
  
  if (!grading_lock.tryLock(10))
    {
      Debug.info("onAutogradeSubmission() - Failed to get lock");
      //grading_lock.releaseLock();
      return;
    }

  try
    {
      // We have lock, so a try/finally is used to make sure
      // the lock is released if we get an error mid-grading.
    
      Debug.info("onAutogradeSubmission() - got lock");
    
      // check if we even need to proceed. there's a good chance
      // that several closely timed submissions will all get graded
      // by the first trigger, even though each will call this same
      // trigger-based function in turn.
      if (!Autograde.recentUngradedSubmissions())
        {
          Debug.info("onAutogradeSubmission() - everything already graded, so exiiting");
          grading_lock.releaseLock();
          Debug.info("onAutogradeSubmission() - lock released");
          return;
        }
      
      dp.setProperty(DOC_PROP_AUTOGRADE_RUNNING, "true");
    
      var num_rows = sheet.getLastRow();
      var rows_processed = 0;
      
      while (rows_processed < num_rows)
        {
          Debug.info("onAutogradeSubmission: rows_processed=" + rows_processed + ", num_rows=" + num_rows);
  
          // Grade the next row in the submissions sheet and email the result.
          
          rows_processed = sheet.getLastRow();
          Debug.info("onAutogradeSubmission: starting grading");
          gradeStep1(); 
          Debug.info("onAutogradeSubmission: grading done, starting emailing");
          sendEmailGrades();
          
          // Get the figures to see if we need to go around again.
          num_rows = sheet.getLastRow();
        }
    }
  finally
    {
      SpreadsheetApp.flush();
      dp.deleteProperty(DOC_PROP_AUTOGRADE_RUNNING);
      grading_lock.releaseLock();
      Debug.info("onAutogradeSubmission() - lock released");
    }
      
} // onAutogradeSubmission()
