export const SIGNIN_STATS = [
  { value: "100%", label: "Client Satisfaction" },
  { value: "1000+", label: "Components" },
  { value: "5+", label: "Years of Service" },
] as const;

export const AUTH_FEATURES = [
  "Verified Components only",
  "Nationwide Delivery",
  "Dedicated B2B support team",
  "Bulk pricing & Quotation requests",
] as const;

export const SIGNUP_STEPS = [
  { id: 1, label: "Personal info" },
  { id: 2, label: "Business & Security" },
] as const;

export const INDUSTRIES = [
  "Electronics Retail",
  "Electronics Wholesale / Distribution",
  "OEM / Manufacturing",
  "System Integrator",
  "Education / Research Lab",
  "Telecommunications",
  "Oil & Gas",
  "Healthcare",
  "Government",
  "Other",
] as const;

export const NIGERIA_STATES = [
  "Abia",
  "Adamawa",
  "Akwa Ibom",
  "Anambra",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
  "Delta",
  "Ebonyi",
  "Edo",
  "Ekiti",
  "Enugu",
  "FCT - Abuja",
  "Gombe",
  "Imo",
  "Jigawa",
  "Kaduna",
  "Kano",
  "Katsina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Lagos",
  "Nasarawa",
  "Niger",
  "Ogun",
  "Ondo",
  "Osun",
  "Oyo",
  "Plateau",
  "Rivers",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara",
] as const;

export type SignupStep1 = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  countryCode: string;
};

export type SignupStep2 = {
  companyName: string;
  industry: string;
  state: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
};
