class AppStore {
  _theme = new ReactiveVar('light');

  get theme() {
    return this._theme.get();
  }

  set theme(str) {
    this._theme.set(str);
  }

  toggleTheme = () => {
    if(this.theme === 'light') {
      this.theme = 'dark';
    } else {
      this.theme = 'light';
    }
  }
}

export default new AppStore();