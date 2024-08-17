export class Logger {
  static success(message: string, bold: boolean = false) {
    console.log('\x1b[32m', bold ? Logger.bold(message) : message);
  }

  static warning(message: string, bold: boolean = false) {
    console.log('\x1b[33m', bold ? Logger.bold(message) : message);
    process.exit(1);
  }

  static fail(message: string, bold: boolean = false) {
    console.log('\x1b[31m', bold ? Logger.bold(message) : message);
    process.exit(1);
  }

  private static bold(message: string): string {
    return `\x1b[1m${message}\x1b[0m`;
  }
}

// console.log('\x1b[31m', 'red');
// console.log('\x1b[32m', 'green');
// console.log('\x1b[33m', 'yellow');
// console.log('\x1b[34m', 'blue');
// console.log('\x1b[35m', 'magenta');
// console.log('\x1b[36m', 'cyan');
// console.log('\x1b[37m', 'white');
// console.log('\x1b[0m', 'Text default color');
// console.log('\x1b[31m\x1b[1m', 'this is bold red', '\x1b[0m');
// console.log('\x1b[4m\x1b[34m', 'this is underlined blue', '\x1b[0m');
