## iso8583-es
A pure, high-performance library with ES6 and typescript, used to encode and decode the ISO8583 protocol
> Note: Please use latest version

### Usage
```js
npm i --save iso8583-es
```
##### 编码
```js
import i8es from 'iso8583-es'
const {
  HEX, FieldDefinition, ISOBody, ISOField, ISOInputStream, ISOOutputStream
} = i8es

const fields = ISOField.makeFields(FieldDefinition, true); // 全局初始化一次

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
```
得到结果
```text
编码结果
08000020000000C000120004563132333435363738313233343536373839303132333435001100123456003000023033
TYPE:0800
11:000456//受卡方系统跟踪号
41:12345678//受卡机终端标识码
42:123456789012345//受卡方标识码
60:00123456003//自定义域
63:03//自定义域
```
##### 解码
```js
const ds = HEX.hex2Bytes("0200202004C020C0981131000000015402100006376227594325183289D1703101000000180000003031303031373934383730343531303037383030303236313536C411E6435383EB8526000000000000000013010000010005003030303030303030");
const iis = new ISOInputStream(ds);
const resp = new ISOBody(fields);
resp.decode(iis); // 解码
console.log(resp.toString());
```
得到结果
```text
TYPE:0200
3:310000//交易处理码
11:000154//受卡方系统跟踪号
22:021//服务点输入方式码
25:00//服务点条件码
26:06//服务点PIN获取码
35:62****00//2磁道数据
41:01001794//受卡机终端标识码
42:870451007800026//受卡方标识码
49:156//交易货币代码
52:C4****85//个人标识码数据
53:26****00//安全控制信息
60:0100000100050//自定义域
64:3030303030303030//MAC
```

或者单独导入

```js
import ISOUtil from "iso8583-es/lib/core/ISOUtil.js";
import ISOBody from "iso8583-es/lib/core/ISOBody.js";
```

