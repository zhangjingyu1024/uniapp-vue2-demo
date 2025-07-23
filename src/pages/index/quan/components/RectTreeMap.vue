<!--
 * @Author: zhangjingyu
 * @Date: 2024-11-21
 * @LastEditors: zhangjingyu
 * @FilePath: \lixue-psych-uniapp\pages\index\quan\components\RectTreeMap.vue
 * @Description:echat卡片，根据占比展示面积布局
-->
<template>
	<l-echart ref="chartRef" @finished="init"></l-echart>
</template>

<script>
	import * as echarts from "echarts";
	export default {
		name: "RectTreeMap",
		props: {
			treeData: {
				type: Array,
				default: () => [],
			},
			windowWidth: {
				type: Number,
				default: 750,
			},
			type: {
				type: String,
				default: 'family'
			},
			isPercentageShow: {
				type: Boolean,
				default: true
			}
		},
		computed: {
			fontProportion() { // 字体百分比适配占比
				return this.windowWidth / 750
			}
		},
		data() {
			return {
				options: {
					grid: {
						left: 0,
						right: 0,
						top: 0,
						bottom: 0
					},
					series: [{
						width: '100%',
						height: '100%',
						type: "treemap",
						squareRatio: 0.74,
						data: this.treeData,
						roam: false,
						upperLabel: {
							show: false,
						},
						emphasis: false,
						breadcrumb: false, // 移除面包屑
						nodeClick: false, // 关闭点击下钻放大
						levels: [{
							itemStyle: {
								borderColor: "transparent",
							},
						}, ],
						labelLayout: (params) => {
							return {
								x: params.rect.x + params.rect.width / 2,
								y: params.labelRect.y + params.rect.height / 2,
							};
						},

					}, ],
				},
				chart: null,
			};
		},
		created() {},
		watch: {
			treeData: {
				immediate: true,
				handler: function() {
					this.$nextTick().then(() => {
						this.options.series[0].data = this.formatTree(this.treeData)
						this.init()
					})
				}
			}
		},
		methods: {
			formatTree(tree) {
				if (!tree) return
				const mapTree = tree.map((item) => ({
					...item,
					itemStyle: {
						borderWidth: item.name ? 4 : 0,
						borderColor: "transparent",
						borderRadius: 12,
						color: {
							type: 'linear',
							x: 0,
							y: 0,
							x2: 1,
							y2: 0,
							colorStops: [{
								offset: 0,
								color: item.color[0] // 0% 处的颜色
							}, {
								offset: 1,
								color: item.color[1] // 100% 处的颜色
							}],
							global: false // 缺省为 false
						}

					},
					children: this.formatTree(item.children)
				}))
				return mapTree
			},
			async init() {
				const isPer = this.isPercentageShow
				this.options.series[0].label = {
					formatter: function(params) {
						const arr = [
							params.data.name && `{name|${params.data.name.replace(/\\n/g, "\n")}}`,
							params.data.orderCountPercentage && isPer && `{percentText|${params.data.orderCountPercentage}%}`,
						]
						return arr.filter((v) => v).join('\n');
					},
					align: 'center', // 水平居中
					verticalAlign: 'middle', // 垂直居中
					offset: [0, 0], // 根据需要调整偏移量
					rich: {
						name: {
							color: '#ffffff',
							fontSize: 40 * this.fontProportion || 20,
							lineHeight: 50 * this.fontProportion || 25
						},
						percentText: {
							fontSize: 30 * this.fontProportion || 20,
							color: '#ffffff',
							lineHeight: 50 * this.fontProportion || 25
						},
					}
				}
				// chart 图表实例不能存在data里
				this.chart = await this.$refs.chartRef.init(echarts);
				this.chart.on("click", (e) => {
					let text = e.data?.name

					uni.navigateTo({
						url: `/pages/list/index?color=linear-gradient(270deg, ${e.data.color[1]}, ${e.data.color[0]})&id=${e.data.id}&listType=${this.type}`
					})
				});
				// 自适应大小
				window.onresize = () => {
					this.chart.resize();
				};

				this.chart.setOption(this.options);
			},
		},
	};
</script>

<style scoped>
	{}
</style>
<style>
	.right-top-per {
		color: red
	}
</style>