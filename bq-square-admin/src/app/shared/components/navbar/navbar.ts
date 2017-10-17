import {Component, Input, Output, EventEmitter} from '@angular/core';
import {DomSanitizer, SafeStyle} from '@angular/platform-browser'

import {environment} from '../../../../environments/environment';

@Component({
  selector: 'app-navbar',
  templateUrl: 'navbar.html',
  styleUrls: ['navbar.scss']
})
export class NavBar {
  project_name = environment['project_name'] || 'BQ-Square';

  @Input() menu = [];
  @Input() user: any;

  @Output() logout = new EventEmitter();

  get is_logout(): boolean {
    return !this.user
  };

  get user_image_url(): SafeStyle {
    return this.sanitizer.bypassSecurityTrustStyle(`url("${this.user['google_image_url']}")`);
  }


  constructor(private sanitizer: DomSanitizer) {
  }

  onLogout() {
    this.logout.emit(null);
  }

}
