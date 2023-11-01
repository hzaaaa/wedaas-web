import { getCatalogListApi, getDSSelectorApi, getDBSelectorApi } from "@/api/modules/dataCatalog/dataCatalog";
export default (queryForm: any, searchByQueryForm: any) => {
  const dataSourceOptions = ref<any[]>([]);

  const getDataSourceOptionMethod = () => {
    let api = <any>getDSSelectorApi;

    api().then((res: any) => {
      dataSourceOptions.value = res.data || [];
    });
  };
  getDataSourceOptionMethod();
  const dsNameChange = (value: any) => {
    queryForm.value.dbName = "";
    dataBaseOptions.value = [];
    searchByQueryForm();
    if (value) {
      let obj = dataSourceOptions.value.find((item: any) => {
        return item.dsName === value;
      });
      getDataBaseOptionsMethod(obj);
    }
  };

  const dataBaseOptions = ref<any[]>([]);

  const getDataBaseOptionsMethod = (obj: any) => {
    let api = <any>getDBSelectorApi;

    api({ ...obj }).then((res: any) => {
      dataBaseOptions.value = res.data || [];
    });
  };

  return {
    dataSourceOptions,
    dataBaseOptions,
    dsNameChange,
  }
}