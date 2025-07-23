<template>
	<view :style="colorStyle">
		<view class="main_content">
			<view class="integralWrap">
				<view style="height: 13.333vw;box-shadow: 0 1px 1px 0 rgba(0,0,0,.06);">
					<view class="tabsWrap">
						<view class="tab activeTab">
							<text class="tabName">店铺消息</text>
							<view class="underline"></view>
						</view>
						<view class="tab">
							<text class="tabName">店铺公告</text>
						</view>
					</view>
				</view>
				<view class="messageList">
					<view class="noticeItem" >
						<view class="icon">
							<text class="ymfont ym-tongzhi"></text>
						</view>
						<view class="info">
							<view class="title twoLine">小红书引爆种草训练营-第十五期</view>
							<view class="create_tim">2024/05/06 14:39:50</view>
							<view class="LinesEllipsis">报名后请第一时间添加班主任微信，方可进入学习大群和小组群。（若在开营前未添加班主任则视为自动退</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<ymRight/>
	</view>
</template>

<script>
import colors from '@/mixins/color.js';
import ymRight from '@/pages/index/start/components/ymRight';
export default {
	name: 'Message',
	props: {
	
	},
	mixins: [colors],
	components: {
			ymRight
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
	.main_content {
		min-height: calc(100vh - 29.333vw);
		.integralWrap{
			width: 100%;
    		background: #fff;
			.header {
				position: relative;
				width: 100%;
				height: 37.333vw;
				border-radius: 0 0 5.333vw 0;
				background: var(--view-theme);
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				.headerBg {
						position: absolute;
						left: 0;
						top: 0;
						width: 100%;
						height: 100%;
						z-index: 1;
				}
				.integralTotal {
					position: absolute;
					top: 4.267vw;
					left: 6.4vw;
					font-size: 3.2vw;
					color: #fff;
					line-height: 4.533vw;
					z-index: 10;
				}
				.rule {
					position: absolute;
					right: 4.267vw;
					top: 4.267vw;
					width: 17.067vw;
					height: 4.8vw;
					background: hsla(0,0%,100%,.24);
					border-radius: 2.4vw;
					font-size: 3.2vw;
					color: #fff;
					line-height: 4.8vw;
					display: flex;
					align-items: center;
					justify-content: center;
					z-index: 10;
				}
				.integralSurplus {
					font-size: 8vw;
					color: #fff;
					line-height: 11.2vw;
					font-weight: 600;
					z-index: 10;
				}
				.tips {
					font-size: 3.2vw;
					color: #fff;
					line-height: 4.533vw;
					z-index: 10;
				}
			}
			.tabsWrap{
				    width: 100vw;
					height: 13.333vw;
					background: #fff;
					display: flex;
					align-items: center;
					justify-content: space-around;
					.tab {
						position: relative;
						width: 18.667vw;
						height: 100%;
						display: flex;
						align-items: center;
						justify-content: center;
						font-size: 3.733vw;
						color: #999;
						.tabName {
							font-size: 4.267vw;
							font-weight: 700;
						}
						.underline {
							position: absolute;
							left: 0;
							right: 0;
							bottom: 0;
							margin: auto;
							width: 3.2vw;
							height: 0.8vw;
							background: var(--view-theme) !important;
							border-radius: 0.533vw;
						}
					}
					.activeTab {
						color: #333;
						font-size: 4.267vw;
    					font-weight: 700;
					}
			}
			.messageList{
				padding-top: 3.2vw;
				.noticeItem {
					padding: 4.267vw 4.267vw 4.267vw 0;
					margin-left: 4.267vw;
					border-bottom: 1px solid #f6f6f6;
					display: flex;
					position: relative;
					.icon {
						margin-right: 2.133vw;
					}
					.info {
						position: relative;
						padding-bottom: 5.333vw;
						 .title {
							font-size: 4.267vw;
							font-weight: 700;
							color: #666;
							margin-bottom: 1.6vw;
						}
						.create_time {
							font-size: 3.2vw;
							color: #999;
							margin-bottom: 1.333vw;
						}
					}
				}
			}
			
		}
	}
</style>
