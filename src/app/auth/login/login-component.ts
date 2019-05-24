import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";
import { AuthService } from "src/app/services/auth.service";

@Component({
    templateUrl: './login-component.html',
    styleUrls: ['./login-component.css']
})
export class LoginComponent{
    constructor(private authService: AuthService){}
    isLoading = false;

    onLogin(loginForm: NgForm) {
        if(loginForm.invalid){
            return
        }
        this.isLoading = true;
        const email = loginForm.value.email;
        const password = loginForm.value.password;
        this.authService.login(email,password);
    }
}