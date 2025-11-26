<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Criar usuário apenas se não existir
        User::firstOrCreate(
            ['email' => 'jose@example.com'], // condição
            [
                'username' => 'Jose Alberto',
                'perfil' => 'Administrador',
                'password' => Hash::make('12345678'),
            ]
        );

        // Opcional: criar mais 10 usuários fake
        // User::factory(10)->create();
    }
}
