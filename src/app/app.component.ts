import { Component } from '@angular/core';
import { Events, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { BluetoothService } from '../services/bluetooth-service';

import { TabsPage } from '../pages/tabs/tabs';
import { EnableBluetoothPage } from '../pages/enable-bluetooth/enable-bluetooth';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any;

  constructor(
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    bluetooth: BluetoothService,
    events: Events,
  ) {
    platform.ready().then(() => {
      statusBar.styleLightContent();

      // start checking if BT is enabled
      setInterval(() => {
        bluetooth.isEnabled().subscribe(
          () => { this.rootPage = TabsPage; },
          (error) => { this.rootPage = EnableBluetoothPage; }
        );
      }, 5000);

      bluetooth.isEnabled().subscribe(
        () => {
          this.rootPage = TabsPage;
          splashScreen.hide();

          events.subscribe('bluetooth:enabled', () => {
            this.rootPage = TabsPage;
          });
        },
        (error) => {
          this.rootPage = EnableBluetoothPage;
          splashScreen.hide();
        }
      );
    });
  }
}
