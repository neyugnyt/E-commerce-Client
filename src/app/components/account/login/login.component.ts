import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '../account.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  

  loginForm: FormGroup

  constructor(private accountService: AccountService, private formBuilder: FormBuilder) {
    
  }
  
  ngOnInit(){
   this.createLoginForm()
  }

  createLoginForm(){
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]]
      
    })
  }

  onSubmit(){
    this.accountService.login(this.loginForm.value).subscribe(() =>{
      console.log('logged in')
    })
  }

}
