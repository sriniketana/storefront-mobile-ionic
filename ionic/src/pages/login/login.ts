import { Component, NgZone } from '@angular/core';
import { NavController, App, Tabs } from 'ionic-angular';
import { BlueApiServiceProvider } from '../../providers/blue-api-service/blue-api-service';
import { UtilsProvider } from '../../providers/utils/utils'

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  username: string;
  password: string;
  loginError = false;

  constructor(public zone: NgZone, public navCtrl: NavController, public restService: BlueApiServiceProvider, private app: App, private utils: UtilsProvider) {

  }

  login() {
    this.utils.presentLoading()
    // var payload = {
    //   grant_type: 'password',
    //   scope: 'blue',
    //   username: this.username,
    //   password: this.password
    // }
    // this.restService.loginUser(payload, (response) => {
    //   this.zone.run(() => {
    //     console.log("Login Result" + JSON.stringify(response))
        
    //   });
    // }, (error) => {
    //   this.zone.run(() => {
    //     this.utils.dismissLoading()
    //     console.log("Login Error: " + JSON.stringify(error));
    //     this.password = "";
    //     this.loginError = true;
    //   });
    // });
    this.restService.userState.accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1OTM0NTg0OTQsInVzZXJfbmFtZSI6IjhjNjI2NGE0YWU0ZTRhZDU5YmI3NTEwNDExZDRmNmI2IiwiYXV0aG9yaXRpZXMiOlsiUk9MRV9VU0VSIl0sImp0aSI6ImFkODNiNWNjLTVmNzUtNDIyNS05MGY2LWQ2NzhiMGJkMjBmMiIsImNsaWVudF9pZCI6ImJsdWVjb21wdXRld2ViIiwic2NvcGUiOlsiYmx1ZSJdfQ.HtIDRUk_R_fNsAdmxGWltl7wySszupxu1iOAnB3o5YM'
    this.registerUserwithMFP();
  }

  parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload)['user_name'];
  };

  navigateToCatalog() {
    this.zone.run(() => {
      this.password = "";
      this.loginError = false;
      this.utils.dismissLoading()
      const tabsNav = this.app.getNavByIdOrName('mainTab') as Tabs;
      tabsNav.select(0);
    });
  }


  registerUserwithMFP() {
    var userID = this.parseJwt(this.restService.userState.accessToken)
    WLAuthorizationManager.login('UserLogin', {
      username: userID,
      password: userID
    }).then(() => {
      this.restService.userState.authenticated = true;
      this.navigateToCatalog()
      this.initializePush()
    }, error => {
      console.log("UserLogin Failed : " + JSON.stringify(error))
      this.utils.dismissLoading()
      this.password = "";
      this.loginError = true;
    })
  }

  initializePush() {
    MFPPush.initialize(
      (successResponse) => {
        MFPPush.registerNotificationsCallback(this.notificationReceived);
        WLAuthorizationManager.obtainAccessToken("push.mobileclient").then(
          (accessToken) => {
            this.utils.dismissLoading()
            MFPPush.registerDevice(null, this.successCallback, this.failureCallback);
          }
        );
      },
      (failureResponse) => {
       // this.navigateToCatalog()
        console.log("Failed to initialize");
      }
    );
  }

  notificationReceived = (message) => {
    if (message.alert.body !== undefined) {
      alert(message.alert.body);
    } else {
      alert(message.alert);
    }
  };

  successCallback = (response) => {
   // this.navigateToCatalog()
    console.log("Success: " + JSON.stringify(response));
  };

  failureCallback = (response) => {
  //  this.navigateToCatalog()
    console.log("Error: " + JSON.stringify(response));
  };
}
