import {
	HTTP_REQUEST_URL,
	HEADER,
	TOKENNAME
} from '@/config/app';
import {
	toLogin,
	checkLogin
} from '../libs/login';
import store from '../store';
import {
	checkZHBAndLogin
} from '@/api/quan/auth.js'
// import i18n from './lang.js';

/**
 * 发送请求
 */
function baseRequest(url, method, data, {
	noAuth = false,
	noVerify = false
}) {
	let Url = HTTP_REQUEST_URL,
		header = HEADER;
	const isZHB = store.state.app.isZHB
	if (!noAuth) {
		//登录过期自动登录
		if (!store.state.app.token && !checkLogin()) {
			if (isZHB) {
				checkZHBAndLogin()
			} else {
				toLogin();
			}
			return Promise.reject({
				msg: '未登录'
			});
		}
	}
	if (store.state.app.token) {
		header[TOKENNAME] = 'Bearer ' + store.state.app.token;
	} else {
		header[TOKENNAME] = '';
	}
	return new Promise((reslove, reject) => {
		if (uni.getStorageSync('locale')) {
			header['Cb-lang'] = uni.getStorageSync('locale')
		}
		uni.request({
			url: Url + '/api/front/' + url,
			method: method || 'GET',
			header: header,
			data: data || {},
			success: (res) => {
				if (noVerify)
					reslove(res.data, res);
				else if (res.data.code == 200)
					reslove(res.data, res);
				else if ([401].indexOf(res.data.code) !== -1) {
					if (isZHB) {
						checkZHBAndLogin()
					} else {
						toLogin();
					}
					reject(res.data);
				} else if (res.data.code == 100103) {
					uni.showModal({
						title: '提示',
						content: res.data.msg,
						showCancel: false,
						confirmText: '我知道了'
					});
				} else reject(res.data.msg || '系统错误');

			},
			fail: (msg) => {
				let data = {
					mag: '请求失败',
					status: 1 //1没网
				}
				// #ifdef APP-PLUS
				reject(data);
				// #endif
				// #ifndef APP-PLUS
				reject('请求失败');
				// #endif
			}
		})
	});
}

const request = {};

['options', 'get', 'post', 'put', 'head', 'delete', 'trace', 'connect'].forEach((method) => {
	request[method] = (api, data, opt) => baseRequest(api, method, data, opt || {})
});



export default request;