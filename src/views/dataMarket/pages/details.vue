<template>
	<div class="marketDetails">
		<div class="left-block thin-scrollbar">
			<div class="head-title" style="margin: 14px 0">
				{{ allData.name }}
			</div>
			<div class="body-content">
				<ul class="list">
					<li class="item">所属主目录：{{ allData.apiCatalogRoot.name }}</li>
					<li class="item">所属子目录：{{ allData.apiCatalogChild.name }}</li>
					<li class="item">创建人：{{ allData.createBy }}</li>
					<li class="item">创建时间：{{ allData.createTime }}</li>
					<li class="item">调用次数：{{ allData.executeCount }}</li>
					<li class="item">
						{{
							allData.description +
							allData.description +
							allData.description +
							allData.description +
							allData.description +
							allData.description +
							allData.description +
							allData.description +
							allData.description +
							allData.description
						}}
					</li>
				</ul>
			</div>
			<div class="request-params">
				<div class="title">请求参数</div>
				<div class="request-body">
					<el-table class="common-table" :data="tableIndata" border>
						<el-table-column label="描述" prop="colDescription" show-overflow-tooltip></el-table-column>
						<el-table-column label="字段名" prop="fieldName" show-overflow-tooltip></el-table-column>
						<el-table-column label="类型" prop="columnType" show-overflow-tooltip></el-table-column>
						<el-table-column label="默认值" prop="defaultValue" show-overflow-tooltip></el-table-column>
						<el-table-column label="必填" prop="required" show-overflow-tooltip></el-table-column>
					</el-table>
				</div>
			</div>
			<div class="response-params">
				<div class="title">返回参数</div>
				<div class="response-body">
					<el-table class="common-table" :data="tableOutdata" border>
						<el-table-column label="描述" prop="colDescription" show-overflow-tooltip></el-table-column>
						<el-table-column label="字段名" prop="name" show-overflow-tooltip></el-table-column>
						<el-table-column label="类型" prop="columnType" show-overflow-tooltip></el-table-column>
						<el-table-column label="别名" prop="aliasName" show-overflow-tooltip></el-table-column>
					</el-table>
				</div>
			</div>
			<div class="details-foot">
				<div class="foot-item">
					<span class="label">数据源：</span>
					<span class="value">{{ allData.dbMessages.dsName }}</span>
				</div>
				<div class="foot-item">
					<span class="label">数据库：</span>
					<span class="value">{{ allData.dbMessages.dbName }}</span>
				</div>
				<div class="foot-item">
					<span class="label">表名：</span>
					<span class="value">{{ allData.dbMessages.tablesName }}</span>
				</div>
			</div>
		</div>
		<div class="right-block">
			<div class="right-top">
				<div class="hearder">
					<div class="text">您拥有该数据调用权限</div>
				</div>
				<div class="btn-block">
					<div class="mrtb-item mrtb-apbtn pointer" @click="openGetLinkDialogClick">获取链接</div>
					<div class="mrtb-item mrtb-getdata pointer" @click="openGetDataDialogClick">获取数据</div>
				</div>
			</div>
			<div class="right-top">
				<div class="hearder">
					<div class="text">您没有该数据调用权限</div>
					<div class="text">申请该数据权限</div>
				</div>
				<div class="btn-block">
					<div class="mrtb-item mrtb-getdata pointer" @click="openApplyForPermissionDialogClick">申请权限</div>
				</div>
			</div>

			<div class="right-bottom">
				<div class="title">{{ allData.name }}</div>
				<!-- <div class="desc more-ellipsis">

					{{ allData.description + allData.description + allData.description + allData.description }}
				</div> -->
				<tooltipWrap
					:content="allData.description + allData.description + allData.description + allData.description"
					class="desc more-ellipsis"
					type="y"
				></tooltipWrap>
				<div class="contact pointer" @click="openContactInfoDialogClick">数据接口联系人</div>
			</div>
		</div>
		<getLinkDialog ref="getLinkDialogRef" @refreshData=""></getLinkDialog>
		<getDataDialog ref="getDataDialogRef" @refreshData=""></getDataDialog>
		<applyForPermissionDialog ref="applyForPermissionDialogRef" @refreshData=""></applyForPermissionDialog>
		<contactInfoDialog ref="contactInfoDialogRef" @refreshData=""></contactInfoDialog>
	</div>
</template>

<script setup lang="ts">
import detailsDataJson from "./detailsData.json";
import getLinkDialog from "./getLinkDialog.vue";
import getDataDialog from "./getDataDialog.vue";
import contactInfoDialog from "./contactInfoDialog.vue";
import applyForPermissionDialog from "./applyForPermissionDialog.vue";
let allData = detailsDataJson.data;
const tableOutdata = ref([...allData.apiParamOut, ...allData.apiParamOut]);
const tableIndata = ref([...allData.apiParamIn, ...allData.apiParamIn]);
const getLinkDialogRef = <any>ref(null);
const getDataDialogRef = <any>ref(null);
const applyForPermissionDialogRef = <any>ref(null);
const contactInfoDialogRef = <any>ref(null);
const openGetLinkDialogClick = () => {
	getLinkDialogRef.value.acceptParams({
		row: {},
	});
};
const openGetDataDialogClick = () => {
	getDataDialogRef.value.acceptParams({
		row: {},
	});
};
const openApplyForPermissionDialogClick = () => {
	applyForPermissionDialogRef.value.acceptParams({
		row: {},
	});
};
const openContactInfoDialogClick = () => {
	contactInfoDialogRef.value.acceptParams({
		row: {},
	});
};
</script>

