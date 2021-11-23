import System from './ISOUtil.js';
export default class HEX {
    /**
     * 十六进制转Uint8Array
     *
     * @param hex
     */
    static hex2Bytes(hex) {
        const length = hex === null || hex === void 0 ? void 0 : hex.length;
        if (!length || (length & 1) === 1) {
            throw new Error(`Invalid param 'hex' value: ${hex}`);
        }
        hex = hex.toUpperCase();
        const arrLen = length >> 1;
        const byteArr = new Uint8Array(arrLen);
        let charCode = 0, bv = 0, hexI = 0;
        for (let i = 0; i < arrLen; i++) {
            charCode = hex.charCodeAt(hexI++);
            if (charCode <= 57) { // '9'
                bv = charCode - 48; // '0'
            }
            else {
                bv = charCode - 55; // -65 + 10
            }
            bv <<= 4;
            charCode = hex.charCodeAt(hexI++);
            if (charCode <= 57) {
                bv |= charCode - 48;
            }
            else {
                bv |= charCode - 55;
            }
            byteArr[i] = bv;
        }
        return byteArr;
    }
    /**
     * Uint8Array转十六进制
     *
     * @param array
     */
    static byte2Hex(array) {
        if (!(array === null || array === void 0 ? void 0 : array.length)) {
            throw new Error('param is empty!');
        }
        let hex = '', i = 0, b;
        const CA = System.CA;
        const length = array.length;
        do {
            b = array[i];
            hex += CA[((b >> 4) & 0x0F)] + CA[(b & 0x0F)];
        } while (++i < length);
        return hex;
    }
}
