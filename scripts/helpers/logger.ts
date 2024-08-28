const colors = require('colors');

colors.setTheme({
  start: ['bold', 'cyan'],
  title: ['bold', 'magenta'],
  description: ['brightBlue'],
  fail: ['brightRed'],
  warn: ['brightYellow'],
  done: ['brightGreen'],
  end: ['brightCyan'],
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
    Logger.breakline();
  }

  static title(text: string) {
    console.log(colors.title(text));
  }

  static description(text: string) {
    console.log(colors.description(text));
  }

  static fail(err: Error) {
    console.log(colors.fail(err.message));
    process.exit(1);
  }

  static warn(text: string) {
    console.log(colors.warn(text));
  }

  static done(text: string) {
    console.log(colors.done(text));
  }

  static end(text: string) {
    console.log(colors.end(text));
  }

  static breakline() {
    console.log();
  }
}
