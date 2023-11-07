import { getCatalogListApi, getDSSelectorApi, getDBInfoSelectorApi } from "@/api/modules/dataCatalog/dataCatalog";
export default (queryForm: any, searchByQueryForm: any, tableDataList: any) => {
  const dataSourceOptions = ref<any[]>([]);

  const getDataSourceOptionMethod = () => {
    let api = <any>getDSSelectorApi;

    getDSSelectorApi({}).then((res: any) => {
      dataSourceOptions.value = res.data || [];
      queryForm.value.dsName = dataSourceOptions.value[0].dsName;
      dsNameChange(queryForm.value.dsName);
    });
  };
  getDataSourceOptionMethod();
  const dsNameChange = (value: any) => {
    queryForm.value.dbName = "";
    dataBaseOptions.value = [];

    if (value) {
      let obj = dataSourceOptions.value.find((item: any) => {
        return item.dsName === value;
      });
      getDataBaseOptionsMethod(obj);
    }
  };

  const dataBaseOptions = ref<any[]>([]);

  const getDataBaseOptionsMethod = (obj: any) => {
    getDBInfoSelectorApi({ ...obj }).then((res: any) => {
      dataBaseOptions.value = res.data || [];
      queryForm.value.dbName = dataBaseOptions.value[0].database;
      searchByQueryForm();
    });
  };











  const viewChecked = ref(false);
  const viewCheckedChange = (value: any) => {
    console.log("viewCheckedChange", value);
  };
  const filteredTableDataList = computed(() => {
    if (!viewChecked.value) {
      return tableDataList.value.filter((item: any) => {
        return item.tn.indexOf(queryForm.value.tableName) !== -1;
      });
    } else {
      return tableDataList.value.filter((item: any) => {
        return item.tn.indexOf(queryForm.value.tableName) !== -1 && item.checked0;
      });
    }
  });


  return {
    dataSourceOptions,
    dataBaseOptions,
    dsNameChange,

    viewChecked,
    viewCheckedChange,
    filteredTableDataList
  }
}