import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";
import { AuthService } from "src/app/services/auth.service";
import { Router } from "@angular/router";

@Component({
    templateUrl: "./signup-component.html",
    styleUrls: ["./signup-component.css"]
})
export class SignupComponent{
    isLoading = false;
    constructor(private authService: AuthService, private route: Router){}
    onSignup(signupForm: NgForm) {
        if(signupForm.invalid){
            return
        }
        this.isLoading = true;
        const firstName = signupForm.value.firstName;
        const lastName = signupForm.value.lastName;
        const email = signupForm.value.email;
        const password = signupForm.value.password;
        this.authService.createUser(firstName, lastName, email, password);
        this.isLoading = false;
        this.route.navigate(['/']);
    }
}