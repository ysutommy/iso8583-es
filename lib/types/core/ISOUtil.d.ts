export default class ISOUtil {
    /**
     * 十六进制字符数组
     */
    static CA: string[];
    /**
     * 数组复制
     *
     * @param src 源数组
     * @param srcStart 源数组起始索引
     * @param dest 目标数组
     * @param destStart 目标数组起始索引
     * @param length 复制的长度
     */
    static arraycopy(src: Uint8Array, srcStart: number, dest: Uint8Array, destStart: number, length: number): void;
    /**
     * 复制原数组的数据，并得到一个长度为newLen的新数组
     *
     * @param arr
     * @param newLen
     */
    static copyOf(arr: Uint8Array, newLen: number): Uint8Array;
    /**
     * 填充数组
     *
     * @param arr
     * @param fill
     */
    static fill(arr: Array<any>, fill: any): void;
    /**
     * 数字转指定长度的字符串（不超过7位）
     *
     * @param num 数字
     * @param len 长度
     */
    static toFixed(num: number, len: number): String;
    /**
     * 获取十六进制字符对应的十进制数
     *
     * @param c
     */
    static getV(c: number): number;
    /**
     * 字符串转BCD码
     *
     * @param s
     * @param len
     */
    static toBCD(s: String, len?: number): Uint8Array;
    /**
     * 数字转高八位数组
     *
     * @param n
     */
    static toHBU8Array(n: number): Uint8Array;
    /**
     * 数字转低八位数组
     *
     * @param n
     */
    static toLBU8Array(n: number): Uint8Array;
    /**
     *
     * @param s
     */
    static isChars(s: String): Boolean;
    /**
     * 字节数组异或
     *
     * @param bs1
     * @param bs2
     */
    xor(bs1: Uint8Array, bs2: Uint8Array): void;
    /**
     * 字节数组转字符串
     *
     * @param bs
     */
    byte2string(bs: Uint8Array): String;
    /**
     * 字符串转字节数组
     *
     * @param s
     */
    static string2byte(s: String): Uint8Array;
}
