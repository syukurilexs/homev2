import { Component, input, output } from '@angular/core';
import { MatCard } from '@angular/material/card';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { MatMiniFabButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatDivider } from '@angular/material/divider';

@Component({
  selector: 'app-edit-list',
  standalone: true,
  imports: [
    MatCard,
    MatMiniFabButton,
    MatIcon,
    MatDivider,
    AsyncPipe,
    JsonPipe,
  ],
  templateUrl: './edit-list.component.html',
  styleUrl: './edit-list.component.scss',
})
export class EditListComponent {
  input = input<Partial<{ name: string; id: number }>[]>([]);
  info = output<number>();
  edit = output<number>();
  remove = output<number>();

  constructor() {}

  onDelete(data: Partial<{ id: number }>) {
    this.remove.emit(data.id || -1);
  }

  onEdit(data: Partial<{ id: number }>) {
    this.edit.emit(data.id || -1);
  }

  onInfo(data: Partial<{ id: number }>) {
    this.info.emit(data.id || -1);
  }
}
