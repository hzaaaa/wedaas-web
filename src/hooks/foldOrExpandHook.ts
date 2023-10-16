
export default () => {
  const asideClass = ref("wider-at-hook");

  const foldClick = () => {
    asideClass.value = "narrower-at-hook";
  };
  const expandClick = () => {
    asideClass.value = "wider-at-hook";
  };
  return {
    asideClass,
    foldClick,
    expandClick,
  }
};
