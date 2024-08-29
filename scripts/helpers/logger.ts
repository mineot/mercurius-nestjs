const colors = require('colors');

colors.setTheme({
  start: ['bold', 'cyan'],
  finish: ['bold', 'cyan'],
  fail: ['brightRed'],
  warning: ['brightYellow'],
  success: ['brightGreen'],
});

export class Logger {
  static start(text: string) {
    console.log(colors.start(`Start: ${text}`));
  }

  static finish(text: string) {
    console.log(colors.finish(`Finish: ${text}`));
  }

  static fail(err: Error) {
    console.log(colors.fail(err.message));
    process.exit(1);
  }

  static warn(text: string) {
    console.log(colors.warning(text));
    process.exit(1);
  }

  static success(text: string) {
    console.log(colors.success(text));
  }

  static breakline() {
    console.log();
  }
}
