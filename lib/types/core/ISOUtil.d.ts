export default class ISOUtil {
    static CA: string[];
    static arraycopy(src: Uint8Array, srcStart: number, dest: Uint8Array, destStart: number, length: number): void;
    static copyOf(arr: Uint8Array, newLen: number): Uint8Array;
    static fill(arr: Array<any>, fill: any): void;
    static toFixed(num: number, len: number): String;
    static getV(c: number): number;
    static toBCD(s: String, len?: number): Uint8Array;
    static toHBU8Array(n: number): Uint8Array;
    static toLBU8Array(n: number): Uint8Array;
    static isChars(s: String): Boolean;
    xor(bs1: Uint8Array, bs2: Uint8Array): void;
    byte2string(bs: Uint8Array): String;
    static string2byte(s: String): Uint8Array;
}
