const Tenant = require('../Schemas/Tenant');
const User = require('../Schemas/User');
const TenantDocument = require('../Schemas/TenantDocument');
const Bills = require('../Bills');
const insert = async (req, res) => {
  try {
    const {
      billDate,
      dayCounter,
      nightCounter,
      dayTariff,
      nightTariff,
      tenantId,
    } = req.body;
    const owner = req.payload.id;
    const { isInitialValuesSet } = await User.findById(owner, {
      isInitialValuesSet: 1,
      _id: 0,
    });
    if (!isInitialValuesSet) {
      return res.status(200).json({
        error: {
          msg: 'Перед созданием счета необходимо внести предварительные данные',
        },
      });
    }

    const {
      documents,
      initialDayValue,
      initialNightValue,
    } = await Tenant.findById(tenantId, {
      _id: 0,
      documents: 1,
      initialDayValue: 1,
      initialNightValue: 1,
    });
    let lastBill;

    if (documents.length === 0) {
      lastBill = {
        dayCounter: initialDayValue,
        nightCounter: initialNightValue,
      };
    } else {
      lastBill = await TenantDocument.findById(documents[documents.length - 1]);
    }
    if (lastBill.billDate > new Date(billDate)) {
      return res
        .status(200)
        .json({ error: { msg: 'Нельзя создать старый счет' } });
    }

    const {
      name,
      contract,
      houseNumber,
      postIndex,
      address,
    } = await Tenant.findById(tenantId, {
      name: 1,
      contract: 1,
      houseNumber: 1,
      postIndex: 1,
      address: 1,
    });

    const dayCounterDelta = dayCounter - lastBill.dayCounter;
    const nightCounterDelta = nightCounter - lastBill.nightCounter;
    //3% consumer loss
    const dayCounterWithConsumerLoss = dayCounterDelta + dayCounterDelta * 0.03;
    const nightCounterWithConsumerLoss =
      nightCounterDelta + nightCounterDelta * 0.03;
    //3% HighVoltage loss
    const dayCounterWithHighVoltageLoss =
      dayCounterDelta + dayCounterWithConsumerLoss * 0.03;
    const nightCounterWithHighVoltageLoss =
      nightCounterDelta + nightCounterWithConsumerLoss * 0.03;

    //total Price
    const totalDayPrice = dayCounterWithHighVoltageLoss * dayTariff;
    const totalNightPrice = nightCounterWithHighVoltageLoss * nightTariff;
    const totalPrice = totalDayPrice + totalNightPrice;

    //comission 1%
    let comission = totalPrice * 0.01;
    comission = comission.toFixed(2);
    let totalPriceWithComission = Number(totalPrice) + Number(comission);
    totalPriceWithComission = totalPriceWithComission.toFixed(2);

    const file = Bills.createBill(
      billDate,
      name,
      contract,
      dayCounter,
      nightCounter,
      dayTariff,
      nightTariff,
      houseNumber,
      postIndex,
      address,
      dayCounterWithHighVoltageLoss,
      nightCounterWithHighVoltageLoss,
      totalDayPrice,
      totalNightPrice,
      totalPrice,
      comission,
      totalPriceWithComission
    );
    const tenantDocument = await new TenantDocument({
      tenant: tenantId,
      billDate,
      dayCounter,
      nightCounter,
      dayTariff,
      nightTariff,
      file,
      comission,
      totalPriceWithComission,
    }).save();
    await Tenant.findOneAndUpdate(
      { houseNumber: houseNumber },
      {
        $push: { documents: tenantDocument },
        lastDayValue: dayCounter,
        lastNightValue: nightCounter,
      }
    );
    return res.status(200).json(tenantDocument);
  } catch (e) {
    console.log(e);
    return res.sendStatus(403);
  }
};

