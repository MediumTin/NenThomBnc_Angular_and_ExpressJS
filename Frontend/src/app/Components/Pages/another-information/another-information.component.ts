import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-another-information',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './another-information.component.html',
  styleUrl: './another-information.component.css'
})
export class AnotherInformationComponent {
  delivery_policy_checked: boolean = false;
  payment_policy_checked: boolean = false;
  return_policy_checked: boolean = false;
  privacy_policy_checked: boolean = false;
  constructor() {
    const currentUrl = window.location.href;
    if (currentUrl.includes('delivery_policy')) {
      this.delivery_policy_checked = true;
    } else if (currentUrl.includes('payment_policy')) {
      this.payment_policy_checked = true;
    } else if (currentUrl.includes('return_policy')) {
      this.return_policy_checked = true;
    } else if (currentUrl.includes('privacy_policy')) {
      this.privacy_policy_checked = true;
    }
  }
}
