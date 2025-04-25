import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  saveTheme(theme: {
    primary: string;
    secondary: string;
    hover: string;
    text: string;
  }) {
    sessionStorage.setItem('themeSettings', JSON.stringify(theme));
    this.applyTheme(theme);
  }

  loadTheme() {
    const theme = sessionStorage.getItem('themeSettings');
    if (theme && theme != undefined) {
      this.applyTheme(JSON.parse(theme));
    }
  }

  applyTheme(theme: {
    primary: string;
    secondary: string;
    hover: string;
    text: string;
  }) {
    document.documentElement.style.setProperty(
      '--primary-color',
      theme.primary
    );
    document.documentElement.style.setProperty(
      '--secondary-color',
      theme.secondary
    );
    document.documentElement.style.setProperty(
      '--hover-color',
      theme.hover
    );
    document.documentElement.style.setProperty(
      '--primary-text-color',
      theme.text
    );
  }
}
