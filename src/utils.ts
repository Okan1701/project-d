export function getStrValueWithLeadingZero(value: number): string {
    if (value < 10 && value > -10) {
        return "0" + value.toString();
    } else {
        return value.toString()
    }
}

export class PaginatedArray<T> {
    private readonly array: T[];
    private readonly pageSize: number;

    constructor(array: T[], pageSize: number) {
        this.array = array;
        this.pageSize = pageSize;
    }

    public getArray(): T[] {
        return this.array;
    }

    public getPageItems(pageNumber: number): T[] {
        if (pageNumber < 1) throw new Error("pageNumber can not be zero or negative!");

        let startIndex: number = (pageNumber - 1) * this.pageSize;
        let endIndex: number = startIndex + this.pageSize;

        return this.array.slice(startIndex, endIndex)
    }

    public getTotalPages(): number {
        let pageSize: number = Math.round(this.array.length / this.pageSize);

        if (pageSize < 1) pageSize = 1;
        return pageSize

    }

}