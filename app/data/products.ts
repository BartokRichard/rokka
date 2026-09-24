export type MaterialOption = {
  name: string;
  price?: number;
  currency?: string;
  note?: string;
};

export type ColorPart = {
  id: string;
  label: string;
  mask: string;
  defaultColor: string;
  palette?: "material" | "fleece";
};

export type ColorOption = {
  id: string;
  label: string;
  hex?: string;
  texture?: {
    src: string;
    backgroundSize: string;
    swatchBackgroundSize?: string;
    backgroundPosition: string;
    backgroundRepeat?: "no-repeat" | "repeat";
  };
};

export type EarOption = {
  id: "bunny" | "bear";
  name: string;
  description: string;
  image: string;
  masks?: {
    outer: string;
    lining: string;
  };
};

export type VariantOption = {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
};

export type MeasurementConfig = {
  required?: boolean;
  help: string;
};

export type ProductModel = {
  src: string;
  scale?: number;
  position?: [number, number, number];
  colorBindings?: Array<{
    partId: string;
    matches: string[];
  }>;
};

export type Product = {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  image: string;
  cardImage?: string;
  cardImageFit?: "cover" | "contain";
  sampleImage: string;
  model?: ProductModel;
  masks: {
    body: string;
    sleeves?: string;
  };
  colorParts: ColorPart[];
  materialOptions: MaterialOption[];
  prices: string[];
  materials: string[];
  sizeOptions?: string[];
  sizePrices?: Record<string, Record<string, number>>;
  earOptions?: EarOption[];
  variantOptions?: VariantOption[];
  measurements?: {
    height?: MeasurementConfig;
    bust?: MeasurementConfig;
  };
};

export function getCurrentPrice(
  product: Product,
  material: MaterialOption,
  size?: string,
) {
  if (material.price) {
    return `${material.price} ${material.currency ?? "ron"}`;
  }

  const prices = product.sizePrices?.[material.name];
  const selectedPrice = size ? prices?.[size] : undefined;

  if (selectedPrice) {
    return `${selectedPrice} ron`;
  }

  if (prices) {
    const values = Object.values(prices);
    const minimum = Math.min(...values);
    const maximum = Math.max(...values);

    return `${minimum}–${maximum} ron`;
  }

  return material.note ?? "Ár egyeztetés szerint";
}

const COTTON_COLORS: ColorOption[] = [
  { id: "#a91f24", label: "Piros", hex: "#a91f24" },
  { id: "#85815f", label: "Oliva", hex: "#85815f" },
  { id: "#a97882", label: "Mályva", hex: "#a97882" },
  { id: "#117b83", label: "Türkiz", hex: "#117b83" },
  { id: "#08723f", label: "Zöld", hex: "#08723f" },
  { id: "#f4f3ef", label: "Fehér", hex: "#f4f3ef" },
  { id: "#e9e3d2", label: "Törtfehér", hex: "#e9e3d2" },
  { id: "#d4a03c", label: "Sárga", hex: "#d4a03c" },
  { id: "#596477", label: "Kékes-szürke", hex: "#596477" },
  { id: "#c8aac8", label: "Levendula", hex: "#c8aac8" },
  { id: "#e5aa82", label: "Barack", hex: "#e5aa82" },
  { id: "#6a351d", label: "Barna", hex: "#6a351d" },
  { id: "#b9d84b", label: "Lime", hex: "#b9d84b" },
  { id: "#c3ddd8", label: "Menta", hex: "#c3ddd8" },
  { id: "#651827", label: "Bordó", hex: "#651827" },
];

const FLEECE_COLORS: ColorOption[] = [
  { id: "#26384b", label: "Sötétkék", hex: "#26384b" },
  { id: "#2a4d47", label: "Sötétzöld", hex: "#2a4d47" },
  { id: "#912645", label: "Bordó", hex: "#912645" },
  { id: "#ef3039", label: "Piros", hex: "#ef3039" },
  { id: "#0752c7", label: "Kék", hex: "#0752c7" },
  { id: "#078c8d", label: "Aqua", hex: "#078c8d" },
  { id: "#1ca8cb", label: "Világoskék", hex: "#1ca8cb" },
  { id: "#8bd20b", label: "Neonsárga", hex: "#8bd20b" },
  { id: "#dc2858", label: "Rózsaszín", hex: "#dc2858" },
  {
    id: "#ff4b00",
    label: "Neon narancssárga",
    hex: "#ff4b00",
  },
  { id: "#f3f5f2", label: "Fehér", hex: "#f3f5f2" },
  { id: "#777777", label: "Szürke", hex: "#777777" },
  { id: "#171717", label: "Fekete", hex: "#171717" },
  { id: "#bd3104", label: "Narancssárga", hex: "#bd3104" },
  { id: "#a957c5", label: "Lila", hex: "#a957c5" },
  { id: "#7e745c", label: "Khaki", hex: "#7e745c" },
  { id: "#772a7e", label: "Sötétlila", hex: "#772a7e" },
];

