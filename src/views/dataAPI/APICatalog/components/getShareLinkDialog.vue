<template>
	<div>
		<el-dialog v-model="dialogVisible" title=" " @open="getExpireInfo" width="1100px" class="common-dialog">
			<el-tabs class="full-content-tabs" v-model="activeTab">
				<el-tab-pane label="API下载" name="API下载">
					<div class="table-header">
						<div class="header-ul">
							<div class="header-li pointer tabs-active">请求参数</div>
						</div>
					</div>
					<div class="table-wrap" style="">
						<el-table
							class="common-table"
							:data="tableIndata"
							border
							style="
								border-radius: 4px;
								border: 1px solid rgb(232, 232, 232);
								height: 100%;
								max-height: 100%;
								box-sizing: border-box;
							"
						>
							<el-table-column label="参数名" prop="fieldName" show-overflow-tooltip></el-table-column>
							<el-table-column label="描述" prop="colDescription" show-overflow-tooltip></el-table-column>
							<el-table-column label="类型" prop="columnType" show-overflow-tooltip></el-table-column>
							<el-table-column label="值" prop="defaultValue" show-overflow-tooltip>
								<template #default="scope">
									<el-input v-model="scope.row.value" maxlength="100" />
								</template>
							</el-table-column>
							<el-table-column label="必填" prop="required" show-overflow-tooltip></el-table-column>
						</el-table>
					</div>
					<div class="create-path">
						<div class="path-input-list">
							<div class="input-item">
								<div class="input-left">分享参数</div>
								<div class="input-right"><el-switch v-model="value1" /></div>
							</div>
							<div class="input-item">
								<div class="input-left">有效期</div>
								<div class="input-right">
									<el-input style="width: 120px" placeholder=" ">
										<template #append>天</template>
									</el-input>
								</div>
							</div>
							<div class="input-item">
								<div class="input-left">允许次数</div>
								<div class="input-right"><el-input style="width: 120px"></el-input></div>
							</div>
						</div>
					</div>
					<div class="create-path-btn">
						<div class="line"></div>
						<el-button type="primary" style="" @click="submit"> 生成链接 </el-button>
					</div>
					<div class="path-block">
						<div class="path-tip">
							<el-icon color="#5dd8a2"><CircleCheck /></el-icon>
							<span class="title">成功创建私密链接</span>
						</div>
						<div class="path-text">
							<div class="path-text-left">
								<el-input></el-input>
							</div>
							<div class="path-text-right">
								<span class="title">提取码</span>
								<el-input style="width: 53%"></el-input>
							</div>
						</div>
						<div class="copy-btn">
							<el-button style="" @click="submit"> 复制链接及提取码 </el-button>
						</div>
					</div>
				</el-tab-pane>
				<el-tab-pane label="应用连接" name="应用连接">
					<div class="table-header">
						<div class="header-ul">
							<div
								class="header-li pointer"
								:class="currentTab === '请求参数' ? 'tabs-active' : ''"
								@click="currentTab = '请求参数'"
							>
								请求参数
							</div>
							<div
								class="header-li pointer"
								:class="currentTab === '分页参数' ? 'tabs-active' : ''"
								@click="currentTab = '分页参数'"
							>
								分页参数
							</div>
						</div>
					</div>
					<div class="table-wrap" style="">
						<el-table
							class="common-table"
							:data="pageData"
							border
							style="
								border-radius: 4px;
								border: 1px solid rgb(232, 232, 232);
								height: 100%;
								max-height: 100%;
								box-sizing: border-box;
							"
						>
							<el-table-column label="参数名" prop="paramName" show-overflow-tooltip></el-table-column>
							<el-table-column label="条件" prop="condition" show-overflow-tooltip></el-table-column>

							<el-table-column label="值" prop="value" show-overflow-tooltip>
								<template #default="scope">
									<el-input v-model="scope.row.value" maxlength="100" />
								</template>
							</el-table-column>
							<el-table-column label="必填" prop="required" show-overflow-tooltip></el-table-column>
						</el-table>
					</div>
					<div class="create-link">
						<div class="link-input">
							<span class="mr15">是否权限验证</span>
							<el-select style="width: 200px"></el-select>
							<span style="flex: 1"></span>
							<el-button type="primary" style="" @click="submit"> 生成API链接 </el-button>
						</div>
						<div class="link-block">
							<div class="content">
								{{
									`curl -XGET "${location.protocol}//${location.host}:${location.port}/api/edu/educode/cc189c99-6fbd-41bf-bc0f-8c02d0274716"`
								}}
							</div>
							<el-tooltip class="box-item" effect="dark" content="Copy" placement="top">
								<div class="link-copy" @click="">
									<div class="btn">
										<el-icon><CopyDocument /></el-icon>
									</div>
								</div>
							</el-tooltip>
						</div>
					</div>
				</el-tab-pane>
			</el-tabs>
			<template #footer>
				<!-- <el-button @click="check">check</el-button> -->
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { ElMessage } from "element-plus";
import detailsDataJson from "./detailsData.json";

