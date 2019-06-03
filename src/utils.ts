/**
 * Turn a number into a string with a leading zero
 * The sports API breaks if the numbers don't have a leading zero so this is a quick workaround...
 * @param value: the number that we wish to convert (only tested positive integers...)
 */
export function getStrValueWithLeadingZero(value: number): string {
    if (value < 10 && value > -10) {
        return "0" + value.toString();
    } else {
        return value.toString()
    }
}

/**
 * This class allows you to paginate an array and get data from it as pages.
 * The generic type 'T' specifies the type of the array
 */
export class PaginatedArray<T> {
    // The internal array that will be paginated
    private readonly array: T[];
    // Max size of each page
    private readonly pageSize: number;

    /**
     * When creating an instance, the following paramaters are required:
     * @param array: the array that you wish to split in pages
     * @param pageSize: max pagesize of each page
     */
    constructor(array: T[], pageSize: number) {
        this.array = array;
        this.pageSize = pageSize;
    }

    /**
     * Return the full array that you supplied in the constructor
     */
    public getArray(): T[] {
        return this.array;
    }

    /**
     * Get the contents of a specific page
     * @param pageNumber: the specific page that you want the content of
     */
    public getPageItems(pageNumber: number): T[] {
        if (pageNumber < 1) throw new Error("pageNumber can not be zero or negative!");

        let startIndex: number = (pageNumber - 1) * this.pageSize;
        let endIndex: number = startIndex + this.pageSize;

        return this.array.slice(startIndex, endIndex)
    }

    /**
     * Return the total amount of pages
     */
    public getTotalPages(): number {
        let pageSize: number = Math.round(this.array.length / this.pageSize);

        if (pageSize < 1) pageSize = 1;
        return pageSize

    }

}