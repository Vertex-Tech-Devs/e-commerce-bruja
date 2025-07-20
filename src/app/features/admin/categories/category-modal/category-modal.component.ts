import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { Category } from '@core/models/category.model';

@Component({
  selector: 'app-category-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './category-modal.component.html',
})
export class CategoryModalComponent implements OnInit {

  public title: string = 'Nueva Categoría';
  public category?: Category;

  public onClose: Subject<{ name: string } | null> = new Subject();

  public bsModalRef = inject(BsModalRef);
  private fb = inject(FormBuilder);
  public categoryForm!: FormGroup;

  ngOnInit(): void {
    const isEditMode = !!this.category;
    if (isEditMode) {
      this.title = 'Editar Categoría';
    }

    this.categoryForm = this.fb.group({
      name: [
        this.category?.name || '',
        [Validators.required, Validators.minLength(3)],
      ],
    });
  }

  get name() {
    return this.categoryForm.get('name');
  }

  save(): void {
    if (this.categoryForm.invalid) {
      this.categoryForm.markAllAsTouched();
      return;
    }
    this.onClose.next(this.categoryForm.value);
    this.bsModalRef.hide();
  }

  cancel(): void {
    this.onClose.next(null);
    this.bsModalRef.hide();
  }
}
