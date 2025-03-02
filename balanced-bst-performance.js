// Import the BalancedBST class if in a module environment
const { BalancedBST } = require("./balanced-bst.js");
const fs = require("fs");

function generateRandomDataset(size, min = 1, max = 10000) {
  const dataset = [];
  for (let i = 0; i < size; i++) {
    dataset.push(Math.floor(Math.random() * (max - min + 1)) + min);
  }
  return dataset;
}

function measurePerformance(operation, tree, values) {
  const startTime = performance.now();

  for (const value of values) {
    switch (operation) {
      case "insert":
        tree.insert(value);
        break;
      case "find":
        tree.find(value);
        break;
      case "delete":
        tree.delete(value);
        break;
    }
  }

  const endTime = performance.now();
  return endTime - startTime;
}

function runComplexityTests(datasetSizes, operationsToTest) {
  const results = {};

  for (const operation of operationsToTest) {
    results[operation] = [];
  }

  for (const size of datasetSizes) {
    console.log(`Testing with dataset size: ${size}`);

    if (operationsToTest.includes("insert")) {
      const insertDataset = generateRandomDataset(size);
      const insertTree = new BalancedBST();
      const insertTime = measurePerformance(
        "insert",
        insertTree,
        insertDataset
      );
      results["insert"].push({ size, time: insertTime });
    }

    if (
      operationsToTest.includes("find") ||
      operationsToTest.includes("delete")
    ) {
      const dataset = generateRandomDataset(size);
      const tree = new BalancedBST();

      for (const value of dataset) {
        tree.insert(value);
      }

      if (operationsToTest.includes("find")) {
        const findTime = measurePerformance("find", tree, dataset);
        results["find"].push({ size, time: findTime });
      }

      if (operationsToTest.includes("delete")) {
        const deleteTime = measurePerformance("delete", tree, dataset);
        results["delete"].push({ size, time: deleteTime });
      }
    }
  }

  return results;
}

function generateDatasetSizes(count = 10000, minSize = 10, maxSize = 10000) {
  const sizes = [];

  for (let i = 0; i < count; i++) {
    const size = Math.floor(
      minSize * Math.pow(maxSize / minSize, i / (count - 1))
    );
    sizes.push(size);
  }
  return sizes;
}

function runAllTests() {
  const datasetSizes = generateDatasetSizes(1000, 10, 10000);
  const operations = ["insert", "find", "delete"];

  const results = runComplexityTests(datasetSizes, operations);

  console.log("Performance Test Results:");
  console.log(JSON.stringify(results, null, 2));

  console.log("\nCSV Format:");
  console.log("operation,size,time");

  let csvContent = "operation,size,time\n";

  for (const operation of operations) {
    for (const result of results[operation]) {
      console.log(`${operation},${result.size},${result.time}`);
      csvContent += `${operation},${result.size},${result.time}\n`;
    }
  }

  saveResultsToFiles(results, csvContent);
}

function saveResultsToFiles(results, csvContent) {
  try {
    fs.writeFileSync(
      "bst-performance-results.json",
      JSON.stringify(results, null, 2)
    );
    console.log("Results saved to bst-performance-results.json");

    fs.writeFileSync("bst-performance-results.csv", csvContent);
    console.log("Results saved to bst-performance-results.csv");
  } catch (error) {
    console.error("Error saving results to file:", error);
  }
}

runAllTests();
