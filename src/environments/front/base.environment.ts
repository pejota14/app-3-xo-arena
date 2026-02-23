import { rawEnvironment } from "../back/dev.environment";

export const environment = {
    bannerId: '',
    interstitialId: '',
    isAndroid: false,
    isIOS: false,
    isWeb: false,
    production: rawEnvironment.production
}
