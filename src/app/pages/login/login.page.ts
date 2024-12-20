import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  form:FormGroup;
  isTypePassword:boolean=true;
  isLogin=false;

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
    this.form = new FormGroup({
      email: new FormControl('', 
        {validators: [Validators.required, Validators.email]}
      ),
      password: new FormControl('', 
        {validators: [Validators.required, Validators.minLength(8)]}
      ),
    });
  }

  onChange(){
    this.isTypePassword=!this.isTypePassword;
  }

  onSubmit(){
    if (!this.form.valid) return;
    console.log(this.form.value);
    this.login(this.form);
  }

  login(form){
    this.authService.login(form.value.email, form.value.password).then(data =>{
      console.log(data);
      this.router.navigateByUrl('/home');
      form.reset();
    })
    .catch(e =>{
      console.log(e);
      let msg:string='usted no se pudo loguear , por favor trate devuelta.';
      if (e.code== 'auth/user-not-found') msg='la direccion de mail no pudo ser encontrada';
      else if (e.code=='auth/wrong-password') msg='Por favor ingrese la contraseña correcta.';
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
