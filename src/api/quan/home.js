import request from "@/utils/request.js";
/**
 * 
 * quan首页接口
 * 
 */


/**
 * 获取顶部年龄区类别
 * 
 */
export const getCategory = (data, noAuth = true) => {
	return request.get('category/10', data, {
		noAuth
	});
}

/**
 * 获取年龄区间下的卡片
 * 
 */
export const getCartCards = (data) => {
	return request.get(`up_tags/${data.categoryId}`, {}, {
		noAuth: true
	});
}

/**
 * 底部卡片
 * 
 */
export const getBottomTags = (data) => {
	return request.get('bottom_tags', data, {
		noAuth: true
	});
}

// 郑好办authCode认证 
export const getAuth = (data) => {
	return request.get('szzz/reqOAuthTokenAndCreatToken', data, {
		noAuth: true
	});
}

// 加载投票列表项
export const getVoteTags = (id) => {
	return request.get('vote_tags/'+ id , null, {
		noAuth: true
	});
}

// 投票提交
export const vote = (data) => {
	return request.post('vote', data, {
		noAuth: true
	} );
}

// 联系我们 提交
export const submitContactUs = (data) => {
	return request.post('contact/us', data, {
		noAuth: true
	} );
}
