
import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { Events } from '@ionic/angular'
import { Storage } from '@ionic/storage';

const STORAGE_KEY = 'boxzy_login_state';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService {
  state: any = { LoggedIn: false, user: null };

  constructor(
    public router: Router,
    public events: Events,
    public storage: Storage) {

    //Lets hope this only happens once.
    this.getLoginState();

    this.events.subscribe('data:AuthState', async (data) => {
      this.state = data;
      this.saveToStorage();
    })
  }

  public isLoggedIn() {
    return this.state.LoggedIn;
  }

  public getUser() {
    return this.state.user;
  }

  //Look at caching this data to save on loading
  public async getLoginState() {
    const stateString = await this.storage.get(STORAGE_KEY);
    this.state = JSON.parse(stateString);
    console.log('getting login state', this.state);
    return this.state;
  }

  public async saveToStorage() {
    await this.storage.set(STORAGE_KEY, JSON.stringify(this.state));
  }
}