import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ProductsService } from '../../../services/products';
import { AuthService } from '../../../../auth/auth';
import { Product } from '../../../interfaces/product.interface';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CardModule, ChartModule, TableModule, ButtonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  private productsService = inject(ProductsService);
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  //Variables para los KPIs
  totalProducts: number = 0;
  totalUsers: number = 0;
  lowStockCount: number = 0;
  totalInventoryValue: number = 0;

  //Variables para Gráficos
  chartData: any;
  chartOptions: any;
  pieData: any;
  pieOptions: any;

  //Lista para la tabla resumen
  recentProducts: Product[] = [];

  ngOnInit() {
    this.loadDashboardData();
    this.initChartOptions();
  }

  loadDashboardData() {
  //Usamos forkJoin para unir las peticiones
  forkJoin({
    products: this.productsService.getProducts(),
    users: this.authService.getAllUsers()
  }).subscribe({
    next: (results) => {
      //Extraemos los resultados
      const products = results.products;
      const users = results.users;

      //Lógica de Productos
      this.totalProducts = products.length;
      this.lowStockCount = products.filter((p: any) => p.stock < 10).length;
      this.totalInventoryValue = products.reduce((acc: number, p: any) => acc + (p.price * p.stock), 0);
      this.recentProducts = products.slice(-5).reverse();
      this.setupBarChart(products);

      //Lógica de Usuarios
      this.totalUsers = users.length;

      //Actualizamos la vista una sola vez al final
      this.cdr.detectChanges();
    },
    error: (err) => {
      console.error('Error cargando datos del dashboard', err);
    }
  });
}

  setupBarChart(products: Product[]) {
    //Agrupar productos por categoría para el gráfico
    const categories: any = {};
    products.forEach(p => {
      if (!categories[p.category]) categories[p.category] = 0;
      categories[p.category] += p.stock; //Sumamos stock por categoría
    });

    this.chartData = {
      labels: Object.keys(categories),
      datasets: [
        {
          label: 'Stock por Categoría',
          data: Object.values(categories),
          backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'],
          borderRadius: 5
        }
      ]
    };
  }

  initChartOptions() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.chartOptions = {
        plugins: {
            legend: { labels: { color: textColor } }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: { color: textColorSecondary },
                grid: { color: surfaceBorder, drawBorder: false }
            },
            x: {
                ticks: { color: textColorSecondary },
                grid: { color: surfaceBorder, drawBorder: false }
            }
        }
    };
  }
}
