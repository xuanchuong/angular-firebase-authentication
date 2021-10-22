import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../shared/service/auth.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  form: FormGroup;

  constructor(
    private authService: AuthService,
  ) {
    this.form = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
    });
  }

  ngOnInit(): void {
  }

  onSubmit() {
    this.authService.ForgotPassword(this.form.value.email).then();
  }
}
