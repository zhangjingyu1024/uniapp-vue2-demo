<template>
	<view :style="colorStyle" class="wrapper">
		<view class="bag">
			<img src='https://data.youmi-china.com/source/login-bg_1.jpg?e=1731395383&token=_k1rLmmvqI7jP57GU5gX_tMwObf5zAlpVt_aTl8j:Pn0Tl7PpJirfYiNu48FA96VJ0Ss=' alt="" srcset="">
		</view>
		<view class="system-height" :style="{ height: statusBarHeight }"></view>
		<!-- #ifdef MP -->
		<view class="title-bar" style="height: 43px;">
			<view class="icon" @click="back" v-if="!isHome">
				<image src="../static/left.png"></image>
			</view>
			<view class="icon" @click="home" v-else>
				<image src="../static/home.png"></image>
			</view>
			商城登录
		</view>
		<!-- #endif -->
		<view class="merchant-msg">
			<img src="https://thirdwx.qlogo.cn/mmopen/vi_32/PiajxSqBRaEKjeCGiaLrUjyibgdB7Mr9fkBU121okNkpjVHz7MvferPaePhydrlNnaZyCu92TuP4d61PTCriahOshg/132" />
			<view class="name">
				立雪网络
			</view>
		</view>
		<view class="wechat_login">
			<view class="btn-wrapper">
				<!-- #ifdef H5 -->
				<button hover-class="none" @click="wechatLogin" class="bg-theme btn1">微信登录</button>
				<!-- #endif -->
				<!-- #ifdef MP -->
				<template>
					<button class="bg-theme btn1" v-if="bindPhone" open-type="getPhoneNumber"
						@getphonenumber="getphonenumber">手机号授权</button>
					<button class="bg-theme btn1" v-else-if="!bindPhone" @click="getAuthLogin">
						授权登录
					</button>
				</template>
				<!-- #endif -->
			</view>
		</view>
		<view class="protocol" v-if="!canGetPrivacySetting">
			<checkbox-group @click.stop='ChangeIsDefault'>
				<checkbox :class="inAnimation?'trembling':''" @animationend='inAnimation=false'
					:checked="protocol ? true : false" /> <text @click.stop='ChangeIsDefault'>已阅读并同意</text>
				<text class="main-color" @click.stop="privacy(4)">《用户协议》</text>
				与<text class="main-color" @click.stop="privacy(3)">《隐私协议》</text>
			</checkbox-group>
		</view>
		<!-- #ifdef MP -->
		<privacyAgreementPopup v-if="canGetPrivacySetting" @onReject="onReject" @onAgree="onAgree">
		</privacyAgreementPopup>
		<!-- #endif -->
	
	</view>
</template>

