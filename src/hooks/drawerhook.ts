import { ref, reactive, computed, watch, onMounted, nextTick } from "vue";
import { ElDrawer, ElMessage, ElMessageBox } from "element-plus";

// 此hook 业务相关
export default (props: any, openCallBack: any, onCloseBack: Function, router?: any) => {
	// 默认关闭抽屉
	const showDrawer = ref(false);
	let timer: any;
	const loading = ref(false);

	const queryFormRef = ref<any>();

	const isOpen = () => {
		showDrawer.value = true;
		nextTick(() => {
			openCallBack();
		});
	};
	const isClose = () => {
		showDrawer.value = false;
		loading.value = false;
		props.employeeRow.value = {};
		clearTimeout(timer);
		queryFormRef.value.clearValidate();
		onCloseBack();
	};

	const pageReturn = () => {
		router.go(-1);
	};

	return {
		isClose,
		showDrawer,
		timer,
		loading,
		queryFormRef,
		isOpen,

		pageReturn,
	};
};
