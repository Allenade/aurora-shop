export type StockStatus = "in_stock" | "low_stock" | "out_of_stock";

export type ProductSpec = {
  label: string;
  value: string;
};

export type ShopProduct = {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  category: string;
  brand: string;
  subcategory: string;
  price: number;
  priceLabel: string;
  unitLabel: string;
  badge?: "In Stock" | "New" | "Low Stock" | "Out of Stock";
  stockStatus: StockStatus;
  stockCount: number;
  image: string;
  images: string[];
  isNew?: boolean;
  highlights: {
    label: string;
    icon: "verified" | "support" | "returns" | "shipping";
  }[];
  specs: ProductSpec[];
  datasheetNote: string;
  reviewsNote: string;
};

export const SHOP_CATEGORIES = [
  "Microcontrollers",
  "Sensors",
  "Power Supply",
  "Displays",
] as const;

export const SHOP_BRANDS = [
  "Arduino",
  "Raspberry Pi",
  "Adafruit",
  "SparkFun",
] as const;

export const SHOP_STOCK_OPTIONS = [
  { value: "in_stock" as const, label: "In Stock" },
  { value: "low_stock" as const, label: "Low Stock" },
  { value: "out_of_stock" as const, label: "Out of Stock" },
];

export const SHOP_PRICE_MIN = 0;
export const SHOP_PRICE_MAX = 75000;

const sharedDetail = {
  unitLabel: "Per unit",
  highlights: [
    { label: "Verified Inventory", icon: "verified" as const },
    { label: "Technical Support available", icon: "support" as const },
    { label: "30 Days returns", icon: "returns" as const },
    { label: "Ships within 24-72 hours", icon: "shipping" as const },
  ],
  datasheetNote:
    "Datasheet PDF will be available here once documents are wired from the API.",
  reviewsNote:
    "Customer reviews will appear here once the reviews API is connected.",
};

/** Mock catalog — swap for API later. */
export const SHOP_PRODUCTS: ShopProduct[] = [
  {
    id: "prod_uno",
    slug: "arduino-uno-r3",
    name: "Arduino Uno R3",
    subtitle: "ATmega328P, 16MHz, 14 Digital I/O",
    category: "Microcontrollers",
    brand: "Arduino",
    subcategory: "Arduino Uno R3",
    price: 8500,
    priceLabel: "₦8,500",
    badge: "In Stock",
    stockStatus: "in_stock",
    stockCount: 48,
    image: "/images/auth-panel.png",
    images: ["/images/auth-panel.png", "/images/auth-signin-panel.png"],
    isNew: false,
    specs: [
      { label: "Microcontroller", value: "ATmega328P" },
      { label: "Operating Voltage", value: "5V" },
      { label: "Digital I/O Pins", value: "14 (of which 6 provide PWM)" },
      { label: "Analog Input Pins", value: "6" },
      { label: "Flash Memory", value: "32 KB" },
      { label: "SRAM", value: "2 KB" },
    ],
    ...sharedDetail,
  },
  {
    id: "prod_rpi4",
    slug: "raspberry-pi-4-model-b",
    name: "Raspberry Pi 4 Model B",
    subtitle: "8GB RAM, Quad-core ARM Cortex-A72",
    category: "Microcontrollers",
    brand: "Raspberry Pi",
    subcategory: "Single Board Computers",
    price: 45000,
    priceLabel: "₦45,000",
    badge: "New",
    stockStatus: "in_stock",
    stockCount: 23,
    image: "/images/auth-signin-panel.png",
    images: [
      "/images/auth-signin-panel.png",
      "/images/auth-panel.png",
      "/images/auth-signin-panel.png",
    ],
    isNew: true,
    specs: [
      {
        label: "Processor",
        value:
          "Broadcom BCM2711, Quad-core Cortex-A72 (ARM v8) 64-bit @ 1.5GHz",
      },
      { label: "RAM", value: "8GB LPDDR4-3200 SDRAM" },
      { label: "USB Ports", value: "2 × USB 3.0, 2 × USB 2.0" },
      { label: "Clock Speed", value: "1.5 GHz" },
      {
        label: "Storage",
        value: "MicroSD card slot for loading OS and data storage",
      },
      { label: "Display Output", value: "2 × micro-HDMI (up to 4K)" },
    ],
    ...sharedDetail,
  },
  {
    id: "prod_psu",
    slug: "12v-5a-power-supply",
    name: "12V 5A Power Supply",
    subtitle: "Regulated switching PSU for electronics projects",
    category: "Power Supply",
    brand: "Adafruit",
    subcategory: "Power Adapters",
    price: 6200,
    priceLabel: "₦6,200",
    badge: "In Stock",
    stockStatus: "in_stock",
    stockCount: 120,
    image: "/images/auth-panel.png",
    images: ["/images/auth-panel.png"],
    specs: [
      { label: "Output", value: "12V DC 5A" },
      { label: "Input", value: "100–240V AC" },
      { label: "Connector", value: "2.1mm barrel jack" },
    ],
    ...sharedDetail,
  },
  {
    id: "prod_dht",
    slug: "dht22-temp-humidity",
    name: "DHT22 Temp & Humidity",
    subtitle: "Digital temperature and humidity sensor",
    category: "Sensors",
    brand: "Adafruit",
    subcategory: "Environmental",
    price: 4800,
    priceLabel: "₦4,800",
    badge: "Low Stock",
    stockStatus: "low_stock",
    stockCount: 4,
    image: "/images/auth-signin-panel.png",
    images: ["/images/auth-signin-panel.png"],
    specs: [
      { label: "Temperature Range", value: "-40 to 80°C" },
      { label: "Humidity Range", value: "0–100% RH" },
      { label: "Interface", value: "Single-wire digital" },
    ],
    ...sharedDetail,
  },
  {
    id: "prod_oled",
    slug: "oled-128x64-display",
    name: "OLED 128×64 Display",
    subtitle: "0.96 inch I2C monochrome OLED",
    category: "Displays",
    brand: "SparkFun",
    subcategory: "OLED",
    price: 3500,
    priceLabel: "₦3,500",
    badge: "In Stock",
    stockStatus: "in_stock",
    stockCount: 67,
    image: "/images/auth-panel.png",
    images: ["/images/auth-panel.png"],
    specs: [
      { label: "Resolution", value: "128 × 64" },
      { label: "Interface", value: "I2C" },
      { label: "Color", value: "White / Blue" },
    ],
    ...sharedDetail,
  },
  {
    id: "prod_nano",
    slug: "arduino-nano",
    name: "Arduino Nano",
    subtitle: "Compact ATmega328 board",
    category: "Microcontrollers",
    brand: "Arduino",
    subcategory: "Arduino Nano",
    price: 7200,
    priceLabel: "₦7,200",
    badge: "New",
    stockStatus: "in_stock",
    stockCount: 35,
    image: "/images/auth-signin-panel.png",
    images: ["/images/auth-signin-panel.png"],
    isNew: true,
    specs: [
      { label: "Microcontroller", value: "ATmega328" },
      { label: "Operating Voltage", value: "5V" },
      { label: "Digital I/O Pins", value: "14" },
    ],
    ...sharedDetail,
  },
];

export function getProductBySlug(slug: string) {
  return SHOP_PRODUCTS.find((p) => p.slug === slug) ?? null;
}

export function getDefaultProduct() {
  return SHOP_PRODUCTS[0]!;
}

export function formatNaira(amount: number) {
  return `₦${amount.toLocaleString("en-NG")}`;
}
