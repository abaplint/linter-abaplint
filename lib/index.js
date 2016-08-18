'use babel';

import * as abaplint from 'abaplint/build/bundle.js';

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

function buildConfig() {
  let def = abaplint.Config.getDefault().get().rules;
  
  let out = {};
  for (let rule in def) {
    out[rule] = {};
    out[rule].type = "boolean";
    out[rule].default = true;
  }
  
  return out;
}

let conf = buildConfig();

export default {
  activate() {
    require('atom-package-deps').install();
  },
  config: conf,
  provideLinter() {
    return {
      name: 'abaplint',
      grammarScopes: ['source.abp'],
      scope: 'file',
      lintOnFly: true,
      lint: linter,
    };
  },
};
