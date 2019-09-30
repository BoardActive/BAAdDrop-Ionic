export interface MessagesDto {
    id:              number;
    name:            string;
    guid:            string;
    status:          string;
    dateCreated:     Date;
    dateLastUpdated: Date;
    dateTrashed:     null;
    isTrashed:       boolean;
    createdBy:       CreatedBy;
    lastUpdatedBy:   AtedBy;
    places:          Place[];
    notification:    Notification;
    audiences:       any[];
    schedule:        Schedule;
    goal:            Goal;
    counts:          Counts;
}

export interface Counts {
    messageId: number;
    sent:      number;
    received:  number;
    opened:    number;
    goal:      number;
}

export interface CreatedBy {
    id:               number;
    email:            string;
    firstName:        string;
    lastName:         string;
    avatarUrl:        null;
    dateCreated:      Date;
    dateLastUpdated:  Date;
    dateDeleted:      null;
    dateTrashed:      null;
    isTrashed:        boolean;
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
    hasRequested: boolean;
    intent?:      string;
}

export interface Onboarding {
    initial: number;
}

export interface Goal {
    id:              number;
    guid:            string;
    messageId:       number;
    isSent:          boolean;
    isReceived:      boolean;
    isOpened:        boolean;
    isVisited:       boolean;
    inbox:           OnboardingClass;
    dateCreated:     Date;
    dateLastUpdated: Date;
    dateTrashed:     null;
    isTrashed:       boolean;
    places:          any[];
}

export interface OnboardingClass {
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
    dateTrashed:      null;
    isTrashed:        boolean;
    isClaimed:        boolean;
    isVerified:       boolean;
    isCompliant:      boolean;
    isApprovedByDoug: boolean;
    isRejectedByDoug: boolean;
    inbox:            LastUpdatedByInbox;
}

export interface LastUpdatedByInbox {
    company:    Company;
    onboarding: OnboardingClass;
}

export interface Notification {
    id:              number;
    guid:            string;
    messageId:       number;
    messageData:     string;
    heading:         string;
    subtitle:        null;
    contents:        string;
    imageUrl:        string;
    androidOptions:  null;
    iosOptions:      null;
    inbox:           OnboardingClass;
    ddateCreated:    Date;
    dateLastUpdated: Date;
    dateTrashed:     null;
    isTrashed:       boolean;
    createdBy:       CreatedBy;
    lastUpdatedBy:   AtedBy;
    image:           Image;
}

export interface Image {
    id:              number;
    name:            string;
    mimeType:        string;
    url:             string;
    size:            number;
    guid:            string;
    dateCreated:     Date;
    dateLastUpdated: Date;
    dateTrashed:     null;
    isTrashed:       boolean;
    createdBy:       AtedBy;
    lastUpdatedBy:   AtedBy;
    inbox:           OnboardingClass;
}

export interface Place {
    id:              number;
    guid:            string;
    name:            string;
    radius:          number;
    dateCreated:     Date;
    dateLastUpdated: Date;
    dateTrashed:     null;
    isTrashed:       boolean;
    address:         Address;
    placeType:       PlaceType;
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
    dateTrashed:     null;
    isTrashed:       boolean;
    googlePlaceId:   string;
    googlePlace:     GooglePlace;
    createdBy:       AtedBy;
    lastUpdatedBy:   AtedBy;
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

export interface PlaceType {
    id:                  number;
    guid:                null;
    name:                string;
    color:               number;
    appId:               number;
    createdByUserId:     number;
    lastUpdatedByUserId: number;
    dateCreated:         Date;
    dateLastUpdated:     Date;
    dateDeleted:         null;
    dateTrashed:         null;
    inbox:               null;
}

export interface Schedule {
    id:              number;
    guid:            string;
    messageId:       number;
    dateStart:       Date;
    dateStop:        Date;
    timeStart:       string;
    timeStop:        string;
    isLive:          boolean;
    limitDaily:      number;
    limitTotal:      number;
    inbox:           OnboardingClass;
    dateCreated:     Date;
    dateLastUpdated: Date;
    dateTrashed:     null;
    isTrashed:       boolean;
    createdBy:       CreatedBy;
    lastUpdatedBy:   AtedBy;
}