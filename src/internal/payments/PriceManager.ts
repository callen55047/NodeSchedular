import { ISession } from '../../models/Session.js'
import { ETransactionType } from '../../models/Transaction.js'

interface IPlatformCharge {
  application_fee_amount: number,
  amount: number
}

interface IPlatformChargeDetails {
  app_fee: {
    platform_cut: number,
    taxes: number,
    stripe_fee: number,
    total: number
  },
  amount: number
}

const PlatformPercentage = 0.01

const Taxes = {
  pst: 0.07,
  gst: 0.05
}

const Stripe = {
  feePercentage: 0.029,
  transactionConstant: 0.3,

  calculateFee: (amount: number): number => {
    const transactionAmount = amount + Stripe.transactionConstant
    return (transactionAmount / (1 - Stripe.feePercentage)) - amount
  },

  convertToWholeCents: (amount: number): number => {
    return Math.round(amount * 100)
  }
}

const PriceManager = {

  chargeDetails: (baseAmount: number): IPlatformChargeDetails => {
    const platform_cut = baseAmount * PlatformPercentage
    const taxes = platform_cut * Taxes.pst
    const applicationFee = platform_cut + taxes

    const amount = baseAmount + applicationFee
    const stripe_fee = Stripe.calculateFee(amount)
    const total = amount + stripe_fee

    return {
      app_fee: {
        platform_cut: platform_cut,
        taxes,
        stripe_fee,
        total: platform_cut + taxes + stripe_fee
      },
      amount: total
    }
  },

  depositChargeDetails: (session: ISession): IPlatformChargeDetails => {
    return PriceManager.chargeDetails(session.deposit)
  },

  remainderChargeDetails: (session: ISession): IPlatformChargeDetails => {
    const baseAmount = session.price - session.deposit
    return PriceManager.chargeDetails(baseAmount)
  },

  paymentChargeDetails: (session: ISession): IPlatformChargeDetails => {
    return PriceManager.chargeDetails(session.price)
  },

  priceForTypeInCents: (
    session: ISession,
    type: ETransactionType
  ): IPlatformCharge => {
    let chargeDetails = {} as IPlatformChargeDetails

    switch (type) {
      case ETransactionType.DEPOSIT:
        chargeDetails = PriceManager.depositChargeDetails(session)
        break
      case ETransactionType.REMAINDER:
        chargeDetails = PriceManager.remainderChargeDetails(session)
        break
      case ETransactionType.PAYMENT:
        chargeDetails = PriceManager.paymentChargeDetails(session)
        break
      case ETransactionType.TIP:
        throw 'Unsupported transaction type for price amount'
    }

    return {
      application_fee_amount: Stripe.convertToWholeCents(chargeDetails.app_fee.total),
      amount: Stripe.convertToWholeCents(chargeDetails.amount)
    }
  },

  partialPaymentRefundInCents: (session: ISession): IPlatformCharge => {
    const depositDetails = PriceManager.depositChargeDetails(session)
    const paymentDetails = PriceManager.paymentChargeDetails(session)

    const adjustmentRatio = 1 - (depositDetails.amount / paymentDetails.amount)
    const adjustedAppFee = paymentDetails.app_fee.total * adjustmentRatio
    const adjustedPayment = paymentDetails.amount * adjustmentRatio

    return {
      application_fee_amount: Stripe.convertToWholeCents(adjustedAppFee),
      amount: Stripe.convertToWholeCents(adjustedPayment)
    }
  }

}

export default PriceManager

export {
  IPlatformCharge,
  IPlatformChargeDetails
}