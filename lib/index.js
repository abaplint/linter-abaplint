'use babel';

import * as abaplint from 'abaplint/build/bundle.js';

export function activate() {
  require('atom-package-deps').install();
}

function linter(editor) {
  const text = editor.getText();
  const filePath = editor.getPath();

  const file = new abaplint.File(filePath, text);
  abaplint.Runner.run([file]);

  const issues = [];

  for (const error of file.getIssues()) {
    const range = [
      [error.getStart().getRow() - 1, error.getStart().getCol() - 1],
      [error.getEnd().getRow() - 1, error.getEnd().getCol() - 1],
    ];

    const issue = {
      type: 'Error',
      text: error.getDescription(),
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
