export type GeoForwardInput = {
    street: string;
    houseNumber: string;
    zip: string;
    state: string;
    city: string;
};

export type GeoForwardSuccessResponse = {
    results: GeocodeResult[]
    status: string;
};

interface GeocodeResult {
    address_components: {
        long_name: string;
        short_name: string;
        types: string[];
    }[];
    formatted_address: string;
    geometry: {
        location: {
            lat: number;
            lng: number;
        };
        location_type: string;
        viewport: {
            northeast: {
                lat: number;
                lng: number;
            };
            southwest: {
                lat: number;
                lng: number;
            };
        };
    };
    place_id: string;
    plus_code: {
        compound_code: string;
        global_code: string;
    };
    types: string[];
}

export type GeoForwardErrorResponse = {
    error: {
        code: string;
        message: string;
    };
};


// function extractAddressComponents(apiResponse: GeocodeResult) {
//     const addressComponents = apiResponse.address_components;
//
//     const streetObj = addressComponents.find(component =>
//         component.types.includes('route')
//     );
//     const houseNumberObj = addressComponents.find(component =>
//         component.types.includes('street_number')
//     );
//     const cityObj = addressComponents.find(component =>
//         component.types.includes('locality')
//     );
//     const stateObj = addressComponents.find(component =>
//         component.types.includes('administrative_area_level_2')
//     );
//     const zipObj = addressComponents.find(component =>
//         component.types.includes('postal_code')
//     );
//     const countryObj = addressComponents.find(component =>
//         component.types.includes('country')
//     );
//
//     const street = streetObj ? streetObj.long_name : '';
//     const houseNumber = houseNumberObj ? houseNumberObj.long_name : '';
//     const city = cityObj ? cityObj.long_name : '';
//     const state = stateObj ? stateObj.long_name : '';
//     const zip = zipObj ? zipObj.long_name : '';
//     const country = countryObj ? countryObj.long_name : '';
//
//     return {
//         street,
//         houseNumber,
//         city,
//         state,
//         zip,
//         country,
//     };
// }
