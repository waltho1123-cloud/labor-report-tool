export interface BusinessCategory {
  code: string;
  name: string;
  rate: number; // 費用率 (0-100)
}

// 9A 執行業務所得 — 業務類別與費用率
export const businessCategories9A: BusinessCategory[] = [
  // 醫療相關
  { code: "01", name: "內科醫師", rate: 40 },
  { code: "02", name: "外科醫師", rate: 45 },
  { code: "03", name: "小兒科醫師", rate: 40 },
  { code: "04", name: "婦產科醫師", rate: 45 },
  { code: "05", name: "眼科醫師", rate: 40 },
  { code: "06", name: "耳鼻喉科醫師", rate: 40 },
  { code: "07", name: "牙科醫師", rate: 40 },
  { code: "08", name: "皮膚科醫師", rate: 40 },
  { code: "09", name: "泌尿科醫師", rate: 40 },
  { code: "10", name: "精神科醫師", rate: 46 },
  { code: "11", name: "骨科醫師", rate: 45 },
  { code: "12", name: "復健科醫師", rate: 43 },
  { code: "13", name: "麻醉科醫師", rate: 46 },
  { code: "14", name: "放射線科醫師", rate: 46 },
  { code: "15", name: "病理科醫師", rate: 46 },
  { code: "16", name: "家庭醫學科醫師", rate: 40 },
  { code: "17", name: "急診醫學科醫師", rate: 40 },
  { code: "18", name: "核子醫學科醫師", rate: 46 },
  { code: "19", name: "神經科醫師", rate: 40 },
  { code: "20", name: "神經外科醫師", rate: 45 },
  { code: "21", name: "整形外科醫師", rate: 45 },
  { code: "22", name: "職業醫學科醫師", rate: 40 },
  { code: "23", name: "中醫師", rate: 20 },
  { code: "24", name: "西醫其他科別醫師", rate: 43 },
  // 藥師 / 醫事人員
  { code: "25", name: "藥師（自備藥品）", rate: 100 },
  { code: "26", name: "藥師（未自備藥品）", rate: 20 },
  { code: "27", name: "助產師（士）", rate: 31 },
  { code: "28", name: "醫事檢驗師（生）", rate: 43 },
  { code: "29", name: "護理師（護士）", rate: 20 },
  { code: "30", name: "物理治療師", rate: 43 },
  { code: "31", name: "職能治療師", rate: 43 },
  { code: "32", name: "營養師", rate: 20 },
  { code: "33", name: "心理師", rate: 20 },
  { code: "34", name: "呼吸治療師", rate: 43 },
  { code: "35", name: "語言治療師", rate: 43 },
  { code: "36", name: "聽力師", rate: 43 },
  { code: "37", name: "牙體技術師", rate: 40 },
  { code: "38", name: "驗光師（生）", rate: 40 },
  // 法律 / 專業服務
  { code: "39", name: "律師", rate: 30 },
  { code: "40", name: "律師代理訴訟案件", rate: 23 },
  { code: "41", name: "會計師", rate: 30 },
  { code: "42", name: "建築師", rate: 35 },
  { code: "43", name: "技師", rate: 35 },
  { code: "44", name: "地政士", rate: 30 },
  { code: "45", name: "記帳士", rate: 30 },
  { code: "46", name: "精算師", rate: 20 },
  { code: "47", name: "不動產估價師", rate: 35 },
  { code: "48", name: "專利師", rate: 30 },
  // 保險 / 經紀
  { code: "49", name: "保險經紀人", rate: 26 },
  { code: "50", name: "一般經紀人", rate: 20 },
  // 教育 / 托育
  { code: "51", name: "補習班", rate: 50 },
  { code: "52", name: "幼兒園", rate: 50 },
  { code: "53", name: "托嬰中心", rate: 80 },
  { code: "54", name: "課後照顧服務中心", rate: 50 },
  // 藝術 / 創作
  { code: "55", name: "書畫家", rate: 30 },
  { code: "56", name: "表演人", rate: 45 },
  { code: "57", name: "命理卜卦", rate: 20 },
  // 工匠 / 技術
  { code: "58", name: "工匠（工資收入）", rate: 20 },
  { code: "59", name: "引水人", rate: 25 },
  { code: "60", name: "民間公證人", rate: 30 },
  { code: "61", name: "記帳及報稅代理人", rate: 30 },
  // 著作人
  { code: "62", name: "著作人（版稅收入）", rate: 30 },
  { code: "63", name: "著作人（自行出版）", rate: 75 },
  // 其他
  { code: "64", name: "程式設計師", rate: 20 },
  { code: "65", name: "翻譯人員", rate: 20 },
  { code: "66", name: "商標代理人", rate: 30 },
  { code: "67", name: "其他", rate: 0 },
];

// 9B 稿費 — 無業務類別選項
// 50 薪資所得 — 無業務類別選項
// 92 其他所得 — 無業務類別選項

export type ReportCategory = "9A" | "9B" | "50" | "92";

export const reportCategoryLabels: Record<ReportCategory, string> = {
  "9A": "9A 執行業務所得",
  "9B": "9B 稿費",
  "50": "50 薪資所得",
  "92": "92 其他所得",
};

export type Nationality = "local" | "foreign_resident" | "foreign_non_resident";

export const nationalityLabels: Record<Nationality, string> = {
  local: "本國人",
  foreign_resident: "外國人：待滿183天（居住者）",
  foreign_non_resident: "外國人：未待滿183天（非居住者）",
};
