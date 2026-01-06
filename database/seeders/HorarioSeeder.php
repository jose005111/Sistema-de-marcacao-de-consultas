<?php

namespace Database\Seeders;

use Carbon\Carbon;
use App\Models\User;
use App\Models\Horario;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class HorarioSeeder extends Seeder
{
    public function run()
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

