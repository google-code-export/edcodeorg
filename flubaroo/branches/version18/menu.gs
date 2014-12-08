// menu.gs
// =============
//
// This file contains all the code related to setting up the menu, and 
// some setup functions that respond to the menu selections.


// Flubaroo Menu
// =============

function createFlubarooMenu()
{        

  if (Autograde.isOn() && Autograde.isRunning())
    {
      // Autograde can't update any UI related stuff when running from
      // a trigger.
      return;
    }

  dumpConfig();

  var dp = PropertiesService.getDocumentProperties();
  var ss = SpreadsheetApp.getActiveSpreadsheet();  
  var sui = SpreadsheetApp.getUi();
  var menu = sui.createMenu(gbl_menu_name);

  if (Autograde.isOn())
    {
      // Don't allow the usual options. Just the ability to turn this off.
      menu.addItem(langstr("FLB_STR_MENU_DISABLE_AUTO_GRADE"), "toggleAutograde");
      
      menu.addSeparator(); // line break
      menu.addItem(langstr("FLB_STR_MENU_ABOUT"), "aboutFlubaroo");  

      var dbg_menu = createDebugMenu(menu);
      
      if (dbg_menu)
        {
          menu.addSeparator(); // line break
          menu.addSubMenu(dbg_menu);
        }
      
      menu.addToUi();       
      return;
    }
   
  // Only show "Re-grade, Email Grade, View Report, etc, if (a) Grades sheet is present and
  // (b) user didn't just upgrade to a new version of Flubaroo in this sheet. If they just upgraded,
  // assignment must be re-graded first, incase format of Grades sheet is different in new version.
  else if (gotSheetWithGrades(ss) && !justUpgradedThisSheet())
    {
      // TODO_AJR - Reenable re-grading (presently duplicates grades sheet).
      menu.addItem(langstr("FLB_STR_MENU_REGRADE_ASSIGNMENT"), "menuGradeStep1");
      
      menu.addItem(langstr("FLB_STR_MENU_EMAIL_GRADES"), "menuEmailGrades");
             
      menu.addItem(langstr("FLB_STR_MENU_VIEW_REPORT"), "viewReport");
            
      menu.addSeparator(); // line break

      if (helpTipsHidden())
        {
          menu.addItem(langstr("FLB_STR_MENU_EDIT_HELP_TIPS"), "toggleHelpTips");
        }
      else
        {
          menu.addItem(langstr("FLB_STR_MENU_HIDE_HELP_TIPS"), "toggleHelpTips");
        }

      var col_hidden = dp.getProperty(DOC_PROP_STUDENT_FEEDBACK_HIDDEN);
      
      if (col_hidden == "true")
        {
          menu.addItem(langstr("FLB_STR_MENU_EDIT_FEEDBACK"), "toggleFeedback");
        }
      else
        {
          menu.addItem(langstr("FLB_STR_MENU_HIDE_FEEDBACK"), "toggleFeedback");
        }
    }
  else
    {
      menu.addItem(langstr("FLB_STR_MENU_GRADE_ASSIGNMENT"), "menuGradeStep1");
      menu.addSeparator(); // line break
      
      if (helpTipsHidden())
        {
          menu.addItem(langstr("FLB_STR_MENU_EDIT_HELP_TIPS"), "toggleHelpTips");
        }
      else
        {
          menu.addItem(langstr("FLB_STR_MENU_HIDE_HELP_TIPS"), "toggleHelpTips");
        }
    }
   
  menu.addSeparator(); // line break
  
  var submenu = sui.createMenu(langstr("FLB_STR_MENU_ADVANCED"));
  submenu.addItem(langstr("FLB_STR_MENU_ADV_OPTIONS"), "menuAdvancedOptions");
  submenu.addItem(langstr("FLB_STR_MENU_ENABLE_AUTO_GRADE"), "toggleAutograde");
  submenu.addItem(langstr("FLB_STR_MENU_SET_LANGUAGE"), "setLanguage");
  submenu.addItem(langstr("FLB_STR_MENU_SHOW_EMAIL_QUOTA"), "showEmailQuota");
  menu.addSubMenu(submenu);

  menu.addSeparator(); // line break
  menu.addItem(langstr("FLB_STR_MENU_ABOUT"), "aboutFlubaroo");  
   
  var dbg_menu = createDebugMenu(menu);
  if (dbg_menu)
    {
      menu.addSeparator(); // line break
      menu.addSubMenu(dbg_menu);
    }
  
  menu.addToUi(); 
  
  return;
}

