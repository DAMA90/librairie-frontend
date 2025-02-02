import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Category } from "../_models/category";
import { CategoryService } from "../_service/category.service";

@Component({
  selector: "app-category-list",
  templateUrl: "./category-list.component.html",
  styleUrls: ["./category-list.component.css"],
})
export class CategoryListComponent implements OnInit {
  categories: Category[] = [];

  constructor(
    private categoryService: CategoryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getCategories();
  }

  private getCategories() {
    this.categoryService.getCategoryList().subscribe(
      (data) => {
        this.categories = data;
      },
      (error) => {
        console.error("Erreur lors du chargement des catégories:", error);
      }
    );
  }

  updateCategory(id: number) {
    this.router.navigate(["update-category", id]);
  }

  deleteCategory(id: number) {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette catégorie ?")) {
      this.categoryService.deleteCategory(id).subscribe(
        (data) => {
          this.getCategories();
        },
        (error) => {
          console.error("Erreur lors de la suppression:", error);
        }
      );
    }
  }
}
