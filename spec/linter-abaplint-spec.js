'use babel';

import * as path from 'path';

describe('The abaplint provider for Linter', () => {
  const lint = require(path.join('..', 'lib', 'index.js')).provideLinter().lint;

  beforeEach(() => {
    atom.workspace.destroyActivePaneItem();
    waitsForPromise(() => {
      return atom.packages.activatePackage('linter-abaplint');
    });
  });

  it('detects no issues in good.abap)', () => {
    waitsForPromise(() => {
      const good = path.join(__dirname, 'fixtures', 'good.abap');
      return atom.workspace.open(good).then(editor => {
        return lint(editor);
      }).then(messages => {
        expect(messages.length).toEqual(0);
      });
    });
  });

  it('detects error in bad.abap', () => {
    waitsForPromise(() => {
      const bad = path.join(__dirname, 'fixtures', 'bad.abap');
      return atom.workspace.open(bad).then(editor => {
        return lint(editor);
      }).then(messages => {
        expect(messages.length).toBeGreaterThan(0);
      });
    });
  });
});
