import administrationsData from '../data/administrations.json';

export type AdministrationCountry = {
  symbol: string;
  designation: string;
  ituRadioRegion?: string;
};

/** Matches Global View Excel / map filters. */
export const GOVSTACK_REGION_ORDER = [
  'Africa',
  'Americas',
  'Asia-Pacific',
  'CIS',
  'Europe',
] as const;

export type GovstackRegion = (typeof GOVSTACK_REGION_ORDER)[number];

export type AdministrationRegion = {
  code: string;
  countries: AdministrationCountry[];
};

export type AdministrationsCatalog = {
  source: string;
  updatedAt: string;
  regions: AdministrationRegion[];
};

const catalog = administrationsData as AdministrationsCatalog;

export const administrationRegions: AdministrationRegion[] = catalog.regions;

export function getAdministrationRegionCodes(): string[] {
  const codes = new Set(administrationRegions.map(region => region.code));
  return GOVSTACK_REGION_ORDER.filter(code => codes.has(code));
}

export function getCountriesForRegion(regionCode: string): AdministrationCountry[] {
  const region = administrationRegions.find(entry => entry.code === regionCode);
  return region?.countries ?? [];
}

export function isOfficialCountryForRegion(regionCode: string, countryDesignation: string): boolean {
  return getCountriesForRegion(regionCode).some(
    country => country.designation === countryDesignation,
  );
}
