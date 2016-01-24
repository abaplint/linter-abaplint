'use babel';

import * as path from 'path';

describe('The htmlhint provider for Linter', () => {
  const lint = require(path.join('..', 'lib', 'index.js')).provideLinter().lint;

  beforeEach(() => {
    atom.workspace.destroyActivePaneItem();
    waitsForPromise(() => {
      return atom.packages.activatePackage('linter-abaplint').then(() => {
        return atom.packages.activatePackage('language-abap');
      });
    });
  });

  it('finds nothing wrong with a valid file (good.abap)', () => {
    waitsForPromise(() => {
      const good = path.join(__dirname, 'fixtures', 'good.abap');
      return atom.workspace.open(good).then(editor => {
        return lint(editor);
      }).then(messages => {
        expect(messages.length).toEqual(0);
      });
    });
  });
});
