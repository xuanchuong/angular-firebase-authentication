import {Observable} from 'rxjs';
import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../service/auth.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  isLoggedIn$: Observable<boolean>;

  selectedItem: string | undefined;

  constructor(public authService: AuthService) {
    this.isLoggedIn$ = this.authService.isLoggedIn.asObservable();
  }

  ngOnInit() {
    this.isLoggedIn$ = this.authService.isLoggedIn;
    this.selectedItem = 'home';
  }

  onSelect(item: string): void {
    this.selectedItem = item;
  }

  getDisplayName() {
    if (this.authService.userData) {
      return this.authService.userData.displayName;
    } else {
      return '';
    }
  }

  getPhotoUrl() {
    if (this.authService.userData) {
      return this.authService.userData.photoURL;
    } else {
      return '../../../../assets/img/me.svg';
    }
  }
}
