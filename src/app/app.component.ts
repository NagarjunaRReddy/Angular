import { Component, OnInit, Renderer2, RendererFactory2 } from '@angular/core';
import { HelperService } from './services/helper.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'universal-sop';
  themeConfig: any = {};
  defaultColors: any = {
    colourMode: 'light',
    primaryBackgroundColour: '#4c89e1',
    secondaryBackgroundColour: '#d3e4fd',
    primaryTextColour: '#000000',
    secondaryTextColour: '#333333',
    onHoverColour: '#000000'
  };

  constructor(private helper: HelperService, private renderer: Renderer2) {}

  ngOnInit(): void {
    console.log('Applying theme:', this.themeConfig);
    // Load persisted theme settings or use defaults
    const storedThemeSettings = this.helper.getValue('themeSettings');
    console.log(storedThemeSettings);
    

    if (storedThemeSettings) {
      try {
        this.themeConfig = JSON.parse(storedThemeSettings);
      } catch (error) {
        console.error('Error parsing theme settings:', error);
        this.themeConfig = this.defaultColors;
      }
    } else {
      this.themeConfig = this.defaultColors;
    }

    // Apply the theme settings
    this.applyTheme();
  }

  applyTheme(): void {
    console.log(this.themeConfig);
    
      this.renderer.setStyle(document.documentElement, '--primary-color', this.themeConfig.PrimaryBackgroundColour);
      this.renderer.setStyle(document.documentElement, '--secondary-color', this.themeConfig.SecondaryBackgroundColour);
      this.renderer.setStyle(document.documentElement, '--hover-color', this.themeConfig.OnHoverColour);
      this.renderer.setStyle(document.documentElement, '--primary-text-color', this.themeConfig.PrimaryTextColour);
  }
}
