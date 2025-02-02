import { Component, OnInit } from "@angular/core";
import { forkJoin } from "rxjs";
import { map, switchMap } from "rxjs/operators";
import { BooksService } from "../_service/books.service";
import { UserAuthService } from "../_service/user-auth.service";

interface Emprunt {
  id: number;
  reservation: string; // URL de la réservation
  dateEmprunt: string;
  dateRetourPrevue: string;
  dateRetourReelle?: string;
  reservationDetails?: {
    id: number;
    livre: {
      id: number;
      titre: string;
      description: string;
    };
    utilisateur: {
      id: number;
      nom: string;
    };
  };
}

@Component({
  selector: "app-return-book",
  templateUrl: "./return-book.component.html",
  styleUrls: ["./return-book.component.css"],
})
export class ReturnBookComponent implements OnInit {
  emprunts: Emprunt[] = [];
  loading = true;
  currentUserId: number;
  isCommentDialogOpen = false;
  selectedEmprunt: {
    empruntId: number;
    reservationId: number;
    bookTitle: string;
  } | null = null;

  constructor(
    private booksService: BooksService,
    private userAuthService: UserAuthService
  ) {
    this.currentUserId = this.userAuthService.getUserId();
  }

  ngOnInit(): void {
    this.loadEmprunts();
  }

  private loadEmprunts() {
    this.loading = true;
    this.booksService.getEmprunts().subscribe(
      (emprunts) => {
        // Filtrer les emprunts actifs (pas encore retournés)
        const activeEmprunts = emprunts.filter(
          (emprunt) => !emprunt.dateRetourReelle
        );

        // Pour chaque emprunt, charger les détails de la réservation
        const detailsRequests = activeEmprunts.map((emprunt) => {
          const reservationId = parseInt(
            emprunt.reservation.split("/").pop() || "0"
          );

          return this.booksService.getReservations().pipe(
            map((reservations) => {
              const reservation = reservations.find(
                (r) => r.id === reservationId
              );
              if (!reservation)
                throw new Error(`Réservation ${reservationId} non trouvée`);

              // Extraire les IDs des URLs
              const livreId = parseInt(
                reservation.livre.split("/").pop() || "0"
              );
              const utilisateurId = parseInt(
                reservation.utilisateur.split("/").pop() || "0"
              );

              // Ne charger que les réservations de l'utilisateur courant
              if (utilisateurId !== this.currentUserId) {
                return null;
              }

              // Charger les détails du livre et de l'utilisateur
              return forkJoin({
                livre: this.booksService.getBooksById(livreId),
                utilisateur: this.booksService.getUserById(utilisateurId),
              }).pipe(
                map((details) => ({
                  ...emprunt,
                  reservationDetails: {
                    id: reservation.id,
                    livre: details.livre,
                    utilisateur: details.utilisateur,
                  },
                }))
              );
            }),
            switchMap((obs) => (obs ? obs : []))
          );
        });

        if (detailsRequests.length > 0) {
          forkJoin(detailsRequests.filter(Boolean)).subscribe(
            (detailedEmprunts) => {
              this.emprunts = detailedEmprunts.filter(Boolean);
              this.loading = false;
            },
            (error) => {
              console.error("Erreur lors du chargement des détails:", error);
              this.loading = false;
            }
          );
        } else {
          this.emprunts = [];
          this.loading = false;
        }
      },
      (error) => {
        console.error("Erreur lors du chargement des emprunts:", error);
        this.loading = false;
      }
    );
  }

  initiateReturn(empruntId: number, reservationId: number, bookTitle: string) {
    this.selectedEmprunt = { empruntId, reservationId, bookTitle };
    this.isCommentDialogOpen = true;
  }

  handleCommentSubmit(comment: string) {
    if (!this.selectedEmprunt) return;

    const emprunt = this.emprunts.find(
      (e) => e.id === this.selectedEmprunt?.empruntId
    );
    if (!emprunt?.reservationDetails?.livre?.id) return;

    const commentData = {
      description: comment,
      livreId: emprunt.reservationDetails.livre.id,
      utilisateurId: this.currentUserId,
    };

    var tempEmprunt = this.selectedEmprunt;
    this.booksService.createComment(commentData).subscribe(
      () => {
        this.completeBookReturn(tempEmprunt);
      },
      (error) => {
        console.error("Erreur lors de la création du commentaire:", error);
        alert("Erreur lors de la création du commentaire");
      }
    );
  }

  private completeBookReturn(tempEmprunt: any) {
    this.selectedEmprunt = tempEmprunt;
    this.booksService.returnEmprunt(this.selectedEmprunt!.empruntId).subscribe(
      () => {
        this.booksService
          .deleteReservation(this.selectedEmprunt!.reservationId)
          .subscribe(
            () => {
              alert("Livre retourné avec succès !");
              this.loadEmprunts();
              this.closeCommentDialog();
            },
            (error) => {
              console.error(
                "Erreur lors de la suppression de la réservation:",
                error
              );
            }
          );
      },
      (error) => {
        console.error("Erreur lors du retour du livre:", error);
        alert("Erreur lors du retour du livre");
      }
    );
  }

  closeCommentDialog() {
    this.isCommentDialogOpen = false;
    this.selectedEmprunt = null;
  }

  calculateDaysLeft(returnDate: string): number {
    const today = new Date();
    const returnDay = new Date(returnDate);
    const diffTime = returnDay.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 3600 * 24));
  }

  isLate(returnDate: string): boolean {
    return this.calculateDaysLeft(returnDate) < 0;
  }
}
