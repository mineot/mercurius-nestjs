const colors = require('colors');

colors.setTheme({
  start: ['bold', 'cyan'],
  title: ['bold', 'magenta'],
  fail: ['brightRed'],
  warn: ['brightYellow'],
  ok: ['brightGreen'],
  finish: ['bold', 'cyan'],
});

const lines = Array(100).fill('-').join('');
const equals = Array(100).fill('=').join('');

export class Logger {
  static start(text: string) {
    console.log(colors.start(`Start: ${text}`));
    console.log(colors.start(lines));
  }

  static finish(text: string) {
    console.log(colors.finish(lines));
    console.log(colors.finish(`Finish: ${text}`));
    console.log(colors.finish(equals));
  }

  static title(text: string) {
    console.log(colors.title(text));
  }

  static fail(err: Error) {
    console.log(colors.fail(err.message));
    process.exit(1);
  }

  static warn(text: string) {
    console.log(colors.warn(text));
  }

  static done(text: string) {
    console.log(colors.ok(text));
  }

  static breakline() {
    console.log();
  }
}
