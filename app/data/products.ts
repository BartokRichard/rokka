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
};

export type Product = {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  image: string;
  sampleImage: string;
  masks: {
    body: string;
    sleeves?: string;
  };
  colorParts: ColorPart[];
  materialOptions: MaterialOption[];
  prices: string[];
  materials: string[];
};

const PLACEHOLDER_IMAGE = "/images/placeholder.png";

const DEFAULT_COLOR_PARTS: ColorPart[] = [
  {
    id: "body",
    label: "Test",
    mask: "/images/masks/body-mask.png",
    defaultColor: "#ffffff",
  },
  {
    id: "sleeves",
    label: "Ujjak",
    mask: "/images/masks/sleeves-mask.png",
    defaultColor: "#ff6b00",
  },
];

export const PRODUCTS: Product[] = [
  {
    id: "summer-fox-hoodie",
    name: "Summer Fox Hoodie",
    subtitle: "Hosszú szoknyás alsó rész",
    description: "Nőies, hosszított fazon.",
    image: "/images/products/SummerFox.jpg",
    sampleImage: "/images/samples/SummerFoxSample.webp",
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
  },
  {
    id: "pretty-hoodie",
    name: "Pretty Hoodie",
    subtitle: "Karcsúsított modell",
    description: "Testhezállóbb, nőies fazon.",
    image: "/images/products/PrettyHoodie.jpg",
    sampleImage: "/images/samples/PrettyHoodieSample.webp",
    masks: {
      body: "/images/masks/body-mask.png",
      sleeves: "/images/masks/sleeves-mask.png",
    },
    colorParts: DEFAULT_COLOR_PARTS,
    materialOptions: [
      { name: "Polár", price: 210, currency: "ron" },
      { name: "Pamut", price: 260, currency: "ron" },
    ],
    prices: ["Polár: 210 ron", "Pamut: 260 ron"],
    materials: ["Polár", "Pamut"],
  },
  {
    id: "fox-hoodie",
    name: "Fox Hoodie",
    subtitle: "Unisex hoodie",
    description: "Kényelmes unisex modell.",
    image: "/images/products/FoxHoodie.jpg",
    sampleImage: "/images/samples/FoxHoodieSample.webp",
    masks: {
      body: "/images/masks/body-mask.png",
      sleeves: "/images/masks/sleeves-mask.png",
    },
    colorParts: DEFAULT_COLOR_PARTS,
    materialOptions: [
      { name: "Polár", price: 205, currency: "ron" },
      { name: "Pamut", price: 250, currency: "ron" },
    ],
    prices: ["Polár: 205 ron", "Pamut: 250 ron"],
    materials: ["Polár", "Pamut"],
  },
  {
    id: "minihoodie",
    name: "Minihoodie",
    subtitle: "Derékig érő fazon",
    description: "Rövidebb, sportos hoodie.",
    image: "/images/products/Minihoodie.jpg",
    sampleImage: "/images/samples/MinihoodieSample.webp",
    masks: {
      body: "/images/masks/body-mask.png",
      sleeves: "/images/masks/sleeves-mask.png",
    },
    colorParts: DEFAULT_COLOR_PARTS,
    materialOptions: [
      { name: "Polár", price: 130, currency: "ron" },
      { name: "Pamut", price: 155, currency: "ron" },
    ],
    prices: ["Polár: 130 ron", "Pamut: 155 ron"],
    materials: ["Polár", "Pamut"],
  },
  {
    id: "bellyhug",
    name: "Bellyhug",
    subtitle: "Szoptatós / várandós hoodie",
    description: "Kismama és szoptatós modell.",
    image: PLACEHOLDER_IMAGE,
    sampleImage: "/images/samples/BellyhugSample.webp",
    masks: {
      body: "/images/masks/body-mask.png",
      sleeves: "/images/masks/sleeves-mask.png",
    },
    colorParts: DEFAULT_COLOR_PARTS,
    materialOptions: [
      { name: "Szoptatós", price: 270, currency: "ron" },
      { name: "Várandós", price: 285, currency: "ron" },
      { name: "Szoptatós + várandós", price: 330, currency: "ron" },
    ],
    prices: ["Szoptatós: 270 ron", "Várandós: 285 ron", "Kombinált: 330 ron"],
    materials: ["Pamut"],
  },
  {
    id: "rokkid",
    name: "Rokkid",
    subtitle: "Gyermekhoodie",
    description: "Gyerekeknek készült hoodie.",
    image: "/images/products/Rokkid.jpg",
    sampleImage: "/images/samples/RokkidSample.webp",
    masks: {
      body: "/images/masks/body-mask.png",
      sleeves: "/images/masks/sleeves-mask.png",
    },
    colorParts: DEFAULT_COLOR_PARTS,
    materialOptions: [
      { name: "Polár", note: "Ár méret szerint változik" },
      { name: "Pamut", note: "Ár méret szerint változik" },
    ],
    prices: ["Ár méret szerint változik"],
    materials: ["Polár", "Pamut"],
  },
  {
    id: "yuppi",
    name: "Yuppi",
    subtitle: "Gyerek pelerin",
    description: "Nyuszi vagy medve füllel.",
    image: PLACEHOLDER_IMAGE,
    sampleImage: "/images/samples/YuppiSample.webp",
    masks: {
      body: "/images/masks/body-mask.png",
      sleeves: "/images/masks/sleeves-mask.png",
    },
    colorParts: DEFAULT_COLOR_PARTS,
    materialOptions: [
      { name: "Pamut", note: "Ár méret szerint változik" },
      { name: "Polár", note: "Ár méret szerint változik" },
      { name: "Vízálló anyag", note: "Ár méret szerint változik" },
    ],
    prices: ["Ár méret szerint változik"],
    materials: ["Pamut", "Polár", "Vízálló anyag"],
  },
];