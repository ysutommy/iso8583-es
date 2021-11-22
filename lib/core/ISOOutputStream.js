import ISOUtil from './ISOUtil.js';
export default class ISOOutputStream {
    constructor(src) {
        this.len = 0;
        if (src === null || src === void 0 ? void 0 : src.length) {
            this.buf = src;
            this.len = src.length;
        }
        else {
            this.buf = new Uint8Array(1024);
        }
    }
    size() {
        return this.len;
    }
    bufSize() {
        return this.buf.length;
    }
    reset() {
        this.len = 0;
    }
    toByteArray(start = 0, len) {
        const count = len || this.len;
        return this.buf.slice(start, start + count);
    }
    newSize(size) {
        let nlen = this.buf.length * 2;
        if (nlen < size) {
            nlen = size;
        }
        const tempBuf = this.buf;
        this.buf = new Uint8Array(nlen);
        ISOUtil.arraycopy(tempBuf, 0, this.buf, 0, tempBuf.length);
    }
    write(b, start = 0, blen) {
        blen = blen || b.length;
        if (start + blen > b.length) {
            throw new Error("EOF");
        }
        if (this.len + blen > this.buf.length) {
            this.newSize(this.len + blen);
        }
        ISOUtil.arraycopy(b, start, this.buf, this.len, blen);
        this.len += blen;
    }
    writeByte(b) {
        const { buf, len } = this;
        if (buf.length < len + 1) {
            this.newSize(len + 1);
        }
        buf[this.len++] = b & 0xFF;
    }
    writeBcdLen_c(dataLen, varLen) {
        const n1 = dataLen % 10;
        if (varLen === 1) {
            this.writeByte(n1);
        }
        else {
            dataLen = Math.floor(dataLen / 10);
            const n2 = dataLen % 10;
            if (varLen === 2) {
                this.writeByte(n1 | (n2 << 4));
            }
            else if (varLen === 3) {
                dataLen = Math.floor(dataLen / 10);
                const n3 = dataLen % 10;
                this.writeByte(n3);
                this.writeByte(n1 | (n2 << 4));
            }
            else {
                throw new Error("error varLen: " + varLen);
            }
        }
    }
    writeBcdLen(dataLen, varLen) {
        const ds = ISOUtil.toFixed(dataLen, varLen);
        for (let i = 0; i < varLen; i++) {
            this.writeByte(ds.charCodeAt(i));
        }
    }
    writeASCII(s) {
        const len = s.length;
        for (let i = 0; i < len; i++) {
            this.writeByte(s.charCodeAt(i));
        }
    }
    writeBCD_c(s, fill = 0) {
        let len = s.length;
        const odd = (len & 1) !== 0;
        if (odd) {
            len--;
        }
        let i = 0;
        const getV = ISOUtil.getV;
        for (; i < len; i += 2) {
            this.writeByte((getV(s.charCodeAt(i)) << 4) | (getV(s.charCodeAt(i + 1))));
        }
        if (odd) {
            this.writeByte((getV(s.charCodeAt(i)) << 4) | fill);
        }
    }
    writeBeInt(n) {
        this.writeByte(n >> 24);
        this.writeByte(n >> 16);
        this.writeByte(n >> 8);
        this.writeByte(n >> 0);
    }
    replace(pos, newData) {
        ISOUtil.arraycopy(newData, 0, this.buf, pos, newData.length);
    }
}
