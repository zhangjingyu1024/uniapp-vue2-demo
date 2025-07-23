<!--
 * @Author: zhangjingyu
 * @Date: 2024-11-22
 * @LastEditors: zhangjingyu
 * @FilePath: \lixue-psych-uniapp\src\components\familyVotePopup.vue
 * @Description: 家庭关心问题投票弹窗
-->
<template>
	<view v-if="isVisible" class="popup">
		<view class="box">
			<view class="circle">
				投票
			</view>
			<template v-if="step=== 1">
				<view class="question-age">
					<text>您孩子的年龄段是？</text>
				</view>
				<view class="age-choose-item" v-for="(item, index) in ageAreas" :key="item.id"
					:style="{ background: item.active ? '#FFAC24': '#FFFFFF'}" @click="ageItemClick(item, index)">
					{{item.name}}
				</view>
				<view class="next-btn" @click="handleNext">
					下一步
				</view>
			</template>
			<template v-if="step=== 2">
				<view class="question">
					<text>您当前最关心的养育问题(可选三项)</text><br />
					<text>平台不断上新的课程，与您的选择息息相关</text>
				</view>
				<view class="choose-box">
					<view class="item-choose" v-for="(item,index) in list" :key="item.id"
						@click="itemClick(item, index)" :style="{ background: item.active ? '#FFAC24': '#FFFFFF'}">
						{{item.name}}
					</view>
				</view>
				<view class="other-question">
					<text>其他问题</text>
				</view>
				<view class="other-question-input">
					<textarea class="textarea" placeholder="具体问题描述" :maxlength="30" v-model="otherInput">
					</textarea>
				</view>
				<view class="submit" @click="handleSubmit">
					提交
				</view>
			</template>
			<template v-if="step === 3">
				<view class="voted-box">
					<img src="/static/images/img-vote-s.png" alt="您已投票" />
					<text class="voted-text"> 您已经投过票了!</text>
				</view>
				<view class="finish" @click="closeModal">
					完成
				</view>
			</template>
			<view class="close" @click="closeModal">
			</view>
		</view>
	</view>
</template>

<script>
	import * as homeApi from '@/api/quan/home.js'
	export default {
		name: 'VotePopup',
		props: {
			value: {
				type: Boolean,
				default: false
			},
		},
		data() {
			return {
				isVisible: this.value,
				step: 1,
				otherInput: '',
				isVoted: false,
				list: [],
				ageAreas: [],
				currentCategoryId: ''
			};
		},
		computed: {
			summation() {
				let sum = 0;
				this.list.forEach((itm) => {
					sum += itm.value;
				});
				return sum
			},
		},
		watch: {
			value(newVal) {
				this.isVisible = newVal;
			},
			isVisible(newVal) {
				this.$emit('input', newVal);
				this.$util.setNoScroll(newVal)
				if (newVal) {
					this.getVoteList()
				}
			}
		},
		methods: {
			closeModal() {
				this.isVisible = false;
				this.list.forEach((v, i) => {
					this.$set(v, 'active', false)
				})
			},
			async getVoteList() {
				uni.showLoading({
					title: "加载中..."
				});
				this.step = 1
					const res = await homeApi.getCategory(null)
					const ageAreas = this.getLeafNodes(res.data[0])
					ageAreas.forEach((item) => {
						this.$set(item, 'active', false)
					})
					this.ageAreas = ageAreas
					uni.hideLoading();
			},
			onInput(e) {
				const text = this.$refs.otherIpt.$el.innerText || ''
				console.log()
				if (text.length > 30) {
					this.otherInput = text.slice(0, 30);
				} else {
					this.otherInput = text;
				}
			},
			// 获取最底层children
			getLeafNodes(root) {
			  let leafNodes = [];
			
			  function traverse(node) {
			    // 如果当前节点没有 children 属性，或者 children 数组为空，则为叶子节点
			    if (!node.children || node.children.length === 0) {
			      leafNodes.push(node);
			    } else {
			      // 否则，递归遍历每个子节点
			      node.children.forEach(child => traverse(child));
			    }
			  }
			
			  traverse(root);
			  return leafNodes;
			}
,
			async handleNext(item) {
				const list = this.ageAreas.filter(item => item.active)
				if (list.length < 1) {
					return this.$util.Tips({
						title: '请选择年龄段'
					});
				}
				this.step++
				uni.showLoading({
					title: "加载中..."
				});
				try {
					const res = await homeApi.getVoteTags(this.currentCategoryId)
					if (res?.data?.isVote) {
						this.step = 3
					} else {
						this.step = 2
						this.list = res.data.data.map(itm => {
							return {
								...itm,
								active: false
							}
						})
					}
				} catch (e) {
					this.$emit('input', false);
					this.$util.setNoScroll(false)
					console.error('getVoteTagsError:', e)
				}
				uni.hideLoading();
			},
			handleSubmit() {

				const list = this.list.filter(item => item.active)
				if (list.length < 1) {
					return this.$util.Tips({
						title: '请至少选择一个最关心的话题'
					});
				}
				const labels = this.list.filter(item => item.active).map(v => v.id)
				homeApi.vote({
					categoryId: this.currentCategoryId,
					labels,
					other: this.otherInput
				}).then(res => {
					this.closeModal()
					this.$util.Tips({
						title: '提交成功！'
					});
					this.step++
				}).catch(
					(err) => {
						console.error(err)
					})

			},
			itemClick(item, index) {
				let num = 0
				this.list.forEach((v, i) => {
					if (v.active) {
						num++
					}
				})
				if (num > 3) return;
				if (item.active) {
					this.$set(this.list[index], 'active', false)
				} else {
					if (num === 3) {
						return this.$util.Tips({
							title: '最多选择3个'
						});
					} else {
						this.$set(this.list[index], 'active', true)
					}
				}
				this.$forceUpdate()
			},
			ageItemClick(item, index) {
				this.ageAreas.forEach((v, i) => {
					v.active = false
				})
				this.$set(this.ageAreas[index], 'active', true)
				this.currentCategoryId = item.id
				this.$forceUpdate()
			}
		}
	};
