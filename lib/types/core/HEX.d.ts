export default class HEX {
    /**
     * 十六进制转Uint8Array
     *
     * @param hex
     */
    static hex2Bytes(hex: String): Uint8Array;
    /**
     * Uint8Array转十六进制
     *
     * @param array
     */
    static byte2Hex(array: Uint8Array): String;
}