const YUPPI_MATERIALS = "/images/materials/yuppi";

function yuppiPattern(
  id: string,
  label: string,
  fileName: string,
): ColorOption {
  return {
    id,
    label,
    texture: {
      src: `${YUPPI_MATERIALS}/${fileName}`,
      backgroundSize: "34% auto",
      swatchBackgroundSize: "68% auto",
      backgroundPosition: "center",
      backgroundRepeat: "repeat",
    },
  };
}

const YUPPI_WATERPROOF_PATTERNS: ColorOption[] = [
  yuppiPattern("waterproof-bunny", "Vízálló nyuszis", "seamless-v3/waterproof-bunny.webp"),
  yuppiPattern("waterproof-fox", "Vízálló rókás", "seamless-v3/waterproof-fox.webp"),
  yuppiPattern("waterproof-flowers", "Vízálló apró virágos", "seamless-v3/waterproof-flowers.webp"),
];

const YUPPI_COTTON_PATTERNS: ColorOption[] = [
  yuppiPattern("forest", "Erdő", "seamless-v3/forest.webp"),
  yuppiPattern("pink-flowers", "Rózsaszín virág", "seamless-v3/pink-flowers.webp"),
  yuppiPattern("meadow-flowers", "Mezei virág", "seamless-v3/meadow-flowers.webp"),
  yuppiPattern("dark-dots", "Sötét pötty", "seamless-v3/dark-dots.webp"),
  yuppiPattern("jungle", "Jungle", "seamless-v3/jungle.webp"),
  yuppiPattern("flowers", "Virág", "seamless-v3/flowers.webp"),
  yuppiPattern("birds", "Madárka", "seamless-v3/birds.webp"),
  yuppiPattern("small-flowers", "Apróvirág", "seamless-v3/small-flowers.webp"),
  yuppiPattern("purple-hearts", "Lila szív", "seamless-v3/purple-hearts.webp"),
  yuppiPattern("color-hearts", "Színes szív", "seamless-v3/color-hearts.webp"),
  yuppiPattern("beige-dots", "Bézspöttyös", "seamless-v3/beige-dots.webp"),
  yuppiPattern("green-flowers", "Zöldvirág", "seamless-v3/green-flowers.webp"),
  yuppiPattern("zoo", "Állatkert", "seamless-v3/zoo.webp"),
  yuppiPattern("tulips", "Tulipán", "seamless-v3/tulips.webp"),
];

export function getColorOptions(
  product: Product,
  material: MaterialOption,
): ColorOption[] {
  if (product.id === "yuppi") {
    return material.name === "Vízálló anyag"
      ? YUPPI_WATERPROOF_PATTERNS
      : YUPPI_COTTON_PATTERNS;
  }

  return material.name === "Polár" ? FLEECE_COLORS : COTTON_COLORS;
}

export function getColorOptionsForPart(
  product: Product,
  material: MaterialOption,
  part: ColorPart,
): ColorOption[] {
  return part.palette === "fleece"
    ? FLEECE_COLORS
    : getColorOptions(product, material);
}

const PLACEHOLDER_IMAGE = "/images/placeholder.png";

