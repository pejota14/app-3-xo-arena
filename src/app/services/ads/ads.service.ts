import { Injectable } from '@angular/core';
import { AdLoadInfo, AdMob, AdMobBannerSize, AdOptions, BannerAdOptions, BannerAdPluginEvents, BannerAdPosition, BannerAdSize, InterstitialAdPluginEvents } from '@capacitor-community/admob';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/front/base.environment';

export enum ConsentStatus {
    AUTORITHED = 'authorized',
    DENIED = 'denied',
    NOT_DETERMINED = 'notDetermined',
    RESTRICTED = 'restricted',
}

@Injectable({
    providedIn: 'root'
})
export class AdsService {
    consentInfo: ConsentStatus = ConsentStatus.NOT_DETERMINED;
    adsEnabled = true;
    bannerHeight = new BehaviorSubject<number>(0);
    bannerHeightObservable = this.bannerHeight.asObservable();
    bannerPresent = false;
    bannerShown = false;

    constructor() { }

    async initializeAdMob() {
        await AdMob.initialize({
            initializeForTesting: true,
            testingDevices: [
                "f6779e62c8357dae9c342d9126cf37ee",
                "1488A07F8640A3E6E301E72B5EBAC128"
            ]
        });
    }

    async requestConsent(): Promise<ConsentStatus> {
        try {
            let consentInfo = await AdMob.trackingAuthorizationStatus();
            if (consentInfo.status === ConsentStatus.NOT_DETERMINED) {
                await AdMob.requestTrackingAuthorization();
                consentInfo = await AdMob.trackingAuthorizationStatus();
            }
            if (consentInfo.status === ConsentStatus.AUTORITHED) {
                this.consentInfo = ConsentStatus.AUTORITHED;
                return ConsentStatus.AUTORITHED;
            } else {
                return ConsentStatus.DENIED;
            }
        } catch (error) {
            return ConsentStatus.DENIED;
        }
    }

    async showBanner(): Promise<void> {
        AdMob.addListener(BannerAdPluginEvents.Loaded, () => {
            // Subscribe prepared banner
        });

        AdMob.addListener(BannerAdPluginEvents.SizeChanged, (size: AdMobBannerSize) => {
            this.bannerHeight.next(size.height);
        });
        const options: BannerAdOptions = {
            adId: environment.bannerId,
            adSize: BannerAdSize.ADAPTIVE_BANNER,
            position: BannerAdPosition.BOTTOM_CENTER,
            margin: 0,
            isTesting: !environment.production,
            npa: this.consentInfo !== ConsentStatus.AUTORITHED,
        };
        if (this.adsEnabled) {
            AdMob.showBanner(options).then(() => {
                this.bannerPresent = true;
                this.bannerShown = true;
            });
        }
    }

    async showInterstitial(): Promise<void> {
        AdMob.addListener(InterstitialAdPluginEvents.Loaded, (info: AdLoadInfo) => {
            // Subscribe prepared interstitial
        });
        const options: AdOptions = {
            adId: environment.interstitialId,
            isTesting: !environment.production,
            npa: this.consentInfo !== ConsentStatus.AUTORITHED,
        };
        if (this.adsEnabled) {
            await AdMob.prepareInterstitial(options);
            await AdMob.showInterstitial();
        }
    }

    async hideBanner(): Promise<void> {
        AdMob.hideBanner().finally(() => {
            this.bannerPresent = false;
        });
    }

    async resumeBanner(): Promise<void> {
        if (this.adsEnabled) {
            AdMob.resumeBanner().catch(() => {
                this.showBanner();
            }).finally(() => {
                this.bannerPresent = true;
            });
        }
    }
}
