import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
import { IonicStorageModule } from '@ionic/storage';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { BluetoothPage } from '../pages/bluetooth/bluetooth';
import { JoystickPage } from '../pages/joystick/joystick';
import { TabsPage } from '../pages/tabs/tabs';
import { EnableBluetoothPage } from '../pages/enable-bluetooth/enable-bluetooth';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { BluetoothService } from '../services/bluetooth-service';

@NgModule({
  declarations: [
    MyApp,
    BluetoothPage,
    JoystickPage,
    TabsPage,
    EnableBluetoothPage,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    BluetoothPage,
    JoystickPage,
    TabsPage,
    EnableBluetoothPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    BluetoothSerial,
    BluetoothService,
  ]
})
export class AppModule {}
