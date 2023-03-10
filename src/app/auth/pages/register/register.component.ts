import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [
  ]
})
export class RegisterComponent  {

  miFormulario: FormGroup = this.fb.group({
    name      : [ 'test1' , [ Validators.required ]],
    email     : [ 'test1@test.com' , [ Validators.required, Validators.email ] ],
    password  : [ '123456' , [ Validators.required, Validators.minLength(6) ] ]
});

  constructor( 
      private fb: FormBuilder,
      private router: Router,
      private AuthService: AuthService
      ) { }

  register() {
   // console.log( this.miFormulario.value );
   
   const { name , email, password } = this.miFormulario.value;

   this.AuthService.registro( name, email, password )
     .subscribe( valid => {
        if( valid === true){
          this.router.navigateByUrl('/dashboard')
        }
        else{
          Swal.fire('Error' , valid , 'error' );
        }
     });

  }

 
}