const BASE_PRODUCTS: Product[] = [
  {
    id: "summer-fox-hoodie",
    name: "Summer Fox Hoodie",
    subtitle: "Hosszú szoknyás alsó rész",
    description: "Hosszú, szoknyás alsó résszel és zsebbel.",
    image: "/images/products/SummerFox.png",
    sampleImage: "/images/samples/SummerFoxSample.webp",
    model: {
      src: "/models/SummerFoxHoodie.glb",
      colorBindings: [
        { partId: "front", matches: ["front"] },
        { partId: "back-skirt", matches: ["back-skirt"] },
        { partId: "back-top", matches: ["back-top"] },
        { partId: "hood-outer", matches: ["hood-outer"] },
        { partId: "hood-inner", matches: ["hood-inner"] },
        { partId: "sleeve", matches: ["sleeve"] },
        { partId: "cuff", matches: ["cuff"] },
      ],
    },
    masks: {
      body: "/images/masks/SummerFox/body-mask.png",
    },
    colorParts: [
      {
        id: "front",
        label: "Elülső rész",
        mask: "/images/masks/SummerFox/front-mask.png",
        defaultColor: "#ffffff",
      },
      {
        id: "back-skirt",
        label: "Hátul alsó nagy szoknyás rész",
        mask: "/images/masks/SummerFox/back-skirt-mask.png",
        defaultColor: "#ff6b00",
      },
      {
        id: "back-top",
        label: "Hátul felső rész",
        mask: "/images/masks/SummerFox/back-top-mask.png",
        defaultColor: "#ffffff",
      },
      {
        id: "hood-outer",
        label: "Kapucni kívül",
        mask: "/images/masks/SummerFox/hood-outer-mask.webp",
        defaultColor: "#ffffff",
      },
      {
        id: "hood-inner",
        label: "Kapucni belül",
        mask: "/images/masks/SummerFox/hood-inner-mask.png",
        defaultColor: "#ff6b00",
      },
      {
        id: "sleeve",
        label: "Ujj",
        mask: "/images/masks/SummerFox/sleeve-mask.png",
        defaultColor: "#ff6b00",
      },
      {
        id: "cuff",
        label: "Ujjvég",
        mask: "/images/masks/SummerFox/cuff-mask.png",
        defaultColor: "#ffffff",
      },
    ],
    materialOptions: [
      { name: "Polár", price: 215, currency: "ron" },
      { name: "Pamut", price: 270, currency: "ron" },
    ],
    prices: ["Polár: 215 ron", "Pamut: 270 ron"],
    materials: ["Polár", "Pamut"],
    measurements: {
      bust: {
        required: true,
        help: "Add meg a mellbőséget centiméterben.",
      },
      height: {
        help: "Csak akkor szükséges, ha 160 cm-nél alacsonyabb vagy 170 cm-nél magasabb vagy.",
      },
    },
  },
  {
    id: "pretty-hoodie",
    name: "Pretty Hoodie",
    subtitle: "Karcsúsított modell",
    description:
      "Karcsúsított, testhezálló modell, hátul U alakban szabott szoknyás résszel és zsebbel.",
    image: "/images/products/PrettyHoodie.jpg",
    sampleImage: "/images/samples/PrettyHoodie.png?v=20260921",
    model: {
      src: "/models/PrettyHoodie.glb?v=20260919",
      colorBindings: [
        { partId: "front", matches: ["front"] },
        { partId: "back-skirt", matches: ["back-skirt"] },
        { partId: "back-top", matches: ["back-top"] },
        { partId: "hood-outer", matches: ["hood-outer"] },
        { partId: "hood-inner", matches: ["hood-inner"] },
        { partId: "sleeve", matches: ["sleeve"] },
        { partId: "cuff", matches: ["cuff"] },
      ],
    },
    masks: {
      body: "/images/masks/PrettyHoodie/front-mask.png",
      sleeves: "/images/masks/PrettyHoodie/sleeve-mask.png",
    },
    colorParts: [
      {
        id: "front",
        label: "Elülső rész",
        mask: "/images/masks/PrettyHoodie/front-mask.png",
        defaultColor: "#ffffff",
      },
      {
        id: "back-skirt",
        label: "Hátul alsó nagy szoknyás rész",
        mask: "/images/masks/PrettyHoodie/back-skirt-mask.png",
        defaultColor: "#ff6b00",
      },
      {
        id: "back-top",
        label: "Hátul felső rész",
        mask: "/images/masks/PrettyHoodie/back-top-mask.png",
        defaultColor: "#ffffff",
      },
      {
        id: "hood-outer",
        label: "Kapucni kívül",
        mask: "/images/masks/PrettyHoodie/hood-outer-mask.png",
        defaultColor: "#ffffff",
      },
      {
        id: "hood-inner",
        label: "Kapucni belül",
        mask: "/images/masks/PrettyHoodie/hood-inner-mask.png",
        defaultColor: "#ff6b00",
      },
      {
        id: "sleeve",
        label: "Ujj",
        mask: "/images/masks/PrettyHoodie/sleeve-mask.png",
        defaultColor: "#ff6b00",
      },
      {
        id: "cuff",
        label: "Ujjvég",
        mask: "/images/masks/PrettyHoodie/cuff-mask.png",
        defaultColor: "#ffffff",
      },
    ],
    materialOptions: [
      { name: "Polár", price: 210, currency: "ron" },
      { name: "Pamut", price: 260, currency: "ron" },
    ],
    prices: ["Polár: 210 ron", "Pamut: 260 ron"],
    materials: ["Polár", "Pamut"],
    measurements: {
      bust: {
        required: true,
        help: "Add meg a mellbőséget centiméterben.",
      },
      height: {
        help: "Csak akkor szükséges, ha 160 cm-nél alacsonyabb vagy 170 cm-nél magasabb vagy.",
      },
    },
  },
  {
    id: "fox-hoodie",
    name: "Fox Hoodie",
    subtitle: "Unisex hoodie",
    description: "Kényelmes unisex hoodie zsebbel.",
    image: "/images/products/FoxHoodie.png",
    sampleImage: "/images/samples/FoxHoodieSample.webp",
    masks: {
      body: "/images/masks/FoxHoodie/front-back-mask.png",
      sleeves: "/images/masks/FoxHoodie/sleeve-upper-mask.png",
    },
    colorParts: [
      {
        id: "front-back",
        label: "Hátul és elöl",
        mask: "/images/masks/FoxHoodie/front-back-mask.png",
        defaultColor: "#ffffff",
      },
      {
        id: "sleeve-upper",
        label: "Ujjak felső része",
        mask: "/images/masks/FoxHoodie/sleeve-upper-mask.png",
        defaultColor: "#ff6b00",
      },
      {
        id: "sleeve-lower",
        label: "Ujjak alsó része",
        mask: "/images/masks/FoxHoodie/sleeve-lower-mask.png",
        defaultColor: "#ffffff",
      },
      {
        id: "pocket",
        label: "Zseb",
        mask: "/images/masks/FoxHoodie/pocket-mask.png",
        defaultColor: "#ffffff",
      },
      {
        id: "hood-outer",
        label: "Kapucni kívül",
        mask: "/images/masks/FoxHoodie/hood-outer-mask.png",
        defaultColor: "#ff6b00",
      },
      {
        id: "hood-inner",
        label: "Kapucni belül",
        mask: "/images/masks/FoxHoodie/hood-inner-mask.png",
        defaultColor: "#ffffff",
      },
    ],
    materialOptions: [
      { name: "Polár", price: 205, currency: "ron" },
      { name: "Pamut", price: 250, currency: "ron" },
    ],
    prices: ["Polár: 205 ron", "Pamut: 250 ron"],
    materials: ["Polár", "Pamut"],
    sizeOptions: ["S", "M", "L", "XL"],
  },
  {
    id: "minihoodie",
    name: "Minihoodie",
    subtitle: "Derékig érő fazon",
    description: "Derékig érő, gumis ujjvégű, egyszínű hoodie.",
    image: "/images/products/minihoodie-product.jpg",
    sampleImage: "/images/samples/MinihoodieSample.webp",
    masks: {
      body: "/images/masks/Minihoodie/full-mask.png",
    },
    colorParts: [
      {
        id: "garment",
        label: "Teljes hoodie",
        mask: "/images/masks/Minihoodie/full-mask.png",
        defaultColor: "#ffffff",
      },
    ],
    materialOptions: [
      { name: "Polár", price: 130, currency: "ron" },
      { name: "Pamut", price: 155, currency: "ron" },
    ],
    prices: ["Polár: 130 ron", "Pamut: 155 ron"],
    materials: ["Polár", "Pamut"],
    measurements: {
      bust: {
        required: true,
        help: "Add meg a mellbőséget centiméterben.",
      },
    },
  },
  {
    id: "bellyhug",
    name: "Bellyhug",
    subtitle: "Szoptatós / várandós hoodie",
    description:
      "A Fox hoodie pamutból készülő szoptatós, várandós vagy kombinált változata.",
    image: PLACEHOLDER_IMAGE,
    sampleImage: "/images/samples/BellyhugSample.webp",
    masks: {
      body: "/images/masks/Bellyhug/front-back-mask.png",
      sleeves: "/images/masks/Bellyhug/sleeve-upper-mask.png",
    },
    colorParts: [
      {
        id: "front-back",
        label: "Eleje és háta",
        mask: "/images/masks/Bellyhug/front-back-mask.png",
        defaultColor: "#ffffff",
      },
      {
        id: "pocket",
        label: "Zseb",
        mask: "/images/masks/Bellyhug/pocket-mask.png",
        defaultColor: "#ffffff",
      },
      {
        id: "sleeve-upper",
        label: "Ujjak felső része",
        mask: "/images/masks/Bellyhug/sleeve-upper-mask.png",
        defaultColor: "#ff6b00",
      },
      {
        id: "sleeve-lower",
        label: "Ujjak alsó része",
        mask: "/images/masks/Bellyhug/sleeve-lower-mask.png",
        defaultColor: "#ffffff",
      },
      {
        id: "hood-outer",
        label: "Kapucni kívül",
        mask: "/images/masks/Bellyhug/hood-outer-mask.png",
        defaultColor: "#ff6b00",
      },
      {
        id: "hood-inner",
        label: "Kapucni belül",
        mask: "/images/masks/Bellyhug/hood-inner-mask.png",
        defaultColor: "#ffffff",
      },
    ],
    materialOptions: [
      { name: "Pamut", note: "270–330 ron, típustól függően" },
    ],
    prices: ["Szoptatós: 270 ron", "Várandós: 285 ron", "Kombinált: 330 ron"],
    materials: ["Pamut"],
    sizeOptions: ["S", "M", "L"],
    variantOptions: [
      {
        id: "nursing",
        name: "Szoptatós",
        description: "A mellrésznél két függőleges cipzárral.",
        price: 270,
        currency: "ron",
      },
      {
        id: "maternity",
        name: "Várandós",
        description:
          "Oldalanként egy cipzárral, amely a pocak méretéhez igazítható.",
        price: 285,
        currency: "ron",
      },
      {
        id: "combined",
        name: "Szoptatós és várandós",
        description: "A szoptatós és várandós kialakítás kombinációja.",
        price: 330,
        currency: "ron",
      },
    ],
  },
  {
    id: "rokkid",
    name: "Rokkid",
    subtitle: "Gyermekhoodie",
    description: "Polárból vagy pamutból kérhető gyermekhoodie.",
    image: "/images/products/Rokkid.jpg",
    sampleImage: "/images/samples/RokkidSample.webp",
    masks: {
      body: "/images/masks/Rokkid/front-back-mask.png",
      sleeves: "/images/masks/Rokkid/sleeves-mask.png",
    },
    colorParts: [
      {
        id: "front-back",
        label: "Eleje és háta",
        mask: "/images/masks/Rokkid/front-back-mask.png",
        defaultColor: "#ffffff",
      },
      {
        id: "hood-outer",
        label: "Kapucni kívül",
        mask: "/images/masks/Rokkid/hood-outer-mask.png",
        defaultColor: "#ff6b00",
      },
      {
        id: "hood-inner",
        label: "Kapucni belül",
        mask: "/images/masks/Rokkid/hood-inner-mask.png",
        defaultColor: "#ffffff",
      },
      {
        id: "sleeves",
        label: "Ujj",
        mask: "/images/masks/Rokkid/sleeves-mask.png",
        defaultColor: "#ff6b00",
      },
      {
        id: "cuffs-pocket",
        label: "Ujjvég és zseb",
        mask: "/images/masks/Rokkid/cuffs-pocket-mask.png",
        defaultColor: "#ff6b00",
      },
    ],
    materialOptions: [
      { name: "Polár", note: "Ár méret szerint változik" },
      { name: "Pamut", note: "Ár méret szerint változik" },
    ],
    prices: ["Polár: 110–190 ron", "Pamut: 135–215 ron"],
    materials: ["Polár", "Pamut"],
    sizeOptions: [
      "86",
      "92",
      "98",
      "104",
      "110",
      "116",
      "122",
      "128",
      "134",
      "140",
      "146",
      "152",
    ],
    sizePrices: {
      Polár: {
        "86": 110,
        "92": 110,
        "98": 120,
        "104": 120,
        "110": 120,
        "116": 130,
        "122": 140,
        "128": 150,
        "134": 160,
        "140": 170,
        "146": 180,
        "152": 190,
      },
      Pamut: {
        "86": 135,
        "92": 135,
        "98": 145,
        "104": 145,
        "110": 145,
        "116": 155,
        "122": 165,
        "128": 175,
        "134": 185,
        "140": 195,
        "146": 205,
        "152": 215,
      },
    },
  },
  {
    id: "yuppi",
    name: "Yuppi",
    subtitle: "Gyerek pelerin",
    description:
      "Kívül pamut vagy vízálló anyagból, belül minden esetben külön színezhető polár béléssel.",
    image: "/images/products/Yuppi.png",
    cardImage: "/images/products/Yuppi-card.png",
    cardImageFit: "contain",
    sampleImage: "/images/samples/YuppiSample.webp",
    masks: {
      body: "/images/masks/Yuppi/bear-outer-mask.png",
    },
    colorParts: [
      {
        id: "outer",
        label: "Külső anyag",
        mask: "/images/masks/Yuppi/bear-outer-mask.png",
        defaultColor: "forest",
      },
      {
        id: "lining",
        label: "Polár bélés",
        mask: "/images/masks/Yuppi/bear-lining-mask.png",
        defaultColor: "#f3f5f2",
        palette: "fleece",
      },
    ],
    materialOptions: [
      { name: "Pamut", note: "Ár méret szerint változik" },
      { name: "Vízálló anyag", note: "Ár méret szerint változik" },
    ],
    prices: ["Pamut: 135–230 ron", "Vízálló: 155–270 ron"],
    materials: ["Pamut", "Vízálló anyag"],
    sizeOptions: [
      "86–92",
      "98–104",
      "110–116",
      "122–128",
      "134–140",
      "146–152",
    ],
    sizePrices: {
      Pamut: {
        "86–92": 135,
        "98–104": 152,
        "110–116": 174,
        "122–128": 195,
        "134–140": 215,
        "146–152": 230,
      },
      "Vízálló anyag": {
        "86–92": 155,
        "98–104": 172,
        "110–116": 204,
        "122–128": 225,
        "134–140": 255,
        "146–152": 270,
      },
    },
    earOptions: [
      {
        id: "bunny",
        name: "Nyuszifül",
        description: "Hosszú, lelógó nyuszifülekkel.",
        image: "/images/samples/YuppiBunny.png",
        masks: {
          outer: "/images/masks/Yuppi/bunny-outer-mask.png",
          lining: "/images/masks/Yuppi/bunny-lining-mask.png",
        },
      },
      {
        id: "bear",
        name: "Medvefül",
        description: "Kerek, játékos medvefülekkel.",
        image: "/images/samples/YuppiBear.png",
        masks: {
          outer: "/images/masks/Yuppi/bear-outer-mask.png",
          lining: "/images/masks/Yuppi/bear-lining-mask.png",
        },
      },
    ],
  },
];

