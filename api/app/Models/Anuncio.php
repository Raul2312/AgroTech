<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Anuncio extends Model
{
    protected $table = 'anuncios';
    protected $primaryKey = 'id_anuncios';
    public $timestamps = false;

    protected $fillable = [
        'id_empresa',
        'fecha_inicio',
        'fecha_fin',
        'precio',
        'id_usuario'
    ];

    public function empresa()
    {
        return $this->belongsTo(Empresa::class, 'id_empresa');
    }

    public function usuario()
    {
        return $this->belongsTo(Usuario::class, 'id_usuario');
    }
}
