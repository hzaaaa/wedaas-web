export default (treeDataJson: any, delChildCatalogApi: any, delRootCatalogApi: any, getCatalogInfo: any) => {
  const treeRef = ref<any>(null);

  const addMainCatalogDialogRef = <any>ref(null);
  const addChildCatalogDialogRef = <any>ref(null);
  const modiftCatalogDialogRef = <any>ref(null);

  const openAddMainCatalogDialogClick = () => {
    addMainCatalogDialogRef.value.acceptParams({
      row: {},
    });
  };
  const openAddChildCatalogDialogRefClick = (name: any) => {
    // debugger
    addChildCatalogDialogRef.value.acceptParams({
      row: {
        list: treeDataJson.value.data,
        name,
      },
    });
  };
  let modifyTempData = <any>null; //tree node data ref
  const openModiftCatalogDialogRefClick = (data: any) => {
    // debugger;
    modifyTempData = data;
    modiftCatalogDialogRef.value.acceptParams({
      row: data,
    });
  };
  const modifyName = (name: any) => {
    modifyTempData.name = name;
  };

  const removeCatalogClick = (row: any) => {
    // debugger;
    console.log("removeCatalogClick", row);
    let title1 = "";
    let title2 = "";
    let deleteApi = <any>null;
    if (row.rootId) {
      //child
      title1 = "此操作将永久删除该二级目录";
      title2 = "二级目录";
      deleteApi = delChildCatalogApi;
    } else {
      title1 = "此操作将永久删除该一级目录及其所有二级目录";
      title2 = "一级目录";
      deleteApi = delRootCatalogApi;
    }
    ElMessageBox.confirm(`${title1}, 是否继续?`, `移除${title2}-${row.name}`, {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      customClass: "delete-message",
      // type: "warning",
    })
      .then(() => {
        //待续未完
        deleteApi({
          id: row.id,
        }).then(() => {
          console.log("delete success", row);
          ElMessage({
            type: "success",
            message: "删除成功",
          });

          getCatalogInfo();
        });
      })
      .catch(() => { });
  };
  return {
    treeRef,
    addMainCatalogDialogRef,
    addChildCatalogDialogRef,
    modiftCatalogDialogRef,
    openAddMainCatalogDialogClick,
    openAddChildCatalogDialogRefClick,
    openModiftCatalogDialogRefClick,
    modifyName,
    removeCatalogClick,
  };
};
