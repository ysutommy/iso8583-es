import ISOUtil from './ISOUtil.js'

/**
 * 输入流封装类。带 _c 的方法均表示加密
 */
export default class ISOInputStream {
	private bs: Uint8Array;
	private p: number = 0;

	constructor(inputStream: Uint8Array) {
		this.bs = inputStream
	}

	/**
	 * 获取当前索引
	 */
	getPos(): number {
		return this.p;
	}

	/**
	 * 读取一个字节
	 */
	readByte(): number {
		const {p, bs} = this;
		if (p >= bs.length) {
			throw new Error("EOF");
		}
		return bs[this.p++] & 0xFF;
	}

	/**
	 * 读取输入流到指定数组
	 *
	 * @param arr
	 * @param start
	 * @param count
	 */
	read(arr: Uint8Array, start: number = 0, count?: number): void {
		const {p, bs} = this
		count = (count && count > 0) ? count : arr.length;
		if (p + count > bs.length) {
			throw new Error("EOF");
		}
		ISOUtil.arraycopy(bs, p, arr, start, count);
		this.p += count;
	}

	/**
	 * 读取指定字节数（数据被压缩），并转成Uint32返回
	 *
	 * @param len
	 */
	readBcdInt_c(len: number): number {
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
	readBcdInt(len: number): number {
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
	skip(len: number): void {
		if (this.p + len > this.bs.length) {
			throw new Error("EOF");
		}
		this.p += len;
	}

	/**
	 * 读取指定字节长度的BCD字符串
	 *
	 * @param len
	 */
	readBCD_c(len: number): String {
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
	readASCII(len: number): String {
		const {p, bs} = this
		if (p + len > bs.length) {
			throw new Error("EOF");
		}

		const codes = bs.slice(p, p + len);
		this.p += len;

		return String.fromCharCode(...codes);
	}

}