const value1 = ref(true);
let allData = detailsDataJson.data;
const tableIndata = ref([...allData.apiParamIn]);
const pageData = ref([
	{
		paramName: "page_num",
		condition: "=",
		value: "",
		required: false,
	},
	{
		paramName: "page_size",
		condition: "=",
		value: "",
		required: false,
	},
]);
const currentTab = ref("请求参数");
const activeTab = ref("API下载");
const dialogVisible = ref(true);
const location = <any>window.location;
const dialogProps = ref<any>();

const acceptParams = (params: any) => {
	dialogProps.value = params;
	// debugger
	dialogProps.value.loginExpireList = [params.row.expirationStart, params.row.expirationEnd];
	dialogVisible.value = true;
};

// 提交
const submit = async () => {
	try {
		console.log("dialogProps.value.loginExpireList", dialogProps.value.loginExpireList);
		// return
		// debugger
		let params = {
			userId: dialogProps.value.row!.id,
			expirationStart: dialogProps.value.loginExpireList[0],
			expirationEnd: dialogProps.value.loginExpireList[1],
		};
		// await editExpirationApi(params);
		// ElMessage.success("修改有效期成功");
		dialogVisible.value = false;
		emit("refreshData");
	} catch (err) {}
};
const getExpireInfo = () => {};

const emit = defineEmits(["refreshData"]);

defineExpose({
	acceptParams,
});
</script>

<style lang="scss" scoped>
:deep(.el-dialog__header) {
	padding-bottom: 0 !important;
}
.table-header {
	padding: 0 0 15px;
	.header-ul {
		position: relative;
		width: 100%;
		display: flex;
		justify-content: flex-start;
		.header-li {
			font-weight: 500;
			font-size: 13px;
			line-height: 16px;
			color: var(--colormaintext);
			margin-right: 40px;
		}
		.tabs-active {
			color: var(--el-color-primary);
		}
	}
}
.table-wrap {
	max-height: 980px;
	height: 45vh;
	// display: flex;
	flex-direction: column;
}
.create-path {
	margin-top: 16px;
	.path-input-list {
		display: flex;
		justify-content: space-between;
		align-items: center;
		.input-item {
			display: flex;
			justify-content: flex-start;
			align-items: center;
			.input-left {
				font-weight: 400;
				font-size: 13px;
				line-height: 16px;
				color: var(--colormaintext);
				margin-right: 8px;
			}
		}
	}
}
.create-path-btn {
	position: relative;
	padding: 32px 0 0;
	text-align: right;
	font-size: 0;
	.line {
		position: absolute;
		top: 16px;
		left: -32px;
		right: -32px;
		height: 1px;
		z-index: 99;
		background: var(--bc);
	}
}
.path-block {
	.path-tip {
		line-height: 16px;
		display: flex;
		align-items: center;
		.title {
			margin-left: 6px;
			font-weight: 400;
			font-size: 13px;
			color: rgba(0, 0, 0, 0.9);
		}
	}
	.path-text {
		margin-top: 10px;
		display: flex;
		width: 100%;
		justify-content: space-between;
		align-items: center;
		.path-text-left {
			flex: 1;
		}
		.path-text-right {
			width: 167px;
			text-align: right;
			.title {
				margin-right: 8px;
				font-size: 13px;
				line-height: 16px;
				color: var(--coloroptext);
			}
		}
	}
	.copy-btn {
		text-align: right;
		font-size: 0;
		margin-top: 32px;
	}
}
.create-link {
	margin-top: 16px;
	.link-input {
		line-height: 40px;
		color: #777;
		display: flex;
		align-items: center;
	}
}
:deep(.el-dialog__body) {
	display: flex;
	flex-direction: column;
}
:deep(.el-dialog__footer) {
	padding-top: 0;
}
.link-block {
	background: #f8f8f8;
	border-radius: 4px;
	min-height: 112px;
	margin: 16px 0 0;
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	padding: 8px 16px;
	margin-top: 30px;
	.content {
		font-weight: 400;
		font-size: 13px;
		line-height: 16px;
		color: var(--colormaintext);
		margin-right: 16px;
		height: 100px;
		overflow: auto;
		padding: 8px 0;
		word-wrap: break-word;
		word-break: break-all;
	}
	.link-copy {
		flex-shrink: 0;
		width: 32px;
		height: 32px;
		border-radius: 4px;
		&:hover {
			background: #eee;
		}
		.btn {
			margin: 8px;
			width: 16px;
			height: 16px;
		}
	}
}
</style>
