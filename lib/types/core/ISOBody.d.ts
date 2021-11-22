import ISOField from "./ISOField.js";
import ISOInputStream from "./ISOInputStream.js";
import ISOOutputStream from "./ISOOutputStream.js";
export default class ISOBody {
    private static DS;
    private type;
    private readonly items;
    constructor(items: Array<ISOField>, type?: String);
    setField(index: number, info: String): void;
    getField(index: number): String;
    setType(type: String): void;
    decode(iis: ISOInputStream): void;
    appendTo(ios: ISOOutputStream): void;
    toString(): String;
}
