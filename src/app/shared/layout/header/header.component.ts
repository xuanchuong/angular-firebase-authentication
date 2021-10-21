import {Observable} from 'rxjs';
import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../service/auth.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  isLoggedIn$: Observable<boolean> | undefined;

  selectedItem: string | undefined;

  constructor(public authService: AuthService) {
  }

  ngOnInit() {
    this.isLoggedIn$ = this.authService.isLoggedIn;
    this.selectedItem = 'home';
  }

  onSelect(item: string): void {
    this.selectedItem = item;
  }
}
