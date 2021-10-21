import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../shared/service/auth.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {

  registerForm: FormGroup;
  error: string;
  submitted = false;
  loading = false;

  constructor(
    public authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
  ) {
    this.error = "";
    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  get f() {
    return this.registerForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    if (this.registerForm.invalid) {
      return;
    }

    this.authService.SignIn(this.registerForm.value.email, this.registerForm.value.password)
      .then(createdUser => {
        if (createdUser === undefined) {
          throw new Error('register fail');
        }
        this.loading = true;
        this.router.navigate(['/account/login']).then(() => {
        });
      })
      .catch(() => {
        alert('register fail');
      });

  }
}
