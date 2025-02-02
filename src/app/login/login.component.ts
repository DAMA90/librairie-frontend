import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UserAuthService } from '../_service/user-auth.service';
import { UsersService } from '../_service/users.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private userService: UsersService,
    private userAuthSerivce: UserAuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.userAuthSerivce.setName("");
  }

  login(loginForm: NgForm) {
    this.userService.login(loginForm.value).subscribe(
      (response: any)=>{
        this.userAuthSerivce.setRoles(response.roles);
        this.userAuthSerivce.setToken(response.token);
        this.userAuthSerivce.setUserId(response.id);
        this.userAuthSerivce.setName(response.nom);

        const role = response.roles[0];
        if(role === 'ROLE_ADMIN') {
          this.router.navigate(['/books']);
        } else {
          this.router.navigate(['/borrow-book'])
        }
      },
      (error)=>{
        console.log(error);
      }
    );
  }

}