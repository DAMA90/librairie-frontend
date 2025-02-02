import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Category } from "../_models/category";
import { CategoryService } from "../_service/category.service";

@Component({
  selector: "app-category-form",
  templateUrl: "./category-form.component.html",
  styleUrls: ["./category-form.component.css"],
})
export class CategoryFormComponent implements OnInit {
  category: Category = {
    id: 0,
    description: "",
  };

  isUpdateMode = false;
  categoryId?: number;

  constructor(
    private categoryService: CategoryService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.categoryId = this.route.snapshot.params["id"];
    this.isUpdateMode = !!this.categoryId;

    if (this.isUpdateMode && this.categoryId) {
      this.categoryService.getCategoryById(this.categoryId).subscribe(
        (data) => {
          this.category = data;
        },
        (error) => {
          console.error("Erreur lors du chargement de la catégorie:", error);
        }
      );
    }
  }

  onSubmit() {
    if (this.isUpdateMode && this.categoryId) {
      this.categoryService
        .updateCategory(this.categoryId, this.category)
        .subscribe(
          (data) => {
            this.goToCategoryList();
          },
          (error) => {
            console.error("Erreur lors de la mise à jour:", error);
          }
        );
    } else {
      this.categoryService.createCategory(this.category).subscribe(
        (data) => {
          this.goToCategoryList();
        },
        (error) => {
          console.error("Erreur lors de la création:", error);
        }
      );
    }
  }

  onCancel() {
    this.goToCategoryList();
  }

  goToCategoryList() {
    this.router.navigate(["/categories"]);
  }
}
