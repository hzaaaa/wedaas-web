<template>
	<div class="api-config">
		<el-steps :active="activeName" align-center class="mt10" style="border-bottom: 1px solid var(--bc)">
			<el-step title="基础信息" />
			<el-step title="参数配置" />
			<el-step title="接口测试" />
		</el-steps>
		<el-radio-group v-show="activeName === 2" v-model="paramsConfigRadio" style="position: absolute; right: 40px; top: 20px">
			<el-radio label="config">配置</el-radio>
			<el-radio label="code">代码</el-radio>
		</el-radio-group>
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
					<div class="flex-center mb10">
						<el-button type="primary" @click="nextStep">下一步</el-button>
					</div>
				</el-tab-pane>
				<el-tab-pane label="参数配置" :name="2">
					<paramsConfig v-show="paramsConfigRadio === 'config'"></paramsConfig>
					<paramsCode v-show="paramsConfigRadio === 'code'"></paramsCode>
					<div class="flex-center mb10" style="justify-content: flex-end !important; width: 100%; position: relative">
						<el-button type="primary" @click="preStep">上一步</el-button>
						<el-button type="primary" @click="nextStep" class="mr16">下一步</el-button>
					</div>
				</el-tab-pane>
				<el-tab-pane label="接口测试" :name="3">
					<testInterface></testInterface>
					<div class="flex-center mb10" style="justify-content: flex-end !important; width: 100%; position: relative">
						<el-button type="primary" @click="preStep">上一步</el-button>
						<el-button type="primary" class="mr16">创建API</el-button>
					</div>
				</el-tab-pane>
			</el-tabs>
		</div>
	</div>
</template>

<script setup lang="ts">
import {} from "vue";
import paramsConfig from "./components/paramsConfig/index.vue";
import paramsCode from "./components/paramsCode/index.vue";
import testInterface from "./components/testInterface/index.vue";
const activeName = ref(1);
const paramsConfigRadio = ref("code");
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
* {
	box-sizing: border-box;
}
.api-config {
	flex: 1;
	height: 0;
	display: flex;
	flex-direction: column;
	width: 100%;
	background: #fff;
	border-radius: 10px;
	position: relative;
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
