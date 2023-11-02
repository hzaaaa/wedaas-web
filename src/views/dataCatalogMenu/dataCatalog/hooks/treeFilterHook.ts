

export default (filterKey: string, treeRef: any) => {
  const filterText = ref("");

  watch(filterText, (val) => {
    treeRef.value!.filter(val);
  });
  const filterNode = (value: string, data: any) => {
    if (!value) return true;
    // debugger;
    return data[filterKey].includes(value);
  };
  return {
    filterText,
    filterNode
  }
}