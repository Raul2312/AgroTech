<!DOCTYPE html>
<html>
<head>
    <style>
        .card {
            max-width: 400px;
            margin: 20px auto;
            padding: 30px;
            background: #f9f9f9;
            border-radius: 20px;
            font-family: sans-serif;
            text-align: center;
            border: 1px solid #e2e8f0;
        }
        .logo { width: 80px; margin-bottom: 20px; }
        .code {
            font-size: 32px;
            font-weight: 800;
            letter-spacing: 5px;
            color: #22c55e;
            background: #f0fdf4;
            padding: 15px;
            border-radius: 10px;
            display: inline-block;
            margin: 20px 0;
        }
        .footer { font-size: 12px; color: #64748b; margin-top: 20px; }
    </style>
</head>
<body>
    <div class="card">
        <h2>AgroTech</h2>
        <p>Has solicitado restablecer tu contraseña. Usa el siguiente código:</p>
        <div class="code">{{ $codigo }}</div>
        <p>Este código expirará pronto. Si no solicitaste esto, ignora este correo.</p>
        <div class="footer">© 2026 AgroTech - Gestión Agrícola Inteligente</div>
    </div>
</body>
</html>