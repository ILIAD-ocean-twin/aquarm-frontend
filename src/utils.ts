export const fetchLiceData = async ([locs, year, week]: [number[], number, number]) =>
    fetch(`/lice?localities=${locs.join(",")}&from_year=${year - 1}&from_week=${week}&to_year=${year}&to_week=${week}`)
        .then(resp => resp.json())
        .then(data => {
            for (let d in data) {
                data[d].sort(compareYearWeek);
                data[d].avgAdultFemaleLice = data[d].avgAdultFemaleLice ?? 0;
            }
            return data;
        });

function compareYearWeek(a: { year: number, week: number }, b: { year: number, week: number }) {
    if (a.year != b.year)
        return a.year - b.year;
    else
        return a.week - b.week;
}