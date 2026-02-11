<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Comentario extends Model
{
      protected $table = 'comentarios';
    protected $primaryKey = 'id_comentario';
    public $timestamps = false;

    protected $fillable = [
        'id_producto',
        'id_usuario',
        'comentario',
        'fecha',
        'likes'
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
