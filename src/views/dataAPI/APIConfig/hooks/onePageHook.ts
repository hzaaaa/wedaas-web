import { getAllApiCatalogApi } from "@/api/modules/dataApi/apiCatalog";
import { getApiPathListApi } from "@/api/modules/dataApi/pathManage";
export default () => {
  const catalogOptions = <any>ref([]);
  getAllApiCatalogApi({}).then((res: any) => {
    catalogOptions.value = res.data;
    catalogOptions.value.forEach((item: any) => {
      item.leaf = false
      if (item.childs) {
        item.childs.forEach((item2: any) => {
          item2.leaf = true
        })
      }
    })
  })
  const pathOptions = <any>ref([]);
  getApiPathListApi({}).then((res: any) => {
    pathOptions.value = res.data;
    pathOptions.value.forEach((item: any) => {
      item.leaf = false;
      item.name = item.rootName;
      if (item.childTuple) {
        item.childTuple.forEach((item2: any) => {
          item2.leaf = true
          item2.name = item2.childName;
        })
      }
    })
  })
  return {
    catalogOptions,
    pathOptions
  }
}