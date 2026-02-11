<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ganado extends Model
{
     protected $table = 'ganado';
    protected $primaryKey = 'id_ganado';
    public $timestamps = false;

    protected $fillable = [
        'numero_arete',
        'nombre',
        'raza',
        'sexo',
        'fecha_nacimiento',
        'peso_actual',
        'id_lote',
        'certificado',
        'estado'
    ];

    public function lote()
    {
        return $this->belongsTo(Lote::class, 'id_lote');
    }   
}
