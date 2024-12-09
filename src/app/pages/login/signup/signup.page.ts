import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  signupForm:FormGroup;
  isTypePassword:boolean=true;
  isLoading:boolean=true;

  constructor(
    private router: Router,
    private authService: AuthService,
    private alertController: AlertController
  ) { 
    this.initForm();
  }

  ngOnInit() {
  }

  
  initForm() {
    this.signupForm = new FormGroup({
      username: new FormControl('', 
        {validators: [Validators.required]}
      ),
      email: new FormControl('', 
        {validators: [Validators.required, Validators.email]}
      ),
      password: new FormControl('', 
        {validators: [Validators.required, Validators.minLength(8)]}
      ),
    });
  }

  onChange() {
    this.isTypePassword = !this.isTypePassword;
  }

  onSubmit() {
    if(!this.signupForm.valid) return;
    console.log(this.signupForm.value);
    this.register(this.signupForm);
  }

  register(form){
    this.isLoading=true;
    console.log(form.value);
    this.authService.register(form.value).then((data:any)=>{
      console.log(data);
      this.router.navigateByUrl('/home');
      this.isLoading=false;
      form.reset();
    })
    .catch(e=>{
      console.log(e);
      this.isLoading=false;
      let msg:string='no se pudo registrar, por favor trate devuelta.'
      if (e.code == 'auth/email-already-in-use') {
        msg= 'email ya registrado'; //e.mensaje;        
      }
      this.showAlert(msg);
    });
  }

  async showAlert(msg){
    const alert =await this.alertController.create({
      header: 'Alerta',
      message: msg,
      buttons: ['OK'],
    });
    await alert.present();
  }

}