const update = async (req, res) => {
  try {
    const { billId: _id } = req.params;
    const { tenantId } = req.query;
    const { ...fields } = req.body;
    const owner = req.payload.id;
    const { documents } = await Tenant.findById(tenantId, {
      _id: 0,
      documents: 1,
    });
    const lastDocument = documents[documents.length - 1];
    //not strong comparison since lastDocument is mongodb id which is "Object"
    const isLastDocument = _id == lastDocument;

    if (isLastDocument) {
      // we are doing double update here
      // since we need update fields first, then create file on updated fields
      // and then we need updated file link in db
      const {
        billDate,
        dayCounter,
        nightCounter,
        dayTariff,
        nightTariff,
      } = await TenantDocument.findOneAndUpdate(
        { _id },
        { ...fields },
        { new: true }
      );

      const {
        name,
        contract,
        houseNumber,
        postIndex,
        address,
        documents,
        initialDayValue,
        initialNightValue,
      } = await Tenant.findById(tenantId, {
        name: 1,
        contract: 1,
        houseNumber: 1,
        postIndex: 1,
        address: 1,
        documents: 1,
        initialDayValue: 1,
        initialNightValue: 1,
      });

      let lastValues = {
        dayCounter: initialDayValue,
        nightCounter: initialNightValue,
      };

      if (documents.length >= 2) {
        lastValues = await TenantDocument.findById(
          documents[documents.length - 2],
          { dayCounter: 1, nightCounter: 1, _id: 0 }
        );
      }

      const dayCounterDelta = dayCounter - lastValues.dayCounter;
      const nightCounterDelta = nightCounter - lastValues.nightCounter;
      //3% consumer loss

      const dayCounterWithConsumerLoss =
        dayCounterDelta + dayCounterDelta * 0.03;
      const nightCounterWithConsumerLoss =
        nightCounterDelta + nightCounterDelta * 0.03;

      //3% HighVoltage loss
      const dayCounterWithHighVoltageLoss =
        dayCounterDelta + dayCounterWithConsumerLoss * 0.03;
      const nightCounterWithHighVoltageLoss =
        nightCounterDelta + nightCounterWithConsumerLoss * 0.03;

      //total Price
      const totalDayPrice = dayCounterWithHighVoltageLoss * dayTariff;
      const totalNightPrice = nightCounterWithHighVoltageLoss * nightTariff;
      const totalPrice = totalDayPrice + totalNightPrice;

      //comission 1%
      let comission = totalPrice * 0.01;

      comission = comission.toFixed(2);
      let totalPriceWithComission = Number(totalPrice) + Number(comission);
      totalPriceWithComission = totalPriceWithComission.toFixed(2);

      const file = Bills.createBill(
        billDate,
        name,
        contract,
        dayCounter,
        nightCounter,
        dayTariff,
        nightTariff,
        houseNumber,
        postIndex,
        address,
        dayCounterWithHighVoltageLoss,
        nightCounterWithHighVoltageLoss,
        totalDayPrice,
        totalNightPrice,
        totalPrice,
        comission,
        totalPriceWithComission
      );
      await Tenant.findOneAndUpdate(
        { _id: tenantId },
        { lastDayValue: dayCounter, lastNightValue: nightCounter }
      );
      const updatedDocument = await TenantDocument.findOneAndUpdate(
        { _id },
        { file, comission, totalPriceWithComission },
        { new: true }
      );
      // return res.status(204);
      return res.status(200).json(updatedDocument);
    }
    return res.status(200).json({
      error: {
        msg: 'Можно обновлять только последний созданный документ',
      },
    });
  } catch (e) {
    console.log(e);
    return res.sendStatus(403);
  }
};

const remove = async (req, res) => {
  try {
    const { billId } = req.params;
    const { tenantId } = req.query;
    const { documents } = await Tenant.findById(tenantId, {
      _id: 0,
      documents: 1,
    });
    const LastDocumentByDate = documents[documents.length - 1];
    //not strong comparison since lastDocument is mongodb id which is "Object"
    const isLastDocumentByDate = billId == LastDocumentByDate;

    // we are doing double update here
    // since we need update fields first, then create file on updated fields
    // and then we need updated file link in db
    if (isLastDocumentByDate) {
      await TenantDocument.findByIdAndDelete(billId);
      const previousDocument = await TenantDocument.findOne(
        { tenant: tenantId },
        { dayCounter: 1, nightCounter: 1, _id: 0 }
      ).sort({ billDate: -1 });

      if (!previousDocument) {
        await Tenant.findOneAndUpdate(
          { _id: tenantId },
          { $pull: { documents: billId }, lastDayValue: 0, lastNightValue: 0 }
        );
      } else {
        await Tenant.findOneAndUpdate(
          { _id: tenantId },
          {
            $pull: { documents: billId },
            lastDayValue: previousDocument.dayCounter,
            lastNightValue: previousDocument.nightCounter,
          }
        );
      }
      return res.sendStatus(204);
    }
    return res
      .sendStatus(200)
      .json({ error: { msg: 'Удалить можно только последний документ' } });
  } catch (e) {
    console.log(e);
    return res.sendStatus(403);
  }
};

const select = async (req, res) => {
  try {
    const owner = req.payload.id;
    return res
      .status(200)
      .json(await Tenant.find({ owner }).sort({ houseNumber: 1 }));
  } catch (e) {
    return res.sendStatus(403);
  }
};

