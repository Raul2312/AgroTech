<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Compra extends Model
{
    protected $table = 'compras';
    protected $primaryKey = 'id_compra';

    protected $fillable = [
        'id_transaccion',
        'id_producto',
        'id_comprador',
        'id_vendedor',
        'total',
        'iva'
    ];

    // Esta es la parte clave para que jale el nombre del producto
    public function producto()
    {
        // El 2do parámetro es la llave foránea en esta tabla (compras)
        // El 3er parámetro es la llave primaria en la tabla destino (productos)
        return $this->belongsTo(Producto::class, 'id_producto', 'id_productos');
    }
}