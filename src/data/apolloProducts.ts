export interface ApolloProduct {
  id: string;
  name: string;
  sku: string;
  category: string;
  unit: string;
  gstRate: number;
  basePrice: number;
  stock: string;
  description?: string;
}

export interface ApolloLineItem {
  id: string;
  productId?: string;
  name: string;
  sku: string;
  category: string;
  unit: string;
  basePrice: number;
  qty: number;
  gstRate: number;
  amount: number;
}

export const apolloCategories = [
  "All",
  "G.I. Solar Mounting Structure",
  "Clamps & Joiners",
  "Fasteners & Hardware",
  "Earthing & Lightning",
  "Electrical Panels",
  "Accessories",
  "Wires & Cables",
  "Solar Modules & Kits",
] as const;

export const apolloProductsCatalog: ApolloProduct[] = [
  // ── 1. G.I. Solar Mounting Structure ──
  {
    id: "apl-raf-2180",
    name: "Rafter 21ft 80X40",
    sku: "APL-RAF-2180",
    category: "G.I. Solar Mounting Structure",
    unit: "Pcs",
    gstRate: 18,
    basePrice: 450,
    stock: "In Stock",
    description: "21ft 80x40mm Hot Dip Pre-Galvanised Structure Rafter",
  },
  {
    id: "apl-raf-21140",
    name: "Rafter 21ft 140X50",
    sku: "APL-RAF-21140",
    category: "G.I. Solar Mounting Structure",
    unit: "Pcs",
    gstRate: 18,
    basePrice: 650,
    stock: "In Stock",
    description: "21ft 140x50mm Heavy Duty Structure Rafter",
  },
  {
    id: "apl-raf-1280",
    name: "Rafter 12ft 80X40",
    sku: "APL-RAF-1280",
    category: "G.I. Solar Mounting Structure",
    unit: "Pcs",
    gstRate: 18,
    basePrice: 280,
    stock: "In Stock",
    description: "12ft 80x40mm Structure Rafter Section",
  },
  {
    id: "apl-pur-2141",
    name: "Purlin 21ft 41X41",
    sku: "APL-PUR-2141",
    category: "G.I. Solar Mounting Structure",
    unit: "Pcs",
    gstRate: 18,
    basePrice: 380,
    stock: "In Stock",
    description: "21ft 41x41mm C-Channel Solar Mounting Purlin",
  },
  {
    id: "apl-pur-1241",
    name: "Purlin 12ft 41X41",
    sku: "APL-PUR-1241",
    category: "G.I. Solar Mounting Structure",
    unit: "Pcs",
    gstRate: 18,
    basePrice: 220,
    stock: "In Stock",
    description: "12ft 41x41mm C-Channel Solar Mounting Purlin",
  },
  {
    id: "apl-bp-8040",
    name: "Base Plate 80X40",
    sku: "APL-BP-8040",
    category: "G.I. Solar Mounting Structure",
    unit: "Pcs",
    gstRate: 18,
    basePrice: 140,
    stock: "In Stock",
    description: "Base Plate for 80x40 column/leg mounting",
  },
  {
    id: "apl-bp-14050",
    name: "Base Plate 140X50",
    sku: "APL-BP-14050",
    category: "G.I. Solar Mounting Structure",
    unit: "Pcs",
    gstRate: 18,
    basePrice: 190,
    stock: "In Stock",
    description: "Heavy Duty Base Plate for 140x50 column mounting",
  },

  // ── 2. Clamps & Joiners ──
  {
    id: "apl-mc-001",
    name: "Mid Clamp",
    sku: "APL-MC-001",
    category: "Clamps & Joiners",
    unit: "Pcs",
    gstRate: 18,
    basePrice: 35,
    stock: "In Stock",
    description: "Aluminum/GI Mid Clamp for solar module framing",
  },
  {
    id: "apl-ec-001",
    name: "End Clamp",
    sku: "APL-EC-001",
    category: "Clamps & Joiners",
    unit: "Pcs",
    gstRate: 18,
    basePrice: 35,
    stock: "In Stock",
    description: "Aluminum/GI End Clamp for solar array edges",
  },
  {
    id: "apl-pj-001",
    name: "Purlin Jointer",
    sku: "APL-PJ-001",
    category: "Clamps & Joiners",
    unit: "Pcs",
    gstRate: 18,
    basePrice: 55,
    stock: "In Stock",
    description: "Internal/External Purlin connector for continuous run",
  },
  {
    id: "apl-rj-001",
    name: "Rafter Jointer",
    sku: "APL-RJ-001",
    category: "Clamps & Joiners",
    unit: "Pcs",
    gstRate: 18,
    basePrice: 75,
    stock: "In Stock",
    description: "Heavy Duty Rafter splice connector",
  },
  {
    id: "apl-dh-001",
    name: "Degree Hanger",
    sku: "APL-DH-001",
    category: "Clamps & Joiners",
    unit: "Pcs",
    gstRate: 18,
    basePrice: 45,
    stock: "In Stock",
    description: "Tilt angle adjustment degree hanger bracket",
  },
  {
    id: "apl-suc-001",
    name: "Solgrip Universal Clamp",
    sku: "APL-SUC-001",
    category: "Clamps & Joiners",
    unit: "Pcs",
    gstRate: 18,
    basePrice: 40,
    stock: "In Stock",
    description: "Universal Solgrip Module Clamp with grounding teeth",
  },

  // ── 3. Fasteners & Hardware ──
  {
    id: "apl-nbw-001",
    name: "Nut Bolt Washer",
    sku: "APL-NBW-001",
    category: "Fasteners & Hardware",
    unit: "Set",
    gstRate: 18,
    basePrice: 18,
    stock: "In Stock",
    description: "SS304/GI Grade 8.8 Nut, Bolt & Spring Washer Set",
  },

  // ── 4. Earthing & Lightning ──
  {
    id: "apl-er-1m",
    name: "Earthing Rod 1mtr",
    sku: "APL-ER-1M",
    category: "Earthing & Lightning",
    unit: "Pcs",
    gstRate: 18,
    basePrice: 450,
    stock: "In Stock",
    description: "1 Meter Copper Bonded / GI Chemical Earthing Electrode",
  },
  {
    id: "apl-er-2m",
    name: "Earthing Rod 2mtr",
    sku: "APL-ER-2M",
    category: "Earthing & Lightning",
    unit: "Pcs",
    gstRate: 18,
    basePrice: 750,
    stock: "In Stock",
    description: "2 Meter Copper Bonded / GI Heavy Chemical Earthing Electrode",
  },
  {
    id: "apl-la-001",
    name: "Lightning Arrestor",
    sku: "APL-LA-001",
    category: "Earthing & Lightning",
    unit: "Pcs",
    gstRate: 18,
    basePrice: 850,
    stock: "In Stock",
    description: "ESE / Multi-Spike Copper Lightning Arrestor Spike",
  },
  {
    id: "apl-lab-pvc",
    name: "L.A. PVC Base",
    sku: "APL-LAB-PVC",
    category: "Earthing & Lightning",
    unit: "Pcs",
    gstRate: 18,
    basePrice: 150,
    stock: "In Stock",
    description: "Insulating PVC Mounting Base for Lightning Arrestor",
  },
  {
    id: "apl-lab-red",
    name: "L.A. Red Insulator Base",
    sku: "APL-LAB-RED",
    category: "Earthing & Lightning",
    unit: "Pcs",
    gstRate: 18,
    basePrice: 180,
    stock: "In Stock",
    description: "High Voltage Red Resin Insulator Base for L.A.",
  },
  {
    id: "apl-lab-mtl",
    name: "L.A. Metal Base",
    sku: "APL-LAB-MTL",
    category: "Earthing & Lightning",
    unit: "Pcs",
    gstRate: 18,
    basePrice: 250,
    stock: "In Stock",
    description: "Heavy Metal Base Bracket for Lightning Arrestor Mast",
  },

  // ── 5. Electrical Panels ──
  {
    id: "apl-acdb-1ph",
    name: "ACDB 1PH",
    sku: "APL-ACDB-1PH",
    category: "Electrical Panels",
    unit: "Pcs",
    gstRate: 18,
    basePrice: 1850,
    stock: "In Stock",
    description: "Single Phase AC Distribution Box with MCB & SPD",
  },
  {
    id: "apl-dcdb-1i1o",
    name: "DCDB 1 IN 1 OUT",
    sku: "APL-DCDB-1I1O",
    category: "Electrical Panels",
    unit: "Pcs",
    gstRate: 18,
    basePrice: 1650,
    stock: "In Stock",
    description: "1 String In 1 String Out DC Distribution Box (1000V DC SPD + Fuse)",
  },
  {
    id: "apl-dcdb-2i1o",
    name: "DCDB 2 IN 1 OUT",
    sku: "APL-DCDB-2I1O",
    category: "Electrical Panels",
    unit: "Pcs",
    gstRate: 18,
    basePrice: 2100,
    stock: "In Stock",
    description: "2 String In 1 Out Combined DC Distribution Box",
  },
  {
    id: "apl-dcdb-3i1o",
    name: "DCDB 3 IN 1 OUT",
    sku: "APL-DCDB-3I1O",
    category: "Electrical Panels",
    unit: "Pcs",
    gstRate: 18,
    basePrice: 2650,
    stock: "In Stock",
    description: "3 String In 1 Out DC Distribution Box for multi-MPPT",
  },
  {
    id: "apl-dcdb-2i2o",
    name: "DCDB 2 IN 2 OUT",
    sku: "APL-DCDB-2I2O",
    category: "Electrical Panels",
    unit: "Pcs",
    gstRate: 18,
    basePrice: 2450,
    stock: "In Stock",
    description: "Dual Tracker 2 In 2 Out DC Distribution Box",
  },
  {
    id: "apl-acdb-3ph",
    name: "ACDB 3PH",
    sku: "APL-ACDB-3PH",
    category: "Electrical Panels",
    unit: "Pcs",
    gstRate: 18,
    basePrice: 3850,
    stock: "In Stock",
    description: "Three Phase AC Distribution Box with 4P MCB/MCCB & Class II SPD",
  },

  // ── 6. Accessories ──
  {
    id: "apl-pit-001",
    name: "Pit Cover",
    sku: "APL-PIT-001",
    category: "Accessories",
    unit: "Pcs",
    gstRate: 18,
    basePrice: 350,
    stock: "In Stock",
    description: "Heavy Duty Plastic/FRP Earth Pit Chamber Cover",
  },
  {
    id: "apl-mc4-001",
    name: "MC-4 Connector",
    sku: "APL-MC4-001",
    category: "Accessories",
    unit: "Pair",
    gstRate: 18,
    basePrice: 45,
    stock: "In Stock",
    description: "IP68 1500V Male & Female Solar MC4 Connectors",
  },

  // ── 7. Wires & Cables ──
  {
    id: "apl-dcw-4p",
    name: "DC Wire 4MM Polycab (100Mtr)",
    sku: "APL-DCW-4P",
    category: "Wires & Cables",
    unit: "BDL",
    gstRate: 18,
    basePrice: 5500,
    stock: "In Stock",
    description: "Polycab 4 sq mm Cross-Linked Solar DC Cable (100 Meter Bundle)",
  },
  {
    id: "apl-dcw-4h",
    name: "DC Wire 4MM HPL (100Mtr)",
    sku: "APL-DCW-4H",
    category: "Wires & Cables",
    unit: "BDL",
    gstRate: 18,
    basePrice: 5100,
    stock: "In Stock",
    description: "HPL 4 sq mm Tinned Copper Solar DC Cable (100 Meter Bundle)",
  },
  {
    id: "apl-acw-4p",
    name: "AC Wire 4MM Polycab",
    sku: "APL-ACW-4P",
    category: "Wires & Cables",
    unit: "Mtr",
    gstRate: 18,
    basePrice: 62,
    stock: "In Stock",
    description: "Polycab 4 sq mm Copper AC Cable (Rate per meter)",
  },
  {
    id: "apl-acw-4h",
    name: "AC Wire 4MM HPL",
    sku: "APL-ACW-4H",
    category: "Wires & Cables",
    unit: "Mtr",
    gstRate: 18,
    basePrice: 55,
    stock: "In Stock",
    description: "HPL 4 sq mm Copper AC Cable (Rate per meter)",
  },
  {
    id: "apl-acw-6h",
    name: "AC Wire 6MM HPL",
    sku: "APL-ACW-6H",
    category: "Wires & Cables",
    unit: "Mtr",
    gstRate: 18,
    basePrice: 81,
    stock: "In Stock",
    description: "HPL 6 sq mm Copper AC Cable (Rate per meter)",
  },
  {
    id: "apl-ew-10a",
    name: "Earthing Wire 10MM ALU",
    sku: "APL-EW-10A",
    category: "Wires & Cables",
    unit: "Mtr",
    gstRate: 18,
    basePrice: 1350,
    stock: "In Stock",
    description: "10 sq mm Aluminum Earthing Conductor Wire",
  },
  {
    id: "apl-ew-6c",
    name: "Earthing Wire 6MM CCA",
    sku: "APL-EW-6C",
    category: "Wires & Cables",
    unit: "Mtr",
    gstRate: 18,
    basePrice: 1650,
    stock: "In Stock",
    description: "6 sq mm Copper Clad Aluminum (CCA) Earthing Wire",
  },
  {
    id: "apl-ew-16a",
    name: "Earthing Wire 16MM ALU",
    sku: "APL-EW-16A",
    category: "Wires & Cables",
    unit: "Mtr",
    gstRate: 18,
    basePrice: 1950,
    stock: "In Stock",
    description: "16 sq mm Heavy Aluminum Earthing Conductor Wire",
  },

  // ── 8. Solar Modules, Inverters & Kits ──
  {
    id: "apl-mod-w540",
    name: "Waaree 540W DCR",
    sku: "APL-MOD-W540",
    category: "Solar Modules & Kits",
    unit: "Pcs",
    gstRate: 18,
    basePrice: 12420,
    stock: "In Stock",
    description: "Waaree 540Wp Mono PERC / TOPCON DCR Solar PV Module",
  },
  {
    id: "apl-kit-tat3k",
    name: "TATA KIT 3KW",
    sku: "APL-KIT-TAT3K",
    category: "Solar Modules & Kits",
    unit: "Set",
    gstRate: 18,
    basePrice: 155000,
    stock: "In Stock",
    description: "Tata Power Complete 3KW Solar System Equipment Kit",
  },
  {
    id: "apl-kit-tat4k",
    name: "TATA KIT 4KW",
    sku: "APL-KIT-TAT4K",
    category: "Solar Modules & Kits",
    unit: "Set",
    gstRate: 18,
    basePrice: 195000,
    stock: "In Stock",
    description: "Tata Power Complete 4KW Solar System Equipment Kit",
  },
  {
    id: "apl-kit-tat5k",
    name: "TATA KIT 5KW",
    sku: "APL-KIT-TAT5K",
    category: "Solar Modules & Kits",
    unit: "Set",
    gstRate: 18,
    basePrice: 235000,
    stock: "In Stock",
    description: "Tata Power Complete 5KW Solar System Equipment Kit",
  },
  {
    id: "apl-inv-w3.3k",
    name: "WAAREE 3.3KW GTI",
    sku: "APL-INV-W3.3K",
    category: "Solar Modules & Kits",
    unit: "Pcs",
    gstRate: 18,
    basePrice: 24500,
    stock: "In Stock",
    description: "Waaree 3.3KW On-Grid Solar Inverter (GTI) Single Phase",
  },
];

