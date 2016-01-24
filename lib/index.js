'use babel';

import * as abaplint from 'abaplint';

export function provideLinter() {
  return {
    name: 'abaplint',
    grammarScopes: ['source.abap'],
    scope: 'file',
    lintOnFly: true,
    lint: editor => {
      const text = editor.getText();
      const filePath = editor.getPath();
    }
  };
}
