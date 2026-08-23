// laptop-review/utils/compareUtils.ts
export function compareSpecs(value1: any, value2: any, isHigherBetter = true): [boolean, boolean] {
  // Helper to determine if a value is considered "empty" or "N/A"
  const isEmpty = (val: any) => val === null || val === undefined || val === '' || String(val).toLowerCase() === 'n/a';

  const val1Empty = isEmpty(value1);
  const val2Empty = isEmpty(value2);

  // Case 1: One value is empty, the other is not
  if (val1Empty && !val2Empty) {
    return [false, true]; // value1 is worse (empty), value2 is better (has value)
  }
  if (!val1Empty && val2Empty) {
    return [true, false]; // value1 is better (has value), value2 is worse (empty)
  }
  // Case 2: Both values are empty or essentially the same (e.g. both N/A)
  if (val1Empty && val2Empty) {
    return [false, false];
  }
  // This specific check needs to be after isEmpty, because value1 and value2 could be both "" or null
  if (value1 === value2) {
    return [false, false];
  }

  // Case 3: Numeric comparison (attempt to parse numbers first)
  let num1 = NaN;
  let num2 = NaN;

  // More robust parsing for numbers within strings, handling units like kg, Hz, %, etc.
  // And also direct number types
  if (typeof value1 === 'number') {
    num1 = value1;
  } else if (typeof value1 === 'string') {
    const match1 = value1.match(/^[\d\.]+/); // Extracts leading numbers
    if (match1) num1 = parseFloat(match1[0]);
  }

  if (typeof value2 === 'number') {
    num2 = value2;
  } else if (typeof value2 === 'string') {
    const match2 = value2.match(/^[\d\.]+/); // Extracts leading numbers
    if (match2) num2 = parseFloat(match2[0]);
  }
  
  if (!isNaN(num1) && !isNaN(num2)) {
    if (num1 === num2) return [false, false]; // If numeric values are same after parsing
    if (isHigherBetter) {
      return [num1 > num2, num1 < num2]; // [value1_is_better, value1_is_worse]
    } else {
      return [num1 < num2, num1 > num2]; // [value1_is_better, value1_is_worse]
    }
  }

  // Case 4: Boolean comparison
  if (typeof value1 === 'boolean' && typeof value2 === 'boolean') {
    // if they are same, it's [false,false], already handled by value1 === value2
    if (isHigherBetter) { // Assuming true is better for booleans if isHigherBetter
        return [value1, !value1]; // value1 is better if true, worse if false (compared to value2 which must be the opposite)
    } else { // Assuming false is better for booleans if !isHigherBetter
        return [!value1, value1]; // value1 is better if false, worse if true
    }
  }
  
  // Case 5: Handle if one is a number and the other is a non-empty, non-numeric string
  // This implies one value is quantifiable and the other is some qualitative description or "N/A" not caught by isEmpty
  if (!isNaN(num1) && isNaN(num2) && !val2Empty) { // value1 is number, value2 is non-empty non-numeric string
    return [true, false]; // value1 (numeric) is considered better
  }
  if (isNaN(num1) && !isNaN(num2) && !val1Empty) { // value1 is non-empty non-numeric string, value2 is number
    return [false, true]; // value2 (numeric) is considered better
  }

  // Default: if they are different non-numeric strings, or mixed types not handled above.
  // Example: "IPS" vs "OLED" - no clear "better" unless specified by a particular logic not present here.
  // Or if one is a string like "Available" and other is "Not Available"
  // If one value exists and the other doesn't (already handled by isEmpty checks at the top for null/undefined/'')
  // For other differing strings, it's neutral.
  return [false, false];
}
  
export function calculateWeightedScore(laptop: any, weights: any) {
  const { benchmarks } = laptop;
  
  // Calculate the sum of (rating × weight)
  const weightedSum = 
    benchmarks.productivity * weights.performance +
    benchmarks.gaming * weights.gaming +
    benchmarks.display * weights.display +
    benchmarks.battery * weights.battery +
    (benchmarks.build * weights.portability);
  
  // Calculate the sum of weights
  const totalWeight = 
    weights.performance +
    weights.gaming +
    weights.display +
    weights.battery +
    weights.connectivity +
    weights.portability;
  
  // Calculate the normalized score (out of 10)
  const normalizedScore = (weightedSum / (totalWeight * 10)) * 10;
  
  return normalizedScore.toFixed(2);
}
  