</script>

<style lang="scss" scoped>
	.popup {
		height: 100%;
		height: 100vh;
		position: fixed;
		width: 100%;
		top: 0;
		left: 0;
		z-index: 999;
		background-color: rgba(0, 0, 0, 0.5);
		overflow: auto;

		.box {
			width: 688rpx;
			background: #FFFFFF;
			border-radius: 24rpx;
			border: 2rpx solid #979797;
			margin: 0 auto;
			position: absolute;
			top: 10%;
			left: 50%;
			transform: translate(-50%, 0%);
			padding-bottom: 48rpx;

			.voted-box {
				width: 100%;
				padding: 114rpx 120rpx 68rpx 120rpx;
				position: relative;

				img {
					object-fit: contain;
				}

				.voted-text {
					position: absolute;
					bottom: 76rpx;
					left: 50%;
					transform: translateX(-50%);
					text-align: center;
					font-size: 32rpx;
					font-family: PingFang-SC-Medium;
					overflow-wrap: break-word;
					color: rgba(153, 153, 153, 1);
				}
			}

			.circle {
				width: 142rpx;
				height: 142rpx;
				background: #F2F1F6;
				border-radius: 50%;
				position: absolute;
				top: 0;
				left: 50%;
				transform: translate(-50%, -42rpx);
				text-align: center;
				line-height: 120rpx;
				font-family: PingFang-SC, PingFang-SC;
				font-weight: 700;
				font-size: 32rpx;
				color: #333333;
				border: 10px solid #FFFFFF;
			}

			.question {
				height: 44rpx;
				font-family: PingFang-SC, PingFang-SC;
				font-size: 32rpx;
				color: #333333;
				line-height: 44rpx;
				text-align: left;
				margin-top: 136rpx;
				text-align: center;
				margin-bottom: 38rpx;
				font-weight: 600;
				margin-bottom: 50rpx;
			}

			.choose-box {
				padding: 42rpx 56rpx 32rpx 56rpx;
				display: flex;
				flex-wrap: wrap;

				.item-choose {
					width: 30%;
					height: 100rpx;
					background: #FFFFFF;
					box-shadow: 0rpx 0rpx 16rpx 0rpx #E0DFE3;
					border-radius: 16rpx;
					font-family: PingFang-SC, PingFang-SC;
					font-weight: bold;
					font-size: 32rpx;
					color: #333333;
					line-height: 100rpx;
					text-align: center;
					margin: 8rpx;
					 
				}
			}

			.other-question {
				height: 44rpx;
				font-family: PingFang-SC, PingFang-SC;
				font-weight: bold;
				font-size: 32rpx;
				color: #333333;
				line-height: 44rpx;
				text-align: left;
				font-style: normal;
				padding-left: 62rpx;
				margin-bottom: 32rpx;
			}

			.other-question-input {
				margin: 0 62rpx;
				height: 172rpx;
				background: #FFFFFF;
				box-shadow: 0rpx 0rpx 20rpx 0rpx rgba(192, 192, 192, 0.5);
				border-radius: 16rpx;
				margin-bottom: 32rpx;
				font-size: 32rpx;
				padding: 12rpx;

				.textarea {
					display: block;
					width: 100%;
					height: 100%;
				}
			}

			.next-btn,
			.submit,
			.finish {
				width: 244rpx;
				height: 88rpx;
				background: #FFAC24;
				box-shadow: 0rpx 0rpx 16rpx 0rpx #E0DFE3;
				border-radius: 16rpx;
				margin: 0 auto;
				font-family: PingFang-SC, PingFang-SC;
				font-weight: 500;
				font-size: 32rpx;
				color: #FFFFFF;
				line-height: 88rpx;
				text-align: center;
				font-style: normal;
			}

			.submit {
				margin-top: 32rpx;
			}

			.question-age {
				height: 44rpx;
				font-family: PingFang-SC, PingFang-SC;
				font-weight: bold;
				font-size: 32rpx;
				color: #333333;
				line-height: 44rpx;
				text-align: left;
				font-style: normal;
				padding-left: 44rpx;
				margin-top: 136rpx;
				margin-bottom: 38rpx;
			}

			.age-choose-item {
				height: 88rpx;
				background: #FFFFFF;
				box-shadow: 0rpx 0rpx 16rpx 0rpx #E0DFE3;
				border-radius: 50rpx;
				font-family: PingFang-SC, PingFang-SC;
				font-weight: bold;
				font-size: 32rpx;
				line-height: 88rpx;
				color: #333333;
				padding-left: 60rpx;
				margin: 0 46rpx 20rpx 44rpx;
			}

			.close {
				position: absolute;
				bottom: -100rpx;
				left: 50%;
				width: 88rpx;
				height: 88rpx;
				transform: translateX(-50%);
				background-image: url('/static/images/pop-close.png');
				background-size: 100% 100%;
			}
		}
	}
</style>