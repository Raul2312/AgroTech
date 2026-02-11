<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Like extends Model
{
     protected $table = 'likes';
    protected $primaryKey = 'id_like';
    public $timestamps = false;

    protected $fillable = [
        'id_producto',
        'id_usuario'
    ];

    public function producto()
    {
        return $this->belongsTo(Producto::class, 'id_producto');
    }

    public function usuario()
    {
        return $this->belongsTo(Usuario::class, 'id_usuario');
    }
}
