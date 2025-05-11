export interface Student {
  name: string;
  preferences: { [weight: number]: string };
  gender?: 'male' | 'female' | null; // optional
}
