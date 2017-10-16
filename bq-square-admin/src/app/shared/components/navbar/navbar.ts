import {Component, Input, Output, EventEmitter} from '@angular/core';
import {DomSanitizer, SafeStyle} from '@angular/platform-browser'



@Component({
  selector: 'app-navbar',
  templateUrl: 'navbar.html',
  styleUrls: ['navbar.scss']
})
export class NavBar {

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
