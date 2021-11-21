/**
 * 输入流封装类。带 _c 的方法均表示加密
 */
export default class ISOInputStream {
    private bs;
    private p;
    constructor(inputStream: Uint8Array);
    /**
     * 获取当前索引
     */
    getPos(): number;
    /**
     * 读取一个字节
     */
    readByte(): number;
    /**
     * 读取输入流到指定数组
     *
     * @param arr
     * @param start
     * @param count
     */
    read(arr: Uint8Array, start?: number, count?: number): void;
    /**
     * 读取指定字节数（数据被压缩），并转成Uint32返回
     *
     * @param len
     */
    readBcdInt_c(len: number): number;
    /**
     * 读取指定字节数（数据未被压缩），并转成Uint32返回
     *
     * @param len
     */
    readBcdInt(len: number): number;
    /**
     * 跳过指定字节数
     *
     * @param len
     */
    skip(len: number): void;
    /**
     * 读取指定字节长度的BCD字符串
     *
     * @param len
     */
    readBCD_c(len: number): String;
    /**
     * 读取指定字节数ASCII字符串
     *
     * @param len
     */
    readASCII(len: number): String;
}
