
// test/setup.ts
import { config } from 'dotenv';

// Configurar variáveis de ambiente para teste
config({ path: '.env.test' });

// Configurações globais para os testes
beforeAll(async () => {
  // Configurações que devem ser executadas antes de todos os testes
  console.log('🧪 Iniciando configuração dos testes E2E...');
});

afterAll(async () => {
  // Limpeza após todos os testes
  console.log('🧪 Finalizando testes E2E...');
});

// Configurar timeout padrão para operações assíncronas
jest.setTimeout(30000);