export function getKeyDifferences(laptops: any[]) {
  const laptop1 = laptops[0]
  const laptop2 = laptops[1]

  const differences = {
    laptop1: [] as string[],
    laptop2: [] as string[],
  }

  // Weight difference
  const weight1 = Number.parseFloat(laptop1.detailedSpecs.case.weight.split(" ")[0])
  const weight2 = Number.parseFloat(laptop2.detailedSpecs.case.weight.split(" ")[0])
  if (weight1 < weight2) {
    differences.laptop1.push(`Lighter by ${(weight2 - weight1).toFixed(1)} kg`)
  } else if (weight2 < weight1) {
    differences.laptop2.push(`Lighter by ${(weight1 - weight2).toFixed(1)} kg`)
  }

  // Display refresh rate
  const refresh1 = Number.parseInt(laptop1.detailedSpecs.display.refreshRate)
  const refresh2 = Number.parseInt(laptop2.detailedSpecs.display.refreshRate)
  if (refresh1 > refresh2) {
    differences.laptop1.push(`Higher refresh rate (${refresh1}Hz vs ${refresh2}Hz)`)
  } else if (refresh2 > refresh1) {
    differences.laptop2.push(`Higher refresh rate (${refresh2}Hz vs ${refresh1}Hz)`)
  }

  // Battery capacity
  const battery1 = Number.parseInt(laptop1.detailedSpecs.battery.capacity)
  const battery2 = Number.parseInt(laptop2.detailedSpecs.battery.capacity)
  if (battery1 > battery2) {
    differences.laptop1.push(`Larger battery (${battery1}Wh vs ${battery2}Wh)`)
  } else if (battery2 > battery1) { // Fixed the condition here
    differences.laptop2.push(`Larger battery (${battery2}Wh vs ${battery1}Wh)`)
  }

  // Storage
  const storage1 = Number.parseInt(laptop1.specs.storage.split("GB")[0])
  const storage2 = Number.parseInt(laptop2.specs.storage.split("GB")[0])
  if (storage1 > storage2) {
    differences.laptop1.push(`More storage (${storage1}GB vs ${storage2}GB)`)
  } else if (storage2 > storage1) {
    differences.laptop2.push(`More storage (${storage2}GB vs ${storage1}GB)`)
  }

  // GPU performance
  if (laptop1.benchmarks.gaming > laptop2.benchmarks.gaming) {
    const diff = Math.round((laptop1.benchmarks.gaming / laptop2.benchmarks.gaming - 1) * 100)
    differences.laptop1.push(`Better gaming performance (${diff}% faster)`)
  } else if (laptop2.benchmarks.gaming > laptop1.benchmarks.gaming) {
    const diff = Math.round((laptop2.benchmarks.gaming / laptop1.benchmarks.gaming - 1) * 100)
    differences.laptop2.push(`Better gaming performance (${diff}% faster)`)
  }

  // CPU performance
  if (laptop1.benchmarks.productivity > laptop2.benchmarks.productivity) {
    const diff = Math.round((laptop1.benchmarks.productivity / laptop2.benchmarks.productivity - 1) * 100)
    differences.laptop1.push(`Better productivity performance (${diff}% faster)`)
  } else if (laptop2.benchmarks.productivity > laptop1.benchmarks.productivity) {
    const diff = Math.round((laptop2.benchmarks.productivity / laptop1.benchmarks.productivity - 1) * 100)
    differences.laptop2.push(`Better productivity performance (${diff}% faster)`)
  }

  // Display quality
  if (laptop1.benchmarks.display > laptop2.benchmarks.display) {
    differences.laptop1.push("Better display quality")
  } else if (laptop2.benchmarks.display > laptop1.benchmarks.display) {
    differences.laptop2.push("Better display quality")
  }

  // USB-C ports
  const usbc1 = laptop1.detailedSpecs.connectivity.ports.usbc
  const usbc2 = laptop2.detailedSpecs.connectivity.ports.usbc
  if (usbc1 > usbc2) {
    differences.laptop1.push(`More USB-C ports (${usbc1} vs ${usbc2})`)
  } else if (usbc2 > usbc1) {
    differences.laptop2.push(`More USB-C ports (${usbc2} vs ${usbc1})`)
  }

  return differences
}