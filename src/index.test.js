import Parse, { AREA, Utils } from "./parse/index.js";

test("广东省东莞寮步镇香市路香缤城市花园", () => {
  const result = Parse.parse("广东省东莞寮步镇香市路香缤城市花园", true);
  expect(result[0]["code"]).toEqual("441928");
});

test("大头儿子 15988888888  重庆市云阳县双林镇桐林小学", () => {
  const result = Parse.parse(
    "大头儿子 15988888888  重庆市云阳县双林镇桐林小学",
    true
  );
  expect(result[0]["code"]).toEqual("500235");
});

test("大头儿子 15988888888  重庆市云阳县高阳镇滨湖路2号", () => {
  const result = Parse.parse(
    "大头儿子 15988888888  重庆市云阳县高阳镇滨湖路2号",
    true
  );
  expect(result[0]["code"]).toEqual("500235");
});

test("阿里虚拟号 13500001234-8888  重庆市云阳县双林镇桐林小学", () => {
  const result = Parse.parse(
    "阿里虚拟号 13500001234-8888  重庆市云阳县双林镇桐林小学",
    true
  );
  expect(result[0]["mobile"]).toEqual("13500001234-8888");
});
test("详细地址有数字", () => {
  const result = Parse.parse(
    "余先生，17712341234，陕西省 咸阳市 渭城区 北杜街道 丰树空港新城物流园5号库A库【淘宝特惠集运-西安集运中心】【勿删】@2824081629 【特惠集运订单，商家发货到集运仓，集运仓收货后配送至消费者】",
    true
  );
  expect(result[0]["area"]).toEqual(
    "渭城区"
  );
});
test("详细地址带电话号码", () => {
  const result = Parse.parse(
    "余先生，17712341234，陕西省 咸阳市 渭城区 北杜街道 丰树空港新城物流园5号库A库 0731-12345614",
    true
  );
  expect(result[0]["mobile"]).toEqual("17712341234");
});

test("重庆,重庆市,垫江县,澄溪镇人民路355号", () => {
  const result = Parse.parse(
    "重庆,重庆市,垫江县,澄溪镇人民路355号",
    true
  );

  expect(result[0]["code"]).toEqual("500100");
});

test("湛江市开发区别名识别为经济技术开发区", () => {
  const aliases = ["开发区", "经济开发区", "经开区"];

  for (const alias of aliases) {
    const result = Parse.parse(`广东湛江市${alias}测试路1号`, true);

    expect(result[0]["code"]).toEqual("440890");
    expect(result[0]["area"]).toEqual("经济技术开发区");
  }
});

test("末尾收字提取收件人姓名", () => {
  const result = Parse.parse(
    "广东湛江市开发区测试路88号测试大厦1001室(测试单位)张三收，19900000000",
    true
  );

  expect(result[0]["code"]).toEqual("440890");
  expect(result[0]["area"]).toEqual("经济技术开发区");
  expect(result[0]["name"]).toEqual("张三");
  expect(result[0]["mobile"]).toEqual("19900000000");
});

test("末尾收字姓名不保留收字", () => {
  const result = Parse.parse(
    "北京市密云区测试小区1号楼101室 赵四收 18800000000",
    true
  );

  expect(result[0]["name"]).toEqual("赵四");
  expect(result[0]["mobile"]).toEqual("18800000000");
});

test("房号后机构名作为名称", () => {
  const result = Parse.parse(
    "广东省东莞市大朗镇测试社区测试路288号测试大厦 22楼 2211-2216室测试律师事务所",
    true
  );

  expect(result[0]["code"]).toEqual("441933");
  expect(result[0]["area"]).toEqual("大朗镇");
  expect(result[0]["name"]).toEqual("测试律师事务所");
  expect(result[0]["details"]).toContain("2211-2216室");
});

test("不带房室字样的房号后机构名作为名称", () => {
  const result = Parse.parse(
    "广东省东莞市大朗镇测试社区测试路288号测试大厦 22楼 2211-2216测试有限公司",
    true
  );

  expect(result[0]["name"]).toEqual("测试有限公司");
  expect(result[0]["details"]).toContain("2211-2216");
});

test("整层楼后机构名作为名称", () => {
  const result = Parse.parse(
    "广东东莞市大朗镇测试路288号测试大厦22楼测试律师事务所",
    true
  );

  expect(result[0]["code"]).toEqual("441933");
  expect(result[0]["name"]).toEqual("测试律师事务所");
  expect(result[0]["details"]).toContain("22楼");
});

