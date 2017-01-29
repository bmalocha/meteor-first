function summaryData(transactions){
    var stats = { in: 0,
      inCount: 0,
      out: 0,
      outCount: 0,
      total: 0,
      totalCount: 0
    }

    transactions.forEach(transaction => {
      if (transaction.value > 0) {
        stats.inCount++;
        stats.in += transaction.value;
      } else {
        stats.outCount++;
        stats.out += transaction.value;
      }
      stats.totalCount++;
      stats.total += transaction.value;
    });
    stats.inAvg = stats.in / stats.inCount;
    stats.outAvg = stats.out / stats.outCount;
    stats.totalAvg = stats.total / stats.totalCount;

    stats.in12m = stats.in / 12;
    stats.inCount12m = Math.ceil(stats.inCount / 12);
    stats.out12m = stats.out / 12;
    stats.outCount12m = Math.ceil(stats.outCount / 12);
    stats.total12m = stats.total / 12;
    stats.totalCount12m = Math.ceil(stats.totalCount / 12);

    return stats;
}

export const SummaryData = summaryData;