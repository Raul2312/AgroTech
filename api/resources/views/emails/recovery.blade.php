<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { margin: 0; padding: 0; background-color: #f4f7f6; }
        .wrapper { width: 100%; table-layout: fixed; background-color: #f4f7f6; padding-bottom: 40px; }
        .main-card {
            max-width: 450px;
            margin: 40px auto;
            background: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0,0,0,0.05);
            font-family: 'Segoe UI', Helvetica, Arial, sans-serif;
            border: 1px solid #eef2f1;
        }
        .header {
            background: linear-gradient(135deg, #22c55e, #15803d);
            padding: 30px;
            text-align: center;
            color: white;
        }
        .header h1 { margin: 0; font-size: 24px; font-weight: 700; letter-spacing: 1px; }
        .content { padding: 40px 30px; text-align: center; color: #334155; }
        .content p { line-height: 1.6; font-size: 15px; margin-bottom: 25px; }
        .code-box {
            background: #f0fdf4;
            border: 2px dashed #22c55e;
            padding: 20px;
            border-radius: 12px;
            display: inline-block;
            margin: 10px 0;
        }
        .code-text {
            font-size: 36px;
            font-weight: 800;
            color: #15803d;
            letter-spacing: 8px;
            font-family: monospace;
        }
        .security-note {
            font-size: 13px;
            color: #94a3b8;
            margin-top: 30px;
            padding: 20px;
            border-top: 1px solid #f1f5f9;
        }
        .footer {
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #94a3b8;
        }
    </style>
</head>
<body>
    <div class="wrapper">
        <div class="main-card">
            <div class="header">
                <h1>AgroTech</h1>
            </div>
            <div class="content">
                <h2 style="color: #1e293b; margin-top: 0;">¿Olvidaste tu contraseña?</h2>
                <p>No te preocupes, Raúl. Hemos recibido una solicitud para restablecer tu cuenta. Utiliza el siguiente código de verificación:</p>
                
                <div class="code-box">
                    <span class="code-text">{{ $codigo }}</span>
                </div>

                <p style="margin-top: 25px;">Este código tiene una validez de 15 minutos por motivos de seguridad.</p>
                
                <div class="security-note">
                    Si tú no realizaste esta solicitud, puedes ignorar este mensaje de forma segura. Tu contraseña seguirá siendo la misma.
                </div>
            </div>
        </div>
        <div class="footer">
            © 2026 AgroTech - Gestión Agrícola Inteligente<br>
            Este es un correo automático, por favor no respondas a este mensaje.
        </div>
    </div>
</body>
</html>