export const defaultB2BTerms: string[] = [
  "Make & Material: Structure Make APOLLO (Hot-dip / pre-galvanised 80+ micron steel conforming to MNRE standards). Tata Structure also available upon confirmation.",
  "Rate Basis: Rates quoted are Ex-Factory / Warehouse basis. Freight & transit insurance to be borne by buyer on To-Pay basis.",
  "Taxes: GST @ 18% extra as applicable on all mounting structure, clamps, panels, and cables.",
  "Payment Terms: 100% advance against Proforma Invoice prior to dispatch clearance.",
  "Delivery Period: Materials dispatched within 3 to 5 business days upon receipt of confirmed PO and payment clearance.",
  "Validity: Prices quoted are valid for 7 days from the quotation date, subject to raw material steel index variation.",
  "Warranty: 25 Years warranty on structural integrity and hot-dip galvanization against atmospheric corrosion.",
  "Unloading: Unloading of materials at buyer site/destination is strictly in buyer scope.",
];

// Helper to convert number to Indian Rupees in words
export function numberToWordsINR(amount: number): string {
  if (amount === 0) return "Zero Rupees Only";
  const a = [
    "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
    "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
    "Seventeen", "Eighteen", "Nineteen",
  ];
  const b = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

  function inWords(num: number): string {
    if (num < 20) return a[num];
    const digit = num % 10;
    return b[Math.floor(num / 10)] + (digit !== 0 ? " " + a[digit] : "");
  }

  const rounded = Math.round(amount);
  const crore = Math.floor(rounded / 10000000);
  const lakh = Math.floor((rounded % 10000000) / 100000);
  const thousand = Math.floor((rounded % 100000) / 1000);
  const hundred = Math.floor((rounded % 1000) / 100);
  const rest = rounded % 100;

  let str = "";
  if (crore > 0) str += inWords(crore) + " Crore ";
  if (lakh > 0) str += inWords(lakh) + " Lakh ";
  if (thousand > 0) str += inWords(thousand) + " Thousand ";
  if (hundred > 0) str += inWords(hundred) + " Hundred ";
  if (rest > 0) str += inWords(rest) + " ";

  return str.trim() + " Rupees Only";
}
