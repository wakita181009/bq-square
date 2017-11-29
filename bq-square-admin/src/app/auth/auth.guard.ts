import {Injectable} from '@angular/core';
import {
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
}    from '@angular/router';
import {CanActivate} from '@angular/router';
import {AuthService} from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let url = state.url;
    let user = this.authService.authenticated();

    if (!user) {
      localStorage.setItem('redirect_url', url);
      this.authService.logout();
    } else if (!this.authService.authenticatePath(user, url)) {
      this.authService.logout();
    }
    return true
  }
}


