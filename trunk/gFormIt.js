
function onOpen(e) {
    /* Script is present where it hasn't been used yet (added
        as an Add-On in a different Doc where it *was* used). */
    if (e && e.authMode == ScriptApp.AuthMode.NONE) {} else { _createMenu(); }
}

function _createMenu() {
    DocumentApp.getUi()
        .createAddonMenu()
        .addItem('Generate Form', 'docCreateForm')
        .addSeparator()
        .addItem('About GFormIt', 'aboutGFormIt')
        .addToUi();
}

function onInstall(e) {
    onOpen(e);
}

function onEnable(e) {
    onOpen(e);
}

function aboutGFormIt() {
    DocumentApp.getUi().alert("\
        GFormIt is a time-saving Google Docs Add-on that allows teachers \
        to quickly and automatically create assessments (exams, quizzes, \
        assignments, etc.) as Google Forms based on raw question-and-answer \
        data organized in Google Docs, including submission of the answers \
        as the first response in the connected Google Sheet. Such 'answer \
        keys' lead to the option of using Flubaroo, another useful teachers \
        tool that grades assessments submitted to Google Sheets. To learn \
        more about GFormIt or Flubaroo, visit http://edcode.org. Send \
        feedback or ideas to wesc@edcode.org.");
}

function createForm(values, type) {
    if (type == "sheet") {
        var qt = SpreadsheetApp.getActiveSpreadsheet().getName();
    } else {
        var qt = DocumentApp.getActiveDocument().getName();
    }

    var form = FormApp.create(qt).setTitle(qt);
    var ss = SpreadsheetApp.create(qt + " RESPONSES");
    form.setDestination(FormApp.DestinationType.SPREADSHEET, ss.getId());
    var frsp = form.createResponse();

    for (var i in values) {
        len = (type == "sheet" ? values[i].indexOf("") : values[i].length);
        var qq = values[i][0];
        if (qq == null || qq[0] == "" || qq[0] == "#") {
            continue;
        }

        if (len == 1) {
            form.addParagraphTextItem().setTitle(qq);
        } else if (len == 2) {
            var answer = values[i][1];
            var item = form.addTextItem().setTitle(qq);
            frsp.withItemResponse(item.createResponse(answer));
        }
    }

    frsp.submit();
    ss.deleteSheet(ss.getSheetByName('Sheet1'));
    if (type == "sheet") {
        ui = SpreadsheetApp.getUi();
    } else {
        ui = DocumentApp.getUi();
    }
    ui.alert("GFormIt has created a Google Form called '" + qt + "' \
             and a Google Sheet to hold its responses called '" +
             qt + " RESPONSES'... you'll find both in your Google \
             Drive folder now. If you provided answers to any \
             of your questions, they will have been submitted \
             as the first 'answer' (Form response) for your quiz.");
}

function docCreateForm() {
    var doc = DocumentApp.getActiveDocument();
    var text = doc.getBody().getText();
    var lines = text.split(/[\n\r]/);
    var body = [];
    var row = [];

    for (var line in lines) {
        if (lines[line] == "") {
            body.push(row);
            row = [];
        } else {
            row.push(lines[line].trim());
        }
    }

    body.push(row);
    createForm(body, "doc");
}
