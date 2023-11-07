import { ref, reactive, computed, watch, onMounted, nextTick } from "vue";
import { useUserStoreSessionStorage } from "@/stores/user";
import Cookie from "js-cookie";

export default (getListApi: Function, beanInfo: any, queryFormRaw: any, getUseQueryParamsByForm?: any, queryCallBack?: any, checkedConfig?: any) => {
	const queryForm = ref(JSON.parse(JSON.stringify(queryFormRaw)));

	const pageParams = reactive({
		pageNum: 1,
		pageSize: 10,
		total: 0,
		pageSizesList: [10, 20],
	});
	let useQueryParams = {};

	const tableDataList = ref<any>([]);
	const tableLoading = ref<boolean>(false);
	if (!getUseQueryParamsByForm) {
		getUseQueryParamsByForm = (obj: any) => {
			return { ...obj };
		};
	}
	//#region 勾选
	if (!checkedConfig) {
		checkedConfig = []
	}
	// [
	// 	{
	// 		key:'id',//set 存储的关键字
	// 		checkedBy:'checked1' //勾选所需关键字 v-model
	// 	},
	// 	{
	// 		key:'apiId',
	// 		checkedBy:'checked2'
	// 	},
	// ]
	const buildCheckedParams = () => {
		let result = checkedConfig.map((checkedConfigItem: any) => {
			const addCheckedAll = ref(false);//在模版中使用需要解构出来
			const checkedAllSet = new Set();
			const setSize = ref(0);
			const addCheckedAllChange = (val: any) => {
				tableDataList.value.forEach((item: any) => {
					item[checkedConfigItem.checkedBy] = val;
					if (val) {
						checkedAllSet.add(item[checkedConfigItem.key])
					} else {
						checkedAllSet.delete(item[checkedConfigItem.key])
					}
				});
				setSize.value = checkedAllSet.size;

			};
			const itemCheckedChange = (val: any, row: any) => {

				addCheckedAll.value = tableDataList.value.every((item: any) => {
					return item[checkedConfigItem.checkedBy] === true;
				});
				if (val) {
					checkedAllSet.add(row[checkedConfigItem.key])
				} else {
					checkedAllSet.delete(row[checkedConfigItem.key])
				}
				setSize.value = checkedAllSet.size;
			};
			const restoreCheckedAfterQuery = () => {
				tableDataList.value.forEach((item: any) => {
					if (checkedAllSet.has(item[checkedConfigItem.key])) {
						item[checkedConfigItem.checkedBy] = true
					}
				})
				addCheckedAll.value = tableDataList.value.every((item: any) => {
					return item[checkedConfigItem.checkedBy] === true;
				});
				setSize.value = checkedAllSet.size;
			}
			const resetChecked = () => {
				checkedAllSet.clear();
				addCheckedAll.value = false;
				tableDataList.value.forEach((item: any) => {
					item[checkedConfigItem.checkedBy] = false
				})
				setSize.value = checkedAllSet.size;
			}
			return {
				addCheckedAll,
				checkedAllSet,
				setSize,
				addCheckedAllChange,
				itemCheckedChange,
				restoreCheckedAfterQuery,
				resetChecked
			}
		})
		return result;
	}
	const checkedParamList = buildCheckedParams();
	// let isfirst =true;//第一次调用时取消
	//#endregion
	onMounted(() => { });
	const handleCurrentPageChange = (pageNum: number) => {
		let params = {
			pageNum: pageNum,
			curPage: pageNum,
			pageSize: pageParams.pageSize,
			...useQueryParams,
		};
		tableLoading.value = true;
		console.log("params", params);
		const cookieToken = Cookie.get("token");
		console.log('cookieToken', cookieToken)
		getListApi(params)
			.then((res: any) => {
				tableDataList.value = res?.data?.records || res?.data?.list || [];
				pageParams.total = res.data.total;
				// debugger
				pageParams.pageNum = pageNum;
				tableLoading.value = false;
				nextTick(() => {
					queryCallBack && queryCallBack();
					checkedParamList.forEach((item: any) => {
						item.restoreCheckedAfterQuery();
					})
				});
			})
			.catch((err: any) => {
				tableLoading.value = false;
			});
	};
	const handleSizeChange = (pageSize: number) => {
		let params = {
			pageNum: 1,
			curPage: 1,
			pageSize: pageSize,
			...useQueryParams,
		};
		tableLoading.value = true;
		console.log("params", params);
		getListApi(params)
			.then((res: any) => {
				// debugger
				tableDataList.value = res?.data?.records || res?.data?.list || [];
				pageParams.total = res.data.total;
				pageParams.pageSize = pageSize;
				pageParams.pageNum = 1;
				tableLoading.value = false;
				nextTick(() => {
					queryCallBack && queryCallBack();
					checkedParamList.forEach((item: any) => {
						item.restoreCheckedAfterQuery();
					})
				});
			})
			.catch((err: any) => {
				tableLoading.value = false;
			});
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

	// 新增
	const onAddDrawer = (type: string) => {
		// 打开抽屉 or dialog
		drawer.value?.isOpen(type);
		employeeRow.value = JSON.parse(JSON.stringify(beanInfo));
		userStore.setBehavior("add");
	};

	// 编辑
	const onEditDrawer = (row: any) => {
		// 打开抽屉
		drawer.value?.isOpen();
		employeeRow.value = Object.assign(JSON.parse(JSON.stringify(beanInfo)), row);
		userStore.setBehavior("modify");
	};

	// 新增 at Page
	const onOpenAddPage = (router: any, pathName: any) => {
		employeeRow.value = JSON.parse(JSON.stringify(beanInfo));
		userStore.setBehavior("add");
		// debugger
		router.push({
			name: pathName,
			state: {
				params: { ...employeeRow.value },
			},
		});
	};

	// 编辑 at Page
	const onOpenEditPage = (router: any, pathName: any, row: any) => {
		employeeRow.value = Object.assign(JSON.parse(JSON.stringify(beanInfo)), row);
		userStore.setBehavior("modify");

		router.push({
			name: pathName,
			state: {
				params: { ...employeeRow.value },
			},
		});
	};
	const onOpenDetailsPage = (router: any, pathName: any, row: any) => {
		employeeRow.value = Object.assign(JSON.parse(JSON.stringify(beanInfo)), row);

		router.push({
			name: pathName,
			state: {
				params: { ...employeeRow.value },
			},
		});
	};
	// 重置搜索表单按钮
	const doReset = () => {
		queryForm.value = JSON.parse(JSON.stringify(queryFormRaw));
		searchByQueryForm();
	};
	//搜索按钮
	const searchByQueryForm = () => {
		//修改 搜索条件query
		useQueryParams = getUseQueryParamsByForm && getUseQueryParamsByForm(queryForm.value);
		//回到第一页
		resetPageToOne();
	};
	onMounted(() => {
		// searchByQueryForm();//若加入keep-alive 则注意 生命周期 初始化   onActivated 调用 list
	});
	let isfirst = true;
	onActivated(() => {
		// 调用时机为首次挂载
		// 以及每次从缓存中被重新插入时
		if (!isfirst) {

			refreshData();
		} else {
			isfirst = false
		}
		// handleCurrentPageChange_refresh
	});
	// // 抽屉修改或新增事件完成后重新调用查询接口刷新父组件
	const subData = (val: any) => {
		searchByQueryForm();
	};

	//#endregion
	return {
		tableLoading,

		pageParams,
		tableDataList,
		handleCurrentPageChange,
		handleSizeChange,
		resetPageToOne,
		refreshData,
		getUseQueryParamsByForm,

		drawer,
		employeeRow,
		onAddDrawer,
		onEditDrawer,
		onOpenAddPage,
		onOpenEditPage,
		onOpenDetailsPage,
		searchByQueryForm,
		subData,

		queryForm,
		doReset,


		checkedParamList,
	};
};
