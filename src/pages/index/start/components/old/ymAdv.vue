<template>
	<view class="advertisement-large">
		<view  class="pxindBox">
			<img src="https://ark-prod-cdn-images.iqihang.com/image/20240603/2b565b3ae238420597df80c42bb2e67e.jpg">
		</view>
		<view class="advertisement">
			<view>
				<img  src="https://ark-prod-cdn-images.iqihang.com/image/20240524/d3fe58a5966146ed8c4d7546a7de2ea3.png" >
			</view>
			<view>
				<img  src="https://ark-prod-cdn-images.iqihang.com/image/20240603/8221d1d8b0464331867829e021fc2928.png" >
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'ymMenus',
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
	.advertisement-large {
		    display: flex;
			justify-content: space-between;
			padding: 30rpx 20rpx 30rpx 20rpx;
			background:#fff;
			.pxindBox {
				 height: 240rpx;
				 width: 350rpx;
				img{
					display: block;
					width: 100%;
					height: 100%;
					border-radius: 10rpx;
				}
			}
			.advertisement{
				display: flex;
				justify-content: space-between;
				flex-direction: column;
				 width: 350rpx;    
				img{
					display: block;
					width: 100%;
					height: 115rpx;
					border-radius: 10rpx;
				}
			}
	}
</style>
