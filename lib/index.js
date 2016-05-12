'use babel';

import File from 'abaplint/build/src/file';
import Runner from 'abaplint/build/src/runner';

export function activate() {
  require('atom-package-deps').install();
}

function linter(editor) {
//  const helpers = require('atom-linter');
//  var atom = require('atom');

  const text = editor.getText();
  const filePath = editor.getPath();

  const file = new File(filePath, text);
  Runner.run([file]);

  const issues = [];

  for (const error of file.get_issues()) {
    const range = [
      [error.getStart().getRow() - 1, error.getStart().getCol() - 1],
      [error.getEnd().getRow() - 1, error.getEnd().getCol() - 1],
    ];
//    const range = helpers.rangeFromLineNumber(editor, error.get_row() - 1, error.get_col() - 1);

    const issue = {
      type: 'Error',
      text: error.get_description(),
      filePath,
      range,
    };
    issues.push(issue);
  }

  return issues;
}

export function provideLinter() {
  return {
    name: 'abaplint',
    grammarScopes: ['source.abp'],
    scope: 'file',
    lintOnFly: true,
    lint: linter,
  };
}
