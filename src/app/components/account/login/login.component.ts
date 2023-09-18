import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '../account.service';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  

  loginForm: FormGroup
  returnUrl: string

  constructor(private activateRoute: ActivatedRoute, private router: Router, private accountService: AccountService, private formBuilder: FormBuilder) {
    
  }
  
  ngOnInit(){
    this.returnUrl = this.activateRoute.snapshot.queryParams.returnUrl || '/shop'
    this.createLoginForm()
  }

  get loginFormControl(){
    return this.loginForm.controls
  }
  
  createLoginForm(){
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
      
    })
  }

  onSubmit(){
    this.accountService.login(this.loginForm.value).subscribe(() =>{
      this.router.navigateByUrl(this.returnUrl)
    })
  }

}
