import { ChangeDetectorRef, Component } from '@angular/core';
import { LoaderService } from '../../../services/loader.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.scss',
})
export class LoaderComponent {
  isLoading!: boolean;

  constructor(
    private loaderService: LoaderService,
    private cd: ChangeDetectorRef
  ) {}

  ngAfterViewInit() {
    // Change your data here
    this.cd.detectChanges(); // Manually trigger change detection
  }

  ngOnInit() {
    this.loaderService.isLoading$.subscribe((isLoading) => {
      this.isLoading = isLoading;
      this.cd.detectChanges();
    });
  }
}
