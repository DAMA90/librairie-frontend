import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Users } from '../_models/users';
import { UserService } from '../_service/user.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UserListComponent implements OnInit {
  users: Users[] = [];
isUpdateMode: any;

  constructor(
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getUsers();
  }

  private getUsers() {
    this.userService.getUserList().subscribe(
      data => {
        this.users = data;
      },
      error => {
        console.error('Erreur lors du chargement des utilisateurs:', error);
      }
    );
  }

  updateUser(id: number | undefined) {
    this.router.navigate(['update-user', id]);
  }

  deleteUser(id: number | undefined) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      this.userService.deleteUser(id!).subscribe(
        data => {
          this.getUsers();
        },
        error => {
          console.error('Erreur lors de la suppression:', error);
        }
      );
    }
  }
}