// user-form.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Users } from '../_models/users';
import { UserService } from '../_service/user.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {
  user: Users = {
    nom: '',
    email: '',
    motDepasse: '',
    roles: [],
    commentaires: [],
    password: ''
  };
  
  isUpdateMode = false;
  userId?: number;

  constructor(
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.userId = this.route.snapshot.params['id'];
    this.isUpdateMode = !!this.userId;
    
    if (this.isUpdateMode && this.userId) {
      this.userService.getUserById(this.userId).subscribe(
        data => {
          this.user = data;
        },
        error => {
          console.error('Erreur lors du chargement de l\'utilisateur:', error);
        }
      );
    }
  }

  onSubmit() {
    if (this.isUpdateMode && this.userId) {
      this.userService.updateUser(this.userId, this.user).subscribe(
        data => {
          this.goToUserList();
        },
        error => {
          console.error('Erreur lors de la mise à jour:', error);
        }
      );
    } else {
      this.userService.createUser(this.user).subscribe(
        data => {
          this.goToUserList();
        },
        error => {
          console.error('Erreur lors de la création:', error);
        }
      );
    }
  }

  onCancel() {
    this.goToUserList();
  }

  goToUserList() {
    this.router.navigate(['/users']);
  }
}