<script>
	const app = getApp();
	let statusBarHeight = uni.getSystemInfoSync().statusBarHeight + 'px';
	// import mobileLogin from '../components/login_mobile/index.vue';
	// import routinePhone from '../components/login_mobile/routine_phone.vue';
	import editUserModal from '@/components/eidtUserModal/index.vue'
	import privacyAgreementPopup from '@/components/privacyAgreementPopup/index.vue'
	import {
		getLogo,
		silenceAuth,
		routineBindingPhone,
		wechatBindingPhone,
		wechatAuthV2,
		authType,
		authLogin,
		wechatAuthLogin
	} from '@/api/public';
	import {
		LOGO_URL,
		EXPIRES_TIME,
		USER_INFO,
		STATE_R_KEY
	} from '@/config/cache';
	import {
		getUserInfo
	} from '@/api/user.js';
	import Routine from '@/libs/routine';
	import wechat from '@/libs/wechat';
	import colors from '@/mixins/color.js';
	import Auth from '@/libs/wechat.js';
	import {
		HTTP_REQUEST_URL
	} from '@/config/app';
	import {
		isWeixin
	} from "@/utils";
	import Cache from '@/utils/cache';
	export default {
		mixins: [colors],
		data() {
			return {
				imgHost: HTTP_REQUEST_URL,
				isUp: false,
				canClose: true,
				phone: '',
				statusBarHeight: statusBarHeight,
				isHome: false,
				isPhoneBox: false,
				protocol: false,
				isShow: false,
				isLogin: false,
				logoUrl: '',
				code: '',
				authKey: '',
				options: '',
				userInfo: {},
				codeNum: 0,
				canUseGetUserProfile: false,
				canGetPrivacySetting: false,
				inAnimation: false,
				colorStatus: uni.getStorageSync('color_status'),
				mp_is_new: this.$Cache.get('MP_VERSION_ISNEW') || false,
				configData: Cache.get('BASIC_CONFIG'),
				bindPhone: true
			};
		},
		components: {

			editUserModal,
			privacyAgreementPopup
		},
		onLoad(options) {
			if (uni.getUserProfile) {
				this.canUseGetUserProfile = true
			}
			// #ifdef MP
			if (wx.getPrivacySetting) {
				this.canGetPrivacySetting = true
			}
			// #endif
			let that = this;
			// #ifdef MP
			// this.userLogin()
			// #endif
			// #ifdef H5
			const {
				code,
				state
			} = options;
			if (code) {
				let spread = this.$Cache.get("spread") || '';
				let backUrl = state ? decodeURIComponent(state) : ''
				this.wechatAuthLogin({
					code,
					spread
				}, backUrl)
			}
			// #endif
			let pages = getCurrentPages();
			let prePage = pages[pages.length - 2];
			if (prePage && prePage.route == 'pages/order_addcart/order_addcart') {
				this.isHome = true;
			} else {
				this.isHome = false;
			}
		},
		methods: {
			wechatAuthLogin(d, back_url) {
				console.log("re正在登录中正在登录中正在登录中sss")
				uni.showLoading({
					title: '正在登录中'
				});
				wechatAuthLogin(d).then(res => {
					uni.hideLoading();
					if (res.data.type=="register" || res.data.type=="start") {
						this.authKey = res.data.key
						uni.navigateTo({
							url: `/pages/binding_phone/index?authKey=${this.authKey}&backUrl=${back_url}`
						})
					} else {
						this.$store.commit('LOGIN', {
							token: res.data.token,
						});
						this.getUserInfo(0, back_url)
					}
				}).catch(err => {
					uni.hideLoading();
					uni.showToast({
						title: err,
						icon: 'none',
						duration: 2000
					});
				});
			},
			onAgree() {
				this.protocol = true
			},
			// 小程序 22.11.8日删除getUserProfile 接口获取用户昵称头像
			getAuthLogin() {
				console.log("getAuthLogin")
				if (!this.authKey) return
				if (!this.protocol) {
					uni.showToast({
						title: '请先阅读并同意协议',
						icon: 'none',
						duration: 2000
					});
					return
				}
				uni.showLoading({
					title: '正在登录中'
				});
				authLogin({
					key: this.authKey
				}).then(res => {
					console.log(res)
					let time = res.data.expires_time - this.$Cache.time();
					this.$store.commit('LOGIN', {
						token: res.data.token,
						time: time
					});
					this.getUserInfo(res.data.bindName)
				}).catch(err => {
					uni.hideLoading();
					uni.showToast({
						title: err,
						icon: 'none',
						duration: 2000
					});
				});
			},
			ChangeIsDefault(e) {
				this.$set(this, 'protocol', !this.protocol);
			},
			editSuccess() {
				this.isShow = false
			},
			phoneLogin() {
				uni.navigateTo({
					url: `/pages/users/binding_phone/index?authKey=${this.authKey}&pageType=0`
				})
			},
			closeEdit() {
				this.isShow = false
				this.$util.Tips({
					title: '登录成功',
					icon: 'success'
				}, {
					tab: 3
				});
			},
			onReject() {
				uni.navigateBack();
			},
			// #ifdef MP
			back() {
				if (this.isLogin) {
					this.$store.commit('LOGIN', {
						token: '',
						time: 0
					});
				}
				uni.navigateBack();
			},
			// #endif
			// #ifndef MP
			back() {
				uni.navigateBack({
					delta: 1
				})
			},
			// #endif
			home() {
				uni.switchTab({
					url: '/pages/index/index'
				})
			},
			// 弹窗关闭
			maskClose(new_user) {
				this.isUp = false;
				// #ifdef MP
				if (new_user) {
					this.isShow = true
				}
				// #endif
			},
			bindPhoneClose(data) {
				this.isPhoneBox = false;
				if (data.isStatus) {
					// #ifdef MP
					this.getUserInfo(data.new_user)
					// #endif
					// #ifndef MP
					this.$util.Tips({
						title: '登录成功',
						icon: 'success'
					}, {
						tab: 3
					});
					// #endif
				}
			},
			// #ifdef MP
			// 小程序获取手机号码
			getphonenumber(e) {
				console.log("123")
				if (!this.protocol) {
					uni.showToast({
						title: '请先阅读并同意协议',
						icon: 'none',
						duration: 2000
					});
					return
				}
				uni.showLoading({
					title: '正在登录中'
				});
				Routine.getCode()
					.then(code => {
						this.getUserPhoneNumber(e.detail.encryptedData, e.detail.iv, code);
					})
					.catch(error => {
						uni.$emit('closePage', false);
						uni.hideLoading();
					});
			},
			// 小程序获取手机号码回调
			getUserPhoneNumber(encryptedData, iv, code) {
				let self=this;
				authType({
						code: code,
						spread_spid: app.globalData.spid,
						spread_code: app.globalData.code,
						nickName:"立雪用户",
						sex:0,
					})
					.then(res => {

					if (res.data.type === 'register') {
						self.authKey = res.data.key;
						Routine.getCode().then(code2 => {
								wechatBindingPhone({
									encryptedData: encryptedData,
									iv: iv,
									code: code2,
									type:"routine",
									key: self.authKey
								}).then(res2 => {
									self.$store.commit('LOGIN', {
										token: res2.data.token,
									});
									self.getUserInfo(res2.data.bindName);
								}).catch(error => {
									uni.hideLoading()
									self.$util.Tips({
										title: error
									})
								})	
						})
					}
					if (res.data.type === 'login') {
						this.$store.commit('LOGIN', {
							token: res.data.token
						});
						this.$store.commit("SETUID", res.data.uid);
						this.getUserInfo();
						// this.wechatPhone();
						//location.replace(decodeURIComponent(decodeURIComponent(option.query.back_url)));
					}

						

						// let time = res.data.expires_time - this.$Cache.time();
						// this.$store.commit('LOGIN', {
						// 	token: res.data.token,
						// 	time: time
						// });
						// this.userInfo = res.data.userInfo;
						// this.$store.commit('SETUID', res.data.userInfo.uid);
						// this.$store.commit('UPDATE_USERINFO', res.data.userInfo);
						// this.$Cache.clear('snsapiKey');
						// this.getUserInfo(res.data.bindName)
						// this.$util.Tips({
						// 	title: this.$t(`登录成功`),
						// 	icon: 'success'
						// }, {
						// 	tab: 3
						// });
					})
					.catch(res => {
						uni.hideLoading();
					});
			},
			
			// #endif
			/**
			 * 获取个人用户信息
			 */
			getUserInfo(new_user, back_url) {
				let that = this;
				getUserInfo().then(res => {
					uni.hideLoading();
					that.userInfo = res.data;
					that.$store.commit('SETUID', res.data.uid);
					that.$store.commit('UPDATE_USERINFO', res.data);
					if (new_user) {
						this.isShow = true
					} else {
						// #ifdef MP
						that.$util.Tips({
							title: '登录成功',
							icon: 'success'
						}, {
							tab: 3
						});
						// #endif
						// #ifndef MP
						that.$util.Tips({
							title: '登录成功',
							icon: 'success'
						}, {
							tab: 4,
							url: back_url || '/pages/user/index'
						});
						// #endif
					}
				}).catch(err => {
					uni.hideLoading();
					uni.showToast({
						title: err,
						icon: 'none',
						duration: 2000
					});
				});
			},
			privacy(type) {
				uni.navigateTo({
					url: "/pages/users/privacy/index?type=" + type
				})
			},
			// #ifdef H5
			// 获取url后面的参数
			getQueryString(name) {
				var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
				var reg_rewrite = new RegExp('(^|/)' + name + '/([^/]*)(/|$)', 'i');
				var r = window.location.search.substr(1).match(reg);
				var q = window.location.pathname.substr(1).match(reg_rewrite);
				if (r != null) {
					return unescape(r[2]);
				} else if (q != null) {
					return unescape(q[2]);
				} else {
					return null;
				}
			},
			// 公众号登录
			wechatLogin() {
				if (!this.protocol) {
					uni.showToast({
						title: '请先阅读并同意协议',
						icon: 'none',
						duration: 2000
					});
					return
				}
				console.log(111)
				if (!this.code || this.options.scope !== 'snsapi_base') {
					this.$wechat.oAuth('snsapi_userinfo', location.href);
				} else {
					if (this.authKey) {
						// this.isUp = true;
						uni.navigateTo({
							url: `/pages/users/binding_phone/index?authKey=${this.authKey}`
						})
					}
				}
			},


			// 输入手机号后的回调
			wechatPhone() {
				this.$Cache.clear('snsapiKey');
				if (this.options.back_url) {
					let url = uni.getStorageSync('snRouter');
					url = url.indexOf('/pages/index/index') != -1 ? '/' : url;
					if (url.indexOf('/pages/wechat_login/index') !== -1) {
						url = '/';
					}
					if (!url) {
						url = '/pages/index/index';
					}
					this.isUp = false;
					uni.showToast({
						title: '登录成功',
						icon: 'none'
					});
					setTimeout(res => {
						location.href = url;
					}, 800);
				} else {
					this.isUp = false;
					uni.showToast({
						title: '登录成功',
						icon: 'none'
					});
					setTimeout(res => {
						location.href = '/pages/index/index';
					}, 800);
				}
			}
			// #endif
		}
	};
