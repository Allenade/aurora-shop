export type QuoteDraft = {
  id: string;
  savedAt: string;
  companyName: string;
  contact: string;
  components: string;
};

export const QUOTE_DRAFTS: QuoteDraft[] = [
  {
    id: "DRF-1704183269505",
    savedAt: "2024-03-12 10:30 AM",
    companyName: "Emeka Darlington",
    contact: "Shuaib Abibim",
    components: "Motor, DC3V",
  },
  {
    id: "DRF-1754153245555",
    savedAt: "2024-03-11 10:15 AM",
    companyName: "Emeka Darlington",
    contact: "Shuaib Abibim",
    components: "Motor, DC3V",
  },
  {
    id: "DRF-1699021188441",
    savedAt: "2024-03-08 04:42 PM",
    companyName: "Aurora Labs Ltd",
    contact: "Ada Okonkwo",
    components: "Arduino Uno, DHT22",
  },
];
