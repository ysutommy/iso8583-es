import ISOUtil from './ISOUtil.js';
/**
 * 输入流封装类。带 _c 的方法均表示加密
 */
export default class ISOInputStream {
    constructor(inputStream) {
        // 字节流当前索引位置
        this._p = 0;
        this._bs = inputStream;
    }
    /**
     * 获取当前索引
     */
    getPos() {
        return this._p;
    }
    /**
     * 读取一个字节
     */
    readByte() {
        const { _p, _bs } = this;
        if (_p >= _bs.length) {
            throw new Error("EOF");
        }
        return _bs[this._p++] & 0xFF;
    }
    /**
     * 读取输入流到指定数组
     *
     * @param arr
     * @param start
     * @param count
     */
    read(arr, start = 0, count) {
        const { _p, _bs } = this;
        count = (count && count > 0) ? count : arr.length;
        if (_p + count > _bs.length) {
            throw new Error("EOF");
        }
        ISOUtil.arraycopy(_bs, _p, arr, start, count);
        this._p += count;
    }
    /**
     * 读取指定字节数（数据被压缩），并转成Uint32返回
     *
     * @param len
     */
    readBcdInt_c(len) {
        let r = 0;
        len = (len + 1) >> 1;
        for (let i = 0; i < len; i++) {
            let v = this.readByte();
            r *= 10;
            r += (v >> 4);
            r *= 10;
            r += (v & 0x0F);
        }
        return r;
    }
    /**
     * 读取指定字节数（数据未被压缩），并转成Uint32返回
     *
     * @param len
     */
    readBcdInt(len) {
        let r = 0;
        for (let i = 0; i < len; i++) {
            let v = this.readByte();
            r *= 10;
            r += v - 48;
        }
        return r;
    }
    /**
     * 跳过指定字节数
     *
     * @param len
     */
    skip(len) {
        if (this._p + len > this._bs.length) {
            throw new Error("EOF");
        }
        this._p += len;
    }
    /**
     * 读取指定字节长度的BCD字符串
     *
     * @param len
     */
    readBCD_c(len) {
        const odd = (len & 1) !== 0;
        if (odd) {
            len--;
        }
        let res = '';
        const CA = ISOUtil.CA;
        len /= 2;
        for (let i = 0; i < len; i++) {
            let v = this.readByte();
            res += CA[v >> 4];
            res += CA[v & 0x0F];
        }
        if (odd) {
            let v = this.readByte();
            res += CA[v >> 4];
        }
        return res;
    }
    /**
     * 读取指定字节数ASCII字符串
     *
     * @param len
     */
    readASCII(len) {
        const { _p, _bs } = this;
        if (_p + len > _bs.length) {
            throw new Error("EOF");
        }
        const codes = _bs.slice(_p, _p + len);
        this._p += len;
        return String.fromCharCode(...codes);
    }
}
