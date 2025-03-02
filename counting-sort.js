function countingSort(array) {
  const max = Math.max(...array);
  const countArray = Array(max + 1);
  const result = [];

  for (const el of array) {
    if (!countArray[el]) {
      countArray[el] = 0;
    }

    countArray[el]++;
  }

  for (let i = 0; i < countArray.length; i++) {
    while (countArray[i] > 0) {
      result.push(i);
      countArray[i]--;
    }
  }

  return result;
}

console.log(countingSort([1, 5, 5, 3, 2, 2, 3, 3, 1, 4]));
