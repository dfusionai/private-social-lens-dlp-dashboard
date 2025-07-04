export const generateDailyChartData = (from: number, to: number) => {
    const week = [];
    const now = new Date();

    for (let i = to; i >= from; i--) {
        const date = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate() - i
        );
        week.push({ date, amount: 0 });
    }

    return week;
};  