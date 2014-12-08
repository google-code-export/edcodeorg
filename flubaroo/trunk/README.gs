// Change Log:
//   Version 1.0, 3/7/11: Initial release
//   Version 1.1, 3/22/11: Fixed bug with emailing of grades
//                         and added percent column.
//   Version 1.2, 6/28/11: Fixed serverChangeHandler problem,
//                         and whitespace problem.
//   Version 1.3, 11/30/11: Added Google Analytics tracking
//   Version 2.0, 1/17/12:  Major rewrite and feature additions. See blog
//                         post (flubaroo.com/blog) for list of new features. Internally,
//                         got rid of need for findPresentedQuestion
//                         function by changing grading options row.
//                         Added extra hidden rows to make 'Grades' self-contained.
//                         Broke 'flubaroo.gas' into multiple files.
//   Version 2.1, 11/29/12: Fixes for issues 8 and 9.

/*   Version 3.0, 6/24/13:
     Many changes in this version. The code has been compltely re-written from scratch
     (an effort which started a year ago) to make it easier to modify and extend by myself
     and others. Also:
      
      Bug / Issue fixes:
      - Fix for recent bug in which Flubaroo runs forever (sheet reference issue)
      - Issue 1 resolved
      
      New Features:
      - Flubaroo won't re-email students who have already been emailed (Issue 2).
      - Flubaroo can now send an optional help tip per question to students in the email (Issue 3).
*/                

//   Version 3.01, 6/26/13: Quick fix for answer key issue reported (issue 37).
//   Version 3.02, 11/1/13: Fix for issues 39, 65, and 66. 
//   Version 3.1, 1/2/14: Implementation of number ranges by Andrew Roberts (issue 42), andrewroberts.net.
//   Version 3.11 1/8/14: Quick fix for issue that affects TRUE/FALSE question types, introduced in 3.1.

//   Version 12 3/11/14: First release for new Google sheets & Add-ons. Introducing new, simpler versioning scheme (just a number). 
//                       Functinally the same as version 3.11, with the exception of some improved error handling.

//   Version 13 6/9/14: Fixed %or bug (issue 86), fixed minor issue with "Incorrect" text in emails sent, and modified 
//                      multiple language support to make it easier for contributors to localize Flubaroo. Added in notice
//                      if user is over their daily email quota. Also added in translations for Swedish, Dutch, and Russian.
//
//   Version 14 7/18/14: Introduced translations for French, French-Canadian, and Hebrew.
//   Version 15 8/31/14: Introduced %cs operator for case-sensitive grading (Issue #20).
//   Version 16 10/29/14: Changes auth dialog (on install) to clarify that Flubaroo only accesses info in the spreadsheets
//                        where it's installed.
//   Version 17 12/5/14: Launch of autograde feature! Also introduced advanced option menu.
//   Version 18 12/6/14: Small modification to speed-up autograding when there are multiple concurrent submissions.