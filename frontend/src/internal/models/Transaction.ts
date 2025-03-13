import {ISession} from "./Session";
import { IAccount } from './Account'

enum ETransactionType {
    DEPOSIT = 'deposit',
    REMAINDER = 'remainder',
    PAYMENT = 'payment',
    TIP = 'tip'
}

interface ITransaction {
    _id: string,
    stripe_intent_id: string | null,
    stripe_refund_id: string | null,
    stripe_payment_success: string | null,
    is_cash_payment: boolean,
    sender_id: string,
    receiver_id: string,
    product_id: string | null,
    type: ETransactionType
    created_at: string,
    updated_at: string,
}

export {
    ITransaction,
    ETransactionType
}