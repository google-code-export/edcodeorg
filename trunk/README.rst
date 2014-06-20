=========
 gFormIt
=========
*Auto-generate Google Forms from Google Docs*

**gFormIt** is a Google Docs `Add-on`_. It lets users create `Google Forms`_ based on the content of `Google Docs`_. Originally written for teachers to create asssessments with, it can be used by anyone who wishes to auto-generate Forms without having to edit them directly with the Google Forms editor. gFormIt creates both the Form and the `Google Sheet`_ which hold the responses. If non-blank answers are provided for each question, gFormIt will also submit all of those answers as the first response, priming the Sheet to be processed by `Flubaroo`_, another teacher tool. gFormIt is written in `Google Apps Script`_, JavaScript which runs on Google servers providing access to `Google Apps`_ data.

Installing
==========

You can install **gFormIt** by going to any Google Doc then selecting "Manage Add-ons" in the Tools menu.

Using gFormIt
================

After installing the gFormIt Add-on for Google Docs, open a Google Doc where you'll start by writing one question on a single line -- it's okay if the line wraps. Press RETURN/ENTER to move down to the next line where you'll optionally enter the answer. If you don't wish to provide answers, that's fine too. Regardless, enter one blank line before more question-and-answer pairs. It may look something like the following:

::

    Does this first question have an answer?*[ENTER]*
    Yes, it does.*[ENTER]*
    *[ENTER]*
    For the second problem, describe in your own words how you feel about answering a quiz question where there's no right or wrong answer.*[ENTER]*
    *[ENTER]*
    The third time is a ________ (fill-in the blank)*[ENTER]*
    charm*[ENTER]*


We put an "*[ENTER]*" where you would press RETURN/ENTER to show how many line breaks there are _and_ their location to be more precise. Your Doc should be formatted in a similar way. Notice that **in the example above, the second question does *not* have an answer.** Answers are always optional -- they're the most useful when grading using another tool like Flubaroo, a Google Sheets Add-on.

Finally, be sure to give your document a title, as this will be the filename for the Google Doc as well as the Google Form (representing the assessment) and Google Sheet (to hold responses from submitting the Form) that are automatically created for you by gFormIt. Once you've confirmed the format of your Google Doc and have given it a name, go to the "Add-ons" menu, choose gFormIt, and select "Generate Form".

You'll get a message that shows gFormIt hard at work creating your Form and Sheet. When it's done, you'll get a dialog box indicating as such, letting you know the names of the Form and Sheet that were created. You can then go create other assessments in different Google Docs and running gFormIt will create different Forms and Sheets for each. Note for the impatient: it may take from a few seconds to a few minutes to create both the Form and the response Sheet, so look for the files to appear in your `Google Drive`_ folder.

In addition, gFormIt also takes the answers you provided, and "submits" them to the Form programmatically, as if you or someone else took the assessment in order to provide an "answer key." You can then distribute this assessment to your students to take, and when you're done, you can choose to use another tool, the Flubaroo, an Add-on for Google Sheets, to grade the assessment with... you would only need to point Flubaroo at your answer key.

A longer Help page can be found `here <http://docs.google.com/document/d/1cL7oGWDf0wWpGG_lECjODeqo6GQBIfsvuMXayfj6_Qg/pub>`_. To learn more about gFormIt or Flubaroo, visit `EdCode.org <http://edcode.org>`_. Send any feedback or ideas, please send them to wesc at edcode.org.

About gFormIt and Flubaroo
===========================

gFormIt is a tool whose purpose it is to simplify and automate the creation of Google Forms based on the content of Google Docs. Using using Forms itself isn't a difficult or arduous task, if it's something you have to do fairly often, a bit of automation can't hurt. Because Google Docs is fairly flexible in the formats it accepts, users can create polls, quizzes/exams, or assignments in most document formats in addition to Docs natively: plain text, Microsoft Word, RTF, and others.

Flubaroo is a well-known tool known for helping teachers grade assessments (exams, quizzes, assignments, etc.) built using Forms and submitted by students into a Google Sheet that accepts responses for that Form. It not only performs the grading process, but also creates reports based on the outcome, sends students and/or parents their individual results, and even shows the teacher the questions which may be problematic (i.e., questions in which <60% of the students answer correctly). In short, it's a wonderful teacher tool. However, there hasn't been a tool to simplify the creation of assessments... until now.

Enter gFormIt, another tool for teachers that give them more flexibility on how the assessments are created and also automates this process so teachers don't have to spend any time editing Forms. Furthermore, if teachers provide answers along with the questions in the originating Google Doc, those answers will "automagically" be submitted as the first Form response, setting up the Sheet for Flubaroo which requires users to select one row as the "answer key" for the assessment.

Create a multiple choice assignment or quiz/exam based on the data organized in a Google Doc. Create question-and-answer pairs on adjacent lines delimted by blank lines in a Doc. Then generate a Form based on these questions (and optional answers) by selecting "Generate Form" from the menu. gFormIt will also submit your answers (if given) as the first entry in the resulting Sheet holding responses and ready to be processed by Flubaroo once your students have completed their assignment or test.

While originally created for teachers, there's no reason why anyone else cannot leverage the convenience of gFormIt to create Forms with, especially if the assessment follows a similar question-and-answer format. Future features include supporting multiple choice questions as well as create Forms based on Google Sheets.


License
=======

**gFormIt** is made available under the Apache 2 license; see LICENSE for
details.

.. _`Google Apps Script`: http://developers.google.com/apps-script
.. _`Add-on`: http://developers.google.com/apps-script/add-ons
.. _`Add-ons`: http://developers.google.com/apps-script/add-ons
.. _`Google Apps`: http://google.com/a
.. _`Google Forms`: http://google.com/google-d-s/createforms.html
.. _`Google Form`: http://google.com/google-d-s/createforms.html
.. _`Google Sheets`: http://google.com/sheets/about
.. _`Google Sheet`: http://google.com/sheets/about
.. _`Google Docs`: http://google.com/docs/about
.. _`Google Doc`: http://google.com/docs/about
.. _`Google Drive`: http://drive.google.com
.. _`Google Drive`: http://drive.google.com
.. _`Flubaroo`: http://flubaroo.com
