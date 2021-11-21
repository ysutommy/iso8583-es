import {
	HEX, FieldDefinition, ISOBody, ISOField, ISOInputStream, ISOOutputStream
} from '../lib/core/index.js'

const fields = ISOField.makeFields(FieldDefinition, true);

const body = new ISOBody(fields);
body.setType("0800"); // 签到
body.setField(11, "000456"); // 流水号
body.setField(41, "12345678"); // 终端编号
body.setField(42, "123456789012345"); // 商户编号
body.setField(60, "00" + "123456" + "003"); // 消息类型码00+批次号+双倍长密钥算法
body.setField(63, "03"); // 操作员号
const ios = new ISOOutputStream();
body.appendTo(ios);
console.log("编码结果")
console.log(HEX.byte2Hex(ios.toByteArray()))
console.log(body.toString())

console.log("-----------------------------------------");

const ds = HEX.hex2Bytes("0200202004C020C0981131000000015402100006376227594325183289D1703101000000180000003031303031373934383730343531303037383030303236313536C411E6435383EB8526000000000000000013010000010005003030303030303030");
const iis = new ISOInputStream(ds);
const resp = new ISOBody(fields);
resp.decode(iis); // 解码
console.log(resp.toString());
