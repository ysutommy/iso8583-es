/**
 * 输出流封装类。带 _c 的方法均表示加密
 */
export default class ISOOutputStream {
    private buf;
    private len;
    constructor(src?: Uint8Array);
    /**
     * 输出流字节数
     */
    size(): number;
    /**
     * 缓冲区大小
     */
    bufSize(): number;
    /**
     * 重置输出流
     */
    reset(): void;
    /**
     *
     * @param start
     * @param len
     */
    toByteArray(start?: number, len?: number): Uint8Array;
    /**
     * 缓冲区扩容
     *
     * @param size
     */
    newSize(size: number): void;
    /**
     * 往输出流中写入数据
     *
     * @param b 写入的数据
     * @param start 数据起始索引
     * @param blen 数据长度
     */
    write(b: Uint8Array, start?: number, blen?: number): void;
    /**
     * 写入单个字节
     *
     * @param b
     */
    writeByte(b: number): void;
    /**
     * 写入长度BCD码（压缩）
     *
     * @param dataLen
     * @param varLen
     */
    writeBcdLen_c(dataLen: number, varLen: number): void;
    /**
     * 写入长度BCD码（不压缩）
     *
     * @param dataLen
     * @param varLen
     */
    writeBcdLen(dataLen: number, varLen: number): void;
    /**
     * 写入ASCII字符串
     *
     * @param s
     */
    writeASCII(s: String): void;
    /**
     * 写入BCD字符串
     *
     * @param s 字符串
     * @param fill 字符串尾部填充的数据（字符串长度为奇数时）
     */
    writeBCD_c(s: String, fill?: number): void;
    /**
     * 写入高位Uint32
     *
     * @param n
     */
    writeBeInt(n: number): void;
    /**
     * 数组替换
     *
     * @param pos
     * @param newData
     */
    replace(pos: number, newData: Uint8Array): void;
}
