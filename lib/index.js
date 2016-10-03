'use babel';
/*global atom*/
import * as abaplint from 'abaplint/build/bundle.js';

function linter(editor) {
  const text = editor.getText();
  const filePath = editor.getPath();

  const file = new abaplint.File(filePath, text);

  const def = abaplint.Config.getDefault().get();
  for (const rule in def.rules) {
    if (def.rules[rule]) {
      def.rules[rule].enabled = atom.config.get('linter-abaplint.' + rule);
    }
  }

  const conf = new abaplint.Config(JSON.stringify(def));

  const found = abaplint.Runner.run([file], conf);

  const issues = [];

  for (const error of found) {
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
  const def = abaplint.Config.getDefault().get().rules;

  const out = {};
  for (const rule in def) {
    if (def[rule]) {
      out[rule] = {};
      out[rule].type = 'boolean';
      out[rule].default = true;
    }
  }

  return out;
}

const conf = buildConfig();

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
