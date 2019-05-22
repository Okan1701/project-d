export function getStrValueWithLeadingZero(value: number): string {
    if (value < 10 && value > -10) {
        return "0" + value.toString();
    } else {
        return value.toString()
    }
}