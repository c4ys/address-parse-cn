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

  expect(result[0]["code"]).toEqual("500231");
});
