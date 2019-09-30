// To parse this data:
//
//   import { Convert, Welcome } from "./file";
//
//   const welcome = Convert.toWelcome(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface PlacesDto {
    id:              number;
    guid:            string;
    name:            string;
    radius:          number;
    dateCreated:     Date;
    dateLastUpdated: Date;
    address:         Address;
    placeType:       PlaceType;
    createdBy:       AtedBy;
    lastUpdatedBy:   AtedBy;
    liveMessages:    PlaceType[];
    counts:          Counts;
}

export interface Address {
    id:              number;
    name:            string;
    streetNumber:    string;
    street:          string;
    city:            string;
    state:           string;
    postCode:        string;
    country:         string;
    countryShort:    string;
    latitude:        string;
    longitude:       string;
    guid:            string;
    dateCreated:     Date;
    dateLastUpdated: Date;
    googlePlaceId:   string;
    googlePlace:     GooglePlace;
    createdBy:       AtedBy;
    lastUpdatedBy:   AtedBy;
}

export interface AtedBy {
    id:               number;
    email:            string;
    firstName:        string;
    lastName:         string;
    avatarUrl:        string;
    dateCreated:      Date;
    dateLastUpdated:  Date;
    dateDeleted:      null;
    isClaimed:        boolean;
    isVerified:       boolean;
    isCompliant:      boolean;
    isApprovedByDoug: boolean;
    isRejectedByDoug: boolean;
    inbox:            Inbox;
}

export interface Inbox {
    company:    Company;
    onboarding: Onboarding;
}

export interface Company {
    url:          string;
    name:         string;
    size:         string;
    intent:       string;
    hasRequested: boolean;
}

export interface Onboarding {
}

export interface GooglePlace {
    address_components:         AddressComponent[];
    adr_address:                string;
    formatted_address:          string;
    formatted_phone_number:     string;
    geometry:                   Geometry;
    icon:                       string;
    id:                         string;
    international_phone_number: string;
    name:                       string;
    opening_hours:              OpeningHours;
    photos:                     Photo[];
    place_id:                   string;
    plus_code:                  PlusCode;
    rating:                     number;
    reference:                  string;
    reviews:                    Review[];
    scope:                      string;
    types:                      string[];
    url:                        string;
    user_ratings_total:         number;
    utc_offset:                 number;
    vicinity:                   string;
    website:                    string;
    html_attributions:          any[];
    utc_offset_minutes:         number;
}

export interface AddressComponent {
    long_name:  string;
    short_name: string;
    types:      string[];
}

export interface Geometry {
    location: Location;
    viewport: Viewport;
}

export interface Location {
    lat: number;
    lng: number;
}

export interface Viewport {
    south: number;
    west:  number;
    north: number;
    east:  number;
}

export interface OpeningHours {
    open_now:     boolean;
    periods:      Period[];
    weekday_text: string[];
}

export interface Period {
    close: Close;
    open:  Close;
}

export interface Close {
    day:      number;
    time:     string;
    hours:    number;
    minutes:  number;
    nextDate: number;
}

export interface Photo {
    height:            number;
    html_attributions: string[];
    width:             number;
}

export interface PlusCode {
    compound_code: string;
    global_code:   string;
}

export interface Review {
    author_name:               string;
    author_url:                string;
    language:                  string;
    profile_photo_url:         string;
    rating:                    number;
    relative_time_description: string;
    text:                      string;
    time:                      number;
}

export interface Counts {
    visited: number;
}

export interface PlaceType {
    id:                  number;
    name:                string;
    statusId?:           number;
    guid:                null | string;
    appId:               number;
    createdByUserId:     number;
    lastUpdatedByUserId: number;
    dateCreated:         Date;
    dateLastUpdated:     Date;
    dateDeleted:         null;
    dateArchived?:       Date | null;
    inbox:               Onboarding | null;
    color?:              number;
}

