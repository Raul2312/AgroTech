<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Lote extends Model
{
     protected $table = 'lote';
    protected $primaryKey = 'id_lote';
    public $timestamps = false;

    protected $fillable = [
        'nombre',
        'id_rancho',
        'tipo_terreno',
        'estado',
        'fecha_creacion',
        'capacidad_maxima',
        'cantidad_actual',
        'proposito',
        'descripcion'
    ];

    public function rancho()
    {
        return $this->belongsTo(Rancho::class, 'id_rancho');
    }

    public function ganado()
    {
        return $this->hasMany(Ganado::class, 'id_lote');
    }
}
