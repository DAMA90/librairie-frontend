// Utilisé pour la connexion
export class Users {
  id?: number;
  nom: string | undefined;
  email: string | undefined;
  motDepasse: string | undefined;
  roles: string[] | undefined;
  commentaires: string[] | undefined;
  password: string | undefined;
}
