<template>
	<view class="productDetail" :style="colorStyle">
		<view class="headerBody">
		 <img  :src="val.imageUrl">
		</view>
		<detail :val="val" type="series"></detail>
		<ymRight/>
		<buyMenu :val="val" type="series"></buyMenu>
	</view>
</template>

<script>
//#ifdef H5
import Player from 'xgplayer';
import HlsPlugin from 'xgplayer-hls';
import Danmu from 'xgplayer/es/plugins/danmu'
import 'xgplayer/dist/index.min.css';
import 'xgplayer/es/plugins/danmu/index.css'
//#endif
import colors from '@/mixins/color.js';
import ymRight from '@/pages/index/start/components/ymRight';
import parser from '@/components/jyf-parser/jyf-parser';
import detail from '@/pages/product/components/detail';
import buyMenu from '@/pages/product/components/buyMenu';
import {
	getCourseInfo
} from '@/api/course.js'

export default {
	name: 'ProductDetail',
	props: {
	
	},
	mixins: [colors],
	data() {
		return {
			number:0,
			val:{
				type:"",
			},
			teacher:{
				nickName:"",
				avatar:"",
				remark:"",
				teacherId:0,
			},
			musicList:[],
			//  url: "//sf1-cdn-tos.huoshanstatic.com/obj/media-fe/xgplayer_doc_video/music/audio.mp3",
			
		}
	},
	components: {
		ymRight,
		parser,
		detail,
		buyMenu
	},
	created() {
		
	},
	onLoad(options) {
		if(options.number){
			this.number=options.number
		}
		
	},
	onReady: function (res) {
		
	},
	onShow() {
		this.loadInit()
	},
	mounted() {
	},
	methods: {
		async loadInit(){
			uni.showLoading({ title: '加载中' })
			this.val= await this.loadDate()
			uni.hideLoading()
		},
		
		loadDate(){
			let that=this;
			return new Promise((resolve, reject) => {
				getCourseInfo(that.number).then(res => {
					let data=res.data
					if(data.type!="live"){
					//其他
						if(data.teachers.length>0){
							that.teacher.nickName=data.teachers[0].nickName
							that.teacher.avatar=data.teachers[0].avatar
							that.teacher.teacherId=data.teachers[0].teacherId
							that.teacher.remark=data.teachers[0].remark
						}
					}else{
					//直播
					}
					resolve(data);
				}).catch((error) => {
					reject(error);
				});
			})
		},
		tabSelect(idx){
			this.active=idx
		},
		
		goExam: function() {
			uni.navigateTo({
				url: `/pages/exam/exam_list/index`
			})
		},
		goTeacher: function() {
			uni.navigateTo({
				url: `/pages/product/teacher_detail/index`
			})
		},
		videoErrorCallback: function(e) {
			console.log(e)
			uni.showModal({
				content: e.target.errMsg,
				showCancel: false
			})
		},
	}
};
</script>

<style lang="scss">
	.productDetail{
		.headerBody{
			width: 100vw;
    		min-height: 420rpx;
			position: relative;
			#vs{
				position:absolute;
				bottom:0;
			}
			#myVideo{
				width:100%;
				height:100%;
			}
			img{
				width:100%;
				height:100%;
			}
			.playerWarp{
				position: absolute;
				left: 0;
				top: 0;
				width: 100vw;
				height: 420rpx;
			}
			.videoPlayBtn{
				position: absolute;
				left: 0;
				right: 0;
				top: 0;
				bottom: 0;
				margin: auto;
				text-align: center;
				display: flex;
				align-items: center;
				justify-content: center;
				width:120rpx;
				.ym-bofang1{
					font-size:120rpx;
					color:#fff;
					 background-color: rgba(0, 0, 0, 0.5);
					 border-radius:50%;
				}
				img{
					width:100;
					height:auto
				}
			}
			.icon-24gf-play{
				font-size: 70rpx;
				color:#fff;
			}
		}
	}

</style>
