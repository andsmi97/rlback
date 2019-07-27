const { Schema, model } = require('mongoose');

const tenantDocument = new Schema(
  {
    tenant: { type: Schema.Types.ObjectId, ref: 'Tenant' },
    billDate: Date,
    file: String,
    dayCounter: Number,
    nightCounter: Number,
    dayTariff: Number,
    nightTariff: Number,
    totalPriceWithComission: Number,
    comission: Number,
  },
  { timestamps: true }
);
module.exports = model('TenantDocument', tenantDocument);
