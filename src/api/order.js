import request from "@/utils/request.js";

/**
 * 订单创建
 * 
 */
export function orderCreate(data) {
	return request.post("order/create", data);
}
/**
 * 订单确认
 * 
 */
export function orderConfirm(data) {
	return request.post("order/confirm", data,{
		noAuth: false
	});
}
/**
 * 查询支付结果
 * 
 */
export function orderQueryPayResult(data) {
	return request.get("order/queryPayResult", data);
}
/**
 * 订单列表
 * 
 */
export function getOrderList(data) {
	return request.get("order/list", data);
}
/**
 * 订单详情
 * 
 */
export function getOrderInfo(data) {
	return request.get("order/info", data);
}
/**
 * 取消订单
 * 
 */
export function getOrderCancel(data) {
	return request.get("order/cancel", data);
}


