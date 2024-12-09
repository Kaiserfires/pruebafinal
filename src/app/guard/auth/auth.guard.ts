/*import { ActivatedRouteSnapshot, CanActivate, CanActivateFn,CanMatch, GuardResult, MaybeAsync, Route, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';*/

import { Injectable } from '@angular/core';
import { CanMatch, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';

@Injectable({
  providedIn:'root'
})
export class AuthGuard implements CanMatch{
  constructor(
    private authService:AuthService,
    private router: Router
  ) { }

  async canMatch(): Promise<boolean> {
      try{
        const user =await this.authService.checkAuth();
        console.log(user);
        if (user) {
          return true
        }else{
          this.navigate('/login');
          return false;
        }
      }catch(e){
        console.log(e);
        this.navigate('/login');
        return false;
      }
  }

  navigate(url){
    this.router.navigateByUrl(url,{replaceUrl: true});
    //return false;
  }

}

/*export class authGuard implements CanActivate, CanMatch {
  canActivate(
    route:ActivatedRouteSnapshot,
    state:RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree
    {
    return true;
    }
    canMatch(
      route: Route, 
      segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      return true;
    }
}*/
