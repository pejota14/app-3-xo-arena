import { rawEnvironment } from "../back/dev.environment";

export const environment = {
    bannerId: '',
    interstitialId: '',
    isAndroid: true,
    isIOS: false,
    isWeb: false,
    production: rawEnvironment.production
}
