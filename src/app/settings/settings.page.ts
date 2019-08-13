import { Component, AfterContentInit } from '@angular/core';
import { Events } from '@ionic/angular';
import { AuthGuardService } from '../services/auth-route-guard'
import { AmplifyService } from 'aws-amplify-angular';

@Component({
  selector: 'settings-page',
  templateUrl: 'settings.page.html',
  styleUrls: ['settings.page.scss'],
})
export class SettingsPage implements AfterContentInit {

  public signUpConfig: any = {
    hideAllDefaults: true,
    signUpFields: [
      {
        label: 'Name',
        key: 'name',
        required: true,
        displayOrder: 1,
        type: 'string'
      },
      {
        label: 'Email',
        key: 'email',
        required: true,
        displayOrder: 2,
        type: 'string'
      },
      {
        label: 'Password',
        key: 'password',
        required: true,
        displayOrder: 3,
        type: 'password'
      }
    ]
  };

  authState: any;
  authService: AuthGuardService
  amplifyService: AmplifyService

  constructor(
    public events: Events,
    public guard: AuthGuardService,
    public amplify: AmplifyService
  ) {
    this.authState = { loggedIn: false, user: null };
    this.authService = guard;
    this.amplifyService = amplify;
    this.amplifyService.authStateChange$
      .subscribe(authState => {
        console.log(authState);
        this.authState.loggedIn = authState.state === 'signedIn';
        this.authState.user = authState.user;
        this.events.publish('data:AuthState', this.authState)
      });
  }

  ngAfterContentInit() {
    this.events.publish('data:AuthState', this.authState)
  }
}
