import { Base } from "../base";
import { RedeemCodesURL } from "../index";
import _ from "lodash";

export class REDEEM_CODES extends Base {
  constructor(apiKey: string, baseUrl: RedeemCodesURL) {
    super(apiKey, 'redeem_codes', false);

    switch (baseUrl) {
      case RedeemCodesURL.REDEEM_CODES_LOCAL: {
        this.baseUrl = "https://api-stage.helika.io/v1";
        this.enabled = false;
        break;
      }
      case RedeemCodesURL.REDEEM_CODES_PROD: {
        this.baseUrl = "https://api.helika.io/v1";
        break;
      }
      case RedeemCodesURL.REDEEM_CODES_DEV:
      default: {
        this.baseUrl = "https://api-stage.helika.io/v1";
        break;
      }
    }
  }

  //use a redeem code to get rewards
  public async redeem(
    redeem_code: string,
    user_id: string
  ): Promise<{ message: string }> {

    let params: any = this.prepareEventParams(redeem_code, user_id)

    return this.postRequest(`/redemption-codes/use/redeem`, params);
  }

  private prepareEventParams(redeem_code: string, user_id: string) {

    let params = {
      code: redeem_code,
      user_id: user_id
    }
    return params;
  }

}