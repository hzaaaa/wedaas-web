<template>
	<div class="advanced-search-wrapper" :style="{ width: isCollapse ? '16px' : '224px' }">
		<el-icon class="collapse-icon" @click="isCollapse = !isCollapse" style="float: right">
			<component :is="isCollapse ? 'expand' : 'fold'"></component>
		</el-icon>
		<div class="search-form-wrapper" style="margin-top: 20px; width: 224px">
			<div class="mask" :style="{ width: isCollapse ? '100%' : '0' }"></div>
			<div class="component-title">
				<el-icon><Search /></el-icon>
				<span>高级搜索</span>
			</div>
			<el-input v-model="input1" size="large" placeholder="Please Input" prefix-icon="Search" />
			<div>
				<span class="sub-title">筛选条件</span>
			</div>
			<el-divider />
			<div class="filter-criteria">
				<span class="filter-title">数据源</span>
				<el-select v-model="value" class="m-2" placeholder="Select" size="large">
					<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
				</el-select>
				<el-select v-model="value" class="m-2" placeholder="Select" size="large">
					<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
				</el-select>
				<el-divider border-style="dotted" />
				<span class="filter-title">数据目录</span>
				<el-select v-model="value" class="m-2" placeholder="Select" size="large">
					<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
				</el-select>
				<span class="filter-title">数据标签</span>
				<el-select v-model="value" class="m-2" placeholder="Select" size="large">
					<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
				</el-select>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const isCollapse = ref(false);
const input1 = ref("");

const value = ref("");

const options = [
	{
		value: "Option1",
		label: "Option1",
	},
	{
		value: "Option2",
		label: "Option2",
	},
	{
		value: "Option3",
		label: "Option3",
	},
	{
		value: "Option4",
		label: "Option4",
	},
	{
		value: "Option5",
		label: "Option5",
	},
];
</script>

<style lang="scss" scoped>
.advanced-search-wrapper {
	display: flex;
	overflow: hidden;
	flex-direction: column;
	flex-shrink: 0;
	padding: 10px 12px;
	width: 224px;
	background-color: #fff;

	// transform-origin: left;
	transition: width 0.3s ease;
	.collapse-icon.el-icon {
		align-self: flex-end;
		&:hover {
			cursor: pointer;
		}
	}
	.search-form-wrapper {
		position: relative;
		.mask {
			position: absolute;
			right: 0;
			z-index: 999;
			width: 0;
			height: 100%;
			background-color: #fff;
			transition: width 0.2s ease;
		}
	}
	.component-title {
		display: flex;
		align-items: center;
		margin-bottom: 10px;
		padding: 6px 4px;
		border-radius: 4px;
		background-color: #ccc;
	}
	.sub-title {
		&::before {
			display: inline-block;
			margin-right: 5px;
			border-radius: 2px;
			width: 2px;
			height: 12px;
			background: #e46307;
			content: "";
		}
	}
	.filter-criteria {
		display: flex;
		flex-direction: column;
		.filter-title {
			margin-top: 10px;
		}
	}
	.el-divider {
		margin: 0;
	}
	.el-input,
	.el-select {
		margin-bottom: 14px;
	}
}
</style>
