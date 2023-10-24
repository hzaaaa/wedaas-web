<template>
	<div class="dataExploration" style="">
		<div class="dataExploration-title">
			探查结果
			<div class="abs-header">
				<div class="btns">
					<el-button> 手动刷新 </el-button>
					<el-button type="primary"> 导出 </el-button>
				</div>
				<!-- <div class="mt5" style="font-weight: 400; font-size: 13px; line-height: 16px; color: #b0b1b4">
					部分数据无历史记录,如需全部，请手动刷新!
				</div> -->
			</div>
		</div>
		<div class="result-block thin-scrollbar">
			<div class="result-item" v-for="item in 10">
				<div class="item-header">
					<span class="key">字段</span>
					<span class="value">dt</span>
					<span class="type">字符类型</span>
					<span class="desc">暂无</span>
				</div>
				<div class="item-title">基础设置</div>
				<div class="content-box">
					<div class="item-box" v-for="item2 in 5">
						<div class="item-title">空值率</div>
						<div class="show-data-box">
							<div class="show-data-left">
								<div class="data-item">数据</div>
								<div class="data-item">1</div>
								<div class="data-item">2</div>
								<div class="data-item">3</div>
							</div>
							<div class="show-data-right">
								<div class="data-item">值</div>
								<div class="data-item">0</div>
								<div class="data-item">0</div>
								<div class="data-item">0</div>
							</div>
						</div>
						<div class="fiel-value">
							<div class="nullvalspan">0%</div>
						</div>
						<el-progress class="progressbar" :show-text="false" :percentage="50" />
					</div>
				</div>
				<div class="btn-wrap">
					<el-button class="mb16" type="primary"> 探查设置 </el-button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import {} from "vue";
</script>

<style lang="scss" scoped>
* {
	box-sizing: border-box;
}
.abs-header {
	// position: absolute;
	// top: 0;
	// right: 0;
	// width: 232px;
	// height: 32px;
}
.dataExploration {
	flex: 1;
	height: 0;
	display: flex;
	flex-direction: column;
	overflow: auto;
	.dataExploration-title {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-weight: 500;
		font-size: 14px;
		line-height: 16px;
		color: var(--colormaintext);
	}
	.result-block {
		overflow: auto;
		.result-item {
			padding-top: 16px;
			border-bottom: 1px dashed var(--bc);
			.item-header {
				font-weight: 400;
				font-size: 13px;
				line-height: 16px;
				.key {
					color: var(--colormaintext);
				}
				.value {
					margin-left: 4px;
				}
				.type {
					margin: 0 24px;
				}
				.desc {
					color: var(--coloroptext);
				}
			}
			.item-title {
				font-weight: 400;
				font-size: 13px;
				line-height: 16px;
				color: var(--colormaintext);
				margin: 8px 0 8px;
			}
			.content-box {
				width: 99%;
				display: flex;
				position: relative;
				flex-wrap: wrap;
				.item-box {
					position: relative;
					width: 256px;
					height: 176px;
					background: #fff;
					border-radius: 8px;
					border: 1px solid var(--bc);
					margin-right: 20px;

					padding: 16px 24px;
					margin-bottom: 10px;

					color: #777;
					.item-title {
						display: flex;
						justify-content: flex-start;
						align-items: center;
					}
					.show-data-box {
						position: relative;
						width: 100%;
						height: 108px;
						overflow: hidden auto;
						display: flex;

						.show-data-left {
							width: 50%;
							text-align: left;
							.data-item {
								font-size: 12px;
							}
						}
						.show-data-right {
							width: 50%;
							text-align: right;
							.data-item {
								font-size: 12px;
							}
						}
					}
					.fiel-value {
						position: absolute;
						bottom: 32px;
						right: 18px;
						.nullvalspan {
							font-size: 12px;
						}
					}
					.progressbar {
						position: absolute;
						width: 84%;
						height: 16%;
						padding: 0;
						top: 85%;
						left: 8%;
						align-items: flex-start;
					}
				}
			}
			.btn-wrap {
				text-align: right;
				padding: 0 32px;
			}
		}
	}
}
</style>
