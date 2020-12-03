export interface PeriodicElement {
  id?: number;
  name?: string;
  position?: number;
  weight?: number;
  symbol?: string;
  type?: string;
}

export const ELEMENT_DATA_FIELDS = ['id', 'position', 'name', 'weight', 'symbol', 'type'];

export const ELEMENT_DATA: PeriodicElement[] = [
  {id: 0, position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H', type: 'Reactive nonmetal'},
  {id: 1, position: 2, name: 'Helium', weight: 4.0026, symbol: 'He', type: 'Noble gas'},
  {id: 2, position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li', type: 'Alkali metal'},
  {id: 3, position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be', type: 'Alkaline earth metal'},
  {id: 4, position: 5, name: 'Boron', weight: 10.811, symbol: 'B', type: 'Metalloid'},
  {id: 5, position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C', type: 'Reactive nonmetal'},
  {id: 6, position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N', type: 'Reactive nonmetal'},
  {id: 7, position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O', type: 'Reactive nonmetal'},
  {id: 8, position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F', type: 'Reactive nonmetal'},
  {id: 9, position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne', type: 'Noble gas'},
  {id: 10, position: 11, name: 'Sodium', weight: 22.99, symbol: 'Na', type:  'Alkali metal'},
  {id: 11, position: 12, name: 'Magnesium', weight: 24.3, symbol: 'Mg', type:  'Alkaline earth metal'},
  {id: 12, position: 13, name: 'Aluminium', weight: 26.98, symbol: 'Al', type:  'Post-​transition metal'},
  {id: 13, position: 14, name: 'Silicon', weight: 28.08, symbol: 'Si', type:  'Metalloid'},
  {id: 14, position: 15, name: 'Phosphorus', weight: 30.97, symbol: 'P', type:  'Reactive nonmetal'},
  {id: 15, position: 16, name: 'Sulfur', weight: 32.06, symbol: 'S', type:  'Reactive nonmetal'},
  {id: 16, position: 17, name: 'Chlorine', weight: 35.45, symbol: 'Cl', type:  'Reactive nonmetal'},
  {id: 17, position: 18, name: 'Argon', weight: 39.95, symbol: 'Ar', type:  'Noble gas'},
  {id: 18, position: 19, name: 'Potassium', weight: 39.09, symbol: 'K', type:  'Alkali metal'},
  {id: 19, position: 20, name: 'Calcium', weight: 40.07, symbol: 'Ca', type:  'Alkaline earth metal'},

  {id: 20, position: 21, name: 'Scandium', weight: 44.95, symbol: 'Sc', type:  'Transition metal'},
  {id: 21, position: 22, name: 'Titanium', weight: 47.86, symbol: 'Ti', type:  'Transition metal'},
  {id: 22, position: 23, name: 'Vanadium', weight: 50.94, symbol: 'V', type:  'Transition metal'},
  {id: 23, position: 24, name: 'Chromium', weight: 51.996, symbol: 'Cr', type:  'Transition metal'},

  {id: 24, position: 57, name: 'Lanthanum', weight: 138.91, symbol: 'La', type:  'Lanthanide'},
  {id: 25, position: 58, name: 'Cerium', weight: 140.12, symbol: 'Ce', type:  'Lanthanide'},
  {id: 26, position: 59, name: 'Praseodymium', weight: 140.91, symbol: 'Pr', type:  'Lanthanide'},
  {id: 27, position: 60, name: 'Neodymium', weight: 144.24, symbol: 'Nd', type:  'Lanthanide'},
  {id: 28, position: 61, name: 'Promethium', weight: 145, symbol: 'Pm', type:  'Lanthanide'},

  {id: 24, position: 98, name: 'Actinium', weight: 227, symbol: 'Ac', type:  'Actinide'},
  {id: 30, position: 90, name: 'Thorium', weight: 232.04, symbol: 'Th', type:  'Actinide'},
  {id: 31, position: 91, name: 'Protactinium', weight: 231.04, symbol: 'Pa', type:  'Actinide'},
  {id: 32, position: 92, name: 'Uranium', weight: 238.03, symbol: 'U', type:  'Actinide'},
  {id: 34, position: 93, name: 'Neptunium', weight: 237, symbol: 'Np', type:  'Actinide'},
];

export const ELEMENT_TYPES: string[] = ['Reactive nonmetal', 'Noble gas', 'Alkali metal', 'Alkaline earth metal', 'Metalloid'];