const insertAll = async (req, res) => {
  try {
    const owner = req.payload.id;
    const { billDate, dayTariff, nightTariff, houses } = req.body;

    const { lastBillDate } = await User.findOne({ _id: owner });
    if (new Date(billDate) <= new Date(lastBillDate)) {
      return res.status(200).json({
        error: { msg: 'Нельзя создавать счета раньше последнего счета' },
      });
    }

    //we have to validate data before create bills
    //since mongodb doesn't have transactions i decided
    //to check every house before starting to create every bill
    let errors = await houses.reduce(async (acc, data) => {
      const { lastDayValue, lastNightValue } = await Tenant.findOne({
        houseNumber: data.houseNumber,
        owner,
      });
      const dayCounter = parseInt(data.day);
      const nightCounter = parseInt(data.night);
      let error = {
        houseNumber: data.houseNumber,
      };
      if (dayCounter < lastDayValue || !dayCounter) {
        error['day'] = true;
      }
      if (nightCounter < lastNightValue || !nightCounter) {
        error['night'] = true;
      }
      if (error.hasOwnProperty('day') || error.hasOwnProperty('night')) {
        acc = [...(await acc), error];
      }
      return acc;
    }, []);

    if (errors.length) {
      return res.status(200).json({
        error: {
          msg: 'Проверьте введенные показания. Они должны быть больше прошлых',
          errors,
        },
      });
    }
    houses.forEach(async data => {
      const tenant = await Tenant.findOne({
        houseNumber: data.houseNumber,
        owner,
      });
      const dayCounter = parseInt(data.day);
      const nightCounter = parseInt(data.night);

      const lastValues = await Tenant.findOne(
        { owner, houseNumber: data.houseNumber },
        { _id: 0, lastDayValue: 1, lastNightValue: 1, houseNumber: 1 }
      ).sort({ houseNumber: 1 });
      const dayCounterDelta = dayCounter - lastValues.lastDayValue;
      const nightCounterDelta = nightCounter - lastValues.lastNightValue;
      //3% consumer loss
      const dayCounterWithConsumerLoss =
        dayCounterDelta + dayCounterDelta * 0.03;
      const nightCounterWithConsumerLoss =
        nightCounterDelta + nightCounterDelta * 0.03;
      //3% HighVoltage loss
      const dayCounterWithHighVoltageLoss =
        dayCounterDelta + dayCounterWithConsumerLoss * 0.03;
      const nightCounterWithHighVoltageLoss =
        nightCounterDelta + nightCounterWithConsumerLoss * 0.03;

      //total Price
      const totalDayPrice = dayCounterWithHighVoltageLoss * dayTariff;
      const totalNightPrice = nightCounterWithHighVoltageLoss * nightTariff;
      const totalPrice = totalDayPrice + totalNightPrice;

      //comission 1%
      let comission = totalPrice * 0.01;
      comission = comission.toFixed(2);
      let totalPriceWithComission = Number(totalPrice) + Number(comission);
      totalPriceWithComission = totalPriceWithComission.toFixed(2);
      const fileName = Bills.createBill(
        billDate,
        tenant.name,
        tenant.contract,
        dayCounter,
        nightCounter,
        dayTariff,
        nightTariff,
        data.houseNumber,
        tenant.postIndex,
        tenant.address,
        dayCounterWithHighVoltageLoss,
        nightCounterWithHighVoltageLoss,
        totalDayPrice,
        totalNightPrice,
        totalPrice,
        comission,
        totalPriceWithComission
      );

      const tenantLastBillDate = await TenantDocument.findOne({
        tenant: tenant._id,
      }).sort({
        billDate: -1,
      });

      //we need lastDate to be null if there is no tenantBills
      const { billDate: lastDate } = tenantLastBillDate
        ? tenantLastBillDate
        : { billDate: null };
      const dateBillDate = new Date(billDate);

      const oldDocumnet = await TenantDocument.findOne({ file: fileName });
      const document = {
        tenant: tenant._id,
        billDate,
        dayCounter,
        nightCounter,
        dayTariff,
        nightTariff,
        file: fileName,
        totalPriceWithComission,
        comission,
      };
      if (oldDocumnet !== null) {
        const tenantDocument = await TenantDocument.findByIdAndUpdate(
          oldDocumnet._id,
          document
        );
        await Tenant.findOneAndUpdate(
          { houseNumber: data.houseNumber },
          {
            $push: { documents: tenantDocument },
          }
        );
      } else {
        const tenantDocument = await new TenantDocument(document).save();
        await Tenant.findOneAndUpdate(
          { houseNumber: data.houseNumber },
          { $push: { documents: tenantDocument } },
          { new: true }
        );
      }
      if (lastDate <= dateBillDate || lastDate == null) {
        await Tenant.findOneAndUpdate(
          { houseNumber: data.houseNumber },
          {
            lastDayValue: dayCounter,
            lastNightValue: nightCounter,
          }
        );
      }
    });
    await User.findOneAndUpdate({ _id: owner }, { lastBillDate: billDate });
    return res.sendStatus(200);
  } catch (e) {
    console.error(e);
    return res.sendStatus(403);
  }
};

