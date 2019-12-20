export class CustomModel {
    constructor(
        name?: any,
        value?: any
    ) {
        this.name = name;
        this.value = value;
    }

    public name: any;
    public value: any;

    public static empty(): CustomModel {
        const myDate: string = new Date().toISOString();
        return new CustomModel(
            null,
            null
        );
    }
    public toDto(): CustomDto {
        return {
            name: this.name,
            value: this.value
        };
    }
}

export interface CustomDto {
    name: any,
    value: any
}

