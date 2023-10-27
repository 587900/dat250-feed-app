'use strict';

type OutputStream = (v : any) => any;

const enum Colors {
    Black = '\u001b[30m',
    Red = '\u001b[31m',
    Green = '\u001b[32m',
    Yellow = '\u001b[33m',
    Blue = '\u001b[34m',
    Magenta = '\u001b[35m',
    Cyan = '\u001b[36m',
    White = '\u001b[37m',
    Reset = '\u001b[0m',
    BrightBlack = '\u001b[30;1m',
    BrightRed = '\u001b[31;1m',
    BrightGreen = '\u001b[32;1m',
    BrightYellow = '\u001b[33;1m',
    BrightBlue = '\u001b[34;1m',
    BrightMagenta = '\u001b[35;1m',
    BrightCyan = '\u001b[36;1m',
    BrightWhite = '\u001b[37;1m'
}

export default class Logger {

    private outputStream : OutputStream;
    private name : string;

    constructor(outputStream : OutputStream, name : string) {
        this.outputStream = outputStream;
        this.name = name;
    }

    public static getLogger(name : string) {
        return new Logger(console.log, name);
    }

    private output(prefix : string, type : string, message: string) {
        this.outputStream(`${prefix}[${new Date().toLocaleString()}][${type}][${this.name}]: ${message}${Colors.Reset}`);
    }

    public debug(message : any) {
        this.output(Colors.Magenta, 'DEBUG', message);
    }

    public info(message : any) {
        this.output(Colors.BrightWhite, 'INFO', message);
    }

    public warn(message : any) {
        this.output(Colors.Yellow, 'WARN', message);
    }

    public error(message : any) {
        this.output(Colors.Red, 'ERROR', message);
    }

}