<template>
	<view class="liveNotice">
		<view class="box skeleton-rect">
			<view class="left">
				<view><text class="ymfont ym-tongzhi"></text></view>
				<view class="info">
					<view class="title">直播预告 </view>
					<view class="content oneline">相控阵超声检测全套课程</view>
					<text class="ymfont ym-arrow-rightjiantou-you2"></text>
				</view>
				
			</view>
			<view class="right">
				<text class="ymfont ym-guanbi"></text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'ymMessage',
		props: {
		
		},
		data() {
			return {
				
			};
		},
		created() {},
		mounted() {
			
		},
		methods: {
			
		}
	};
</script>

<style lang="scss">
	.liveNotice {
		padding: 1.6vw 4.267vw;
		background-color: #fff;
		.box {
			height: 10.667vw;
			background:  var(--view-theme);;
			border-radius: 1.067vw;
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 0 3.2vw;
			color: #fff;
			.left {
					display: flex;
					align-items: center;
					flex: 1 1;
					overflow: hidden;
					.info {
						display: flex;
						align-items: center;
						flex: 1 1;
						.title {
							margin-left: 1.6vw;
							font-size: 3.2vw;
							font-weight: 500;
							
						}
						.content {
							font-size: 3.2vw;
							color: hsla(0,0%,100%,.8);
							padding-left: 2.667vw;
							position: relative;
							max-width: 48vw;
							overflow: hidden;
							margin-right: 1.067vw;
							
						}
						.ym-arrow-rightjiantou-you2{
							font-size: 3.2vw;
							color: hsla(0,0%,100%,.8);
						}
						.oneline {
							white-space: nowrap;
							overflow: hidden;
							text-overflow: ellipsis;
							-o-text-overflow: ellipsis;
							-webkit-text-overflow: ellipsis;
							-moz-text-overflow: ellipsis;
						}
						.content:after {
									content: "";
									width: 1px;
									height: 24rpx;
									background: #fff;
									position: absolute;
									top: 6rpx;
									left: 1.067vw;
									z-index: 100;
						}
				
					}
			}
			.right {
				margin-left: 6.4vw;
				display: flex;
				flex-shrink: 0;
				align-items: center;
			}
		}
	}
</style>
