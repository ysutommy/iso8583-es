export default class ISOUtil {

	/**
	 * 十六进制字符数组
	 */
	public static CA = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];

	/**
	 * 数组复制
	 *
	 * @param src 源数组
	 * @param srcStart 源数组起始索引
	 * @param dest 目标数组
	 * @param destStart 目标数组起始索引
	 * @param length 复制的长度
	 */
	public static arraycopy(
		src: Uint8Array,
		srcStart: number,
		dest: Uint8Array,
		destStart: number,
		length: number): void {

		const end = destStart + length;
		let i = destStart;
		while (i < end) {
			dest[i++] = src[srcStart++]
		}
	}

	/**
	 * 复制原数组的数据，并得到一个长度为newLen的新数组
	 *
	 * @param arr
	 * @param newLen
	 */
	public static copyOf(arr: Uint8Array, newLen: number): Uint8Array {
		if (newLen <= arr.length) {
			return arr.slice(0, newLen);
		} else {
			const newArr = new Uint8Array(newLen);
			ISOUtil.arraycopy(arr, 0, newArr, 0, arr.length);
			return newArr;
		}
	}

	/**
	 * 填充数组
	 *
	 * @param arr
	 * @param fill
	 */
	public static fill(arr: Array<any>, fill: any) {
		let i = arr.length;
		while (--i >= 0) {
			arr[i] = fill
		}
	}

	/**
	 * 数字转指定长度的字符串（不超过7位）
	 *
	 * @param num 数字
	 * @param len 长度
	 */
	public static toFixed(num: number, len: number): String {
		const s = (10000000 + num).toString()
		return s.substring(s.length - len);
	}

	/**
	 * 获取十六进制字符对应的十进制数
	 *
	 * @param c
	 */
	public static getV(c: number): number {
		if (c >= 48 && c <= 57) {
			return c - 48;
		}
		if (c >= 65 && c <= 70) {
			return c - 55;
		}
		if (c >= 97 && c <= 102) {
			return c - 87;
		}
		return 0;
	}

	/**
	 * 字符串转BCD码
	 *
	 * @param s
	 * @param len
	 */
	public static toBCD(s: String, len?: number): Uint8Array {
		len = len || s.length;
		const rs = new Uint8Array((len + 1) >> 1);
		const slen = s.length;
		const rslen = rs.length * 2;
		const getV = ISOUtil.getV;
		let i = 0;
		for (; i < slen; i++) {
			const c = getV(s.charCodeAt(i));
			if (i < len) {
				if ((i & 1) === 0) {
					rs[i >> 1] |= (c << 4);
				} else {
					rs[i >> 1] |= c;
				}
			}
		}
		for (; i < rslen; i++) {
			if ((i & 1) === 0) {
				rs[i >> 1] |= 0xF0;
			} else {
				rs[i >> 1] |= 0x0F;
			}
		}
		return rs;
	}

	/**
	 * 数字转高八位数组
	 *
	 * @param n
	 */
	public static toHBU8Array(n: number): Uint8Array {
		const rs = new Uint8Array(2)
		rs[0] = (n >> 8) & 0xFF;
		rs[1] = (n >> 0) & 0xFF;
		return rs;
	}

	/**
	 * 数字转低八位数组
	 *
	 * @param n
	 */
	public static toLBU8Array(n: number): Uint8Array {
		const rs = new Uint8Array(2)
		rs[0] = (n >> 0) & 0xFF;
		rs[1] = (n >> 8) & 0xFF;
		return rs;
	}

	/**
	 *
	 * @param s
	 */
	public static isChars(s: String): Boolean {
		const len = s?.length || 0;
		const empCode = ' '.charCodeAt(0);
		let i = 0;
		while (i < len) {
			let c = s.charCodeAt(i++);
			if (c < empCode) {
				return false;
			}
		}
		return true;
	}

	/**
	 * 字节数组异或
	 *
	 * @param bs1
	 * @param bs2
	 */
	xor(bs1: Uint8Array, bs2: Uint8Array) {
		if (bs1.length != bs2.length) {
			throw new Error("数组长度不一致");
		}
		const len = bs1.length;
		for (let i = 0; i < len; i++) {
			bs1[i] ^= bs2[i];
		}
	}

	/**
	 * 字节数组转字符串
	 *
	 * @param bs
	 */
	byte2string(bs: Uint8Array): String {
		return String.fromCharCode(...bs);
	}

	/**
	 * 字符串转字节数组
	 *
	 * @param s
	 */
	public static string2byte(s: String): Uint8Array {
		const length = s?.length || 0;
		const array = new Uint8Array(length);
		for (let p = 0; p < length; p++) {
			array[p] = s.charCodeAt(p) & 0xFF;
		}
		return array;
	}

}