<style lang="scss" scoped>
* {
	box-sizing: border-box;
}
.marketDetails {
	flex: 1;
	height: 0;
	display: flex;
	width: 100%;
	.left-block {
		background: #fff;
		flex: 1;
		width: 0;
		min-height: 400px;
		margin-right: 16px;
		border-radius: 4px;
		padding: 24px;
		display: flex;
		flex-direction: column;
		overflow: auto;
		.head-title {
			font-style: normal;
			font-weight: 500;
			font-size: 14px;
			line-height: 16px;
			color: #171832;
		}
		.body-content {
			position: relative;
			padding-bottom: 16px;
			border-bottom: 1px solid #e8e8e8;

			width: 100%;
			.list {
				// width: 100%;
				.item {
					width: 100%;
					padding: 8px 0;
					font-weight: 400;
					font-size: 13px;
					line-height: 16px;
					color: rgba(39, 39, 46, 0.7);
				}
			}
		}
		.request-params {
			position: relative;
			padding-top: 24px;
			border-bottom: 1px solid rgba(39, 39, 46, 0.08);
			// flex: 1;

			// height: 0;
			max-height: calc((100% - 470px) / 2);
			min-height: 300px;
			display: flex;
			flex-direction: column;
			.title {
				font-weight: 500;
				font-size: 14px;
				line-height: 16px;
				color: #171832;
			}
			.request-body {
				flex: 1;
				height: 0;
				display: flex;
				flex-direction: column;
				padding: 16px 0 0;
				display: flex;
				flex-direction: column;
			}
		}
		.response-params {
			position: relative;
			padding-top: 24px;
			border-bottom: 1px solid rgba(39, 39, 46, 0.08);

			max-height: calc((100% - 470px) / 2);
			min-height: 300px;
			display: flex;
			flex-direction: column;
			.title {
				font-weight: 500;
				font-size: 14px;
				line-height: 16px;
				color: #171832;
			}
			.response-body {
				flex: 1;
				height: 0;
				display: flex;
				flex-direction: column;
				padding: 16px 0 0;
				display: flex;
				flex-direction: column;
			}
		}
		.details-foot {
			padding: 16px 0;
			height: 120px;
			.foot-item {
				.label {
					font-size: 13px;
					line-height: 16px;
					color: #171832;
				}
				.value {
					font-weight: 400;
					font-size: 13px;
					line-height: 16px;
					color: rgba(39, 39, 46, 0.7);
				}
			}
		}
	}
	.right-block {
		flex-shrink: 0;
		width: 280px;
		min-height: 400px;
		display: flex;
		flex-direction: column;
		.right-top {
			height: 248px;
			padding: 24px;
			text-align: center;
			background: #fff;
			margin-bottom: 16px;
			border-radius: 4px;

			.hearder {
				padding: 24px 0;
				.text {
					font-weight: 500;
					font-size: 13px;
					line-height: 16px;
					letter-spacing: 0.04em;
					color: #27272e;
				}
			}
			.btn-block {
				position: relative;
				border-top: 1px solid rgba(39, 39, 46, 0.1);
				.mrtb-item {
					padding: 12px;
					margin-top: 16px;
					font-weight: 400;
					font-size: 13px;
					letter-spacing: 0.02em;
					border-radius: 4px;
				}
				.mrtb-apbtn {
					background: #f8f8f8;
				}
				.mrtb-getdata {
					color: var(--el-color-primary);
					background: var(--el-color-primary-light-9);
				}
			}
		}
		.right-bottom {
			flex: 1;
			height: 0;
			background: #fff;
			border-radius: 4px;
			padding: 24px;
			min-height: 200px;
			.title {
				color: #27272e;
				font-weight: 500;
				font-size: 14px;
				line-height: 16px;
			}
			.desc {
				margin-top: 8px;
				font-weight: 400;
				font-size: 13px;
				line-height: 20px;
				color: rgba(39, 39, 46, 0.7);
				letter-spacing: 0.02em;
			}
			.more-ellipsis {
				-webkit-line-clamp: 6;
				max-height: 148px;

				word-break: break-all;
				display: -webkit-box;
				-webkit-box-orient: vertical;

				overflow: hidden;
				text-overflow: ellipsis;
			}
			.contact {
				margin: 24px 0;
				font-weight: 400;
				font-size: 13px;
				line-height: 13px;
				color: #27272e;
				padding: 12px 0;
				text-align: center;
				background: #fcfcfc;
				border: 1px solid #e8e8e8;
				box-sizing: border-box;
				border-radius: 4px;
			}
		}
	}
}
</style>
