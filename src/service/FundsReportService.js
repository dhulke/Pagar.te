const { PayableStatus } = require("../entity/Payable");


class FundsReportService {

    constructor(transactions) {
        this.transactions = transactions;
    }

    generateFundsReport() {
        const reportDto = {
            available: 0,
            waiting_funds: 0
        };

        for(const transaction of this.transactions) {
            const payables = transaction.getPayables();
            reportDto.available += this.getTotalPerStatus(PayableStatus.PAID, payables);
            reportDto.waiting_funds += this.getTotalPerStatus(PayableStatus.WAITING_FUNDS, payables);
        }
        return reportDto;
    }

    getTotalPerStatus(status, payables) {
        const isGivenStatus = payable => payable.getStatus() === status;
        const getValue = payable => payable.getValue();
        const sum = (previous, current) => previous + current;

        return payables.filter(isGivenStatus).map(getValue).reduce(sum, 0)
    }
}

module.exports = { FundsReportService };
