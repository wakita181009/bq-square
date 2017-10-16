import {Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef} from '@angular/core';
import {DomSanitizer, SafeStyle} from '@angular/platform-browser'
import {SetupService} from '../setup.service';

declare let auth2: any;
declare let window: any;

@Component({
  selector: 'bqs-setup',
  templateUrl: './bqs-setup.component.html',
  styleUrls: ['./bqs-setup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BqsSetupComponent implements OnInit {

  completed: boolean = false;
  loading: boolean = false;
  get form_unavailable() {
    return this.completed || this.loading
  }

  model = {
    name: ""
  };

  user_email: string;
  user_image_url: SafeStyle;
  google_token: string;


  constructor(private setupService: SetupService,
              private sanitizer: DomSanitizer,
              private ref: ChangeDetectorRef) {
    auth2.then(() => {
      if (!auth2.isSignedIn.get()) window.location.href = "/login";
      this.google_token = auth2.currentUser.get().getAuthResponse().id_token;
      this.setupService.setupAuthorization(this.google_token)
        .subscribe(profile => {
          this.model.name = profile['name'];
          this.user_email = profile['email'];
          this.user_image_url =
            this.sanitizer.bypassSecurityTrustStyle(`url("${profile['picture']}")`);
          this.ref.detectChanges();
        });
    });
  }

  ngOnInit() {
  }

  onSubmit() {
    this.loading = true;

    this.setupService.setup({
      google_token: this.google_token,
      ...this.model
    }).subscribe((res) => {
      if (res) {
        this.loading = false;
        this.completed = true;
        this.ref.detectChanges();
      }
    })
  }


}
