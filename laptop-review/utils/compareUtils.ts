// laptop-review/utils/compareUtils.ts
export function compareSpecs(value1: any, value2: any, isHigherBetter = true): [boolean, boolean] {
  // Helper to determine if a value is considered "empty" or "N/A"
  const isEmpty = (val: any) => val === null || val === undefined || val === '' || String(val).toLowerCase() === 'n/a';

  const val1Empty = isEmpty(value1);
  const val2Empty = isEmpty(value2);

  if (val1Empty && !val2Empty) {
    return [false, true];
  }
  if (!val1Empty && val2Empty) {
    return [true, false];
  }
  if (val1Empty && val2Empty) {
    return [false, false];
  }
  if (value1 === value2) {
    return [false, false];
  }

  let num1 = NaN;
  let num2 = NaN;

  if (typeof value1 === 'number') {
    num1 = value1;
  } else if (typeof value1 === 'string') {
    const match1 = value1.match(/^[\d\.]+/);
    if (match1) num1 = parseFloat(match1[0]);
  }

  if (typeof value2 === 'number') {
    num2 = value2;
  } else if (typeof value2 === 'string') {
    const match2 = value2.match(/^[\d\.]+/);
    if (match2) num2 = parseFloat(match2[0]);
  }
  
  if (!isNaN(num1) && !isNaN(num2)) {
    if (num1 === num2) return [false, false];
    if (isHigherBetter) {
      return [num1 > num2, num1 < num2];
    } else {
      return [num1 < num2, num1 > num2];
    }
  }

  if (typeof value1 === 'boolean' && typeof value2 === 'boolean') {
    if (isHigherBetter) {
        return [value1, !value1];
    } else {
        return [!value1, value1];
    }
  }
  
  if (!isNaN(num1) && isNaN(num2) && !val2Empty) {
    return [true, false];
  }
  if (isNaN(num1) && !isNaN(num2) && !val1Empty) {
    return [false, true];
  }

  return [false, false];
}
  
export function calculateWeightedScore(device: any, weights: any) {
  if (!device) return "0.00";
  const benchmarks = device.benchmarks || {};
  
  const isPhone = !!(device.specs?.soc || device.specs?.operatingSystem);

  if (isPhone) {
    const performance = Number(benchmarks.performanceScore) || 8.5;
    const camera = Number(benchmarks.cameraScore) || 8.5;
    const display = Number(benchmarks.displayScore) || 8.5;
    const battery = Number(benchmarks.batteryScore) || 8.5;
    const design = Number(benchmarks.designScore) || 8.5;

    const weightedSum = 
      performance * (weights.performance ?? 1) +
      camera * (weights.gaming ?? 1) + // Use gaming slider for Camera/Graphics
      display * (weights.display ?? 1) +
      battery * (weights.battery ?? 1) +
      design * (weights.portability ?? 1);

    const totalWeight = 
      (weights.performance ?? 1) +
      (weights.gaming ?? 1) +
      (weights.display ?? 1) +
      (weights.battery ?? 1) +
      (weights.portability ?? 1);

    if (totalWeight === 0) return "0.00";
    const normalizedScore = weightedSum / totalWeight;
    return normalizedScore.toFixed(2);
  }

  // Laptop calculation
  const productivity = Number(benchmarks.productivity) || 7.5;
  const gaming = Number(benchmarks.gaming) || 7.5;
  const display = Number(benchmarks.display) || 7.5;
  const battery = Number(benchmarks.battery) || 7.5;
  const build = Number(benchmarks.build) || 7.5;

  const weightedSum = 
    productivity * (weights.performance ?? 1) +
    gaming * (weights.gaming ?? 1) +
    display * (weights.display ?? 1) +
    battery * (weights.battery ?? 1) +
    build * (weights.portability ?? 1);

  const totalWeight = 
    (weights.performance ?? 1) +
    (weights.gaming ?? 1) +
    (weights.display ?? 1) +
    (weights.battery ?? 1) +
    (weights.connectivity ?? 1) +
    (weights.portability ?? 1);

  if (totalWeight === 0) return "0.00";
  const normalizedScore = weightedSum / totalWeight;
  return normalizedScore.toFixed(2);
}
  
