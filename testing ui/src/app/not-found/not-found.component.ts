import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, timer, pipe } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AuthService } from '../auth.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.css']
})
export class NotFoundComponent implements OnInit {

  subscription: Subscription;
  public role = sessionStorage.getItem('role');
  public url: any;
  public pageType: any;

  autogen: number;
  public clientIP: any;
  public currentUrl: any

  constructor(
    private route: Router,
    private authService: AuthService,
    private _route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.currentUrl = this._route.snapshot.url[0].path;
    this.clientIP = 'http://192.168.2.146:3200';
    console.log("current url is:", this.currentUrl);
    console.log("client ip address is:", this.clientIP);
    
    // this.subscription = timer(0, 10000).pipe(
    //   switchMap(() => this.authService.getDbConnection())
    // ).subscribe(res => {
    //   console.log("server connection is checking", res);
    //   console.log(res['data']);
    // });

    if (this.role == '' || this.role == null) {
      this.url = 'login';
      this.pageType = 'Login';
    } else {
      this.url = `${this.role}/dashboard`;
      this.pageType = 'Dashboard';
    }
  }

  // ngOnDestroy() {
  //   this.subscription.unsubscribe();
  // }

}