test("机构名不覆盖个人收件人", () => {
  const result = Parse.parse(
    "广东东莞市大朗镇测试路288号测试大厦1001室测试公司 张三收",
    true
  );

  expect(result[0]["name"]).toEqual("张三");
});

test("机构名优先取室房后的内容", () => {
  const result = Parse.parse(
    "广东东莞市大朗镇测试路288号测试大厦22层1104室测试有限公司",
    true
  );

  expect(result[0]["name"]).toEqual("测试有限公司");
  expect(result[0]["details"]).toContain("22层1104室");
});

test("机构名支持栋后无室房字样的房号", () => {
  const result = Parse.parse(
    "广东东莞市大朗镇测试小区16栋1104测试有限公司",
    true
  );

  expect(result[0]["name"]).toEqual("测试有限公司");
  expect(result[0]["details"]).toContain("16栋1104");
});

test("机构名无房室时优先取层后内容", () => {
  const result = Parse.parse(
    "广东东莞市大朗镇测试小区16栋22层测试有限公司",
    true
  );

  expect(result[0]["name"]).toEqual("测试有限公司");
  expect(result[0]["details"]).toContain("16栋22层");
});

test("机构名无层房室时回退到栋后内容", () => {
  const result = Parse.parse(
    "广东东莞市大朗镇测试小区16栋测试有限公司",
    true
  );

  expect(result[0]["name"]).toEqual("测试有限公司");
  expect(result[0]["details"]).toContain("16栋");
});

test("机构名支持号后内容", () => {
  const result = Parse.parse(
    "广东东莞市大朗镇测试路288号测试有限公司",
    true
  );

  expect(result[0]["name"]).toEqual("测试有限公司");
  expect(result[0]["details"]).toContain("288号");
});

test("机构名支持户号房房间后内容", () => {
  const list = [
    ["广东东莞市大朗镇测试小区1栋1104户测试有限公司", "1104户"],
    ["广东东莞市大朗镇测试小区1栋1104号房测试有限公司", "1104号房"],
    ["广东东莞市大朗镇测试小区1栋1104房间测试有限公司", "1104房间"],
  ];

  for (const [address, marker] of list) {
    const result = Parse.parse(address, true);

    expect(result[0]["name"]).toEqual("测试有限公司");
    expect(result[0]["details"]).toContain(marker);
  }
});

test("机构名支持商业铺位后内容", () => {
  const list = [
    ["广东东莞市大朗镇测试广场A12铺测试有限公司", "A12铺"],
    ["广东东莞市大朗镇测试广场A12商铺测试有限公司", "A12商铺"],
    ["广东东莞市大朗镇测试广场A12铺位测试有限公司", "A12铺位"],
    ["广东东莞市大朗镇测试广场A12档口测试有限公司", "A12档口"],
    ["广东东莞市大朗镇测试广场A12柜台测试有限公司", "A12柜台"],
    ["广东东莞市大朗镇测试广场A12工位测试有限公司", "A12工位"],
    ["广东东莞市大朗镇测试广场A12卡位测试有限公司", "A12卡位"],
  ];

  for (const [address, marker] of list) {
    const result = Parse.parse(address, true);

    expect(result[0]["name"]).toEqual("测试有限公司");
    expect(result[0]["details"]).toContain(marker);
  }
});

test("机构名支持F楼层后内容", () => {
  const result = Parse.parse(
    "广东东莞市大朗镇测试大厦22F测试有限公司",
    true
  );

  expect(result[0]["name"]).toEqual("测试有限公司");
  expect(result[0]["details"]).toContain("22F");
});

test("机构名支持单元门梯后内容", () => {
  const list = [
    ["广东东莞市大朗镇测试小区2单元测试有限公司", "2单元"],
    ["广东东莞市大朗镇测试小区3门测试有限公司", "3门"],
    ["广东东莞市大朗镇测试小区A梯测试有限公司", "A梯"],
  ];

  for (const [address, marker] of list) {
    const result = Parse.parse(address, true);

    expect(result[0]["name"]).toEqual("测试有限公司");
    expect(result[0]["details"]).toContain(marker);
  }
});

test("机构名支持楼栋后内容", () => {
  const list = [
    ["广东东莞市大朗镇测试小区16幢测试有限公司", "16幢"],
    ["广东东莞市大朗镇测试小区A座测试有限公司", "A座"],
    ["广东东莞市大朗镇测试小区8号楼测试有限公司", "8号楼"],
  ];

  for (const [address, marker] of list) {
    const result = Parse.parse(address, true);

    expect(result[0]["name"]).toEqual("测试有限公司");
    expect(result[0]["details"]).toContain(marker);
  }
});