export function getKeyDifferences(items: any[]) {
  if (!items || items.length < 2) return { laptop1: [], laptop2: [] };
  
  const item1 = items[0];
  const item2 = items[1];

  const differences = {
    laptop1: [] as string[],
    laptop2: [] as string[],
  };

  const isPhone = !!(item1.specs?.soc || item1.specs?.operatingSystem);

  if (isPhone) {
    // Weight difference (g)
    const w1 = parseFloat(item1.specs?.weight?.replace(/[^0-9\.]/g, '') || '0');
    const w2 = parseFloat(item2.specs?.weight?.replace(/[^0-9\.]/g, '') || '0');
    if (w1 > 0 && w2 > 0) {
      if (w1 < w2) differences.laptop1.push(`Nhẹ hơn ${(w2 - w1).toFixed(0)}g (${w1}g vs ${w2}g)`);
      else if (w2 < w1) differences.laptop2.push(`Nhẹ hơn ${(w1 - w2).toFixed(0)}g (${w2}g vs ${w1}g)`);
    }

    // Battery Capacity (mAh)
    const b1 = parseInt(item1.specs?.battery?.replace(/[^0-9]/g, '') || '0');
    const b2 = parseInt(item2.specs?.battery?.replace(/[^0-9]/g, '') || '0');
    if (b1 > 0 && b2 > 0) {
      if (b1 > b2) differences.laptop1.push(`Dung lượng pin lớn hơn (${b1}mAh vs ${b2}mAh)`);
      else if (b2 > b1) differences.laptop2.push(`Dung lượng pin lớn hơn (${b2}mAh vs ${b1}mAh)`);
    }

    // Charging Wattage (W)
    const c1 = parseInt(item1.specs?.charging?.replace(/[^0-9]/g, '') || '0');
    const c2 = parseInt(item2.specs?.charging?.replace(/[^0-9]/g, '') || '0');
    if (c1 > 0 && c2 > 0) {
      if (c1 > c2) differences.laptop1.push(`Sạc nhanh hơn (${c1}W vs ${c2}W)`);
      else if (c2 > c1) differences.laptop2.push(`Sạc nhanh hơn (${c2}W vs ${c1}W)`);
    }

    // RAM (GB)
    const r1 = parseInt(item1.specs?.ram?.replace(/[^0-9]/g, '') || '0');
    const r2 = parseInt(item2.specs?.ram?.replace(/[^0-9]/g, '') || '0');
    if (r1 > 0 && r2 > 0) {
      if (r1 > r2) differences.laptop1.push(`Dung lượng RAM lớn hơn (${r1}GB vs ${r2}GB)`);
      else if (r2 > r1) differences.laptop2.push(`Dung lượng RAM lớn hơn (${r2}GB vs ${r1}GB)`);
    }

    // Storage (GB)
    const s1 = parseInt(item1.specs?.storage?.replace(/[^0-9]/g, '') || '0');
    const s2 = parseInt(item2.specs?.storage?.replace(/[^0-9]/g, '') || '0');
    if (s1 > 0 && s2 > 0) {
      if (s1 > s2) differences.laptop1.push(`Bộ nhớ trong lớn hơn (${s1}GB vs ${s2}GB)`);
      else if (s2 > s1) differences.laptop2.push(`Bộ nhớ trong lớn hơn (${s2}GB vs ${s1}GB)`);
    }

    // Refresh Rate (Hz)
    const hz1 = parseInt(item1.specs?.display?.match(/(\d+)\s*Hz/i)?.[1] || '60');
    const hz2 = parseInt(item2.specs?.display?.match(/(\d+)\s*Hz/i)?.[1] || '60');
    if (hz1 > hz2) differences.laptop1.push(`Màn hình tần số quét cao hơn (${hz1}Hz vs ${hz2}Hz)`);
    else if (hz2 > hz1) differences.laptop2.push(`Màn hình tần số quét cao hơn (${hz2}Hz vs ${hz1}Hz)`);

    // Performance Score / AnTuTu
    const perf1 = Number(item1.benchmarks?.performanceScore || item1.benchmarks?.overall || 0);
    const perf2 = Number(item2.benchmarks?.performanceScore || item2.benchmarks?.overall || 0);
    if (perf1 > perf2) differences.laptop1.push(`Hiệu năng tổng thể cao hơn (${perf1.toFixed(1)}/10 vs ${perf2.toFixed(1)}/10)`);
    else if (perf2 > perf1) differences.laptop2.push(`Hiệu năng tổng thể cao hơn (${perf2.toFixed(1)}/10 vs ${perf1.toFixed(1)}/10)`);

    // Camera Score
    const cam1 = Number(item1.benchmarks?.cameraScore || 0);
    const cam2 = Number(item2.benchmarks?.cameraScore || 0);
    if (cam1 > cam2) differences.laptop1.push(`Chất lượng camera đánh giá cao hơn (${cam1.toFixed(1)}/10 vs ${cam2.toFixed(1)}/10)`);
    else if (cam2 > cam1) differences.laptop2.push(`Chất lượng camera đánh giá cao hơn (${cam2.toFixed(1)}/10 vs ${cam1.toFixed(1)}/10)`);

    return differences;
  }

  // Laptop comparison key differences
  const weight1 = Number.parseFloat(item1.detailedSpecs?.case?.weight?.split(" ")[0] || '0')
  const weight2 = Number.parseFloat(item2.detailedSpecs?.case?.weight?.split(" ")[0] || '0')
  if (weight1 > 0 && weight2 > 0) {
    if (weight1 < weight2) {
      differences.laptop1.push(`Nhẹ hơn ${(weight2 - weight1).toFixed(1)} kg`)
    } else if (weight2 < weight1) {
      differences.laptop2.push(`Nhẹ hơn ${(weight1 - weight2).toFixed(1)} kg`)
    }
  }

  const refresh1 = Number.parseInt(item1.detailedSpecs?.display?.refreshRate || '60')
  const refresh2 = Number.parseInt(item2.detailedSpecs?.display?.refreshRate || '60')
  if (refresh1 > refresh2) {
    differences.laptop1.push(`Tần số quét cao hơn (${refresh1}Hz vs ${refresh2}Hz)`)
  } else if (refresh2 > refresh1) {
    differences.laptop2.push(`Tần số quét cao hơn (${refresh2}Hz vs ${refresh1}Hz)`)
  }

  const battery1 = Number.parseInt(item1.detailedSpecs?.battery?.capacity || '0')
  const battery2 = Number.parseInt(item2.detailedSpecs?.battery?.capacity || '0')
  if (battery1 > 0 && battery2 > 0) {
    if (battery1 > battery2) {
      differences.laptop1.push(`Dung lượng pin lớn hơn (${battery1}Wh vs ${battery2}Wh)`)
    } else if (battery2 > battery1) {
      differences.laptop2.push(`Dung lượng pin lớn hơn (${battery2}Wh vs ${battery1}Wh)`)
    }
  }

  const storage1 = Number.parseInt(item1.specs?.storage?.split("GB")[0] || '0')
  const storage2 = Number.parseInt(item2.specs?.storage?.split("GB")[0] || '0')
  if (storage1 > 0 && storage2 > 0) {
    if (storage1 > storage2) {
      differences.laptop1.push(`Bộ nhớ lớn hơn (${storage1}GB vs ${storage2}GB)`)
    } else if (storage2 > storage1) {
      differences.laptop2.push(`Bộ nhớ lớn hơn (${storage2}GB vs ${storage1}GB)`)
    }
  }

  if (item1.benchmarks?.gaming && item2.benchmarks?.gaming) {
    if (item1.benchmarks.gaming > item2.benchmarks.gaming) {
      const diff = Math.round((item1.benchmarks.gaming / item2.benchmarks.gaming - 1) * 100)
      differences.laptop1.push(`Hiệu năng chơi game tốt hơn (${diff}% nhanh hơn)`)
    } else if (item2.benchmarks.gaming > item1.benchmarks.gaming) {
      const diff = Math.round((item2.benchmarks.gaming / item1.benchmarks.gaming - 1) * 100)
      differences.laptop2.push(`Hiệu năng chơi game tốt hơn (${diff}% nhanh hơn)`)
    }
  }

  if (item1.benchmarks?.productivity && item2.benchmarks?.productivity) {
    if (item1.benchmarks.productivity > item2.benchmarks.productivity) {
      const diff = Math.round((item1.benchmarks.productivity / item2.benchmarks.productivity - 1) * 100)
      differences.laptop1.push(`Hiệu năng làm việc tốt hơn (${diff}% nhanh hơn)`)
    } else if (item2.benchmarks.productivity > item1.benchmarks.productivity) {
      const diff = Math.round((item2.benchmarks.productivity / item1.benchmarks.productivity - 1) * 100)
      differences.laptop2.push(`Hiệu năng làm việc tốt hơn (${diff}% nhanh hơn)`)
    }
  }

  return differences;
}