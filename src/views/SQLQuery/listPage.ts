import { ref, reactive, computed, watch, onMounted, nextTick } from "vue";
import { useUserStoreSessionStorage } from "@/stores/user";
import Cookie from "js-cookie";
import { sqlQueryApi, historyQueryApi } from "@/api/modules/sqlQuery/index";

export default (
	getListApi: Function,
	beanInfo: any,
	queryFormRaw: any,
	getUseQueryParamsByForm?: any,
	queryCallBack?: any,
	checkedConfig?: any
) => {
	const queryForm = ref(JSON.parse(JSON.stringify(queryFormRaw)));

	const pageParams = reactive({
		pageNum: 1,
		pageSize: 10,
		total: 0,
		pageSizesList: [10, 20],
	});
	let useQueryParams = {};
	const tableDataListRaw = ref<any>([]);
	const ddl = ref<any>([]);
	const tableDataList = ref<any>([]);
	const tableLoading = ref<boolean>(false);
	if (!getUseQueryParamsByForm) {
		getUseQueryParamsByForm = (obj: any) => {
			return { ...obj };
		};
	}


	//#endregion
	onMounted(() => { });
	const handleCurrentPageChange = (pageNum: number) => {
		let params = {
			pageNum: pageNum,
			page_num: pageNum,
			pageNo: pageNum,
			pageSize: pageParams.pageSize,
			page_size: pageParams.pageSize,
			...useQueryParams,
		};
		tableLoading.value = true;
		console.log("params", params);
		const cookieToken = Cookie.get("token");
		console.log("cookieToken", cookieToken);
		// getListApi(params)
		// 	.then((res: any) => {
		// tableDataList.value = res?.data?.records || res?.data?.list || [];
		tableDataList.value = tableDataListRaw.value.slice((params.pageNum - 1) * params.pageSize, params.pageNum * params.pageSize)
		pageParams.total = tableDataListRaw.value.length;
		// debugger
		pageParams.pageNum = pageNum;
		tableLoading.value = false;
		nextTick(() => {
			queryCallBack && queryCallBack();

		});
		// })
		// .catch((err: any) => {
		// 	tableLoading.value = false;
		// });
	};
	const handleSizeChange = (pageSize: number) => {
		let params = {
			pageNum: 1,
			page_num: 1,
			pageNo: 1,
			pageSize: pageSize,
			page_size: pageSize,
			...useQueryParams,
		};
		tableLoading.value = true;
		console.log("params", params);
		// getListApi(params)
		// 	.then((res: any) => {
		// debugger
		// tableDataList.value = res?.data?.records || res?.data?.list || [];
		tableDataList.value = tableDataListRaw.value.slice((params.pageNum - 1) * params.pageSize, params.pageNum * params.pageSize)
		pageParams.total = tableDataListRaw.value.length;
		pageParams.pageSize = pageSize;
		pageParams.pageNum = 1;
		tableLoading.value = false;
		nextTick(() => {
			queryCallBack && queryCallBack();

		});
		// })
		// .catch((err: any) => {
		// 	tableLoading.value = false;
		// });
	};

	const resetPageToOne = () => {
		handleCurrentPageChange(1);
	};
	const refreshData = () => {
		useQueryParams = getUseQueryParamsByForm && getUseQueryParamsByForm(queryForm.value);
		handleCurrentPageChange(pageParams.pageNum);
	};
	//#region 业务相关
	const userStore = useUserStoreSessionStorage();
	const drawer = ref<any>(null);
	const employeeRow = ref<object>([]);



	// 重置搜索表单按钮
	const doReset = () => {
		queryForm.value = JSON.parse(JSON.stringify(queryFormRaw));
		searchByQueryForm();
	};
	//搜索按钮
	const searchByQueryForm = () => {
		//修改 搜索条件query
		useQueryParams = getUseQueryParamsByForm && getUseQueryParamsByForm(queryForm.value);
		sqlQueryApi(useQueryParams).then((res: any) => {
			console.log('sqlQueryApi', res)
			tableDataListRaw.value = [];
			ddl.value = res.data.ddl;

			// res.data.list
			for (let i = 0; i < res.data.list.length; i++) {
				let objList = res.data.list[i];
				let obj = <any>{};
				for (let j = 0; j < res.data.ddl.length; j++) {
					let key = res.data.ddl[j];
					obj[key] = objList[j]
				}
				tableDataListRaw.value.push(obj);
			}
			// debugger
			resetPageToOne();

		})
		//回到第一页


	};

	const subData = (val: any) => {
		searchByQueryForm();
	};

	//#endregion
	return {
		tableLoading,

		pageParams,
		tableDataList,
		ddl,
		handleCurrentPageChange,
		handleSizeChange,
		resetPageToOne,
		refreshData,
		getUseQueryParamsByForm,

		drawer,
		employeeRow,

		searchByQueryForm,
		subData,

		queryForm,
		doReset,

	};
};
