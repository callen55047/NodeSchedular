import {ApiContract} from "../../contracts/ApiContract";
import APIClass from "./APIClass";

export default class StripeAPI extends APIClass {
    async createExpressOnboardingAccount(): Promise<ApiContract.Response.StripeAccountOnboarding | null> {
        return this.controller
            .dataTask<ApiContract.Response.StripeAccountOnboarding>(
                'stripe/express/create',
                "post"
            )
    }

    async accountVerify(): Promise<ApiContract.Response.StripeAccountVerify | null> {
        return await this.controller
          .dataTask<ApiContract.Response.StripeAccountVerify>(
            'stripe/verify',
            "get"
          )
    }
}