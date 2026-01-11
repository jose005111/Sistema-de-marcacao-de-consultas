<?php

namespace Database\Seeders;

use Carbon\Carbon;
use App\Models\User;
use App\Models\Horario;
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
                'role' => 'admin',
                'password' => Hash::make('12345678'),
            ]
        );

        // Opcional: criar mais 10 usuários fake
        // User::factory(10)->create();

         {
        $inicio = Carbon::createFromTime(8, 0);
        $fim = Carbon::createFromTime(18, 0);

        while ($inicio < $fim) {
            Horario::create([
                'hora' => $inicio->format('H:i'),
            ]);
            $inicio->addMinutes(30);
        }
    }
    }
}
