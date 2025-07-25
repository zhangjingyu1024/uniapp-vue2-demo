import store from "../store";
import Cache from '../utils/cache';
import {
	Debounce
} from '@/utils/validate.js'
// #ifdef H5 || APP-PLUS
import {
	isWeixin
} from "../utils";
import auth from './wechat';
// #endif

import {
	LOGIN_STATUS,
	USER_INFO,
	EXPIRES_TIME,
	STATE_R_KEY
} from './../config/cache';
import Routine from '@/libs/routine';


function prePage() {
	let pages = getCurrentPages();
	let prePage = pages[pages.length - 1];
	// #ifndef APP-PLUS
	return prePage.route;
	// #endif
	// #ifdef APP-PLUS
	return prePage.$page.fullPath;
	// #endif

}




export const toLogin = Debounce(_toLogin, 800)

function _toLogin(push, pathLogin) {
	// #ifdef H5
	if (isWeixin()) {
		if (!uni.getStorageSync('authIng')) {
			store.commit("LOGOUT");
		}
	} else {
		store.commit("LOGOUT");
	}
	// #endif
	// #ifndef H5
	store.commit("LOGOUT");
	// #endif
	let path = prePage();

	// #ifdef H5
	path = location.pathname + location.search;
	// #endif
	const BASIC_CONFIG = true
	if (!pathLogin)
		pathLogin = '/page/login/index'
	Cache.set('login_back_url', path);
	// #ifdef H5
	if (isWeixin() && true) {
		uni.navigateTo({
			// url: '/pages/wechat_login/index', 
			url: '/pages/login/index'
		});

	} else {
		uni.navigateTo({
			url: '/pages/login/index'
		})
	}
	// #endif

	// #ifdef MP
	let url
	url = '/pages/wechat_login/index'
	uni.navigateTo({
		url
	})
	// #endif

	// #ifdef APP-PLUS
	uni.navigateTo({
		url: '/pages/login/index'
	})
	// #endif

}


export function checkLogin() {
	let token = Cache.get(LOGIN_STATUS);
	// let token
	let expiresTime = Cache.get(EXPIRES_TIME);
	// let newTime = Math.round(new Date() / 1000);
	if (!token) {
		uni.setStorageSync('authIng', false)
		Cache.clear(LOGIN_STATUS);
		Cache.clear(EXPIRES_TIME);
		Cache.clear(USER_INFO);
		Cache.clear(STATE_R_KEY);
		return false;
	} else {
		store.commit('UPDATE_LOGIN', token);
		let userInfo = Cache.get(USER_INFO, true);
		if (userInfo) {
			store.commit('UPDATE_USERINFO', userInfo);
		}
		return true;
	}

}
