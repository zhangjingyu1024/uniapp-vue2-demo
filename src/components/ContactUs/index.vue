<template>
	<view class="box">
		<view class="contact-btn" @click="handleShowDrawer1">
			<view class="zixun">
				<image src="/static/images/zixun-icon.png" class="img"></image>
				<view class="lianxi">
					联系我们
				</view>
			</view>

		</view>
		<firstDrawer :visible.sync="isFirstDrawerShow" @choose="handleChoose"></firstDrawer>
		<secondDrawer :visible.sync="isSecondDrawerShow" @submit="handleSubmitTel"></secondDrawer>
	</view>
</template>

<script>
	import firstDrawer from './first-drawer.vue';
	import secondDrawer from './second-drawer.vue';
	import {
		submitContactUs
	} from '@/api/quan/home.js'
	export default {
		data() {
			return {
				isFirstDrawerShow: false,
				isSecondDrawerShow: false,
				type: 1,
				loading: false,
			};
		},
		components: {
			firstDrawer,
			secondDrawer
		},
		methods: {
			handleShowDrawer1() {
				this.isFirstDrawerShow = true
			},
			handleShowDrawer2() {
				this.isSecondDrawerShow = true
			},
			handleChoose(type) {
				this.type = type
				this.handleShowDrawer2()
			},
			handleSubmitTel(tel) {
				// 提交联系方式
				const regex = /^1[3-9]\d{9}$/;
				if (!regex.test(tel)) {
					return this.$util.Tips({
						title: '请填写准确格式的手机号码'
					});
				}
				this.loading = true
				submitContactUs({
					"phone": tel,
					"type": this.type,
				}).then(res => {
					this.$util.Tips({
						title: '提交成功'
					});
				}).catch(err => {
					this.$util.Tips({
						title: '提交失败'
					});
				}).finally(() => {
					this.loading = false
					this.isSecondDrawerShow = false
					this.isFirstDrawerShow = false
				})

			},
		}
	}
</script>

<style lang="scss" scoped>
	.box {
		height: 130rpx;
	}

	.contact-btn {
		position: relative;
		top: 0;
		left: 50%;
		transform: translateX(-50%);
		width: 100%;
		height: 112rpx;
		border-radius: 94rpx;
		display: flex;
		background: #EFEFEF;
		border-radius: 16rpx;

		.zixun {
			width: 240rpx;
			font-size: 26rpx;
			color: #333333;
			line-height: 36rpx;
			position: relative;
			top: 50%;
			left: 50%;
			transform: translate(-50%,-50%);

			.img {
				width: 40rpx;
				height: 40rpx;
				position: absolute;
				top: 50%;
				left: 50rpx;
				transform: translate(-50%,-50%);
			}

			.lianxi {
				height: 40rpx;
				position: absolute;
				line-height: 40rpx;
				top: 50%;
				left: 130rpx;
				transform: translate(-50%,-50%);
				white-space: nowrap;
			}
		}

	}
</style>