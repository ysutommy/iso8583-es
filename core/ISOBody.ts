import ISOField from "./ISOField.js";
import ISOInputStream from "./ISOInputStream.js";
import ISOUtil from "./ISOUtil.js";
import HEX from "./HEX.js";
import ISOOutputStream from "./ISOOutputStream.js";

/**
 * 报文体封装类
 */
export default class ISOBody {
	private static DS = new Array<String>(128);
	// 报文类型
	private type: String;
	// 域信息
	private readonly items: Array<ISOField>;

	constructor(items: Array<ISOField>, type: String = '0200') {
		this.items = items;
		this.type = type;
	}

	/**
	 * 设置域信息
	 *
	 * @param index 域索引
	 * @param info 域信息
	 */
	setField(index: number, info: String) {
		ISOBody.DS[index - 1] = info;
	}

	/**
	 * 获取指定域信息
	 *
	 * @param index
	 */
	getField(index: number) {
		return ISOBody.DS[index - 1];
	}

	/**
	 * 设置报文体类型，即交易类型
	 *
	 * @param type
	 */
	setType(type: String) {
		this.type = type;
	}

	/**
	 * 解码
	 *
	 * @param iis
	 */
	decode(iis: ISOInputStream): void {
		const { items } = this
		if (items[2].compress) {
			this.type = iis.readBCD_c(4);
		} else {
			this.type = iis.readASCII(4);
		}
		const ds = ISOBody.DS;
		ISOUtil.fill(ds, null);

		const ms = new Uint8Array(16);
		ms.fill(0)

		iis.read(ms, 0, 8);
		let is128 = false;
		if ((ms[0] & (1 << 7)) !== 0) {
			iis.read(ms, 8, 8);
			is128 = true;
		}
		const len = is128 ? 128 : 64;
		for (let i = 1; i < len; i++) {
			if ((ms[i >>> 3] & (1 << (7 - (i & 7)))) !== 0) {
				try {
					ds[i] = items[i + 1].decode(iis);
				} catch (e: any) {
					throw new Error(e?.message + " in read[" + (i + 1) + "]");
				}
			}
		}
	}

	/**
	 * 报文体添加到输出流
	 *
	 * @param ios
	 */
	appendTo(ios: ISOOutputStream) {
		let bs = new Uint8Array(16);
		let is128 = false;
		const ds = ISOBody.DS;
		const len = ds.length;
		for (let i = 0; i < len; i++) {
			if (!ds[i]) continue;

			bs[i >> 3] |= (1 << (7 - (i & 7)));
			if (i >= 64) {
				is128 = true;
			}
		}
		if (is128) {
			bs[0] |= (1 << 7);
		} else {
			bs = bs.slice(0, 8);
		}

		const { items, type } = this;
		if (items[2].compress) {
			ios.write(ISOUtil.toBCD(type));
		} else {
			ios.writeASCII(type);
		}
		ios.write(bs);

		for (let i = 1; i < len; i++) {
			if (!ds[i]) continue;

			items[i + 1].encode(ds[i], ios);
		}
	}

	/**
	 * 报文体转字符串输出，一般用于查看具体信息
	 */
	toString(): String {
		const { type, items } = this
		const ds = ISOBody.DS;
		let str = '';
		str += "TYPE:" + type + "\n";
		for (let i = 1; i < ds.length; i++) {
			if (!ds[i]) continue;

			const index = i + 1;
			const name = items[index].name;
			let ts = ds[i];
			if (!ISOUtil.isChars(ts)) {
				ts = "HEX:" + HEX.byte2Hex(ISOUtil.string2byte(ts));
			}
			if (index === 2) {
				str += (index + ":" + ts.substring(0, 6) + "******" + ts.substring(ts.length - 4) + "//" + name + "\n");
			} else if (index === 35 || index === 52 || index === 53 || index === 55) {
				str += (index + ":" + ts.substring(0, 2) + "****" + ts.substring(ts.length - 2) + "//" + name + "\n");
			} else {
				str += (index + ":" + ts + "//" + name + "\n");
			}
		}
		return str;
	}
}
