export default class ISOInputStream {
    private bs;
    private p;
    constructor(inputStream: Uint8Array);
    getPos(): number;
    readByte(): number;
    read(arr: Uint8Array, start?: number, count?: number): void;
    readBcdInt_c(len: number): number;
    readBcdInt(len: number): number;
    skip(len: number): void;
    readBCD_c(len: number): String;
    readASCII(len: number): String;
}
