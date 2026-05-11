import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('123', 10);
  await prisma.admin.create({
    data: {
      email: 'gomezukalil@gmail.com',
      password,
      name: 'Administrador',
    },
  });

  await prisma.vehicle.createMany({
    data: [
      {
        marca: 'Toyota',
        modelo: 'Corolla',
        anio: 2024,
        precio: 28500000,
        kilometros: 0,
        combustible: 'Nafta',
        transmision: 'Automática',
        color: 'Blanco',
        descripcion: 'El Toyota Corolla más nuevo del mercado, con tecnología híbrida opcional.',
        caracteristicas: 'Pantalla táctil 9", cámara de retroceso, asistentes de conducción',
        slug: 'toyota-corolla-2024',
        imagenes: JSON.stringify(['https://images.unsplash.com/photo-1621007947382-bb3c7f4f3b97?auto=format&fit=crop&w=800&q=80']),
        destacado: true,
      },
      {
        marca: 'Ford',
        modelo: 'Mustang',
        anio: 2023,
        precio: 45000000,
        kilometros: 5000,
        combustible: 'Nafta',
        transmision: 'Manual',
        color: 'Rojo',
        descripcion: 'El icónico muscle car americano con motor V8 de 5.0L.',
        caracteristicas: 'Motor V8 450cv, escape activo, diferencial deportivo',
        slug: 'ford-mustang-v8-2023',
        imagenes: JSON.stringify(['https://images.unsplash.com/photo-1584345604476-8ec5f82d661f?auto=format&fit=crop&w=800&q=80']),
        destacado: true,
      },
      {
        marca: 'Volkswagen',
        modelo: 'Golf GTI',
        anio: 2024,
        precio: 32000000,
        kilometros: 0,
        combustible: 'Nafta',
        transmision: 'Automática',
        color: 'Azul',
        descripcion: 'El hatchback deportivo por excelencia con 245cv de potencia.',
        caracteristicas: 'Motor 2.0L TSI, suspensión adaptativa, selector de modos de conducción',
        slug: 'vw-golf-gti-2024',
        imagenes: JSON.stringify(['https://images.unsplash.com/photo-1606664515524-ed2f786a0a5b?auto=format&fit=crop&w=800&q=80']),
        disponible: true,
      },
    ],
  });

  console.log('Seed completed');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
