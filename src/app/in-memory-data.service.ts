import { Injectable } from '@angular/core';
import { Guest } from './guest';
import { InMemoryDbService } from 'angular-in-memory-web-api';

@Injectable({
  providedIn: 'root',
})
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    // localStorage.removeItem('guests')
    // localStorage.removeItem('foods')
    const guests: any = [
      {
        id: 1,
        name: 'Chuan',
        order: [2],
      },
      {
        id: 2,
        name: 'Danh',
        order: [3, 4],
      },
    ];
    const getLocalStoredGuests = JSON.parse(
      localStorage.getItem('guests') || '[]'
    );
    const storedGuests =
      getLocalStoredGuests.length != 0 ? getLocalStoredGuests : guests;

    const foods: any = [
      {
        id: 1,
        name: 'Gà Chiên',
      },
      {
        id: 2,
        name: 'Sườn non kho thơm',
      },
      {
        id: 3,
        name: 'Chả cá xào thơm',
      },
      {
        id: 4,
        name: 'Đậu hủ dồn thịt sốt cà',
      },
      {
        id: 5,
        name: 'Vịt kho gừng',
      },
      {
        id: 6,
        name: 'Cá sòng chiên tươi',
      },
      {
        id: 7,
        name: 'Lươn xào xả ớt',
      },
      {
        id: 8,
        name: 'Canh khổ qua dồn thịt',
      },
    ];
    const getLocalStoredFoods = JSON.parse(
      localStorage.getItem('foods') || '[]'
    );
    const storedFoods =
      getLocalStoredFoods.length != 0 ? getLocalStoredFoods : foods;

    return { storedGuests, storedFoods };
  }
  genId(guests: Guest[]): number {
    const id =
      guests.length > 0 ? Math.max(...guests.map((guest) => guest.id)) + 1 : 1;
    return id;
  }
}
