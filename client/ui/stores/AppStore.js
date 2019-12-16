import * as React from "react";

class AppStore {
  state = new ReactiveDict({
    drawerOpen: false,
    theme: localStorage.getItem('theme') || 'light'
  });

  get theme() {
    const user = Meteor.user();
    if(user && user.theme) {
      return user.theme;
    } else {
      return this.state.get('theme');
    }
  }

  set theme(str) {
    this.state.set('theme', str);
    Meteor.call('currentUser.setTheme', str);
    localStorage.setItem('theme', str);
  }

  get drawerOpen() {
    return this.state.get('drawerOpen');
  }

  set drawerOpen(flag) {
    this.state.set('drawerOpen', flag)
  }

  closeDrawer = () => {
    this.drawerOpen = false;
  };

  openDrawer = () => {
    this.drawerOpen = true;
  };

  toggleDrawer = () => {
    this.drawerOpen = !this.drawerOpen;
  };

  toggleTheme = () => {
    if(this.theme === 'light') {
      this.theme = 'dark';
    } else {
      this.theme = 'light';
    }
  }
}

export const AppStoreContext = React.createContext(new AppStore());
export const useStore = () => {
  return React.useContext(AppStoreContext);
};