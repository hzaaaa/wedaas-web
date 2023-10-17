<template>
	<div class="advanced-search-wrapper" :style="{ width: isCollapse ? '16px' : '224px' }">
		<div style="display: flex; justify-content: space-between; align-items: center">
			<div style="display: flex; align-items: center" v-show="!isCollapse">
				<el-icon><ArrowLeft /></el-icon><span>返回</span>
			</div>

			<el-icon class="collapse-icon" @click="isCollapse = !isCollapse" style="align-self: flex-start">
				<component :is="isCollapse ? 'expand' : 'fold'"></component>
			</el-icon>
		</div>

		<div class="search-form-wrapper" style="margin-top: 20px; width: 224px">
			<div class="mask" :style="{ width: isCollapse ? '100%' : '0' }"></div>
			<div style="display: flex; justify-content: space-between">
				<span class="sub-title">基本信息</span>
				<div>
					<el-icon color="blue"><EditPen /></el-icon><span>编辑</span>
				</div>
			</div>
			<el-divider />
			<div class="filter-criteria">
				<div class="table-detail-info">
					<span>表名:</span><span>ods_cfx_admin_full</span
					><el-icon v-if="!tableFollow" @click="tableFollow = true"><Star /></el-icon
					><el-icon @click="tableFollow = false" v-else><StarFilled /></el-icon>
				</div>
				<div class="table-detail-info"><span>数据源:</span><span>CHDHIVE元数据</span></div>
				<div class="table-detail-info"><span>数据库:</span><span>cfx_dingsun</span></div>
				<div class="table-detail-info"><span>表名:</span><span>ods_cfx_admin_full</span></div>
				<div class="table-detail-info"><span>数据源:</span><span>CHDHIVE元数据</span></div>
				<div class="table-detail-info"><span>数据库:</span><span>cfx_dingsun</span></div>
				<div class="table-detail-info"><span>总行数:</span><span>0</span></div>
				<div class="table-detail-info"><span>字段数:</span><span>7</span></div>
				<div class="table-detail-info"><span>描述:</span><span>渠道公司主体表</span></div>
				<div class="table-detail-info"><span>目录:</span><span>暂无</span></div>
				<div class="table-detail-info"><span>业务主体部门:</span><span>暂无</span></div>
				<div class="table-detail-info"><span>业务定义:</span><span>暂无</span></div>
				<div class="table-detail-info"><span>IT负责人:</span><span>暂无</span></div>
				<div class="table-detail-info"><span>备注:</span><span>暂无</span></div>
				<div class="table-detail-info"><span>标签:</span><span>暂无</span></div>
				<div class="table-detail-info"><span>已关注的用户:</span><span>暂无</span></div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const isCollapse = ref(false);
const tableFollow = ref(false);
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
		.table-detail-info {
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
