const CreditTransaction = require("./../MLmodels/creditTransaction");

function getFestivalFlag(date) {
    const month = date.getMonth() + 1;
    // Indian retail spikes
    return [10,11,12,3].includes(month); // Diwali, wedding, Holi season
}

function getSalaryWeek(date) {
    const day = date.getDate();
    return day <= 7; // 1st week of month
}

exports.recordCreditIssued = async (creditDoc, productData) => {

    const issuedDate = new Date();

    await CreditTransaction.create({
        phoneNumber: creditDoc.phoneNumber,
        BuisnessCode: creditDoc.BuisnessCode,
        OrganisationCode: creditDoc.OrganisationCode,

        creditAmount: creditDoc.totalCost,
        amountPaid: 0,
        remainingAmount: creditDoc.totalCost,

        creditIssuedDate: issuedDate,
        dueDate: new Date(issuedDate.getTime() + (15 * 24 * 60 * 60 * 1000)), // 15 days credit

        paymentStatus: "UNPAID",
        paymentCount: 0,

        issuedDayOfWeek: issuedDate.getDay(),
        issuedMonth: issuedDate.getMonth() + 1,
        festivalPeriod: getFestivalFlag(issuedDate),
        salaryWeek: getSalaryWeek(issuedDate)
    });
};

exports.recordCreditPayment = async (creditDoc, paidAmount) => {

    const transaction = await CreditTransaction.findOne({
        phoneNumber: creditDoc.phoneNumber,
        BuisnessCode: creditDoc.BuisnessCode,
        remainingAmount: { $gt: 0 }
    }).sort({ createdAt: -1 });

    if (!transaction) return;

    transaction.amountPaid += paidAmount;
    transaction.remainingAmount -= paidAmount;
    transaction.paymentCount += 1;
    transaction.lastPaymentUpdate = new Date();

    if (transaction.amountPaid > 0 && !transaction.daysToFirstPayment) {
        transaction.daysToFirstPayment = Math.floor(
            (Date.now() - transaction.creditIssuedDate) / (1000*60*60*24)
        );
    }

    if (transaction.remainingAmount <= 0) {
        transaction.paymentStatus = "PAID";
        transaction.paymentDate = new Date();

        transaction.totalDaysToRepay = Math.floor(
            (transaction.paymentDate - transaction.creditIssuedDate)/(1000*60*60*24)
        );

        transaction.delayDays = Math.max(
            0,
            Math.floor((transaction.paymentDate - transaction.dueDate)/(1000*60*60*24))
        );

        transaction.wasLate = transaction.delayDays > 0;
        transaction.wasDefault = transaction.delayDays > 15; // ML label
    }
    else {
        transaction.paymentStatus = "PARTIAL";
    }

    await transaction.save();
};
