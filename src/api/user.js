import request from "@/utils/request.js";

/**
 * 验证码key
 */
export function getSendCode (data) {
  return request.post("sendCode", data, {
    noAuth: true
  });
}
/**
 * app登录
 */
export function loginMobile (data) {
  return request.post("login", data, {
    noAuth: true
  });
}

/**
 * H5登录（补写，和loginMobile一样）
 */
export function loginH5 (data) {
  return request.post("login", data, {
    noAuth: true
  });
}

export function userEdit (data) {
  return request.post("user/edit", data, {
    noAuth: true
  });
}

/**
 * 会员信息
 */
export function getUserInfo (data) {
  return request.get("member/user", data, {
    noAuth: true
  });
}

/**
 * 会员卡
 */
export function getCardList (data) {
  return request.get("member/card/list", data, {
    noAuth: true
  });
}
/**
 * 积分列表
 */
export function getIntegralList (data) {
  return request.get("member/integral", data, {
    noAuth: true
  });
}

export function spread (data) {
  return request.get("member/spread", data, {
    noAuth: true
  });
}

export function getLangList (data) {
  return request.get("lang/list", data, {
    noAuth: true
  });
}


export function mpBindingPhone (data) {
  return request.get("binding/phone", data, {
    noAuth: true
  });
}