export const PRODUCTS: Product[] = BASE_PRODUCTS.map((product) => {
  const override = ADMIN_CONTENT.priceOverrides[product.id];
  if (!override) return product;

  const pricedProduct: Product = {
    ...product,
    materialOptions: product.materialOptions.map((material) => {
      const price = override.materials?.[material.name];
      return typeof price === "number" && price > 0
        ? { ...material, price }
        : material;
    }),
    variantOptions: product.variantOptions?.map((variant) => {
      const price = override.variants?.[variant.id];
      return typeof price === "number" && price > 0
        ? { ...variant, price }
        : variant;
    }),
    sizePrices: product.sizePrices
      ? Object.fromEntries(
          Object.entries(product.sizePrices).map(([materialName, prices]) => [
            materialName,
            { ...prices, ...override.sizes?.[materialName] },
          ]),
        )
      : undefined,
  };

  const prices = pricedProduct.variantOptions?.length
    ? pricedProduct.variantOptions.map((variant) => `${variant.name}: ${variant.price} ${variant.currency}`)
    : pricedProduct.sizePrices
      ? Object.entries(pricedProduct.sizePrices).map(([materialName, values]) => {
          const amounts = Object.values(values);
          return `${materialName}: ${Math.min(...amounts)}–${Math.max(...amounts)} ron`;
        })
      : pricedProduct.materialOptions
          .filter((material) => typeof material.price === "number")
          .map((material) => `${material.name}: ${material.price} ${material.currency ?? "ron"}`);

  return { ...pricedProduct, prices: prices.length ? prices : pricedProduct.prices };
});
import { ADMIN_CONTENT } from "./admin-content";
