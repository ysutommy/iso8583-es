import ISOOutputStream from "./ISOOutputStream.js";
import ISOInputStream from "./ISOInputStream.js";
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
    encode(s: String, ios: ISOOutputStream): void;
    decode(iis: ISOInputStream): String;
    static makeFields(fieldDefinition: String, compress: Boolean): Array<ISOField>;
}
