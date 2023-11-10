import { getAllApiCatalogApi } from "@/api/modules/dataApi/apiCatalog";
import { getApiPathListApi } from "@/api/modules/dataApi/pathManage";
import { connectDsNameQueryApi, getDBSelectorApi } from "@/api/modules/sqlQuery/index";
import { discardSqlApi, getRealtimetablesApi, getColsInfoRealtimeApi, sqlQueryApi } from "@/api/modules/sqlQuery/index";

export default () => {
  const treeData = ref([]);
  const defaultProps = {
    children: "childTuple",
    label: "b",
  };
  const colInfoList = <any>ref([]);
  const dbRawInfo = <any>ref({
    dsName: "",
    dbObj: null,
  });
  const dsOptions = ref<any>([]);
  const dataBaseOptions = ref<any>([]);
  connectDsNameQueryApi({}).then((res: any) => {
    dsOptions.value = res.data;
    dbRawInfo.value.dsName = res.data[0].dsName;
    dsNameChange(dbRawInfo.value.dsName);
  });
  const dsNameChange = (value: any) => {
    dbRawInfo.value.dbObj = null;
    dataBaseOptions.value = [];

    if (value) {
      let obj = dsOptions.value.find((item: any) => {
        return item.dsName === value;
      });
      getDataBaseOptionsMethod(obj);
    }
  };
  const getDataBaseOptionsMethod = (obj: any) => {
    let api = <any>getDBSelectorApi;

    api({ ...obj, }).then((res: any) => {
      dataBaseOptions.value = res.data || [];
      dbRawInfo.value.dbObj = res.data[0];
      dbChange(dbRawInfo.value.dbObj);
    });
  };
  let linkType = <any>null;
  const dbChange = async (value: any) => {
    linkType = linkType || value.type;

    discardSqlApi({
      uuid: "9" + new Date().getTime(),
      linkType,

    }).then((res: any) => { });
    let params = {
      dbID: value.datasourceId,
      type: value.type,

    };
    let RealtimetablesRes = await getRealtimetablesApi(params);
    treeData.value = RealtimetablesRes.data;

    tableChange(RealtimetablesRes.data[0]);
  };
  const tableChange = (data: any) => {
    let value = dbRawInfo.value.dbObj;
    getColsInfoRealtimeApi({
      dbID: value.datasourceId,
      type: value.type,
      tableId: data.a,
      tableName: data.b,

    }).then((res: any) => {
      console.log("getColsInfoRealtimeApi", res);
      colInfoList.value = res.data;
    });
  };
  const handleNodeClick = (data: any) => {
    tableChange(data);
  };
  return {
    dbRawInfo, dsOptions, dataBaseOptions, treeData, defaultProps, colInfoList,

    dsNameChange, getDataBaseOptionsMethod, dbChange, tableChange, handleNodeClick


  }
}