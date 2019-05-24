import { Injectable, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { UserAuthData } from "../models/authData-model";
import { UserData } from "../models/userData-model";
import { Subject } from "rxjs";
import { Router } from "@angular/router";
import { BackendUserData } from "../models/backendUserData";

@Injectable({ providedIn: "root" })
export class AuthService {
    constructor(private http: HttpClient, private router: Router){}
    private token;
    private isAuthenticated;
    private logoutTimer: any;
    private authStatusListener = new Subject<boolean>();
    private userData = new BackendUserData();
    private loginSubject = new Subject<string>();
    createUser(firstName: string, lastName: string, email: string, password: string) {
        const userData = new UserData(firstName, lastName, email, password);
        this.http.post("http://localhost:3000/api/user/signup", userData)
            .subscribe(response => {
                console.log(response);
            });
    };

    login(email: string, password: string) {
        const userAuthData = new UserAuthData(email,password);
        this.http.post<{ token: string, 
                         expiresIn: number, 
                         userId: string, 
                         firstName: string, lastName: string }>("http://localhost:3000/api/user/login", userAuthData)
            .subscribe(result => {
                const token = result.token;
                this.token = token;
                if(token){
                    this.userData.firstName = result.firstName;
                    this.userData.lastName = result.lastName;
                    this.userData.userId = result.userId;
                    const expiresInDuration = result.expiresIn;
                    this.setAuthTimer(expiresInDuration);
                    this.isAuthenticated = true;
                    this.authStatusListener.next(true);
                    const now = new Date();
                    const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
                    this.saveAuthData(token, expirationDate, this.userData.userId, this.userData.firstName, this.userData.lastName);
                    this.router.navigate(['/']);
                    const userName = this.userData.firstName;
                    this.loginSubject.next(userName);
                };                
            });
    };

    
    autoAuthUser() {
        const authInformation = this.getAuthData();
        if(!authInformation){
            return;
        }
        const now = new Date();
        const isInfuture = authInformation.expirationDate.getTime() - now.getTime();
        if(isInfuture > 0) {
            this.token = authInformation.token;
            this.userData.userId = authInformation.userId;
            this.userData.firstName = authInformation.firstName;
            this.userData.lastName = authInformation.lastName; 
            const userName = this.userData.firstName;
            this.isAuthenticated = true;
            this.setAuthTimer(isInfuture/1000);
            this.authStatusListener.next(true);
            this.loginSubject.next(userName);
        }
    }

    logout() {
        this.token = null;
        this.isAuthenticated = false;
        this.authStatusListener.next(false);
        clearTimeout(this.logoutTimer);
        this.clearAuthData();
        this.userData.userId = null;
        this.router.navigate(['/']);
        this.loginSubject.next(null);
    }

    private saveAuthData(token: string, expirationDate: Date, userId: string, firstName: string, lastName: string) {
        localStorage.setItem("token", token);
        localStorage.setItem("expiration", expirationDate.toISOString());
        localStorage.setItem("userId",userId);
        localStorage.setItem("firstName", firstName);
        localStorage.setItem("lastName", lastName);
    }

    private getAuthData() {
        const token = localStorage.getItem("token");
        const expirationDate = localStorage.getItem("expiration");
        const userId = localStorage.getItem("userId");
        const firstName = localStorage.getItem("firstName");
        const lastName = localStorage.getItem("lastName")
        if(!token || !expirationDate){
            return;
        }
        return {
            token: token,
            expirationDate: new Date(expirationDate),
            userId: userId,
            firstName: firstName,
            lastName: lastName
        }
    }

    
    private clearAuthData() {
        localStorage.removeItem("token");
        localStorage.removeItem("expiration");
        localStorage.removeItem("userId");
        localStorage.removeItem("firstName");
        localStorage.removeItem("lastName");
    }

    getAuthStatusListener() {
        return this.authStatusListener.asObservable();
    }

    getToken() {
        return this.token;
    }

    getIsAuth() {
        return this.isAuthenticated;
    }

    getUserData() {
        return this.userData;
    }

    getLoginSubject() {
        return this.loginSubject;
    }

    getLoginListener() {
        return this.loginSubject.asObservable();
    }

    private setAuthTimer(duration: number) {
        this.logoutTimer = setTimeout(() => {
            this.logout();
        },duration * 1000)
    }


}