</script>

<style lang="scss">
	page {
		background: #fff;
	}

	.wrapper {
		position: relative;
		height: 100vh;

		.bag {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			opacity: .8;
			z-index: -1;
			/* #ifdef H5 */
			z-index: 0;

			/* #endif */
			img {
				width: 100%;
				height: 838rpx;
			}
		}

		.merchant-msg {
			padding-top: 252rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			flex-direction: column;
			z-index: 2;
			/* #ifdef H5 */
			position: relative;

			/* #endif */
			img {
				width: 152rpx;
				height: 152rpx;
				border-radius: 50%;
			}

			.name {
				font-size: 40rpx;
				font-weight: 500;
				color: #333333;
				line-height: 56rpx;
				margin-top: 32rpx;
			}
		}
	}

	.wechat_login {
		margin-top: 96rpx;

		.img image {
			width: 100%;
		}

		.btn-wrapper {
			padding: 0 66rpx;

			button {
				width: 100%;
				height: 86rpx;
				line-height: 86rpx;
				margin-bottom: 40rpx;
				border-radius: 120rpx;
				font-size: 30rpx;

				&.btn1 {
					color: #fff;
				}

				&.btn2 {
					color: #666666;
					border: 1px solid #E4E4E4;
				}
			}
		}
	}

	.title-bar {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 34rpx;
		font-weight: 500;
		color: #333333;
		line-height: 48rpx;
	}

	.icon {
		position: absolute;
		left: 30rpx;
		top: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 80rpx;
		height: 80rpx;

		image {
			width: 50rpx;
			height: 50rpx;
		}
	}

	.protocol {
		position: fixed;
		bottom: 52rpx;
		left: 0;
		width: 100%;
		margin: 0 auto;
		color: #999999;
		font-size: 24rpx;
		line-height: 22rpx;
		text-align: center;
		bottom: calc(52rpx + constant(safe-area-inset-bottom)); ///兼容 IOS<11.2/
		bottom: calc(52rpx + env(safe-area-inset-bottom)); ///兼容 IOS>11.2/

		.main-color {
			color: var(--view-theme);
		}

		.trembling {
			animation: shake 0.6s;
		}

		::v-deep  uni-checkbox .uni-checkbox-input {
			width: 28rpx;
			height: 28rpx;
		}

		::v-deep  uni-checkbox .uni-checkbox-input.uni-checkbox-input-checked::before {
			font-size: 24rpx
		}

		::v-deep  uni-checkbox .uni-checkbox-wrapper {
			margin-bottom: 1px;
		}

		/*checkbox 选项框大小  */
		::v-deep  checkbox .wx-checkbox-input {
			width: 28rpx;
			height: 28rpx;
		}

		/*checkbox选中后样式  */
		::v-deep  checkbox .wx-checkbox-input.wx-checkbox-input-checked {
			background: white;
		}

		/*checkbox选中后图标样式  */
		::v-deep  checkbox .wx-checkbox-input.wx-checkbox-input-checked::before {
			width: 28rpx;
			height: 28rpx;
			line-height: 28rpx;
			text-align: center;
			font-size: 22rpx;
			background: transparent;
			transform: translate(-50%, -50%) scale(1);
			-webkit-transform: translate(-50%, -50%) scale(1);
		}
	}
</style>
