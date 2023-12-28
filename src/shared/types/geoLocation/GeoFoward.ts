export type GeoForwardInput = {
    street: string;
    houseNumber: string;
    zip: string;
    state: string;
    city: string;
};

export type GeoForwardSuccessResponse = {
    data: geoLocation[];
};

export type geoLocation = {
    latitude: number;
    longitude: number;
    type: string;
    name: string;
    number: string | null;
    postal_code: string | null;
    street: string | null;
    confidence: number;
    region: string;
    region_code: string;
    county: string | null;
    locality: string | null;
    administrative_area: string | null;
    neighbourhood: string | null;
    country: string;
    country_code: string;
    continent: string;
    label: string;
};

export type GeoForwardErrorResponse = {
    error: {
        code: string;
        message: string;
    };
};
