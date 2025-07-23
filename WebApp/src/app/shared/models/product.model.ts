/**
 * @interface Product
 * @description Define a estrutura de dados para um produto.
 */
export interface Product {
  id: string;
  code: string;
  description: string;
  departmentCode: string;
  price: number;
  status: boolean;
  departmentDescription: string;
}