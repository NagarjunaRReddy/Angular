import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'statusColor',
})
export class StatusColorPipe implements PipeTransform {
  transform(value: string): string {
    const statusMap: { [key: string]: string } = {
      RED: 'red_bg',
      'On Site': 'green_bg',
      GREEN: 'green_bg1',
      Incoming: 'yellow_bg',
      YELLOW: 'yellow_bg1',
      Unknown: 'blue_bg',
      Available: 'light_green_bg',
    };

    return statusMap[value] || ''; // Return empty string if no match
  }
}
