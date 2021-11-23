import ISOOutputStream from "./ISOOutputStream.js";
import ISOInputStream from "./ISOInputStream.js";
/**
 * 域信息封装类
 */
export default class ISOField {
    private static ZS;
    private static ES;
    private readonly index;
    readonly name: String;
    private readonly maxLen;
    private readonly varLen;
    private readonly type;
    readonly compress: Boolean;
    constructor(fieldInfo: String, compress?: Boolean);
    /**
     * 编码
     *
     * @param s 字符串
     * @param ios 输出流
     */
    encode(s: String, ios: ISOOutputStream): void;
    /**
     * 解码
     *
     * @param iis
     */
    decode(iis: ISOInputStream): String;
    /**
     * 根据配置信息生成域实例
     *
     * @param fieldDefinition 域定义配置信息
     * @param compress 是否压缩
     */
    static makeFields(fieldDefinition: String, compress: Boolean): Array<ISOField>;
}
