function log(fun: any, message: string, data?: any) {
  if (data !== undefined && data !== null) {
    fun(message, data);
  } else {
    fun(message);
  }
}

export function start(message: string) {
  console.log(`\x1b[36mStart: ${message}\x1b[0m`);
}

export function finish(message: string) {
  console.log(`\x1b[36mFinish: ${message}\x1b[0m`);
  console.log(`\x1b[36m${Array(100).fill('-').join('')}\x1b[0m`);
}

export function info(message: string, data?: any) {
  log(console.log, `\x1b[34m${message}\x1b[0m`, data);
}

export function success(message: string, data?: any) {
  log(console.log, `\x1b[32m${message}\x1b[0m`, data);
}

export function warn(message: string, data?: any) {
  log(console.log, `\x1b[33m${message}\x1b[0m`, data);
}

export function error(message: string, data?: any) {
  log(console.error, `\x1b[31m${message}\x1b[0m`, data);
}
