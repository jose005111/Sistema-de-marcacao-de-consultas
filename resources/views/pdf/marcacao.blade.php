<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Comprovativo de Marcação</title>
    <style>
        body {
            font-family: DejaVu Sans, sans-serif;
            color: #333;
            margin: 0;
            padding: 0;
        }

        .container {
            width: 90%;
            margin: auto;
            padding: 20px;
            /* border: 1px solid #ccc;
            border-radius: 10px; */
            position: relative;
            min-height: 500px; /* garante espaço para o rodapé */
        }

        /* Cabeçalho */
        .header {
            text-align: center;
            margin-bottom: 30px;
        }

        .header img {
            width: 120px;
            margin-bottom: 10px;
        }

        .header h2 {
            margin: 0;
            font-size: 24px;
            color: #0d6efd;
        }

        .header p {
            margin: 5px 0 0 0;
            font-size: 16px;
            color: #555;
        }

        /* Seção de dados */
        .section {
            margin-bottom: 20px;
        }

        .section h3 {
            font-size: 18px;
            border-bottom: 2px solid #0d6efd;
            padding-bottom: 5px;
            margin-bottom: 10px;
            color: #0d6efd;
        }

        .row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #eee;
        }

        .row:last-child {
            border-bottom: none;
        }

        .label {
            font-weight: bold;
        }

        .value {
            text-align: right;
        }

        /* Rodapé */
        .footer {
            position: absolute;
            bottom: 20px;
            left: 20px;
            right: 20px;
            border-top: 2px solid #0d6efd;
            padding-top: 10px;
            font-size: 12px;
            color: #555;
            display: flex;
            flex-direction: column;
            gap: 3px;
        }

        .footer span {
            display: inline-block;
        }
    </style>
</head>
<body>

<div class="container">

    <!-- Cabeçalho -->
    <div class="header">
        <img src="{{ public_path('assets/logo.png') }}" alt="Logo da Clínica">
        <h2>Consultório médico MAET</h2>
        <p>Comprovativo de Marcação</p>
    </div>

    <!-- Dados da marcação -->
    <div class="section">
        <h3>Dados da Marcação</h3>
        <div class="row">
            <span class="label">Paciente:</span>
            <span class="value">{{ $marcacao->paciente->nome }}</span>
        </div>
        <div class="row">
            <span class="label">Médico:</span>
            <span class="value">{{ $marcacao->medico->nome }}</span>
        </div>
        <div class="row">
            <span class="label">Especialidade:</span>
            <span class="value">{{ $marcacao->medico->especialidade->nome }}</span>
        </div>
        <div class="row">
            <span class="label">Data:</span>
            <span class="value">{{ \Carbon\Carbon::parse($marcacao->vaga->data)->format('d/m/Y') }}</span>
        </div>
        <div class="row">
            <span class="label">Hora:</span>
            <span class="value">{{ $marcacao->horario->hora }}</span>
        </div>
        <div class="row">
            <span class="label">Estado:</span>
            <span class="value">{{ $marcacao->estado }}</span>
        </div>
    </div>

    <!-- Rodapé -->
    <div class="footer">
       <span>Telefone: 940747408 - 991747408</span>
<span>Instagram: @meet_centro_medico</span>
<span>Email: centromedicomaet@gmail.com</span>
<span>Endereço: Lobito, Bairro da Caponte</span>

    </div>

</div>

</body>
</html>
