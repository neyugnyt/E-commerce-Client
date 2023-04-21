import { Component, OnInit } from '@angular/core';
import { AsyncValidatorFn, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '../account.service';
import { Router } from '@angular/router';
import { timer, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit{
  
  registerForm: FormGroup
  constructor(private formBuilder: FormBuilder, private accountService: AccountService, private router: Router) {  
  }
  
  ngOnInit(){
    this.createRegisterForm();
  }

  get regFormControl(){
    return this.registerForm.controls
  }

  createRegisterForm(){
    this.registerForm = this.formBuilder.group({
      displayName: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email], [this.validateEmailNotTaken()]],
      password: [null, [Validators.required]]
    })
  }

  onSubmit(){
    this.accountService.register(this.registerForm.value).subscribe(res => {
      this.router.navigateByUrl('/shop')
    }, error => {
      console.log(error)
    })
  }

  validateEmailNotTaken(): AsyncValidatorFn{
    return control => {
      return timer(300).pipe(
        switchMap(() => {
          if(!control.value) {
            return of(null)
          }
          return this.accountService.checkEmailExist(control.value).pipe(
            map(res => {
              return res ? {emailexists: true} : null
            })
          )
        })
      )
    }

  }

}
