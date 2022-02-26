function sortComparison(a, b) {
    if (a.year !== b.year) {
        return a.year - b.year;
    } else {
        return a.month - b.month;
    }
}

export default sortComparison;