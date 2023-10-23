<template>
	<div class="api-config">
		<el-steps :active="activeName" align-center>
			<el-step title="基础信息" />
			<el-step title="参数配置" />
			<el-step title="接口测试" />
		</el-steps>
		<div class="content-block">
			<el-tabs v-model="activeName" class="full-content-tabs">
				<el-tab-pane label="基础信息" :name="1">
					<el-form
						ref="inputInfoRef"
						:model="inputInfo"
						:rules="rulesForm"
						label-position="right"
						style="width: 600px"
						label-width="auto"
					>
						<el-form-item label="API名称" prop="name">
							<el-input v-model="inputInfo.name" show-word-limit placeholder="" />
						</el-form-item>
						<el-form-item label="API路径" prop="name">
							<el-select style="width: 100%" v-model="inputInfo.name"></el-select>
						</el-form-item>
						<el-form-item label="目录" prop="name">
							<el-select style="width: 100%" v-model="inputInfo.name"></el-select>
						</el-form-item>
						<el-form-item label="请求协议" prop="name">
							<el-radio-group v-model="inputInfo.name">
								<el-radio label="http" />
							</el-radio-group>
						</el-form-item>
						<el-form-item label="请求方式" prop="name">
							<el-select style="width: 100%" v-model="inputInfo.name"></el-select>
						</el-form-item>
						<el-form-item label="返回类型" prop="name">
							<el-select style="width: 100%" v-model="inputInfo.name"></el-select>
						</el-form-item>
						<el-form-item label="描述" prop="name">
							<el-input v-model="inputInfo.name" show-word-limit placeholder="" type="textarea" :rows="4" maxlength="500" />
						</el-form-item>
					</el-form>
					<div class="flex-center">
						<el-button type="primary" @click="nextStep">下一步</el-button>
					</div>
				</el-tab-pane>
				<el-tab-pane label="参数配置" :name="2">
					<el-button type="primary" @click="preStep">上一步</el-button>
					<el-button type="primary" @click="nextStep">下一步</el-button>
				</el-tab-pane>
				<el-tab-pane label="接口测试" :name="3">
					<el-button type="primary" @click="preStep">上一步</el-button>
				</el-tab-pane>
			</el-tabs>
		</div>
	</div>
</template>

<script setup lang="ts">
import {} from "vue";
const activeName = ref(1);
const preStep = () => {
	activeName.value--;
};
const nextStep = () => {
	activeName.value++;
};

const inputInfo = ref({
	name: "http",
});
const rulesForm = reactive<any>({
	name: [{ required: true, message: "请输入!", trigger: "blur" }],
});
</script>

<style lang="scss" scoped>
.api-config {
	flex: 1;
	height: 0;
	display: flex;
	flex-direction: column;
	width: 100%;
	.content-block {
		flex: 1;
		height: 0;
		display: flex;
		flex-direction: column;
		:deep(.el-tabs) {
			.el-tabs__header {
				display: none;
			}
			.el-tab-pane {
				align-items: center;
			}
		}
	}
}
</style>