const setInitialValues = async (req, res) => {
  try {
    const owner = req.payload.id;
    const { tenants } = req.body;
    //have to use promise all to wait for all updates
    Promise.all(
      tenants.map(async tenant => {
        const { houseNumber, lastDayValue, lastNightValue } = tenant;
        if (lastDayValue && lastNightValue) {
          return Tenant.findOneAndUpdate(
            { owner, houseNumber },
            {
              lastDayValue,
              lastNightValue,
              initialDayValue: lastDayValue,
              initialNightValue: lastNightValue,
            }
          );
        }
        if (lastDayValue) {
          return Tenant.findOneAndUpdate(
            { owner, houseNumber },
            { lastDayValue, initialDayValue: lastDayValue }
          );
        }
        if (lastNightValue) {
          return Tenant.findOneAndUpdate(
            { owner, houseNumber },
            { lastNightValue, initialNightValue: lastNightValue }
          );
        }
        return null;
      })
    ).then(async () =>
      res.status(200).json(
        await Tenant.find({ owner })
          .select({
            houseNumber: 1,
            _id: 0,
            lastDayValue: 1,
            lastNightValue: 1,
          })
          .sort({ houseNumber: 1 })
      )
    );
    await User.findOneAndUpdate({ _id: owner }, { isInitialValuesSet: true });
  } catch (e) {
    console.log(e);
    res.sendStatus(403);
  }
};

const getLast = async (req, res) => {
  try {
    const owner = req.payload.id;
    const lastDocuments = await Tenant.find(
      { owner },
      { _id: 0, lastDayValue: 1, lastNightValue: 1, houseNumber: 1 }
    ).sort({ houseNumber: 1 });
    return res.status(200).json(lastDocuments);
  } catch (e) {
    console.log(e);
    res.sendStatus(403);
  }
};

const getLastBillDate = async (req, res) => {
  try {
    const owner = req.payload.id;
    const { lastBillDate } = await User.findOne({ _id: owner });
    return res.status(200).json({ lastBillDate });
  } catch (e) {
    console.log(e);
    res.sendStatus(403);
  }
};

// NOT MULTI USER
const removeLastBills = async (req, res) => {
  try {
    const owner = req.payload.id;
    //billDate to remove
    const { lastBillDate: billDate } = await User.findById(owner);
    //finding documents to pull from tenant array
    const documentsForRemove = await TenantDocument.find(
      { billDate },
      { _id: 1, tenant: 1 }
    );
    //using waiter to await every db req
    const removalWaiter = await documentsForRemove.map(async document => {
      return await Tenant.findOneAndUpdate(
        { owner, _id: document.tenant },
        { $pull: { documents: document._id } }
      );
    });
    //removing from tenant documents
    const removed = await TenantDocument.deleteMany({ billDate });
    //looking for previous document
    const previousDocument = await TenantDocument.findOne().sort({
      billDate: -1,
    });

    if (previousDocument) {
      await User.findOneAndUpdate(
        { _id: owner },
        { lastBillDate: previousDocument.billDate }
      );
    } else {
      await User.findOneAndUpdate({ _id: owner }, { lastBillDate: null });
    }

    const tenantsForUpdate = await Tenant.find(
      { owner },
      { documents: 1, initialDayValue: 1, initialNightValue: 1 }
    );
    
    //we need to wait for every update, so we use Promise all
    return Promise.all(
      tenantsForUpdate.map(async tenant => {
        const newValues = await TenantDocument.findOne(
          { tenant: tenant._id },
          {
            billDate: 1,
            _id: 0,
            dayCounter: 1,
            nightCounter: 1,
          }
        ).sort({ billDate: -1 });
        if (newValues) {
          const updatedTenant = await Tenant.findOneAndUpdate(
            { _id: tenant._id },
            {
              lastDayValue: newValues.dayCounter,
              lastNightValue: newValues.nightCounter,
            }
          );
        } else {
          
          const updatedTenant = await Tenant.findOneAndUpdate(
            { _id: tenant._id },
            {
              lastDayValue: tenant.initialDayValue,
              lastNightValue: tenant.initialNightValue,
            }
          );
        }
      })
    ).then(async () => {
      return res.status(200).json({
        lastBillDate: previousDocument ? previousDocument.billDate : null,
        houses: [
          ...(await Tenant.find(
            { owner },
            {
              houseNumber: 1,
              _id: 0,
              lastDayValue: 1,
              lastNightValue: 1,
            }
          ).sort({ houseNumber: 1 })),
        ],
      });
    });
  } catch (e) {
    console.log(e);
    res.sendStatus(403);
  }
};

module.exports = {
  insert,
  update,
  remove,
  select,
  insertAll,
  setInitialValues,
  getLast,
  getLastBillDate,
  removeLastBills,
};
