import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../shared/service/auth.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {BehaviorSubject} from "rxjs";

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {

  form: FormGroup;
  private loadingSubject: BehaviorSubject<boolean>;

  constructor(
    public authService: AuthService,
    private router: Router
  ) {
    this.loadingSubject = new BehaviorSubject<boolean>(false);
    this.form = new FormGroup({
      username: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      username: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
    });
  }

  onSubmit() {
    this.authService.SignIn(this.form.value.username, this.form.value.password)
      .then(() => {
          this.router.navigate(['/']).then();
        },
        error => {
          console.error(error);
          this.loadingSubject.next(false);
        });
  }

}
