function whatIs() {
  var app = UiApp.createApplication().setHeight(550);
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var panel = app.createVerticalPanel();
  var muleGrid = app.createGrid(1, 2);
  var image = app.createImage(this.MULEICONURL);
  image.setHeight("100px");
  var label = app.createLabel("formMule: A flexible, automated, Google-forms-driven emailer and calendaring work animal");
  label.setStyleAttribute('fontSize', '1.5em').setStyleAttribute('fontWeight', 'bold');
  muleGrid.setWidget(0, 0, image);
  muleGrid.setWidget(0, 1, label);
  var mainGrid = app.createGrid(4, 1);
  var html = "<h3>Features</h3>";
      html += "<ul><li>Easily set up and generate templated, merged emails from Google form or spreadsheet data.</li>";
      html += "<li>Set send conditions for up to three different emails based on column values.  Allows for branching logic based on value of form responses.</li>";
      html += "<li>Can be triggered on form submit or manually.</li>"; 
      html += "<li>Can be set to auto-copy-down formula columns that operate on form data.  Great for use with VLOOKUP and IF formulas that reference form data.  For example, look up an email address in another sheet based on a name submitted in the form.</li>"; 
      html += "<li>Auto-generate calendar events using form or spreadsheet data.</li>";
      html += "<li>Develop a workflow template and package it for easy distribution to non-technical end-users.</li>";
    
  mainGrid.setWidget(0, 0, app.createHTML(html));
  var sponsorLabel = app.createLabel("Brought to you by");
  var sponsorImage = app.createImage("http://www.youpd.org/sites/default/files/acquia_commons_logo36.png");
  var supportLink = app.createAnchor('Watch the tutorial!', 'http://www.youpd.org/formmule');
  mainGrid.setWidget(1, 0, sponsorLabel);
  mainGrid.setWidget(2, 0, sponsorImage);
  mainGrid.setWidget(3, 0, supportLink);
  app.add(muleGrid);
  panel.add(mainGrid);
  app.add(panel);
  ss.show(app);
  return app;                                                                    
}