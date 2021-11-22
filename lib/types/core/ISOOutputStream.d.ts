export default class ISOOutputStream {
    private buf;
    private len;
    constructor(src?: Uint8Array);
    size(): number;
    bufSize(): number;
    reset(): void;
    toByteArray(start?: number, len?: number): Uint8Array;
    newSize(size: number): void;
    write(b: Uint8Array, start?: number, blen?: number): void;
    writeByte(b: number): void;
    writeBcdLen_c(dataLen: number, varLen: number): void;
    writeBcdLen(dataLen: number, varLen: number): void;
    writeASCII(s: String): void;
    writeBCD_c(s: String, fill?: number): void;
    writeBeInt(n: number): void;
    replace(pos: number, newData: Uint8Array): void;
}
