<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Producto extends Model
{
     protected $table = 'productos';
    protected $primaryKey = 'id_productos';
    public $timestamps = false;

    protected $fillable = [
        'nombre',
        'descripcion',
        'precio',
        'moneda',
        'stock',
        'id_usuario',
        'fecha_publicacion',
        'imagen',
        'id_categoria',
        'estado'
    ];

    public function usuario()
    {
        return $this->belongsTo(Usuario::class, 'id_usuario');
    }

    public function categoria()
    {
        return $this->belongsTo(Categoria::class, 'id_categoria');
    }

    public function comentarios()
    {
        return $this->hasMany(Comentario::class, 'id_producto');
    }
}
