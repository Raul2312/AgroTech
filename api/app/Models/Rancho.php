<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Rancho extends Model
{
     protected $table = 'rancho';
    protected $primaryKey = 'id_rancho';
    public $timestamps = false;

    protected $fillable = [
        'nombre',
        'ubicacion',
        'latitud',
        'longitud',
        'superficie_hectarias',
        'id_usuario',
        'fecha_registro',
        'telefono',
        'correo',
        'tipo_rancho',
        'estatus'
    ];

    public function usuario()
    {
        return $this->belongsTo(Usuario::class, 'id_usuario');
    }

    public function lotes()
    {
        return $this->hasMany(Lote::class, 'id_rancho');
    }
}
