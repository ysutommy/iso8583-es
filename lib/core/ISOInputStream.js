import ISOUtil from './ISOUtil.js';
export default class ISOInputStream {
    constructor(inputStream) {
        this.p = 0;
        this.bs = inputStream;
    }
    getPos() {
        return this.p;
    }
    readByte() {
        const { p, bs } = this;
        if (p >= bs.length) {
            throw new Error("EOF");
        }
        return bs[this.p++] & 0xFF;
    }
    read(arr, start = 0, count) {
        const { p, bs } = this;
        count = (count && count > 0) ? count : arr.length;
        if (p + count > bs.length) {
            throw new Error("EOF");
        }
        ISOUtil.arraycopy(bs, p, arr, start, count);
        this.p += count;
    }
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
    readBcdInt(len) {
        let r = 0;
        for (let i = 0; i < len; i++) {
            let v = this.readByte();
            r *= 10;
            r += v - 48;
        }
        return r;
    }
    skip(len) {
        if (this.p + len > this.bs.length) {
            throw new Error("EOF");
        }
        this.p += len;
    }
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
    readASCII(len) {
        const { p, bs } = this;
        if (p + len > bs.length) {
            throw new Error("EOF");
        }
        const codes = bs.slice(p, p + len);
        this.p += len;
        return String.fromCharCode(...codes);
    }
}
