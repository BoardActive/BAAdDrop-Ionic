export class PlaceModel {
  constructor(
    id?: string,
    guid?: string,
    dateCreated?: string,
    dateLastUpdated?: string,
    dateArchived?: string,
    name?: string,
    radius?: string,
    visited?: string
  ) {
    this.id = id;
    this.guid = guid;
    this.dateCreated = dateCreated;
    this.dateArchived = dateArchived;
    this.name = name;
    this.radius = radius;
    this.visited = visited;
  }

  public id?: string;
  public guid?: string;
  public dateCreated?: string;
  public dateArchived?: string;
  public name: string;
  public radius: string;
  public visited: string;

  public static fromDto(place: PlaceDto): PlaceModel {
    return new PlaceModel(
      place.id,
      place.guid,
      place.dateCreated,
      place.dateArchived,
      place.name,
      place.radius,
      place.visited
    );
  }

  public static emptyDto(): PlaceDto {
    return {
      id: null,
      guid: null,
      dateCreated: null,
      dateArchived: null,
      name: null,
      radius: null,
      visited: null
    };
  }

  public toDto(): PlaceDto {
    return {
      id: this.id,
      guid: this.guid,
      dateCreated: this.dateCreated,
      dateArchived: this.dateArchived,
      name: this.name,
      radius: this.radius,
      visited: this.visited
    };
  }
}

export interface PlaceDto {
  id?: string;
  guid?: string;
  dateCreated?: string;
  dateArchived?: string;
  name?: string;
  radius?: string;
  visited?: string;
}

export interface CreatedBy {
  id?: string;
  guid: string;
}
