import ISOField from "./ISOField.js";
import ISOInputStream from "./ISOInputStream.js";
import ISOOutputStream from "./ISOOutputStream.js";
/**
 * 报文体封装类
 */
export default class ISOBody {
    private static DS;
    private type;
    private readonly items;
    constructor(items: Array<ISOField>, type?: String);
    /**
     * 设置域信息
     *
     * @param index 域索引
     * @param info 域信息
     */
    setField(index: number, info: String): void;
    /**
     * 获取指定域信息
     *
     * @param index
     */
    getField(index: number): String;
    /**
     * 设置报文体类型，即交易类型
     *
     * @param type
     */
    setType(type: String): void;
    /**
     * 解码
     *
     * @param iis
     */
    decode(iis: ISOInputStream): void;
    /**
     * 报文体添加到输出流
     *
     * @param ios
     */
    appendTo(ios: ISOOutputStream): void;
    /**
     * 报文体转字符串输出，一般用于查看具体信息
     */
    toString(): String;
}
