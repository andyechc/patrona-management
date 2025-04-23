const excludeFromArray = (
  itemA: any[],
  itemB: any[],
  keyA: string,
  keyB: string,
  keyC?: string,
) => {
  if (keyC !== undefined) {
    const data = itemA.filter((prod: any) => {
      const itemFound = itemB.some(
        (item: any) => item[keyB][keyC] === prod[keyA],
      );
      return !itemFound;
    });

    return data;
  } else {
    const data = itemA.filter((prod: any) => {
      const itemFound = itemB.some((item: any) => item[keyB] === prod[keyA]);
      return !itemFound;
    });
    return data;
  }
};

export default excludeFromArray;
