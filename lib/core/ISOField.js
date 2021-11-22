export default class ISOField {
    constructor(fieldInfo, compress = true) {
        this.compress = compress;
        const i = fieldInfo.indexOf(':');
        this.index = parseInt(fieldInfo.substring(0, i));
        const ss = fieldInfo.substring(i + 1).split(",");
        this.name = ss[0];
        let s = ss[1];
        if (s.startsWith("LLLVAR-")) {
            this.varLen = 3;
            s = s.substring(7);
        }
        else if (s.startsWith("LLVAR-")) {
            this.varLen = 2;
            s = s.substring(6);
        }
        else if (s.startsWith("LVAR-")) {
            this.varLen = 1;
            s = s.substring(5);
        }
        else {
            this.varLen = 0;
        }
        if (s.startsWith("ANS")) {
            this.type = 'S';
            s = s.substring(3);
        }
        else if (s.startsWith("AN")) {
            this.type = 'A';
            s = s.substring(2);
        }
        else if (s.startsWith("N")) {
            this.type = 'N';
            s = s.substring(1);
        }
        else if (s.startsWith("B")) {
            this.type = 'B';
            s = s.substring(1);
        }
        else if (s.startsWith("E")) {
            this.type = 'E';
            s = s.substring(1);
        }
        else {
            throw new Error("type error: " + s);
        }
        this.maxLen = parseInt(s);
        if (this.type === 'B') {
            this.maxLen /= 8;
            if (this.compress) {
                this.maxLen *= 2;
            }
        }
    }
    encode(s, ios) {
        const { type, maxLen, compress, varLen, index } = this;
        if (type === 'E') {
            throw new Error("不支持的类型:" + index);
        }
        const slen = s.length;
        const need = maxLen - slen;
        if (need < 0) {
            throw new Error(`数据太长: ${slen} > ${maxLen}，field ${index}: ${s}`);
        }
        if (compress) {
            if (varLen > 0) {
                ios.writeBcdLen_c(slen, varLen);
                if (type === 'N') {
                    ios.writeBCD_c(s);
                }
                else {
                    ios.writeASCII(s);
                }
            }
            else {
                if (type === 'N') {
                    if (need > 0) {
                        s = ISOField.ZS.substring(0, need) + s;
                    }
                    ios.writeBCD_c(s);
                }
                else if (type === 'B') {
                    if (need != 0) {
                        throw new Error(index + "域长度异常");
                    }
                    ios.writeBCD_c(s);
                }
                else {
                    if (need > 0) {
                        s += ISOField.ES.substring(0, need);
                    }
                    ios.writeASCII(s);
                }
            }
        }
        else {
            if (varLen > 0) {
                ios.writeBcdLen(slen, varLen);
                ios.writeASCII(s);
            }
            else {
                if (type === 'N') {
                    if (need > 0) {
                        s = ISOField.ZS.substring(0, need) + s;
                    }
                    ios.writeASCII(s);
                }
                else if (type === 'B') {
                    if (need != 0) {
                        throw new Error(index + "域长度异常");
                    }
                    ios.writeASCII(s);
                }
                else {
                    if (need > 0) {
                        s += ISOField.ES.substring(0, need);
                    }
                    ios.writeASCII(s);
                }
            }
        }
    }
    decode(iis) {
        const { type, compress, varLen, maxLen, index } = this;
        if (type === 'E') {
            throw new Error("不支持的类型: " + index);
        }
        if (compress) {
            if (varLen > 0) {
                const len = iis.readBcdInt_c(varLen);
                if (len > maxLen) {
                    throw new Error(index + "域长度太长: " + len + ">" + maxLen);
                }
                if (type === 'N') {
                    return iis.readBCD_c(len);
                }
                else {
                    return iis.readASCII(len);
                }
            }
            else {
                if (type === 'N') {
                    return iis.readBCD_c(maxLen);
                }
                else if (type === 'B') {
                    return iis.readBCD_c(maxLen);
                }
                else {
                    return iis.readASCII(maxLen);
                }
            }
        }
        else {
            if (varLen > 0) {
                const len = iis.readBcdInt(varLen);
                if (len > maxLen) {
                    throw new Error(index + "域长度太长: " + len + ">" + maxLen);
                }
                return iis.readASCII(len);
            }
            else {
                return iis.readASCII(maxLen);
            }
        }
    }
    static makeFields(fieldDefinition, compress) {
        const fields = new Array(129);
        const ss = fieldDefinition.split(";");
        for (let s of ss) {
            const f = new ISOField(s, compress);
            fields[f.index] = f;
        }
        for (let i = 0; i < fields.length; i++) {
            if (!fields[i]) {
                fields[i] = new ISOField(i + ":未定义,E1", compress);
            }
        }
        return fields;
    }
}
ISOField.ZS = "0000000000000000000000000000000000000000";
ISOField.ES = "                                        ";
