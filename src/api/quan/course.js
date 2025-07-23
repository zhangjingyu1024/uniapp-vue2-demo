import request from "@/utils/request.js";


// 卡片下钻获取课程列表
export const getCourseList = (data) => {
	const {pageNum, pageSize} = data
	return request.post(`course/list?pageNum=${pageNum}&pageSize=${pageSize}`, data, {
		noAuth: true
	});
}

// 获取高发年龄段tag
export const getHighRiskAges = (data) => {
	return request.get(`course/highIncidenceAge/${data.labelId}`, {}, {
		noAuth: true
	});
}