// createNonAuthMenu:
// We're in the case when this Add-On hasn't yet been used in the sheet, even though
// it's been approved in another sheet. So all we're able to do is setup a menu (i.e.
// can't read properties, etc). Setup a simple English menu, since we can't lookup their lang.
function createNonAuthMenu()
{    
  var menuEntries = [];
    
  var ui = SpreadsheetApp.getUi();
  var menu = ui.createMenu(gbl_menu_name);
  
  menu.addItem(langstr_en("FLB_STR_MENU_GRADE_ASSIGNMENT"), "gradeStep1");
  menu.addSeparator(); // line break
  menu.addItem(langstr_en("FLB_STR_MENU_SET_LANGUAGE"), "setLanguage");
  menu.addItem(langstr_en("FLB_STR_MENU_ABOUT"), "aboutFlubaroo");
  menu.addToUi();
}

// skipUIMenu()
// ------------

function skipUIMenu()
{
  UI.off();
  
  createFlubarooMenu();
  
} // skipUIMenu()

// displayUIMenu()
// ---------------

function displayUIMenu()
{
  UI.on();
  
  createFlubarooMenu();
  
} // displayUIMenu()

// TODO_AJR - Move to ui.gas

function aboutFlubaroo()
{  
   var ss = SpreadsheetApp.getActiveSpreadsheet();
   var app = UiApp.createApplication()
                      .setTitle(langstr("FLB_STR_MENU_ABOUT"))
                      .setWidth("500").setHeight("200");
  
   // create the main panel to hold all content in the UI for this step,
   var main_panel = app.createVerticalPanel()
                       .setStyleAttribute('border-spacing', '10px');
   app.add(main_panel);
 
   var hpanel_main = app.createHorizontalPanel()
                .setStyleAttribute('border-spacing', '10px');
   var vpanel1 = app.createVerticalPanel()
                .setStyleAttribute('border-spacing', '10px');
   
   // add a top level hpanel for instructions and picture
   var vpanel1 = app.createVerticalPanel()
       .setStyleAttribute('border-spacing', '10px')
       .add(app.createImage(FLUBAROO_WELCOME_IMG_URL));
   
   
   var vpanel2 = app.createVerticalPanel()
                .setStyleAttribute('border-spacing', '10px');
   
   var hpanel_r_top = app.createHorizontalPanel()
                         .setStyleAttribute('border-spacing', '3px')
                         .add(app.createLabel("Flubaroo - " + gbl_version_str));
   var hpanel_r_mid = app.createHorizontalPanel()
                         .setStyleAttribute('border-spacing', '3px')
                         .add(app.createLabel(langstr("FLB_STR_ABOUT_FLUBAROO_MSG1")));
   var hpanel_r_bot = app.createHorizontalPanel()
                         .setStyleAttribute('border-spacing', '3px')
                         .add(app.createLabel(langstr("FLB_STR_ABOUT_FLUBAROO_MSG2")));
   vpanel2.add(hpanel_r_top);
   vpanel2.add(hpanel_r_mid);
   vpanel2.add(hpanel_r_bot);
    
     
   hpanel_main.add(vpanel1);
   hpanel_main.add(vpanel2);
 
   main_panel.add(hpanel_main);
 
   ss.show(app);
   
   logAboutFlubaroo();
}

function menuGradeStep1()
{
  // Housecleaning. Clear this anytime a user explicitly chooses to grade
  // the assignment. It could be left set if a user quit prematurely while
  // setting autograde options, which could in turn mess up the UI flow for 
  // normal grading.
  Autograde.clearGatheringOptions();
 
  return gradeStep1();
}

function menuAdvancedOptions()
{
  var html = UI.advancedOptions();
  SpreadsheetApp.getUi()
                  .showModalDialog(html, langstr("FLB_STR_ADV_OPTIONS_WINDOW_TITLE"));
  
  return;
}
