import ISOUtil from './ISOUtil.js'

/**
 * 输出流封装类。带 _c 的方法均表示加密
 */
export default class ISOOutputStream {
	private buf: Uint8Array;
	private len: number = 0;

	constructor(src?: Uint8Array) {
		if (src?.length) {
			this.buf = src;
			this.len = src.length;
		} else {
			this.buf = new Uint8Array(1024);
		}
	}

	/**
	 * 输出流字节数
	 */
	size(): number {
		return this.len;
	}

	/**
	 * 缓冲区大小
	 */
	bufSize(): number {
		return this.buf.length;
	}

	/**
	 * 重置输出流
	 */
	reset(): void {
		this.len = 0;
	}

	/**
	 *
	 * @param start
	 * @param len
	 */
	toByteArray(start: number = 0, len?: number): Uint8Array {
		const count = len || this.len;
		return this.buf.slice(start, start + count);
	}

	/**
	 * 缓冲区扩容
	 *
	 * @param size
	 */
	newSize(size: number): void {
		let nlen = this.buf.length * 2;
		if (nlen < size) {
			nlen = size
		}

		const tempBuf = this.buf;
		this.buf = new Uint8Array(nlen);
		ISOUtil.arraycopy(tempBuf, 0, this.buf, 0, tempBuf.length);
	}

	/**
	 * 往输出流中写入数据
	 *
	 * @param b 写入的数据
	 * @param start 数据起始索引
	 * @param blen 数据长度
	 */
	write(b: Uint8Array, start: number = 0, blen?: number): void {
		blen = blen || b.length;
		if (start + blen > b.length) {
			throw new Error("EOF");
		}
		if (this.len + blen > this.buf.length) {
			this.newSize(this.len + blen);
		}
		ISOUtil.arraycopy(b, start, this.buf, this.len, blen);
		this.len += blen
	}

	/**
	 * 写入单个字节
	 *
	 * @param b
	 */
	writeByte(b: number): void {
		const { buf, len } = this;
		if (buf.length < len + 1) {
			this.newSize(len + 1);
		}
		buf[this.len++] = b & 0xFF;
	}

	/**
	 * 写入长度BCD码（压缩）
	 *
	 * @param dataLen
	 * @param varLen
	 */
	writeBcdLen_c(dataLen: number, varLen: number): void {
		const n1 = dataLen % 10;
		if (varLen === 1) {
			this.writeByte(n1);
		} else {
			dataLen = Math.floor(dataLen / 10);
			const n2 = dataLen % 10;
			if (varLen === 2) {
				this.writeByte(n1 | (n2 << 4));
			} else if (varLen === 3) {
				dataLen = Math.floor(dataLen / 10);
				const n3 = dataLen % 10;
				this.writeByte(n3);
				this.writeByte(n1 | (n2 << 4));
			} else {
				throw new Error("error varLen: " + varLen);
			}
		}
	}

	/**
	 * 写入长度BCD码（不压缩）
	 *
	 * @param dataLen
	 * @param varLen
	 */
	writeBcdLen(dataLen: number, varLen: number): void {
		const ds = ISOUtil.toFixed(dataLen, varLen);
		for (let i = 0; i < varLen; i++) {
			this.writeByte(ds.charCodeAt(i));
		}
	}

	/**
	 * 写入ASCII字符串
	 *
	 * @param s
	 */
	writeASCII(s: String): void {
		const len = s.length;
		for (let i = 0; i < len; i++) {
			this.writeByte(s.charCodeAt(i));
		}
	}

	/**
	 * 写入BCD字符串
	 *
	 * @param s 字符串
	 * @param fill 字符串尾部填充的数据（字符串长度为奇数时）
	 */
	writeBCD_c(s: String, fill: number = 0): void {
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

	/**
	 * 写入高位Uint32
	 *
	 * @param n
	 */
	writeBeInt(n: number): void {
		this.writeByte(n >> 24);
		this.writeByte(n >> 16);
		this.writeByte(n >> 8);
		this.writeByte(n >> 0);
	}

	/**
	 * 数组替换
	 *
	 * @param pos
	 * @param newData
	 */
	replace(pos: number, newData: Uint8Array): void {
		ISOUtil.arraycopy(newData, 0, this.buf, pos, newData.length);
	}

}
