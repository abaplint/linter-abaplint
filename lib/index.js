'use babel';

import File from 'abaplint/src/file';
import Runner from 'abaplint/src/runner';

export function activate() {
  require('atom-package-deps').install();
}

export function provideLinter() {
  const helpers = require('atom-linter');
  return {
    name: 'abaplint',
    grammarScopes: ['source.abp'],
    scope: 'file',
    lintOnFly: true,
    lint: editor => {
      const text = editor.getText();
      const filePath = editor.getPath();

      const file = new File(filePath, text);
      Runner.run([file]);

      const issues = [];

      for (const error of file.get_issues()) {
        const range = helpers.rangeFromLineNumber(editor, error.get_row() - 1, error.get_col() - 1);

        const issue = {
          type: 'Error',
          text: error.get_description(),
          filePath,
          range
        };
        issues.push(issue);
      }

      return issues;
    }
  };
}
