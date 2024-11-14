import { Base } from "../base";
import { SocialConnect } from "../index";
import ExecutionEnvironment from 'exenv';
import _ from "lodash";
import { config, passport } from '@imtbl/sdk';
import { ethers } from "ethers";

export class SOCIAL_CONNECT extends Base {

  private passport_instance_imx: any;

  constructor(apiKey: string, gameId: string, environment: SocialConnect, piiTracking: boolean = true, imxProjectDetails: any) {

    super(apiKey, gameId, piiTracking);

    let IMX_environment = config.Environment.SANDBOX

    switch (environment) {
      case SocialConnect.SOCIAL_SANDBOX: {
        IMX_environment = config.Environment.SANDBOX
        break;
      }
      case SocialConnect.SOCIAL_PROD: {
        IMX_environment = config.Environment.PRODUCTION
        break;
      }
      case SocialConnect.SOCIAL_SANDBOX:
      default: {
        IMX_environment = config.Environment.SANDBOX
        break;
      }
    }

    try {
      if (ExecutionEnvironment.canUseDOM) {
        this.passport_instance_imx = new passport.Passport({
          baseConfig: {
            environment: IMX_environment,
            publishableKey: imxProjectDetails.publishableKey!,// replace with your publishable API key from Hub
          },
          clientId: imxProjectDetails.clientId!, // replace with your client ID from Hub
          redirectUri: imxProjectDetails.redirectUri!, // replace with one of your redirect URIs from Hub
          logoutRedirectUri: imxProjectDetails.logoutRedirectUri!, // replace with one of your logout URIs from Hub
          audience: 'platform_api',
          scope: 'openid offline_access email transact',
          popupOverlayOptions: {
            disableGenericPopupOverlay: false, // Set to true to disable the generic pop-up overlay
            disableBlockedPopupOverlay: false, // Set to true to disable the blocked pop-up overlay
          },
          logoutMode: 'silent'
        });
      }
    } catch (e) {
      console.log('Could not create IMX Passport Instance')
    }


  }

  public getPassportInstance(): any {
    try {
      return this.passport_instance_imx
    } catch (e) {
      console.error(e)
    }
  }

  public async connectImx(handleConnectIMXSuccess: any, emailValidator?: string, handleEmailMismatch?: any): Promise<any> {
    try {

      if (!ExecutionEnvironment.canUseDOM) {
        console.error('Could not attempt IMX connect')
        return
      }
      const passportProvider = this.passport_instance_imx.connectEvm();
      const provider = new ethers.providers.Web3Provider(passportProvider);
      const accounts = await provider.send('eth_requestAccounts', []);
      const imxProfile = await this.passport_instance_imx.getUserInfo();
      const accessToken = await this.passport_instance_imx.getAccessToken();

      //if has emailValidator, check if correct email
      if (emailValidator && imxProfile?.email && !(emailValidator?.trim() === imxProfile?.email?.trim())) {
        if (handleEmailMismatch) {
          await this.passport_instance_imx.logout()
          handleEmailMismatch()
          return;
        }
      }

      //check if IMX account is empty
      if (_.isEmpty(accounts)) {
        console.error('Empty IMX passport of accounts')
      }

      //handle success
      if (handleConnectIMXSuccess && (typeof handleConnectIMXSuccess === 'function')) {
        handleConnectIMXSuccess(!_.isEmpty(imxProfile?.sub) ? imxProfile?.sub : undefined)
      }

      //return accessToken and IMX Profile
      return {
        accessToken: accessToken,
        imxProfile: imxProfile
      };

    } catch (e) {
      console.error('Error:', e)
    }
  }

  public async logoutImx(): Promise<any> {
    try {
      this.passport_instance_imx.logout()
    } catch (e) {
      console.error(e)
    }
  }

}