import store from '../../store';
import {
	toLogin,
} from '@/libs/login.js';
import {
	getAuth
} from './home.js'

function ready(callback) {
	let time = null
	if (window.AlipayJSBridge) {
		callback && callback(false)
	} else {
		document.addEventListener('AlipayJSBridgeReady', callback, false)
		time = setTimeout(() => {
			callback(true)
		}, 1000)
	}
}

// 获取基本信息
function userAuth() {
	return new Promise((resolve, reject) => {
		ready((isNotZHB) => {
			if (isNotZHB) {
				resolve('notZHBPass')
				return
			}
			store.commit("SET_ZHB", true);
			AlipayJSBridge.call(
				'userAuth', {
				// moduleId: '413478', // 测试环境moduleid
				moduleId: '413488',
				scope: 'userDetail'
			},
				function (result) {
					console.log('返回result:', result, '')
					const authCode = result?.data?.authCode
					if (authCode) {
						getAuth({
							authCode,
							scope: 'userDetail'
						}).then(res => {
							resolve(res);
						}).catch(error => {
							reject(error);
							store.commit("LOGOUT");
						})
					} else {
						// 在正好版，但是未授权
						uni.showToast({
							title: "未授权或授权出错",
							icon: 'none',
						})
						setTimeout(() => {
							resolve('notZHBPass')
						}, 2000)
					}
				},
			);
		});
	});
}
// 关闭webview
function popWindow() {
	ready(function () {
		AlipayJSBridge.call('popWindow')
	})
}


export const checkZHBAndLogin = async () => {
	const userAuthResult = await userAuth().catch(err => {
		console.error('userAuthError:', err)
	})
	console.log(userAuthResult, 'userAuthResult')
	if (!userAuthResult || userAuthResult === 'notZHBPass') {
		return toLogin()
	} else {
		store.commit('LOGIN', {
			token: userAuthResult.data.authoriZation,
			time: 1000
		})
		store.commit('SETUID', userAuthResult.data.memberUer.id);
		// 刷新当前页面
		location.reload()
	}
}