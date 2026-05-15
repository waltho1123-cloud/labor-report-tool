const DIGITS = ["零", "壹", "貳", "參", "肆", "伍", "陸", "柒", "捌", "玖"];
const UNITS = ["", "拾", "佰", "仟"];
const BIG_UNITS = ["", "萬", "億", "兆"];

export function numberToChinese(input: number | string): string {
  if (input === "" || input === null || input === undefined) return "";
  const num = Math.floor(Number(input));
  if (!Number.isFinite(num) || num < 0) return "";
  if (num === 0) return "零元整";

  const str = String(num);
  const rawGroups: string[] = [];
  for (let i = str.length; i > 0; i -= 4) {
    rawGroups.unshift(str.slice(Math.max(0, i - 4), i));
  }
  const groups = rawGroups.map((g) => g.padStart(4, "0"));

  let result = "";
  for (let g = 0; g < groups.length; g++) {
    const group = groups[g];
    const bigUnit = BIG_UNITS[groups.length - 1 - g];

    let groupStr = "";
    let groupHasNonZero = false;
    let zeroRun = false;
    for (let i = 0; i < 4; i++) {
      const digit = Number(group[i]);
      const unit = UNITS[3 - i];
      if (digit === 0) {
        zeroRun = true;
      } else {
        if (zeroRun && groupHasNonZero) groupStr += "零";
        groupStr += DIGITS[digit] + unit;
        groupHasNonZero = true;
        zeroRun = false;
      }
    }

    if (!groupHasNonZero) continue;

    if (g > 0 && result && !result.endsWith("零")) {
      const prevEndsWithZero = groups[g - 1].endsWith("0");
      const thisStartsWithZero = group.search(/[1-9]/) > 0;
      if (prevEndsWithZero || thisStartsWithZero) {
        result += "零";
      }
    }
    result += groupStr + bigUnit;
  }

  return result + "元整";
}
