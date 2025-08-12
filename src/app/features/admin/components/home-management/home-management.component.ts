import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormArray } from '@angular/forms';
import { take } from 'rxjs/operators';

import { HomeContentService } from '@core/services/home-content.service';
import { SweetAlertService } from '@core/services/sweet-alert.service';
import { CategoryService } from '@core/services/category.service';
import { HeroBanner, FeaturedCategory } from '@core/models/home-content.model';
import { Category } from '@core/models/category.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './home-management.component.html',
  styleUrls: ['./home-management.component.scss']
})
export class HomeManagementComponent implements OnInit {
  private fb = inject(FormBuilder);
  private homeContentService = inject(HomeContentService);
  private sweetAlertService = inject(SweetAlertService);
  private categoryService = inject(CategoryService);

  public bannerForm!: FormGroup;
  public isSubmitting = false;
  public categories$!: Observable<Category[]>;

  ngOnInit(): void {
    this.initializeForm();
    this.loadBannerData();
    this.categories$ = this.categoryService.getCategories();
  }

  private initializeForm(): void {
    this.bannerForm = this.fb.group({
      imageUrl: ['', [Validators.required, Validators.pattern('https?://.+')]],
      title: [''],
      buttonText: [''],
      buttonLink: [''],
      featuredCategories: this.fb.array([]) // Inicializamos el FormArray vacío
    });
  }

  private loadBannerData(): void {
    this.homeContentService.getHeroBanner().pipe(take(1)).subscribe(banner => {
      if (banner) {
        this.bannerForm.patchValue(banner);
        if (banner.featuredCategories) {
          banner.featuredCategories.forEach(cat => this.addFeaturedCategory(cat));
        }
      }
    });
  }

  get imageUrl() { return this.bannerForm.get('imageUrl'); }
  get featuredCategories(): FormArray {
    return this.bannerForm.get('featuredCategories') as FormArray;
  }

  private newFeaturedCategory(category?: FeaturedCategory): FormGroup {
    return this.fb.group({
      name: [category?.name || '', Validators.required],
      imageUrl: [category?.imageUrl || '', [Validators.required, Validators.pattern('https?://.+')]]
    });
  }

  addFeaturedCategory(category?: FeaturedCategory): void {
    if (this.featuredCategories.length < 3) {
      this.featuredCategories.push(this.newFeaturedCategory(category));
    }
  }

  removeFeaturedCategory(index: number): void {
    this.featuredCategories.removeAt(index);
  }

  async onSubmit(): Promise<void> {
    if (this.bannerForm.invalid) {
      this.bannerForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    try {
      await this.homeContentService.saveHeroBanner(this.bannerForm.value);
      this.sweetAlertService.success('¡Éxito!', 'La configuración de la Home ha sido guardada.');
    } catch (error) {
      console.error('Error saving banner data:', error);
      this.sweetAlertService.error('Error', 'No se pudo guardar la configuración.');
    } finally {
      this.isSubmitting = false;
    }
  }
}
