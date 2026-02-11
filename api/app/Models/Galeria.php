<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Galeria extends Model
{
      protected $table = 'galeria';
    protected $primaryKey = 'id_galeria';
    public $timestamps = false;

    protected $fillable = [
        'id_producto',
        'imagen'
    ];

    public function producto()
    {
        return $this->belongsTo(Producto::class, 'id_producto');
    }
}
